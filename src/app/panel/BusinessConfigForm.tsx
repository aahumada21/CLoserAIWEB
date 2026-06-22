"use client";

import { useState } from "react";
import { saveBusinessConfig } from "./actions";
import WeeklyScheduleCalendar from "./WeeklyScheduleCalendar";

type ScheduleBlock = {
  days: number[];
  start_time: string;
  end_time: string;
  slot_interval_minutes: number;
};

type Service = {
  key: string;
  name: string;
  description: string;
  includes: string[];
  duration_minutes: number;
};

export type BusinessConfig = {
  business_name?: string;
  calendar_id?: string;
  coverage?: { districts: string[] };
  schedule?: ScheduleBlock[];
  booking_policy?: { max_slots_default?: number };
  messages?: {
    handoff?: string;
    no_slots?: string;
    ask_service?: string;
    ask_district?: string;
    ask_vehicle_type?: string;
  };
  services?: Service[];
};

const DEFAULT_SERVICES: Service[] = [
  {
    key: "lavado_basico",
    name: "Lavado básico",
    description: "",
    includes: [],
    duration_minutes: 60,
  },
  {
    key: "lavado_premium",
    name: "Lavado premium",
    description: "",
    includes: [],
    duration_minutes: 120,
  },
  {
    key: "encerado_full",
    name: "Encerado full",
    description: "",
    includes: [],
    duration_minutes: 180,
  },
];

const DAYS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

function withDefaults(config: BusinessConfig | null): BusinessConfig {
  return {
    business_name: config?.business_name ?? "",
    calendar_id: config?.calendar_id ?? "",
    coverage: { districts: config?.coverage?.districts ?? [] },
    schedule: config?.schedule ?? [],
    booking_policy: {
      max_slots_default: config?.booking_policy?.max_slots_default ?? 3,
    },
    messages: {
      handoff: config?.messages?.handoff ?? "",
      no_slots: config?.messages?.no_slots ?? "",
      ask_service: config?.messages?.ask_service ?? "",
      ask_district: config?.messages?.ask_district ?? "",
      ask_vehicle_type: config?.messages?.ask_vehicle_type ?? "",
    },
    services:
      config?.services && config.services.length > 0
        ? config.services
        : DEFAULT_SERVICES,
  };
}

export default function BusinessConfigForm({
  agentId,
  organizationId,
  initialConfig,
  currentVersion,
}: {
  agentId: string;
  organizationId: string;
  initialConfig: BusinessConfig | null;
  currentVersion: number;
}) {
  const [config, setConfig] = useState<BusinessConfig>(
    withDefaults(initialConfig),
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>("");

  function updateField<K extends keyof BusinessConfig>(
    key: K,
    value: BusinessConfig[K],
  ) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function updateDistrict(index: number, value: string) {
    const districts = [...(config.coverage?.districts ?? [])];
    districts[index] = value;
    updateField("coverage", { districts });
  }

  function addDistrict() {
    updateField("coverage", {
      districts: [...(config.coverage?.districts ?? []), ""],
    });
  }

  function removeDistrict(index: number) {
    const districts = (config.coverage?.districts ?? []).filter(
      (_, i) => i !== index,
    );
    updateField("coverage", { districts });
  }

  function updateScheduleBlock(index: number, block: Partial<ScheduleBlock>) {
    const schedule = [...(config.schedule ?? [])];
    schedule[index] = { ...schedule[index], ...block };
    updateField("schedule", schedule);
  }

  function toggleScheduleDay(index: number, day: number) {
    const block = (config.schedule ?? [])[index];
    const days = block.days.includes(day)
      ? block.days.filter((d) => d !== day)
      : [...block.days, day];
    updateScheduleBlock(index, { days });
  }

  function addScheduleBlock() {
    updateField("schedule", [
      ...(config.schedule ?? []),
      { days: [], start_time: "09:00", end_time: "18:00", slot_interval_minutes: 60 },
    ]);
  }

  function removeScheduleBlock(index: number) {
    updateField(
      "schedule",
      (config.schedule ?? []).filter((_, i) => i !== index),
    );
  }

  function updateService(index: number, service: Partial<Service>) {
    const services = [...(config.services ?? [])];
    services[index] = { ...services[index], ...service };
    updateField("services", services);
  }

  function updateServiceIncludes(index: number, raw: string) {
    updateService(index, {
      includes: raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
  }

  function updateMessage(
    field: keyof NonNullable<BusinessConfig["messages"]>,
    value: string,
  ) {
    updateField("messages", { ...config.messages, [field]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("");

    const result = await saveBusinessConfig(agentId, organizationId, config);

    setSaving(false);
    if (result.error) {
      setStatus(`Error al guardar: ${result.error}`);
    } else {
      setStatus(`Guardado como versión ${result.version}.`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <p className="text-sm text-zinc-500">
        Versión activa actual: {currentVersion || "ninguna todavía"}
      </p>

      {/* Datos generales */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight">
          Datos del negocio
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Nombre comercial
            </label>
            <input
              value={config.business_name}
              onChange={(e) => updateField("business_name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Calendar ID (Google Calendar)
            </label>
            <input
              value={config.calendar_id}
              onChange={(e) => updateField("calendar_id", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Máximo de horarios a ofrecer por turno
            </label>
            <input
              type="number"
              min={1}
              value={config.booking_policy?.max_slots_default}
              onChange={(e) =>
                updateField("booking_policy", {
                  max_slots_default: Number(e.target.value),
                })
              }
              className="mt-1 w-32 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Cobertura */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight">
          Cobertura (comunas)
        </h2>
        <div className="mt-4 flex flex-col gap-2">
          {(config.coverage?.districts ?? []).map((district, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={district}
                onChange={(e) => updateDistrict(i, e.target.value)}
                className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="Ej. Providencia"
              />
              <button
                type="button"
                onClick={() => removeDistrict(i)}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50"
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDistrict}
            className="mt-1 w-fit rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            + Agregar comuna
          </button>
        </div>
      </section>

      {/* Horarios */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight">
          Horarios de atención
        </h2>

        <div className="mt-4">
          <WeeklyScheduleCalendar schedule={config.schedule ?? []} />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {(config.schedule ?? []).map((block, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 p-4"
            >
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleScheduleDay(i, day.value)}
                    className={
                      block.days.includes(day.value)
                        ? "rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white"
                        : "rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600"
                    }
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500">
                    Desde
                  </label>
                  <input
                    type="time"
                    value={block.start_time}
                    onChange={(e) =>
                      updateScheduleBlock(i, { start_time: e.target.value })
                    }
                    className="mt-1 rounded-lg border border-zinc-200 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500">
                    Hasta
                  </label>
                  <input
                    type="time"
                    value={block.end_time}
                    onChange={(e) =>
                      updateScheduleBlock(i, { end_time: e.target.value })
                    }
                    className="mt-1 rounded-lg border border-zinc-200 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500">
                    Intervalo (min)
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={block.slot_interval_minutes}
                    onChange={(e) =>
                      updateScheduleBlock(i, {
                        slot_interval_minutes: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-24 rounded-lg border border-zinc-200 px-2 py-1 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeScheduleBlock(i)}
                  className="ml-auto rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50"
                >
                  Quitar bloque
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addScheduleBlock}
            className="w-fit rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            + Agregar bloque de horario
          </button>
        </div>
      </section>

      {/* Servicios */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight">Servicios</h2>
        <div className="mt-4 flex flex-col gap-6">
          {(config.services ?? []).map((service, i) => (
            <div key={service.key} className="rounded-xl border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-800">
                {service.name || service.key}
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500">
                    Nombre visible
                  </label>
                  <input
                    value={service.name}
                    onChange={(e) =>
                      updateService(i, { name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500">
                    Descripción
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      updateService(i, { description: e.target.value })
                    }
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500">
                    Incluye (una línea por ítem)
                  </label>
                  <textarea
                    value={service.includes.join("\n")}
                    onChange={(e) =>
                      updateServiceIncludes(i, e.target.value)
                    }
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={service.duration_minutes}
                    onChange={(e) =>
                      updateService(i, {
                        duration_minutes: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-32 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mensajes */}
      <section>
        <h2 className="text-lg font-semibold tracking-tight">
          Mensajes del bot
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {(
            [
              ["ask_service", "Al preguntar qué servicio quiere"],
              ["ask_district", "Al preguntar la comuna"],
              ["ask_vehicle_type", "Al preguntar el tipo de vehículo"],
              ["no_slots", "Cuando no hay horarios disponibles"],
              ["handoff", "Al derivar a una persona"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-zinc-700">
                {label}
              </label>
              <textarea
                value={config.messages?.[field] ?? ""}
                onChange={(e) => updateMessage(field, e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      {status && (
        <p
          className={
            status.startsWith("Error")
              ? "text-sm text-red-600"
              : "text-sm text-emerald-600"
          }
        >
          {status}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar configuración"}
      </button>
    </form>
  );
}
