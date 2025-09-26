"use client"

import * as React from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Badge } from "@/components/ui/badge"
import CalendarShell from "@/components/calendar/CalendarShell"
import SidebarMiniCalendar from "@/components/calendar/SidebarMiniCalendar"
import TopNav from "@/components/calendar/TopNav"
import MonthView from "@/components/calendar/MonthView"
import EventDialog from "@/components/calendar/EventDialog"
import { RightPanel } from "@/components/ui/right-panel"
import mock from "@/lib/mock-data/meetings.json"

export default function CalendarPage() {
  const [view, setView] = React.useState<'month'|'week'|'day'|'agenda'>('month')
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [events, setEvents] = React.useState(() => (mock as any[]).map((m) => ({ id: String(m.id), title: m.title, start: m.date, end: m.date, color: '#60A5FA' })))
  const [selected, setSelected] = React.useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  function handleEventClick(e: any) {
    setSelected(e)
    setDialogOpen(true)
  }

  function handleSave(event: any) {
    if (event.id) {
      setEvents((s) => s.map((ev) => ev.id === event.id ? { ...ev, ...event } : ev))
    } else {
      setEvents((s) => [...s, { ...event, id: String(Math.random()).slice(2), color: '#60A5FA' }])
    }
  }

  return (
    <div className="flex">
      <main className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between">
          <Breadcrumb items={["Dashboard", "Calendar"]} />
          <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950/50 dark:text-teal-600 dark:border-teal-800">
            Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
        </div>
        
        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Calendar</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">View and manage your meetings and events</p>
        </div>

        <div className="mt-8">
          <CalendarShell>
            <aside className="w-64 mr-6">
              <SidebarMiniCalendar onSelectDate={(d) => setCurrentDate(d)} />
            </aside>

            <main className="flex-1">
              <TopNav currentDate={currentDate} view={view} setView={(v) => setView(v as any)} onToday={() => setCurrentDate(new Date())} />
              {view === 'month' && <MonthView date={currentDate} events={events} onEventClick={handleEventClick} />}
              {/* week/day/agenda views can be added later */}
            </main>
          </CalendarShell>
        </div>

        <EventDialog event={selected} open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} />
      </main>

      <RightPanel />
    </div>
  )
}

