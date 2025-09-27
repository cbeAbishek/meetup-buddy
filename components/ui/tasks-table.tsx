"use client"

import * as React from "react"

export function TasksTable({ tasks }: { tasks?: Array<any> }) {
  const [list, setList] = React.useState(tasks ?? [
    { id: 1, task: "Follow up pricing", owner: "Alice", deadline: "2025-09-30", status: "Pending" },
  ])

  function toggleDone(id: number) {
    setList((l) => l.map((t) => (t.id === id ? { ...t, status: t.status === "Done" ? "Pending" : "Done" } : t)))
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3">Task</th>
            <th className="text-left px-4 py-3">Owner</th>
            <th className="text-left px-4 py-3">Deadline</th>
            <th className="text-left px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => (
            <tr key={t.id} className="border-t hover:bg-muted/50">
              <td className="px-4 py-3 truncate max-w-xs">{t.task}</td>
              <td className="px-4 py-3">{t.owner}</td>
              <td className="px-4 py-3">{t.deadline}</td>
              <td className="px-4 py-3">
                <button onClick={() => toggleDone(t.id)} className={`inline-flex items-center h-9 px-3 rounded-lg text-sm ${t.status === "Done" ? "bg-green-600 text-white" : "bg-yellow-300 text-foreground"}`}>
                  {t.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
