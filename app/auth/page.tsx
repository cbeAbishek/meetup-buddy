"use client"

import React from 'react'
import AuthForm from '@/components/auth/AuthForm'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

export default function AuthPage() {
  // Handle redirects for authenticated users
  useAuthRedirect()

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="p-6 w-full max-w-3xl">
        <AuthForm />
      </div>
    </main>
  )
}
