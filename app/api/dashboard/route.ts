import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profile_id')
    
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
    }

    // Get upcoming meetings
    const { data: meetings, error: meetingsError } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants!inner(profile_id, role, attendance_status),
        followups(id, title, status, due_date),
        documents(id, filename, uploaded_at)
      `)
      .eq('profile_id', profileId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(5)

    if (meetingsError) throw meetingsError

    // Get pending follow-ups
    const { data: followups, error: followupsError } = await supabase
      .from('followups')
      .select(`
        *,
        meetings(title, start_time),
        assigned_to_profile:profiles!followups_assigned_to_fkey(full_name)
      `)
      .eq('assigned_to', profileId)
      .neq('status', 'completed')
      .order('due_date', { ascending: true })
      .limit(10)

    if (followupsError) throw followupsError

    // Get unread notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', profileId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(20)

    if (notificationsError) throw notificationsError

    // Get recent documents
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select(`
        *,
        meetings(title)
      `)
      .eq('profile_id', profileId)
      .order('uploaded_at', { ascending: false })
      .limit(5)

    if (documentsError) throw documentsError

    // Calculate basic stats
    const stats = {
      totalMeetings: meetings?.length || 0,
      pendingFollowups: followups?.filter(f => f.status === 'pending').length || 0,
      overdueFollowups: followups?.filter(f => new Date(f.due_date) < new Date() && f.status !== 'completed').length || 0,
      unreadNotifications: notifications?.length || 0
    }

    return NextResponse.json({
      meetings,
      followups,
      notifications,
      documents,
      stats
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}