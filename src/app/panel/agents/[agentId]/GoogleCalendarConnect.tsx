"use client";

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

  function handleConnect() {
    if (!clientId) return;
    window.location.href = buildGoogleCalendarConnectUrl(
      agentId,
      organizationId,
      clientId,
    );
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

      {connected ? (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-zinc-900">
              Conectado{email ? ` como ${email}` : ""}
            </p>
            <p className="text-xs text-zinc-500">
              El bot todavía no usa este calendario para agendar
              automáticamente (en construcción); por ahora sigue usando el
              calendario compartido.
            </p>
          </div>
          <button
            type="button"
            onClick={handleConnect}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Reconectar
          </button>
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
