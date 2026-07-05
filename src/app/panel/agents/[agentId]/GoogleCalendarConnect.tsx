"use client";

import { useEffect, useState } from "react";
import { disconnectGoogleCalendar } from "./actions";

type HealthStatus = "idle" | "checking" | "ok" | "error" | "not_configured";

function buildGoogleCalendarConnectUrl(
  agentId: string,
  organizationId: string,
  clientId: string,
) {
  const state = btoa(
    JSON.stringify({ agent_id: agentId, organization_id: organizationId }),
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: "https://n8n.aahumada.com/webhook/google-calendar-oauth-callback",
    response_type: "code",
    scope:
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export default function GoogleCalendarConnect({
  agentId,
  organizationId,
  connected,
  email,
  justConnected,
}: {
  agentId: string;
  organizationId: string;
  connected: boolean;
  email: string | null;
  justConnected: boolean;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
  const [disconnecting, setDisconnecting] = useState(false);
  const [status, setStatus] = useState("");
  const [health, setHealth] = useState<HealthStatus>("idle");

  useEffect(() => {
    if (!connected) return;
    checkHealth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, agentId]);

  async function checkHealth() {
    setHealth("checking");
    try {
      const res = await fetch(`/api/calendar-health?agentId=${agentId}`);
      const data = await res.json();
      if (data.error === "not_configured") {
        setHealth("not_configured");
      } else {
        setHealth(data.ok ? "ok" : "error");
      }
    } catch {
      setHealth("error");
    }
  }

  function handleConnect() {
    if (!clientId) return;
    window.location.href = buildGoogleCalendarConnectUrl(
      agentId,
      organizationId,
      clientId,
    );
  }

  async function handleReconnect() {
    if (!clientId) return;
    setDisconnecting(true);
    setStatus("");
    // Best-effort: revoke old token before starting fresh OAuth
    await disconnectGoogleCalendar(agentId, organizationId);
    // Proceed to OAuth regardless of disconnect result
    window.location.href = buildGoogleCalendarConnectUrl(
      agentId,
      organizationId,
      clientId,
    );
  }

  async function handleDisconnect() {
    const confirmed = window.confirm(
      "¿Desvincular este Google Calendar? El bot dejará de usarlo y volverá al calendario compartido.",
    );
    if (!confirmed) return;

    setDisconnecting(true);
    setStatus("");

    const result = await disconnectGoogleCalendar(agentId, organizationId);

    setDisconnecting(false);

    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }

    window.location.reload();
  }

  if (!clientId) {
    return (
      <p className="text-sm text-zinc-500">
        La conexión con Google Calendar todavía no está configurada en este
        sitio.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {justConnected && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Calendario conectado correctamente.
        </p>
      )}

      {status && <p className="text-sm text-red-600">{status}</p>}

      {connected ? (
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HealthBadge status={health} />
              <p className="text-sm font-medium text-zinc-900">
                {email ? email : "Conectado"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={checkHealth}
                disabled={health === "checking"}
                className="text-xs text-zinc-400 hover:text-zinc-600 disabled:opacity-40"
                title="Verificar estado"
              >
                {health === "checking" ? "Verificando..." : "Verificar"}
              </button>
              <button
                type="button"
                onClick={handleReconnect}
                disabled={disconnecting}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
              >
                {disconnecting ? "Preparando..." : "Reconectar"}
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {disconnecting ? "Desvinculando..." : "Desvincular"}
              </button>
            </div>
          </div>

          {health === "error" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              El token expiró o fue revocado — el bot no puede acceder al
              calendario.{" "}
              <button
                type="button"
                onClick={handleReconnect}
                className="font-semibold underline"
              >
                Reconectar ahora
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          className="w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Conectar tu Google Calendar
        </button>
      )}
    </div>
  );
}

function HealthBadge({ status }: { status: HealthStatus }) {
  if (status === "checking") {
    return (
      <span className="flex h-2 w-2 rounded-full bg-zinc-300 animate-pulse" />
    );
  }
  if (status === "ok") {
    return <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Conexión activa" />;
  }
  if (status === "error") {
    return <span className="flex h-2 w-2 rounded-full bg-red-500" title="Token expirado o revocado" />;
  }
  // idle or not_configured: neutral dot
  return <span className="flex h-2 w-2 rounded-full bg-zinc-200" />;
}
