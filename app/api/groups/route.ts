import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name: body.name,
        description: body.description,
        type: body.type || 'private',
        created_by: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (groupError) {
      return NextResponse.json({ error: 'Failed to create group' }, { status: 400 })
    }

    // Add creator as group member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        profile_id: user.id,
        role: 'admin',
        joined_at: new Date().toISOString()
      })

    if (memberError) {
      console.error('Error adding creator as member:', memberError)
    }

    return NextResponse.json({ group }, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get groups where user is a member
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner(
          role,
          joined_at
        ),
        group_members(count)
      `)
      .eq('group_members.profile_id', user.id)
      .order('created_at', { ascending: false })

    if (groupsError) {
      return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 400 })
    }

    return NextResponse.json({ groups })
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}