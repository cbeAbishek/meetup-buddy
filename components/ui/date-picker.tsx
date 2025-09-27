"use client"

import * as React from "react"

export function DatePicker({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="rounded-md border px-2 py-1"
    />
  )
}
