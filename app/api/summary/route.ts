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

    // Fetch notes and followups in parallel
    const [notesResult, followupsResult] = await Promise.all([
      supabaseAdmin
        .from("prep_notes")
        .select("content")
        .eq("meeting_id", meetingId),
      supabaseAdmin
        .from("followups")
        .select("task,status")
        .eq("meeting_id", meetingId)
    ]);

    const { data: notes } = notesResult;
    const { data: followups } = followupsResult;

    const summary = {
      decisions: notes?.map(n => n.content) || [],
      actionItems: followups?.filter(f => f.status === "pending").map(f => f.task) || [],
      completed: followups?.filter(f => f.status === "completed").map(f => f.task) || [],
      inProgress: followups?.filter(f => f.status === "in_progress").map(f => f.task) || [],
      totalFollowups: followups?.length || 0,
      completedCount: followups?.filter(f => f.status === "completed").length || 0,
      pendingCount: followups?.filter(f => f.status === "pending").length || 0
    };

    return new Response(JSON.stringify(summary), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

