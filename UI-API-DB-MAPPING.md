# UI → API → DB Complete Mapping for Meetup-Buddy

This document provides a comprehensive mapping between UI components, API endpoints, and database tables for the meetup-buddy application.

## **Architecture Overview**

```
Frontend Components → API Routes → Database Tables
        ↓              ↓            ↓
    React/Next.js → /api/* → Supabase/PostgreSQL
```

---

## **1. Scheduling (Auto-slot finder)**

### **UI Components**
- `components/scheduling/CalendarGrid.tsx` - Weekly/monthly view
- `components/scheduling/SlotSuggestionCard.tsx` - Available time recommendations
- `components/scheduling/ConfirmSlotButton.tsx` - Booking confirmation
- `components/scheduling/SchedulingTable.tsx` - List view of slots

### **API Routes**
- `GET /api/slots` - Fetch available slots
- `POST /api/slots` - Create new slot
- `PUT /api/slots/[id]` - Update slot
- `DELETE /api/slots/[id]` - Remove slot

### **Database Tables**
```sql
-- Calendar slots with user availability
calendar_slots (
  id: uuid PRIMARY KEY,
  profile_id: uuid → profiles.id,
  start_time: timestamptz,
  end_time: timestamptz,
  status: enum('available', 'busy', 'tentative'),
  created_at: timestamptz
)
```

### **Data Flow**
UI requests slots → API queries calendar_slots by profile_id → Returns intersected available times

---

## **2. Agenda (Pre-meeting preparation)**

### **UI Components**
- `components/agenda/AgendaCard.tsx` - Meeting agenda items
- `components/agenda/PastNotesAccordion.tsx` - Historical context
- `components/agenda/SalesContextBadge.tsx` - Deal/opportunity tags
- `components/agenda/PrepChecklist.tsx` - Meeting preparation tasks

### **API Routes**
- `GET /api/agenda/[meetingId]` - Fetch meeting agenda
- `POST /api/agenda` - Create agenda item
- `PUT /api/agenda/[id]` - Update agenda item
- `GET /api/prep-notes/[meetingId]` - Get preparation notes

### **Database Tables**
```sql
-- Meeting records
meetings (
  id: uuid PRIMARY KEY,
  title: varchar(255),
  description: text,
  start_time: timestamptz,
  end_time: timestamptz,
  location: varchar(255),
  profile_id: uuid → profiles.id,
  status: enum('scheduled', 'in-progress', 'completed', 'cancelled'),
  created_at: timestamptz
)

-- Meeting preparation notes
prep_notes (
  id: uuid PRIMARY KEY,
  meeting_id: uuid → meetings.id,
  content: text,
  author_id: uuid → profiles.id,
  created_at: timestamptz
)

-- Agenda items
agenda_items (
  id: uuid PRIMARY KEY,
  meeting_id: uuid → meetings.id,
  title: varchar(255),
  description: text,
  duration_minutes: integer,
  order_index: integer,
  presenter_id: uuid → profiles.id
)
```

### **Data Flow**
UI loads agenda → API joins meetings + prep_notes + followups → Returns comprehensive meeting context

---

## **3. Follow-ups (Task management)**

### **UI Components**
- `components/followups/TaskTable.tsx` - Main task list
- `components/followups/AddTaskForm.tsx` - New task creation
- `components/followups/TaskStatusBadge.tsx` - Status indicators
- `components/followups/AssigneeSelector.tsx` - Task assignment

### **API Routes**
- `GET /api/followups` - List all follow-up tasks
- `GET /api/followups?meeting_id=[id]` - Tasks for specific meeting
- `POST /api/followups` - Create new task
- `PUT /api/followups/[id]` - Update task status/details
- `DELETE /api/followups/[id]` - Remove task

### **Database Tables**
```sql
-- Follow-up tasks
followups (
  id: uuid PRIMARY KEY,
  meeting_id: uuid → meetings.id,
  title: varchar(255),
  description: text,
  assigned_to: uuid → profiles.id,
  created_by: uuid → profiles.id,
  due_date: date,
  status: enum('pending', 'in-progress', 'completed', 'overdue'),
  priority: enum('low', 'medium', 'high', 'urgent'),
  created_at: timestamptz,
  completed_at: timestamptz
)
```

### **Data Flow**
UI manages tasks → API CRUD operations on followups → Links to meetings and profiles

---

## **4. During Meeting (Live notes capture)**

### **UI Components**
- `components/notes/LiveNoteEditor.tsx` - Rich text editor
- `components/notes/DecisionCard.tsx` - Key decisions capture
- `components/notes/QuickActionButtons.tsx` - Assign follow-up, add contact
- `components/notes/ParticipantActions.tsx` - Speaking time, participation

### **API Routes**
- `GET /api/notes/[meetingId]` - Fetch meeting notes
- `POST /api/notes` - Create/update note entry
- `PUT /api/notes/[id]` - Edit existing note
- `POST /api/notes/decisions` - Log key decisions

### **Database Tables**
```sql
-- Meeting notes
meeting_notes (
  id: uuid PRIMARY KEY,
  meeting_id: uuid → meetings.id,
  content: text,
  note_type: enum('general', 'decision', 'action-item', 'question'),
  author_id: uuid → profiles.id,
  timestamp: timestamptz,
  created_at: timestamptz
)

-- Key decisions made during meetings
decisions (
  id: uuid PRIMARY KEY,
  meeting_id: uuid → meetings.id,
  title: varchar(255),
  description: text,
  decided_by: uuid → profiles.id,
  impact: enum('low', 'medium', 'high'),
  created_at: timestamptz
)
```

### **Data Flow**
User writes notes → API posts to meeting_notes → Associated with meeting and author

---

## **5. Post-meeting Reminders (Notifications)**

### **UI Components**
- `components/notifications/AlertBanner.tsx` - Urgent notifications
- `components/notifications/NotificationToast.tsx` - Real-time alerts
- `components/notifications/TrustScoreProgress.tsx` - Relationship scoring
- `components/notifications/RemindersList.tsx` - Upcoming deadlines

### **API Routes**
- `GET /api/notifications` - Fetch user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/[id]/read` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count

### **Database Tables**
```sql
-- User notifications
notifications (
  id: uuid PRIMARY KEY,
  profile_id: uuid → profiles.id,
  title: varchar(255),
  message: text,
  type: enum('reminder', 'overdue', 'meeting-started', 'followup-assigned'),
  is_read: boolean DEFAULT false,
  related_id: uuid, -- meeting_id, followup_id, etc.
  related_type: varchar(50),
  scheduled_for: timestamptz,
  created_at: timestamptz
)
```

### **Data Flow**
API feeds unread notifications → UI shows real-time alerts and overdue items

---

## **6. Documents (File attachments)**

### **UI Components**
- `components/documents/FileUploader.tsx` - Drag & drop upload
- `components/documents/AttachmentsList.tsx` - Meeting file list
- `components/documents/DocumentPreview.tsx` - File preview modal
- `components/documents/ShareButton.tsx` - Document sharing

### **API Routes**
- `GET /api/documents?meeting_id=[id]` - Meeting documents
- `POST /api/documents/upload` - Upload file
- `GET /api/documents/[id]/download` - Download file
- `DELETE /api/documents/[id]` - Remove document

### **Database Tables**
```sql
-- Document metadata
documents (
  id: uuid PRIMARY KEY,
  meeting_id: uuid → meetings.id,
  profile_id: uuid → profiles.id, -- uploader
  filename: varchar(255),
  file_size: bigint,
  mime_type: varchar(100),
  storage_path: varchar(500), -- Supabase Storage path
  uploaded_at: timestamptz
)
```

### **Data Flow**
UI uploads file → API stores metadata in DB + file in Supabase Storage → Links to meeting + uploader

---

## **7. Participants Management**

### **UI Components**
- `components/participants/AvatarList.tsx` - Meeting attendees
- `components/participants/RoleSelector.tsx` - Participant roles
- `components/participants/InviteForm.tsx` - Add new participants
- `components/participants/AttendanceTracker.tsx` - Who attended

### **API Routes**
- `GET /api/meetings/[id]/participants` - Meeting attendees
- `POST /api/participants` - Add participant
- `PUT /api/participants/[id]` - Update role/status
- `DELETE /api/participants/[id]` - Remove participant

### **Database Tables**
```sql
-- Meeting participants (junction table)
meeting_participants (
  id: uuid PRIMARY KEY,
  meeting_id: uuid → meetings.id,
  profile_id: uuid → profiles.id,
  role: enum('organizer', 'required', 'optional', 'presenter'),
  attendance_status: enum('invited', 'accepted', 'declined', 'tentative', 'attended'),
  invited_at: timestamptz,
  responded_at: timestamptz
)
```

### **Data Flow**
UI updates attendees → API modifies meeting_participants → Links meetings to profiles

---

## **8. Profiles (User settings)**

### **UI Components**
- `components/profile/ProfileForm.tsx` - User details editing
- `components/profile/SettingsDrawer.tsx` - Preferences panel
- `components/profile/ContactsList.tsx` - Personal contacts
- `components/profile/CalendarSync.tsx` - External calendar integration

### **API Routes**
- `GET /api/profiles/me` - Current user profile
- `PUT /api/profiles/me` - Update profile
- `GET /api/contacts` - User's contacts
- `POST /api/contacts` - Add new contact

### **Database Tables**
```sql
-- User profiles
profiles (
  id: uuid PRIMARY KEY,
  email: varchar(255) UNIQUE,
  full_name: varchar(255),
  avatar_url: varchar(500),
  timezone: varchar(50),
  calendar_settings: jsonb,
  created_at: timestamptz,
  updated_at: timestamptz
)

-- Personal contacts
contacts (
  id: uuid PRIMARY KEY,
  profile_id: uuid → profiles.id,
  name: varchar(255),
  email: varchar(255),
  phone: varchar(50),
  company: varchar(255),
  notes: text,
  created_at: timestamptz
)
```

### **Data Flow**
UI updates profile → API writes to profiles + related contacts

---

## **9. Meeting Lifecycle (Core meeting management)**

### **UI Components**
- `components/meetings/MeetingCard.tsx` - Overview cards
- `components/meetings/StatusBadge.tsx` - Meeting status
- `components/meetings/CreateMeetingModal.tsx` - New meeting form
- `components/meetings/MeetingDetails.tsx` - Full meeting view

### **API Routes**
- `GET /api/meetings` - List user's meetings
- `POST /api/meetings` - Create new meeting
- `GET /api/meetings/[id]` - Meeting details
- `PUT /api/meetings/[id]` - Update meeting
- `DELETE /api/meetings/[id]` - Cancel meeting

### **Database Tables**
Uses the `meetings` table defined above with full CRUD lifecycle.

### **Data Flow**
UI manages meeting lifecycle → API handles CRUD operations → Updates meetings table

---

## **10. Dashboard (Unified overview)**

### **UI Components**
- `components/dashboard/UpcomingMeetingCard.tsx` - Next meeting preview
- `components/dashboard/FollowupsWidget.tsx` - Pending tasks summary
- `components/dashboard/RemindersPanel.tsx` - Today's reminders
- `components/dashboard/TrustScoreCard.tsx` - Relationship metrics
- `components/dashboard/RecentDocuments.tsx` - Latest files

### **API Routes**
- `GET /api/dashboard` - Aggregated dashboard data
- `GET /api/dashboard/stats` - Key metrics
- `GET /api/dashboard/recent-activity` - Activity feed

### **Database Query**
```sql
-- Dashboard aggregation query
SELECT 
  m.* FROM meetings m WHERE profile_id = $1 AND start_time > NOW() LIMIT 5,
  f.* FROM followups f WHERE assigned_to = $1 AND status != 'completed' LIMIT 10,
  n.* FROM notifications n WHERE profile_id = $1 AND is_read = false LIMIT 20,
  d.* FROM documents d JOIN meetings m ON d.meeting_id = m.id WHERE m.profile_id = $1 ORDER BY uploaded_at DESC LIMIT 5
```

### **Data Flow**
API aggregates across meetings, followups, notifications, documents → UI displays unified dashboard

---

## **Chat Integration Mapping**

### **UI Components**
- `components/chat/Chat.tsx` - Main chat interface (already implemented)
- `components/chat/MessageList.tsx` - Message history
- `components/chat/message-types/*` - Different message renderers

### **API Routes**
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history` - Chat history
- `POST /api/chat/context` - Provide meeting context

### **Integration Points**
The chat component can query existing APIs:
- Meeting data via `/api/meetings`
- Follow-ups via `/api/followups`
- Calendar slots via `/api/slots`
- Documents via `/api/documents`

---

## **Implementation Strategy**

### **Phase 1: API Foundation**
1. Create all API route handlers
2. Set up database schema
3. Implement basic CRUD operations

### **Phase 2: UI Components**
1. Build each component with mock data
2. Connect to real APIs
3. Add real-time updates

### **Phase 3: Integration**
1. Connect chat to existing APIs
2. Add cross-component state management
3. Implement real-time notifications

### **Development Benefits**
- ✅ Each UI widget has clear backend binding
- ✅ Independent development of frontend/backend
- ✅ No circular dependencies
- ✅ Mock data → real API swap with no redesign
- ✅ Composable and scalable architecture

This mapping ensures every UI interaction has a clear path through the API layer to persistent storage in the database.