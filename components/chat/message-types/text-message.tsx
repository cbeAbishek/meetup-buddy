"use client";

import React from 'react';
import { TextMessage } from '../types';
import { cn } from '@/lib/utils';

interface TextMessageViewProps {
  message: TextMessage;
  className?: string;
}

export const TextMessageView: React.FC<TextMessageViewProps> = ({ message, className }) => {
  return (
    <div className={cn('whitespace-pre-wrap break-words', className)}>
      {message.content}
    </div>
  );
};