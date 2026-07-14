"use client";

import { useState } from "react";
import { saveFlowCredentials } from "./actions";

export default function FlowCredentialsForm({
  organizationId,
  flowApiKey,
  secretConfigured,
}: {
  organizationId: string;
  flowApiKey: string | null;
  secretConfigured: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [secretTouched, setSecretTouched] = useState(false);
  const [secretValue, setSecretValue] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setStatus("");

    const data = new FormData(e.currentTarget);
    const apiKey = String(data.get("flowApiKey") || "").trim();

    // Solo enviar el secret si el usuario lo tocó
    const secretToSend = secretTouched ? secretValue.trim() : null;

    const result = await saveFlowCredentials(organizationId, apiKey, secretToSend);

    setSaving(false);
    setStatus(result.error ? `Error: ${result.error}` : "Credenciales guardadas.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          API Key
        </label>
        <input
          name="flowApiKey"
          defaultValue={flowApiKey ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="fk_live_..."
          autoComplete="off"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Secret Key
        </label>
        <input
          type="password"
          value={secretValue}
          onChange={(e) => {
            setSecretTouched(true);
            setSecretValue(e.target.value);
          }}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm focus:border-emerald-500 focus:outline-none"
          placeholder={secretConfigured ? "••••••••  (configurado)" : "sk_live_..."}
          autoComplete="new-password"
        />
        {secretConfigured && !secretTouched && (
          <p className="mt-1 text-xs text-zinc-400">
            Deja en blanco para mantener el secret actual.
          </p>
        )}
      </div>

      <p className="text-xs text-zinc-400">
        Obtén tus credenciales en{" "}
        <a
          href="https://www.flow.cl/app/web/login.php"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:underline"
        >
          flow.cl
        </a>{" "}
        → Configuración → API. Si no configuras credenciales propias, se usarán
        las predeterminadas del sistema.
      </p>

      {status && (
        <p className={status.startsWith("Error") ? "text-sm text-red-600" : "text-sm text-emerald-600"}>
          {status}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar credenciales"}
      </button>
    </form>
  );
}
