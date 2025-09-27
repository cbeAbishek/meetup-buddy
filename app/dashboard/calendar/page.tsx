'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Video,
  Calendar as CalendarIcon,
  Filter,
  Search,
  Settings
} from 'lucide-react'
import { Input } from "@/components/ui/input"

const meetings = [
  {
    id: 1,
    title: "Weekly Team Sync",
    time: "9:00 AM - 10:00 AM",
    date: new Date(2024, 11, 15), // December 15, 2024
    type: "recurring",
    attendees: 8,
    location: "Conference Room A",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Product Review",
    time: "2:00 PM - 3:30 PM",
    date: new Date(2024, 11, 15),
    type: "important",
    attendees: 5,
    location: "Virtual - Google Meet",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Design Sprint Planning",
    time: "10:00 AM - 12:00 PM",
    date: new Date(2024, 11, 16),
    type: "workshop",
    attendees: 12,
    location: "Design Studio",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Client Presentation",
    time: "3:00 PM - 4:00 PM",
    date: new Date(2024, 11, 17),
    type: "external",
    attendees: 6,
    location: "Virtual - Zoom",
    color: "bg-orange-500",
  },
  {
    id: 5,
    title: "1:1 with Manager",
    time: "11:00 AM - 11:30 AM",
    date: new Date(2024, 11, 18),
    type: "personal",
    attendees: 2,
    location: "Manager's Office",
    color: "bg-pink-500",
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 15)) // December 2024
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

  // Get meetings for a specific date
  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => 
      meeting.date.toDateString() === date.toDateString()
    )
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
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">18h</p>
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
                <p className="text-2xl font-bold">47</p>
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
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">of 12 meetings</p>
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
              const dayMeetings = getMeetingsForDate(date)
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
                    {dayMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className={`p-2 rounded text-white text-xs ${meeting.color} hover:opacity-90 cursor-pointer transition-opacity`}
                      >
                        <p className="font-medium truncate">{meeting.title}</p>
                        <p className="opacity-90">{meeting.time}</p>
                        <div className="flex items-center gap-1 mt-1 opacity-90">
                          <Users className="h-3 w-3" />
                          <span>{meeting.attendees}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Meetings */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your meetings for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getMeetingsForDate(new Date(2024, 11, 15)).map((meeting) => (
                <div key={meeting.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${meeting.color}`}></div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{meeting.title}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{meeting.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{meeting.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{meeting.attendees}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={meeting.type === 'important' ? 'destructive' : 'secondary'}>
                    {meeting.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Types</CardTitle>
            <CardDescription>Distribution of your meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Team Meetings</span>
                </div>
                <span className="text-sm font-medium">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Client Meetings</span>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Workshops</span>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">1:1 Meetings</span>
                </div>
                <span className="text-sm font-medium">15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

