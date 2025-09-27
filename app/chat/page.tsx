"use client"

import React from 'react'
import { Chat } from '@/components/chat'

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <Chat />
      </div>
    </main>
  )
}
