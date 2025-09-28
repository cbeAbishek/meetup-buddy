"use client"

import React from 'react'
import { UserChat } from '@/components/chat/user-chat'
import { useAuth } from '@/lib/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('user')

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?redirectTo=/chat')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-2rem)]">
      <UserChat 
        className="h-full max-w-none"
        initialUserId={userId || undefined}
      />
    </div>
  )
}
