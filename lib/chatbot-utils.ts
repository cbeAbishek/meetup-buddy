// Simple session management for MeetUp Buddy Chatbot (MVP version)
// In production, you would store this in a database like Redis or PostgreSQL

interface ChatSession {
  id: string
  userId?: string
  messages: Array<{
    id: string
    content: string
    sender: 'user' | 'bot'
    timestamp: Date
  }>
  lastActivity: Date
}

// In-memory session store (use database in production)
const sessions = new Map<string, ChatSession>()

export class ChatSessionManager {
  static createSession(userId?: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: ChatSession = {
      id: sessionId,
      userId,
      messages: [],
      lastActivity: new Date()
    }
    sessions.set(sessionId, session)
    return sessionId
  }

  static getSession(sessionId: string): ChatSession | null {
    return sessions.get(sessionId) || null
  }

  static addMessage(sessionId: string, content: string, sender: 'user' | 'bot'): void {
    const session = sessions.get(sessionId)
    if (session) {
      session.messages.push({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        sender,
        timestamp: new Date()
      })
      session.lastActivity = new Date()
    }
  }

  static getRecentMessages(sessionId: string, limit: number = 10): Array<any> {
    const session = sessions.get(sessionId)
    if (session) {
      return session.messages.slice(-limit)
    }
    return []
  }

  static cleanupOldSessions(): void {
    const now = new Date()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    for (const [sessionId, session] of sessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > maxAge) {
        sessions.delete(sessionId)
      }
    }
  }
}

// Clean up old sessions every hour
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    ChatSessionManager.cleanupOldSessions()
  }, 60 * 60 * 1000) // 1 hour
}

export default ChatSessionManager