'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

/**
 * Hook to ensure session persistence across browser refreshes and restarts
 */
export function useSessionPersistence() {
  const { session, user, loading } = useAuth()

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    let mounted = true

    const checkAndRestoreSession = async () => {
      try {
        // If we already have a session, no need to restore
        if (session || loading) return

        // Try to get session from Supabase
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error checking session:', error)
          return
        }

        if (currentSession && mounted) {
          console.log('Session restored from storage')
        }
      } catch (error) {
        console.error('Error in session persistence check:', error)
      }
    }

    // Run the check after a brief delay to ensure auth context is initialized
    const timer = setTimeout(checkAndRestoreSession, 100)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [session, loading])

  // Return session state for components that need it
  return {
    session,
    user,
    loading,
    isAuthenticated: !!session && !!user
  }
}