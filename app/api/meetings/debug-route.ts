import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  console.log('🚀 Meeting creation API called')
  
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    console.log('📝 Request body:', JSON.stringify(body, null, 2))
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('👤 User check:', user ? `✅ User: ${user.email}` : '❌ No user')
    
    if (userError || !user) {
      console.error('❌ Auth error:', userError)
      return NextResponse.json({ 
        error: 'Authentication required. Please log in first.',
        debug: { userError, user: !!user }
      }, { status: 401 })
    }

    // Validate required fields
    if (!body.title || !body.start_time || !body.end_time) {
      console.error('❌ Missing required fields')
      return NextResponse.json({
        error: 'Missing required fields: title, start_time, and end_time are required',
        received: { 
          title: !!body.title, 
          start_time: !!body.start_time, 
          end_time: !!body.end_time 
        }
      }, { status: 400 })
    }

    // Create user profile if it doesn't exist
    console.log('🔍 Checking user profile...')
    let { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileFetchError || !profile) {
      console.log('👤 Creating user profile...')
      const { data: newProfile, error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: 'presenter'
        })
        .select()
        .single()

      if (createProfileError) {
        console.error('❌ Profile creation error:', createProfileError)
        return NextResponse.json({
          error: 'Failed to create user profile',
          debug: createProfileError
        }, { status: 500 })
      }
      
      profile = newProfile
      console.log('✅ Profile created:', profile.full_name)
    }

    // Determine who the meeting is being created for
    const createdBy = body.created_by || user.id
    const isCreatingForSomeoneElse = createdBy !== user.id

    // Basic authorization check for creating meetings for others
    if (isCreatingForSomeoneElse && !['admin', 'presenter', 'manager'].includes(profile.role)) {
      console.error('❌ Insufficient permissions')
      return NextResponse.json({ 
        error: 'Insufficient permissions to create meetings for others. Only admins, presenters, or managers can do this.',
        userRole: profile.role
      }, { status: 403 })
    }

    console.log('📅 Creating meeting...')
    
    // Prepare meeting data
    const meetingData = {
      title: body.title,
      description: body.description || '',
      start_time: body.start_time,
      end_time: body.end_time,
      date: body.date,
      location: body.location || '',
      meeting_type: body.meeting_type || 'virtual',
      created_by: createdBy,
      status: 'scheduled',
      metadata: isCreatingForSomeoneElse ? 
        JSON.stringify({ 
          created_by_delegate: user.id, 
          delegate_name: profile.full_name 
        }) : null
    }

    console.log('💾 Meeting data:', JSON.stringify(meetingData, null, 2))

    // Create meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert(meetingData)
      .select()
      .single()

    if (meetingError) {
      console.error('❌ Meeting creation error:', meetingError)
      return NextResponse.json({ 
        error: 'Failed to create meeting',
        debug: meetingError,
        suggestion: 'Please check if the database tables exist. Run the setup-database.sql script in your Supabase dashboard.'
      }, { status: 500 })
    }

    console.log('✅ Meeting created:', meeting.id)

    // Add meeting owner as participant
    const { error: participantError } = await supabase
      .from('meeting_participants')
      .insert({
        meeting_id: meeting.id,
        profile_id: createdBy,
        role: 'presenter',
        status: isCreatingForSomeoneElse ? 'invited' : 'accepted',
        joined_at: isCreatingForSomeoneElse ? null : new Date().toISOString()
      })

    if (participantError) {
      console.warn('⚠️ Failed to add owner as participant:', participantError)
      // Don't fail the entire operation for this
    }

    // Add delegate as participant if creating for someone else
    if (isCreatingForSomeoneElse) {
      const { error: delegateError } = await supabase
        .from('meeting_participants')
        .insert({
          meeting_id: meeting.id,
          profile_id: user.id,
          role: 'presenter',
          status: 'accepted',
          joined_at: new Date().toISOString()
        })

      if (delegateError) {
        console.warn('⚠️ Failed to add delegate as participant:', delegateError)
      }
    }

    // Add additional participants
    if (body.participants && Array.isArray(body.participants) && body.participants.length > 0) {
      console.log('👥 Adding participants...')
      
      const participantInserts = body.participants
        .filter((p: any) => p.profile_id && p.profile_id !== createdBy && p.profile_id !== user.id)
        .map((p: any) => ({
          meeting_id: meeting.id,
          profile_id: p.profile_id,
          role: p.role || 'listener',
          status: 'invited'
        }))

      if (participantInserts.length > 0) {
        const { error: participantsError } = await supabase
          .from('meeting_participants')
          .insert(participantInserts)

        if (participantsError) {
          console.warn('⚠️ Failed to add some participants:', participantsError)
        } else {
          console.log(`✅ Added ${participantInserts.length} participants`)
        }
      }
    }

    console.log('🎉 Meeting creation completed successfully!')

    return NextResponse.json({ 
      meeting,
      message: isCreatingForSomeoneElse ? 
        `Meeting created successfully on behalf of another user` :
        'Meeting created successfully!',
      created_by_delegate: isCreatingForSomeoneElse ? user.id : null,
      debug: {
        created_by: createdBy,
        is_delegate: isCreatingForSomeoneElse,
        user_role: profile.role
      }
    }, { status: 201 })

  } catch (error) {
    console.error('💥 Unexpected error in meeting creation:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      suggestion: 'Please check the server logs and ensure your Supabase database is properly configured.'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  console.log('📋 Fetching meetings...')
  
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get meetings where user is creator or participant
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_participants!inner(
          profile_id,
          role,
          status
        )
      `)
      .eq('meeting_participants.profile_id', user.id)
      .order('start_time', { ascending: false })

    if (error) {
      console.error('❌ Error fetching meetings:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch meetings',
        debug: error
      }, { status: 500 })
    }

    return NextResponse.json({ meetings: meetings || [] })

  } catch (error) {
    console.error('💥 Unexpected error fetching meetings:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}