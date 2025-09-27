"use client"

import { format, parseISO, isAfter } from "date-fns"
import { motion, Variants } from "framer-motion"
import { ArrowUpRight, Calendar, Clock, User, Users, CheckCircle, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import dashboardData from "@/lib/mock-data/dashboard-data.json"

// Animation variants for staggered card appearance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      // use a literal type so TS infers the correct animation generator type
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
}

export function MeetingDashboardCards() {
  // Get upcoming meeting (first in the array for demo purposes)
  const upcomingMeeting = dashboardData.meetings[0]
  
  // Calculate follow-up stats
  const totalFollowUps = dashboardData.followUps.length
  const completedFollowUps = dashboardData.followUps.filter(f => f.status === "completed").length
  const pendingFollowUps = dashboardData.followUps.filter(f => f.status === "pending").length
  const overdueFollowUps = dashboardData.followUps.filter(f => f.status === "overdue").length
  
  // Get next due follow-up
  const nextDueFollowUp = dashboardData.followUps
    .filter(f => f.status === "pending")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
  
  // Get critical reminders
  const criticalReminders = dashboardData.reminders
    .filter(r => r.priority === "high")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2)
  
  // Trust scores
  const { actionCompletion, meetingAttendance, documentation, overall } = dashboardData.trustScores
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Upcoming Meeting Card */}
      <motion.div variants={cardVariants}>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Upcoming Meeting</CardTitle>
              <CardDescription className="mt-1">Next on your schedule</CardDescription>
            </div>
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800">
              <Clock className="mr-1 h-3 w-3" /> 
              {format(parseISO(upcomingMeeting.date), "h:mm a")}
            </Badge>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg mb-2">{upcomingMeeting.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="mr-2 h-4 w-4" />
              {format(parseISO(upcomingMeeting.date), "EEEE, MMM d")} 
              <span className="mx-2">•</span> 
              <Clock className="mr-2 h-4 w-4" />
              {upcomingMeeting.duration} minutes
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Users className="mr-2 h-4 w-4" />
              {upcomingMeeting.participants.length} participants
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="default">Join</Button>
              <Button size="sm" variant="outline">Reschedule</Button>
              <Button size="sm" variant="ghost">View Agenda</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Agenda Snapshot */}
      <motion.div variants={cardVariants}>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Agenda Snapshot</CardTitle>
            <CardDescription className="mt-1">Key discussion points</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              {upcomingMeeting.agenda.map((item, i) => (
                <li key={i} className="flex items-start">
                  <Badge className="mr-2 mt-1" variant="outline">{i+1}</Badge>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button size="sm" variant="outline" className="w-full">
              View Full Agenda 
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Follow-up Summary */}
      <motion.div variants={cardVariants}>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Follow-up Summary</CardTitle>
            <CardDescription className="mt-1">Action item status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-muted/50 rounded-md">
                <div className="text-lg font-semibold">{pendingFollowUps}</div>
                <div className="text-xs text-muted-foreground">Open</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-md">
                <div className="text-lg font-semibold">{completedFollowUps}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-md">
                <div className="text-lg font-semibold text-destructive">{overdueFollowUps}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
            
            {nextDueFollowUp && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">Next due action:</div>
                <div className="text-sm p-2 border rounded-md">
                  <div className="font-medium">{nextDueFollowUp.task}</div>
                  <div className="text-xs text-muted-foreground flex justify-between mt-1">
                    <span>Assignee: {nextDueFollowUp.assignee}</span>
                    <span>Due: {format(parseISO(nextDueFollowUp.dueDate), "MMM d")}</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button size="sm" variant="outline" className="w-full">
              View All Follow-ups
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Reminders */}
      <motion.div variants={cardVariants}>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Critical Reminders</CardTitle>
            <CardDescription className="mt-1">Don't forget these</CardDescription>
          </CardHeader>
          <CardContent>
            {criticalReminders.length > 0 ? (
              <div className="space-y-3">
                {criticalReminders.map(reminder => (
                  <Alert key={reminder.id} variant="warning" className="py-2">
                    <AlertTitle className="text-sm">{reminder.message}</AlertTitle>
                    <AlertDescription className="text-xs">
                      Due: {format(parseISO(reminder.dueDate), "MMM d, h:mm a")}
                    </AlertDescription>
                  </Alert>
                ))}
                {dashboardData.followUps.some(f => f.status === "overdue") && (
                  <Alert variant="destructive" className="py-2">
                    <AlertTitle className="text-sm">Overdue Action Items</AlertTitle>
                    <AlertDescription className="text-xs">
                      {overdueFollowUps} action item(s) require your attention
                    </AlertDescription>
                  </Alert>
                )}
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Manage All Reminders
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
                <p>No critical reminders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Trust Score Widget */}
      <motion.div variants={cardVariants}>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trust Score</CardTitle>
            <CardDescription className="mt-1">Your meeting effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Score</span>
                <span className="font-medium">{overall}%</span>
              </div>
              <Progress value={overall} size="lg" variant={overall > 70 ? "success" : overall > 50 ? "warning" : "danger"} />
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Action Completion</span>
                  <span>{actionCompletion}%</span>
                </div>
                <Progress value={actionCompletion} size="sm" variant={actionCompletion > 70 ? "success" : "warning"} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Meeting Attendance</span>
                  <span>{meetingAttendance}%</span>
                </div>
                <Progress value={meetingAttendance} size="sm" variant={meetingAttendance > 70 ? "success" : "warning"} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Documentation</span>
                  <span>{documentation}%</span>
                </div>
                <Progress value={documentation} size="sm" variant={documentation > 70 ? "success" : "warning"} />
              </div>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Based on your last 30 days of activity
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Quick Actions Card */}
      <motion.div variants={cardVariants}>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription className="mt-1">AI-powered assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" className="w-full justify-start">
              <CheckCircle className="mr-2 h-4 w-4" />
              Generate Meeting Brief
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule New Meeting
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Add Follow-up Task
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Upcoming Meeting
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}