"use client";

import { useState } from "react";

const FORMATS = [
  { value: "random", label: "Aleatorio" },
  { value: "single", label: "Imagen única" },
  { value: "carousel", label: "Carrusel" },
] as const;

type Format = (typeof FORMATS)[number]["value"];
type Status = "idle" | "loading" | "success" | "error";

export default function ToolsPage() {
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState<Format>("random");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/tools/content-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, format }),
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
    setFormat("random");
    setErrorMsg("");
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Herramientas internas
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Generador de contenido
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Describe el post que quieres generar. El resultado llega a Telegram
            en 1–2 minutos.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <p className="text-3xl">✅</p>
            <p className="mt-3 text-base font-semibold text-emerald-800">
              ¡Enviado! Revisá tu Telegram en 1–2 min.
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              Formato:{" "}
              <span className="font-medium">
                {FORMATS.find((f) => f.value === format)?.label}
              </span>
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
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Brief del post
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                required
                placeholder="Ej: Post para Instagram mostrando cómo Vendea le ahorra tiempo a una barbería que recibía 50 mensajes por día. Tono cercano, lenguaje simple. Enfocado en dueños de pymes."
                className="mt-1.5 w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-zinc-700">
                Formato
              </label>
              <div className="mt-2 flex gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      format === f.value
                        ? "bg-zinc-900 text-white"
                        : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {status === "error" && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !prompt.trim()}
              className="mt-6 w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "Generando…" : "Generar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
