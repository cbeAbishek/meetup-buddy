import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Add availability slot
    const { data: slot, error: slotError } = await supabase
      .from('availability_slots')
      .insert({
        profile_id: user.id,
        start_time: body.start_time,
        end_time: body.end_time,
        date: body.date,
        status: body.status || 'available',
        timezone: body.timezone || 'UTC',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (slotError) {
      return NextResponse.json({ error: 'Failed to create availability slot' }, { status: 400 })
    }

    return NextResponse.json({ slot }, { status: 201 })
  } catch (error) {
    console.error('Error creating availability slot:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const profiles = searchParams.get('profiles')?.split(',') || []
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('availability_slots')
      .select(`
        *,
        profiles(
          id,
          name,
          avatar_url
        )
      `)
      .eq('status', 'available')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    // Filter by profiles if specified
    if (profiles.length > 0) {
      query = query.in('profile_id', profiles)
    }

    // Filter by date range if specified
    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: slots, error: slotsError } = await query

    if (slotsError) {
      return NextResponse.json({ error: 'Failed to fetch availability slots' }, { status: 400 })
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error fetching availability slots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}