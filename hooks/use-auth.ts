'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export function useRequireAuth(redirectTo = '/auth') {
  const { user, loading } = useAuth()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShouldRedirect(true)
      // Redirect after a short delay to avoid flash
      const timer = setTimeout(() => {
        window.location.href = `${redirectTo}?redirectTo=${encodeURIComponent(window.location.pathname)}`
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, loading, redirectTo])

  return {
    user,
    loading,
    shouldRedirect,
    isAuthenticated: !!user && !loading
  }
}

export function useOptionalAuth() {
  const { user, loading, session } = useAuth()
  
  return {
    user,
    loading,
    session,
    isAuthenticated: !!user && !loading,
    isGuest: !user && !loading
  }
}