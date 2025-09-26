import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const meetingId = searchParams.get("meetingId");

    let query = supabaseAdmin
      .from("meetings")
      .select("*")
      .order("meeting_date", { ascending: false });

    if (profileId) {
      query = query.eq("profile_id", profileId);
    }

    if (meetingId) {
      query = query.eq("id", meetingId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching meetings:', error);
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
    console.error('Error in meetings GET API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const { profile_id, meeting_date, topic, outcome, status = 'scheduled', duration, location } = body;

    if (!profile_id || !meeting_date || !topic) {
      return new Response(JSON.stringify({ 
        error: "profile_id, meeting_date, and topic are required" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from("meetings")
      .insert([{ 
        profile_id, 
        meeting_date, 
        topic, 
        outcome, 
        status,
        duration,
        location,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating meeting:', error);
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
    console.error('Error in meetings POST API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const { id, meeting_date, topic, outcome, status, duration, location } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Meeting id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (meeting_date !== undefined) updateData.meeting_date = meeting_date;
    if (topic !== undefined) updateData.topic = topic;
    if (outcome !== undefined) updateData.outcome = outcome;
    if (status !== undefined) updateData.status = status;
    if (duration !== undefined) updateData.duration = duration;
    if (location !== undefined) updateData.location = location;

    const { data, error } = await supabaseAdmin
      .from("meetings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Error updating meeting:', error);
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
    console.error('Error in meetings PUT API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("id");

    if (!meetingId) {
      return new Response(JSON.stringify({ error: "Meeting id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabaseAdmin
      .from("meetings")
      .delete()
      .eq("id", meetingId);

    if (error) {
      console.error('Error deleting meeting:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: "Meeting deleted successfully" }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in meetings DELETE API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


