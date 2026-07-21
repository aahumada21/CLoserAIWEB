import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_URL = "https://tools.aahumada.com/webhook/content-generate-web";

// Aumentar límite para uploads de imágenes
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.CONTENT_GENERATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key no configurada." }, { status: 500 });
  }

  let incoming: FormData;
  try {
    incoming = await req.formData();
  } catch (err) {
    console.error("[content-generate] formData parse error:", err);
    return NextResponse.json({ error: "No se pudo leer el formulario. El archivo puede ser demasiado grande." }, { status: 400 });
  }

  const mode = String(incoming.get("mode") ?? "").trim();
  const prompt = String(incoming.get("prompt") ?? "").trim();

  if (!mode) return NextResponse.json({ error: "Modo requerido." }, { status: 400 });
  if (!prompt) return NextResponse.json({ error: "El prompt no puede estar vacío." }, { status: 400 });

  const out = new FormData();
  out.append("mode", mode);
  out.append("prompt", prompt);

  const variables = String(incoming.get("variables") ?? "").trim();
  if (variables) out.append("variables", variables);

  const slides = String(incoming.get("slides") ?? "").trim();
  if (slides) out.append("slides", slides);

  const aspectRatio = String(incoming.get("aspect_ratio") ?? "").trim();
  if (aspectRatio) out.append("aspect_ratio", aspectRatio);

  const image = incoming.get("image");
  if (image instanceof File && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const blob = new Blob([bytes], { type: image.type || "image/png" });
    out.append("image", blob, image.name || "image.png");
  }

  console.log("[content-generate] sending mode=%s prompt=%s hasImage=%s", mode, prompt.slice(0, 40), image instanceof File && image.size > 0);

  try {
    const res = await fetch(EXTERNAL_URL, {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: out,
      signal: AbortSignal.timeout(30000),
    });

    const responseText = await res.text();
    console.log("[content-generate] response status=%d body=%s", res.status, responseText.slice(0, 200));

    if (!res.ok) {
      return NextResponse.json({ error: `Error del servidor externo: ${res.status}` }, { status: 502 });
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch {
      // El endpoint respondió 200 pero no es JSON — igualmente es éxito
      return NextResponse.json({ message: responseText || "Workflow was started" });
    }
  } catch (err) {
    console.error("[content-generate] fetch error:", err);
    const msg = err instanceof Error && err.name === "TimeoutError"
      ? "El servidor tardó demasiado en responder (>30s)."
      : `Error de conexión: ${err instanceof Error ? err.message : String(err)}`;
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
