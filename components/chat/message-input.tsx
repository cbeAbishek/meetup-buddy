"use client";

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { SendHorizontalIcon, MicIcon, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useChat } from './chat-provider';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  className?: string;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  className,
  placeholder = "Type a message...",
}) => {
  const [message, setMessage] = useState('');
  const { sendMessage, isTyping, clearMessages } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isTyping) return;
    
    setMessage('');
    await sendMessage(trimmedMessage);
    
    // Refocus the input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn('flex items-center gap-2', className)}
    >
      <Input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        disabled={isTyping}
        aria-label="Message input"
      />
      
      <Button 
        type="button" 
        variant="outline" 
        size="icon" 
        disabled={isTyping}
        aria-label="Record voice message"
      >
        <MicIcon className="h-4 w-4" />
      </Button>
      
      <Button 
        type="submit" 
        variant="default" 
        size="icon" 
        disabled={!message.trim() || isTyping}
        aria-label="Send message"
      >
        <SendHorizontalIcon className="h-4 w-4" />
      </Button>

      <Button 
        type="button" 
        variant="outline" 
        size="icon" 
        onClick={clearMessages}
        title="Clear chat history"
        aria-label="Clear chat history"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </form>
  );
};