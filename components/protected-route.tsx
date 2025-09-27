'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { AuthLoading } from '@/components/ui/loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated and we're not loading
    if (!loading && !user) {
      setShouldRedirect(true)
      const timer = setTimeout(() => {
        const currentPath = window.location.pathname + window.location.search
        const redirectUrl = `/auth?redirectTo=${encodeURIComponent(currentPath)}`
        console.log('Protected route redirecting to:', redirectUrl)
        router.replace(redirectUrl)
      }, 100) // Small delay to prevent flash
      
      return () => clearTimeout(timer)
    } else if (!loading && user) {
      setShouldRedirect(false)
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return fallback || <AuthLoading message="Verifying authentication..." />
  }

  // If we should redirect, show loading state briefly
  if (shouldRedirect) {
    return fallback || <AuthLoading message="Redirecting to sign in..." />
  }

  // If no user after loading is complete, don't render anything
  if (!user) {
    return fallback || null
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}