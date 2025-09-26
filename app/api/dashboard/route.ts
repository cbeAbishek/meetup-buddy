import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const type = searchParams.get("type"); // 'upcoming', 'overdue', 'completed'
    const period = searchParams.get("period"); // 'today', 'week', 'month'

    if (!profileId) {
      return new Response(JSON.stringify({ error: "profileId is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    const endOfMonth = new Date(today);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // Get meetings
    let meetingsQuery = supabaseAdmin
      .from("meetings")
      .select(`
        id,
        topic,
        meeting_date,
        status,
        duration,
        location
      `)
      .eq("profile_id", profileId)
      .order("meeting_date", { ascending: true });

    // Get followups
    let followupsQuery = supabaseAdmin
      .from("followups")
      .select(`
        id,
        task,
        status,
        due_date,
        meeting_id,
        meetings!inner(topic)
      `)
      .eq("assigned_to", profileId)
      .order("due_date", { ascending: true });

    // Apply filters based on type and period
    if (type === 'upcoming') {
      meetingsQuery = meetingsQuery.gte("meeting_date", new Date().toISOString());
      followupsQuery = followupsQuery
        .eq("status", "pending")
        .gte("due_date", new Date().toISOString());
    } else if (type === 'overdue') {
      followupsQuery = followupsQuery
        .eq("status", "pending")
        .lt("due_date", new Date().toISOString());
      meetingsQuery = meetingsQuery.eq("status", "scheduled").lt("meeting_date", new Date().toISOString());
    } else if (type === 'completed') {
      meetingsQuery = meetingsQuery.eq("status", "completed");
      followupsQuery = followupsQuery.eq("status", "completed");
    }

    if (period === 'today') {
      meetingsQuery = meetingsQuery
        .gte("meeting_date", today.toISOString())
        .lte("meeting_date", endOfToday.toISOString());
      followupsQuery = followupsQuery
        .gte("due_date", today.toISOString())
        .lte("due_date", endOfToday.toISOString());
    } else if (period === 'week') {
      meetingsQuery = meetingsQuery
        .gte("meeting_date", today.toISOString())
        .lte("meeting_date", endOfWeek.toISOString());
      followupsQuery = followupsQuery
        .gte("due_date", today.toISOString())
        .lte("due_date", endOfWeek.toISOString());
    } else if (period === 'month') {
      meetingsQuery = meetingsQuery
        .gte("meeting_date", today.toISOString())
        .lte("meeting_date", endOfMonth.toISOString());
      followupsQuery = followupsQuery
        .gte("due_date", today.toISOString())
        .lte("due_date", endOfMonth.toISOString());
    }

    // Execute queries in parallel
    const [meetingsResult, followupsResult] = await Promise.all([
      meetingsQuery,
      followupsQuery
    ]);

    const { data: meetings } = meetingsResult;
    const { data: followups } = followupsResult;

    // Get notification count
    const { count: unreadNotifications } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: 'exact', head: true })
      .eq("profile_id", profileId)
      .eq("read", false);

    const dashboard = {
      meetings: meetings || [],
      followups: followups || [],
      unreadNotifications: unreadNotifications || 0,
      summary: {
        upcomingMeetings: meetings?.filter(m => 
          new Date(m.meeting_date) >= new Date() && m.status === 'scheduled'
        ).length || 0,
        pendingTasks: followups?.filter(f => f.status === 'pending').length || 0,
        overdueTasks: followups?.filter(f => 
          f.status === 'pending' && new Date(f.due_date) < new Date()
        ).length || 0,
        completedTasks: followups?.filter(f => f.status === 'completed').length || 0
      }
    };

    return new Response(JSON.stringify(dashboard), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}