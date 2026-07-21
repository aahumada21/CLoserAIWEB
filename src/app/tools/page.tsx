"use client";

import { useRef, useState } from "react";

const MODES = [
  {
    value: "text_to_image",
    label: "Texto a imagen",
    description: "Genera una imagen desde el prompt",
    needsImage: false,
    needsVariables: false,
  },
  {
    value: "text_to_image_carousel",
    label: "Carrusel texto a imagen",
    description: "Genera múltiples slides desde el prompt",
    needsImage: false,
    needsVariables: false,
  },
  {
    value: "image_to_image",
    label: "Imagen a imagen",
    description: "Transforma una imagen PNG con el prompt",
    needsImage: true,
    needsVariables: false,
  },
  {
    value: "image_to_image_carousel",
    label: "Carrusel imagen a imagen",
    description: "Genera slides a partir de una imagen con variables",
    needsImage: true,
    needsVariables: true,
  },
] as const;

type ModeValue = (typeof MODES)[number]["value"];
type Status = "idle" | "loading" | "success" | "error";

export default function ToolsPage() {
  const [mode, setMode] = useState<ModeValue>("text_to_image");
  const [prompt, setPrompt] = useState("");
  const [variables, setVariables] = useState("");
  const [slidesJson, setSlidesJson] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const currentMode = MODES.find((m) => m.value === mode)!;

  let parsedSlides: unknown[] | null = null;
  let slidesError = "";
  if (currentMode.needsVariables && slidesJson.trim()) {
    try {
      const parsed = JSON.parse(slidesJson);
      if (!Array.isArray(parsed) || parsed.some((s) => typeof s !== "object" || s === null)) {
        slidesError = "Debe ser un array JSON de objetos.";
      } else {
        parsedSlides = parsed;
      }
    } catch {
      slidesError = "JSON inválido.";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (currentMode.needsImage && !imageFile) return;
    if (slidesError) return;

    setStatus("loading");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("mode", mode);
    fd.append("prompt", prompt.trim());
    if (currentMode.needsVariables && variables.trim()) {
      fd.append("variables", variables.trim());
    }
    if (currentMode.needsVariables && parsedSlides) {
      fd.append("slides", JSON.stringify(parsedSlides));
    }
    if (currentMode.needsImage && imageFile) {
      fd.append("image", imageFile, imageFile.name);
    }
    if (aspectRatio) fd.append("aspect_ratio", aspectRatio);

    try {
      const res = await fetch("/api/tools/content-generate", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Error desconocido.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("No se pudo conectar con el servidor.");
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setPrompt("");
    setVariables("");
    setSlidesJson("");
    setImageFile(null);
    setAspectRatio("");
    setErrorMsg("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const isCarousel = mode === "text_to_image_carousel" || mode === "image_to_image_carousel";
  const slideSource = currentMode.needsVariables ? variables : prompt;
  const slideCount = parsedSlides
    ? parsedSlides.length
    : isCarousel && slideSource.trim()
    ? slideSource.split(",").filter((s) => s.trim().length > 0).length
    : null;

  const canSubmit =
    !!prompt.trim() &&
    (!currentMode.needsImage || !!imageFile) &&
    !slidesError &&
    status !== "loading";

  return (
    <div className="relative min-h-screen bg-zinc-50 px-4 py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Herramientas internas — Vendea
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Generador de contenido
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            El resultado llega a Telegram en 1–2 minutos.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <p className="text-4xl">✅</p>
            <p className="mt-3 text-base font-semibold text-emerald-800">
              ¡Enviado! Revisá tu Telegram en 1–2 min.
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              Modo: <span className="font-medium">{currentMode.label}</span>
              {slideCount !== null && (
                <> · <span className="font-medium">{slideCount} {slideCount === 1 ? "imagen" : "imágenes"}</span></>
              )}
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Generar otro
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            {/* Selector de modo */}
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Modo de generación
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {MODES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMode(m.value)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      mode === m.value
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <p className="text-sm font-medium leading-tight">{m.label}</p>
                    <p className="mt-0.5 text-xs text-zinc-400 leading-tight">
                      {m.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Prompt / Brief
                </label>
                {mode === "text_to_image_carousel" && slideCount !== null && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {slideCount} {slideCount === 1 ? "imagen" : "imágenes"}
                  </span>
                )}
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                required
                placeholder="Describí qué querés generar, tono, contexto, estilo visual…"
                className="mt-1.5 w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Imagen PNG — solo modos imagen a imagen */}
            {currentMode.needsImage && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-zinc-700">
                  Imagen de referencia{" "}
                  <span className="text-zinc-400 font-normal">(PNG o JPG)</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  required
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="mt-1.5 block w-full cursor-pointer rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-xs file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
                />
                {imageFile && (
                  <p className="mt-1 text-xs text-zinc-400">{imageFile.name}</p>
                )}
              </div>
            )}

            {/* Variables — solo carrusel imagen a imagen */}
            {currentMode.needsVariables && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Variables{" "}
                    <span className="text-zinc-400 font-normal">
                      (separadas por coma)
                    </span>
                  </label>
                  {slideCount !== null && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      {slideCount} {slideCount === 1 ? "imagen" : "imágenes"}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={variables}
                  onChange={(e) => setVariables(e.target.value)}
                  placeholder="precio, nombre, servicio, ..."
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Slides — JSON con variables por slide, alternativa/complemento a Variables */}
            {currentMode.needsVariables && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-zinc-700">
                  Slides{" "}
                  <span className="text-zinc-400 font-normal">
                    (opcional — array JSON, una variable por clave; usá {"{{CLAVE}}"} en el prompt)
                  </span>
                </label>
                <textarea
                  value={slidesJson}
                  onChange={(e) => setSlidesJson(e.target.value)}
                  rows={5}
                  placeholder={'[\n  {"TITULO": "Responde al instante", "NUMERO_SLIDE": "2/5"}\n]'}
                  spellCheck={false}
                  className={`mt-1.5 w-full resize-y rounded-xl border px-4 py-3 font-mono text-xs leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:outline-none ${
                    slidesError
                      ? "border-red-300 focus:border-red-500"
                      : "border-zinc-200 focus:border-emerald-500"
                  }`}
                />
                {slidesError && (
                  <p className="mt-1 text-xs text-red-500">{slidesError}</p>
                )}
              </div>
            )}

            {/* Opcional: aspect_ratio */}
            <div className="mt-4 max-w-[160px]">
              <label className="block text-sm font-medium text-zinc-700">
                Aspect ratio{" "}
                <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">— default —</option>
                {["1:1","16:9","9:16","4:3","3:4","3:2","2:3","4:5","5:4"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {status === "error" && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading"
                ? "Enviando…"
                : slideCount !== null
                ? `Generar ${slideCount} ${slideCount === 1 ? "imagen" : "imágenes"}`
                : "Generar"}
            </button>
          </form>
        )}
      </div>

      <p className="fixed bottom-3 right-4 text-xs text-zinc-300 select-none">
        v1.9
      </p>
    </div>
  );
}
