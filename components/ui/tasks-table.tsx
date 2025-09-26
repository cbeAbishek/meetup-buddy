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
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th>Task</th>
          <th>Owner</th>
          <th>Deadline</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {list.map((t) => (
          <tr key={t.id} className="border-t">
            <td className="py-2">{t.task}</td>
            <td>{t.owner}</td>
            <td>{t.deadline}</td>
            <td>
              <button onClick={() => toggleDone(t.id)} className={`px-2 py-1 rounded ${t.status === "Done" ? "bg-green-500 text-white" : "bg-yellow-300"}`}>
                {t.status}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
