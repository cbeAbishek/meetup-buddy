import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface TimeSlot {
  start_time: string
  end_time: string
  date: string
  profiles: string[]
}

function findOverlappingSlots(slots: any[]): TimeSlot[] {
  const groupedByDateTime: { [key: string]: any[] } = {}
  
  // Group slots by date and time
  slots.forEach(slot => {
    const key = `${slot.date}_${slot.start_time}_${slot.end_time}`
    if (!groupedByDateTime[key]) {
      groupedByDateTime[key] = []
    }
    groupedByDateTime[key].push(slot)
  })
  
  // Find slots with multiple profiles (overlaps)
  const overlappingSlots: TimeSlot[] = []
  
  Object.entries(groupedByDateTime).forEach(([key, slotsGroup]) => {
    if (slotsGroup.length > 1) {
      const [date, startTime, endTime] = key.split('_')
      overlappingSlots.push({
        start_time: startTime,
        end_time: endTime,
        date: date,
        profiles: slotsGroup.map(slot => slot.profile_id)
      })
    }
  })
  
  return overlappingSlots
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const profilesParam = searchParams.get('profiles')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const minParticipants = parseInt(searchParams.get('min_participants') || '2')
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!profilesParam) {
      return NextResponse.json({ error: 'Profiles parameter is required' }, { status: 400 })
    }

    const profiles = profilesParam.split(',')
    
    if (profiles.length < minParticipants) {
      return NextResponse.json({ error: `At least ${minParticipants} profiles required` }, { status: 400 })
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
      .in('profile_id', profiles)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

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

    // Find overlapping slots
    const overlappingSlots = findOverlappingSlots(slots || [])
    
    // Filter by minimum participants
    const availableSlots = overlappingSlots.filter(slot => 
      slot.profiles.length >= minParticipants
    )

    // Get profile details for each slot
    const slotsWithProfiles = await Promise.all(
      availableSlots.map(async (slot) => {
        const { data: profileDetails, error } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', slot.profiles)

        return {
          ...slot,
          profile_details: profileDetails || []
        }
      })
    )

    return NextResponse.json({ 
      available_slots: slotsWithProfiles,
      total_slots: slotsWithProfiles.length,
      requested_profiles: profiles,
      min_participants: minParticipants
    })
  } catch (error) {
    console.error('Error finding available slots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}