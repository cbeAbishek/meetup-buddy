-- Create table for chatbot conversations
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session_id ON chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created_at ON chatbot_conversations(created_at);

-- Enable Row Level Security
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own conversations
CREATE POLICY "Users can view their own chatbot conversations" ON chatbot_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chatbot conversations" ON chatbot_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chatbot_conversations_updated_at 
    BEFORE UPDATE ON chatbot_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comment on table
COMMENT ON TABLE chatbot_conversations IS 'Stores conversations between users and the MeetUp Buddy AI chatbot';