'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

/**
 * Hook to handle authentication-based redirects
 */
export function useAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (loading) return

    const currentPath = window.location.pathname

    // If user is authenticated and on auth page, redirect
    if (user && currentPath === '/auth') {
      const encoded = searchParams.get('redirectTo')
      const redirectTo = encoded ? decodeURIComponent(encoded) : '/dashboard'
      console.log('Authenticated user on auth page, redirecting to:', redirectTo)
      
      // Use replace to avoid back button issues
      router.replace(redirectTo)
    }
  }, [user, loading, router, searchParams])

  return { user, loading }
}