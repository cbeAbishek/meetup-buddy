'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Archive
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const conversations = [
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

const messages = [
  {
    id: 1,
    sender: "Alice Johnson",
    content: "Hey everyone! Just wanted to share an update on the Q4 project. We're making great progress and should be on track for the December deadline.",
    timestamp: "10:30 AM",
    isOwnMessage: false,
    avatar: "/avatars/alice.png"
  },
  {
    id: 2,
    sender: "You",
    content: "That's fantastic news! The client will be thrilled to hear about the progress.",
    timestamp: "10:32 AM",
    isOwnMessage: true,
    avatar: "/avatars/you.png"
  },
  {
    id: 3,
    sender: "Bob Smith",
    content: "I agree! The team has been doing outstanding work. Should we schedule a client presentation for next week?",
    timestamp: "10:35 AM",
    isOwnMessage: false,
    avatar: "/avatars/bob.png"
  },
  {
    id: 4,
    sender: "Alice Johnson",
    content: "Great idea! I'll coordinate with the client and find a suitable time that works for everyone.",
    timestamp: "10:37 AM",
    isOwnMessage: false,
    avatar: "/avatars/alice.png"
  },
  {
    id: 5,
    sender: "You",
    content: "Perfect. I'll prepare the presentation materials and demo environment.",
    timestamp: "10:38 AM",
    isOwnMessage: true,
    avatar: "/avatars/you.png"
  }
]

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
                  `${Math.floor(Math.random() * 20) + 5} members` : 
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
                    <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
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
              {['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'].map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.random() > 0.5 ? 'Online' : 'Offline'}
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
