import Link from "next/link";

const ventajas = [
  {
    title: "Tu WhatsApp responde solo, aunque estés trabajando",
    description:
      "Cuando estás con un cliente y te llegan mensajes, el bot los responde por ti. Agenda la hora, informa los precios y confirma la cita — sin que tú toques el teléfono.",
  },
  {
    title: "Nunca más pierdas un cliente por no responder a tiempo",
    description:
      "Si alguien te escribe a las 11pm o un domingo, el bot responde igual. No importa si estás ocupado, durmiendo o en vacaciones.",
  },
  {
    title: "Menos clientes que no aparecen",
    description:
      "El bot le manda un recordatorio automático al cliente el día antes de su hora. Si no puede ir, cancela o cambia la hora solo, sin que tengas que llamar a nadie.",
  },
  {
    title: "Sin doble agenda ni errores de hora",
    description:
      "El bot revisa tu calendario antes de ofrecer horarios, así que solo ofrece las horas que realmente tienes libres. Imposible reservar dos clientes al mismo tiempo.",
  },
  {
    title: "Todos tus clientes guardados automáticamente",
    description:
      "Cada persona que te escribe queda registrada con su nombre y contacto, aunque no confirme una cita. Así puedes retomar la conversación cuando quieras.",
  },
  {
    title: "Cuando el bot no puede, te pasa la conversación",
    description:
      "Si el cliente pregunta algo fuera de lo común o quiere hablar con una persona, el bot te transfiere el chat al tiro, con todo el contexto de la conversación.",
  },
];

const pasos = [
  {
    numero: "1",
    title: "Nos cuentas cómo funciona tu negocio",
    description:
      "Tus servicios, tus precios, tus horarios de atención. Nosotros configuramos todo — tú no tienes que instalar nada ni aprender a usar ningún sistema nuevo.",
  },
  {
    numero: "2",
    title: "Conectamos tu WhatsApp y tu calendario",
    description:
      "El chatbot queda vinculado a tu número de WhatsApp y a tu Google Calendar. En menos de 72 horas ya está respondiendo a tus clientes.",
  },
  {
    numero: "3",
    title: "Tu negocio empieza a agendar solo",
    description:
      "Desde ese momento, el bot atiende, agenda y recuerda las citas por ti. Tú solo ves llegar las reservas confirmadas y te dedicas a lo que sabes hacer.",
  },
];

const faq = [
  {
    q: "¿Para qué tipo de negocio sirve?",
    a: "Para cualquier negocio que trabaje con horas y citas: barberías, salones de belleza, clínicas, talleres mecánicos, detailing de autos, centros de estética, y rubros similares. Si tus clientes te escriben por WhatsApp para pedir hora, esto es para ti.",
  },
  {
    q: "¿Necesito saber de tecnología para usarlo?",
    a: "Para nada. Nosotros configuramos todo. Tú solo nos cuentas cómo funciona tu negocio — servicios, precios y horarios — y nosotros dejamos el bot listo. No hay nada que instalar ni que aprender.",
  },
  {
    q: "¿Cuánto tiempo tarda en estar funcionando?",
    a: "Entre 1 y 3 días hábiles. Desde que nos mandas la información de tu negocio, en menos de 72 horas el bot ya está respondiendo a tus clientes.",
  },
  {
    q: "¿Qué pasa si el cliente pregunta algo que el bot no sabe responder?",
    a: "El bot se da cuenta cuando no puede resolver algo y te pasa la conversación directamente a ti o a tu equipo, con todo el historial de lo que hablaron. El cliente nunca queda sin respuesta.",
  },
  {
    q: "¿Puedo ver lo que conversa el bot con mis clientes?",
    a: "Sí, tienes un panel donde ves todas las conversaciones, las citas agendadas y los clientes que escribieron. Desde el computador o el teléfono.",
  },
  {
    q: "¿El primer mes realmente es gratis?",
    a: "Sí, completamente gratis. No te pedimos tarjeta de crédito para empezar. Tienes un mes completo para probarlo con tus clientes reales y ver si te sirve. Si no quedas conforme, no pagas nada.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, sin letra chica ni contratos de permanencia. Si en algún momento decides que no lo necesitas, nos avisas y listo.",
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
            Chatbot de IA para pymes de servicios
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Tu WhatsApp agenda citas solo, las 24 horas
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Para barberías, salones de belleza, talleres y cualquier negocio
            que trabaje con horas. El bot responde, agenda y recuerda las
            citas por ti — sin que tengas que estar pendiente del teléfono.
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
              Lo que cambia en tu negocio desde el día uno
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
              Diseñado para negocios de servicios donde cada mensaje de
              WhatsApp es una cita potencial que no puedes perder.
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
