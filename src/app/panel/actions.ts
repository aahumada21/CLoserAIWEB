"use server";

import { createClient } from "@/lib/supabase/server";
import type { BusinessConfig } from "./BusinessConfigForm";

export async function saveBusinessConfig(
  agentId: string,
  organizationId: string,
  config: BusinessConfig,
) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  const { data: current } = await supabase
    .from("agent_business_config")
    .select("version")
    .eq("agent_id", agentId)
    .eq("is_active", true)
    .maybeSingle();

  const nextVersion = (current?.version ?? 0) + 1;

  const { error: deactivateError } = await supabase
    .from("agent_business_config")
    .update({ is_active: false })
    .eq("agent_id", agentId)
    .eq("is_active", true);

  if (deactivateError) {
    return { error: deactivateError.message };
  }

  const { error: insertError } = await supabase
    .from("agent_business_config")
    .insert({
      organization_id: organizationId,
      agent_id: agentId,
      config,
      version: nextVersion,
      is_active: true,
    });

  if (insertError) {
    return { error: insertError.message };
  }

  return { ok: true, version: nextVersion };
}
