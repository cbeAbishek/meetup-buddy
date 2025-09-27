"use client"

import * as React from "react"
import { format, startOfMonth, startOfWeek, addDays } from "date-fns"
import { Button } from "@/components/ui/button"

export default function SidebarMiniCalendar({ onSelectDate }: { onSelectDate?: (d: Date) => void }) {
  const today = new Date()
  const start = startOfWeek(startOfMonth(today), { weekStartsOn: 1 })
  const days = Array.from({ length: 42 }).map((_, i) => addDays(start, i))

  return (
    <div className="w-64">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium">{format(today, 'MMMM yyyy')}</div>
        <Button variant="ghost" size="sm" onClick={() => onSelectDate?.(today)}>Today</Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
          <div key={d} className="text-center text-muted-foreground">{d}</div>
        ))}
        {days.map((d) => (
          <button
            key={d.toISOString()}
            onClick={() => onSelectDate?.(d)}
            className="h-8 w-8 rounded-md text-center text-sm hover:bg-muted"
            aria-label={format(d, 'yyyy-MM-dd')}
          >
            {String(d.getDate())}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-sm font-medium mb-2">Calendars</div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Personal</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Team</label>
      </div>
    </div>
  )
}
