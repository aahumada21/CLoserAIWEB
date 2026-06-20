import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BusinessConfigForm, { type BusinessConfig } from "./BusinessConfigForm";
import LogoutButton from "./LogoutButton";

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

  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("id, name")
    .eq("organization_id", membership.organization_id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (agentError || !agent) {
    return (
      <PanelShell>
        <p className="text-sm text-red-600">
          No encontramos un agente activo para tu organización.
        </p>
      </PanelShell>
    );
  }

  const { data: businessConfig } = await supabase
    .from("agent_business_config")
    .select("config, version")
    .eq("agent_id", agent.id)
    .eq("is_active", true)
    .maybeSingle();

  const orgName =
    (membership.organizations as unknown as { name: string } | null)?.name ??
    "tu negocio";

  return (
    <PanelShell orgName={orgName} agentName={agent.name}>
      <BusinessConfigForm
        agentId={agent.id}
        organizationId={membership.organization_id}
        initialConfig={(businessConfig?.config as BusinessConfig) ?? null}
        currentVersion={businessConfig?.version ?? 0}
      />
    </PanelShell>
  );
}

function PanelShell({
  orgName,
  agentName,
  children,
}: {
  orgName?: string;
  agentName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              {orgName ?? "Panel"}
            </p>
            {agentName && (
              <p className="text-xs text-zinc-500">Agente: {agentName}</p>
            )}
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
