"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        'flex items-center gap-3 max-w-[80%] mr-auto',
        className
      )}
      aria-live="polite"
      aria-label="Bot is typing"
    >
      <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
        🤖
      </div>
      
      <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};