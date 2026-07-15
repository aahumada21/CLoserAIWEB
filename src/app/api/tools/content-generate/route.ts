import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt, format } = body as { prompt?: string; format?: string };

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "El prompt no puede estar vacío." }, { status: 400 });
  }

  const apiKey = process.env.CONTENT_GENERATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key no configurada." }, { status: 500 });
  }

  const res = await fetch("https://tools.aahumada.com/webhook/content-generate-web", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({
      prompt: prompt.trim(),
      format: format ?? "random",
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Error del servidor: ${res.status}` }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
