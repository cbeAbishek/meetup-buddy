"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const groups = [
  { id: "g1", name: "Product Team", members: 8 },
  { id: "g2", name: "Design Ops", members: 5 },
  { id: "g3", name: "Engineering", members: 12 },
]

export default function GroupsPage() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Groups</h2>
          <p className="text-muted-foreground">Manage your groups</p>
        </div>
        <Button>Create group</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <Card key={g.id} className="cursor-pointer">
            <CardHeader>
              <CardTitle>{g.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{g.members} members</p>
              <div className="mt-3">
                <Link href={`/dashboard/groups/${g.id}`} className="text-teal-600 font-medium">Open</Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
