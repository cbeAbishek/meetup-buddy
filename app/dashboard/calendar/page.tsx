"use client"

import * as React from "react"
import CalendarShell from "@/components/calendar/CalendarShell"
import SidebarMiniCalendar from "@/components/calendar/SidebarMiniCalendar"
import TopNav from "@/components/calendar/TopNav"
import MonthView from "@/components/calendar/MonthView"
import EventDialog from "@/components/calendar/EventDialog"
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
    <CalendarShell>
      <aside>
        <SidebarMiniCalendar onSelectDate={(d) => setCurrentDate(d)} />
      </aside>

      <main className="flex-1">
        <TopNav currentDate={currentDate} view={view} setView={(v) => setView(v as any)} onToday={() => setCurrentDate(new Date())} />
        {view === 'month' && <MonthView date={currentDate} events={events} onEventClick={handleEventClick} />}
        {/* week/day/agenda views can reuse WeekCalendar and other components later */}
      </main>

      <EventDialog event={selected} open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} />
    </CalendarShell>
  )
}

