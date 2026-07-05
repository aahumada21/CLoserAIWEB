import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  const agentId = req.nextUrl.searchParams.get("agentId");
  if (!agentId) {
    return NextResponse.json({ ok: false, error: "missing_agent_id" }, { status: 400 });
  }

  // Verify user belongs to the org that owns this agent
  const { data: agent } = await supabase
    .from("agents")
    .select("id, organization_id")
    .eq("id", agentId)
    .maybeSingle();

  if (!agent) {
    return NextResponse.json({ ok: false, error: "agent_not_found" }, { status: 404 });
  }

  const url = process.env.N8N_CHECK_CALENDAR_URL;
  const token = process.env.CHECK_CALENDAR_TOKEN;

  if (!url || !token) {
    return NextResponse.json({ ok: false, error: "not_configured" });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Check-Token": token,
      },
      body: JSON.stringify({
        agent_id: agentId,
        organization_id: agent.organization_id,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      // n8n no disponible o webhook no existe aún — no podemos confirmar el estado
      return NextResponse.json({ ok: null, error: "n8n_unavailable" });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Timeout u otro error de red — estado desconocido
    return NextResponse.json({ ok: null, error: "timeout" });
  }
}
