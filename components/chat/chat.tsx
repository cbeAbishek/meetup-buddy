"use client";

import React, { useRef, useEffect } from 'react';
import { ChatProvider, useChat } from './chat-provider';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { TypingIndicator } from './typing-indicator';
import { cn } from '@/lib/utils';

interface ChatProps {
  className?: string;
  containerClassName?: string;
  headerTitle?: string;
  showHeader?: boolean;
}

const ChatComponent: React.FC<ChatProps> = ({
  className,
  containerClassName,
  headerTitle = "AI Meeting Buddy",
  showHeader = true,
}) => {
  const { messages, isTyping, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <div className={cn('flex flex-col h-full max-h-full bg-white rounded-lg shadow-lg', className)}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-medium">{headerTitle}</h2>
        </div>
      )}
      
      <div 
        className={cn(
          'flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent', 
          containerClassName
        )}
      >
        <MessageList messages={messages} />
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <MessageInput />
      </div>
    </div>
  );
};

// Export a wrapped version with the Provider
export const Chat: React.FC<ChatProps> = (props) => {
  return (
    <ChatProvider>
      <ChatComponent {...props} />
    </ChatProvider>
  );
};