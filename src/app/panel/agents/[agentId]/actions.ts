"use server";

import { createClient } from "@/lib/supabase/server";

type PriceRow = {
  service_code: string;
  vehicle_type: string;
  base_price: number;
};

type SurchargeRow = {
  district_key: string;
  surcharge: number;
};

export async function savePricing(
  agentId: string,
  versionName: string,
  prices: PriceRow[],
  surcharges: SurchargeRow[],
) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  const { error: deactivateError } = await supabase
    .from("pricing_versions")
    .update({ is_active: false })
    .eq("agent_id", agentId)
    .eq("is_active", true);

  if (deactivateError) {
    return { error: deactivateError.message };
  }

  const { data: newVersion, error: insertVersionError } = await supabase
    .from("pricing_versions")
    .insert({
      agent_id: agentId,
      name: versionName,
      is_active: true,
      valid_from: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertVersionError || !newVersion) {
    return { error: insertVersionError?.message || "No se pudo crear la versión." };
  }

  if (prices.length > 0) {
    const { error: pricesError } = await supabase
      .from("service_vehicle_prices")
      .insert(
        prices.map((p) => ({
          pricing_version_id: newVersion.id,
          service_code: p.service_code,
          vehicle_type: p.vehicle_type,
          base_price: p.base_price,
          is_active: true,
        })),
      );
    if (pricesError) {
      return { error: pricesError.message };
    }
  }

  if (surcharges.length > 0) {
    const { error: surchargesError } = await supabase
      .from("district_surcharges")
      .insert(
        surcharges.map((s) => ({
          pricing_version_id: newVersion.id,
          district_key: s.district_key,
          surcharge: s.surcharge,
          is_active: true,
        })),
      );
    if (surchargesError) {
      return { error: surchargesError.message };
    }
  }

  return { ok: true, pricingVersionId: newVersion.id as string };
}

export async function saveStaffMember(
  agentId: string,
  staff: {
    id?: string;
    name: string;
    calendar_id: string;
    services: string[];
    display_order: number;
  },
) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  if (staff.id) {
    const { error } = await supabase
      .from("agent_staff")
      .update({
        name: staff.name,
        calendar_id: staff.calendar_id,
        services: staff.services,
        display_order: staff.display_order,
      })
      .eq("id", staff.id)
      .eq("agent_id", agentId);

    if (error) return { error: error.message };
    return { ok: true };
  }

  const { error } = await supabase.from("agent_staff").insert({
    agent_id: agentId,
    name: staff.name,
    calendar_id: staff.calendar_id,
    services: staff.services,
    display_order: staff.display_order,
    is_active: true,
  });

  if (error) return { error: error.message };
  return { ok: true };
}

export async function setStaffActive(staffId: string, isActive: boolean) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  const { error } = await supabase
    .from("agent_staff")
    .update({ is_active: isActive })
    .eq("id", staffId);

  if (error) return { error: error.message };
  return { ok: true };
}

export async function createWebchatChannel(
  agentId: string,
  organizationId: string,
  widgetId: string,
  displayName: string,
) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  const { error } = await supabase.from("agent_channels").insert({
    organization_id: organizationId,
    agent_id: agentId,
    channel: "webchat",
    provider: "webchat_widget",
    external_channel_id: widgetId,
    display_name: displayName || widgetId,
    is_active: true,
    config: {
      environment: "production",
      inbound_enabled: true,
      outbound_enabled: true,
      display_name: displayName || widgetId,
      default_language: "es-CL",
      rate_limit: { messages_per_minute: 60 },
      fallback_policy: { on_error: "handoff_or_retry" },
    },
  });

  if (error) return { error: error.message };
  return { ok: true };
}

export async function setChannelActive(channelId: string, isActive: boolean) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  const { error } = await supabase
    .from("agent_channels")
    .update({ is_active: isActive })
    .eq("id", channelId);

  if (error) return { error: error.message };
  return { ok: true };
}

export async function disconnectGoogleCalendar(
  agentId: string,
  organizationId: string,
) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "No autenticado." };
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (!membership) {
    return { error: "No tienes permiso sobre esta organización." };
  }

  const token = process.env.DISCONNECT_GOOGLE_CALENDAR_TOKEN;
  const url = process.env.N8N_DISCONNECT_GOOGLE_CALENDAR_URL;

  if (!token || !url) {
    return { error: "La desvinculación no está configurada todavía." };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Disconnect-Token": token,
    },
    body: JSON.stringify({ agent_id: agentId, organization_id: organizationId }),
  });

  if (!response.ok) {
    return { error: "No se pudo conectar con el servidor." };
  }

  const data = await response.json();

  if (!data.ok) {
    const messages: Record<string, string> = {
      agent_not_found: "No se encontró el agente.",
      no_connection: "Este agente no tiene ningún calendario conectado.",
      invalid_disconnect_token: "Error de configuración interna.",
      revoke_failed:
        "Google no pudo revocar el acceso. Intenta de nuevo más tarde.",
    };
    return { error: data.message || messages[data.error] || "Ocurrió un error." };
  }

  return { ok: true };
}
