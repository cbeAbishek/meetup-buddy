"use client"

import * as React from "react"

export function SchedulingTable({ slots }: { slots?: Array<{ time: string; available: number }> }) {
  const list = slots ?? [
    { time: "2025-09-26 10:00", available: 3 },
    { time: "2025-09-26 14:00", available: 2 },
    { time: "2025-09-27 09:00", available: 5 },
  ]
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="text-left">Time</th>
          <th className="text-left">Available</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {list.map((s) => (
          <tr key={s.time} className="border-t">
            <td className="py-2">{s.time}</td>
            <td>{s.available}</td>
            <td>
              <button className="rounded bg-teal-600 px-3 py-1 text-white">Confirm Slot</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
