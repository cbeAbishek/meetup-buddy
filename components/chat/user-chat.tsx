"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { userChatService } from './user-chat-service';
import { ChatConversation, UserChatMessage, ChatUser } from './user-chat-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Send, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Info,
  Smile,
  Paperclip,
  ChevronLeft
} from 'lucide-react';

interface UserChatProps {
  className?: string;
  onClose?: () => void;
  initialUserId?: string; // Start chat with specific user
}

export const UserChat: React.FC<UserChatProps> = ({
  className,
  onClose,
  initialUserId
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<UserChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
      userChatService.updateUserPresence('online');
    }
  }, [user]);

  // Start chat with specific user if provided
  useEffect(() => {
    if (initialUserId && user && initialUserId !== user.id) {
      startChatWithUser(initialUserId);
    }
  }, [initialUserId, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (user) {
        userChatService.updateUserPresence('offline');
      }
    };
  }, [user]);

  const loadConversations = async () => {
    try {
      const convs = await userChatService.getUserConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const startChatWithUser = async (userId: string) => {
    if (!user) return;
    
    try {
      const conversation = await userChatService.getOrCreateConversation(user.id, userId);
      setActiveConversation(conversation);
      loadMessages(conversation.id);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const msgs = await userChatService.getMessages(conversationId);
      setMessages(msgs);
      await userChatService.markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeConversation || !user) return;

    const content = messageInput.trim();
    setMessageInput('');

    // Find the other participant
    const otherParticipant = activeConversation.participants.find(p => p.id !== user.id);
    if (!otherParticipant) return;

    try {
      const message = await userChatService.sendMessage(
        activeConversation.id,
        otherParticipant.id,
        content
      );
      
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const users = await userChatService.searchUsers(query);
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Debounce search
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const getOtherParticipant = (conversation: ChatConversation) => {
    return conversation.participants.find(p => p.id !== user?.id);
  };

  if (!user) {
    return (
      <Card className={cn('h-full flex items-center justify-center', className)}>
        <CardContent>
          <p className="text-muted-foreground">Please sign in to use chat</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('h-full flex', className)}>
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserSearch(!showUserSearch)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {showUserSearch && (
            <div className="space-y-2">
              <Input
                placeholder="Search users to chat with..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              
              {searchResults.length > 0 && (
                <ScrollArea className="max-h-32">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => {
                        startChatWithUser(user.id);
                        setShowUserSearch(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback>
                          {user.full_name?.charAt(0) || user.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.full_name || user.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </div>
          )}
        </CardHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map(conversation => {
              const otherUser = getOtherParticipant(conversation);
              if (!otherUser) return null;
              
              return (
                <div
                  key={conversation.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted',
                    activeConversation?.id === conversation.id && 'bg-muted'
                  )}
                  onClick={() => {
                    setActiveConversation(conversation);
                    loadMessages(conversation.id);
                  }}
                >
                  <Avatar>
                    <AvatarImage src={otherUser.avatar_url || ''} />
                    <AvatarFallback>
                      {otherUser.full_name?.charAt(0) || otherUser.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {otherUser.full_name || otherUser.email}
                      </p>
                      {conversation.last_message && (
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    
                    {conversation.last_message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message.content}
                      </p>
                    )}
                  </div>
                  
                  {conversation.unread_count > 0 && (
                    <Badge variant="default" className="ml-2">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              );
            })}
            
            {conversations.length === 0 && !showUserSearch && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No conversations yet</p>
                <p className="text-xs">Click + to start a new chat</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onClose && (
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                
                {(() => {
                  const otherUser = getOtherParticipant(activeConversation);
                  return otherUser ? (
                    <>
                      <Avatar>
                        <AvatarImage src={otherUser.avatar_url || ''} />
                        <AvatarFallback>
                          {otherUser.full_name?.charAt(0) || otherUser.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {otherUser.full_name || otherUser.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {otherUser.status}
                        </p>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-2',
                      message.sender_id === user.id ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender_id !== user.id && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getOtherParticipant(activeConversation)?.avatar_url || ''} />
                        <AvatarFallback>
                          {getOtherParticipant(activeConversation)?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                        message.sender_id === user.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        message.sender_id === user.id
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      )}>
                        {formatMessageTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getOtherParticipant(activeConversation)?.avatar_url || ''} />
                      <AvatarFallback>
                        {getOtherParticipant(activeConversation)?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted px-4 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // No conversation selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation from the sidebar or start a new one
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};