'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function SimpleMeetingTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: 'Test Meeting',
    description: 'This is a test meeting',
    date: '',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Virtual'
  })

  // Set tomorrow as default date
  useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setFormData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0]
    }))
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      console.log('🚀 Submitting meeting...')
      
      const meetingData = {
        title: formData.title,
        description: formData.description,
        start_time: `${formData.date}T${formData.startTime}:00`,
        end_time: `${formData.date}T${formData.endTime}:00`,
        date: formData.date,
        location: formData.location,
        meeting_type: 'virtual'
      }

      console.log('📤 Sending data:', meetingData)

      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData)
      })

      const data = await response.json()
      
      console.log('📥 Response:', { status: response.status, data })

      setResult({
        success: response.ok,
        status: response.status,
        data
      })

      if (response.ok) {
        // Reset form on success
        setFormData(prev => ({
          ...prev,
          title: 'Test Meeting ' + Date.now(),
          description: 'This is a test meeting'
        }))
      }

    } catch (error) {
      console.error('💥 Request failed:', error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Simple Meeting Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the meeting creation functionality with detailed error reporting
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Test Meeting</CardTitle>
          <CardDescription>
            Fill out the form below to test meeting creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Meeting...' : 'Create Test Meeting'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              {result.success ? 'Success!' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Meeting Created Successfully! 🎉</AlertTitle>
                <AlertDescription>
                  Your test meeting was created. Check the console for detailed logs.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Meeting Creation Failed</AlertTitle>
                <AlertDescription>
                  {result.data?.error || result.error || 'Unknown error occurred'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-4">
              <Label>Full Response:</Label>
              <pre className="text-xs bg-muted p-3 rounded mt-2 overflow-auto max-h-64">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            {result.data?.suggestion && (
              <Alert className="mt-4">
                <AlertTitle>Suggestion:</AlertTitle>
                <AlertDescription>{result.data.suggestion}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>1. Check Authentication:</strong> Visit <code>/debug</code> to verify you're logged in</p>
            <p><strong>2. Database Setup:</strong> Run the SQL script in <code>scripts/setup-database.sql</code> in your Supabase dashboard</p>
            <p><strong>3. Environment Variables:</strong> Ensure your <code>.env.local</code> file has valid Supabase credentials</p>
            <p><strong>4. Console Logs:</strong> Open browser dev tools to see detailed error logs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}