import { NextRequest, NextResponse } from "next/server";

const WIDGET_ID = process.env.WEBCHAT_WIDGET_ID || "closer-web-demo";

export async function POST(request: NextRequest) {
  const token = process.env.WEBCHAT_WIDGET_TOKEN;
  const inboundUrl = process.env.N8N_WEBCHAT_INBOUND_URL;

  if (!token || !inboundUrl) {
    return NextResponse.json(
      { error: "webchat_not_configured" },
      { status: 503 },
    );
  }

  const body = await request.json();
  const { visitorId, sessionId, text, name, email, phone, pageUrl } = body;

  if (!visitorId || !sessionId || !text) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const upstream = await fetch(inboundUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webchat-Token": token,
    },
    body: JSON.stringify({
      widget_id: WIDGET_ID,
      visitor_id: visitorId,
      session_id: sessionId,
      name: name || "",
      email: email || "",
      phone: phone || "",
      text,
      page_url: pageUrl || "",
    }),
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "upstream_error", status: upstream.status },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
