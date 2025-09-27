"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ChatMessage, 
  AgendaMessage, 
  TextMessage, 
  CardMessage,
  MeetingMessage,
  QuickRepliesMessage,
  FollowUpMessage
} from './types';
import { 
  AgendaMessageView,
  TextMessageView,
  CardMessageView,
  MeetingMessageView,
  QuickRepliesMessageView,
  FollowUpMessageView
} from './message-types';
import { Avatar } from '../ui/avatar';

interface MessageItemProps {
  message: ChatMessage;
  className?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, className }) => {
  // Base container classNames
  const containerClasses = cn(
    'flex gap-3 max-w-[80%]',
    message.role === 'user' ? 'ml-auto' : 'mr-auto',
    className
  );

  // Render avatar component for the appropriate role
  const renderAvatar = () => {
    if (message.role === 'user') {
      return (
        <Avatar className="h-8 w-8">
          <div className="bg-blue-500 text-white flex items-center justify-center h-full w-full rounded-full">
            U
          </div>
        </Avatar>
      );
    } else {
      return (
        <Avatar className="h-8 w-8">
          <div className="bg-purple-600 text-white flex items-center justify-center h-full w-full rounded-full">
            🤖
          </div>
        </Avatar>
      );
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Render different message types
  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <TextMessageView message={message as TextMessage} />;
      
      case 'card':
        return <CardMessageView message={message as CardMessage} />;
      
      case 'meeting':
        return <MeetingMessageView message={message as MeetingMessage} />;
      
      case 'agenda':
        return <AgendaMessageView message={message as AgendaMessage} />;
      
      case 'quickReplies':
        return <QuickRepliesMessageView message={message as QuickRepliesMessage} />;
      
      case 'followUp':
        return <FollowUpMessageView message={message as FollowUpMessage} />;
      
      default:
        return <div className="text-red-500">Unsupported message type</div>;
    }
  };

  return (
    <div className={containerClasses}>
      {message.role !== 'user' && renderAvatar()}
      
      <div className="flex flex-col gap-1 max-w-full">
        <div 
          className={cn(
            "rounded-lg p-3",
            message.role === 'user' 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-900 rounded-tl-none'
          )}
        >
          {renderMessageContent()}
        </div>
        
        <div 
          className={cn(
            "text-xs text-gray-500",
            message.role === 'user' ? 'text-right' : 'text-left'
          )}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {message.role === 'user' && renderAvatar()}
    </div>
  );
};