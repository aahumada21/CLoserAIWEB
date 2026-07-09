import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Condiciones del Servicio — Closer AI",
  description: "Condiciones de uso del sitio y el chatbot de Closer AI.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-900">
      <header className="border-b border-zinc-100">
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

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">
          Condiciones del Servicio
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Última actualización: {new Date().toLocaleDateString("es-CL")}
        </p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              1. Aceptación de estas condiciones
            </h2>
            <p className="mt-2">
              Al usar el sitio <strong>vendea.cl</strong>, probar
              la demostración del chatbot, o contratar Closer AI para tu
              negocio, aceptas estas condiciones. Si no estás de acuerdo, no
              uses el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              2. Qué es Closer AI
            </h2>
            <p className="mt-2">
              Closer AI es un servicio de chatbot con inteligencia
              artificial que ayuda a pequeñas y medianas empresas a
              responder, cotizar y agendar citas con sus clientes a través
              de WhatsApp y otros canales de chat.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              3. La demostración del chatbot
            </h2>
            <p className="mt-2">
              La sección de demo (<strong>/demo</strong>) muestra cómo
              funciona el chatbot, en algunos casos conectada a un agente
              real configurado para un negocio específico. La información
              que entregas en esa demo (nombre, correo, teléfono y mensajes)
              puede ser usada para hacerte seguimiento comercial, conforme a
              nuestra{" "}
              <Link href="/privacidad" className="text-emerald-700 underline">
                Política de Privacidad
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              4. Uso aceptable
            </h2>
            <p className="mt-2">Al usar el servicio, te comprometes a no:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Usar el chatbot o el sitio para fines ilegales, fraudulentos
                o que dañen a terceros.
              </li>
              <li>
                Intentar interferir, sobrecargar o vulnerar la seguridad del
                sitio o del servicio.
              </li>
              <li>
                Enviar información falsa con la intención de hacerte pasar
                por otra persona o empresa.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              5. Naturaleza del servicio basado en IA
            </h2>
            <p className="mt-2">
              Las respuestas del chatbot son generadas por un modelo de
              inteligencia artificial y pueden contener errores o
              imprecisiones. Closer AI no garantiza que las respuestas sean
              siempre exactas, completas o adecuadas para cada situación.
              Las cotizaciones, horarios y confirmaciones entregadas por el
              chatbot deben validarse con el negocio correspondiente cuando
              exista cualquier duda.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              6. Disponibilidad del servicio
            </h2>
            <p className="mt-2">
              Hacemos esfuerzos razonables para mantener el sitio y el
              chatbot disponibles, pero no garantizamos un funcionamiento
              ininterrumpido o libre de errores. El servicio puede
              suspenderse temporalmente por mantenimiento o causas fuera de
              nuestro control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              7. Límite de responsabilidad
            </h2>
            <p className="mt-2">
              En la máxima medida permitida por la ley, Closer AI no será
              responsable por daños indirectos, pérdida de ingresos, o
              perjuicios derivados del uso o la imposibilidad de uso del
              sitio, la demo o el chatbot.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              8. Cambios a estas condiciones
            </h2>
            <p className="mt-2">
              Podemos actualizar estas condiciones ocasionalmente. El uso
              continuado del servicio después de un cambio implica la
              aceptación de las nuevas condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              9. Contacto
            </h2>
            <p className="mt-2">
              Si tienes preguntas sobre estas condiciones, escríbenos a{" "}
              <a
                href="mailto:contacto@aahumada.com"
                className="text-emerald-700 underline"
              >
                contacto@aahumada.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Closer AI. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
