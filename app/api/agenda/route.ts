import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const meetingId = searchParams.get('meeting_id')
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 })
    }

    // Check if user is participant in the meeting
    const { data: participation, error: participationError } = await supabase
      .from('meeting_participants')
      .select('role')
      .eq('meeting_id', meetingId)
      .eq('profile_id', user.id)
      .single()

    if (participationError || !participation) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get meeting details
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*, groups(id, name)')
      .eq('id', meetingId)
      .single()

    if (meetingError || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    // Auto-generate agenda based on:
    // 1. Previous meeting outcomes
    // 2. Open follow-ups
    // 3. Group context
    
    let agendaItems = []
    
    // Add standard opening items
    agendaItems.push({
      title: "Welcome & Introductions",
      description: "Brief introductions and meeting overview",
      duration_minutes: 5,
      order_index: 1,
      type: "standard"
    })

    // Get previous meeting outcomes if this is a group meeting
    if (meeting.group_id) {
      const { data: previousMeetings } = await supabase
        .from('meetings')
        .select(`
          id, title,
          meeting_summaries(content, type),
          follow_ups(title, status)
        `)
        .eq('group_id', meeting.group_id)
        .eq('status', 'completed')
        .order('start_time', { ascending: false })
        .limit(3)

      if (previousMeetings && previousMeetings.length > 0) {
        agendaItems.push({
          title: "Review Previous Meeting Outcomes",
          description: "Quick review of decisions and follow-ups from recent meetings",
          duration_minutes: 10,
          order_index: 2,
          type: "review"
        })
      }
    }

    // Get open follow-ups
    const { data: openFollowUps } = await supabase
      .from('follow_ups')
      .select('title, due_date, priority')
      .eq('meeting_id', meetingId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true })

    if (openFollowUps && openFollowUps.length > 0) {
      agendaItems.push({
        title: "Open Action Items Review",
        description: `Review ${openFollowUps.length} pending action items`,
        duration_minutes: 15,
        order_index: 3,
        type: "action_items"
      })
    }

    // Add main discussion items
    agendaItems.push({
      title: "Main Discussion",
      description: "Primary meeting topics and decisions",
      duration_minutes: 30,
      order_index: 4,
      type: "discussion"
    })

    // Add closing items
    agendaItems.push({
      title: "Next Steps & Action Items",
      description: "Define follow-up tasks and assignments",
      duration_minutes: 10,
      order_index: 5,
      type: "closing"
    })

    const generatedAgenda = {
      meeting_id: meetingId,
      generated_at: new Date().toISOString(),
      total_estimated_duration: agendaItems.reduce((sum, item) => sum + item.duration_minutes, 0),
      items: agendaItems,
      source_data: {
        previous_meetings_count: 0,
        open_followups_count: openFollowUps?.length || 0,
        meeting_type: meeting.meeting_type,
        group_context: meeting.groups?.name || null
      }
    }

    return NextResponse.json({ agenda: generatedAgenda })

  } catch (error) {
    console.error('Auto-generate agenda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
