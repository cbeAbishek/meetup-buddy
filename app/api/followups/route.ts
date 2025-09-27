import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const meetingId = searchParams.get('meeting_id')
    const groupId = searchParams.get('group_id')
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('follow_ups')
      .select(`
        *,
        meetings(id, title, start_time),
        assignee:profiles!follow_ups_assignee_id_fkey(id, name, avatar_url),
        creator:profiles!follow_ups_created_by_fkey(id, name)
      `)
      .or(`assignee_id.eq.${user.id},created_by.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (meetingId) {
      query = query.eq('meeting_id', meetingId)
    }

    if (groupId) {
      // For group-level follow-ups, check if user is member
      const { data: membership } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('profile_id', user.id)
        .single()

      if (!membership) {
        return NextResponse.json({ error: 'Access denied to group' }, { status: 403 })
      }

      // Get follow-ups from meetings in this group
      query = query.eq('meetings.group_id', groupId)
    }

    const { data: followups, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 400 })
    }

    return NextResponse.json({ followups })

  } catch (error) {
    console.error('Followups GET error:', error)
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

    const {
      meeting_id,
      title,
      description,
      assignee_id,
      due_date,
      priority = 'medium'
    } = body

    // Validate required fields
    if (!title || !assignee_id || !meeting_id) {
      return NextResponse.json(
        { error: 'Title, assignee_id, and meeting_id are required' },
        { status: 400 }
      )
    }

    // Check if user is participant in the meeting
    const { data: participation, error: participationError } = await supabase
      .from('meeting_participants')
      .select('role')
      .eq('meeting_id', meeting_id)
      .eq('profile_id', user.id)
      .single()

    if (participationError || !participation) {
      return NextResponse.json({ error: 'Access denied to meeting' }, { status: 403 })
    }

    const { data: followup, error } = await supabase
      .from('follow_ups')
      .insert({
        meeting_id,
        title,
        description,
        assignee_id,
        created_by: user.id,
        due_date,
        priority,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        meetings(id, title, start_time),
        assignee:profiles!follow_ups_assignee_id_fkey(id, name, avatar_url),
        creator:profiles!follow_ups_created_by_fkey(id, name)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create follow-up' }, { status: 400 })
    }

    return NextResponse.json({ followup }, { status: 201 })

  } catch (error) {
    console.error('Followups POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}