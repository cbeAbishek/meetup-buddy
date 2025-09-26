-- Seed data for Meetup-Buddy application
-- Run this after creating the main schema

-- Insert sample profiles
INSERT INTO profiles (id, email, full_name, timezone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'alex.johnson@example.com', 'Alex Johnson', 'America/New_York'),
('550e8400-e29b-41d4-a716-446655440002', 'taylor.kim@example.com', 'Taylor Kim', 'America/Los_Angeles'),
('550e8400-e29b-41d4-a716-446655440003', 'morgan.chen@example.com', 'Morgan Chen', 'America/Chicago'),
('550e8400-e29b-41d4-a716-446655440004', 'robin.banks@example.com', 'Robin Banks', 'Europe/London'),
('550e8400-e29b-41d4-a716-446655440005', 'jordan.lee@example.com', 'Jordan Lee', 'Asia/Tokyo'),
('550e8400-e29b-41d4-a716-446655440006', 'cameron.smith@example.com', 'Cameron Smith', 'Australia/Sydney');

-- Insert sample contacts
INSERT INTO contacts (profile_id, name, email, company) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Wilson', 'sarah@acmecorp.com', 'Acme Corp'),
('550e8400-e29b-41d4-a716-446655440001', 'David Brown', 'david@techstart.io', 'TechStart'),
('550e8400-e29b-41d4-a716-446655440002', 'Lisa Garcia', 'lisa@designco.com', 'DesignCo'),
('550e8400-e29b-41d4-a716-446655440002', 'Mike Rodriguez', 'mike@salesforce.com', 'Salesforce');

-- Insert sample calendar slots
INSERT INTO calendar_slots (profile_id, start_time, end_time, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', '2025-10-01 09:00:00+00', '2025-10-01 10:00:00+00', 'available'),
('550e8400-e29b-41d4-a716-446655440001', '2025-10-01 14:00:00+00', '2025-10-01 15:30:00+00', 'busy'),
('550e8400-e29b-41d4-a716-446655440002', '2025-10-01 10:30:00+00', '2025-10-01 11:30:00+00', 'available'),
('550e8400-e29b-41d4-a716-446655440003', '2025-10-02 13:00:00+00', '2025-10-02 14:00:00+00', 'available');

-- Insert sample meetings
INSERT INTO meetings (id, title, description, start_time, end_time, location, profile_id, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Q4 Planning Session', 'Strategic planning for Q4 goals and initiatives', '2025-10-01 14:00:00+00', '2025-10-01 15:00:00+00', 'Conference Room A', '550e8400-e29b-41d4-a716-446655440001', 'scheduled'),
('660e8400-e29b-41d4-a716-446655440002', 'Product Roadmap Review', 'Review upcoming product features and timeline', '2025-10-05 10:30:00+00', '2025-10-05 11:15:00+00', 'Virtual - Zoom', '550e8400-e29b-41d4-a716-446655440002', 'scheduled'),
('660e8400-e29b-41d4-a716-446655440003', 'Weekly Standup', 'Team sync and progress updates', '2025-09-25 09:00:00+00', '2025-09-25 09:30:00+00', 'Virtual - Teams', '550e8400-e29b-41d4-a716-446655440003', 'completed'),
('660e8400-e29b-41d4-a716-446655440004', 'Client Presentation', 'Presenting new proposal to key client', '2025-10-08 15:00:00+00', '2025-10-08 16:30:00+00', 'Client Office', '550e8400-e29b-41d4-a716-446655440001', 'scheduled');

-- Insert meeting participants
INSERT INTO meeting_participants (meeting_id, profile_id, role, attendance_status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'organizer', 'accepted'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'required', 'accepted'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'required', 'tentative'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'organizer', 'accepted'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'presenter', 'accepted'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'optional', 'declined');

-- Insert agenda items
INSERT INTO agenda_items (meeting_id, title, description, duration_minutes, order_index, presenter_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Q4 Sales Projections', 'Review sales targets and forecasts', 15, 1, '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440001', 'Marketing Strategy', 'Discuss marketing campaigns for Q4', 20, 2, '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440001', 'Budget Allocation', 'Review and approve Q4 budget', 25, 3, '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440002', 'Current Sprint Status', 'Development team progress update', 10, 1, '550e8400-e29b-41d4-a716-446655440005'),
('660e8400-e29b-41d4-a716-446655440002', 'Feature Prioritization', 'Discuss upcoming feature priorities', 20, 2, '550e8400-e29b-41d4-a716-446655440006'),
('660e8400-e29b-41d4-a716-446655440002', 'Timeline Review', 'Review project milestones and deadlines', 15, 3, '550e8400-e29b-41d4-a716-446655440002');

-- Insert follow-up tasks
INSERT INTO followups (id, meeting_id, title, description, assigned_to, created_by, due_date, status, priority) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 'Update Q4 sales projections', 'Revise sales projections based on new market data', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2025-10-05', 'pending', 'high'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 'Share marketing campaign creative brief', 'Send the creative brief to the design team', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2025-10-02', 'pending', 'medium'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Send revised budget breakdown', 'Update budget document and share with stakeholders', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2025-09-25', 'overdue', 'urgent'),
('770e8400-e29b-41d4-a716-446655440004', NULL, 'Prepare client presentation slides', 'Create presentation deck for upcoming client meeting', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2025-10-07', 'in-progress', 'high'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Update project timeline', 'Adjust timeline based on resource availability', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '2025-10-10', 'pending', 'medium');

-- Insert preparation notes
INSERT INTO prep_notes (meeting_id, content, author_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Review last quarters performance metrics before discussing Q4 projections. Bring competitive analysis report.', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440001', 'Prepare marketing budget proposals and campaign ROI analysis from Q3.', '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440002', 'Gather current sprint velocity data and blockers list for the development update.', '550e8400-e29b-41d4-a716-446655440005'),
('660e8400-e29b-41d4-a716-446655440004', 'Research client background, recent news, and prepare demo environment for presentation.', '550e8400-e29b-41d4-a716-446655440001');

-- Insert meeting notes
INSERT INTO meeting_notes (meeting_id, content, note_type, author_id, timestamp) VALUES
('660e8400-e29b-41d4-a716-446655440003', 'Team completed 8/10 planned stories this sprint. Two stories blocked by API dependency.', 'general', '550e8400-e29b-41d4-a716-446655440003', '2025-09-25 09:10:00+00'),
('660e8400-e29b-41d4-a716-446655440003', 'DECISION: Prioritize API dependency resolution for next sprint', 'decision', '550e8400-e29b-41d4-a716-446655440003', '2025-09-25 09:15:00+00'),
('660e8400-e29b-41d4-a716-446655440003', 'ACTION: Morgan to update budget spreadsheet by Friday', 'action-item', '550e8400-e29b-41d4-a716-446655440003', '2025-09-25 09:20:00+00'),
('660e8400-e29b-41d4-a716-446655440003', 'Question: Should we adjust Q4 timeline given current velocity?', 'question', '550e8400-e29b-41d4-a716-446655440002', '2025-09-25 09:25:00+00');

-- Insert key decisions
INSERT INTO decisions (meeting_id, title, description, decided_by, impact) VALUES
('660e8400-e29b-41d4-a716-446655440003', 'Prioritize API dependency resolution', 'Move API blocker resolution to top of next sprint to unblock feature development', '550e8400-e29b-41d4-a716-446655440003', 'high'),
('660e8400-e29b-41d4-a716-446655440003', 'Extend Q4 planning deadline', 'Push Q4 planning finalization to allow for revised projections', '550e8400-e29b-41d4-a716-446655440001', 'medium');

-- Insert sample documents
INSERT INTO documents (meeting_id, profile_id, filename, file_size, mime_type, storage_path) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Q4-Sales-Projections.xlsx', 245760, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'meeting-documents/q4-sales-projections.xlsx'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Marketing-Strategy-Draft.pdf', 1048576, 'application/pdf', 'meeting-documents/marketing-strategy-draft.pdf'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'Sprint-Velocity-Report.pdf', 512000, 'application/pdf', 'meeting-documents/sprint-velocity-report.pdf'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Client-Presentation-Template.pptx', 2097152, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'meeting-documents/client-presentation-template.pptx');

-- Insert notifications
INSERT INTO notifications (profile_id, title, message, type, related_id, related_type, scheduled_for) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Meeting starting soon', 'Q4 Planning Session starts in 15 minutes', 'meeting-started', '660e8400-e29b-41d4-a716-446655440001', 'meeting', '2025-10-01 13:45:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'Overdue task', 'Budget breakdown document is past due date', 'overdue', '770e8400-e29b-41d4-a716-446655440003', 'followup', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'New task assigned', 'You have been assigned a new follow-up task: Share marketing campaign creative brief', 'followup-assigned', '770e8400-e29b-41d4-a716-446655440002', 'followup', NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Task due tomorrow', 'Client presentation preparation is due tomorrow', 'reminder', '770e8400-e29b-41d4-a716-446655440004', 'followup', '2025-10-06 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'Meeting reminder', 'Product Roadmap Review scheduled for tomorrow at 10:30 AM', 'reminder', '660e8400-e29b-41d4-a716-446655440002', 'meeting', '2025-10-04 18:00:00+00');

-- Update some notifications to read status
UPDATE notifications SET is_read = true WHERE profile_id = '550e8400-e29b-41d4-a716-446655440001' AND type = 'reminder';

-- Insert some completed follow-ups for history
INSERT INTO followups (meeting_id, title, description, assigned_to, created_by, due_date, status, priority, completed_at) VALUES
('660e8400-e29b-41d4-a716-446655440003', 'Send meeting minutes', 'Distribute meeting notes to all participants', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '2025-09-26', 'completed', 'medium', '2025-09-26 10:30:00+00'),
('660e8400-e29b-41d4-a716-446655440003', 'Book conference room for next meeting', 'Reserve Conference Room B for Q4 planning session', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2025-09-28', 'completed', 'low', '2025-09-27 14:15:00+00');