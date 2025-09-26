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
import { DatePicker } from "@/components/ui/date-picker"
import { SchedulingTable } from "@/components/ui/scheduling-table"
import { Button } from "@/components/ui/button"

export default function SchedulingPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          // green theme for scheduling
          "--primary": "#16a34a",
          "--primary-foreground": "#ffffff",
          "--accent": "#16a34a",
          "--accent-foreground": "#ffffff",
          "--sidebar-primary": "#16a34a",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-accent": "#16a34a",
          "--sidebar-accent-foreground": "#ffffff",
          "--ring": "#86efac",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <SiteHeader />
        <main className="flex-1 px-6 py-6">
          <div className="flex items-center justify-between">
            <Breadcrumb items={["Dashboard", "Scheduling"]} />
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800">
              Today, Sep 26
            </Badge>
          </div>
          
          <div className="mt-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Meeting Scheduler</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Auto-find best slots, calendar integration</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12">
            {/* Left column - Calendar picker */}
            <div className="md:col-span-4 lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>Choose a day to schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <DatePicker />
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Meeting Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Participants</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>All Team Members</option>
                      <option>Sales Team</option>
                      <option>Development Team</option>
                      <option>Leadership</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <Button className="w-full mt-4">Find Optimal Times</Button>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Available slots */}
            <div className="md:col-span-8 lg:col-span-9">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Available Time Slots</CardTitle>
                      <CardDescription>Recommended times based on availability</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">AI Optimized</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <SchedulingTable />
                </CardContent>
              </Card>

              {/* Recently Scheduled */}
              <h3 className="font-semibold text-lg mt-8 mb-4">Recently Scheduled</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{["Team Standup", "Client Demo", "Planning Session"][i]}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>
                      </div>
                      <CardDescription>Sep {27 + i}, 2025 • {["9:00 AM", "2:30 PM", "11:00 AM"][i]}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>{["Daily progress update with development team.", 
                          "Product demonstration for Alpha Technologies.", 
                          "Q4 roadmap planning with stakeholders."][i]}</p>
                      <div className="mt-3 flex items-center text-xs text-muted-foreground">
                        <span>{[5, 4, 8][i]} participants</span>
                        <span className="mx-2">•</span>
                        <span>{["30", "60", "90"][i]} minutes</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between bg-muted/50 px-6 py-3">
                      <button className="text-sm font-medium text-primary">View details</button>
                      <button className="text-sm font-medium">Edit meeting</button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}