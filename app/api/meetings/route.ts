import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Helper function to find common available slots
async function findCommonSlots(supabase: any, participantIds: string[], duration: number = 60) {
  try {
    // Get all participants' calendar slots
    const { data: slots, error } = await supabase
      .from('calendar_slots')
      .select('profile_id, start_time, end_time, status')
      .in('profile_id', participantIds)
      .eq('status', 'free')
      .gte('start_time', new Date().toISOString()) // Only future slots
      .order('start_time')

    if (error) {
      console.error('Error fetching slots:', error)
      return []
    }

    if (!slots || slots.length === 0) {
      return []
    }

    // Group slots by participant
    const slotsByParticipant = slots.reduce((acc: any, slot: any) => {
      if (!acc[slot.profile_id]) {
        acc[slot.profile_id] = []
      }
      acc[slot.profile_id].push({
        start: new Date(slot.start_time),
        end: new Date(slot.end_time)
      })
      return acc
    }, {})

    // Find overlapping time slots
    const commonSlots = []
    const allSlots = Object.values(slotsByParticipant).flat() as Array<{start: Date, end: Date}>
    
    for (let i = 0; i < allSlots.length; i++) {
      const currentSlot = allSlots[i]
      let isCommon = true
      
      // Check if this slot overlaps with all participants
      for (const participantId of participantIds) {
        const participantSlots = slotsByParticipant[participantId] || []
        const hasOverlap = participantSlots.some((slot: any) => 
          slot.start <= currentSlot.start && slot.end >= currentSlot.end
        )
        
        if (!hasOverlap) {
          isCommon = false
          break
        }
      }
      
      if (isCommon) {
        commonSlots.push(currentSlot)
      }
    }

    return commonSlots
  } catch (error) {
    console.error('Error in findCommonSlots:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('group_id')
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants!inner(
          profile_id,
          role,
          status,
          profiles(id, name, avatar_url)
        ),
        groups(id, name),
        profiles!meetings_created_by_fkey(id, name)
      `)
      .eq('meeting_participants.profile_id', user.id)
      .order('start_time', { ascending: false })

    // Filter by group if specified
    if (groupId) {
      query = query.eq('group_id', groupId)
    }

    const { data: meetings, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 400 })
    }

    return NextResponse.json({ meetings })

  } catch (error) {
    console.error('Meetings GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user's profile to check their role
    const { data: currentUserProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, full_name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // Fallback to basic user info
    }

    // Determine who the meeting is being created for
    const createdBy = body.created_by || user.id
    const isCreatingForSomeoneElse = createdBy !== user.id

    // Authorization checks for creating meetings for others
    if (isCreatingForSomeoneElse) {
      // Check if current user has permission to create meetings for others
      const canCreateForOthers = 
        currentUserProfile?.role === 'admin' || 
        currentUserProfile?.role === 'presenter' ||
        currentUserProfile?.role === 'manager'

      if (!canCreateForOthers) {
        return NextResponse.json({ 
          error: 'Insufficient permissions to create meetings for others. Only admins, presenters, or managers can do this.' 
        }, { status: 403 })
      }

      // Verify that the target user exists
      const { data: targetUser, error: targetError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', createdBy)
        .single()

      if (targetError || !targetUser) {
        return NextResponse.json({ 
          error: 'Target user not found' 
        }, { status: 404 })
      }

      console.log(`User ${currentUserProfile?.full_name} creating meeting for ${targetUser.full_name}`)
    }

    // If group_id is provided, check membership permissions
    if (body.group_id) {
      const membersToCheck = isCreatingForSomeoneElse ? [user.id, createdBy] : [user.id]
      
      for (const memberId of membersToCheck) {
        const { data: membership, error: memberError } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', body.group_id)
          .eq('profile_id', memberId)
          .single()

        if (memberError || !membership) {
          return NextResponse.json({ error: 'All users must be members of the specified group' }, { status: 403 })
        }

        // If creating for someone else, current user needs elevated permissions in group
        if (isCreatingForSomeoneElse && memberId === user.id) {
          if (!['presenter', 'admin', 'manager'].includes(membership.role)) {
            return NextResponse.json({ 
              error: 'Insufficient group permissions to create meetings for others' 
            }, { status: 403 })
          }
        }
      }
    }

    // Validate required fields
    if (!body.title || !body.start_time || !body.end_time) {
      return NextResponse.json(
        { error: 'Title, start_time, and end_time are required' },
        { status: 400 }
      )
    }

    // Prepare participant IDs for slot validation
    const allParticipantIds = [createdBy] // Include meeting owner
    
    if (body.participants && body.participants.length > 0) {
      body.participants.forEach((p: any) => {
        if (p.profile_id && !allParticipantIds.includes(p.profile_id)) {
          allParticipantIds.push(p.profile_id)
        }
      })
    }

    // Add current user if creating for someone else
    if (isCreatingForSomeoneElse && !allParticipantIds.includes(user.id)) {
      allParticipantIds.push(user.id)
    }

    // Check slot availability for all participants
    const meetingStart = new Date(body.start_time)
    const meetingEnd = new Date(body.end_time)
    
    // Query availability for all participants during the proposed time
    const { data: conflictingSlots, error: slotError } = await supabase
      .from('calendar_slots')
      .select('profile_id, start_time, end_time, status')
      .in('profile_id', allParticipantIds)
      .or(`and(start_time.lte.${body.start_time},end_time.gt.${body.start_time}),and(start_time.lt.${body.end_time},end_time.gte.${body.end_time}),and(start_time.gte.${body.start_time},end_time.lte.${body.end_time})`)

    if (slotError) {
      console.error('Slot availability check error:', slotError)
      // Continue without strict slot checking if calendar_slots table doesn't exist
    } else if (conflictingSlots && conflictingSlots.length > 0) {
      // Check for actual conflicts (busy slots during meeting time)
      const busySlots = conflictingSlots.filter(slot => slot.status === 'busy')
      
      if (busySlots.length > 0) {
        const conflictingUsers = await supabase
          .from('profiles')
          .select('full_name, email')
          .in('id', busySlots.map(s => s.profile_id))
        
        return NextResponse.json({
          error: 'Meeting time conflicts with participants\' schedules',
          conflicts: conflictingUsers.data || busySlots.map(s => ({ profile_id: s.profile_id }))
        }, { status: 409 })
      }
    }

    // Create meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        title: body.title,
        description: body.description,
        start_time: body.start_time,
        end_time: body.end_time,
        date: body.date,
        location: body.location,
        meeting_type: body.meeting_type || 'virtual',
        group_id: body.group_id,
        created_by: createdBy,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        // Track who actually performed the creation
        metadata: isCreatingForSomeoneElse ? 
          JSON.stringify({ created_by_delegate: user.id, delegate_name: currentUserProfile?.full_name }) : 
          null
      })
      .select()
      .single()

    if (meetingError) {
      console.error('Meeting creation error:', meetingError)
      return NextResponse.json({ error: 'Failed to create meeting', details: meetingError.message }, { status: 400 })
    }

    console.log(`Meeting created: ${meeting.title} (ID: ${meeting.id})`)

    // Add the meeting owner as participant with presenter role
    const { error: ownerParticipantError } = await supabase
      .from('meeting_participants')
      .insert({
        meeting_id: meeting.id,
        profile_id: createdBy,
        role: 'presenter',
        status: isCreatingForSomeoneElse ? 'invited' : 'accepted',
        joined_at: isCreatingForSomeoneElse ? null : new Date().toISOString()
      })

    if (ownerParticipantError) {
      console.error('Error adding owner as participant:', ownerParticipantError)
    }

    // If created by someone else, add the delegate as a participant too
    if (isCreatingForSomeoneElse) {
      const { error: delegateParticipantError } = await supabase
        .from('meeting_participants')
        .insert({
          meeting_id: meeting.id,
          profile_id: user.id,
          role: 'presenter',
          status: 'accepted',
          joined_at: new Date().toISOString()
        })

      if (delegateParticipantError) {
        console.error('Error adding delegate as participant:', delegateParticipantError)
      }
    }

    // Add additional participants if provided
    if (body.participants && body.participants.length > 0) {
      const participantInserts = body.participants
        .filter((p: any) => p.profile_id !== createdBy && p.profile_id !== user.id) // Avoid duplicates
        .map((p: any) => ({
          meeting_id: meeting.id,
          profile_id: p.profile_id,
          role: p.role || 'listener',
          status: 'invited'
        }))

      if (participantInserts.length > 0) {
        const { error: participantsError } = await supabase
          .from('meeting_participants')
          .insert(participantInserts)

        if (participantsError) {
          console.error('Failed to add participants:', participantsError)
        }
      }
    }

    // Update calendar slots to mark time as busy for all participants
    if (!slotError) {
      const slotUpdates = allParticipantIds.map(participantId => ({
        profile_id: participantId,
        start_time: body.start_time,
        end_time: body.end_time,
        status: 'busy',
        meeting_id: meeting.id,
        created_at: new Date().toISOString()
      }))

      const { error: slotUpdateError } = await supabase
        .from('calendar_slots')
        .insert(slotUpdates)

      if (slotUpdateError) {
        console.error('Error updating calendar slots:', slotUpdateError)
        // Don't fail meeting creation if slot update fails
      }
    }

    // Fetch the complete meeting with relationships
    const { data: completeMeeting, error: fetchError } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants(
          profile_id,
          role,
          status,
          profiles(id, full_name, avatar_url)
        ),
        groups(id, name),
        profiles!meetings_created_by_fkey(id, full_name)
      `)
      .eq('id', meeting.id)
      .single()

    if (fetchError) {
      console.error('Error fetching complete meeting:', fetchError)
      return NextResponse.json({ meeting }, { status: 201 })
    }

    return NextResponse.json({ 
      meeting: completeMeeting,
      message: isCreatingForSomeoneElse ? 
        `Meeting created successfully for ${completeMeeting.profiles?.full_name} by ${currentUserProfile?.full_name}` :
        'Meeting created successfully',
      created_by_delegate: isCreatingForSomeoneElse ? user.id : null
    }, { status: 201 })

  } catch (error) {
    console.error('Meetings POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}