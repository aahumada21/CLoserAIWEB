"use server";

import { createClient } from "@/lib/supabase/server";

type ChannelInput = {
  channel: string;
  provider: string;
  external_channel_id: string;
  display_name?: string;
};

export async function createAgent(input: {
  agentName: string;
  businessName?: string;
  calendarId?: string;
  districts?: string[];
  channel?: ChannelInput;
}) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false as const, error: "not_authenticated" };
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return { ok: false as const, error: "no_organization" };
  }

  const token = process.env.ONBOARDING_API_TOKEN;
  const url = process.env.N8N_ONBOARDING_URL;

  if (!token || !url) {
    return { ok: false as const, error: "onboarding_not_configured" };
  }

  const hasChannel =
    input.channel?.channel &&
    input.channel?.provider &&
    input.channel?.external_channel_id;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Onboarding-Token": token,
    },
    body: JSON.stringify({
      user_id: userData.user.id,
      organization_id: membership.organization_id,
      agent_name: input.agentName,
      business_name: input.businessName || undefined,
      calendar_id: input.calendarId || undefined,
      districts: input.districts?.length ? input.districts : undefined,
      channel: hasChannel ? input.channel : undefined,
    }),
  });

  if (!response.ok) {
    return { ok: false as const, error: "upstream_error" };
  }

  const data = await response.json();

  if (!data.ok) {
    return {
      ok: false as const,
      error: data.error || "creation_failed",
      message: data.message,
    };
  }

  return { ok: true as const, agentId: data.agent_id as string };
}
