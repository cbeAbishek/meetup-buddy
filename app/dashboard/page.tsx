'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Users, Calendar, MessageSquare, Clock, TrendingUp, Video, CheckCircle, Plus } from 'lucide-react'

export default function DashboardPage() {
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              +2 new groups
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              +12% this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              +15min avg duration
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
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">Weekly Team Sync</p>
                  <p className="text-xs text-muted-foreground">Completed 2 hours ago • 45 min duration</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">Engineering</Badge>
                    <span className="text-xs text-muted-foreground">8 participants</span>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              </div>
              
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">New member joined Design Team</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                  <Badge variant="outline" className="text-xs">Team Update</Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">15 new messages in Marketing Group</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                  <Badge variant="secondary" className="text-xs">Marketing</Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">Client Presentation rescheduled</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                  <Badge variant="outline" className="text-xs">Schedule Change</Badge>
                </div>
              </div>
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
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-center shrink-0">
                  <p className="text-lg font-bold">15</p>
                  <p className="text-xs text-muted-foreground">Dec</p>
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">Product Review</p>
                  <p className="text-xs text-muted-foreground">2:00 PM - 3:30 PM</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">Product</Badge>
                    <span className="text-xs text-blue-600">5 participants</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-center shrink-0">
                  <p className="text-lg font-bold">16</p>
                  <p className="text-xs text-muted-foreground">Dec</p>
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">Design Sprint Planning</p>
                  <p className="text-xs text-muted-foreground">10:00 AM - 12:00 PM</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">Design</Badge>
                    <span className="text-xs text-blue-600">8 participants</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-center shrink-0">
                  <p className="text-lg font-bold">17</p>
                  <p className="text-xs text-muted-foreground">Dec</p>
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">Client Presentation</p>
                  <p className="text-xs text-muted-foreground">3:00 PM - 4:00 PM</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">Client</Badge>
                    <span className="text-xs text-blue-600">12 participants</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 space-y-2 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <Calendar className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-medium">Schedule Meeting</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 space-y-2 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <Users className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium">Create Group</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 space-y-2 hover:bg-purple-50 dark:hover:bg-purple-950"
            >
              <MessageSquare className="h-6 w-6 text-purple-500" />
              <span className="text-sm font-medium">Send Message</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 space-y-2 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              <TrendingUp className="h-6 w-6 text-orange-500" />
              <span className="text-sm font-medium">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}