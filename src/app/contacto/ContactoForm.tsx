"use client";

import { useState } from "react";

export default function ContactoForm() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const nombre = String(data.get("nombre") || "").trim();
    const empresa = String(data.get("empresa") || "").trim();
    const correo = String(data.get("correo") || "").trim();
    const whatsapp = String(data.get("whatsapp") || "").trim();
    const mensaje = String(data.get("mensaje") || "").trim();

    const texto = [
      `Hola, quiero información sobre Closer AI.`,
      ``,
      `Nombre: ${nombre}`,
      empresa ? `Empresa/negocio: ${empresa}` : null,
      correo ? `Correo: ${correo}` : null,
      whatsapp ? `WhatsApp: ${whatsapp}` : null,
      mensaje ? `\n${mensaje}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(
      `https://wa.me/56930977617?text=${encodeURIComponent(texto)}`,
      "_blank",
    );

    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-base font-semibold text-emerald-800">
          ¡Listo! Se abrió WhatsApp con tu mensaje.
        </p>
        <p className="mt-2 text-sm text-emerald-700">
          Si no se abrió automáticamente, escríbenos directo al{" "}
          <a
            href="https://wa.me/56930977617"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            +56 9 3097 7617
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-4 text-sm font-medium text-emerald-700 hover:underline"
        >
          Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Nombre *
        </label>
        <input
          name="nombre"
          required
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Tipo de negocio
        </label>
        <input
          name="empresa"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="Ej. Taller de detailing, clínica dental..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Correo
        </label>
        <input
          name="correo"
          type="email"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="tu@empresa.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          WhatsApp de contacto
        </label>
        <input
          name="whatsapp"
          type="tel"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="+56 9 1234 5678"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          ¿Qué quieres lograr con el chatbot?
        </label>
        <textarea
          name="mensaje"
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="Cuéntanos brevemente cómo recibes hoy los pedidos de tus clientes y qué quisieras automatizar."
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
      >
        Enviar por WhatsApp
      </button>
      <p className="text-xs text-zinc-400">
        Al enviar, se abre WhatsApp con tu mensaje pre-llenado. No almacenamos
        tus datos fuera de la conversación de WhatsApp.
      </p>
    </form>
  );
}
