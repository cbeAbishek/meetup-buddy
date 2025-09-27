import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// Request schema - updated to handle both authenticated and unauthenticated users
const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  userId: z.string().optional(), // Make optional for non-authenticated users
  sessionId: z.string().optional(),
  context: z.object({
    userName: z.string().optional(),
    userEmail: z.string().optional(),
    currentPage: z.string().optional(),
    recentMeetings: z.array(z.string()).optional(),
    isAuthenticated: z.boolean().default(false)
  }).optional(),
  immediateResponse: z.boolean().default(true)
})

// Generate professional AI response using Gemini AI
async function generateGeminiResponse(message: string, context: any): Promise<string> {
  try {
    const userName = context?.userName || 'Friend'
    const isAuthenticated = context?.isAuthenticated || false
    const currentPage = context?.currentPage || '/'
    
    // Create a professional system prompt for MeetUp Buddy
    const systemPrompt = `You are MeetUp Buddy Assistant, a professional and friendly AI assistant specialized in helping users manage meetings, webinars, and schedules.

**Your Personality:**
- Professional yet warm and approachable
- Use the user's name respectfully (e.g., "Hello ${userName}", "Dear ${userName}")
- Friendly and supportive tone
- Knowledgeable about meeting management and productivity
- Helpful and proactive in suggesting solutions

**Your Expertise:**
- Meeting scheduling and coordination
- Webinar planning and management
- Agenda creation and meeting preparation
- Follow-up task management
- Calendar optimization
- Team collaboration best practices
- Meeting productivity tips
- Professional communication

**User Context:**
- User name: ${userName}
- Authentication status: ${isAuthenticated ? 'Signed in' : 'Not signed in'}
- Current page: ${currentPage}

**Response Guidelines:**
1. Always maintain a professional yet friendly tone
2. Address the user by their name respectfully
3. Focus on meeting/webinar/schedule-related topics
4. If user is not signed in and asks for personalized features, politely suggest signing in
5. Provide actionable, practical advice
6. Keep responses concise but comprehensive
7. Use appropriate emojis sparingly for friendliness
8. If asked about non-meeting topics, politely redirect to your expertise area

Respond to the user's message with helpful, professional assistance.`

    const userPrompt = `User message: "${message}"

Please provide a helpful, professional response focused on meeting and webinar support.`
    
    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`)
    const response = result.response.text()
    
    return response || `Hello ${userName}! I'm here to help you with your meeting and webinar needs. How can I assist you today? 😊`
    
  } catch (error) {
    console.error('Gemini API error:', error)
    // Fallback response if Gemini fails
    const userName = context?.userName || 'Friend'
    return `Hello ${userName}! I'm your MeetUp Buddy Assistant. I'm here to help you master your meetings and boost your productivity. How can I assist you with scheduling, planning agendas, or managing follow-ups today? 🌟`
  }
}

// Quick response for immediate feedback while Gemini processes
function getQuickResponse(message: string, userName: string, isAuthenticated: boolean): string {
  const lowerMessage = message.toLowerCase()
  
  if (!isAuthenticated && (lowerMessage.includes('schedule') || lowerMessage.includes('calendar') || lowerMessage.includes('personal'))) {
    return `Hello ${userName}! 👋 I'd love to help you with personalized meeting features. For the best experience with scheduling and calendar management, I recommend signing in to access all MeetUp Buddy features. Let me get you a detailed response...`
  }
  
  if (lowerMessage.includes('meeting') || lowerMessage.includes('webinar')) {
    return `Great question, ${userName}! I'm processing your meeting/webinar request and will provide you with comprehensive assistance in just a moment... 📅`
  }
  
  return `Thank you for your message, ${userName}! I'm your MeetUp Buddy Assistant and I'm preparing a detailed response for you. One moment please... ✨`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, userId, sessionId, context } = chatRequestSchema.parse(body)

    const isAuthenticated = !!(userId && context?.isAuthenticated)
    const userName = context?.userName || 'Friend'
    const finalSessionId = sessionId || `session_${Date.now()}_${userId || 'anonymous'}`

    // Generate AI response using Gemini
    const aiResponse = await generateGeminiResponse(message, {
      ...context,
      userName,
      isAuthenticated
    })

    // For MVP, we're just returning the response without database storage
    // In production, you would store conversations in your database

    // Return immediate AI-generated response
    return NextResponse.json({
      success: true,
      response: aiResponse,
      userName,
      sessionId: finalSessionId,
      isAuthenticated,
      needsSignIn: !isAuthenticated && (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('personal')),
      message: 'AI response generated successfully'
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    // Return a friendly error response
    return NextResponse.json(
      { 
        success: false,
        response: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment, and I'll be happy to help you with your meeting needs! 🔧",
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// For MVP, we don't need conversation history storage
// In production, you can implement this to store and retrieve chat history