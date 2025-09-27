"use client";

import React from 'react';
import { QuickRepliesMessage } from '../types';
import { Button } from '@/components/ui/button';
import { useChat } from '../chat-provider';
import { cn } from '@/lib/utils';

interface QuickRepliesMessageViewProps {
  message: QuickRepliesMessage;
  className?: string;
}

export const QuickRepliesMessageView: React.FC<QuickRepliesMessageViewProps> = ({ 
  message, 
  className 
}) => {
  const { sendQuickReply } = useChat();
  
  const handleQuickReply = (replyId: string, text: string) => {
    sendQuickReply(replyId, text);
  };
  
  return (
    <div className={cn('space-y-2', className)}>
      {message.content && (
        <div className="text-sm">{message.content}</div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-1">
        {message.options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            size="sm"
            onClick={() => handleQuickReply(option.id, option.text)}
            className="rounded-full bg-white hover:bg-gray-100"
          >
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
};