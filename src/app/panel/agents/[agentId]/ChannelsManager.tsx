"use client";

import { useState } from "react";
import { createWebchatChannel, setChannelActive } from "./actions";

type Channel = {
  id: string;
  channel: string;
  provider: string;
  external_channel_id: string;
  display_name: string | null;
  is_active: boolean;
};

export default function ChannelsManager({
  agentId,
  organizationId,
  channels,
}: {
  agentId: string;
  organizationId: string;
  channels: Channel[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setStatus("");

    const widgetId = String(formData.get("widgetId") || "").trim();
    const displayName = String(formData.get("displayName") || "").trim();

    if (!widgetId) {
      setStatus("Error: ingresa un identificador de widget.");
      setSaving(false);
      return;
    }

    const result = await createWebchatChannel(
      agentId,
      organizationId,
      widgetId,
      displayName,
    );

    setSaving(false);

    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }

    setShowForm(false);
    window.location.reload();
  }

  async function handleToggle(channel: Channel) {
    await setChannelActive(channel.id, !channel.is_active);
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {channels.map((channel) => (
          <li
            key={channel.id}
            className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-900">
                {channel.display_name || channel.external_channel_id}
              </p>
              <p className="text-xs text-zinc-500">
                {channel.channel} · {channel.provider} ·{" "}
                {channel.external_channel_id}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={
                  channel.is_active
                    ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                    : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500"
                }
              >
                {channel.is_active ? "Activo" : "Inactivo"}
              </span>
              {channel.channel === "webchat" && (
                <button
                  type="button"
                  onClick={() => handleToggle(channel)}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  {channel.is_active ? "Desactivar" : "Activar"}
                </button>
              )}
            </div>
          </li>
        ))}
        {channels.length === 0 && (
          <p className="text-sm text-zinc-500">
            Este agente todavía no tiene ningún canal conectado.
          </p>
        )}
      </ul>

      <p className="text-xs text-zinc-500">
        Para WhatsApp Business, la conexión requiere verificación de negocio
        en Meta y no está disponible todavía desde aquí. Puedes agregar un
        canal de webchat propio:
      </p>

      {showForm ? (
        <form
          action={handleSubmit}
          className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Widget ID
            </label>
            <input
              name="widgetId"
              required
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              placeholder="ej. mi-sitio-web"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Nombre visible (opcional)
            </label>
            <input
              name="displayName"
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            />
          </div>

          {status && (
            <p className={status.startsWith("Error") ? "text-sm text-red-600" : "text-sm text-emerald-600"}>
              {status}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving ? "Creando..." : "Crear canal webchat"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-fit rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          + Agregar canal webchat
        </button>
      )}
    </div>
  );
}
