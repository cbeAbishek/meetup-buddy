import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const groupId = params.id
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is member of the group
    const { data: membership, error: memberError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('profile_id', user.id)
      .single()

    if (memberError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get group details with members
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select(`
        *,
        group_members(
          id,
          role,
          joined_at,
          profiles(
            id,
            name,
            avatar_url,
            role
          )
        )
      `)
      .eq('id', groupId)
      .single()

    if (groupError) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    return NextResponse.json({ group, userRole: membership.role })
  } catch (error) {
    console.error('Error fetching group:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}