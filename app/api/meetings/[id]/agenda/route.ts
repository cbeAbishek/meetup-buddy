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
      .select('role')
      .eq('meeting_id', meetingId)
      .eq('profile_id', user.id)
      .single()

    if (participationError || !participation) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get agenda items for the meeting
    const { data: agendaItems, error: agendaError } = await supabase
      .from('agenda_items')
      .select(`
        id,
        title,
        description,
        duration_minutes,
        order_index,
        status,
        presenter_id,
        created_at,
        updated_at,
        profiles(id, name)
      `)
      .eq('meeting_id', meetingId)
      .order('order_index', { ascending: true })

    if (agendaError) {
      return NextResponse.json({ error: 'Failed to fetch agenda items' }, { status: 400 })
    }

    return NextResponse.json({ agenda_items: agendaItems || [] })

  } catch (error) {
    console.error('Error fetching agenda:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
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

    // Check if user is presenter in the meeting
    const { data: participation, error: participationError } = await supabase
      .from('meeting_participants')
      .select('role')
      .eq('meeting_id', meetingId)
      .eq('profile_id', user.id)
      .single()

    if (participationError || !participation || participation.role !== 'presenter') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Get the highest order_index for this meeting
    const { data: maxOrder } = await supabase
      .from('agenda_items')
      .select('order_index')
      .eq('meeting_id', meetingId)
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex = maxOrder && maxOrder.length > 0 ? maxOrder[0].order_index + 1 : 1

    // Create agenda item
    const { data: agendaItem, error: createError } = await supabase
      .from('agenda_items')
      .insert({
        meeting_id: meetingId,
        title: body.title,
        description: body.description,
        duration_minutes: body.duration_minutes || 10,
        order_index: body.order_index || nextOrderIndex,
        presenter_id: body.presenter_id || user.id,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        profiles(id, name)
      `)
      .single()

    if (createError) {
      return NextResponse.json({ error: 'Failed to create agenda item' }, { status: 400 })
    }

    return NextResponse.json({ agenda_item: agendaItem }, { status: 201 })

  } catch (error) {
    console.error('Error creating agenda item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}