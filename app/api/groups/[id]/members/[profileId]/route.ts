import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; profileId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const groupId = params.id
    const profileId = params.profileId
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin of the group or removing themselves
    const { data: membership, error: memberError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('profile_id', user.id)
      .single()

    if (memberError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Allow if user is admin or removing themselves
    if (membership.role !== 'admin' && user.id !== profileId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Remove member from group
    const { error: removeError } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('profile_id', profileId)

    if (removeError) {
      return NextResponse.json({ error: 'Failed to remove member' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}