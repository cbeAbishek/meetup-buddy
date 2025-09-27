"use client"

import * as React from "react"

export function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="border rounded-md">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-3 py-2"
      >
        <span className="font-medium">{title}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open ? <div className="px-3 py-2 bg-muted text-sm">{children}</div> : null}
    </div>
  )
}
