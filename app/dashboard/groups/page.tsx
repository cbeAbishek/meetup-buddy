'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Users, 
  MessageSquare, 
  Calendar,
  Settings,
  Filter,
  Star,
  MoreHorizontal,
  Clock,
  TrendingUp
} from 'lucide-react'

// Mock data for groups
const mockData = {
  groups: [
    {
      id: "group1",
      name: "Product Team Alpha",
      description: "Main product development team focused on core platform features",
      type: "team",
      privacy: "private",
      avatar: "PTA",
      color: "#0EA5E9",
      memberCount: 8,
      createdBy: "Alice Chen",
      createdAt: "2025-09-01T10:00:00Z",
      lastActivity: "2025-09-27T14:30:00Z",
      isStarred: true,
      isOwner: true,
      members: [
        { name: "Alice Chen", role: "owner", avatar: "AC", status: "online" },
        { name: "Bob Smith", role: "admin", avatar: "BS", status: "online" },
        { name: "Carol Jones", role: "member", avatar: "CJ", status: "away" },
        { name: "David Lee", role: "member", avatar: "DL", status: "online" }
      ],
      channels: [
        { id: "ch1", name: "general", type: "text", unreadCount: 3 },
        { id: "ch2", name: "announcements", type: "text", unreadCount: 0 },
        { id: "ch3", name: "design-reviews", type: "text", unreadCount: 1 }
      ],
      stats: {
        totalMessages: 1247,
        totalMeetings: 23,
        avgMeetingDuration: 45,
        activeThisWeek: true
      }
    },
    {
      id: "group2", 
      name: "Engineering Guild",
      description: "Cross-team engineering collaboration and knowledge sharing",
      type: "guild",
      privacy: "public",
      avatar: "EG",
      color: "#10B981",
      memberCount: 15,
      createdBy: "Bob Smith",
      createdAt: "2025-08-15T14:00:00Z",
      lastActivity: "2025-09-27T11:15:00Z",
      isStarred: false,
      isOwner: false,
      members: [
        { name: "Bob Smith", role: "owner", avatar: "BS", status: "online" },
        { name: "Alice Chen", role: "member", avatar: "AC", status: "online" },
        { name: "David Lee", role: "member", avatar: "DL", status: "online" }
      ],
      channels: [
        { id: "ch4", name: "general", type: "text", unreadCount: 5 },
        { id: "ch5", name: "tech-talks", type: "text", unreadCount: 2 },
        { id: "ch6", name: "code-reviews", type: "text", unreadCount: 0 }
      ],
      stats: {
        totalMessages: 892,
        totalMeetings: 12,
        avgMeetingDuration: 60,
        activeThisWeek: true
      }
    },
    {
      id: "group3",
      name: "Design System Committee", 
      description: "Maintaining consistency across product design",
      type: "committee",
      privacy: "private",
      avatar: "DSC",
      color: "#8B5CF6",
      memberCount: 6,
      createdBy: "Carol Jones",
      createdAt: "2025-07-20T16:00:00Z", 
      lastActivity: "2025-09-26T17:00:00Z",
      isStarred: true,
      isOwner: false,
      members: [
        { name: "Carol Jones", role: "owner", avatar: "CJ", status: "away" },
        { name: "Alice Chen", role: "admin", avatar: "AC", status: "online" },
        { name: "Emily Wong", role: "member", avatar: "EW", status: "offline" }
      ],
      channels: [
        { id: "ch7", name: "general", type: "text", unreadCount: 1 },
        { id: "ch8", name: "component-library", type: "text", unreadCount: 0 }
      ],
      stats: {
        totalMessages: 456,
        totalMeetings: 8,
        avgMeetingDuration: 30,
        activeThisWeek: false
      }
    }
  ],
  analytics: {
    totalGroups: 3,
    activeGroups: 2,
    totalMembers: 29,
    messagesThisWeek: 127,
    averageGroupSize: 9.7,
    messagesSent: 2595
  },
  recentActivity: [
    {
      id: 1,
      groupId: "group1",
      groupName: "Product Team Alpha",
      type: "message",
      title: "Alice Chen shared the Q4 roadmap document",
      timestamp: "2025-09-27T15:30:00Z"
    },
    {
      id: 2,
      groupId: "group2", 
      groupName: "Engineering Guild",
      type: "meeting",
      title: "Code review session completed",
      timestamp: "2025-09-27T14:00:00Z"
    },
    {
      id: 3,
      groupId: "group1",
      groupName: "Product Team Alpha",
      type: "member",
      title: "David Lee joined the group", 
      timestamp: "2025-09-27T13:15:00Z"
    }
  ]
}

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [data] = useState(mockData)

  const filteredGroups = data.groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (selectedTab) {
      case 'my-groups':
        return matchesSearch && (group.isOwner || group.members.some(m => m.role !== 'owner'))
      case 'starred':
        return matchesSearch && group.isStarred
      default:
        return matchesSearch
    }
  })

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">Collaborate with your teams and manage projects</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">All Groups</Badge>
          <Badge variant="outline">My Groups</Badge>
          <Badge variant="outline">Public</Badge>
          <Badge variant="outline">Private</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.totalGroups}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {data.analytics.activeGroups} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Badge variant="secondary">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Avg {data.analytics.averageGroupSize} per group
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.messagesThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {data.analytics.messagesSent} total sent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.activeGroups}</div>
            <p className="text-xs text-muted-foreground">
              Groups active this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Groups Content */}
      <Tabs defaultValue="all" onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Groups ({data.groups.length})</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups ({data.groups.filter(g => g.isOwner).length})</TabsTrigger>
          <TabsTrigger value="starred">Starred ({data.groups.filter(g => g.isStarred).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10" style={{ backgroundColor: group.color }}>
                        <AvatarFallback className="text-white font-semibold">
                          {group.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {group.name}
                          {group.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={group.privacy === 'public' ? 'default' : 'secondary'} className="text-xs">
                            {group.privacy}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {group.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-sm mt-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Member avatars */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-1">
                          {group.members.slice(0, 4).map((member, idx) => (
                            <Avatar key={idx} className="h-6 w-6 border-2 border-background relative">
                              <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-background ${
                                member.status === 'online' ? 'bg-green-500' :
                                member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                              }`} />
                            </Avatar>
                          ))}
                          {group.memberCount > 4 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs font-medium">+{group.memberCount - 4}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {group.memberCount} members
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.stats.activeThisWeek 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {group.stats.activeThisWeek ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-sm font-semibold">{group.stats.totalMessages}</div>
                        <div className="text-xs text-muted-foreground">Messages</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{group.stats.totalMeetings}</div>
                        <div className="text-xs text-muted-foreground">Meetings</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{group.channels.length}</div>
                        <div className="text-xs text-muted-foreground">Channels</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Meet
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Last active {formatTimeAgo(group.lastActivity)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.filter(g => g.isOwner).map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10" style={{ backgroundColor: group.color }}>
                        <AvatarFallback className="text-white font-semibold">
                          {group.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{group.name}</CardTitle>
                        <Badge variant="default" className="text-xs mt-1">Owner</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Created {formatTimeAgo(group.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="starred" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.filter(g => g.isStarred).map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <div>
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Starred Group</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Group Activity</CardTitle>
          <CardDescription>Latest updates from your groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4" />}
                    {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                    {activity.type === 'member' && <Users className="h-4 w-4" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {activity.groupName}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}