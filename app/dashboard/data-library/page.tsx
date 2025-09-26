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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { RightPanel } from "@/components/ui/right-panel"

export default function DataLibraryPage() {
  const router = useRouter()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          // slate theme for data library
          "--primary": "#475569",
          "--primary-foreground": "#ffffff",
          "--accent": "#475569",
          "--accent-foreground": "#ffffff",
          "--sidebar-primary": "#475569",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-accent": "#475569",
          "--sidebar-accent-foreground": "#ffffff",
          "--ring": "#94a3b8",
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
                    <Breadcrumb items={["Dashboard", "Data Library"]} />
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700">
                      Today, Sep 26
                    </Badge>
                  </div>
                </div>
              </div>
          
              <div className="mt-2">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Meeting Data Library</h1>
                <p className="mt-1 text-base font-medium text-muted-foreground">Past meetings, sales records, notes</p>
              </div>

          {/* Search and filters bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-end sm:items-center">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">Search Records</label>
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <Input
                  type="search"
                  placeholder="Search by keyword, client, or topic..."
                  className="pl-9 bg-background"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>All Time</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
              <Button variant="outline" size="sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M3 6h18" />
                  <path d="M7 12h10" />
                  <path d="M10 18h4" />
                </svg>
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <rect width="6" height="14" x="4" y="5" rx="2" />
                  <rect width="6" height="10" x="14" y="9" rx="2" />
                  <path d="M17 3v4" />
                  <path d="M7 19v2" />
                </svg>
                Sort
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="meetings">
              <TabsList>
                <TabsTrigger value="meetings">Meetings</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="sales">Sales Records</TabsTrigger>
              </TabsList>

              <TabsContent value="meetings" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Meeting History</CardTitle>
                        <CardDescription>Complete record of all meetings</CardDescription>
                      </div>
                      <Button size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Provide a safe default data array matching the DataTable schema to avoid undefined row models */}
                    <DataTable
                      data={[
                        {
                          id: 1,
                          header: "Q3 Sales Review",
                          type: "Meeting",
                          status: "Done",
                          target: "100",
                          limit: "60",
                          reviewer: "Eddie Lake",
                        },
                        {
                          id: 2,
                          header: "Product Roadmap Planning",
                          type: "Workshop",
                          status: "In Progress",
                          target: "80",
                          limit: "90",
                          reviewer: "Assign reviewer",
                        },
                        {
                          id: 3,
                          header: "Client Onboarding",
                          type: "Onboarding",
                          status: "Not Started",
                          target: "50",
                          limit: "60",
                          reviewer: "Jamik Tashpulatov",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>

                {/* Recent Meetings */}
                <h3 className="font-semibold text-lg mt-8 mb-4">Recently Accessed</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {[
                              "Q3 Sales Review",
                              "Product Roadmap Planning",
                              "Client Onboarding"
                            ][i]}
                          </CardTitle>
                          <Badge variant="outline">
                            {["Sep 15", "Sep 12", "Sep 8"][i]}
                          </Badge>
                        </div>
                        <CardDescription>
                          {[
                            "Internal • 45 minutes",
                            "Product Team • 90 minutes",
                            "Alpha Technologies • 60 minutes"
                          ][i]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs" variant="secondary">
                            {["Sales", "Product", "Onboarding"][i]}
                          </Badge>
                          <Badge className="text-xs" variant="outline">
                            {["Quarterly Review", "Planning", "Client"][i]}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {[
                            "6 participants • 12 action items",
                            "8 participants • 4 decisions made",
                            "4 participants • 8 action items"
                          ][i]}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between bg-muted/50 px-6 py-3">
                        <button className="text-sm font-medium text-primary">View details</button>
                        <button className="text-sm font-medium">Download</button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Meeting Notes</CardTitle>
                        <CardDescription>Searchable repository of all meeting notes</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          New Note
                        </Button>
                        <Button variant="outline" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-b">
                      <div className="grid grid-cols-[1fr,200px,120px] p-4 font-medium text-sm">
                        <div>Title</div>
                        <div>Meeting</div>
                        <div>Date</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-[1fr,200px,120px] p-4 text-sm hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-medium">
                              {[
                                "Q3 Sales Metrics Analysis",
                                "Client Feedback Implementation Plan",
                                "Feature Roadmap Prioritization",
                                "Marketing Campaign Results",
                                "Budget Allocation Discussion"
                              ][i]}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {["Created by Sarah Johnson", "Created by Michael Chen", "Created by Emma Davis", "Created by David Wilson", "Created by James Taylor"][i]}
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            {["Quarterly Review", "Client Meeting", "Product Planning", "Marketing Review", "Finance Meeting"][i]}
                          </div>
                          <div className="text-muted-foreground">Sep {20 - i}, 2025</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 p-4 text-xs text-muted-foreground">
                    Showing 5 of 42 notes
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="sales" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Sales Records</CardTitle>
                        <CardDescription>Meeting-related sales activities and outcomes</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v8" />
                            <path d="M8 12h8" />
                          </svg>
                          Add Record
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-b">
                      <div className="grid grid-cols-[3fr,1fr,1fr,1fr,100px] p-4 font-medium text-sm">
                        <div>Client & Meeting</div>
                        <div>Amount</div>
                        <div>Status</div>
                        <div>Date</div>
                        <div></div>
                      </div>
                    </div>
                    <div className="divide-y">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-[3fr,1fr,1fr,1fr,100px] p-4 text-sm hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-medium">
                              {[
                                "Alpha Technologies",
                                "Bravo Innovations",
                                "Charlie Systems",
                                "Delta Digital",
                                "Echo Solutions"
                              ][i]}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {["Product Demo", "Proposal Review", "Contract Negotiation", "Onboarding Call", "Quarterly Review"][i]}
                            </div>
                          </div>
                          <div className="font-medium">
                            {["$45,000", "$28,500", "$120,000", "$15,750", "$67,800"][i]}
                          </div>
                          <div>
                            <Badge variant={(["secondary", "outline", "secondary", "outline", "destructive"] as const)[i]}>
                              {["Won", "Pending", "Won", "In Progress", "Lost"][i]}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground">Sep {20 - i}, 2025</div>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M12 5v14" />
                                <path d="M5 12h14" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 p-4 flex justify-between">
                    <span className="text-xs text-muted-foreground">Showing 5 of 32 records</span>
                    <span className="text-sm font-medium">Total: $277,050</span>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
            <RightPanel />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}