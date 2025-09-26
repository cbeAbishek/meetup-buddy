import { getSupabaseAdmin } from "@/lib/supabase";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "You must be logged in to create a profile." }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();
    const { full_name } = body;

    if (!full_name) {
      return new Response(JSON.stringify({ 
        error: "full_name is required" 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if a profile for this user already exists
    const supabaseAdmin = getSupabaseAdmin();
    const { data: existingProfile, error: existingError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // Ignore "no rows found"
      console.error('Error checking for existing profile:', existingError);
      return new Response(JSON.stringify({ error: existingError.message }), { status: 500 });
    }

    if (existingProfile) {
      return new Response(JSON.stringify({ error: "A profile for this user already exists." }), {
        status: 409, // Conflict
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build insert data using the auto-generated id and email from the session
    const insertData = {
      id: user.id,
      email: user.email, 
      full_name: full_name,
      created_at: new Date().toISOString()
    };

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
    // Removed role attribute
    const { id, full_name } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Profile id is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    
    // Only update provided fields that exist in the schema
    if (full_name !== undefined) updateData.full_name = full_name;
    
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