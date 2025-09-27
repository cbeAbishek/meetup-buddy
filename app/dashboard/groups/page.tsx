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
  Filter
} from 'lucide-react'

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState('')

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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No groups created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Badge variant="secondary">Online</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Members active now
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total messages sent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Group meetings held
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Groups Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Groups</CardTitle>
              <CardDescription>Browse and join groups in your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-sm">No groups available</p>
                  <p className="text-xs">Create your first group to start collaborating</p>
                </div>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Groups</CardTitle>
              <CardDescription>Groups you have created or joined</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-sm">You haven't joined any groups yet</p>
                  <p className="text-xs">Join existing groups or create your own</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="starred" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Starred Groups</CardTitle>
              <CardDescription>Your favorite groups for quick access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-sm">No starred groups</p>
                  <p className="text-xs">Star your favorite groups for quick access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Group Activity</CardTitle>
          <CardDescription>Latest updates from your groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-3" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">Group activities and updates will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}