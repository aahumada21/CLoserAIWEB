import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_URL = "https://tools.aahumada.com/webhook/content-generate-web";

export async function POST(req: NextRequest) {
  const apiKey = process.env.CONTENT_GENERATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key no configurada." }, { status: 500 });
  }

  const incoming = await req.formData();

  const mode = String(incoming.get("mode") ?? "").trim();
  const prompt = String(incoming.get("prompt") ?? "").trim();

  if (!mode) return NextResponse.json({ error: "Modo requerido." }, { status: 400 });
  if (!prompt) return NextResponse.json({ error: "El prompt no puede estar vacío." }, { status: 400 });

  // Build outgoing multipart — do NOT set Content-Type (fetch sets boundary automatically)
  const out = new FormData();
  out.append("mode", mode);
  out.append("prompt", prompt);

  const variables = String(incoming.get("variables") ?? "").trim();
  if (variables) out.append("variables", variables);

  const image = incoming.get("image");
  if (image && image instanceof File && image.size > 0) {
    out.append("image", image, image.name);
  }

  try {
    const res = await fetch(EXTERNAL_URL, {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: out,
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Error del servidor: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error && err.name === "TimeoutError"
      ? "El servidor tardó demasiado en responder."
      : "No se pudo conectar con el servidor.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
