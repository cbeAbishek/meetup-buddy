"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserChat } from './user-chat';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

interface FloatingUserChatProps {
  className?: string;
}

export const FloatingUserChat: React.FC<FloatingUserChatProps> = ({
  className
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      {isOpen ? (
        <div className="w-[900px] h-[600px] bg-background border rounded-lg shadow-2xl">
          <UserChat 
            onClose={() => setIsOpen(false)}
            className="h-full"
          />
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};