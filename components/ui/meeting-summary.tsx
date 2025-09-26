"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MeetingSummaryProps {
  title: string
  date: string
  duration: string
  aiScore?: number
  attendees?: {
    name: string
    avatar?: string
    initials?: string
    color?: string
  }[]
  keyTopics?: {
    topic: string
    duration?: string
    speaker?: string
    priority?: "high" | "medium" | "low"
  }[]
  decisions?: {
    text: string
    owner?: string
    dueDate?: string
  }[]
  insights?: {
    text: string
    icon?: React.ReactNode
    color?: string
  }[]
}

export function MeetingSummary({
  title,
  date,
  duration,
  aiScore = 85,
  attendees = [],
  keyTopics = [],
  decisions = [],
  insights = []
}: MeetingSummaryProps) {
  return (
    <Card className="shadow-md border-slate-200/70 dark:border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{date} · {duration}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className="bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100">AI Summary</Badge>
            <div className="flex items-center gap-1.5">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">AI Quality Score</div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-10 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div 
                    className={`h-full rounded-full ${
                      aiScore >= 80 
                        ? 'bg-emerald-500' 
                        : aiScore >= 60 
                          ? 'bg-amber-500' 
                          : 'bg-rose-500'
                    }`}
                    style={{ width: `${aiScore}%` }}
                  />
                </div>
                <span className="text-xs font-semibold">{aiScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-6">
          {attendees.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Attendees</h4>
              <div className="flex flex-wrap gap-2">
                {attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs">
                    {attendee.avatar ? (
                      <img src={attendee.avatar} alt={attendee.name} className="h-5 w-5 rounded-full" />
                    ) : (
                      <div 
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] font-medium ${attendee.color || 'bg-blue-500'}`}
                      >
                        {attendee.initials}
                      </div>
                    )}
                    <span>{attendee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {keyTopics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Key Topics Discussed</h4>
              <div className="space-y-2">
                {keyTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm">{topic.topic}</div>
                        {(topic.speaker || topic.duration) && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {topic.speaker && `Led by ${topic.speaker}`}
                            {topic.speaker && topic.duration && ' · '}
                            {topic.duration && `${topic.duration}`}
                          </div>
                        )}
                      </div>
                    </div>
                    {topic.priority && (
                      <Badge variant="outline" className={
                        topic.priority === "high" 
                          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                          : topic.priority === "medium"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
                            : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-700"
                      }>
                        {topic.priority}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {decisions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Key Decisions & Action Items</h4>
              <div className="space-y-2">
                {decisions.map((decision, index) => (
                  <div key={index} className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5">
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 mt-0.5 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="flex-1">
                        <div className="text-sm">{decision.text}</div>
                        {(decision.owner || decision.dueDate) && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {decision.owner && (
                              <span className="bg-slate-100 dark:bg-slate-800 rounded-md px-1.5 py-0.5">
                                {decision.owner}
                              </span>
                            )}
                            {decision.owner && decision.dueDate && ' · '}
                            {decision.dueDate && `Due: ${decision.dueDate}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {insights.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">AI Meeting Insights</h4>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5">
                    {insight.icon || (
                      <svg className={`h-4 w-4 mt-0.5 ${insight.color || 'text-teal-600'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.2104 14.83L12.0004 20.59L2.79039 14.83M21.2104 9.17L12.0004 14.93L2.79039 9.17M21.2104 3.5L12.0004 9.26L2.79039 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    <div className="text-sm">{insight.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
        <button className="text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors rounded-md px-2 py-1">
          Export to PDF
        </button>
        <button className="text-sm text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors rounded-md px-2 py-1">
          Share Summary
        </button>
      </CardFooter>
    </Card>
  )
}