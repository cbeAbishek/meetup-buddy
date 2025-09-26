
import { NextRequest } from "next/server";
import { inngest } from "@/inngest/clint";
export async function POST(req: NextRequest) {
  const body = await req.json();
  // send event that will invoke the AgentKit network registered as "my-network/run"
  const { ids } = await inngest.send({
    name: "my-network/run",
    data: { input: body.input },
  });
  return new Response(JSON.stringify({ ids }), { status: 200 });
}
