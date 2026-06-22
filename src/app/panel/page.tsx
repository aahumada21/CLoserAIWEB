import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PanelShell from "./PanelShell";

type HealthAlert = {
  id: string;
  agent_id?: string;
  severity?: string;
  message?: string;
  title?: string;
  description?: string;
  alert_type?: string;
  is_resolved?: boolean;
  resolved_at?: string | null;
  created_at?: string;
};

export default async function PanelPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/panel/login");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) {
    return (
      <PanelShell>
        <p className="text-sm text-red-600">
          Tu usuario no está vinculado a ninguna organización todavía.
          Pídele a un administrador que te agregue.
        </p>
      </PanelShell>
    );
  }

  const orgName =
    (membership.organizations as unknown as { name: string } | null)?.name ??
    "tu negocio";

  const { data: agents } = await supabase
    .from("agents")
    .select("id, name, is_active")
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: true });

  const agentIds = (agents ?? []).map((a) => a.id);

  const { data: alerts } = agentIds.length
    ? await supabase.from("health_alerts").select("*").in("agent_id", agentIds)
    : { data: [] as HealthAlert[] };

  const openAlerts = (alerts ?? []).filter(
    (a: HealthAlert) => !a.is_resolved && !a.resolved_at,
  );

  if (!agents || agents.length === 0) {
    return (
      <PanelShell orgName={orgName}>
        <p className="text-sm text-zinc-600">
          Todavía no tienes ningún agente configurado.
        </p>
        <Link
          href="/panel/onboarding"
          className="mt-4 inline-block rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Crear mi primer agente
        </Link>
      </PanelShell>
    );
  }

  return (
    <PanelShell orgName={orgName}>
      <div className="flex flex-col gap-10">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Alertas de salud
          </h2>
          {openAlerts.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">
              Sin alertas abiertas. Todo en orden.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {openAlerts.map((alert: HealthAlert) => {
                const isCritical = alert.severity === "critical";
                const text =
                  alert.message ||
                  alert.title ||
                  alert.description ||
                  alert.alert_type ||
                  "Alerta sin descripción";
                return (
                  <li
                    key={alert.id}
                    className={
                      isCritical
                        ? "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                        : "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    }
                  >
                    {text}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Tus agentes
            </h2>
            <Link
              href="/panel/onboarding"
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              + Crear agente
            </Link>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {agents.map((agent) => (
              <li key={agent.id}>
                <Link
                  href={`/panel/agents/${agent.id}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:border-emerald-300"
                >
                  <span className="text-sm font-medium text-zinc-900">
                    {agent.name}
                  </span>
                  <span
                    className={
                      agent.is_active
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                        : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500"
                    }
                  >
                    {agent.is_active ? "Activo" : "Inactivo"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PanelShell>
  );
}
