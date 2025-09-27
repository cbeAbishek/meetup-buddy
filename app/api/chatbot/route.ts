import { NextRequest, NextResponse } from 'next/server'
import { inngest } from '@/inngest/clint'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { z } from 'zod'

// Request schema
const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  userId: z.string().uuid('Valid user ID required'),
  sessionId: z.string().optional(),
  context: z.object({
    userName: z.string().optional(),
    userEmail: z.string().optional(),
    currentPage: z.string().optional(),
    recentMeetings: z.array(z.string()).optional()
  }).optional(),
  immediateResponse: z.boolean().default(true) // Flag for immediate mock response
})

// Mock response generator for immediate feedback
function generateImmediateResponse(message: string, userName?: string): string {
  const lowerMessage = message.toLowerCase();
  const name = userName || 'there';
  
  if (lowerMessage.includes('meeting') || lowerMessage.includes('schedule')) {
    return `Hello ${name}! 📅 I'd be happy to help you with meeting management. I can assist with scheduling, finding available times, managing agendas, and tracking follow-ups. What specific meeting task can I help you with today?`;
  }
  
  if (lowerMessage.includes('agenda')) {
    return `Great question, ${name}! 📋 A well-structured agenda is key to productive meetings. I can help you create comprehensive agendas, suggest discussion topics, and ensure all important points are covered. Would you like me to help you plan an agenda for an upcoming meeting?`;
  }
  
  if (lowerMessage.includes('follow up') || lowerMessage.includes('followup')) {
    return `Excellent focus on follow-through, ${name}! ✅ I can help you track action items, set reminders, and ensure nothing falls through the cracks. Would you like me to help you organize follow-up tasks from a recent meeting?`;
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello there, ${name}! 👋 I'm your MeetUp Buddy Assistant. I'm here to help you master your meetings and boost your productivity. I can assist with scheduling, agenda planning, follow-up management, and meeting best practices. How can I help you today?`;
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `I'm here to help you excel at meeting management, ${name}! 🌟 Here's what I can do:

📅 **Meeting Scheduling** - Find perfect times and coordinate with participants
📋 **Agenda Planning** - Create structured, productive meeting agendas
✅ **Follow-up Management** - Track action items and deadlines
📊 **Meeting Insights** - Analyze and improve meeting effectiveness
🎯 **Best Practices** - Share tips for running world-class meetings

What would you like to focus on today?`;
  }
  
  if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('available')) {
    return `Perfect timing question, ${name}! ⏰ I can help you find the best meeting times that work for everyone. I can analyze calendars, suggest optimal time slots, and even handle different time zones. Would you like me to help you find the perfect time for your next meeting?`;
  }
  
  if (lowerMessage.includes('productive') || lowerMessage.includes('efficiency') || lowerMessage.includes('improve')) {
    return `You're thinking like a true professional, ${name}! 🚀 Meeting productivity is my specialty. I can share best practices for running efficient meetings, managing time effectively, and ensuring every meeting delivers real value. What specific aspect would you like to improve?`;
  }
  
  return `Thanks for reaching out, ${name}! I'm your MeetUp Buddy Assistant, specializing in meeting management and productivity. I can help you schedule meetings, plan agendas, manage follow-ups, and optimize your meeting effectiveness. What specific meeting challenge can I help you tackle today? 🎯`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, userId, sessionId, context, immediateResponse } = chatRequestSchema.parse(body)

    // Validate user exists if Supabase is available
    if (supabaseAdmin) {
      const { data: user, error } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name')
        .eq('id', userId)
        .single()

      if (error || !user) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 401 }
        )
      }
    }

    const finalSessionId = sessionId || `session_${Date.now()}_${userId}`;

    // Send event to Inngest chatbot function (async processing)
    const inngestResult = await inngest.send({
      name: 'chatbot/message',
      data: {
        userId,
        message,
        sessionId: finalSessionId,
        context
      }
    });

    // If immediate response is requested, generate and return a mock response
    if (immediateResponse) {
      const userName = context?.userName || 'Friend';
      const mockResponse = generateImmediateResponse(message, userName);
      
      return NextResponse.json({
        success: true,
        response: mockResponse,
        userName: userName,
        sessionId: finalSessionId,
        eventId: inngestResult.ids[0],
        immediate: true,
        message: 'Immediate response generated, detailed processing in background'
      });
    }

    // Otherwise, return just the event confirmation
    return NextResponse.json({
      success: true,
      eventId: inngestResult.ids[0],
      sessionId: finalSessionId,
      immediate: false,
      message: 'Message sent to chatbot successfully'
    });

  } catch (error) {
    console.error('Chatbot API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve conversation history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    let query = supabaseAdmin
      .from('chatbot_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data: conversations, error } = await query

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      conversations: conversations || [],
      count: conversations?.length || 0
    })

  } catch (error) {
    console.error('Get conversations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}