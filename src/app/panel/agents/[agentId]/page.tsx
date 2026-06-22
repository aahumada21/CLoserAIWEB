import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PanelShell from "../../PanelShell";
import BusinessConfigForm, {
  type BusinessConfig,
} from "../../BusinessConfigForm";
import PricingEditor from "./PricingEditor";
import StaffManager from "./StaffManager";
import ChannelsManager from "./ChannelsManager";

export default async function AgentPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/panel/login");
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect("/panel");
  }

  const { data: agent } = await supabase
    .from("agents")
    .select("id, name")
    .eq("id", agentId)
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (!agent) {
    notFound();
  }

  const [
    { data: businessConfig },
    { data: staff },
    { data: pricingVersion },
    { data: channels },
  ] = await Promise.all([
    supabase
      .from("agent_business_config")
      .select("config, version")
      .eq("agent_id", agentId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("agent_staff")
      .select("id, name, calendar_id, schedule, services, is_active, display_order")
      .eq("agent_id", agentId)
      .order("display_order", { ascending: true }),
    supabase
      .from("pricing_versions")
      .select(
        "id, name, is_active, valid_from, service_vehicle_prices(id, service_code, vehicle_type, base_price, is_active), district_surcharges(id, district_key, surcharge, is_active)",
      )
      .eq("agent_id", agentId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("agent_channels")
      .select(
        "id, channel, provider, external_channel_id, display_name, is_active",
      )
      .eq("agent_id", agentId)
      .order("created_at", { ascending: true }),
  ]);

  const orgName =
    (membership.organizations as unknown as { name: string } | null)?.name ??
    "tu negocio";

  return (
    <PanelShell orgName={orgName} crumb={`Agente: ${agent.name}`}>
      <div className="flex flex-col gap-12">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Configuración comercial
          </h2>
          <div className="mt-4">
            <BusinessConfigForm
              agentId={agent.id}
              organizationId={membership.organization_id}
              initialConfig={(businessConfig?.config as BusinessConfig) ?? null}
              currentVersion={businessConfig?.version ?? 0}
              staff={staff ?? []}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">Precios</h2>
          <div className="mt-4">
            <PricingEditor
              agentId={agent.id}
              pricingVersion={pricingVersion}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Personas / calendarios
          </h2>
          <div className="mt-4">
            <StaffManager agentId={agent.id} staff={staff ?? []} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">Canales</h2>
          <div className="mt-4">
            <ChannelsManager
              agentId={agent.id}
              organizationId={membership.organization_id}
              channels={channels ?? []}
            />
          </div>
        </section>
      </div>
    </PanelShell>
  );
}
