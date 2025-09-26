"use client";

import { v4 as uuidv4 } from 'uuid';
import {
  AgendaItem,
  ChatMessage,
  FollowUpItem,
  MeetingItem,
  MessageRole,
  MessageStatus,
  MessageType,
} from './types';

// Sample data for mock responses
const sampleMeetings: MeetingItem[] = [
  {
    id: '1',
    title: 'Q4 Planning Session',
    date: '2025-10-01',
    time: '14:00',
    duration: '60 minutes',
    location: 'Conference Room A',
    participants: ['Alex Johnson', 'Taylor Kim', 'Morgan Chen', 'Robin Banks'],
  },
  {
    id: '2',
    title: 'Product Roadmap Review',
    date: '2025-10-05',
    time: '10:30',
    duration: '45 minutes',
    location: 'Virtual - Zoom',
    participants: ['Alex Johnson', 'Jordan Lee', 'Cameron Smith'],
  },
];

const sampleAgendaItems: Record<string, AgendaItem[]> = {
  '1': [
    { id: 'a1', title: 'Q4 Sales Projections', duration: '15 minutes', presenter: 'Alex Johnson' },
    { id: 'a2', title: 'Marketing Strategy', duration: '20 minutes', presenter: 'Taylor Kim' },
    { id: 'a3', title: 'Budget Allocation', duration: '25 minutes', presenter: 'Morgan Chen' },
  ],
  '2': [
    { id: 'a4', title: 'Current Sprint Status', duration: '10 minutes', presenter: 'Jordan Lee' },
    { id: 'a5', title: 'Feature Prioritization', duration: '20 minutes', presenter: 'Cameron Smith' },
    { id: 'a6', title: 'Timeline Review', duration: '15 minutes', presenter: 'Alex Johnson' },
  ],
};

const sampleFollowUps: FollowUpItem[] = [
  {
    id: 'f1',
    task: 'Update Q4 sales projections based on new data',
    assignee: 'Alex Johnson',
    dueDate: '2025-10-05',
    status: 'pending',
  },
  {
    id: 'f2',
    task: 'Share marketing campaign creative brief',
    assignee: 'Taylor Kim',
    dueDate: '2025-10-02',
    status: 'pending',
  },
  {
    id: 'f3',
    task: 'Send revised budget breakdown to team',
    assignee: 'Morgan Chen',
    dueDate: '2025-09-25',
    status: 'overdue',
  },
];

// Helper function to create a message with common fields
const createMessage = (
  role: MessageRole,
  type: MessageType,
  status: MessageStatus = 'sent'
): ChatMessage => ({
  id: uuidv4(),
  role,
  timestamp: new Date(),
  type,
  status,
} as ChatMessage);

// Delay helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockChatService {
  // Process a user message and return appropriate bot responses
  async processMessage(content: string): Promise<ChatMessage[]> {
    // Simulate network delay
    await delay(1000 + Math.random() * 1000);

    const lowerContent = content.toLowerCase();
    
    // Different response patterns based on message content
    if (lowerContent.includes('meeting') && (lowerContent.includes('next') || lowerContent.includes('upcoming'))) {
      return this.getUpcomingMeetingResponse();
    } else if (lowerContent.includes('agenda')) {
      return this.getAgendaResponse();
    } else if (lowerContent.includes('follow') || lowerContent.includes('action') || lowerContent.includes('task')) {
      return this.getFollowUpResponse();
    } else if (lowerContent.includes('schedule') || lowerContent.includes('create meeting')) {
      return this.getScheduleResponse();
    } else if (lowerContent.includes('help') || lowerContent.includes('commands') || lowerContent.includes('?')) {
      return this.getHelpResponse();
    } else {
      return this.getDefaultResponse(content);
    }
  }

  // Generate a greeting response
  async getGreeting(): Promise<ChatMessage[]> {
    const textMessage = createMessage('bot', 'text') as any;
    textMessage.content = "👋 Hello! I'm your AI Meeting Buddy. I can help you manage meetings, track action items, and prepare agendas. How can I assist you today?";
    
    const quickRepliesMessage = createMessage('bot', 'quickReplies') as any;
    quickRepliesMessage.content = "Here are some things I can help you with:";
    quickRepliesMessage.options = [
      { id: 'upcoming', text: 'Show upcoming meetings' },
      { id: 'schedule', text: 'Schedule a meeting' },
      { id: 'followups', text: 'View follow-up tasks' },
    ];
    
    return [textMessage, quickRepliesMessage];
  }

  // Response for upcoming meetings
  private async getUpcomingMeetingResponse(): Promise<ChatMessage[]> {
    const nextMeeting = sampleMeetings[0];
    
    const textMessage = createMessage('bot', 'text') as any;
    textMessage.content = "Here's your next meeting:";
    
    const meetingMessage = createMessage('bot', 'meeting') as any;
    meetingMessage.meeting = nextMeeting;
    
    const quickRepliesMessage = createMessage('bot', 'quickReplies') as any;
    quickRepliesMessage.content = "Would you like to:";
    quickRepliesMessage.options = [
      { id: 'view-agenda', text: 'View agenda' },
      { id: 'prepare', text: 'Prepare for meeting' },
      { id: 'reschedule', text: 'Reschedule' },
    ];
    
    return [textMessage, meetingMessage, quickRepliesMessage];
  }

  // Response for agenda requests
  private async getAgendaResponse(): Promise<ChatMessage[]> {
    const meeting = sampleMeetings[0];
    const agendaItems = sampleAgendaItems[meeting.id];
    
    const textMessage = createMessage('bot', 'text') as any;
    textMessage.content = `Here's the agenda for ${meeting.title}:`;
    
    const agendaMessage = createMessage('bot', 'agenda') as any;
    agendaMessage.meeting = meeting;
    agendaMessage.agendaItems = agendaItems;
    
    return [textMessage, agendaMessage];
  }

  // Response for follow-up tasks
  private async getFollowUpResponse(): Promise<ChatMessage[]> {
    const textMessage = createMessage('bot', 'text') as any;
    textMessage.content = "Here are your current follow-up tasks:";
    
    const followUpMessage = createMessage('bot', 'followUp') as any;
    followUpMessage.followUps = sampleFollowUps;
    
    return [textMessage, followUpMessage];
  }

  // Response for scheduling requests
  private async getScheduleResponse(): Promise<ChatMessage[]> {
    const textMessage = createMessage('bot', 'text') as any;
    textMessage.content = "I'd be happy to help you schedule a meeting. What type of meeting would you like to create?";
    
    const quickRepliesMessage = createMessage('bot', 'quickReplies') as any;
    quickRepliesMessage.content = "Select a meeting type:";
    quickRepliesMessage.options = [
      { id: 'team-meeting', text: 'Team meeting' },
      { id: 'one-on-one', text: '1:1 meeting' },
      { id: 'project-review', text: 'Project review' },
    ];
    
    return [textMessage, quickRepliesMessage];
  }

  // Help response with available commands
  private async getHelpResponse(): Promise<ChatMessage[]> {
    const textMessage = createMessage('bot', 'text') as any;
    textMessage.content = "I can help you with various meeting-related tasks. Here are some things you can ask me:";
    
    const cardMessage = createMessage('bot', 'card') as any;
    cardMessage.title = "Available Commands";
    cardMessage.description = 
      "• Show my upcoming meetings\n" +
      "• Show agenda for next meeting\n" +
      "• Show my follow-up tasks\n" +
      "• Schedule a new meeting\n" +
      "• Prepare meeting summary\n" +
      "• Find a meeting slot";
    
    return [textMessage, cardMessage];
  }

  // Default response when no specific pattern is matched
  private async getDefaultResponse(content: string): Promise<ChatMessage[]> {
    const textMessage = createMessage('bot', 'text') as any;
    textMessage.content = `I understand you're asking about "${content}". How would you like me to help with that?`;
    
    const quickRepliesMessage = createMessage('bot', 'quickReplies') as any;
    quickRepliesMessage.content = "I can help with:";
    quickRepliesMessage.options = [
      { id: 'meetings', text: 'Meeting management' },
      { id: 'agenda', text: 'Agenda creation' },
      { id: 'followups', text: 'Follow-up tasks' },
      { id: 'help', text: 'Show all commands' },
    ];
    
    return [textMessage, quickRepliesMessage];
  }
}

// Export a singleton instance of the service
export const chatService = new MockChatService();