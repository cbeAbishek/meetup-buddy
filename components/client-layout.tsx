'use client'

import React from 'react'
import { AuthNavigation } from '@/components/auth-navigation'
import { useSessionPersistence } from '@/hooks/use-session-persistence'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  // Initialize session persistence
  useSessionPersistence()

  return (
    <>
      {/* Global header */}
      <header className="border-b bg-white/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-extrabold text-[color:var(--primary)] hover:text-[color:var(--primary)]/80 transition-colors">
              Meetup Buddy
            </a>
            <nav className="hidden md:flex gap-4 text-sm text-slate-600">
              <a
                className="hover:text-[color:var(--primary)] transition-colors"
                href="#features"
              >
                Features
              </a>
              <a
                className="hover:text-[color:var(--primary)] transition-colors"
                href="#pricing"
              >
                Pricing
              </a>
              <a
                className="hover:text-[color:var(--primary)] transition-colors"
                href="#contact"
              >
                Contact
              </a>
            </nav>
          </div>

          <AuthNavigation />
        </div>
      </header>

      <main className="min-h-screen">{children}</main>

      {/* Simple footer for consistent layout */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-6 py-6 text-sm text-slate-600 text-center">
          © {new Date().getFullYear()} Meetup Buddy. All rights reserved.
        </div>
      </footer>
    </>
  )
}