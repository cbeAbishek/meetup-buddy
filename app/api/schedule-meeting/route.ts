import { NextRequest, NextResponse } from 'next/server'
import { inngest } from '@/inngest/clint'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, requesterId, ...options } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid prompt' },
        { status: 400 }
      )
    }

    // Send event to Inngest
    const eventId = await inngest.send({
      name: 'meeting/schedule',
      data: {
        prompt,
        requesterId,
        ...options
      }
    })

    return NextResponse.json({
      success: true,
      eventId: eventId.ids[0],
      message: 'Meeting scheduling request submitted'
    })
  } catch (error) {
    console.error('Failed to trigger meeting scheduler:', error)
    return NextResponse.json(
      { error: 'Failed to process meeting request' },
      { status: 500 }
    )
  }
}