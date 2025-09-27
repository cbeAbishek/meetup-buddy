import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

    // If group_id is provided, check if user is member
    if (body.group_id) {
      const { data: membership, error: memberError } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', body.group_id)
        .eq('profile_id', user.id)
        .single()

      if (memberError || !membership) {
        return NextResponse.json({ error: 'Access denied to group' }, { status: 403 })
      }
    }

    // Validate required fields
    if (!body.title || !body.start_time || !body.end_time) {
      return NextResponse.json(
        { error: 'Title, start_time, and end_time are required' },
        { status: 400 }
      )
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
        created_by: user.id,
        status: 'scheduled',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (meetingError) {
      return NextResponse.json({ error: 'Failed to create meeting' }, { status: 400 })
    }

    // Add creator as participant
    const { error: participantError } = await supabase
      .from('meeting_participants')
      .insert({
        meeting_id: meeting.id,
        profile_id: user.id,
        role: 'presenter',
        status: 'accepted',
        joined_at: new Date().toISOString()
      })

    if (participantError) {
      console.error('Error adding creator as participant:', participantError)
    }

    // Add additional participants if provided
    if (body.participants && body.participants.length > 0) {
      const participantInserts = body.participants.map((p: any) => ({
        meeting_id: meeting.id,
        profile_id: p.profile_id,
        role: p.role || 'listener',
        status: 'invited'
      }))

      const { error: participantsError } = await supabase
        .from('meeting_participants')
        .insert(participantInserts)

      if (participantsError) {
        console.error('Failed to add participants:', participantsError)
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
          profiles(id, name, avatar_url)
        ),
        groups(id, name)
      `)
      .eq('id', meeting.id)
      .single()

    if (fetchError) {
      console.error('Error fetching complete meeting:', fetchError)
      return NextResponse.json({ meeting }, { status: 201 })
    }

    return NextResponse.json({ meeting: completeMeeting }, { status: 201 })

  } catch (error) {
    console.error('Meetings POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}