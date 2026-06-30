import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Precios — Closer AI",
  description:
    "Planes de Closer AI para pymes que quieren automatizar su atención por WhatsApp.",
};

const planes = [
  {
    nombre: "Starter",
    descripcion: "Para negocios que están empezando a automatizar su atención.",
    incluye: [
      "1 número de WhatsApp Business",
      "Agendamiento y cotización automática",
      "1 Google Calendar conectado",
      "Recordatorios de cita automáticos",
      "Derivación a humano",
      "Panel de administración",
      "Soporte por WhatsApp",
    ],
    cta: "Contratar",
  },
  {
    nombre: "Pro",
    descripcion:
      "Para negocios con más de un operador o que necesitan más de un canal.",
    destacado: true,
    incluye: [
      "Todo lo de Starter",
      "Hasta 3 números / líneas de atención",
      "Múltiples calendarios (staff con agenda propia)",
      "Chat en tu sitio web (webchat)",
      "Historial de conversaciones completo",
      "Configuración de horarios por persona",
      "Soporte prioritario",
    ],
    cta: "Contratar",
  },
  {
    nombre: "Empresa",
    descripcion:
      "Para cadenas, franquicias o negocios que necesitan una solución a medida.",
    incluye: [
      "Todo lo de Pro",
      "Agentes ilimitados",
      "Integración con sistemas propios (CRM, ERP)",
      "Flujos de conversación personalizados",
      "SLA de respuesta garantizado",
      "Onboarding dedicado",
      "Soporte 24/7",
    ],
    cta: "Contactar",
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
            El precio final depende de tu negocio, el volumen de conversaciones
            y los canales que necesites. Todos los planes incluyen configuración
            inicial y soporte.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {planes.map((plan) => (
            <div
              key={plan.nombre}
              className={
                plan.destacado
                  ? "flex flex-col rounded-2xl border-2 border-emerald-600 bg-white p-6 shadow-sm"
                  : "flex flex-col rounded-2xl border border-zinc-200 bg-white p-6"
              }
            >
              {plan.destacado && (
                <p className="mb-3 w-fit rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-medium text-white">
                  Más popular
                </p>
              )}
              <h2 className="text-xl font-semibold">{plan.nombre}</h2>
              <p className="mt-1 text-sm text-zinc-500">{plan.descripcion}</p>

              <p className="mt-4 text-sm font-medium text-zinc-400">
                Precio a convenir
              </p>

              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {plan.incluye.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-700"
                  >
                    <span className="mt-0.5 text-emerald-600">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/contacto"
                className={
                  plan.destacado
                    ? "mt-6 rounded-full bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-500"
                    : "mt-6 rounded-full border border-zinc-200 px-4 py-2.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-zinc-100 bg-zinc-50 p-8 text-center">
          <h2 className="text-xl font-semibold">¿No sabes qué plan necesitas?</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Cuéntanos de tu negocio y te recomendamos el plan correcto. No hay
            ningún compromiso.
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Hablar con ventas
          </Link>
        </div>
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
