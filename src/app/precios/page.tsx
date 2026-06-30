import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Precios — Closer AI",
  description:
    "Planes de Closer AI para pymes que quieren automatizar su atención por WhatsApp.",
};

const planes = [
  {
    nombre: "Base",
    precio: "$29.000",
    descripcion:
      "Para empezar a agendar citas por WhatsApp sin tocar el teléfono.",
    tag: null,
    destacado: false,
    incluye: [
      { texto: "1 número de WhatsApp Business", pronto: false },
      { texto: "Chatbot de IA para agendar citas 24/7", pronto: false },
      { texto: "Conexión con Google Calendar", pronto: false },
      { texto: "Captura automática de leads", pronto: false },
      { texto: "Recordatorios automáticos de cita", pronto: false },
      { texto: "Derivación a humano", pronto: false },
      { texto: "Panel de administración web", pronto: false },
      { texto: "Soporte por WhatsApp", pronto: false },
    ],
    cta: "Contratar",
  },
  {
    nombre: "Plus",
    precio: "$79.000",
    descripcion:
      "Para negocios con más de un operador o que necesitan cotizar y manejar múltiples líneas.",
    tag: null,
    destacado: false,
    incluye: [
      { texto: "Todo lo del plan Base", pronto: false },
      { texto: "Cotización automática de servicios y precios", pronto: false },
      { texto: "Hasta 3 números / líneas de atención", pronto: false },
      { texto: "Múltiples operadores con su propio Google Calendar", pronto: false },
      { texto: "Chat en tu sitio web (webchat)", pronto: false },
      { texto: "Historial completo de conversaciones", pronto: false },
      { texto: "Soporte prioritario", pronto: false },
    ],
    cta: "Contratar",
  },
  {
    nombre: "Pro",
    precio: "$100.000",
    descripcion:
      "La solución completa: el bot agenda por WhatsApp y web, y el cliente puede pagar en el mismo momento.",
    tag: "Recomendado",
    destacado: true,
    incluye: [
      { texto: "Todo lo del plan Plus", pronto: false },
      { texto: "Link de agendamiento web (reserva desde tu sitio o redes)", pronto: false },
      { texto: "Pagos online al momento de reservar", pronto: true },
      { texto: "Agentes / líneas ilimitados", pronto: false },
      { texto: "Soporte 24/7", pronto: false },
    ],
    cta: "Contratar",
  },
];

export default function PreciosPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-900">
      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Closer AI
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Probar el bot
            </Link>
            <Link
              href="/contacto"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Hablar con ventas
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Planes y precios
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
            Todos los planes incluyen la configuración inicial del chatbot con
            tus servicios, precios y horarios reales. Desde el primer día
            responde como alguien de tu equipo.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4">
          <span className="text-xl">🎁</span>
          <p className="text-sm font-medium text-emerald-800">
            <strong>Primer mes gratis</strong> en todos los planes — sin
            tarjeta de crédito, sin compromiso. Cancela cuando quieras.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {planes.map((plan) => (
            <div
              key={plan.nombre}
              className={
                plan.destacado
                  ? "relative flex flex-col rounded-2xl border-2 border-emerald-600 bg-white p-6 shadow-md"
                  : "flex flex-col rounded-2xl border border-zinc-200 bg-white p-6"
              }
            >
              {plan.tag && (
                <p className="mb-3 w-fit rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-semibold text-white">
                  {plan.tag}
                </p>
              )}
              <h2 className="text-xl font-semibold">{plan.nombre}</h2>
              <p className="mt-1 text-sm text-zinc-500">{plan.descripcion}</p>

              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900">
                  {plan.precio}
                </span>
                <span className="ml-1 text-sm text-zinc-400">/mes</span>
              </div>

              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {plan.incluye.map((item) => (
                  <li
                    key={item.texto}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className={item.pronto ? "mt-0.5 text-zinc-300" : "mt-0.5 text-emerald-600"}>
                      ✓
                    </span>
                    <span className={item.pronto ? "text-zinc-400" : "text-zinc-700"}>
                      {item.texto}
                      {item.pronto && (
                        <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-400">
                          próximamente
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contacto"
                className={
                  plan.destacado
                    ? "mt-6 rounded-full bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-500"
                    : "mt-6 rounded-full border border-zinc-200 px-4 py-3 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                }
              >
                {plan.cta} — 1er mes gratis
              </Link>
            </div>
          ))}
        </div>

        {/* Empresa separado */}
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Empresa
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                Solución a medida para tu cadena o franquicia
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Múltiples sucursales, integraciones con tus sistemas, flujos
                personalizados y soporte dedicado. Precio según el proyecto.
              </p>
            </div>
            <Link
              href="/contacto"
              className="w-fit shrink-0 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Hablar con ventas
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-400">
          ¿Tienes dudas sobre qué plan elegir?{" "}
          <Link href="/contacto" className="text-emerald-700 hover:underline">
            Escríbenos
          </Link>{" "}
          y te recomendamos el correcto sin compromiso.
        </p>
      </main>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        <p>
          © {new Date().getFullYear()} Closer AI. Todos los derechos
          reservados.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/privacidad" className="hover:text-zinc-700 hover:underline">
            Política de Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-zinc-700 hover:underline">
            Condiciones del Servicio
          </Link>
        </div>
      </footer>
    </div>
  );
}
