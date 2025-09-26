"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { supabase, isSupabaseConfigured, SUPABASE_URL } from '@/lib/supabase'

export default function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSql, setShowSql] = useState(false)
  const [rawResponse, setRawResponse] = useState<any | null>(null)

  // Helper: extract user id from various Supabase auth responses
  function extractUserIdFromAuthResponse(resp: any) {
    if (!resp) return null
    // Supabase v2 may return { data: { user } } or { data: { session, user } }
    const maybeUser = resp.user ?? resp.data?.user ?? resp.data?.session?.user ?? resp
    return maybeUser?.id ?? null
  }

  async function handleSignUp() {
    setError(null)
    setMessage(null)
    setShowSql(false)
    setLoading(true)
    // Quick config check
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      setLoading(false)
      return
    }
    // Basic input validation
    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }
    try {
      // Use supabase directly for clearer response shape
      const res = await supabase.auth.signUp({ email, password })

      // Save/debug the full response so UI can display it for debugging
      setRawResponse(res)
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('supabase.signUp response:', res)
      }

      // If there's an error, handle existing-user case or show error
      if (res.error) {
        const msg = res.error.message ?? String(res.error)
        // If user already exists, attempt sign-in
        if (/already exists|duplicate|user exists|User already registered/i.test(msg)) {
          const signInRes = await supabase.auth.signInWithPassword({ email, password })
          setRawResponse(signInRes)
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug('supabase.signIn (existing user) response:', signInRes)
          }
          if (signInRes.error) {
            setError(signInRes.error.message ?? String(signInRes.error))
            return
          }
          const userId = extractUserIdFromAuthResponse(signInRes.data ?? signInRes)
          if (userId) {
            // Ensure profile exists
            const { error: profileError } = await supabase.from('profiles').upsert({ id: userId, email, full_name: name || null })
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
            setMessage('Existing user signed in and profile upserted.')
            return
          }
        }

        setError(msg)
        return
      }

  // No immediate error. Extract user id if available.
  const userId = extractUserIdFromAuthResponse(res.data ?? res)

      if (userId) {
        // user created and available: upsert profile
        const { error: profileError } = await supabase.from('profiles').upsert({ id: userId, email, full_name: name || null }).select()
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

        setMessage('Sign-up successful. Profile created/updated.')
      } else {
        // No user id present — likely email confirmation required
        setMessage('Sign-up initiated. Check your email to confirm your account. Profile will be created after confirmation.')
      }
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleSignIn() {
    setError(null)
    setMessage(null)
    setLoading(true)
    if (!isSupabaseConfigured) {
      setError('Supabase not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      setLoading(false)
      return
    }
    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }
    try {
  const res = await supabase.auth.signInWithPassword({ email, password })
  setRawResponse(res)
      if (res.error) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.debug('supabase.signInWithPassword response (error):', res)
        }
        setError(res.error.message ?? String(res.error))
        return
      }

      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('supabase.signInWithPassword response (success):', res)
      }

      const userId = extractUserIdFromAuthResponse(res.data ?? res)
      if (userId) {
        // Ensure profile exists for this user
        const { error: profileError } = await supabase.from('profiles').upsert({ id: userId, email, full_name: name || null })
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

      setMessage('Signed in successfully.')
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup') await handleSignUp()
    else await handleSignIn()
  }

  const sqlSnippet = `-- Run this in Supabase SQL editor to create a simple profiles table\nCREATE TABLE profiles (\n  id uuid PRIMARY KEY,\n  email text UNIQUE,\n  full_name text,\n  created_at timestamptz DEFAULT now()\n);`

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'signup' ? 'Create account' : 'Sign in'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              placeholder="Full name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-2 rounded"
            />
          )}

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 rounded"
            required
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded"
            required
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
            <Button variant="outline" type="button" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
              {mode === 'signup' ? 'Have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>

          {message && <div className="text-sm text-green-700">{message}</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {showSql && (
            <div className="mt-3 bg-slate-50 p-3 rounded border">
              <div className="text-sm mb-2">Profiles table missing — run this SQL in Supabase SQL editor:</div>
              <pre className="text-xs overflow-auto whitespace-pre-wrap">{sqlSnippet}</pre>
            </div>
          )}

          {/* Dev-only: show raw Supabase response to help debug 400s */}
          {rawResponse && (
            <div className="mt-3 bg-black/5 p-3 rounded border">
              <div className="text-sm mb-2">Raw Supabase response (dev):</div>
              <pre className="text-xs overflow-auto max-h-48">{JSON.stringify(rawResponse, null, 2)}</pre>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
