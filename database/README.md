# Database Setup Guide

## Setting up the Supabase Database

### 1. Create the Schema

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script to create all tables, indexes, and policies

### 2. Seed Data (Optional)

After creating the schema, you can run the seed data script to populate the database with sample data:

1. Copy the contents of `database/seed-data.sql`
2. Run it in the Supabase SQL Editor

### 3. Storage Setup

For file uploads, you'll need to create a storage bucket:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `meeting-documents`
3. Set the bucket policies for authenticated users:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'meeting-documents');

-- Allow users to view files from meetings they're involved in
CREATE POLICY "Users can view meeting documents" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'meeting-documents');

-- Allow users to delete their own uploaded files
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'meeting-documents' AND owner = auth.uid());
```

### 4. Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Testing the Setup

You can test the database connection by:

1. Running the Next.js app: `npm run dev`
2. Navigating to `/api/dashboard?profile_id=test-user-id`
3. You should see an empty response with the expected structure

## Table Relationships

```
profiles
├── contacts (1:many)
├── calendar_slots (1:many)
├── meetings (1:many as organizer)
├── meeting_participants (many:many with meetings)
├── followups (1:many as assigned_to)
├── followups (1:many as created_by)
├── documents (1:many as uploader)
└── notifications (1:many)

meetings
├── meeting_participants (1:many)
├── agenda_items (1:many)
├── prep_notes (1:many)
├── meeting_notes (1:many)
├── decisions (1:many)
├── followups (1:many)
└── documents (1:many)
```

## Key Features

- **Row Level Security**: All tables have RLS enabled with appropriate policies
- **Soft Deletes**: Meetings are cancelled rather than deleted to preserve history
- **Audit Trail**: Created/updated timestamps on all relevant tables
- **Performance**: Indexes on frequently queried columns
- **Data Integrity**: Foreign key constraints and check constraints
- **Flexible Schema**: JSONB fields for extensible configuration