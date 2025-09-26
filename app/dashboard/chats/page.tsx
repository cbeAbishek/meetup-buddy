'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Send, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Mic,
  Check,
  CheckCheck,
  Clock,
  Users,
  Crown,
  Settings,
  Archive,
  Pin,
  Trash2,
  Reply,
  Forward
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { ProtectedRoute } from '@/components/protected-route'
import CreateGroupModal from '@/components/create-group-modal'

// Mock data types
interface User {
  id: string
  name: string
  avatar?: string
  role: 'host' | 'member' | 'leader'
  status: 'online' | 'offline' | 'away'
  lastSeen?: Date
  email?: string
  department?: string
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'voice' | 'system'
  status: 'sending' | 'sent' | 'delivered' | 'read'
  replyTo?: string
  reactions?: { emoji: string; users: string[] }[]
}

interface ChatRoom {
  id: string
  name: string
  type: 'direct' | 'group'
  avatar?: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  isPinned: boolean
  isArchived: boolean
  groupLeader?: string
  description?: string
}

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'Sarah Johnson', role: 'host', status: 'online', avatar: '/avatars/sarah.jpg', email: 'sarah@company.com', department: 'Management' },
  { id: '2', name: 'Mike Chen', role: 'leader', status: 'online', avatar: '/avatars/mike.jpg', email: 'mike@company.com', department: 'Engineering' },
  { id: '3', name: 'Emily Davis', role: 'member', status: 'away', avatar: '/avatars/emily.jpg', email: 'emily@company.com', department: 'Marketing' },
  { id: '4', name: 'Alex Rodriguez', role: 'member', status: 'offline', lastSeen: new Date('2024-01-15T10:30:00'), email: 'alex@company.com', department: 'Sales' },
  { id: '5', name: 'Jessica Wang', role: 'leader', status: 'online', avatar: '/avatars/jessica.jpg', email: 'jessica@company.com', department: 'Product' },
  { id: '6', name: 'David Kim', role: 'member', status: 'online', avatar: '/avatars/david.jpg', email: 'david@company.com', department: 'Engineering' },
]

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    content: 'Hey team! Ready for tomorrow\'s quarterly review meeting?',
    timestamp: new Date('2024-01-15T09:00:00'),
    type: 'text',
    status: 'read'
  },
  {
    id: '2',
    senderId: '1',
    content: 'Absolutely! I\'ve prepared the agenda and sent it to everyone.',
    timestamp: new Date('2024-01-15T09:15:00'),
    type: 'text',
    status: 'read'
  },
  {
    id: '3',
    senderId: '3',
    content: 'Great! Should I prepare the Q3 metrics report?',
    timestamp: new Date('2024-01-15T09:30:00'),
    type: 'text',
    status: 'read'
  },
  {
    id: '4',
    senderId: '2',
    content: 'Yes, that would be perfect. Also, let\'s discuss the new project timeline.',
    timestamp: new Date('2024-01-15T09:45:00'),
    type: 'text',
    status: 'delivered'
  },
  {
    id: '5',
    senderId: '1',
    content: 'I\'ll set up the presentation slides. Meeting room is booked for 2 PM.',
    timestamp: new Date('2024-01-15T10:00:00'),
    type: 'text',
    status: 'sent'
  }
]

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Q4 Planning Team',
    type: 'group',
    participants: mockUsers.slice(0, 4),
    unreadCount: 3,
    isPinned: true,
    isArchived: false,
    groupLeader: '2',
    description: 'Q4 planning and strategy discussions',
    lastMessage: mockMessages[4]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    type: 'direct',
    participants: [mockUsers[0]],
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    lastMessage: {
      id: '6',
      senderId: '1',
      content: 'Thanks for the meeting update!',
      timestamp: new Date('2024-01-15T08:30:00'),
      type: 'text',
      status: 'read'
    }
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    type: 'group',
    participants: [mockUsers[1], mockUsers[2], mockUsers[4]],
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    groupLeader: '5',
    description: 'Marketing campaign coordination',
    lastMessage: {
      id: '7',
      senderId: '5',
      content: 'Campaign metrics look great this week!',
      timestamp: new Date('2024-01-15T07:45:00'),
      type: 'text',
      status: 'delivered'
    }
  },
  {
    id: '4',
    name: 'Dev Team Standup',
    type: 'group',
    participants: mockUsers.slice(2, 6),
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    groupLeader: '6',
    description: 'Daily standup and development updates',
    lastMessage: {
      id: '8',
      senderId: '6',
      content: 'Sprint review scheduled for Friday',
      timestamp: new Date('2024-01-14T16:20:00'),
      type: 'text',
      status: 'read'
    }
  }
]

export default function ChatsPage() {
  return (
    <ProtectedRoute>
      <ChatsContent />
    </ProtectedRoute>
  )
}

function ChatsContent() {
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(mockChatRooms)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { user } = useAuth()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !user) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'sent' } : msg
      ))
    }, 1000)

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ))
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-teal-500" />
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-400'
    }
  }

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'host':
        return <Crown className="h-3 w-3 text-yellow-500" />
      case 'leader':
        return <Users className="h-3 w-3 text-teal-500" />
      default:
        return null
    }
  }

  const handleCreateGroup = (data: any) => {
    const newGroup: ChatRoom = {
      id: Date.now().toString(),
      name: data.name,
      type: 'group',
      participants: mockUsers.filter(u => data.participants.includes(u.id)),
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      groupLeader: user?.id,
      description: data.description
    }
    
    setChatRooms(prev => [newGroup, ...prev])
    setSelectedChat(newGroup)
  }

  const filteredChats = chatRooms.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
            <Button variant="ghost" size="sm" className="text-teal-600">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-gray-100 border-0 focus:bg-white focus:ring-1 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  selectedChat?.id === chat.id 
                    ? "bg-teal-50 border border-teal-200" 
                    : "hover:bg-gray-100"
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                      {chat.type === 'group' ? (
                        <Users className="h-6 w-6" />
                      ) : (
                        chat.name.charAt(0)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {chat.type === 'direct' && (
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white",
                      getStatusColor(chat.participants[0]?.status || 'offline')
                    )} />
                  )}
                  {chat.isPinned && (
                    <Pin className="absolute -top-1 -right-1 h-4 w-4 text-teal-500 bg-white rounded-full p-0.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.name}
                    </h3>
                    {chat.type === 'group' && chat.groupLeader && (
                      <div className="flex items-center">
                        {getRoleIcon(mockUsers.find(u => u.id === chat.groupLeader)?.role || 'member')}
                      </div>
                    )}
                  </div>
                  
                  {chat.lastMessage && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500 truncate flex-1">
                        {chat.lastMessage.senderId === user?.id ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </p>
                      <div className="flex items-center gap-1">
                        {chat.lastMessage.senderId === user?.id && getStatusIcon(chat.lastMessage.status)}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      {chat.lastMessage?.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-teal-500 text-white text-xs h-5 min-w-5 px-1.5">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                    {selectedChat.type === 'group' ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      selectedChat.name.charAt(0)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    {selectedChat.name}
                    {selectedChat.type === 'group' && selectedChat.groupLeader && (
                      getRoleIcon(mockUsers.find(u => u.id === selectedChat.groupLeader)?.role || 'member')
                    )}
                  </h2>
                  {selectedChat.type === 'group' ? (
                    <p className="text-sm text-gray-500">
                      {selectedChat.participants.length} participants
                      {selectedChat.participants.filter(p => p.status === 'online').length > 0 && 
                        ` • ${selectedChat.participants.filter(p => p.status === 'online').length} online`
                      }
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {selectedChat.participants[0]?.status === 'online' ? 'Online' : 
                       selectedChat.participants[0]?.status === 'away' ? 'Away' : 
                       `Last seen ${selectedChat.participants[0]?.lastSeen?.toLocaleString()}`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice Call</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Video className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Video Call</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>More Options</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => {
                const sender = mockUsers.find(u => u.id === message.senderId)
                const isOwn = message.senderId === user?.id

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2",
                      isOwn ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {!isOwn && selectedChat.type === 'group' && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={sender?.avatar} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                          {sender?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={cn(
                      "group relative max-w-[70%]",
                      isOwn ? "text-right" : "text-left"
                    )}>
                      {!isOwn && selectedChat.type === 'group' && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium text-teal-600">
                            {sender?.name}
                          </span>
                          {sender && getRoleIcon(sender.role)}
                        </div>
                      )}

                      <div className={cn(
                        "inline-block p-3 rounded-2xl shadow-sm",
                        isOwn 
                          ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-br-md"
                          : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                      )}>
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>

                      <div className={cn(
                        "flex items-center gap-1 mt-1 text-xs text-gray-400",
                        isOwn ? "justify-end" : "justify-start"
                      )}>
                        <span>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {isOwn && getStatusIcon(message.status)}
                      </div>

                      {/* Message options on hover */}
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg p-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Forward className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {isTyping && (
                <div className="flex items-end gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                      ?
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl rounded-bl-md p-3 border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Paperclip className="h-4 w-4" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="pr-20 bg-gray-100 border-0 focus:bg-white focus:ring-1 focus:ring-teal-500 rounded-2xl"
                  maxLength={1000}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-teal-500 hover:bg-teal-600 rounded-full h-10 w-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-teal-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      )}
    </div>
  )
}
