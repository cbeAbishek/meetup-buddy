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

    // Fetch notes + followups + docs
    const { data: notes } = await supabaseAdmin
      .from("prep_notes")
      .select("content")
      .eq("meeting_id", meetingId);
      
    const { data: followups } = await supabaseAdmin
      .from("followups")
      .select("task,status")
      .eq("meeting_id", meetingId);

    // Simple rule-based agenda
    const agenda = [
      { item: "Review Previous Notes", details: notes?.map(n => n.content) || [] },
      { item: "Follow-up Items", details: followups?.map(f => `${f.task} (${f.status})`) || [] },
      { item: "New Topics", details: ["TBD by participants"] }
    ];

    return new Response(JSON.stringify({ agenda }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating agenda:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  // This endpoint returns a mocked agenda generated from meeting history
  const agenda = [
    { item: "Review last meeting decisions", estMin: 5 },
    { item: "Discuss Q3 pipeline and assign owners", estMin: 15 },
    { item: "Define next steps for feature X", estMin: 10 },
  ];

  return new Response(JSON.stringify({ agenda, source: body }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
