import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profile_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
    }

    let query = supabase
      .from('calendar_slots')
      .select('*')
      .eq('profile_id', profileId)
      .order('start_time', { ascending: true })

    if (startDate) {
      query = query.gte('start_time', startDate)
    }

    if (endDate) {
      query = query.lte('end_time', endDate)
    }

    const { data: slots, error } = await query

    if (error) throw error

    return NextResponse.json({ slots })

  } catch (error) {
    console.error('Slots GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar slots' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      profile_id,
      start_time,
      end_time,
      status = 'available'
    } = body

    // Validate required fields
    if (!profile_id || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Profile ID, start_time, and end_time are required' },
        { status: 400 }
      )
    }

    // Validate time range
    if (new Date(start_time) >= new Date(end_time)) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      )
    }

    const { data: slot, error } = await supabase
      .from('calendar_slots')
      .insert({
        profile_id,
        start_time,
        end_time,
        status
      })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ slot }, { status: 201 })

  } catch (error) {
    console.error('Slots POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create calendar slot' },
      { status: 500 }
    )
  }
}