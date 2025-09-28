// User-to-user chat types

export type ChatType = 'ai' | 'user' | 'group';
export type UserMessageRole = 'sender' | 'receiver';
export type UserMessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
export type UserMessageType = 'text' | 'image' | 'file' | 'meeting_invitation' | 'system';

// User profile for chat
export interface ChatUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'offline';
  last_seen?: Date;
}

// User chat message
export interface UserChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: UserMessageType;
  status: UserMessageStatus;
  created_at: Date;
  updated_at: Date;
  edited: boolean;
  reply_to?: string; // ID of message being replied to
  metadata?: Record<string, any>; // For attachments, etc.
}

// Chat conversation/thread
export interface ChatConversation {
  id: string;
  participants: ChatUser[];
  last_message?: UserChatMessage;
  unread_count: number;
  created_at: Date;
  updated_at: Date;
  archived: boolean;
}

// Typing indicator
export interface TypingStatus {
  user_id: string;
  chat_id: string;
  is_typing: boolean;
  timestamp: Date;
}

// Message delivery status
export interface MessageDelivery {
  message_id: string;
  user_id: string;
  status: UserMessageStatus;
  timestamp: Date;
}

// Online status
export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'offline';
  last_seen: Date;
}