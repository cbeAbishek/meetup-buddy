'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Users, 
  MessageSquare, 
  Calendar,
  Settings,
  Filter,
  MoreHorizontal,
  Star,
  Bell,
  Hash,
  Lock,
  Globe
} from 'lucide-react'
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const groups = [
  {
    id: 1,
    name: "Engineering Team",
    description: "Main engineering team discussions and updates",
    members: 24,
    messages: 156,
    lastActivity: "2 hours ago",
    type: "public",
    color: "bg-blue-500",
    isStarred: true,
    avatar: "ET",
    recentMeetings: 5
  },
  {
    id: 2,
    name: "Product Design",
    description: "Design reviews, feedback, and creative discussions",
    members: 12,
    messages: 89,
    lastActivity: "4 hours ago",
    type: "private",
    color: "bg-purple-500",
    isStarred: false,
    avatar: "PD",
    recentMeetings: 3
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Q4 marketing campaign planning and execution",
    members: 18,
    messages: 203,
    lastActivity: "1 hour ago",
    type: "private",
    color: "bg-green-500",
    isStarred: true,
    avatar: "MC",
    recentMeetings: 8
  },
  {
    id: 4,
    name: "Client Relations",
    description: "External client communications and updates",
    members: 8,
    messages: 67,
    lastActivity: "6 hours ago",
    type: "restricted",
    color: "bg-orange-500",
    isStarred: false,
    avatar: "CR",
    recentMeetings: 12
  },
  {
    id: 5,
    name: "Leadership Team",
    description: "Executive team strategic discussions",
    members: 6,
    messages: 34,
    lastActivity: "1 day ago",
    type: "restricted",
    color: "bg-red-500",
    isStarred: false,
    avatar: "LT",
    recentMeetings: 4
  },
  {
    id: 6,
    name: "HR & Operations",
    description: "Human resources and operational discussions",
    members: 15,
    messages: 112,
    lastActivity: "3 hours ago",
    type: "public",
    color: "bg-indigo-500",
    isStarred: true,
    avatar: "HR",
    recentMeetings: 6
  }
]

const recentActivity = [
  {
    id: 1,
    group: "Engineering Team",
    user: "Alice Johnson",
    action: "scheduled a meeting",
    time: "2 hours ago",
    type: "meeting"
  },
  {
    id: 2,
    group: "Marketing Campaign",
    user: "Bob Smith",
    action: "shared 5 files",
    time: "3 hours ago",
    type: "file"
  },
  {
    id: 3,
    group: "Product Design",
    user: "Carol Davis",
    action: "started a discussion",
    time: "4 hours ago",
    type: "discussion"
  },
  {
    id: 4,
    group: "Client Relations",
    user: "David Wilson",
    action: "completed action item",
    time: "5 hours ago",
    type: "task"
  }
]

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "starred") return matchesSearch && group.isStarred
    if (activeTab === "public") return matchesSearch && group.type === "public"
    if (activeTab === "private") return matchesSearch && group.type === "private"
    
    return matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "public": return <Globe className="h-3 w-3" />
      case "private": return <Lock className="h-3 w-3" />
      case "restricted": return <Hash className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">Collaborate with your teams and manage group discussions</p>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Create a new group for team collaboration
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input placeholder="Group name" />
                <Input placeholder="Description" />
                <Input placeholder="Add members" />
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Group</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Groups</p>
                <p className="text-2xl font-bold">{groups.length}</p>
                <p className="text-xs text-muted-foreground">active groups</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{groups.reduce((sum, group) => sum + group.members, 0)}</p>
                <p className="text-xs text-muted-foreground">across all groups</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{groups.reduce((sum, group) => sum + group.messages, 0)}</p>
                <p className="text-xs text-muted-foreground">this week</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meetings</p>
                <p className="text-2xl font-bold">{groups.reduce((sum, group) => sum + group.recentMeetings, 0)}</p>
                <p className="text-xs text-muted-foreground">scheduled</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Groups List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Groups</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search groups..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Groups</TabsTrigger>
                  <TabsTrigger value="starred">Starred</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="space-y-4">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Avatar className={`h-12 w-12 ${group.color}`}>
                      <AvatarFallback className="text-white font-semibold">
                        {group.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold truncate">{group.name}</h3>
                            {group.isStarred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />}
                            {getTypeIcon(group.type)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Bell className="mr-2 h-4 w-4" />
                              Notifications
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" />
                              {group.isStarred ? 'Unstar' : 'Star'} Group
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Group Settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{group.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{group.messages} messages</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{group.recentMeetings} meetings</span>
                          </div>
                        </div>
                        
                        <span className="text-xs">{group.lastActivity}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={group.type === 'public' ? 'secondary' : group.type === 'private' ? 'outline' : 'destructive'}>
                          {group.type}
                        </Badge>
                        {group.recentMeetings > 5 && (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across all groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'meeting' ? 'bg-blue-500' :
                      activity.type === 'file' ? 'bg-green-500' :
                      activity.type === 'discussion' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action} in{' '}
                        <span className="font-medium">{activity.group}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Group Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Group Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Group Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Public Groups</span>
                  <span className="text-sm font-medium">
                    {groups.filter(g => g.type === 'public').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Private Groups</span>
                  <span className="text-sm font-medium">
                    {groups.filter(g => g.type === 'private').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Restricted Groups</span>
                  <span className="text-sm font-medium">
                    {groups.filter(g => g.type === 'restricted').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Starred Groups</span>
                  <span className="text-sm font-medium">
                    {groups.filter(g => g.isStarred).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}