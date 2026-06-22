"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAgent } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  not_authenticated: "Tu sesión expiró, vuelve a iniciar sesión.",
  no_organization: "Tu usuario no está vinculado a ninguna organización.",
  onboarding_not_configured:
    "El servicio de creación de agentes no está configurado todavía.",
  upstream_error: "No se pudo conectar con el servidor. Intenta de nuevo.",
  forbidden: "No tienes permiso para crear un agente en esta organización.",
  creation_failed: "Ocurrió un error al crear el agente.",
  missing_user_id: "Falta información del usuario.",
  missing_organization_id: "Falta información de la organización.",
  missing_agent_name: "Ingresa un nombre para el agente.",
  invalid_onboarding_token: "Error de configuración interna.",
};

export default function OnboardingForm() {
  const router = useRouter();
  const [includeChannel, setIncludeChannel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setError("");

    const agentName = String(formData.get("agentName") || "").trim();
    if (!agentName) {
      setError("Ingresa un nombre para el agente.");
      setSaving(false);
      return;
    }

    const districtsRaw = String(formData.get("districts") || "");
    const districts = districtsRaw
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const channel = includeChannel
      ? {
          channel: String(formData.get("channelType") || ""),
          provider: String(formData.get("provider") || ""),
          external_channel_id: String(
            formData.get("externalChannelId") || "",
          ),
          display_name: String(formData.get("channelDisplayName") || ""),
        }
      : undefined;

    const result = await createAgent({
      agentName,
      businessName: String(formData.get("businessName") || "").trim(),
      calendarId: String(formData.get("calendarId") || "").trim(),
      districts,
      channel,
    });

    setSaving(false);

    if (!result.ok) {
      setError(
        ("message" in result && result.message) ||
          ERROR_MESSAGES[result.error] ||
          "Ocurrió un error inesperado.",
      );
      return;
    }

    router.push(`/panel/agents/${result.agentId}`);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Nombre del agente *
          </label>
          <input
            name="agentName"
            required
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Ej. Detailing Providencia"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Nombre comercial (opcional)
          </label>
          <input
            name="businessName"
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Si es distinto al nombre del agente"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Calendar ID de Google Calendar (opcional)
          </label>
          <input
            name="calendarId"
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="ej. tunegocio@group.calendar.google.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Comunas que cubres (opcional, separadas por coma)
          </label>
          <input
            name="districts"
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            placeholder="Providencia, Las Condes, Ñuñoa"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            checked={includeChannel}
            onChange={(e) => setIncludeChannel(e.target.checked)}
          />
          Ya tengo el canal (WhatsApp o webchat) para vincular ahora
        </label>

        {includeChannel && (
          <div className="mt-3 flex flex-col gap-3 rounded-xl border border-zinc-200 p-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500">
                Tipo de canal
              </label>
              <select
                name="channelType"
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="webchat">Webchat</option>
                <option value="n8n_chat">n8n_chat (pruebas)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500">
                Provider
              </label>
              <input
                name="provider"
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                placeholder="ej. meta_whatsapp_cloud_api o webchat_widget"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500">
                External channel ID
              </label>
              <input
                name="externalChannelId"
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                placeholder="phone_number_id de Meta o widget_id"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500">
                Nombre visible del canal (opcional)
              </label>
              <input
                name="channelDisplayName"
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
      >
        {saving ? "Creando..." : "Crear agente"}
      </button>
    </form>
  );
}
