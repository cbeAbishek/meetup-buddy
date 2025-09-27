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

    const { participant_ids, start_date, end_date, duration = 60 } = body

    if (!participant_ids || participant_ids.length === 0) {
      return NextResponse.json({ error: 'participant_ids is required' }, { status: 400 })
    }

    // Include current user in participant list if not already included
    const allParticipants = [...new Set([user.id, ...participant_ids])]

    // Get all participants' calendar slots within the date range
    let query = supabase
      .from('calendar_slots')
      .select(`
        profile_id,
        start_time,
        end_time,
        status,
        profiles(id, full_name, email)
      `)
      .in('profile_id', allParticipants)

    if (start_date) {
      query = query.gte('start_time', start_date)
    } else {
      query = query.gte('start_time', new Date().toISOString())
    }

    if (end_date) {
      query = query.lte('end_time', end_date)
    }

    const { data: slots, error: slotsError } = await query.order('start_time')

    if (slotsError) {
      console.error('Error fetching slots:', slotsError)
      // Return mock availability if slots table doesn't exist
      return NextResponse.json({
        common_slots: generateMockAvailableSlots(duration),
        participants: allParticipants,
        message: 'Using mock availability data - calendar_slots table not configured'
      })
    }

    // Group slots by participant and status
    const participantSlots = allParticipants.reduce((acc: any, participantId: string) => {
      acc[participantId] = {
        free: [],
        busy: [],
        profile: null
      }
      return acc
    }, {})

    // Populate participant slots
    slots?.forEach(slot => {
      if (participantSlots[slot.profile_id]) {
        participantSlots[slot.profile_id][slot.status].push({
          start: new Date(slot.start_time),
          end: new Date(slot.end_time)
        })
        if (!participantSlots[slot.profile_id].profile) {
          participantSlots[slot.profile_id].profile = slot.profiles
        }
      }
    })

    // Find common available time slots
    const commonSlots = findCommonFreeSlots(participantSlots, allParticipants, duration)

    // Get participant details
    const { data: participantProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', allParticipants)

    return NextResponse.json({
      common_slots: commonSlots,
      participants: participantProfiles || [],
      slot_details: Object.entries(participantSlots).map(([id, data]: [string, any]) => ({
        participant_id: id,
        profile: data.profile,
        free_slots: data.free.length,
        busy_slots: data.busy.length
      }))
    })

  } catch (error) {
    console.error('Slot availability error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to find overlapping free time slots
function findCommonFreeSlots(participantSlots: any, participantIds: string[], duration: number) {
  const commonSlots = []
  
  // Get the earliest start time and latest end time from all free slots
  let allFreeSlots: Array<{start: Date, end: Date}> = []
  
  for (const participantId of participantIds) {
    const freeSlots = participantSlots[participantId]?.free || []
    allFreeSlots = allFreeSlots.concat(freeSlots)
  }

  if (allFreeSlots.length === 0) {
    return []
  }

  // Sort slots by start time
  allFreeSlots.sort((a, b) => a.start.getTime() - b.start.getTime())

  // Find overlapping time periods
  for (let i = 0; i < allFreeSlots.length; i++) {
    const currentSlot = allFreeSlots[i]
    let overlapStart = currentSlot.start
    let overlapEnd = currentSlot.end

    // Check if this slot overlaps with all participants
    let isValidForAll = true
    
    for (const participantId of participantIds) {
      const participantFreeSlots = participantSlots[participantId]?.free || []
      
      // Check if participant has any free slot that overlaps with current slot
      const hasOverlappingSlot = participantFreeSlots.some((slot: any) => {
        const maxStart = new Date(Math.max(overlapStart.getTime(), slot.start.getTime()))
        const minEnd = new Date(Math.min(overlapEnd.getTime(), slot.end.getTime()))
        
        // Update overlap window to intersection
        if (maxStart < minEnd) {
          overlapStart = maxStart
          overlapEnd = minEnd
          return true
        }
        return false
      })

      if (!hasOverlappingSlot) {
        isValidForAll = false
        break
      }
    }

    // If valid for all and meets duration requirement
    if (isValidForAll && (overlapEnd.getTime() - overlapStart.getTime()) >= (duration * 60 * 1000)) {
      commonSlots.push({
        start_time: overlapStart.toISOString(),
        end_time: overlapEnd.toISOString(),
        duration_minutes: Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / (60 * 1000))
      })
    }
  }

  // Remove duplicate overlapping slots and sort by start time
  return commonSlots
    .filter((slot, index, arr) => 
      arr.findIndex(s => s.start_time === slot.start_time) === index
    )
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 10) // Return top 10 available slots
}

// Generate mock available slots for testing
function generateMockAvailableSlots(duration: number) {
  const slots = []
  const today = new Date()
  
  // Generate slots for next 7 days
  for (let day = 1; day <= 7; day++) {
    const date = new Date(today)
    date.setDate(today.getDate() + day)
    
    // Morning slots (9-12)
    const morningStart = new Date(date.setHours(9, 0, 0, 0))
    const morningEnd = new Date(date.setHours(12, 0, 0, 0))
    
    slots.push({
      start_time: morningStart.toISOString(),
      end_time: morningEnd.toISOString(),
      duration_minutes: 180
    })
    
    // Afternoon slots (14-17)
    const afternoonStart = new Date(date.setHours(14, 0, 0, 0))
    const afternoonEnd = new Date(date.setHours(17, 0, 0, 0))
    
    slots.push({
      start_time: afternoonStart.toISOString(),
      end_time: afternoonEnd.toISOString(),
      duration_minutes: 180
    })
  }
  
  return slots
}