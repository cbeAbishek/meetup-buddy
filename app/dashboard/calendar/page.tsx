'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Users, 
  Video,
  Calendar as CalendarIcon,
  Filter,
  Search,
  Settings
} from 'lucide-react'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'month'>('week')

  // Get the current week dates
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const weekDates = getWeekDates()
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentDate(newDate)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Manage your meetings and schedule</p>
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
                New Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
                <DialogDescription>
                  Create a new meeting and invite participants
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input placeholder="Meeting title" />
                <Input type="datetime-local" />
                <Input placeholder="Add participants" />
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Meeting</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold">{monthName}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={view === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button 
            variant={view === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">meetings</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">0h</p>
                <p className="text-xs text-muted-foreground">this week</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">total invitees</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Virtual</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">of 0 meetings</p>
              </div>
              <Video className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly View</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search meetings..." className="pl-10 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-1 md:gap-2">
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`min-h-[200px] p-3 border rounded-lg ${
                    isToday ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20' : 'bg-card'
                  }`}
                >
                  <div className="text-center mb-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-semibold ${
                      isToday ? 'text-blue-600' : ''
                    }`}>
                      {date.getDate()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Empty state - no meetings for this date */}
                    <div className="text-center py-4 text-xs text-muted-foreground">
                      No meetings
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Empty States */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your meetings for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <CalendarIcon className="h-8 w-8 mx-auto mb-3" />
                <p className="text-sm">No meetings today</p>
                <p className="text-xs">Your meetings for today will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Statistics</CardTitle>
            <CardDescription>Overview of your meeting patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-3" />
                <p className="text-sm">No meeting data</p>
                <p className="text-xs">Start scheduling meetings to see statistics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}