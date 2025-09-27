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
  Settings
} from 'lucide-react'

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')

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
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {/* Empty state - no conversations */}
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                    <p className="text-xs text-muted-foreground">Start a new conversation to begin chatting</p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {selectedChat ? (
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">Team Chat</CardTitle>
                    <p className="text-xs text-muted-foreground">5 members online</p>
                  </div>
                </div>
              ) : (
                <CardTitle>Select a conversation</CardTitle>
              )}
              
              {selectedChat && (
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
              {selectedChat ? (
                <div className="space-y-4">
                  {/* Messages Area */}
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {/* Empty state - no messages */}
                      <div className="text-center py-12">
                        <div className="text-muted-foreground">
                          <p className="text-sm">No messages yet</p>
                          <p className="text-xs">Be the first to send a message</p>
                        </div>
                      </div>
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
                          // Handle send message
                          setMessage('')
                        }
                      }}
                    />
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      disabled={!message.trim()}
                      onClick={() => {
                        if (message.trim()) {
                          // Handle send message
                          setMessage('')
                        }
                      }}
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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No active conversations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No messages sent today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Badge variant="secondary">Online</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Members online now
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <Badge variant="destructive">New</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No unread messages
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}