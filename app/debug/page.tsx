'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ email: '', password: '', fullName: '' })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('Auth session:', session, error)
    setSession(session)
    setUser(session?.user)
  }

  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      console.log(`Testing ${method} ${endpoint}`)
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      }
      
      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()
      
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          ok: response.ok,
          data
        }
      }))
      
      console.log(`${endpoint} result:`, response.status, data)
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error)
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    }
  }

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })
      
      if (error) {
        alert(`Login error: ${error.message}`)
      } else {
        alert('Login successful!')
        await checkAuth()
      }
    } catch (error) {
      alert(`Login failed: ${error}`)
    }
  }

  const handleSignup = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: {
            full_name: signupForm.fullName,
          },
        },
      })
      
      if (error) {
        alert(`Signup error: ${error.message}`)
      } else {
        alert('Signup successful! Check your email for verification.')
      }
    } catch (error) {
      alert(`Signup failed: ${error}`)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await checkAuth()
  }

  const testMeetingCreation = async () => {
    const testMeeting = {
      title: 'Test Meeting',
      description: 'Test meeting description',
      start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      end_time: new Date(Date.now() + 86400000 + 3600000).toISOString(), // Tomorrow + 1 hour
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      location: 'Test location',
      meeting_type: 'virtual',
      participants: []
    }
    
    await testEndpoint('/api/meetings', 'POST', testMeeting)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Page</h1>
      
      {/* Auth Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>User:</Label>
              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div>
              <Label>Session:</Label>
              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={checkAuth} variant="outline">
              Refresh Auth Status
            </Button>
            {user && (
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Login/Signup Forms */}
      {!user && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <Button onClick={handleLogin}>Login</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="signupFullName">Full Name</Label>
                <Input
                  id="signupFullName"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <Button onClick={handleSignup}>Sign Up</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Tests */}
      <Card>
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
          <CardDescription>Test various endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => testEndpoint('/api/meetings')} variant="outline">
              Test GET /api/meetings
            </Button>
            <Button onClick={() => testEndpoint('/api/meetings/availability', 'POST', {
              participant_ids: ['test-id'],
              duration: 60
            })} variant="outline">
              Test Availability API
            </Button>
            {user && (
              <Button onClick={testMeetingCreation} variant="outline">
                Test Create Meeting
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {Object.entries(testResults).map(([endpoint, result]) => (
              <div key={endpoint} className="border rounded p-3">
                <div className="font-medium">{endpoint}</div>
                <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Database Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={async () => {
                try {
                  const { data, error } = await supabase.from('profiles').select('*').limit(5)
                  console.log('Profiles test:', data, error)
                  setTestResults(prev => ({
                    ...prev,
                    'profiles': { data, error }
                  }))
                } catch (error) {
                  console.error('Profiles test error:', error)
                }
              }}
              variant="outline"
            >
              Test Profiles Table
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  const { data, error } = await supabase.from('meetings').select('*').limit(5)
                  console.log('Meetings test:', data, error)
                  setTestResults(prev => ({
                    ...prev,
                    'meetings': { data, error }
                  }))
                } catch (error) {
                  console.error('Meetings test error:', error)
                }
              }}
              variant="outline"
            >
              Test Meetings Table
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}