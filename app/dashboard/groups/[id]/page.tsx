"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function GroupDetail({ params }: { params: { id: string } }) {
  const { id } = params
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Group {id}</h2>
        <p className="text-muted-foreground">Group details and activity</p>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <Card>
            <CardHeader>
              <CardTitle>Kanban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted p-2 rounded">Todo</div>
                <div className="bg-muted p-2 rounded">In Progress</div>
                <div className="bg-muted p-2 rounded">Done</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Group Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-auto">Chat window (mock)</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div>Upcoming & past meetings list (mock)</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
