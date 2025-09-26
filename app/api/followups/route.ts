import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");

    if (!meetingId) {
      return new Response(JSON.stringify({ error: "meetingId is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: followups, error } = await supabaseAdmin
      .from("followups")
      .select("*")
      .eq("meeting_id", meetingId);

    if (error) {
      console.error('Error fetching followups:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(followups), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in followups API:', error);
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
    const { meetingId, task, status = 'pending', assignedTo, dueDate } = body;

    if (!meetingId || !task) {
      return new Response(JSON.stringify({ error: "meetingId and task are required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: followup, error } = await supabaseAdmin
      .from("followups")
      .insert([{
        meeting_id: meetingId,
        task,
        status,
        assigned_to: assignedTo,
        due_date: dueDate,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating followup:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(followup), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in followups POST API:', error);
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
    const { id, status, task, assignedTo, dueDate } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updateData.status = status;
    if (task !== undefined) updateData.task = task;
    if (assignedTo !== undefined) updateData.assigned_to = assignedTo;
    if (dueDate !== undefined) updateData.due_date = dueDate;

    const { data: followup, error } = await supabaseAdmin
      .from("followups")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Error updating followup:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(followup), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in followups PUT API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


