'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreHorizontal,
  Paperclip,
  Smile,
  Users,
  Hash,
  Plus,
  Settings,
  Star,
  Archive,
  Check,
  Clock,
  Crown
} from 'lucide-react'

// Type definitions
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
  sender: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file' | 'voice' | 'system'
  status: 'sending' | 'sent' | 'delivered' | 'read'
  isOwnMessage: boolean
  avatar?: string
  replyTo?: string
  reactions?: { emoji: string; users: string[] }[]
}

interface Conversation {
  id: number
  name: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isGroup: boolean
  avatar: string
  color: string
  isOnline: boolean
  type: 'group' | 'direct'
  participants?: User[]
  description?: string
}

// Mock data
const conversations: Conversation[] = [
  {
    id: 1,
    name: "Engineering Team",
    lastMessage: "Great work on the new feature deployment!",
    lastMessageTime: "2m ago",
    unreadCount: 3,
    isGroup: true,
    avatar: "ET",
    color: "bg-blue-500",
    isOnline: true,
    type: "group"
  },
  {
    id: 2,
    name: "Alice Johnson",
    lastMessage: "Can we schedule the meeting for tomorrow?",
    lastMessageTime: "5m ago",
    unreadCount: 1,
    isGroup: false,
    avatar: "/avatars/alice.png",
    color: "bg-green-500",
    isOnline: true,
    type: "direct"
  },
  {
    id: 3,
    name: "Product Design",
    lastMessage: "New mockups are ready for review",
    lastMessageTime: "12m ago",
    unreadCount: 0,
    isGroup: true,
    avatar: "PD",
    color: "bg-purple-500",
    isOnline: false,
    type: "group"
  },
  {
    id: 4,
    name: "Bob Smith",
    lastMessage: "Thanks for the quick turnaround!",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    isGroup: false,
    avatar: "/avatars/bob.png",
    color: "bg-orange-500",
    isOnline: false,
    type: "direct"
  },
  {
    id: 5,
    name: "Marketing Campaign",
    lastMessage: "Campaign metrics look great this week",
    lastMessageTime: "2h ago",
    unreadCount: 5,
    isGroup: true,
    avatar: "MC",
    color: "bg-pink-500",
    isOnline: true,
    type: "group"
  }
]

const initialMessages: Message[] = [
  {
    id: "1",
    senderId: "alice",
    sender: "Alice Johnson",
    content: "Hey everyone! Just wanted to share an update on the Q4 project. We're making great progress and should be on track for the December deadline.",
    timestamp: "10:30 AM",
    type: "text",
    status: "read",
    isOwnMessage: false,
    avatar: "/avatars/alice.png"
  },
  {
    id: "2",
    senderId: "current-user",
    sender: "You",
    content: "That's fantastic news! The client will be thrilled to hear about the progress.",
    timestamp: "10:32 AM",
    type: "text",
    status: "read",
    isOwnMessage: true,
    avatar: "/avatars/you.png"
  },
  {
    id: "3",
    senderId: "bob",
    sender: "Bob Smith",
    content: "I agree! The team has been doing outstanding work. Should we schedule a client presentation for next week?",
    timestamp: "10:35 AM",
    type: "text",
    status: "read",
    isOwnMessage: false,
    avatar: "/avatars/bob.png"
  },
  {
    id: "4",
    senderId: "alice",
    sender: "Alice Johnson",
    content: "Great idea! I'll coordinate with the client and find a suitable time that works for everyone.",
    timestamp: "10:37 AM",
    type: "text",
    status: "read",
    isOwnMessage: false,
    avatar: "/avatars/alice.png"
  },
  {
    id: "5",
    senderId: "current-user",
    sender: "You",
    content: "Perfect. I'll prepare the presentation materials and demo environment.",
    timestamp: "10:38 AM",
    type: "text",
    status: "read",
    isOwnMessage: true,
    avatar: "/avatars/you.png"
  }
]

const groupMembers = [
  { name: 'Alice Johnson', status: 'online' },
  { name: 'Bob Smith', status: 'online' },
  { name: 'Carol Davis', status: 'offline' },
  { name: 'David Wilson', status: 'away' }
]

export default function ChatsPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0])
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: "current-user",
        sender: "You",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: "text",
        status: "sent",
        isOwnMessage: true,
        avatar: "/avatars/you.png"
      }
      
      setMessages(prev => [...prev, newMsg])
      setNewMessage("")
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'read':
        return <Check className="h-3 w-3 text-teal-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedConversation.id === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    {conversation.isGroup ? (
                      <div className={`${conversation.color} h-full w-full flex items-center justify-center text-white font-semibold`}>
                        {conversation.avatar}
                      </div>
                    ) : (
                      <>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      {conversation.isGroup && <Hash className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="min-w-[1.25rem] h-5 text-xs px-1.5">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {selectedConversation.isGroup ? (
                <div className={`${selectedConversation.color} h-full w-full flex items-center justify-center text-white font-semibold`}>
                  {selectedConversation.avatar}
                </div>
              ) : (
                <>
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                </>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold flex items-center space-x-2">
                <span>{selectedConversation.name}</span>
                {selectedConversation.isGroup && <Hash className="h-4 w-4 text-muted-foreground" />}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedConversation.isGroup ? 
                  `${groupMembers.length} members` : 
                  selectedConversation.isOnline ? 'Online' : 'Last seen 2h ago'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  Star Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[70%] ${message.isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {!message.isOwnMessage && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`space-y-1 ${message.isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!message.isOwnMessage && (
                      <p className="text-sm font-medium text-muted-foreground">{message.sender}</p>
                    )}
                    <div className={`rounded-lg px-4 py-2 ${
                      message.isOwnMessage 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                      {message.isOwnMessage && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-end space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[40px]"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Member List (for groups) */}
      {selectedConversation.isGroup && (
        <div className="w-64 border-l">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Group Members</h3>
            <div className="space-y-3">
              {groupMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${getStatusColor(member.status)} rounded-full border border-background`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {member.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}