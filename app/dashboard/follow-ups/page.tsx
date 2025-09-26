"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { TasksTable } from "@/components/ui/tasks-table"
import { Checkbox } from "@/components/ui/checkbox"
import { RightPanel } from "@/components/ui/right-panel"

export default function FollowUpsPage() {
  const router = useRouter()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          // purple theme for follow-ups
          "--primary": "#9333ea",
          "--primary-foreground": "#ffffff",
          "--accent": "#9333ea",
          "--accent-foreground": "#ffffff",
          "--sidebar-primary": "#9333ea",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-accent": "#9333ea",
          "--sidebar-accent-foreground": "#ffffff",
          "--ring": "#d8b4fe",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <SiteHeader />
        <div className="flex-1 overflow-auto">
          <div className="flex">
            <main className="flex-1 px-6 py-6">
              <div className="flex items-center gap-4 mb-4">
                <button aria-label="go-back" onClick={() => router.back()} className="inline-flex items-center justify-center h-10 w-10 rounded-lg border bg-background">
                  ←
                </button>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Breadcrumb items={["Dashboard", "Follow-ups"]} />
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800">
                      Today, Sep 26
                    </Badge>
                  </div>
                </div>
              </div>
          
              <div className="mt-2">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Meeting Follow-ups</h1>
                <p className="mt-1 text-base font-medium text-muted-foreground">Track tasks, decisions, and their status</p>
              </div>

          <div className="mt-8">
            <Tabs defaultValue="tasks">
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="decisions">Decisions</TabsTrigger>
                <TabsTrigger value="action-items">Action Items</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Assigned Tasks</CardTitle>
                        <CardDescription>Items requiring your attention</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300">
                          Completed: 12
                        </Badge>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300">
                          Pending: 8
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TasksTable />
                  </CardContent>
                </Card>
                
                {/* Recent tasks list */}
                <h3 className="font-semibold text-lg mt-8 mb-4">Recent Tasks</h3>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Checkbox id={`task-${i}`} />
                            <div>
                              <CardTitle className="text-base">
                                {[
                                  "Update sales proposal document",
                                  "Schedule follow-up call with client",
                                  "Finalize Q4 budget planning",
                                  "Review contract terms with legal",
                                  "Prepare product roadmap presentation"
                                ][i]}
                              </CardTitle>
                              <CardDescription>
                                Due {["Today", "Tomorrow", "Sep 30", "Oct 2", "Oct 5"][i]} • Assigned by {["Sarah", "John", "Michael", "Emma", "David"][i]}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={
                            (["destructive", "outline", "secondary", "outline", "destructive"] as ("default" | "secondary" | "destructive" | "outline" | null | undefined)[])[i]
                          }>
                            {["High", "Normal", "In Progress", "Under Review", "Critical"][i]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="border-t bg-muted/30 py-2 px-6">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Created Sep {20 + i}, 2025</span>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-primary">View details</span>
                            <span className="font-medium">Mark complete</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="decisions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Decisions</CardTitle>
                    <CardDescription>Important decisions made during meetings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="border-b pb-5">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">
                              {[
                                "Product Feature Prioritization", 
                                "Q4 Marketing Budget Allocation", 
                                "New Vendor Selection"
                              ][i]}
                            </h4>
                            <Badge>
                              {["Approved", "Finalized", "Pending Review"][i]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {[
                              "Decision to prioritize mobile app features over desktop enhancements for Q4.",
                              "Agreed to allocate 60% of budget to digital campaigns and 40% to events.",
                              "Selected DataTech Solutions as the primary data processing vendor after review."
                            ][i]}
                          </p>
                          <div className="flex justify-between text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span>Sep {20 + i}, 2025</span>
                              <span>•</span>
                              <span>Strategy Meeting</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-primary">View context</span>
                              <span className="font-medium">Add comment</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="action-items" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Action Items</CardTitle>
                      <CardDescription>Collaborative tasks for team completion</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <div className="mt-1">
                            <Checkbox id={`team-${i}`} />
                          </div>
                          <div>
                            <label htmlFor={`team-${i}`} className="font-medium text-sm cursor-pointer">
                              {[
                                "Prepare Q4 sales forecast document",
                                "Update client presentation with new metrics",
                                "Schedule technical review with engineering team",
                                "Finalize meeting notes and distribute to stakeholders"
                              ][i]}
                            </label>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {["Sales", "Marketing", "Product", "Operations"][i]}
                              </Badge>
                              <span>•</span>
                              <span>Due Sep {27 + i}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 flex justify-between">
                      <span className="text-sm text-muted-foreground">4 items remaining</span>
                      <button className="text-sm font-medium text-primary">Add new item</button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Action Items</CardTitle>
                      <CardDescription>Personal tasks assigned to you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <div className="mt-1">
                            <Checkbox id={`personal-${i}`} checked={i === 2} />
                          </div>
                          <div>
                            <label 
                              htmlFor={`personal-${i}`} 
                              className={`font-medium text-sm cursor-pointer ${i === 2 ? "line-through text-muted-foreground" : ""}`}
                            >
                              {[
                                "Follow up with client regarding contract amendments",
                                "Prepare analytics report for leadership review",
                                "Update project timeline in management system",
                                "Schedule one-on-one with team members"
                              ][i]}
                            </label>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant={i === 2 ? "outline" : (i === 0 ? "destructive" : "secondary")} className="text-xs">
                                {i === 0 ? "Priority" : (i === 2 ? "Completed" : "In Progress")}
                              </Badge>
                              <span>•</span>
                              <span>Due {i === 0 ? "Today" : `Sep ${27 + i}`}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 flex justify-between">
                      <span className="text-sm text-muted-foreground">3 items remaining</span>
                      <button className="text-sm font-medium text-primary">View all</button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
            {/* <RightPanel /> */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}