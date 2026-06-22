import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/panel/login");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <p className="text-sm font-semibold text-zinc-900">
            Crear nuevo agente
          </p>
          <Link
            href="/panel"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Volver al panel
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <p className="mb-6 text-sm text-zinc-600">
          Esto crea un agente nuevo con configuración de partida (horarios y
          precios genéricos de detailing) que después puedes ajustar desde el
          panel.
        </p>
        <OnboardingForm />
      </main>
    </div>
  );
}
