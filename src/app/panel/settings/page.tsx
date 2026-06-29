import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PanelShell from "../PanelShell";
import OrgAlertsForm from "./OrgAlertsForm";
import MfaSettings from "./MfaSettings";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/panel/login");
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, organizations(name, alert_whatsapp_number, alert_email)")
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect("/panel");
  }

  const org = membership.organizations as unknown as {
    name: string;
    alert_whatsapp_number: string | null;
    alert_email: string | null;
  } | null;

  return (
    <PanelShell orgName={org?.name} crumb="Alertas">
      <h2 className="text-lg font-semibold tracking-tight">
        Configuración de alertas
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        A dónde llegan los avisos cuando el sistema detecta un problema
        (sin horarios configurados, sin calendario, clientes sin respuesta).
      </p>
      <div className="mt-6 max-w-md">
        <OrgAlertsForm
          organizationId={membership.organization_id}
          alertWhatsappNumber={org?.alert_whatsapp_number ?? null}
          alertEmail={org?.alert_email ?? null}
        />
      </div>

      <h2 className="mt-12 text-lg font-semibold tracking-tight">
        Seguridad de tu cuenta
      </h2>
      <div className="mt-6 max-w-md">
        <MfaSettings />
      </div>
    </PanelShell>
  );
}
