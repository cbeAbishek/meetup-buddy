"use client";

import { supabase } from '@/lib/supabase';
import { 
  ChatConversation, 
  UserChatMessage, 
  ChatUser, 
  UserPresence, 
  TypingStatus 
} from './user-chat-types';

export class UserChatService {
  private currentUserId: string | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    this.currentUserId = user?.id || null;
  }

  // Get or create a chat conversation between two users
  async getOrCreateConversation(userId1: string, userId2: string): Promise<ChatConversation> {
    try {
      // Check if conversation already exists
      const { data: existingChat, error: searchError } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          chat_participants(
            user_id,
            profiles(id, email, full_name, avatar_url)
          ),
          chat_messages(*)
        `)
        .contains('participant_ids', [userId1, userId2])
        .eq('chat_type', 'direct')
        .single();

      if (existingChat) {
        return this.mapToConversation(existingChat);
      }

      // Create new conversation
      const { data: newChat, error: createError } = await supabase
        .from('chat_conversations')
        .insert({
          chat_type: 'direct',
          participant_ids: [userId1, userId2],
          created_by: this.currentUserId
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add participants
      const participants = [
        { conversation_id: newChat.id, user_id: userId1, role: 'participant' },
        { conversation_id: newChat.id, user_id: userId2, role: 'participant' }
      ];

      await supabase.from('chat_participants').insert(participants);

      return await this.getConversationById(newChat.id);
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw error;
    }
  }

  // Get conversation by ID
  async getConversationById(conversationId: string): Promise<ChatConversation> {
    try {
      const { data: chat, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          chat_participants(
            user_id,
            profiles(id, email, full_name, avatar_url)
          ),
          chat_messages(
            *,
            sender:profiles(id, email, full_name, avatar_url)
          )
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      return this.mapToConversation(chat);
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  }

  // Get all conversations for current user
  async getUserConversations(): Promise<ChatConversation[]> {
    try {
      if (!this.currentUserId) return [];

      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          chat_participants!inner(
            user_id,
            profiles(id, email, full_name, avatar_url)
          ),
          chat_messages(
            *,
            sender:profiles(id, email, full_name, avatar_url)
          )
        `)
        .contains('participant_ids', [this.currentUserId])
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return conversations?.map(chat => this.mapToConversation(chat)) || [];
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(
    conversationId: string, 
    receiverId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'file' | 'meeting_invitation' = 'text'
  ): Promise<UserChatMessage> {
    try {
      if (!this.currentUserId) throw new Error('User not authenticated');

      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: this.currentUserId,
          receiver_id: receiverId,
          content,
          message_type: messageType,
          status: 'sent'
        })
        .select(`
          *,
          sender:profiles(id, email, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Update conversation last_message
      await supabase
        .from('chat_conversations')
        .update({
          last_message_id: message.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      return this.mapToUserMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, limit: number = 50, offset: number = 0): Promise<UserChatMessage[]> {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles(id, email, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return messages?.map(msg => this.mapToUserMessage(msg)).reverse() || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string): Promise<void> {
    try {
      if (!this.currentUserId) return;

      await supabase
        .from('chat_messages')
        .update({ status: 'read' })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', this.currentUserId)
        .neq('status', 'read');
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // Update user presence
  async updateUserPresence(status: 'online' | 'away' | 'offline'): Promise<void> {
    try {
      if (!this.currentUserId) return;

      await supabase
        .from('user_presence')
        .upsert({
          user_id: this.currentUserId,
          status,
          last_seen: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  // Get online users
  async getOnlineUsers(): Promise<ChatUser[]> {
    try {
      const { data: users, error } = await supabase
        .from('user_presence')
        .select(`
          user_id,
          status,
          last_seen,
          profiles(id, email, full_name, avatar_url)
        `)
        .eq('status', 'online');

      if (error) throw error;

      return users?.map((user: any) => ({
        id: user.profiles?.id || user.user_id,
        email: user.profiles?.email,
        full_name: user.profiles?.full_name,
        avatar_url: user.profiles?.avatar_url,
        status: user.status as 'online' | 'away' | 'offline',
        last_seen: new Date(user.last_seen)
      })) || [];
    } catch (error) {
      console.error('Error getting online users:', error);
      return [];
    }
  }

  // Search users for new chats
  async searchUsers(query: string): Promise<ChatUser[]> {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .or(`full_name.ilike.%${query}%, email.ilike.%${query}%`)
        .neq('id', this.currentUserId)
        .limit(10);

      if (error) throw error;

      return users?.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        status: 'offline' as const
      })) || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Subscribe to real-time messages
  subscribeToMessages(conversationId: string, callback: (message: UserChatMessage) => void) {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Fetch the full message with sender details
          const { data: message } = await supabase
            .from('chat_messages')
            .select(`
              *,
              sender:profiles(id, email, full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (message) {
            callback(this.mapToUserMessage(message));
          }
        }
      )
      .subscribe();

    return subscription;
  }

  // Subscribe to typing indicators
  subscribeToTyping(conversationId: string, callback: (typing: TypingStatus) => void) {
    const subscription = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newData = payload.new as any;
          callback({
            user_id: newData?.user_id || '',
            chat_id: newData?.conversation_id || conversationId,
            is_typing: newData?.is_typing || false,
            timestamp: new Date(newData?.updated_at || Date.now())
          });
        }
      )
      .subscribe();

    return subscription;
  }

  // Send typing indicator
  async sendTypingIndicator(conversationId: string, isTyping: boolean): Promise<void> {
    try {
      if (!this.currentUserId) return;

      await supabase
        .from('typing_status')
        .upsert({
          user_id: this.currentUserId,
          conversation_id: conversationId,
          is_typing: isTyping,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }

  // Helper method to map database data to conversation
  private mapToConversation(data: any): ChatConversation {
    const participants = data.chat_participants?.map((p: any) => ({
      id: p.profiles.id,
      email: p.profiles.email,
      full_name: p.profiles.full_name,
      avatar_url: p.profiles.avatar_url,
      status: 'offline' as const
    })) || [];

    const messages = data.chat_messages?.map((msg: any) => this.mapToUserMessage(msg)) || [];
    const lastMessage = messages[messages.length - 1];

    return {
      id: data.id,
      participants,
      last_message: lastMessage,
      unread_count: data.unread_count || 0,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      archived: data.archived || false
    };
  }

  // Helper method to map database data to user message
  private mapToUserMessage(data: any): UserChatMessage {
    return {
      id: data.id,
      chat_id: data.conversation_id,
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      content: data.content,
      message_type: data.message_type,
      status: data.status,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      edited: data.edited || false,
      reply_to: data.reply_to,
      metadata: data.metadata
    };
  }
}

// Export singleton instance
export const userChatService = new UserChatService();