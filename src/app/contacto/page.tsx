import type { Metadata } from "next";
import Link from "next/link";
import ContactoForm from "./ContactoForm";

export const metadata: Metadata = {
  title: "Contacto — Closer AI",
  description:
    "Cuéntanos de tu negocio y te mostramos cómo Closer AI puede ayudarte a automatizar la atención por WhatsApp.",
};

export default function ContactoPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-900">
      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Closer AI
          </Link>
          <Link
            href="/demo"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Probar el bot
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Hablemos de tu negocio
            </h1>
            <p className="mt-4 text-zinc-600">
              Cuéntanos qué tipo de negocio tienes y qué quieres mejorar. Te
              respondemos en menos de 24 horas y, si tiene sentido, agendamos
              una demo personalizada.
            </p>

            <div className="mt-8 flex flex-col gap-4 text-sm">
              <div>
                <p className="font-medium text-zinc-900">WhatsApp directo</p>
                <a
                  href="https://wa.me/56930977617"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-emerald-700 hover:underline"
                >
                  +56 9 3097 7617
                </a>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Correo</p>
                <a
                  href="mailto:contacto@aahumada.com"
                  className="mt-1 block text-emerald-700 hover:underline"
                >
                  contacto@aahumada.com
                </a>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-800">
                ¿Prefieres probar antes de hablar?
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Llena el formulario de la demo y prueba el chatbot en acción
                ahora mismo.
              </p>
              <Link
                href="/demo"
                className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
              >
                Ir a la demo →
              </Link>
            </div>
          </div>

          <div>
            <ContactoForm />
          </div>
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
