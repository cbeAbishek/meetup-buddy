import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profile_id')
    const meetingId = searchParams.get('meeting_id')
    
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
    }

    let query = supabase
      .from('followups')
      .select(`
        *,
        meetings(title, start_time),
        assigned_to_profile:profiles!followups_assigned_to_fkey(full_name, email),
        created_by_profile:profiles!followups_created_by_fkey(full_name)
      `)
      .or(`assigned_to.eq.${profileId},created_by.eq.${profileId}`)
      .order('created_at', { ascending: false })

    if (meetingId) {
      query = query.eq('meeting_id', meetingId)
    }

    const { data: followups, error } = await query

    if (error) throw error

    return NextResponse.json({ followups })

  } catch (error) {
    console.error('Followups GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch follow-ups' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      meeting_id,
      title,
      description,
      assigned_to,
      created_by,
      due_date,
      priority = 'medium'
    } = body

    // Validate required fields
    if (!title || !assigned_to || !created_by) {
      return NextResponse.json(
        { error: 'Title, assigned_to, and created_by are required' },
        { status: 400 }
      )
    }

    const { data: followup, error } = await supabase
      .from('followups')
      .insert({
        meeting_id,
        title,
        description,
        assigned_to,
        created_by,
        due_date,
        priority,
        status: 'pending'
      })
      .select(`
        *,
        meetings(title, start_time),
        assigned_to_profile:profiles!followups_assigned_to_fkey(full_name, email),
        created_by_profile:profiles!followups_created_by_fkey(full_name)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ followup }, { status: 201 })

  } catch (error) {
    console.error('Followups POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create follow-up' },
      { status: 500 }
    )
  }
}