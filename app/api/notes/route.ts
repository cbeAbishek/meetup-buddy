import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");

    if (!meetingId) {
      return new Response(JSON.stringify({ error: "meetingId is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from("meeting_notes")
      .select("*")
      .eq("meeting_id", meetingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching meeting notes:', error);
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
    console.error('Error in notes GET API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { meeting_id, author_id, content, note_type = 'general', timestamp } = body;

    if (!meeting_id || !author_id || !content) {
      return new Response(JSON.stringify({ 
        error: "meeting_id, author_id, and content are required" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from("meeting_notes")
      .insert([{ 
        meeting_id, 
        author_id, 
        content,
        note_type,
        timestamp: timestamp || new Date().toISOString(),
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        author:profiles!author_id(full_name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating meeting note:', error);
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
    console.error('Error in notes POST API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, content, note_type } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Note id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (content !== undefined) updateData.content = content;
    if (note_type !== undefined) updateData.note_type = note_type;

    const { data, error } = await supabaseAdmin
      .from("meeting_notes")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        author:profiles!author_id(full_name, email)
      `)
      .single();

    if (error) {
      console.error('Error updating meeting note:', error);
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
    console.error('Error in notes PUT API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("id");

    if (!noteId) {
      return new Response(JSON.stringify({ error: "Note id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabaseAdmin
      .from("meeting_notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      console.error('Error deleting meeting note:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: "Note deleted successfully" }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in notes DELETE API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}