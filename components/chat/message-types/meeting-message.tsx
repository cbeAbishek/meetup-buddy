"use client";

import React from 'react';
import { MeetingMessage } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface MeetingMessageViewProps {
  message: MeetingMessage;
  className?: string;
}

export const MeetingMessageView: React.FC<MeetingMessageViewProps> = ({ message, className }) => {
  const { meeting } = message;
  
  return (
    <Card className={cn('w-full overflow-hidden border-l-4 border-blue-500', className)}>
      <CardHeader className="pb-2 bg-blue-50">
        <CardTitle className="text-lg">{meeting.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{meeting.date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{meeting.time} • {meeting.duration}</span>
          </div>
          
          {meeting.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">{meeting.location}</span>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-blue-600 mt-1" />
            <div className="flex-1">
              <span className="text-gray-700">
                {meeting.participants.length} participants
              </span>
              <div className="mt-1 text-xs text-gray-500">
                {meeting.participants.slice(0, 3).join(', ')}
                {meeting.participants.length > 3 && ` + ${meeting.participants.length - 3} more`}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};