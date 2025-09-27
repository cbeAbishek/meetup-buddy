"use client"

import * as React from "react"
import { format, startOfWeek, addDays, addHours, startOfDay, isSameDay, isSameMinute, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu as Menu, DropdownMenuContent as MenuContent, DropdownMenuItem as MenuItem, DropdownMenuTrigger as MenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type CalendarEvent = {
  id: string
  title: string
  start: string // ISO
  end: string // ISO
  color?: string
}

export function WeekCalendar({
  events: initial = [],
}: {
  events?: CalendarEvent[]
}) {
  const [events, setEvents] = React.useState<CalendarEvent[]>(
    initial.map((e) => ({ ...e }))
  )

  const [currentWeekStart, setCurrentWeekStart] = React.useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const hours = Array.from({ length: 24 }).map((_, i) => i)
  // Use the index from map to derive each day in the week
  const days = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i))

  function goNextWeek() {
    setCurrentWeekStart((d: Date) => addDays(d, 7))
  }
  function goPrevWeek() {
    setCurrentWeekStart((d: Date) => addDays(d, -7))
  }
  function goToday() {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  function handleCreateQuick(date: Date) {
    // Keep the hour that was clicked (cellStart) instead of normalizing to midnight
    const id = String(Math.random()).slice(2)
    const start = date
    const end = addHours(start, 1)
    const title = `New event ${id}`
    const newEvt: CalendarEvent = { id, title, start: start.toISOString(), end: end.toISOString(), color: "#6366F1" }
    setEvents((s) => [...s, newEvt])
  }

  function handleDelete(id: string) {
    setEvents((s) => s.filter((e) => e.id !== id))
  }

  // Parse event dates once per render for performance and correctness
  const parsed = React.useMemo(
    () => events.map((ev) => ({ ev, s: parseISO(ev.start), e: parseISO(ev.end) })),
    [events]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goPrevWeek} aria-label="Previous week">◀</Button>
          <Button variant="ghost" size="icon" onClick={goToday} aria-label="Today">Today</Button>
          <Button variant="ghost" size="icon" onClick={goNextWeek} aria-label="Next week">▶</Button>
          <div className="ml-4 text-sm font-medium">{format(currentWeekStart, "MMM d")}-{format(addDays(currentWeekStart,6), "MMM d, yyyy")}</div>
        </div>
        <div className="flex items-center gap-2">
          <input aria-label="Search calendar events" placeholder="Search..." className="rounded-md border px-3 py-1 text-sm" />
          <Button variant="ghost" size="icon" aria-label="Settings">⚙</Button>
          <Button variant="ghost" size="icon" aria-label="Profile">UA</Button>
        </div>
      </div>

      <div className="grid grid-cols-[80px_1fr] gap-2">
        {/* left time column */}
        <div className="flex flex-col">
          <div className="h-10" />
          {hours.map((h) => (
            <div key={h} className="h-16 flex items-start text-xs text-muted-foreground">{String(h).padStart(2, '0')}:00</div>
          ))}
        </div>

        {/* main grid */}
        <div className="overflow-auto rounded-lg border bg-background">
          <div className="grid grid-cols-7 border-b">
            {days.map((d) => (
              <div key={d.toISOString()} className="p-2 text-sm text-muted-foreground text-center">
                <div className={cn("inline-flex items-center justify-center rounded-full w-8 h-8 mx-auto", isSameDay(d, new Date()) ? "bg-indigo-500 text-white" : "")}>{format(d, "EEE d")}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {hours.map((h) => (
              <React.Fragment key={h}>
                {days.map((d) => {
                  const cellStart = addHours(startOfDay(d), h)
                  // Use parsed dates and treat events as [start, end) (start inclusive, end exclusive)
                  const inEvents = parsed.filter(({ ev, s, e }) => {
                    return (s <= cellStart && cellStart < e) || isSameMinute(s, cellStart)
                  }).map((p) => p.ev)

                  return (
                    <div key={`${d.toISOString()}-${h}`} className="h-16 border-t border-r p-1 text-xs relative group">
                      {inEvents.map((ev) => (
                        <div key={ev.id} className="absolute left-1 right-1 top-1 bottom-1 rounded-md bg-indigo-100/80 p-1 text-xs overflow-hidden">
                          <div className="flex items-center justify-between">
                            <div className="truncate font-medium">{ev.title}</div>
                            <button aria-label={`Delete ${ev.title}`} onClick={() => handleDelete(ev.id)} className="ml-2 text-xs text-red-600">✕</button>
                          </div>
                        </div>
                      ))}

                      {/* quick create on right-click */}
                      <div
                        role="button"
                        tabIndex={0}
                        onContextMenu={(e) => {
                          e.preventDefault()
                          handleCreateQuick(cellStart)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleCreateQuick(cellStart)
                          }
                        }}
                        className="absolute inset-0"
                        aria-label={`Create event at ${format(cellStart, 'yyyy-MM-dd HH:mm')}`}>
                      </div>
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
