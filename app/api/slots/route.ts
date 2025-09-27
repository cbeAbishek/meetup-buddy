<<<<<<< HEAD
import { getSupabaseAdmin } from "@/lib/supabase";

interface CalendarSlot {
  id?: string;
  profile_id: string;
  start_time: string;
  end_time: string;
  is_available?: boolean;
  recurring_pattern?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

interface OverlappingSlot {
  start_time: string;
  end_time: string;
  participants: string[];
}

interface SupabaseError {
  message?: string;
}

export async function GET(req: Request): Promise<Response> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const profileIds = searchParams.get("profileIds"); // comma-separated for multi-user availability
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const findOverlaps = searchParams.get("findOverlaps") === 'true';

    if (!profileId && !profileIds) {
      return new Response(JSON.stringify({ error: "profileId or profileIds is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let query = supabaseAdmin
      .from("calendar_slots")
      .select("*")
      .order("start_time", { ascending: true });

    if (profileIds && findOverlaps) {
      // Find overlapping slots for multiple users
      const ids = profileIds.split(',');
      query = query.in("profile_id", ids);
    } else if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    if (startDate) {
      query = query.gte("start_time", startDate);
    }

    if (endDate) {
      query = query.lte("end_time", endDate);
    }

    const { data: slots, error } = await query as { data: CalendarSlot[] | null; error?: SupabaseError | null };

    if (error) {
      console.error('Error fetching slots:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If finding overlaps for multiple profiles
    if (findOverlaps && profileIds) {
      const ids = profileIds.split(',');
      const overlappingSlots = findOverlappingTimeSlots(slots || [], ids);
      return new Response(JSON.stringify({ 
        overlappingSlots,
        totalParticipants: ids.length 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(slots), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in slots API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const { profile_id, start_time, end_time, is_available = true, recurring_pattern } = body;

    if (!profile_id || !start_time || !end_time) {
      return new Response(JSON.stringify({ 
        error: "profile_id, start_time, and end_time are required" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from("calendar_slots")
      .insert([{ 
        profile_id, 
        start_time, 
        end_time, 
        is_available,
        recurring_pattern,
        created_at: new Date().toISOString()
      }])
      .select()
      .single() as { data: CalendarSlot | null; error?: SupabaseError | null };

    if (error) {
      console.error('Error creating slot:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in slots POST API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(req: Request): Promise<Response> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const { id, start_time, end_time, is_available } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Slot id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (start_time !== undefined) updateData.start_time = start_time;
    if (end_time !== undefined) updateData.end_time = end_time;
    if (is_available !== undefined) updateData.is_available = is_available;

    const { data, error } = await supabaseAdmin
      .from("calendar_slots")
      .update(updateData)
      .eq("id", id)
      .select()
      .single() as { data: CalendarSlot | null; error?: SupabaseError | null };

    if (error) {
      console.error('Error updating slot:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in slots PUT API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const slotId = searchParams.get("id");

    if (!slotId) {
      return new Response(JSON.stringify({ error: "Slot id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabaseAdmin
      .from("calendar_slots")
      .delete()
      .eq("id", slotId) as { error?: SupabaseError | null };

    if (error) {
      console.error('Error deleting slot:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: "Slot deleted successfully" }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in slots DELETE API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to find overlapping time slots for multiple users
function findOverlappingTimeSlots(slots: CalendarSlot[], profileIds: string[]): OverlappingSlot[] {
  const overlaps: OverlappingSlot[] = [];
  
  // Group slots by profile
  const slotsByProfile = slots.reduce<Record<string, CalendarSlot[]>>((acc, slot) => {
    if (!acc[slot.profile_id]) acc[slot.profile_id] = [];
    if (slot.is_available) acc[slot.profile_id].push(slot);
    return acc;
  }, {});

  // Find common time slots
  const profileSlots: CalendarSlot[][] = profileIds.map(id => slotsByProfile[id] || []);
  
  if (profileSlots.some(slots => slots.length === 0)) {
    return []; // If any profile has no available slots, return empty
  }

  // Find overlapping periods (simplified algorithm)
  const baseSlots = profileSlots[0] || [];
  
  for (const baseSlot of baseSlots) {
    let hasOverlapWithAll = true;
    const overlappingSlot: OverlappingSlot = {
      start_time: baseSlot.start_time,
      end_time: baseSlot.end_time,
      participants: [baseSlot.profile_id]
    };

    for (let i = 1; i < profileSlots.length; i++) {
      const userSlots = profileSlots[i];
      const hasOverlap = userSlots.some(slot => 
        slot.start_time < baseSlot.end_time && 
        slot.end_time > baseSlot.start_time
      );
      
      if (hasOverlap) {
        overlappingSlot.participants.push(profileIds[i]);
      } else {
        hasOverlapWithAll = false;
        break;
      }
    }

    if (hasOverlapWithAll && overlappingSlot.participants.length === profileIds.length) {
      overlaps.push(overlappingSlot);
    }
  }

  return overlaps;
}

=======
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profile_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
    }

    let query = supabase
      .from('calendar_slots')
      .select('*')
      .eq('profile_id', profileId)
      .order('start_time', { ascending: true })

    if (startDate) {
      query = query.gte('start_time', startDate)
    }

    if (endDate) {
      query = query.lte('end_time', endDate)
    }

    const { data: slots, error } = await query

    if (error) throw error

    return NextResponse.json({ slots })

  } catch (error) {
    console.error('Slots GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar slots' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      profile_id,
      start_time,
      end_time,
      status = 'available'
    } = body

    // Validate required fields
    if (!profile_id || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Profile ID, start_time, and end_time are required' },
        { status: 400 }
      )
    }

    // Validate time range
    if (new Date(start_time) >= new Date(end_time)) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      )
    }

    const { data: slot, error } = await supabase
      .from('calendar_slots')
      .insert({
        profile_id,
        start_time,
        end_time,
        status
      })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ slot }, { status: 201 })

  } catch (error) {
    console.error('Slots POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create calendar slot' },
      { status: 500 }
    )
  }
}
>>>>>>> 656d9cc8ab68697f4709b77cb74f877680f4fdc0
