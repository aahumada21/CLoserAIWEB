"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveFlowCredentials(
  organizationId: string,
  flowApiKey: string,
  flowSecretKey: string | null,
) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = {
    flow_api_key: flowApiKey || null,
  };

  // null = no tocar el secret existente; string (incluso "") = actualizar
  if (flowSecretKey !== null) {
    updates.flow_secret_key = flowSecretKey || null;
  }

  const { error } = await supabase
    .from("organizations")
    .update(updates)
    .eq("id", organizationId);

  if (error) return { error: error.message };
  return { ok: true };
}

export async function saveOrgAlerts(
  organizationId: string,
  alertWhatsappNumber: string,
  alertEmail: string,
) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  const { error } = await supabase
    .from("organizations")
    .update({
      alert_whatsapp_number: alertWhatsappNumber || null,
      alert_email: alertEmail || null,
    })
    .eq("id", organizationId);

  if (error) return { error: error.message };
  return { ok: true };
}
