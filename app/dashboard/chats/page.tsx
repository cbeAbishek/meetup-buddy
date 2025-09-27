'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreHorizontal,
  Paperclip,
  Smile,
  Users,
  Plus,
  Settings,
  Clock,
  CheckCircle2
} from 'lucide-react'

// Mock data
const mockData = {
  chats: [
    {
      id: "chat1",
      type: "direct",
      name: "Alice Chen",
      participants: ["user1", "currentUser"],
      lastMessage: {
        id: "msg1",
        senderId: "user1",
        content: "Hey! Can we review the product roadmap slides before tomorrow's meeting?",
        timestamp: "2025-09-27T15:30:00Z",
        type: "text"
      },
      unreadCount: 2,
      isOnline: true,
      avatar: "AC",
      status: "online"
    },
    {
      id: "chat2", 
      type: "group",
      name: "Sprint Planning",
      participants: ["user1", "user2", "user3", "currentUser"],
      lastMessage: {
        id: "msg2",
        senderId: "user2",
        content: "I've updated the story estimates in Jira",
        timestamp: "2025-09-27T14:45:00Z",
        type: "text"
      },
      unreadCount: 0,
      avatar: "SP",
      color: "#F59E0B",
      memberCount: 4
    },
    {
      id: "chat3",
      type: "direct", 
      name: "Bob Smith",
      participants: ["user2", "currentUser"],
      lastMessage: {
        id: "msg3",
        senderId: "currentUser",
        content: "The API integration looks good. Ready for testing!",
        timestamp: "2025-09-27T13:20:00Z",
        type: "text"
      },
      unreadCount: 0,
      isOnline: true,
      avatar: "BS",
      status: "online"
    },
    {
      id: "chat4",
      type: "group",
      name: "Design Reviews",
      participants: ["user1", "user3", "user5", "currentUser"],
      lastMessage: {
        id: "msg4",
        senderId: "user3",
        content: "📎 Figma mockups for the new dashboard layout",
        timestamp: "2025-09-27T12:15:00Z",
        type: "file"
      },
      unreadCount: 1,
      avatar: "DR",
      color: "#EC4899",
      memberCount: 4
    }
  ],
  messages: {
    "chat1": [
      {
        id: "msg1",
        senderId: "user1",
        senderName: "Alice Chen",
        senderAvatar: "AC",
        content: "Hey! Can we review the product roadmap slides before tomorrow's meeting?",
        timestamp: "2025-09-27T15:30:00Z",
        type: "text",
        reactions: [],
        edited: false
      },
      {
        id: "msg2",
        senderId: "currentUser",
        senderName: "You",
        senderAvatar: "YU",
        content: "Sure! I'll send them over in 10 minutes. Do you want to do a quick call to go through them?",
        timestamp: "2025-09-27T15:32:00Z",
        type: "text",
        reactions: [{ emoji: "👍", users: ["user1"] }],
        edited: false
      },
      {
        id: "msg3",
        senderId: "user1", 
        senderName: "Alice Chen",
        senderAvatar: "AC",
        content: "Perfect! Let's do a 15-minute call at 4 PM. I'll create a quick meeting invite.",
        timestamp: "2025-09-27T15:33:00Z",
        type: "text",
        reactions: [],
        edited: false
      }
    ],
    "chat2": [
      {
        id: "msg4",
        senderId: "user2",
        senderName: "Bob Smith",
        senderAvatar: "BS", 
        content: "Morning team! Ready for sprint planning?",
        timestamp: "2025-09-27T09:00:00Z",
        type: "text",
        reactions: [{ emoji: "🚀", users: ["user1", "user3"] }],
        edited: false
      },
      {
        id: "msg5",
        senderId: "user3",
        senderName: "Carol Jones",
        senderAvatar: "CJ",
        content: "Yes! I have the user stories prioritized. Sharing the updated backlog now.",
        timestamp: "2025-09-27T09:05:00Z", 
        type: "text",
        reactions: [],
        edited: false
      },
      {
        id: "msg6",
        senderId: "user2",
        senderName: "Bob Smith",
        senderAvatar: "BS",
        content: "I've updated the story estimates in Jira",
        timestamp: "2025-09-27T14:45:00Z",
        type: "text",
        reactions: [],
        edited: false
      }
    ]
  },
  analytics: {
    activeChats: 4,
    totalMessages: 156,
    messagesThisWeek: 28,
    averageResponseTime: "12m",
    unreadMessages: 6,
    onlineMembers: 3
  }
}

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('chat1')
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [data] = useState(mockData)

  const filteredChats = data.chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedChatData = selectedChat ? data.chats.find(c => c.id === selectedChat) : null
  const chatMessages = selectedChat ? (data.messages as any)[selectedChat] || [] : []

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const sendMessage = () => {
    if (message.trim() && selectedChat) {
      // In a real app, this would send the message to the backend
      setMessage('')
    }
  }

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Chat</h1>
            <p className="text-muted-foreground">Connect with your team members</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        </div>

        {/* Chat Interface */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Conversations Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversations</span>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedChat === chat.id ? 'bg-muted border-primary/20 border' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className={chat.type === 'group' ? '' : 'h-10 w-10'} style={chat.color ? { backgroundColor: chat.color } : {}}>
                            <AvatarFallback className={chat.color ? 'text-white' : ''}>
                              {chat.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {chat.type === 'direct' && chat.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{chat.name}</p>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground truncate">
                              {chat.lastMessage.type === 'file' 
                                ? chat.lastMessage.content 
                                : chat.lastMessage.content.length > 30 
                                  ? chat.lastMessage.content.substring(0, 30) + '...' 
                                  : chat.lastMessage.content}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(chat.lastMessage.timestamp)}
                            </span>
                          </div>
                          {chat.type === 'group' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {chat.memberCount} members
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {selectedChatData ? (
                <div className="flex items-center space-x-3">
                  <Avatar className={selectedChatData.color ? '' : 'h-10 w-10'} style={selectedChatData.color ? { backgroundColor: selectedChatData.color } : {}}>
                    <AvatarFallback className={selectedChatData.color ? 'text-white' : ''}>
                      {selectedChatData.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{selectedChatData.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {selectedChatData.type === 'direct' 
                        ? (selectedChatData.isOnline ? 'Online' : 'Offline')
                        : `${selectedChatData.memberCount} members`}
                    </p>
                  </div>
                </div>
              ) : (
                <CardTitle>Select a conversation</CardTitle>
              )}
              
              {selectedChatData && (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              {selectedChatData ? (
                <div className="space-y-4">
                  {/* Messages Area */}
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4 pr-4">
                      {chatMessages.map((msg: any) => {
                        const isCurrentUser = msg.senderId === 'currentUser'
                        return (
                          <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex space-x-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">{msg.senderAvatar}</AvatarFallback>
                                </Avatar>
                              )}
                              <div className={`rounded-lg px-3 py-2 ${
                                isCurrentUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}>
                                {!isCurrentUser && (
                                  <p className="text-xs font-medium mb-1">{msg.senderName}</p>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className={`text-xs ${
                                    isCurrentUser 
                                      ? 'text-primary-foreground/70' 
                                      : 'text-muted-foreground'
                                  }`}>
                                    {formatMessageTime(msg.timestamp)}
                                  </p>
                                  {msg.reactions.length > 0 && (
                                    <div className="flex items-center space-x-1 ml-2">
                                      {msg.reactions.map((reaction: any, idx: number) => (
                                        <span key={idx} className="text-xs">
                                          {reaction.emoji} {reaction.users.length}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                  
                  <Separator />
                  
                  {/* Message Input */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && message.trim()) {
                          sendMessage()
                        }
                      }}
                    />
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      disabled={!message.trim()}
                      onClick={sendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3" />
                    <p>Select a conversation to start chatting</p>
                    <p className="text-xs mt-1">Choose from your conversations or start a new one</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.analytics.activeChats}</div>
              <p className="text-xs text-muted-foreground">
                Ongoing conversations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.analytics.messagesThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                {data.analytics.totalMessages} total messages
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Badge variant="secondary">Online</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.analytics.onlineMembers}</div>
              <p className="text-xs text-muted-foreground">
                Members online now
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.analytics.averageResponseTime}</div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}