"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function RightPanel() {
  return (
    <aside className="hidden lg:block w-[320px] p-6 border-l border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div className="space-y-6">
        {/* AI Assistant Card */}
        <Card className="bg-gradient-to-b from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/10 border-teal-200 dark:border-teal-800/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">AI Assistant</CardTitle>
              <Badge variant="outline" className="bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-900/40 dark:border-teal-700 dark:text-teal-600">
                Active
              </Badge>
            </div>
            <CardDescription className="text-teal-600 dark:text-teal-600">Your meeting copilot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-200 text-teal-600 flex items-center justify-center mt-0.5" aria-hidden>
                    <svg aria-label="meeting-clock" role="img" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                      <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.76121C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38643 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C10.6868 22 9.38643 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2ZM12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                <div className="text-sm text-foreground flex-1">
                  Preparing for <strong>Q4 Planning</strong> meeting in 3 hours
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-200 text-teal-600 flex items-center justify-center mt-0.5" aria-hidden>
                  <svg aria-label="action-items" role="img" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-sm text-foreground flex-1">
                  3 action items need attention before the meeting
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-200 text-teal-600 flex items-center justify-center mt-0.5" aria-hidden>
                  <svg aria-label="stats" role="img" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                    <path d="M12 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-sm text-foreground flex-1">
                  Q3 sales exceeded targets by 12%
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <button className="w-full h-10 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-teal-600/20">
              Generate Meeting Brief
            </button>
          </CardFooter>
        </Card>

        {/* Trust Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Trust Score</CardTitle>
            <CardDescription>Based on follow-up completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-sm font-semibold text-teal-600 dark:text-teal-600">75%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-teal-600 rounded-full" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Action Completion</span>
                  <span className="text-sm font-semibold text-teal-600 dark:text-teal-600">82%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-emerald-500 rounded-full" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Meeting Attendance</span>
                  <span className="text-sm font-semibold text-teal-600 dark:text-teal-600">90%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-sky-500 rounded-full" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Documentation</span>
                  <span className="text-sm font-semibold text-teal-600 dark:text-teal-600">60%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-amber-500 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meeting Notes Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Meeting Notes</CardTitle>
            <CardDescription>Quick access to your notes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="current" className="flex-1">Current</TabsTrigger>
                <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                <TabsTrigger value="past" className="flex-1">Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                <textarea 
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:ring-teal-500/20 min-h-[120px] resize-none" 
                  placeholder="Add notes for the Q4 Planning meeting..."
                  defaultValue="- Prepare Q3 sales figures
- Review marketing budget allocations
- Discuss new hiring plan for Q1 2024"
                />
                <div className="flex justify-end mt-2">
                  <button className="text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors rounded-md px-2 py-1" aria-label="save-notes">
                    Save to Cloud
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming">
                <div className="flex items-center justify-center h-[140px] text-sm text-slate-500 dark:text-slate-400">
                  No notes for upcoming meetings
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-sm">
                    <div className="font-medium">Q3 Review - April 18</div>
                    <div className="mt-1 text-slate-500 text-sm">
                      Discussed Q3 results. Sales up 7%, marketing needs budget review.
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-sm">
                    <div className="font-medium">Product Roadmap - April 5</div>
                    <div className="mt-1 text-slate-500 text-sm">
                      New features timeline approved for Q2-Q3.
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* AI Meeting Preparation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>AI Meeting Prep</CardTitle>
            <CardDescription>Context and suggested talking points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-sm">
                <div className="font-medium mb-1">Key Points to Address</div>
                <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300 list-disc ml-4">
                  <li>Q3 sales figures exceeded projections by 12%</li>
                  <li>Marketing campaign ROI needs discussion</li>
                  <li>Hiring plan for Q1 2024 needs approval</li>
                </ul>
              </div>
              
              <div className="rounded-md bg-slate-50 dark:bg-slate-800/50 p-2.5 text-sm">
                <div className="font-medium mb-1">Topic Research</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  AI has compiled research on industry trends and competitor analysis to support your discussion points.
                </div>
              </div>
              
              <button className="w-full flex items-center justify-center gap-1.5 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 transition-colors" aria-label="download-research">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download Full Research
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
