import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  // This endpoint returns a mocked agenda generated from meeting history
  const agenda = [
    { item: "Review last meeting decisions", estMin: 5 },
    { item: "Discuss Q3 pipeline and assign owners", estMin: 15 },
    { item: "Define next steps for feature X", estMin: 10 },
  ];

  return NextResponse.json({ agenda, source: body });
}
