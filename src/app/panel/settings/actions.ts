"use server";

import { createClient } from "@/lib/supabase/server";

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
