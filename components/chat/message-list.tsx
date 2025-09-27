"use client";

import React from 'react';
import { autoAnimate } from '@formkit/auto-animate';
import { ChatMessage } from './types';
import { MessageItem } from './message-item';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: ChatMessage[];
  className?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  const parent = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current, {
        duration: 300,
        easing: 'ease-in-out',
      });
    }
  }, [parent]);

  // If no messages, show empty state
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <h3 className="font-medium text-lg">Welcome to AI Meeting Buddy</h3>
          <p className="text-gray-500 mt-2">Start a conversation to get help with meetings, agendas, and follow-ups.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={parent}
      className={cn("flex flex-col space-y-4", className)} 
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};