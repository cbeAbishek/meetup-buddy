"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type EventForm = {
  id?: string
  title?: string
  start?: string
  end?: string
  description?: string
}

export default function EventDialog({ event, open, onClose, onSave }: { event?: EventForm; open: boolean; onClose: () => void; onSave: (e: EventForm) => void }) {
  const [form, setForm] = React.useState<EventForm>(event || {})

  React.useEffect(() => setForm(event || {}), [event])

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event?.id ? 'Edit event' : 'Create event'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <Input placeholder="Title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Start (ISO)" value={form.start || ''} onChange={(e) => setForm({ ...form, start: e.target.value })} />
          <Input placeholder="End (ISO)" value={form.end || ''} onChange={(e) => setForm({ ...form, end: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={() => { onSave(form); onClose(); }}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
