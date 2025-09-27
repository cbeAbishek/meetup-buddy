"use client"

import * as React from "react"
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"

type Event = { id: string; title: string; start: string; end: string; color?: string }

export default function MonthView({ date, events, onEventClick }: { date: Date, events: Event[]; onEventClick?: (e: Event) => void }) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
  const days = [] as Date[]
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d)

  const eventsByDay = new Map<string, Event[]>()
  events.forEach((ev) => {
    const day = format(parseISO(ev.start), 'yyyy-MM-dd')
    eventsByDay.set(day, [...(eventsByDay.get(day) || []), ev])
  })

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
        <div key={d} className="text-xs text-muted-foreground text-center">{d}</div>
      ))}
      {days.map((d) => {
        const key = format(d, 'yyyy-MM-dd')
        const dayEvents = eventsByDay.get(key) || []
        return (
          <div key={key} className={`min-h-[100px] p-1 border ${isSameMonth(d, date) ? '' : 'bg-muted/10'}`} aria-label={format(d, 'yyyy-MM-dd') }>
            <div className={`text-xs ${isSameDay(d, new Date()) ? 'font-semibold' : ''}`}>{format(d, 'd')}</div>
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0,3).map((ev) => (
                <button key={ev.id} onClick={() => onEventClick?.(ev)} className="block w-full text-left rounded-md px-1 py-0.5 text-xs truncate" style={{ background: ev.color || '#60A5FA' }} aria-label={ev.title}>
                  <span className="text-white text-xs">{ev.title}</span>
                </button>
              ))}
              {dayEvents.length > 3 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
