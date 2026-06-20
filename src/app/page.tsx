import Link from "next/link";

const ventajas = [
  {
    title: "Agenda 24/7 por WhatsApp",
    description:
      "El chatbot responde y agenda citas en cualquier horario, incluso fuera de tu jornada laboral. Ningún lead se queda esperando.",
  },
  {
    title: "Cotiza automáticamente",
    description:
      "Reconoce el servicio que pide el cliente y entrega una cotización al instante, sin que tengas que escribir nada.",
  },
  {
    title: "Reduce las inasistencias",
    description:
      "Envía recordatorios automáticos antes de cada cita para que tus clientes no olviden su hora.",
  },
  {
    title: "Deriva a un humano cuando hace falta",
    description:
      "Si la conversación se complica o el cliente lo pide, el chatbot transfiere la conversación a tu equipo sin perder el contexto.",
  },
  {
    title: "Aprende tu negocio",
    description:
      "Se configura con tus servicios, precios, cobertura y horarios reales, así que responde como alguien que conoce tu pyme.",
  },
  {
    title: "Trazabilidad total",
    description:
      "Cada conversación, cotización y reserva queda registrada para que puedas revisar el historial cuando lo necesites.",
  },
];

const pasos = [
  {
    numero: "1",
    title: "Conectamos tu WhatsApp",
    description:
      "Vinculamos el chatbot a tu número de WhatsApp Business, sin que tengas que cambiar tu forma de trabajar.",
  },
  {
    numero: "2",
    title: "Configuramos tu negocio",
    description:
      "Cargamos tus servicios, precios, horarios y zonas de cobertura para que el chatbot responda con la info real de tu pyme.",
  },
  {
    numero: "3",
    title: "Empieza a agendar solo",
    description:
      "Desde ese momento, el chatbot atiende, cotiza y agenda citas automáticamente, y tú recibes el resumen de cada conversación.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-900">
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            Closer AI
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Probar el bot
            </Link>
            <a
              href="#contacto"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Hablar con ventas
            </a>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-6 py-20 text-center sm:py-28">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-emerald-600">
            Chatbot de IA para pymes
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Agenda citas por WhatsApp mientras tú atiendes tu negocio
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Closer AI responde, cotiza y agenda automáticamente en tu
            WhatsApp, 24 horas al día. Tu pyme nunca más pierde un cliente por
            no contestar a tiempo.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="w-full rounded-full bg-emerald-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-500 sm:w-auto"
            >
              Quiero probar este bot
            </Link>
            <a
              href="#como-funciona"
              className="w-full rounded-full border border-zinc-200 px-6 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto"
            >
              Ver cómo funciona
            </a>
          </div>
        </section>

        {/* Ventajas */}
        <section className="border-t border-zinc-100 bg-zinc-50 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              Todo lo que tu pyme ya no tiene que hacer a mano
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
              Diseñado para negocios donde cada conversación de WhatsApp es
              una venta potencial.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ventajas.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              Cómo funciona
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              {pasos.map((p) => (
                <div key={p.numero} className="text-center sm:text-left">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white sm:mx-0">
                    {p.numero}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section
          id="contacto"
          className="border-t border-zinc-100 bg-zinc-900 py-20 text-white"
        >
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Deja que tu WhatsApp trabaje solo
            </h2>
            <p className="mt-4 text-zinc-300">
              Cuéntanos de tu pyme y te mostramos cómo se vería Closer AI
              respondiendo a tus clientes.
            </p>
            <a
              href="https://wa.me/56900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-emerald-500 px-6 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-emerald-400"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Closer AI. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
