"use client";

import { useState } from "react";
import { saveOrgAlerts } from "./actions";

export default function OrgAlertsForm({
  organizationId,
  alertWhatsappNumber,
  alertEmail,
}: {
  organizationId: string;
  alertWhatsappNumber: string | null;
  alertEmail: string | null;
}) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setStatus("");

    const result = await saveOrgAlerts(
      organizationId,
      String(formData.get("alertWhatsappNumber") || "").trim(),
      String(formData.get("alertEmail") || "").trim(),
    );

    setSaving(false);
    setStatus(result.error ? `Error: ${result.error}` : "Guardado.");
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          WhatsApp para alertas
        </label>
        <input
          name="alertWhatsappNumber"
          defaultValue={alertWhatsappNumber ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="56912345678"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Correo para alertas
        </label>
        <input
          name="alertEmail"
          type="email"
          defaultValue={alertEmail ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="tu@empresa.com"
        />
      </div>

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
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
