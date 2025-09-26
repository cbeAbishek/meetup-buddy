"use client";

import React from 'react';
import { CardMessage } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardMessageViewProps {
  message: CardMessage;
  className?: string;
}

export const CardMessageView: React.FC<CardMessageViewProps> = ({ message, className }) => {
  return (
    <Card className={cn('w-full overflow-hidden', className)}>
      {message.title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{message.title}</CardTitle>
        </CardHeader>
      )}
      
      <CardContent>
        {message.image && (
          <div className="mb-3">
            <img 
              src={message.image} 
              alt={message.title || 'Card image'} 
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        )}
        
        {message.description && (
          <CardDescription className="whitespace-pre-wrap text-gray-700">
            {message.description}
          </CardDescription>
        )}
        
        {message.url && (
          <a 
            href={message.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-3 inline-block text-blue-600 hover:text-blue-800 hover:underline"
          >
            {message.urlText || 'Learn more'}
          </a>
        )}
      </CardContent>
    </Card>
  );
};