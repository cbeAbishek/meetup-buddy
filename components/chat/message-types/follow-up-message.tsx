"use client";

import React from 'react';
import { FollowUpMessage } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, CheckCircle2, User, Clock } from 'lucide-react';

interface FollowUpMessageViewProps {
  message: FollowUpMessage;
  className?: string;
}

export const FollowUpMessageView: React.FC<FollowUpMessageViewProps> = ({ message, className }) => {
  const { followUps } = message;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <Clock className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };
  
  return (
    <Card className={cn('w-full overflow-hidden border-l-4 border-orange-500', className)}>
      <CardHeader className="pb-2 bg-orange-50">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Follow-up Tasks</span>
          <Badge variant="outline" className="bg-orange-100">
            {followUps.length} Tasks
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-3">
        <div className="space-y-3">
          {followUps.map((task) => (
            <div 
              key={task.id}
              className="border rounded-md p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{task.task}</div>
                  
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {task.assignee}
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.dueDate}
                    </div>
                  </div>
                </div>
                
                <Badge 
                  className={cn(
                    'ml-2 flex items-center gap-1',
                    getStatusColor(task.status)
                  )}
                >
                  {getStatusIcon(task.status)}
                  <span className="capitalize">{task.status}</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};