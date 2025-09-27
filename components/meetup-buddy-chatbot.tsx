'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Using custom scroll div instead of ScrollArea component
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  userName?: string
}

interface ChatbotProps {
  className?: string
  defaultMinimized?: boolean
  context?: {
    currentPage?: string
    recentMeetings?: string[]
  }
}

export default function MeetupBuddyChatbot({ 
  className = '', 
  defaultMinimized = false,
  context 
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { user } = useAuth()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat is expanded
  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus()
    }
  }, [isMinimized])

  // Send welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0 && user) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hello there, ${user.user_metadata?.full_name?.split(' ')[0] || 'Friend'}! 👋 I'm your MeetUp Buddy Assistant. I'm here to help you master your meetings and boost your productivity. What can I assist you with today?`,
        sender: 'bot',
        timestamp: new Date(),
        userName: user.user_metadata?.full_name?.split(' ')[0] || 'Friend'
      }
      setMessages([welcomeMessage])
    }
  }, [user, messages.length])

  const sendMessage = async () => {
    if (!inputValue.trim() || !user || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Send message to API
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          userId: user.id,
          sessionId,
          context: {
            userName: user.user_metadata?.full_name?.split(' ')[0],
            userEmail: user.email,
            currentPage: context?.currentPage || window.location.pathname,
            recentMeetings: context?.recentMeetings || []
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // For now, we'll simulate the bot response since it's async
      // In a real implementation, you'd use webhooks or polling to get the actual response
      setTimeout(() => {
        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          content: generateQuickResponse(userMessage.content, user.user_metadata?.full_name?.split(' ')[0] || 'Friend'),
          sender: 'bot',
          timestamp: new Date(),
          userName: user.user_metadata?.full_name?.split(' ')[0] || 'Friend'
        }
        setMessages(prev => [...prev, botMessage])
        setIsLoading(false)
      }, 1500) // Simulate processing time

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: "I'm sorry, I encountered an issue processing your message. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  // Quick response generator for immediate feedback (while waiting for Inngest processing)
  const generateQuickResponse = (message: string, userName: string): string => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
      return `Perfect, ${userName}! I'm processing your scheduling request. I'll help you find the best time slots and coordinate with all participants. Let me gather some details for you...`
    }
    
    if (lowerMessage.includes('agenda') || lowerMessage.includes('plan')) {
      return `Excellent focus on preparation, ${userName}! I'm analyzing your request and will help you create a comprehensive agenda that ensures productive discussions. Give me just a moment...`
    }
    
    if (lowerMessage.includes('follow') || lowerMessage.includes('task')) {
      return `Great thinking, dear ${userName}! Follow-ups are crucial for meeting success. I'm preparing some actionable recommendations for tracking and managing your meeting outcomes...`
    }
    
    return `Thank you for your message, ${userName}! I'm processing your request and will provide you with detailed, professional assistance in just a moment. I'm excited to help you excel at meeting management! 🌟`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className="w-96 h-[500px] flex flex-col shadow-2xl border-0 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            MeetUp Buddy Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-blue-500 h-8 w-8 p-0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={`text-xs ${
                      message.sender === 'user' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[80%] ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-3 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}>
                      {message.content}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg rounded-bl-sm p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about meetings, scheduling, or productivity..."
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your professional meeting assistant powered by AI
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}