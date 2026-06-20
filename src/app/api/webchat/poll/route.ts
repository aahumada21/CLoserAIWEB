import { NextRequest, NextResponse } from "next/server";

const WIDGET_ID = process.env.WEBCHAT_WIDGET_ID || "closer-web-demo";

export async function GET(request: NextRequest) {
  const token = process.env.WEBCHAT_WIDGET_TOKEN;
  const outboundUrl = process.env.N8N_WEBCHAT_OUTBOUND_URL;

  if (!token || !outboundUrl) {
    return NextResponse.json(
      { error: "webchat_not_configured" },
      { status: 503 },
    );
  }

  const visitorId = request.nextUrl.searchParams.get("visitorId");
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  const since = request.nextUrl.searchParams.get("since") || "";

  if (!visitorId || !sessionId) {
    return NextResponse.json(
      { error: "missing_visitor_or_session_id" },
      { status: 400 },
    );
  }

  const url = new URL(outboundUrl);
  url.searchParams.set("widget_id", WIDGET_ID);
  url.searchParams.set("visitor_id", visitorId);
  url.searchParams.set("session_id", sessionId);
  if (since) url.searchParams.set("since", since);

  const upstream = await fetch(url.toString(), {
    headers: { "X-Webchat-Token": token },
  });

  if (!upstream.ok) {
    return NextResponse.json({ messages: [] });
  }

  const data = await upstream.json();
  return NextResponse.json({ messages: data.messages || [] });
}
