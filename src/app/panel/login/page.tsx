"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState("");

  useEffect(() => {
    async function checkPendingMfa() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2") {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totpFactor = factors?.totp?.[0];
        if (totpFactor) {
          setFactorId(totpFactor.id);
          setStep("mfa");
        }
      }
    }
    checkPendingMfa();
  }, []);

  async function handleCredentials(formData: FormData) {
    setError("");
    setLoading(true);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Correo o contraseña incorrectos.");
      return;
    }

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2") {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (!totpFactor) {
        setLoading(false);
        setError("No se encontró el método de verificación. Contacta al administrador.");
        return;
      }

      setFactorId(totpFactor.id);
      setStep("mfa");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/panel");
    router.refresh();
  }

  async function handleMfaCode(formData: FormData) {
    setError("");
    setLoading(true);

    const code = String(formData.get("code") || "").trim();
    const supabase = createClient();

    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      setLoading(false);
      setError("No se pudo iniciar la verificación. Intenta de nuevo.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });

    setLoading(false);

    if (verifyError) {
      setError("Código incorrecto. Intenta de nuevo.");
      return;
    }

    router.push("/panel");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Vendea" width={56} height={56} priority />
        </div>
        <h1 className="mt-4 text-center text-xl font-semibold tracking-tight">
          Vendea
        </h1>

        {step === "credentials" ? (
          <>
            <p className="mt-1 text-center text-sm text-zinc-600">
              Inicia sesión para configurar tu agente.
            </p>
            <form
              action={handleCredentials}
              className="mt-6 flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Correo
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="tu@empresa.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-1 text-center text-sm text-zinc-600">
              Ingresa el código de 6 dígitos de tu app de autenticación
              (Google Authenticator, Authy, etc.).
            </p>
            <form action={handleMfaCode} className="mt-6 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Código de verificación
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoFocus
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-center text-lg tracking-widest focus:border-emerald-500 focus:outline-none"
                  placeholder="000000"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
