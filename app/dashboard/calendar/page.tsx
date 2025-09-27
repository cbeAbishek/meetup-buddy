'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
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
  Settings,
  X
} from 'lucide-react'
import { useProfiles, type Profile } from '@/hooks/use-profiles'

export default function CalendarPage() {
  // Authentication
  const { user, session, loading: authLoading } = useAuth()
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'month'>('week')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'virtual',
    createdBy: '' // For creating meetings on behalf of others
  })

  // Fetch all profiles for participant selection
  const { profiles, loading: profilesLoading } = useProfiles()

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to auth page if not authenticated
      window.location.href = '/auth?redirectTo=/dashboard/calendar'
    }
  }, [user, authLoading])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth required if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to access the calendar</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

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

  const handleCreateMeeting = async () => {
    try {
      setIsCreatingMeeting(true)
      
      // Check authentication before proceeding
      if (!user || !session) {
        throw new Error('You must be signed in to create meetings. Please sign in and try again.')
      }
      
      console.log('🚀 Creating meeting for user:', user.email)
      
      // Prepare meeting data
      const meetingData = {
        title: meetingForm.title,
        description: meetingForm.description,
        start_time: `${meetingForm.date}T${meetingForm.startTime}:00`,
        end_time: `${meetingForm.date}T${meetingForm.endTime}:00`,
        date: meetingForm.date,
        location: meetingForm.location,
        meeting_type: meetingForm.type,
        created_by: meetingForm.createdBy || undefined, // If specified, create on behalf
        participants: selectedParticipants.map(participantId => ({
          profile_id: participantId,
          role: 'listener'
        }))
      }

      console.log('📤 Sending meeting data:', meetingData)

      // Call API to create meeting
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData)
      })

      console.log('📥 API Response status:', response.status)
      
      const result = await response.json()
      console.log('📥 API Response data:', result)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign out and sign back in.')
        }
        if (response.status === 409 && result.conflicts) {
          // Handle scheduling conflicts
          const conflictNames = result.conflicts.map((c: any) => c.full_name || c.email).join(', ')
          throw new Error(`Scheduling conflict detected with: ${conflictNames}`)
        }
        
        // Enhanced error message with debugging info
        const errorMsg = result.error || 'Failed to create meeting'
        const debugInfo = result.debug ? `\n\nDebug info: ${JSON.stringify(result.debug)}` : ''
        const suggestion = result.suggestion ? `\n\nSuggestion: ${result.suggestion}` : ''
        
        throw new Error(errorMsg + debugInfo + suggestion)
      }

      // Success - reset form and close dialog
      setMeetingForm({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        type: 'virtual',
        createdBy: ''
      })
      setSelectedParticipants([])
      setAvailableSlots([])
      setSelectedSlot('')
      setIsCreateDialogOpen(false)
      
      // Show enhanced success message
      const isCreatedOnBehalf = result.created_by_delegate
      const participantCount = selectedParticipants.length
      const participantText = participantCount > 0 ? ` with ${participantCount} participant${participantCount > 1 ? 's' : ''}` : ''
      const behalfText = isCreatedOnBehalf ? ' (created on behalf)' : ''
      
      alert(`✅ Meeting "${meetingForm.title}" created successfully${participantText}${behalfText}!\n\n${result.message || ''}\n\nDate: ${meetingForm.date}\nTime: ${meetingForm.startTime} - ${meetingForm.endTime}\nType: ${meetingForm.type}`)
      
      console.log('✅ Meeting created successfully:', result.meeting)
      
    } catch (error: any) {
      console.error('💥 Error creating meeting:', error)
      
      // Show detailed error message
      const errorMessage = error.message || 'Unknown error occurred'
      alert(`❌ Failed to create meeting:\n\n${errorMessage}\n\n🔍 Check the browser console for more details.`)
    } finally {
      setIsCreatingMeeting(false)
    }
  }

  const removeParticipant = (participantId: string) => {
    setSelectedParticipants(prev => prev.filter(id => id !== participantId))
  }

  const addParticipant = (participantId: string) => {
    if (!selectedParticipants.includes(participantId)) {
      setSelectedParticipants(prev => [...prev, participantId])
    }
  }

  const getParticipantName = (participantId: string) => {
    const participant = profiles.find(p => p.id === participantId)
    return participant?.full_name || participant?.email || 'Unknown User'
  }

  const checkAvailability = async () => {
    if (selectedParticipants.length === 0) return

    setIsCheckingAvailability(true)
    try {
      const response = await fetch('/api/meetings/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_ids: meetingForm.createdBy ? 
            [...selectedParticipants, meetingForm.createdBy] : 
            selectedParticipants,
          start_date: meetingForm.date ? `${meetingForm.date}T00:00:00` : undefined,
          end_date: meetingForm.date ? `${meetingForm.date}T23:59:59` : undefined,
          duration: 60
        })
      })

      const result = await response.json()
      if (response.ok) {
        setAvailableSlots(result.common_slots || [])
        if (result.common_slots?.length > 0) {
          // Auto-select first available slot
          const firstSlot = result.common_slots[0]
          const startTime = new Date(firstSlot.start_time)
          const endTime = new Date(firstSlot.end_time)
          
          setMeetingForm(prev => ({
            ...prev,
            startTime: startTime.toTimeString().slice(0, 5),
            endTime: endTime.toTimeString().slice(0, 5)
          }))
          setSelectedSlot(firstSlot.start_time)
        }
      } else {
        console.error('Error checking availability:', result.error)
      }
    } catch (error) {
      console.error('Error checking availability:', error)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleSlotSelect = (slot: any) => {
    const startTime = new Date(slot.start_time)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour meeting
    
    setMeetingForm(prev => ({
      ...prev,
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5)
    }))
    setSelectedSlot(slot.start_time)
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
                <DialogDescription>
                  Create a new meeting and invite participants
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Meeting Title */}
                <div className="grid gap-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input 
                    id="title"
                    placeholder="Enter meeting title"
                    value={meetingForm.title}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                {/* Create on Behalf (for authorized users) */}
                <div className="grid gap-2">
                  <Label htmlFor="createdBy">Create Meeting For (Optional)</Label>
                  <Select 
                    value={meetingForm.createdBy || "self"} 
                    onValueChange={(value) => setMeetingForm(prev => ({ ...prev, createdBy: value === "self" ? "" : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Create for myself" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Create for myself</SelectItem>
                      {profiles
                        .filter(profile => profile.id !== profiles.find(p => p.email)?.id) // Exclude current user if we can identify them
                        .map(profile => (
                          <SelectItem key={profile.id} value={profile.id}>
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-medium">{profile.full_name || profile.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  {profile.role} • {profile.email}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {meetingForm.createdBy && meetingForm.createdBy !== "self" && (
                    <p className="text-xs text-muted-foreground">
                      ⚠️ You are creating this meeting on behalf of another user. Make sure you have permission to do so.
                    </p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input 
                      id="date"
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input 
                      id="startTime"
                      type="time"
                      value={meetingForm.startTime}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input 
                      id="endTime"
                      type="time"
                      value={meetingForm.endTime}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    placeholder="Enter meeting location or link"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                {/* Meeting Type */}
                <div className="grid gap-2">
                  <Label htmlFor="type">Meeting Type</Label>
                  <Select 
                    value={meetingForm.type} 
                    onValueChange={(value) => setMeetingForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual Meeting</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Participants */}
                <div className="grid gap-3">
                  <Label>Participants</Label>
                  
                  {/* Selected Participants */}
                  {selectedParticipants.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
                      {selectedParticipants.map(participantId => (
                        <Badge 
                          key={participantId} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          <span>{getParticipantName(participantId)}</span>
                          <button
                            type="button"
                            className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeParticipant(participantId)
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                          >
                            <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Participant Selection */}
                  <div className="grid gap-2">
                    <Select onValueChange={addParticipant}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add participants..." />
                      </SelectTrigger>
                      <SelectContent>
                        {profilesLoading ? (
                          <SelectItem value="loading" disabled>Loading participants...</SelectItem>
                        ) : (
                          profiles
                            .filter(profile => !selectedParticipants.includes(profile.id))
                            .map(profile => (
                              <SelectItem key={profile.id} value={profile.id}>
                                <div className="flex items-center gap-2">
                                  <div>
                                    <p className="font-medium">{profile.full_name || profile.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {profile.role} • {profile.email}
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                        )}
                        {!profilesLoading && profiles.length === 0 && (
                          <SelectItem value="no-users" disabled>No users available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Availability Checker */}
                {selectedParticipants.length > 0 && meetingForm.date && (
                  <div className="grid gap-3 p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Find Common Availability</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={checkAvailability}
                        disabled={isCheckingAvailability}
                      >
                        {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
                      </Button>
                    </div>
                    
                    {availableSlots.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Available time slots for all participants:
                        </p>
                        <div className="grid gap-2 max-h-32 overflow-y-auto">
                          {availableSlots.map((slot, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSlotSelect(slot)}
                              className={`p-2 text-left border rounded text-xs transition-colors ${
                                selectedSlot === slot.start_time
                                  ? 'border-primary bg-primary/10'
                                  : 'border-muted-foreground/20 hover:border-primary/50'
                              }`}
                            >
                              <div className="font-medium">
                                {new Date(slot.start_time).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {new Date(slot.end_time).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                              <div className="text-muted-foreground">
                                Duration: {slot.duration_minutes} minutes
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {availableSlots.length === 0 && !isCheckingAvailability && (
                      <p className="text-xs text-muted-foreground">
                        Click "Check Availability" to find common free time slots
                      </p>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Add meeting description or agenda..."
                    value={meetingForm.description}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateMeeting}
                  disabled={!meetingForm.title || !meetingForm.date || !meetingForm.startTime || !meetingForm.endTime || isCreatingMeeting}
                >
                  {isCreatingMeeting ? 'Creating...' : 'Create Meeting'}
                </Button>
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