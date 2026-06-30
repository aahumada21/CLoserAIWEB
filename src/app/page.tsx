import Link from "next/link";

const ventajas = [
  {
    title: "Agenda citas 24/7 por WhatsApp",
    description:
      "El chatbot recibe el mensaje del cliente, entiende qué servicio quiere y agenda la hora disponible directo en tu Google Calendar — sin que tú hagas nada.",
  },
  {
    title: "Captura los datos del lead",
    description:
      "Cada cliente que escribe queda registrado con su nombre, teléfono y correo, aunque no confirme una cita. No vuelves a perder un contacto.",
  },
  {
    title: "Recordatorios automáticos",
    description:
      "El bot avisa al cliente un día antes de su hora para reducir las inasistencias. Sin que tengas que acordarte de enviar nada.",
  },
  {
    title: "Conectado a tu Google Calendar",
    description:
      "Consulta la disponibilidad real de tu calendario antes de ofrecer horarios y crea el evento automáticamente cuando el cliente confirma.",
  },
  {
    title: "Deriva a un humano cuando hace falta",
    description:
      "Si la conversación se complica o el cliente lo pide, el chatbot transfiere la conversación a tu equipo sin perder el hilo.",
  },
  {
    title: "Historial de todas las reservas",
    description:
      "Desde el panel puedes ver el historial de conversaciones, citas agendadas y leads capturados, todo en un solo lugar.",
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

const faq = [
  {
    q: "¿Necesito tener un número de WhatsApp Business ya?",
    a: "Sí, necesitas una cuenta de WhatsApp Business activa. Si todavía no la tienes, te ayudamos a crearla antes de conectar el chatbot.",
  },
  {
    q: "¿El bot puede adaptarse a cualquier tipo de negocio?",
    a: "Actualmente Closer AI está optimizado para negocios de servicios que trabajan con citas y agendamiento: detailing de autos, peluquerías, centros de estética, clínicas, talleres y rubros similares. Si tu negocio vende citas, Closer AI puede ayudarte.",
  },
  {
    q: "¿Cuánto tiempo tarda la configuración inicial?",
    a: "Entre 1 y 3 días hábiles desde que nos pasas la información de tu negocio (servicios, precios, horarios, comunas que cubres y acceso a tu Google Calendar). No hay nada que instalar ni que aprender.",
  },
  {
    q: "¿Qué pasa si el cliente hace una pregunta que el bot no sabe responder?",
    a: "El bot reconoce cuándo no tiene información suficiente y transfiere la conversación a un integrante de tu equipo, sin que el cliente pierda el hilo de lo que había hablado.",
  },
  {
    q: "¿Puedo revisar las conversaciones que tiene el bot con mis clientes?",
    a: "Sí. Desde el panel de administración puedes ver el historial de todas las conversaciones, cotizaciones y reservas.",
  },
  {
    q: "¿El bot funciona solo en WhatsApp?",
    a: "WhatsApp es el canal principal. También puedes integrarlo en tu sitio web como chat en vivo. Otros canales (Instagram, Facebook Messenger) están en el roadmap.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Un número de WhatsApp Business, tu Google Calendar de trabajo y 30 minutos para contarnos cómo opera tu negocio. El resto lo hacemos nosotros.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-900">
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Closer AI
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/precios"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Precios
            </Link>
            <Link
              href="/panel/login"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Login
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Probar el bot
            </Link>
            <Link
              href="/contacto"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Hablar con ventas
            </Link>
          </nav>
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
              Probar el bot gratis
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

        {/* FAQ */}
        <section className="border-t border-zinc-100 bg-zinc-50 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              Preguntas frecuentes
            </h2>
            <div className="mt-10 flex flex-col gap-6">
              {faq.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-zinc-100 bg-white p-6"
                >
                  <h3 className="text-base font-semibold">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-zinc-500">
              ¿Tienes otra pregunta?{" "}
              <Link
                href="/contacto"
                className="font-medium text-emerald-700 hover:underline"
              >
                Escríbenos
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-zinc-100 bg-zinc-900 py-20 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Deja que tu WhatsApp trabaje solo
            </h2>
            <p className="mt-4 text-zinc-300">
              Cuéntanos de tu pyme y en menos de 72 horas tienes el chatbot
              funcionando con tus servicios y precios reales.
            </p>
            <p className="mt-2 text-sm text-emerald-400">
              🎁 Primer mes gratis en todos los planes. Sin tarjeta de crédito.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contacto"
                className="rounded-full bg-emerald-500 px-6 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-emerald-400"
              >
                Hablar con ventas
              </Link>
              <Link
                href="/precios"
                className="rounded-full border border-zinc-600 px-6 py-3 text-base font-medium text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
              >
                Ver planes y precios
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        <p>
          © {new Date().getFullYear()} Closer AI. Todos los derechos
          reservados.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Link href="/precios" className="hover:text-zinc-700 hover:underline">
            Precios
          </Link>
          <Link href="/contacto" className="hover:text-zinc-700 hover:underline">
            Contacto
          </Link>
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
