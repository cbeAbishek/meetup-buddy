import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Navbar } from "@/components/navbar"
import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function RemindersPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          // amber theme for reminders
          "--primary": "#d97706",
          "--primary-foreground": "#ffffff",
          "--accent": "#d97706",
          "--accent-foreground": "#ffffff",
          "--sidebar-primary": "#d97706",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-accent": "#d97706",
          "--sidebar-accent-foreground": "#ffffff",
          "--ring": "#fcd34d",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <SiteHeader />
        <main className="flex-1 px-6 py-6">
          <div className="flex items-center justify-between">
            <Breadcrumb items={["Dashboard", "Reminders"]} />
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
              Today, Sep 26
            </Badge>
          </div>
          
          <div className="mt-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Meeting Reminders</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Upcoming deadlines and action alerts</p>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-4 space-y-6">
                {/* Today's Reminders */}
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Today's Reminders</CardTitle>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">3 Items</Badge>
                    </div>
                    <CardDescription>Items requiring immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-md">
                          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                            <span className="font-semibold">{i + 1}h</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {[
                                "Prepare for Strategy Meeting", 
                                "Client Call Follow-up", 
                                "Submit Q3 Report"
                              ][i]}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {[
                                "Review notes and prepare discussion points",
                                "Send follow-up email with agreed action items",
                                "Finalize numbers for quarterly business review"
                              ][i]}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {["11:00 AM", "2:30 PM", "5:00 PM"][i]}
                              </Badge>
                              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                Due in {i + 1} hour{i !== 0 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button size="sm" variant="outline" className="h-8">Snooze</Button>
                            <Button size="sm" className="h-8">Complete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tomorrow's Reminders */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Tomorrow's Reminders</CardTitle>
                      <Badge variant="outline">4 Items</Badge>
                    </div>
                    <CardDescription>Sep 27, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded-md">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                            <span className="font-semibold">{i + 9}:00</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {[
                                "Team Standup",
                                "Project Status Update",
                                "Client Onboarding Call",
                                "Weekly Planning Session"
                              ][i]}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {[
                                "Daily sync with development team",
                                "Present project milestones to stakeholders",
                                "Introduction call with new client",
                                "Plan next week's priorities and assignments"
                              ][i]}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"][i]}
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8">Edit</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Week */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Upcoming Week</CardTitle>
                    <CardDescription>Sep 28 - Oct 4, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-start gap-3">
                            <div className="w-16 text-xs text-muted-foreground">
                              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i]}
                              <div className="font-medium">Sep {28 + i}</div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                {[
                                  "Quarterly Business Review",
                                  "Product Demo",
                                  "Team Training Session",
                                  "Vendor Negotiation Call",
                                  "Monthly All-Hands"
                                ][i]}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {["10:00 AM", "2:00 PM", "11:00 AM", "3:30 PM", "9:00 AM"][i]}
                              </p>
                            </div>
                          </div>
                          <Badge variant={i === 0 ? "destructive" : "outline"} className="shrink-0">
                            {i === 0 ? "Preparation Required" : "Scheduled"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="today" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Today's Schedule</CardTitle>
                      <Badge variant="outline">Sep 26, 2025</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-8 border-l">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="mb-8 relative">
                          {/* Time indicator */}
                          <div className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-muted">
                            {i === 2 ? (
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            ) : (
                              <div className={`w-3 h-3 ${i < 2 ? "bg-green-500" : "bg-muted"} rounded-full`} />
                            )}
                          </div>
                          
                          <div className="pl-6">
                            <span className="text-sm font-medium">
                              {["9:00 AM", "10:30 AM", "1:00 PM", "3:00 PM", "4:30 PM"][i]}
                            </span>
                            
                            <Card className={`mt-2 ${i === 2 ? "border-l-4 border-l-red-500" : ""}`}>
                              <CardHeader className="py-3">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">
                                    {[
                                      "Team Standup Meeting",
                                      "Client Discovery Call",
                                      "Quarterly Business Review",
                                      "Product Roadmap Planning",
                                      "Weekly Wrap-up"
                                    ][i]}
                                  </CardTitle>
                                  <Badge variant={i === 2 ? "destructive" : (i < 2 ? "secondary" : "outline")}>
                                    {i < 2 ? "Completed" : (i === 2 ? "Now" : "Upcoming")}
                                  </Badge>
                                </div>
                                <CardDescription>
                                  {[
                                    "Daily sync with development team",
                                    "New client introduction and requirements gathering",
                                    "Present Q3 results and Q4 forecast to leadership",
                                    "Discuss and prioritize Q4 feature development",
                                    "Team progress review and weekend assignments"
                                  ][i]}
                                </CardDescription>
                              </CardHeader>
                              {i === 2 && (
                                <CardFooter className="py-2 bg-red-50/50 dark:bg-red-950/20 border-t">
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                      Happening now - Join meeting
                                    </span>
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                      Join
                                    </Button>
                                  </div>
                                </CardFooter>
                              )}
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Alert cards */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const isUrgent = i === 0 || i === 3;
                    const isWarning = i === 1 || i === 4;
                    const isInfo = i === 2 || i === 5;
                    
                    let bgColor = "bg-muted/50";
                    let borderColor = "border-l-slate-300 dark:border-l-slate-700";
                    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
                    let badgeText = "Info";
                    
                    if (isUrgent) {
                      bgColor = "bg-red-50/50 dark:bg-red-950/20";
                      borderColor = "border-l-red-500";
                      badgeVariant = "destructive";
                      badgeText = "Urgent";
                    } else if (isWarning) {
                      bgColor = "bg-amber-50/50 dark:bg-amber-950/20";
                      borderColor = "border-l-amber-500";
                      badgeVariant = "secondary";
                      badgeText = "Action Required";
                    }
                    
                    return (
                      <Card key={i} className={`overflow-hidden border-l-4 ${borderColor}`}>
                        <CardHeader className={`pb-3 ${bgColor}`}>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">
                              {[
                                "Deadline Approaching",
                                "Meeting Conflict Detected",
                                "Calendar Update",
                                "Document Approval",
                                "New Task Assignment",
                                "Reminder Update"
                              ][i]}
                            </CardTitle>
                            <Badge variant={badgeVariant}>
                              {badgeText}
                            </Badge>
                          </div>
                          <CardDescription>
                            {isUrgent ? "Action required within 2 hours" : (isWarning ? "Response needed today" : "For your information")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="py-3">
                          <p className="text-sm">
                            {[
                              "Project proposal for Alpha Technologies due by 5PM today.",
                              "Two meetings scheduled at 2:00 PM tomorrow. Reschedule required.",
                              "Your meeting with the Design Team has been moved to 3:30 PM.",
                              "Budget proposal requires your approval before end of day.",
                              "You've been assigned 3 new tasks from yesterday's meeting.",
                              "All reminders have been updated based on your calendar changes."
                            ][i]}
                          </p>
                          <div className="mt-3 text-xs text-muted-foreground">
                            {isUrgent ? "2 hours ago" : (isWarning ? "Today, 10:25 AM" : "Today, 9:15 AM")}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-muted/50 px-6 py-2">
                          <button className="text-xs font-medium">
                            {isUrgent ? "Dismiss" : (isWarning ? "Dismiss" : "Mark as read")}
                          </button>
                          <button className="text-xs font-medium text-primary">
                            {isUrgent ? "Take action now" : (isWarning ? "Resolve" : "View details")}
                          </button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}