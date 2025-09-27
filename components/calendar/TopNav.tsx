"use client"

import * as React from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

type View = 'month' | 'week' | 'day' | 'agenda'

export default function TopNav({ currentDate, view, setView, onToday }: { currentDate: Date, view: View, setView: React.Dispatch<React.SetStateAction<View>>, onToday: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="inline-flex rounded-md shadow-sm">
          <Button variant={view==='month' ? 'default' : 'ghost'} onClick={() => setView('month')}>Month</Button>
          <Button variant={view==='week' ? 'default' : 'ghost'} onClick={() => setView('week')}>Week</Button>
          <Button variant={view==='day' ? 'default' : 'ghost'} onClick={() => setView('day')}>Day</Button>
          <Button variant={view==='agenda' ? 'default' : 'ghost'} onClick={() => setView('agenda')}>Agenda</Button>
        </div>
        <Button variant="outline" onClick={onToday}>Today</Button>
        <div className="ml-4 text-sm font-medium">{format(currentDate, 'MMMM yyyy')}</div>
      </div>
      <div className="flex items-center gap-3">
        <input placeholder="Search" className="rounded-md border px-3 py-1 text-sm" />
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">UA</div>
      </div>
    </div>
  )
}
