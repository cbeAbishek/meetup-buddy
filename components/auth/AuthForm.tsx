"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Simple inline SVGs for Google and Facebook icons to avoid new deps
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M44.5 20H24v8.5h11.9C34.2 32.8 29.6 36 24 36c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.6 0 6.9 1.3 9.4 3.6l6.6-6.6C36.9 2.6 30.8 0 24 0 10.8 0 0 10.8 0 24s10.8 24 24 24c12.4 0 22.6-9 24-20.5.1-1 .5-2 .5-3.5 0-.9-.1-1.7-.5-2.5z" fill="#FFC107"/>
    <path d="M6.3 14.8l6.6 4.8C14.9 16.3 19 13 24 13c3.6 0 6.9 1.3 9.4 3.6l6.6-6.6C36.9 2.6 30.8 0 24 0 16.5 0 10.1 4 6.3 14.8z" fill="#FF3D00"/>
    <path d="M24 48c6.8 0 12.9-2.6 17.5-6.8l-8.1-6.6C29 37.3 26 38 24 38c-5.6 0-10.2-3.2-12.1-7.7l-6.6 5.1C8.9 41.9 16.9 48 24 48z" fill="#4CAF50"/>
    <path d="M44.5 20H24v8.5h11.9C35 32 30.6 36 24 36c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.6 0 6.9 1.3 9.4 3.6l6.6-6.6C36.9 2.6 30.8 0 24 0v20z" fill="#1976D2"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5 3.66 9.13 8.44 9.95v-7.05H8.1v-2.9h2.34V9.41c0-2.3 1.37-3.57 3.47-3.57.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.9h-2.1v7.05C18.34 21.2 22 17.07 22 12.07z" fill="#1877F2"/>
  </svg>
)

export default function AuthForm() {
  const { signIn, signUp, loading, user } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSql, setShowSql] = useState(false)

  // Don't show the form if user is already authenticated
  if (user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-sm text-green-700 bg-green-50 p-4 rounded">
              You are already signed in. Redirecting to dashboard...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  async function handleSignUp() {
    setError(null)
    setMessage(null)
    setShowSql(false)

    // Quick config check
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      return
    }

    // Basic input validation
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    try {
      const { error: signUpError } = await signUp(email, password, { full_name: name })

      if (signUpError) {
        const msg = signUpError.message ?? String(signUpError)
        // If user already exists, attempt sign-in
        if (/already exists|duplicate|user exists|User already registered/i.test(msg)) {
          const { error: signInError } = await signIn(email, password)
          if (signInError) {
            setError(signInError.message ?? String(signInError))
            return
          }
          // Don't set message, let auth state handle redirect
          console.log('Existing user signed in successfully')
          return
        }
        setError(msg)
        return
      }

      // Don't set success message for new signups either - let auth handle it
      console.log('Sign up successful, waiting for auth state change...')
      
      // Try to create profile after successful signup
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: user.id,
            email,
            full_name: name || null
          })

          if (profileError) {
            const pm = profileError.message ?? String(profileError)
            if (/relation|does not exist|no such table/i.test(pm)) {
              setShowSql(true)
              setError('Profiles table not found in your database.')
            } else {
              setError(pm)
            }
            return
          }
        }
      } catch (profileError) {
        console.log('Profile creation error (non-critical):', profileError)
      }
    } catch (err: any) {
      setError(err?.message ?? String(err))
    }
  }

  async function handleSignIn() {
    setError(null)
    setMessage(null)

    if (!isSupabaseConfigured) {
      setError('Supabase not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      return
    }

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message ?? String(error))
        return
      }

      // Don't set a success message here - let the auth state change handle the redirect
      console.log('Sign in successful, waiting for auth state change...')
    } catch (err: any) {
      setError(err?.message ?? String(err))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup') {
      await handleSignUp()
    } else {
      await handleSignIn()
    }
  }

  // OAuth sign-in
  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setError(null)
    setMessage(null)

    if (!isSupabaseConfigured) {
      setError('Supabase not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      return
    }

    try {
      // Supabase v2 OAuth helper
      await supabase.auth.signInWithOAuth({ provider })
    } catch (err: any) {
      setError(err?.message ?? String(err))
    }
  }

  const sqlSnippet = `-- Run this in Supabase SQL editor to create a simple profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  full_name text,
  created_at timestamptz DEFAULT now()
);`

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'signup' ? 'Create account' : 'Sign in'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Social sign-in buttons */}
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" className="flex items-center justify-center gap-2" onClick={() => handleOAuth('google')}>
              <GoogleIcon />
              Continue with Google
            </Button>

            <Button type="button" variant="outline" className="flex items-center justify-center gap-2" onClick={() => handleOAuth('facebook')}>
              <FacebookIcon />
              Continue with Facebook
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex-1 h-px bg-slate-200" />
              <div>or continue with email</div>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          </div>
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name (optional)</Label>
              <Input
                id="name"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
            <div className="flex items-center justify-between gap-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                disabled={loading}
              >
                {mode === 'signup' ? 'Have an account? Sign in' : "Don't have an account? Sign up"}
              </Button>

              {/* Explicit create account link when on sign-in */}
              {mode === 'signin' && (
                <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setMode('signup')}>
                  Create an account
                </button>
              )}
            </div>
          </div>

          {message && <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{message}</div>}
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          {showSql && (
            <div className="mt-3 bg-slate-50 p-3 rounded border">
              <div className="text-sm mb-2">Profiles table missing — run this SQL in Supabase SQL editor:</div>
              <pre className="text-xs overflow-auto whitespace-pre-wrap">{sqlSnippet}</pre>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
