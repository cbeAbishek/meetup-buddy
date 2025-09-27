'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Plus,
  Upload,
  Download,
  Edit,
  Check,
  X
} from 'lucide-react'

export default function MeetingDetailPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calendar
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meeting Details</h1>
          <p className="text-muted-foreground">Manage your meeting agenda, follow-ups, and documents</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Meeting
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Join Meeting
          </Button>
        </div>
      </div>

      {/* Meeting Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">No date scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Duration not set</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">0 participants</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Location TBD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Meeting Content */}
      <Tabs defaultValue="agenda" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meeting Agenda</CardTitle>
                  <CardDescription>Plan and organize your meeting topics</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-sm">No agenda items</p>
                  <p className="text-xs">Add items to structure your meeting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-ups">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Follow-up Tasks</CardTitle>
                  <CardDescription>Track action items and assignments</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Check className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-sm">No follow-up tasks</p>
                  <p className="text-xs">Create tasks to track post-meeting actions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Summary</CardTitle>
              <CardDescription>Key decisions and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rule-based Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">
                        <p className="text-sm">No meeting content to summarize</p>
                        <p className="text-xs">Summary will be generated after the meeting</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI-Enhanced Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">
                        <p className="text-sm">AI summary not available</p>
                        <p className="text-xs">AI will enhance the summary after meeting completion</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meeting Documents</CardTitle>
                  <CardDescription>Upload and share meeting materials</CardDescription>
                </div>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Upload className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-sm">No documents uploaded</p>
                  <p className="text-xs">Upload files to share with meeting participants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}