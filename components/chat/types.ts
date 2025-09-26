// Message and chat types for the AI Meeting Buddy chat interface

export type MessageRole = 'user' | 'bot' | 'system';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed';
export type MessageType = 'text' | 'quickReplies' | 'card' | 'meeting' | 'agenda' | 'followUp';

// Base message interface
export interface Message {
  id: string;
  role: MessageRole;
  timestamp: Date;
  type: MessageType;
  status: MessageStatus;
}

// Text message
export interface TextMessage extends Message {
  type: 'text';
  content: string;
}

// Quick reply option
export interface QuickReplyOption {
  id: string;
  text: string;
  action?: string; // Optional action identifier
}

// Quick replies message
export interface QuickRepliesMessage extends Message {
  type: 'quickReplies';
  content: string;
  options: QuickReplyOption[];
}

// Meeting item for card
export interface MeetingItem {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  participants: string[];
}

// Meeting card message
export interface MeetingMessage extends Message {
  type: 'meeting';
  meeting: MeetingItem;
}

// Agenda item
export interface AgendaItem {
  id: string;
  title: string;
  duration: string;
  presenter?: string;
  notes?: string;
}

// Agenda message
export interface AgendaMessage extends Message {
  type: 'agenda';
  meeting: MeetingItem;
  agendaItems: AgendaItem[];
}

// Follow-up item
export interface FollowUpItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
}

// Follow-up message
export interface FollowUpMessage extends Message {
  type: 'followUp';
  followUps: FollowUpItem[];
}

// Generic card message for other card types
export interface CardMessage extends Message {
  type: 'card';
  title: string;
  description?: string;
  image?: string;
  url?: string;
  urlText?: string;
  actions?: QuickReplyOption[];
}

// Union type of all message types
export type ChatMessage = 
  | TextMessage 
  | QuickRepliesMessage 
  | MeetingMessage 
  | AgendaMessage 
  | FollowUpMessage
  | CardMessage;

// Chat context state interface
export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
}

// Chat context actions
export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  sendQuickReply: (optionId: string, messageId: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  clearMessages: () => void;
}

// Combined chat context
export interface ChatContextValue extends ChatState, ChatActions {}