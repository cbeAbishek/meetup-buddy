# User Chat Database Setup

To set up the user-to-user chat functionality, you need to run the SQL script in your Supabase database.

## Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to [supabase.com](https://supabase.com)
   - Open your project dashboard

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Create a "New query"

3. **Run the Setup Script**
   - Copy the contents of `scripts/setup-user-chat.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

4. **Verify Tables Created**
   After running the script, you should see these new tables:
   - `chat_conversations` - Stores conversation metadata
   - `chat_participants` - Manages conversation participants
   - `chat_messages` - Stores individual messages
   - `user_presence` - Tracks user online/offline status
   - `typing_status` - Real-time typing indicators
   - `message_reactions` - Emoji reactions to messages

## Features Enabled:

✅ **Real-time messaging** between users
✅ **Conversation management** (direct and group chats)
✅ **User presence tracking** (online/offline status)
✅ **Typing indicators** 
✅ **Message reactions** (emoji support)
✅ **Read receipts** and message status
✅ **Row Level Security** for data protection

## Usage:

Once the database is set up, the chat features will be automatically available:

- **Floating Chat Button**: Available on all pages for logged-in users
- **Full Chat Page**: Navigate to `/chat` for the complete interface
- **Direct Messaging**: Click on any user to start a conversation

The system integrates seamlessly with your existing authentication setup!