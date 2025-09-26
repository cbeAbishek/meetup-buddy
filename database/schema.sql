-- Meetup-Buddy Database Schema
-- This file contains all the table definitions and relationships for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE meeting_status AS ENUM ('scheduled', 'in-progress', 'completed', 'cancelled');
CREATE TYPE participant_role AS ENUM ('organizer', 'required', 'optional', 'presenter');
CREATE TYPE attendance_status AS ENUM ('invited', 'accepted', 'declined', 'tentative', 'attended');
CREATE TYPE followup_status AS ENUM ('pending', 'in-progress', 'completed', 'overdue');
CREATE TYPE followup_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE calendar_slot_status AS ENUM ('available', 'busy', 'tentative');
CREATE TYPE note_type AS ENUM ('general', 'decision', 'action-item', 'question');
CREATE TYPE notification_type AS ENUM ('reminder', 'overdue', 'meeting-started', 'followup-assigned');
CREATE TYPE decision_impact AS ENUM ('low', 'medium', 'high');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'UTC',
    calendar_settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar availability slots
CREATE TABLE calendar_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status calendar_slot_status DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Meetings
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status meeting_status DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_meeting_time CHECK (start_time < end_time)
);

-- Meeting participants (junction table)
CREATE TABLE meeting_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role participant_role DEFAULT 'required',
    attendance_status attendance_status DEFAULT 'invited',
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    UNIQUE(meeting_id, profile_id)
);

-- Agenda items
CREATE TABLE agenda_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    order_index INTEGER DEFAULT 0,
    presenter_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting preparation notes
CREATE TABLE prep_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting notes (during meeting)
CREATE TABLE meeting_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    note_type note_type DEFAULT 'general',
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key decisions
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    decided_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    impact decision_impact DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follow-up tasks
CREATE TABLE followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    due_date DATE,
    status followup_status DEFAULT 'pending',
    priority followup_priority DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Documents/attachments
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    storage_path VARCHAR(500), -- Supabase Storage path
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type notification_type DEFAULT 'reminder',
    is_read BOOLEAN DEFAULT FALSE,
    related_id UUID, -- meeting_id, followup_id, etc.
    related_type VARCHAR(50), -- 'meeting', 'followup', etc.
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_meetings_profile_id_start_time ON meetings(profile_id, start_time);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_followups_assigned_to_status ON followups(assigned_to, status);
CREATE INDEX idx_followups_due_date ON followups(due_date);
CREATE INDEX idx_notifications_profile_id_is_read ON notifications(profile_id, is_read);
CREATE INDEX idx_calendar_slots_profile_id_time ON calendar_slots(profile_id, start_time, end_time);
CREATE INDEX idx_meeting_participants_meeting_id ON meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_profile_id ON meeting_participants(profile_id);
CREATE INDEX idx_documents_meeting_id ON documents(meeting_id);
CREATE INDEX idx_agenda_items_meeting_id_order ON agenda_items(meeting_id, order_index);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can access their own data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own contacts" ON contacts FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users can manage own calendar slots" ON calendar_slots FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users can view meetings they organize or participate in" ON meetings FOR SELECT 
USING (auth.uid() = profile_id OR auth.uid() IN (
    SELECT profile_id FROM meeting_participants WHERE meeting_id = meetings.id
));

CREATE POLICY "Users can create meetings" ON meetings FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update meetings they organize" ON meetings FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can view meeting participants for meetings they're involved in" ON meeting_participants FOR SELECT
USING (auth.uid() IN (
    SELECT profile_id FROM meetings WHERE id = meeting_id
) OR auth.uid() = profile_id);

-- Additional policies for other tables...
CREATE POLICY "Users can view followups assigned to them or created by them" ON followups FOR SELECT
USING (auth.uid() = assigned_to OR auth.uid() = created_by);

CREATE POLICY "Users can create followups" ON followups FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update followups assigned to them" ON followups FOR UPDATE
USING (auth.uid() = assigned_to OR auth.uid() = created_by);

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = profile_id);

-- Views for common queries
CREATE VIEW user_upcoming_meetings AS
SELECT 
    m.*,
    COUNT(mp.profile_id) as participant_count,
    COUNT(f.id) as followup_count,
    COUNT(d.id) as document_count
FROM meetings m
LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
LEFT JOIN followups f ON m.id = f.meeting_id AND f.status != 'completed'
LEFT JOIN documents d ON m.id = d.meeting_id
WHERE m.start_time > NOW()
GROUP BY m.id
ORDER BY m.start_time ASC;

CREATE VIEW user_pending_followups AS
SELECT 
    f.*,
    m.title as meeting_title,
    m.start_time as meeting_start_time,
    p_assigned.full_name as assigned_to_name,
    p_created.full_name as created_by_name,
    CASE 
        WHEN f.due_date < CURRENT_DATE THEN 'overdue'
        WHEN f.due_date = CURRENT_DATE THEN 'due_today'
        WHEN f.due_date <= CURRENT_DATE + INTERVAL '3 days' THEN 'due_soon'
        ELSE 'future'
    END as urgency
FROM followups f
LEFT JOIN meetings m ON f.meeting_id = m.id
LEFT JOIN profiles p_assigned ON f.assigned_to = p_assigned.id
LEFT JOIN profiles p_created ON f.created_by = p_created.id
WHERE f.status != 'completed'
ORDER BY f.due_date ASC NULLS LAST;