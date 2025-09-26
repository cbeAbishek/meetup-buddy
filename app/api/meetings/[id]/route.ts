import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: meeting, error } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants(
          profile_id,
          role,
          attendance_status,
          profiles(full_name, email, avatar_url)
        ),
        followups(
          id, title, description, status, due_date, priority,
          assigned_to_profile:profiles!followups_assigned_to_fkey(full_name, email)
        ),
        documents(id, filename, file_size, mime_type, uploaded_at),
        agenda_items(id, title, description, duration_minutes, order_index, presenter_id),
        meeting_notes(id, content, note_type, timestamp, author_id),
        prep_notes(id, content, author_id, created_at)
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    return NextResponse.json({ meeting })

  } catch (error) {
    console.error('Meeting GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      start_time,
      end_time,
      location,
      status
    } = body

    const updateData: any = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (start_time) updateData.start_time = start_time
    if (end_time) updateData.end_time = end_time
    if (location !== undefined) updateData.location = location
    if (status) updateData.status = status

    const { data: meeting, error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        meeting_participants(
          profile_id,
          role,
          attendance_status,
          profiles(full_name, email)
        )
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ meeting })

  } catch (error) {
    console.error('Meeting PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Update status to cancelled instead of hard delete to preserve history
    const { data: meeting, error } = await supabase
      .from('meetings')
      .update({ status: 'cancelled' })
      .eq('id', params.id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ meeting })

  } catch (error) {
    console.error('Meeting DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel meeting' },
      { status: 500 }
    )
  }
}