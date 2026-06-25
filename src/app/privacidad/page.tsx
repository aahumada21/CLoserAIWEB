import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — Closer AI",
  description: "Cómo Closer AI recopila, usa y protege tus datos.",
};

export default function PrivacyPolicyPage() {
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
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Última actualización: {new Date().toLocaleDateString("es-CL")}
        </p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-7 text-zinc-700">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              1. Quiénes somos
            </h2>
            <p className="mt-2">
              Closer AI ofrece un chatbot de inteligencia artificial para
              que pequeñas y medianas empresas atiendan, coticen y agenden
              citas con sus clientes a través de WhatsApp y otros canales de
              chat. Esta política explica qué información recopilamos a
              través de nuestro sitio web (<strong>closer.aahumada.com</strong>)
              y de la demostración del chatbot, y cómo la usamos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              2. Qué datos recopilamos
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Datos que nos entregas directamente:</strong> nombre,
                correo electrónico y número de contacto, cuando completas el
                formulario para probar la demo del chatbot, o cuando nos
                escribes por WhatsApp.
              </li>
              <li>
                <strong>Contenido de las conversaciones:</strong> los
                mensajes que envías al chatbot (en la demo o en una
                implementación real para un negocio) se procesan para
                generar respuestas y pueden quedar registrados para fines de
                soporte, mejora del servicio y auditoría.
              </li>
              <li>
                <strong>Datos técnicos básicos:</strong> información estándar
                de uso del sitio (por ejemplo, qué página visitaste) que
                pueda registrar nuestro proveedor de hosting o analítica.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              3. Para qué usamos tus datos
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Responder tus mensajes y darte seguimiento comercial.</li>
              <li>
                Mostrarte una demostración funcional del chatbot cuando la
                solicitas.
              </li>
              <li>
                Operar el servicio para los negocios que contratan Closer AI
                (agendamiento, cotizaciones, recordatorios).
              </li>
              <li>Mejorar la calidad de las respuestas del chatbot.</li>
            </ul>
            <p className="mt-2">
              No vendemos tus datos personales a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              4. Con quién compartimos información
            </h2>
            <p className="mt-2">
              Usamos proveedores externos para operar el servicio, que
              procesan datos en nuestro nombre bajo sus propias políticas de
              seguridad:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Meta / WhatsApp Business Platform</strong>, para el
                envío y recepción de mensajes de WhatsApp.
              </li>
              <li>
                <strong>Supabase</strong>, como base de datos para almacenar
                la información de cuentas, conversaciones y configuración.
              </li>
              <li>
                Proveedores de infraestructura y hosting necesarios para
                mantener el sitio y el chatbot en funcionamiento.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              5. Cuánto tiempo conservamos tus datos
            </h2>
            <p className="mt-2">
              Conservamos tus datos mientras exista una relación comercial
              activa o mientras sea necesario para los fines descritos en
              esta política. Si nos contactas solo para probar la demo y no
              avanzas en una relación comercial, puedes solicitarnos en
              cualquier momento que eliminemos tus datos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              6. Tus derechos
            </h2>
            <p className="mt-2">
              Puedes solicitarnos acceder, corregir o eliminar tus datos
              personales en cualquier momento, escribiéndonos a{" "}
              <a
                href="mailto:contacto@aahumada.com"
                className="text-emerald-700 underline"
              >
                contacto@aahumada.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              7. Cambios a esta política
            </h2>
            <p className="mt-2">
              Podemos actualizar esta política ocasionalmente. Si los
              cambios son relevantes, lo indicaremos en esta misma página.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              8. Contacto
            </h2>
            <p className="mt-2">
              Si tienes preguntas sobre esta política o sobre tus datos,
              escríbenos a{" "}
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
