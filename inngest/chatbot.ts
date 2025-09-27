import { z } from 'zod'
import { inngest } from './clint'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Event schema for chatbot interactions
const chatbotEventSchema = z.object({
  userId: z.string().uuid(),
  message: z.string().min(1),
  sessionId: z.string().optional(),
  context: z.object({
    userName: z.string().optional(),
    userEmail: z.string().optional(),
    currentPage: z.string().optional(),
    recentMeetings: z.array(z.string()).optional()
  }).optional()
})

type ChatbotEvent = z.infer<typeof chatbotEventSchema>

// System prompt for the chatbot with professional tone and meeting focus
const SYSTEM_PROMPT = `You are MeetUp Buddy Assistant, a professional and friendly AI assistant specialized in helping users manage their meetings and schedules. 

Your personality traits:
- Professional yet warm and approachable
- Use the user's name as a respectful pet name (e.g., "Dear [Name]", "[Name], my friend", "Hey there, [Name]")
- Knowledgeable about meeting management, scheduling, and productivity
- Helpful and proactive in suggesting solutions
- Clear and concise in communication

Your expertise includes:
- Meeting scheduling and coordination
- Agenda planning and meeting preparation
- Follow-up task management
- Calendar optimization
- Team collaboration best practices
- Meeting etiquette and productivity tips

Guidelines:
- Always maintain a professional tone while being friendly
- Address users by their name in a caring, pet-like manner
- Focus responses on meeting and productivity-related topics
- Offer practical, actionable advice
- Ask clarifying questions when needed
- Keep responses concise but comprehensive

If asked about topics outside of meetings and productivity, politely redirect the conversation back to how you can help with their meeting management needs.`

// Response templates for different scenarios
const RESPONSE_TEMPLATES = {
  greeting: (userName: string) => 
    `Hello there, ${userName}! 👋 I'm your MeetUp Buddy Assistant. I'm here to help you master your meetings and boost your productivity. What can I assist you with today, dear ${userName}?`,
  
  meetingHelp: (userName: string) => 
    `Absolutely, ${userName}! I'd be delighted to help you with your meeting needs. Whether it's scheduling, planning agendas, or managing follow-ups, I've got you covered, my friend.`,
  
  schedulingAssistance: (userName: string) => 
    `Perfect timing, ${userName}! Let me help you get that meeting scheduled efficiently. I can assist with finding the best time slots, coordinating with participants, and setting up all the details you need.`,
  
  followUpHelp: (userName: string) => 
    `Great question, dear ${userName}! Follow-ups are crucial for meeting success. I can help you track action items, set reminders, and ensure nothing falls through the cracks.`,
  
  redirect: (userName: string) => 
    `I appreciate your question, ${userName}! While I'd love to chat about everything, I'm specially designed to help you excel at meeting management and productivity. How can I assist you with your upcoming meetings or schedule optimization today?`
}

// Function to generate contextual responses based on user input
function generateChatbotResponse(message: string, userName: string, context?: ChatbotEvent['context']): string {
  const lowerMessage = message.toLowerCase()
  
  // Greeting patterns
  if (lowerMessage.match(/(hello|hi|hey|good morning|good afternoon|good evening)/)) {
    return RESPONSE_TEMPLATES.greeting(userName)
  }
  
  // Meeting scheduling patterns
  if (lowerMessage.match(/(schedule|meeting|appointment|calendar|time|when|availability)/)) {
    return RESPONSE_TEMPLATES.schedulingAssistance(userName)
  }
  
  // Follow-up patterns
  if (lowerMessage.match(/(follow up|followup|action items|tasks|reminder|track)/)) {
    return RESPONSE_TEMPLATES.followUpHelp(userName)
  }
  
  // General meeting help patterns
  if (lowerMessage.match(/(meeting|agenda|preparation|plan|organize|coordinate)/)) {
    return RESPONSE_TEMPLATES.meetingHelp(userName)
  }
  
  // Agenda-related queries
  if (lowerMessage.match(/(agenda|topics|discussion points|meeting plan)/)) {
    return `Excellent focus on preparation, ${userName}! A well-structured agenda is key to productive meetings. I can help you create comprehensive agendas that keep everyone engaged and on track. What type of meeting are you planning, dear ${userName}?`
  }
  
  // Productivity questions
  if (lowerMessage.match(/(productive|efficiency|optimize|improve|better meetings)/)) {
    return `You're thinking like a true professional, ${userName}! Meeting productivity is my specialty. I can share best practices for running efficient meetings, managing time effectively, and ensuring every meeting delivers real value. What specific aspect would you like to improve, my friend?`
  }
  
  // Default professional response with helpful suggestions
  return `Thank you for reaching out, dear ${userName}! I'm here to help you excel at meeting management. I can assist you with:

📅 **Scheduling & Coordination** - Finding perfect meeting times
📋 **Agenda Planning** - Creating structured, productive agendas  
✅ **Follow-up Management** - Tracking action items and deadlines
📊 **Meeting Analytics** - Insights to improve your meeting effectiveness
🎯 **Best Practices** - Tips for running world-class meetings

What would you like to focus on today, ${userName}? I'm excited to help you become a meeting management superstar! 🌟`
}

// Main chatbot function
const chatbotFn = inngest.createFunction(
  { id: 'meetup-buddy-chatbot' },
  { event: 'chatbot/message' },
  async ({ event, step }) => {
    if (!supabaseAdmin) {
      return {
        status: 'error',
        message: 'Supabase service credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
      }
    }

    const parsedEvent = chatbotEventSchema.parse(event.data)

    // Get user information for personalization
    const userInfo = await step.run('fetch user info', async () => {
      const { data: profile, error } = await supabaseAdmin!
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', parsedEvent.userId)
        .single()

      if (error) {
        console.warn(`Failed to fetch user profile: ${error.message}`)
        return { full_name: 'Friend', email: null }
      }

      return profile
    })

    // Extract user's first name or use "Friend" as fallback
    const userName = userInfo.full_name?.split(' ')[0] || parsedEvent.context?.userName || 'Friend'

    // Generate response based on message and context
    const response = await step.run('generate response', async () => {
      return generateChatbotResponse(parsedEvent.message, userName, parsedEvent.context)
    })

    // Store the conversation in database for context and analytics
    const conversationRecord = await step.run('store conversation', async () => {
      const { data, error } = await supabaseAdmin!
        .from('chatbot_conversations')
        .insert({
          user_id: parsedEvent.userId,
          session_id: parsedEvent.sessionId || `session_${Date.now()}`,
          user_message: parsedEvent.message,
          bot_response: response,
          context: parsedEvent.context || {},
          created_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (error) {
        console.warn(`Failed to store conversation: ${error.message}`)
        return null
      }

      return data
    })

    // Send follow-up event if the conversation indicates scheduling intent
    if (parsedEvent.message.toLowerCase().includes('schedule') || 
        parsedEvent.message.toLowerCase().includes('meeting')) {
      await step.sendEvent('trigger scheduling assistance', {
        name: 'chatbot/scheduling-intent',
        data: {
          userId: parsedEvent.userId,
          originalMessage: parsedEvent.message,
          sessionId: parsedEvent.sessionId,
          conversationId: conversationRecord?.id
        }
      })
    }

    return {
      status: 'success',
      response: response,
      userName: userName,
      conversationId: conversationRecord?.id,
      metadata: {
        timestamp: new Date().toISOString(),
        sessionId: parsedEvent.sessionId || `session_${Date.now()}`,
        responseLength: response.length,
        detectedIntent: detectIntent(parsedEvent.message)
      }
    }
  }
)

// Helper function to detect user intent
function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.match(/(schedule|book|arrange|set up|plan)/)) return 'scheduling'
  if (lowerMessage.match(/(follow up|followup|action|task|reminder)/)) return 'follow_up'
  if (lowerMessage.match(/(agenda|topics|discussion|prepare)/)) return 'agenda_planning'
  if (lowerMessage.match(/(cancel|reschedule|change|move)/)) return 'meeting_modification'
  if (lowerMessage.match(/(help|assist|support|how to)/)) return 'general_help'
  if (lowerMessage.match(/(hello|hi|hey|greeting)/)) return 'greeting'
  
  return 'general_inquiry'
}

// Additional function to handle scheduling intents detected by the chatbot
const schedulingIntentFn = inngest.createFunction(
  { id: 'chatbot-scheduling-intent' },
  { event: 'chatbot/scheduling-intent' },
  async ({ event, step }) => {
    const { userId, originalMessage, sessionId, conversationId } = event.data

    // This could trigger the existing meeting scheduler or provide guided scheduling assistance
    return await step.run('handle scheduling intent', async () => {
      // Extract potential meeting details from the message
      const potentialDetails = extractMeetingDetails(originalMessage)
      
      if (potentialDetails.hasSchedulingInfo) {
        // If enough info is detected, we could trigger the scheduling function
        await step.sendEvent('schedule meeting from chat', {
          name: 'meeting/schedule',
          data: {
            prompt: originalMessage,
            requesterId: userId,
            ...potentialDetails
          }
        })
        
        return {
          status: 'scheduling_triggered',
          message: 'Detected scheduling intent and triggered meeting scheduler'
        }
      }

      return {
        status: 'needs_more_info',
        message: 'Scheduling intent detected but needs more details',
        suggestedQuestions: [
          'What time works best for you?',
          'Who should be invited to this meeting?',
          'How long should the meeting be?',
          'What\'s the main topic or agenda?'
        ]
      }
    })
  }
)

// Helper function to extract meeting details from natural language
function extractMeetingDetails(message: string) {
  const details: any = {
    hasSchedulingInfo: false
  }

  // Basic time detection (this could be enhanced with chrono-node like in the scheduler)
  const timePatterns = [
    /(?:at |@)(\d{1,2}(?::\d{2})?(?:\s*(?:am|pm))?)/i,
    /(?:tomorrow|next week|monday|tuesday|wednesday|thursday|friday)/i,
    /(?:in \d+ (?:hours?|days?|weeks?))/i
  ]

  const hasTimeInfo = timePatterns.some(pattern => pattern.test(message))
  
  // Duration detection
  const durationMatch = message.match(/(?:for |lasting )(\d+)\s*(minutes?|hours?|hrs?)/i)
  if (durationMatch) {
    const value = parseInt(durationMatch[1])
    const unit = durationMatch[2].toLowerCase()
    details.durationMinutes = unit.startsWith('h') ? value * 60 : value
  }

  // Participant detection
  const participantPatterns = [
    /with ([\w\s,]+)/i,
    /invite ([\w\s,]+)/i,
    /including ([\w\s,]+)/i
  ]

  participantPatterns.forEach(pattern => {
    const match = message.match(pattern)
    if (match) {
      details.suggestedParticipants = match[1].split(/,|\s+and\s+/).map((p: string) => p.trim())
    }
  })

  details.hasSchedulingInfo = hasTimeInfo || details.durationMinutes || details.suggestedParticipants

  return details
}

export { chatbotFn, schedulingIntentFn }
export default chatbotFn