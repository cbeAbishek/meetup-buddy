'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function ChatbotTestPage() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testChatbot = async () => {
    if (!message.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: {
            userName: 'TestUser',
            isAuthenticated: false,
            currentPage: '/test'
          }
        })
      })

      const data = await res.json()
      
      if (data.success) {
        setResponse(data.response)
      } else {
        setError(data.error || 'Unknown error')
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤖 MeetUp Buddy Chatbot Test
              <Badge variant="secondary">MVP Version</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Message:</label>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message to test the chatbot..."
                  onKeyPress={(e) => e.key === 'Enter' && testChatbot()}
                />
                <Button 
                  onClick={testChatbot}
                  disabled={loading || !message.trim()}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {loading ? 'Testing...' : 'Send'}
                </Button>
              </div>
            </div>

            {/* Quick test buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMessage('Hello! How can you help me?')}
              >
                Hello
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMessage('I need help scheduling a meeting')}
              >
                Schedule Meeting
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMessage('How do I create a webinar?')}
              >
                Webinar Help
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMessage('What can you do?')}
              >
                Capabilities
              </Button>
            </div>

            {/* Response area */}
            {response && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Chatbot Response:</label>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-red-600">Error:</label>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Status info */}
            <div className="bg-gray-100 p-4 rounded-lg text-sm">
              <h3 className="font-medium mb-2">Test Status:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Using Google Gemini AI (gemini-1.5-flash model)</li>
                <li>• No database storage (MVP version)</li>
                <li>• Teal theme applied</li>
                <li>• Professional meeting assistant persona</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}