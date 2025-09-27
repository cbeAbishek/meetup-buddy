import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const meetingId = params.id
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is participant in the meeting
    const { data: participation, error: participationError } = await supabase
      .from('meeting_participants')
      .select('role, status')
      .eq('meeting_id', meetingId)
      .eq('profile_id', user.id)
      .single()

    if (participationError || !participation) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { data: meeting, error } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants(
          profile_id,
          role,
          status,
          profiles(id, name, avatar_url)
        ),
        follow_ups(
          id, title, description, status, due_date, priority,
          assignee_id,
          profiles!follow_ups_assignee_id_fkey(id, name)
        ),
        meeting_documents(id, filename, file_size, file_url, uploaded_at),
        agenda_items(id, title, description, duration_minutes, order_index, presenter_id),
        meeting_summaries(id, content, type, status, created_at)
      `)
      .eq('id', meetingId)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    return NextResponse.json({ meeting, userRole: participation.role })

  } catch (error) {
    console.error('Meeting GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    const meetingId = params.id
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is presenter or meeting creator
    const { data: participation, error: participationError } = await supabase
      .from('meeting_participants')
      .select('role')
      .eq('meeting_id', meetingId)
      .eq('profile_id', user.id)
      .single()

    if (participationError || !participation || participation.role !== 'presenter') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const {
      title,
      description,
      start_time,
      end_time,
      location,
      status
    } = body

    const updateData: any = { updated_at: new Date().toISOString() }
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (start_time) updateData.start_time = start_time
    if (end_time) updateData.end_time = end_time
    if (location !== undefined) updateData.location = location
    if (status) updateData.status = status

    const { data: meeting, error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', meetingId)
      .select(`
        *,
        meeting_participants(
          profile_id,
          role,
          status,
          profiles(id, name, avatar_url)
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update meeting' }, { status: 400 })
    }

    return NextResponse.json({ meeting })

  } catch (error) {
    console.error('Meeting PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const meetingId = params.id
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is presenter or meeting creator
    const { data: participation, error: participationError } = await supabase
      .from('meeting_participants')
      .select('role')
      .eq('meeting_id', meetingId)
      .eq('profile_id', user.id)
      .single()

    if (participationError || !participation || participation.role !== 'presenter') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update status to cancelled instead of hard delete to preserve history
    const { data: meeting, error } = await supabase
      .from('meetings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', meetingId)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to cancel meeting' }, { status: 400 })
    }

    return NextResponse.json({ meeting })

  } catch (error) {
    console.error('Meeting DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}