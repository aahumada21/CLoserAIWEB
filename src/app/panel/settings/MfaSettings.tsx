"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EnrollData = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export default function MfaSettings() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [enroll, setEnroll] = useState<EnrollData | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refreshStatus() {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = data?.totp?.find((f) => f.status === "verified");
    setEnabled(Boolean(verified));
    setLoading(false);
  }

  useEffect(() => {
    refreshStatus();
  }, []);

  async function handleStartEnroll() {
    setError("");
    setBusy(true);

    const supabase = createClient();
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    });

    setBusy(false);

    if (enrollError || !data) {
      setError(enrollError?.message || "No se pudo iniciar la activación.");
      return;
    }

    setEnroll({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }

  async function handleConfirm() {
    if (!enroll) return;
    setError("");
    setBusy(true);

    const supabase = createClient();
    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId: enroll.factorId });

    if (challengeError || !challenge) {
      setBusy(false);
      setError("No se pudo verificar. Intenta de nuevo.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enroll.factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });

    setBusy(false);

    if (verifyError) {
      setError("Código incorrecto. Revisa la app autenticadora e intenta de nuevo.");
      return;
    }

    setEnroll(null);
    setCode("");
    await refreshStatus();
  }

  async function handleCancelEnroll() {
    if (!enroll) return;
    const supabase = createClient();
    await supabase.auth.mfa.unenroll({ factorId: enroll.factorId });
    setEnroll(null);
    setCode("");
    setError("");
  }

  async function handleDisable() {
    const confirmed = window.confirm(
      "¿Desactivar la verificación en dos pasos? Tu cuenta quedará protegida solo con contraseña.",
    );
    if (!confirmed) return;

    setBusy(true);
    setError("");

    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = data?.totp?.find((f) => f.status === "verified");

    if (verified) {
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId: verified.id,
      });
      if (unenrollError) {
        setBusy(false);
        setError("No se pudo desactivar. Intenta de nuevo.");
        return;
      }
    }

    setBusy(false);
    await refreshStatus();
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Cargando...</p>;
  }

  if (enabled) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
        <p className="text-sm font-medium text-zinc-900">
          Verificación en dos pasos activada
        </p>
        <button
          type="button"
          onClick={handleDisable}
          disabled={busy}
          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          Desactivar
        </button>
      </div>
    );
  }

  if (enroll) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-4">
        <p className="text-sm text-zinc-700">
          Escanea este código con Google Authenticator, Authy, o cualquier
          app de autenticación TOTP.
        </p>
        <div
          className="h-48 w-48 self-center"
          dangerouslySetInnerHTML={{ __html: enroll.qrCode }}
        />
        <p className="text-center text-xs text-zinc-500">
          ¿No puedes escanear? Ingresa este código manualmente:{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5">
            {enroll.secret}
          </code>
        </p>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Código de 6 dígitos
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            maxLength={6}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-center text-lg tracking-widest focus:border-emerald-500 focus:outline-none"
            placeholder="000000"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || code.length !== 6}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {busy ? "Verificando..." : "Confirmar y activar"}
          </button>
          <button
            type="button"
            onClick={handleCancelEnroll}
            className="rounded-full border border-zinc-200 px-5 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-zinc-600">
        Agrega un paso extra al inicio de sesión: además de tu contraseña,
        vas a necesitar un código de una app autenticadora (Google
        Authenticator, Authy, etc.).
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleStartEnroll}
        disabled={busy}
        className="w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        Activar verificación en dos pasos
      </button>
    </div>
  );
}
