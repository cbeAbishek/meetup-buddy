'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUpRight, Users, Calendar, MessageSquare, Clock, Video, CheckCircle, Plus, Settings, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

// Mock data
const mockData = {
  analytics: {
    dashboard: {
      totalMeetings: 42,
      totalMeetingHours: 67.5,
      averageMeetingDuration: 48,
      meetingsThisWeek: 8,
      meetingHoursThisWeek: 12.5,
      participantEngagement: 87,
      onTimeRate: 92
    },
    groups: {
      totalGroups: 3,
      activeGroups: 2,
      totalMembers: 29,
      averageGroupSize: 9.7,
      messagesSent: 2595,
      messagesThisWeek: 127
    },
    chats: {
      activeChats: 4,
      totalMessages: 156,
      messagesThisWeek: 28,
      averageResponseTime: "12m",
      unreadMessages: 6
    }
  },
  recentMeetings: [
    {
      id: "meeting1",
      title: "Product Roadmap Q4 Planning",
      startTime: "2025-09-28T14:00:00Z",
      participants: ["Alice Chen", "Bob Smith", "Carol Jones"],
      status: "scheduled",
      type: "planning"
    },
    {
      id: "meeting2", 
      title: "Daily Standup - Team Alpha",
      startTime: "2025-09-28T09:00:00Z",
      participants: ["Team Alpha"],
      status: "scheduled",
      type: "standup"
    },
    {
      id: "meeting3",
      title: "Client Onboarding: TechCorp Inc",
      startTime: "2025-09-28T16:00:00Z", 
      participants: ["Frank Martinez", "Alice Chen", "Emily Wong"],
      status: "scheduled",
      type: "client"
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: "meeting",
      title: "Completed Product Roadmap Review",
      timestamp: "2025-09-27T16:30:00Z",
      participants: 5
    },
    {
      id: 2,
      type: "message",
      title: "New message in Engineering Guild",
      timestamp: "2025-09-27T15:45:00Z",
      sender: "Bob Smith"
    },
    {
      id: 3,
      type: "group",
      title: "Design System Committee updated", 
      timestamp: "2025-09-27T14:20:00Z",
      action: "member added"
    },
    {
      id: 4,
      type: "followup",
      title: "Follow-up completed: Welcome package sent",
      timestamp: "2025-09-27T13:30:00Z", 
      assignee: "Emily Wong"
    }
  ]
}

export default function DashboardPage() {
  const [data, setData] = useState(mockData)

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Video className="h-4 w-4" />
      case 'message': return <MessageSquare className="h-4 w-4" />
      case 'group': return <Users className="h-4 w-4" />
      case 'followup': return <CheckCircle className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your meetings.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.dashboard.totalMeetings}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {data.analytics.dashboard.meetingsThisWeek} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.groups.activeGroups}</div>
            <p className="text-xs text-muted-foreground">
              {data.analytics.groups.totalMembers} total members
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.chats.messagesThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {data.analytics.chats.unreadMessages} unread
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Hours</CardTitle>
            <Clock className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.dashboard.meetingHoursThisWeek}h</div>
            <p className="text-xs text-muted-foreground">
              {data.analytics.dashboard.totalMeetingHours}h total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest meetings and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </p>
                      {activity.participants && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.participants} participants
                        </Badge>
                      )}
                      {activity.sender && (
                        <span className="text-xs text-muted-foreground">
                          by {activity.sender}
                        </span>
                      )}
                      {activity.assignee && (
                        <span className="text-xs text-muted-foreground">
                          by {activity.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Next scheduled meetings</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentMeetings.map((meeting) => {
                const startTime = new Date(meeting.startTime)
                const isToday = startTime.toDateString() === new Date().toDateString()
                
                return (
                  <div key={meeting.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        meeting.type === 'planning' ? 'bg-blue-500' :
                        meeting.type === 'standup' ? 'bg-green-500' :
                        meeting.type === 'client' ? 'bg-purple-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{meeting.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isToday ? 'Today' : startTime.toLocaleDateString()} at {startTime.toLocaleTimeString('en-US', {
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="flex -space-x-1">
                          {meeting.participants.slice(0, 3).map((participant, idx) => (
                            <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {participant.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.participants.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs font-medium">+{meeting.participants.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <Badge 
                          variant={meeting.status === 'scheduled' ? 'default' : 'secondary'}
                          className="text-xs capitalize"
                        >
                          {meeting.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Performance</CardTitle>
            <CardDescription>How well are your meetings performing?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">On-time Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${data.analytics.dashboard.onTimeRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{data.analytics.dashboard.onTimeRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Participant Engagement</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${data.analytics.dashboard.participantEngagement}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{data.analytics.dashboard.participantEngagement}%</span>
                </div>
              </div>\n              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg. Duration</span>
                <span className="text-sm text-muted-foreground">{data.analytics.dashboard.averageMeetingDuration} min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-2 hover:bg-teal-50 dark:hover:bg-teal-950 border-teal-200 dark:border-teal-700"
              >
                <Calendar className="h-5 w-5 text-teal-500" />
                <span className="text-sm font-medium">Schedule Meeting</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-2 hover:bg-teal-50 dark:hover:bg-teal-950 border-teal-200 dark:border-teal-700"
              >
                <Users className="h-5 w-5 text-teal-500" />
                <span className="text-sm font-medium">Create Group</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-2 hover:bg-teal-50 dark:hover:bg-teal-950 border-teal-200 dark:border-teal-700"
              >
                <MessageSquare className="h-5 w-5 text-teal-500" />
                <span className="text-sm font-medium">Send Message</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-20 space-y-2 hover:bg-teal-50 dark:hover:bg-teal-950 border-teal-200 dark:border-teal-700"
              >
                <Settings className="h-5 w-5 text-teal-500" />
                <span className="text-sm font-medium">View Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}