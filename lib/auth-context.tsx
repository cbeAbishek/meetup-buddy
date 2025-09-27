'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const syncSessionWithServer = async (
      event: AuthChangeEvent | 'INITIAL_SESSION',
      session: Session | null
    ) => {
      try {
        await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ event, session }),
        })
      } catch (callbackError) {
        console.error('Error syncing auth session:', callbackError)
      }
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.error('Error getting session:', error)
        } else {
          console.log('Initial session:', session ? 'Found' : 'None')
          setSession(session)
          setUser(session?.user ?? null)

          if (session) {
            await syncSessionWithServer('INITIAL_SESSION', session)
          }
        }
      } catch (error) {
        if (mounted) {
          console.error('Error in getInitialSession:', error)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session')
        await syncSessionWithServer(event, session)

        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle different auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully')
          
          // Only redirect if we're on the auth page
          const currentPath = window.location.pathname
          if (currentPath === '/auth' || currentPath === '/') {
            // Get the redirectTo parameter from URL
            const urlParams = new URLSearchParams(window.location.search)
            const redirectTo = urlParams.get('redirectTo')
            
            // Use Next.js router to navigate
            const targetPath = redirectTo || '/dashboard'
            console.log('Redirecting to:', targetPath)
            
            // Use replace instead of push to avoid back button issues
            router.replace(targetPath)
          } else {
            // Force a page refresh to update all components if not on auth page
            router.refresh()
          }
          
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
          
          // Only redirect to auth if we're on a protected page
          const currentPath = window.location.pathname
          if (currentPath.startsWith('/dashboard')) {
            router.push('/auth')
          }
          // Force a page refresh to update all components
          router.refresh()
          
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log('Attempting to sign in user:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }

      console.log('Sign in successful:', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('Sign in exception:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true)
      console.log('Attempting to sign up user:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        console.error('Sign up error:', error)
        return { error }
      }

      console.log('Sign up successful:', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('Sign up exception:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('Signing out user')
      
      await supabase.auth.signOut()
      
      // Clear any additional local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('meetup_buddy_session')
      }
      
      console.log('Sign out successful')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}