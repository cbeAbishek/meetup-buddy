'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, Minimize2, X, MessageCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  userName?: string
  needsSignIn?: boolean
}

interface ChatbotProps {
  className?: string
  defaultMinimized?: boolean
  showOnLandingPage?: boolean
  context?: {
    currentPage?: string
    recentMeetings?: string[]
  }
}

export default function MeetupBuddyChatbot({ 
  className = '', 
  defaultMinimized = true,
  showOnLandingPage = false,
  context 
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { user, loading } = useAuth()
  const isAuthenticated = !loading && !!user
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Friend'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat is expanded
  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isMinimized])

  // Send welcome message when component mounts and user interacts
  useEffect(() => {
    if (messages.length === 0 && hasInteracted && !loading) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: isAuthenticated 
          ? `Hello there, ${userName}! 👋 I'm your MeetUp Buddy Assistant. I'm here to help you master your meetings and boost your productivity. What can I assist you with today?`
          : `Hello there! 👋 I'm your MeetUp Buddy Assistant. I'm here to help you with meeting management and productivity tips. For personalized features like scheduling, I'd recommend signing in. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date(),
        userName
      }
      setMessages([welcomeMessage])
    }
  }, [hasInteracted, loading, isAuthenticated, userName, messages.length])

  const handleSignInRecommendation = () => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const redirectUrl = `/auth?redirectTo=${encodeURIComponent(currentPath)}`
      window.location.href = redirectUrl
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

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
          userId: user?.id || undefined,
          sessionId,
          context: {
            userName,
            userEmail: user?.email,
            currentPage: context?.currentPage || window.location.pathname,
            recentMeetings: context?.recentMeetings || [],
            isAuthenticated
          }
        })
      })

      const data = await response.json()

      if (data.success && data.response) {
        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          content: data.response,
          sender: 'bot',
          timestamp: new Date(),
          userName: data.userName,
          needsSignIn: data.needsSignIn || false
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: "I'm sorry, I encountered an issue processing your message. Please try again in a moment! 🔧",
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleMinimize = () => {
    setIsMinimized(true)
  }

  const handleExpand = () => {
    setIsMinimized(false)
    setHasInteracted(true)
  }

  // Responsive positioning classes
  const getPositionClasses = () => {
    if (showOnLandingPage) {
      return 'fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md lg:max-w-lg'
    }
    return 'fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl'
  }

  if (isMinimized) {
    return (
      <div className={`${getPositionClasses()} ${className}`}>
        <Button
          onClick={handleExpand}
          className="rounded-full h-14 w-14 shadow-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        {!hasInteracted && (
          <div className="absolute -top-12 -left-20 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap animate-pulse">
            Need help? Chat with MeetUp Buddy! 💬
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      <Card className="w-full h-[32rem] sm:h-[36rem] lg:h-[40rem] flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="hidden sm:inline">MeetUp Buddy Assistant</span>
            <span className="sm:hidden">MeetUp Buddy</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {!isAuthenticated && showOnLandingPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignInRecommendation}
                className="text-white hover:bg-white/20 text-xs px-2 py-1 h-7"
              >
                Sign In
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimize}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 sm:gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarFallback className={`text-xs ${
                      message.sender === 'user' 
                        ? 'bg-teal-100 text-teal-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {message.sender === 'user' ? <User className="h-3 w-3 sm:h-4 sm:w-4" /> : <Bot className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-2 sm:p-3 rounded-lg text-xs sm:text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}>
                      {message.content}
                    </div>
                    {message.needsSignIn && !isAuthenticated && (
                      <div className="mt-2">
                        <Button
                          onClick={handleSignInRecommendation}
                          size="sm"
                          className="text-xs bg-teal-600 hover:bg-teal-700 h-7"
                        >
                          Sign In for Full Features
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg rounded-bl-sm p-2 sm:p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 sm:p-4 border-t bg-gray-50/80 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about meetings, webinars, or scheduling..."
                className="flex-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm"
                disabled={isLoading}
                maxLength={500}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 px-3 transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {isAuthenticated ? 
                'Your professional meeting assistant powered by AI' :
                'Sign in for personalized meeting features'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}