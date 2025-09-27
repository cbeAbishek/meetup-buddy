"use client"

import * as React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const { user } = useAuth()

  if (!user) return null

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
          MB
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight">Meetup Buddy</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">AI Meeting Assistant</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15.5 15.5M15.5 15.5C17.0913 13.9087 18 11.7956 18 9.5C18 7.20435 17.0913 5.09129 15.5 3.5C13.9087 1.90871 11.7956 1 9.5 1C7.20435 1 5.09129 1.90871 3.5 3.5C1.90871 5.09129 1 7.20435 1 9.5C1 11.7956 1.90871 13.9087 3.5 15.5C5.09129 17.0913 7.20435 18 9.5 18C11.7956 18 13.9087 17.0913 15.5 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input 
            placeholder="Search..." 
            className="h-9 w-[180px] md:w-[240px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-500/20 transition-all group-hover:w-[200px] md:group-hover:w-[280px]" 
          />
          <div className="absolute inset-y-0 right-3 flex items-center text-slate-400">
            <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:text-slate-400 opacity-100 group-hover:opacity-0">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900 dark:to-indigo-900 p-[1px]">
              <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 p-[2px]">
                <AvatarImage 
                  src={avatarUrl} 
                  alt={displayName}
                  className="h-full w-full rounded-full object-cover" 
                />
                <AvatarFallback className="h-full w-full rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </div>
            </div>
          </Avatar>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{displayName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
