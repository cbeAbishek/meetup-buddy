"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/auth-context'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AuthForm() {
  const { signIn, signUp, loading, user } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Don't show the form if user is already authenticated
  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md mx-auto border-teal-200 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </motion.div>
              <p className="text-teal-700 bg-teal-50 p-4 rounded-xl border border-teal-200">
                You are already signed in. Redirecting to dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  async function handleSignUp() {
    setError(null)
    setMessage(null)

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Please check your environment variables.')
      return
    }

    if (!name.trim()) {
      setError('Full name is required')
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      const { error: signUpError } = await signUp(email, password, { full_name: name })

      if (signUpError) {
        const msg = signUpError.message ?? String(signUpError)
        if (/already exists|duplicate|user exists|User already registered/i.test(msg)) {
          const { error: signInError } = await signIn(email, password)
          if (signInError) {
            setError('This email is already registered. Please sign in instead.')
            setTimeout(() => setMode('signin'), 2000)
            return
          }
          console.log('Existing user signed in successfully')
          return
        }
        setError(msg)
        return
      }

      console.log('Sign up successful, waiting for auth state change...')
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: user.id,
            email,
            full_name: name || null
          })

          if (profileError) {
            console.log('Profile creation error (non-critical):', profileError)
          }
        }
      } catch (profileError) {
        console.log('Profile creation error (non-critical):', profileError)
      }
    } catch (err: any) {
      setError(err?.message ?? 'An unexpected error occurred. Please try again.')
    }
  }

  async function handleSignIn() {
    setError(null)
    setMessage(null)

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Please check your environment variables.')
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    try {
      const { error } = await signIn(email, password)
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else {
          setError(error.message ?? 'Sign in failed. Please try again.')
        }
        return
      }

      console.log('Sign in successful, waiting for auth state change...')
    } catch (err: any) {
      setError(err?.message ?? 'An unexpected error occurred. Please try again.')
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="w-full"
    >
      <Card className="w-full max-w-s mx-auto border-teal-200 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-slate-600 text-lg">
            {mode === 'signup' 
              ? 'Join MeetupBuddy and transform your meetings' 
              : 'Sign in to access your dashboard'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <Label htmlFor="name" className="text-slate-700 font-semibold text-base">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 pr-4 border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-14 text-base transition-all duration-300"
                    required={mode === 'signup'}
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-700 font-semibold text-base">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 pr-4 border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-14 text-base transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-slate-700 font-semibold text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="password"
                  placeholder={mode === 'signup' ? 'Create a password (min. 6 characters)' : 'Enter your password'}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-14 text-base transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-sm text-slate-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-red-200 bg-red-50 p-4">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-700 text-base ml-2">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-teal-200 bg-teal-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <AlertDescription className="text-teal-700 text-base ml-2">
                    {message}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Mode Switch */}
          <div className="text-center pt-6 border-t border-slate-200">
            <p className="text-slate-600 mb-4 text-base">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup')
                setError(null)
                setMessage(null)
                setEmail('')
                setPassword('')
                setName('')
              }}
              disabled={loading}
              className="text-teal-600 hover:text-teal-700 font-semibold text-base transition-colors duration-200 disabled:opacity-50 px-4 py-2 rounded-lg hover:bg-teal-50"
            >
              {mode === 'signup' ? 'Sign In Instead' : 'Create New Account'}
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
