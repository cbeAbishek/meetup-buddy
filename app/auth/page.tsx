"use client"

import React from 'react'
import { GalleryVerticalEnd } from 'lucide-react'
import AuthForm from '@/components/auth/AuthForm'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

export default function AuthPage() {
  useAuthRedirect()

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Removed company logo/header per request */}
        <div className="sr-only">Authentication</div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AuthForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex items-center justify-center">
        {/* Real-world free stock photo from Unsplash as primary image */}
        <img
          src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
          alt="Team meeting"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  )
}
