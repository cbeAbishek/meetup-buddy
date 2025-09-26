'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AuthNavigation() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      console.log('User initiated sign out')
      await signOut()
      // Force navigation to home page after sign out
      router.push('/')
      // Force page refresh to ensure clean state
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Show loading skeleton
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  // Show authenticated user navigation
  if (user) {
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
    const userInitials = displayName.charAt(0).toUpperCase()

    return (
      <div className="flex items-center gap-4">
        {/* Show welcome message */}
        <span className="hidden md:inline text-sm text-slate-600">
          Welcome, {displayName}
        </span>
        
        {/* Dashboard link if not already on dashboard */}
        {!pathname.startsWith('/dashboard') && (
          <Link 
            href="/dashboard" 
            className="text-sm text-[color:var(--primary)] font-medium hover:text-[color:var(--primary)]/80 transition-colors"
          >
            Dashboard
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
                <AvatarFallback className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)]">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{displayName}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Show sign in/up options for unauthenticated users
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth"
        className="text-sm text-[color:var(--primary)] font-medium hover:text-[color:var(--primary)]/80 transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/auth"
        className="ml-2 px-3 py-2 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-sm hover:bg-[color:var(--primary)]/90 transition-colors"
      >
        Get started
      </Link>
    </div>
  )
}