"use client";

import { useState } from "react";
import Link from "next/link";
import RealChat from "./RealChat";

type Lead = {
  nombre: string;
  correo: string;
  telefono: string;
};

type ChatMessage = {
  from: "bot" | "user";
  text: string;
};

type Option = {
  label: string;
  next: string;
};

type Step = {
  bot: string[];
  options?: Option[];
  end?: boolean;
};

const steps: Record<string, Step> = {
  start: {
    bot: [
      "¡Hola {nombre}! 👋 Soy el asistente de Closer AI.",
      "¿Qué te gustaría hacer?",
    ],
    options: [
      { label: "Agendar una hora", next: "agendar_dia" },
      { label: "Cotizar un servicio", next: "cotizar" },
      { label: "Hablar con un asesor", next: "handoff" },
    ],
  },
  agendar_dia: {
    bot: ["Perfecto, vamos a agendar 📅", "¿Qué día te acomoda?"],
    options: [
      { label: "Hoy", next: "agendar_hora" },
      { label: "Mañana", next: "agendar_hora" },
      { label: "Otro día", next: "agendar_hora" },
    ],
  },
  agendar_hora: {
    bot: ["Tengo estos horarios disponibles:", "🕒 10:00 — 🕒 15:30 — 🕒 18:00", "¿Cuál prefieres?"],
    options: [
      { label: "10:00", next: "agendar_confirmar" },
      { label: "15:30", next: "agendar_confirmar" },
      { label: "18:00", next: "agendar_confirmar" },
    ],
  },
  agendar_confirmar: {
    bot: [
      "Listo, tu hora quedó agendada ✅",
      "Te voy a enviar un recordatorio automático un día antes para que no se te olvide.",
      "¿Quieres ver algo más?",
    ],
    options: [
      { label: "Cotizar un servicio", next: "cotizar" },
      { label: "Volver al inicio", next: "start" },
      { label: "Terminar demo", next: "fin" },
    ],
  },
  cotizar: {
    bot: ["¿Qué servicio necesitas cotizar?"],
    options: [
      { label: "Servicio básico", next: "cotizar_resultado" },
      { label: "Servicio premium", next: "cotizar_resultado" },
    ],
  },
  cotizar_resultado: {
    bot: ["Tu cotización para ese servicio es $25.000 💰", "¿Quieres agendar la hora ahora?"],
    options: [
      { label: "Sí, agendar", next: "agendar_dia" },
      { label: "Volver al inicio", next: "start" },
      { label: "Terminar demo", next: "fin" },
    ],
  },
  handoff: {
    bot: [
      "Entendido, te conecto con un asesor humano ahora 👤",
      "(En un caso real, aquí tu equipo toma la conversación sin perder el contexto)",
    ],
    options: [
      { label: "Volver al inicio", next: "start" },
      { label: "Terminar demo", next: "fin" },
    ],
  },
  fin: {
    bot: [
      "¡Gracias por probar Closer AI! 🙌",
      "Esto fue solo una simulación. El bot real aprende los servicios, precios y horarios reales de tu negocio.",
    ],
    end: true,
  },
};

function buildMessages(step: Step, nombre: string): ChatMessage[] {
  return step.bot.map((text) => ({
    from: "bot",
    text: text.replace("{nombre}", nombre),
  }));
}

export default function DemoExperience({
  realChatEnabled,
}: {
  realChatEnabled: boolean;
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [currentStepId, setCurrentStepId] = useState("start");

  function handleSubmit(formData: FormData) {
    const nombre = String(formData.get("nombre") || "").trim();
    const correo = String(formData.get("correo") || "").trim();
    const telefono = String(formData.get("telefono") || "").trim();

    if (!nombre || !correo || !telefono) {
      setError("Completa los tres campos para continuar.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      setError("Ingresa un correo válido.");
      return;
    }

    setError("");
    setLead({ nombre, correo, telefono });
    setHistory(buildMessages(steps.start, nombre));
  }

  function handleOption(option: Option) {
    if (!lead) return;
    const nextStep = steps[option.next];
    setHistory((prev) => [
      ...prev,
      { from: "user", text: option.label },
      ...buildMessages(nextStep, lead.nombre),
    ]);
    setCurrentStepId(option.next);
  }

  const currentStep = steps[currentStepId];

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Closer AI
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-12">
        {!lead ? (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">
              Prueba el chatbot
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Déjanos tus datos y te mostramos una simulación de cómo
              responde Closer AI a tus clientes por WhatsApp.
            </p>
            <form
              action={handleSubmit}
              className="mt-8 flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Correo
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="tu@correo.com"
                />
              </div>
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Número de contacto
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="mt-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Probar el chatbot
              </button>
            </form>
          </>
        ) : realChatEnabled ? (
          <>
            <h1 className="text-xl font-semibold tracking-tight">
              Demo del chatbot
            </h1>
            <RealChat lead={lead} />
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold tracking-tight">
              Demo del chatbot
            </h1>
            <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4">
              {history.map((message, i) => (
                <div
                  key={i}
                  className={
                    message.from === "bot"
                      ? "max-w-[85%] self-start whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-2 text-sm text-zinc-800"
                      : "max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-2 text-sm text-white"
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>

            {!currentStep.end ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {currentStep.options?.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleOption(option)}
                    className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <a
                href="https://wa.me/56930977617"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-emerald-600 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Quiero esto en mi negocio — escribir por WhatsApp
              </a>
            )}
          </>
        )}
      </main>
    </div>
  );
}
