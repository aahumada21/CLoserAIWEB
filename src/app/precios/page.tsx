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
    precio: "$30.000",
    descripcion:
      "Todo lo que un negocio necesita para empezar a agendar citas por WhatsApp sin tocar el teléfono.",
    tag: null,
    incluye: [
      "1 número de WhatsApp Business",
      "Chatbot de IA para agendar citas 24/7",
      "Conexión con Google Calendar",
      "Captura automática de leads (nombre, teléfono, correo)",
      "Recordatorios automáticos de cita",
      "Derivación a humano cuando el bot no puede resolver",
      "Panel de administración web",
      "Soporte por WhatsApp",
    ],
    cta: "Contratar",
  },
  {
    nombre: "Pro",
    precio: "$60.000",
    descripcion:
      "Para negocios con más de un operador, más de una línea o que quieren cotizar servicios automáticamente.",
    tag: "Más popular",
    destacado: true,
    incluye: [
      "Todo lo del plan Base",
      "Cotización automática de servicios y precios",
      "Hasta 3 números / líneas de atención independientes",
      "Múltiples operadores con su propio Google Calendar",
      "Chat en tu sitio web (webchat)",
      "Historial completo de conversaciones y reservas",
      "Configuración de horarios por persona",
      "Soporte prioritario",
    ],
    cta: "Contratar",
  },
  {
    nombre: "Empresa",
    precio: "A convenir",
    descripcion:
      "Para cadenas, franquicias o negocios con múltiples sucursales o necesidades específicas.",
    tag: null,
    incluye: [
      "Todo lo del plan Pro",
      "Sucursales / agentes ilimitados",
      "Configuración de cobertura geográfica por sucursal",
      "Integración con sistemas propios (CRM, ERP)",
      "Flujos de conversación a medida",
      "Onboarding dedicado con tu equipo",
      "SLA de respuesta garantizado",
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
            Todos los planes incluyen la configuración inicial del chatbot con
            tus servicios, precios y horarios reales, para que desde el primer
            día responda como alguien de tu equipo. El precio final se ajusta
            según el volumen de conversaciones de tu negocio.
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
              {plan.tag && (
                <p className="mb-3 w-fit rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-medium text-white">
                  {plan.tag}
                </p>
              )}
              <h2 className="text-xl font-semibold">{plan.nombre}</h2>
              <p className="mt-1 text-sm text-zinc-500">{plan.descripcion}</p>

              <div className="mt-4">
                <span className="text-2xl font-semibold text-zinc-900">
                  {plan.precio}
                </span>
                {plan.precio !== "A convenir" && (
                  <span className="ml-1 text-sm text-zinc-400">/mes</span>
                )}
              </div>

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
