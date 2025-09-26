'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function useAuthRouter() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const pushWithAuth = (path: string) => {
    if (loading) return
    
    // If trying to access protected route without auth
    if (path.startsWith('/dashboard') && !user) {
      router.push(`/auth?redirectTo=${encodeURIComponent(path)}`)
      return
    }
    
    // If trying to access auth page while authenticated
    if (path === '/auth' && user) {
      router.push('/dashboard')
      return
    }
    
    // Normal navigation
    router.push(path)
  }

  const replaceWithAuth = (path: string) => {
    if (loading) return
    
    // If trying to access protected route without auth
    if (path.startsWith('/dashboard') && !user) {
      router.replace(`/auth?redirectTo=${encodeURIComponent(path)}`)
      return
    }
    
    // If trying to access auth page while authenticated
    if (path === '/auth' && user) {
      router.replace('/dashboard')
      return
    }
    
    // Normal navigation
    router.replace(path)
  }

  return {
    push: pushWithAuth,
    replace: replaceWithAuth,
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
    user,
    loading,
    isAuthenticated: !!user && !loading
  }
}