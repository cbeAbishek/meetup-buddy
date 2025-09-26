import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, title, description, due_date, priority } = body
    
    const updateData: any = {}
    if (status) updateData.status = status
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (due_date) updateData.due_date = due_date
    if (priority) updateData.priority = priority
    
    // Set completion timestamp if marking as completed
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: followup, error } = await supabase
      .from('followups')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        meetings(title, start_time),
        assigned_to_profile:profiles!followups_assigned_to_fkey(full_name, email),
        created_by_profile:profiles!followups_created_by_fkey(full_name)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ followup })

  } catch (error) {
    console.error('Followup PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update follow-up' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('followups')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Followup DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete follow-up' },
      { status: 500 }
    )
  }
}