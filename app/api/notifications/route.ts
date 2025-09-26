import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const type = searchParams.get("type"); // 'meeting', 'followup', 'reminder'
    const unreadOnly = searchParams.get("unreadOnly") === 'true';

    if (!profileId) {
      return new Response(JSON.stringify({ error: "profileId is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let query = supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    if (unreadOnly) {
      query = query.eq("read", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
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
    console.error('Error in notifications GET API:', error);
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
    const { profile_id, type, title, message, related_id, scheduled_for } = body;

    if (!profile_id || !type || !title || !message) {
      return new Response(JSON.stringify({ 
        error: "profile_id, type, title, and message are required" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from("notifications")
      .insert([{ 
        profile_id, 
        type, 
        title,
        message,
        related_id,
        scheduled_for: scheduled_for || new Date().toISOString(),
        read: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
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
    console.error('Error in notifications POST API:', error);
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
    const { id, read, ids } = body;

    if (!id && !ids) {
      return new Response(JSON.stringify({ error: "id or ids array is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let data: any;
    let error: any;

    if (ids) {
      // Mark multiple notifications as read
      const res = await supabaseAdmin
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .in("id", ids)
        .select();
      data = res.data;
      error = res.error;
    } else {
      // Mark single notification
      const updateData: any = { updated_at: new Date().toISOString() };
      if (read !== undefined) {
        updateData.read = read;
        updateData.read_at = read ? new Date().toISOString() : null;
      }
      const res = await supabaseAdmin
        .from("notifications")
        .update(updateData)
        .eq("id", id)
        .select();
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.error('Error updating notification(s):', error);
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
    console.error('Error in notifications PUT API:', error);
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
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return new Response(JSON.stringify({ error: "Notification id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: "Notification deleted successfully" }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in notifications DELETE API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


