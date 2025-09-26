import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profile_id')
    
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
    }

    const { data: meetings, error } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants!inner(
          profile_id,
          role,
          attendance_status,
          profiles(full_name, email)
        ),
        followups(id, title, status, due_date),
        documents(id, filename, uploaded_at),
        agenda_items(id, title, duration_minutes, order_index)
      `)
      .eq('profile_id', profileId)
      .order('start_time', { ascending: false })

    if (error) throw error

    return NextResponse.json({ meetings })

  } catch (error) {
    console.error('Meetings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      start_time,
      end_time,
      location,
      profile_id,
      participants = []
    } = body

    // Validate required fields
    if (!title || !start_time || !end_time || !profile_id) {
      return NextResponse.json(
        { error: 'Title, start_time, end_time, and profile_id are required' },
        { status: 400 }
      )
    }

    // Create the meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        title,
        description,
        start_time,
        end_time,
        location,
        profile_id,
        status: 'scheduled'
      })
      .select('*')
      .single()

    if (meetingError) throw meetingError

    // Add participants if provided
    if (participants.length > 0) {
      const participantInserts = participants.map((p: any) => ({
        meeting_id: meeting.id,
        profile_id: p.profile_id,
        role: p.role || 'required',
        attendance_status: 'invited'
      }))

      const { error: participantsError } = await supabase
        .from('meeting_participants')
        .insert(participantInserts)

      if (participantsError) {
        console.error('Failed to add participants:', participantsError)
        // Don't fail the whole request, just log the error
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
          attendance_status,
          profiles(full_name, email)
        )
      `)
      .eq('id', meeting.id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json({ meeting: completeMeeting }, { status: 201 })

  } catch (error) {
    console.error('Meetings POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    )
  }
}