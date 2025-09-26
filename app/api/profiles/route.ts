import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const email = searchParams.get("email");

    let query = supabaseAdmin.from("profiles").select("*");

    if (profileId) {
      query = query.eq("id", profileId);
    } else if (email) {
      query = query.eq("email", email);
    } else {
      return new Response(JSON.stringify({ error: "profileId or email is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: "Profile not found" }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      console.error('Error fetching profile:', error);
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
    console.error('Error in profiles GET API:', error);
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
    const { email, full_name, avatar_url, timezone, preferences } = body;

    if (!email || !full_name) {
      return new Response(JSON.stringify({ 
        error: "email and full_name are required (avatar_url is optional)" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build insert object - avatar_url is optional
    const insertData: any = {
      email, 
      full_name,
      timezone: timezone || 'UTC',
      preferences: preferences || {},
      created_at: new Date().toISOString()
    };

    // Only add avatar_url if it's provided and not empty
    if (avatar_url && avatar_url.trim()) {
      insertData.avatar_url = avatar_url;
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
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
    console.error('Error in profiles POST API:', error);
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
    const { id, full_name, avatar_url, timezone, preferences, notification_settings } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Profile id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    
    // Only update provided fields
    if (full_name !== undefined) updateData.full_name = full_name;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (preferences !== undefined) updateData.preferences = preferences;
    if (notification_settings !== undefined) updateData.notification_settings = notification_settings;
    
    // Handle avatar_url specially - allow setting to null/empty to remove
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url && avatar_url.trim() ? avatar_url : null;
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
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
    console.error('Error in profiles PUT API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}