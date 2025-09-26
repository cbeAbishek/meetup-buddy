"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, MessageRole, MessageStatus, MessageType } from './types';
import { chatService } from './mock-service';

// Define types for the chat context
interface ChatContextProps {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  sendQuickReply: (replyId: string, text: string) => Promise<void>;
  clearMessages: () => void;
}

// Create the context with a default value
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Provider component
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Send a user message and get bot response
  const sendMessage = useCallback(async (content: string) => {
    try {
      setError(null);
      // Create user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
        type: 'text',
        status: 'sent',
      };
      
      // Add user message to state
      setMessages(prev => [...prev, userMessage]);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Process the message and get responses
      const botResponses = await chatService.processMessage(content);
      
      // Add bot responses to state
      setMessages(prev => [...prev, ...botResponses]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, []);
  
  // Send a quick reply
  const sendQuickReply = useCallback(async (replyId: string, text: string) => {
    try {
      await sendMessage(text);
    } catch (err) {
      console.error('Error sending quick reply:', err);
      setError('Failed to send quick reply. Please try again.');
    }
  }, [sendMessage]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Load initial greeting on first render
  useEffect(() => {
    const loadGreeting = async () => {
      try {
        setIsTyping(true);
        const greeting = await chatService.getGreeting();
        setMessages(greeting);
      } catch (err) {
        console.error('Error loading greeting:', err);
        setError('Failed to load initial greeting. Please refresh the page.');
      } finally {
        setIsTyping(false);
      }
    };
    
    loadGreeting();
  }, []);
  
  return (
    <ChatContext.Provider value={{
      messages,
      isTyping,
      error,
      sendMessage,
      sendQuickReply,
      clearMessages,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for using the chat context
export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};