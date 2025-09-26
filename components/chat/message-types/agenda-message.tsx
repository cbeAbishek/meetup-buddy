"use client";

import React from 'react';
import { AgendaMessage } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, User } from 'lucide-react';

interface AgendaMessageViewProps {
  message: AgendaMessage;
  className?: string;
}

export const AgendaMessageView: React.FC<AgendaMessageViewProps> = ({ message, className }) => {
  const { meeting, agendaItems } = message;
  
  return (
    <Card className={cn('w-full overflow-hidden border-l-4 border-purple-500', className)}>
      <CardHeader className="pb-2 bg-purple-50">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Agenda: {meeting.title}</span>
          <Badge variant="outline" className="bg-purple-100">
            {agendaItems.length} Items
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-3">
        <div className="space-y-3">
          {agendaItems.map((item, index) => (
            <div 
              key={item.id}
              className={cn(
                'p-2 rounded-md',
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 text-purple-800 h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {item.duration}
                </div>
              </div>
              
              {item.presenter && (
                <div className="mt-1 ml-8 text-xs text-gray-500 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {item.presenter}
                </div>
              )}
              
              {item.notes && (
                <div className="mt-2 ml-8 text-xs text-gray-600 italic">
                  {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};