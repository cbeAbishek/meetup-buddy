-- User-to-User Chat Database Schema
-- Run this in your Supabase SQL Editor

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_type TEXT DEFAULT 'direct' CHECK (chat_type IN ('direct', 'group')),
    title TEXT, -- For group chats
    description TEXT, -- For group chats
    participant_ids UUID[] NOT NULL, -- Array of user IDs for quick lookups
    last_message_id UUID,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived BOOLEAN DEFAULT FALSE,
    unread_count INTEGER DEFAULT 0
);

-- Create chat_participants table (for detailed participant management)
CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'participant' CHECK (role IN ('admin', 'moderator', 'participant')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    UNIQUE(conversation_id, user_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- For direct messages
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'meeting_invitation', 'system')),
    status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    reply_to UUID REFERENCES chat_messages(id), -- For message replies
    edited BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- For attachments, reactions, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_presence table
CREATE TABLE IF NOT EXISTS user_presence (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create typing_status table (for real-time typing indicators)
CREATE TABLE IF NOT EXISTS typing_status (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    is_typing BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, conversation_id)
);

-- Create message_reactions table (for emoji reactions)
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_participants ON chat_conversations USING GIN (participant_ids);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated_at ON chat_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_conversation_id ON chat_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON user_presence(status);
CREATE INDEX IF NOT EXISTS idx_typing_status_conversation_id ON typing_status(conversation_id);

-- Enable Row Level Security
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view their own conversations" ON chat_conversations
    FOR SELECT USING (
        auth.uid()::text = ANY(participant_ids::text[]) OR
        auth.uid()::text = created_by::text
    );

CREATE POLICY "Users can create conversations" ON chat_conversations
    FOR INSERT WITH CHECK (
        auth.uid()::text = created_by::text AND
        auth.uid()::text = ANY(participant_ids::text[])
    );

CREATE POLICY "Participants can update conversations" ON chat_conversations
    FOR UPDATE USING (
        auth.uid()::text = ANY(participant_ids::text[])
    );

-- RLS Policies for chat_participants
CREATE POLICY "Users can view participants of their conversations" ON chat_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND auth.uid()::text = ANY(participant_ids::text[])
        )
    );

CREATE POLICY "Conversation creators can manage participants" ON chat_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND auth.uid()::text = created_by::text
        )
    );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their conversations" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND auth.uid()::text = ANY(participant_ids::text[])
        )
    );

CREATE POLICY "Users can send messages to their conversations" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid()::text = sender_id::text AND
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND auth.uid()::text = ANY(participant_ids::text[])
        )
    );

CREATE POLICY "Users can update their own messages" ON chat_messages
    FOR UPDATE USING (auth.uid()::text = sender_id::text);

-- RLS Policies for user_presence
CREATE POLICY "Users can view all user presence" ON user_presence
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own presence" ON user_presence
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for typing_status
CREATE POLICY "Users can view typing status in their conversations" ON typing_status
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND auth.uid()::text = ANY(participant_ids::text[])
        )
    );

CREATE POLICY "Users can update their own typing status" ON typing_status
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their conversations" ON message_reactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_messages cm
            JOIN chat_conversations cc ON cm.conversation_id = cc.id
            WHERE cm.id = message_id 
            AND auth.uid()::text = ANY(cc.participant_ids::text[])
        )
    );

CREATE POLICY "Users can manage their own reactions" ON message_reactions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_chat_conversations_updated_at
    BEFORE UPDATE ON chat_conversations
    FOR EACH ROW EXECUTE FUNCTION update_chat_updated_at();

CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_chat_updated_at();

CREATE TRIGGER update_user_presence_updated_at
    BEFORE UPDATE ON user_presence
    FOR EACH ROW EXECUTE FUNCTION update_chat_updated_at();

-- Function to automatically update conversation when message is sent
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the conversation's last_message_id and updated_at
    UPDATE chat_conversations
    SET 
        last_message_id = NEW.id,
        updated_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update conversation when message is sent
CREATE TRIGGER update_conversation_on_message_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- Function to clean up old typing indicators
CREATE OR REPLACE FUNCTION cleanup_typing_indicators()
RETURNS void AS $$
BEGIN
    DELETE FROM typing_status 
    WHERE updated_at < NOW() - INTERVAL '30 seconds';
END;
$$ language 'plpgsql';

-- Insert sample data for testing
INSERT INTO user_presence (user_id, status) 
SELECT id, 'offline' 
FROM profiles 
ON CONFLICT (user_id) DO NOTHING;

-- Comments
COMMENT ON TABLE chat_conversations IS 'Chat conversations between users';
COMMENT ON TABLE chat_participants IS 'Participants in chat conversations';
COMMENT ON TABLE chat_messages IS 'Messages in chat conversations';
COMMENT ON TABLE user_presence IS 'User online/offline status';
COMMENT ON TABLE typing_status IS 'Real-time typing indicators';
COMMENT ON TABLE message_reactions IS 'Emoji reactions to messages';

-- Success message
SELECT 'User chat schema created successfully! 💬' as result;