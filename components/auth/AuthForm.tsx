"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              disabled={loading}
            >
              {mode === 'signup' ? 'Have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
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
