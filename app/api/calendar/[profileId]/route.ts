import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const profileId = params.profileId
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('availability_slots')
      .select(`
        *,
        profiles(
          id,
          name,
          avatar_url
        )
      `)
      .eq('profile_id', profileId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    // Filter by date range if specified
    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: slots, error: slotsError } = await query

    if (slotsError) {
      return NextResponse.json({ error: 'Failed to fetch slots for profile' }, { status: 400 })
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error fetching profile slots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}