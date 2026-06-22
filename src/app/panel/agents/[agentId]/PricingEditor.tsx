"use client";

import { useState } from "react";
import { savePricing } from "./actions";

const SERVICES = [
  { code: "lavado_basico", label: "Lavado básico" },
  { code: "lavado_premium", label: "Lavado premium" },
  { code: "encerado_full", label: "Encerado full" },
];

const VEHICLE_TYPES = [
  { code: "sedan", label: "Sedán" },
  { code: "suv", label: "SUV" },
  { code: "camioneta", label: "Camioneta" },
];

type PriceCell = { service_code: string; vehicle_type: string; base_price: number; is_active: boolean };
type Surcharge = { id: string; district_key: string; surcharge: number; is_active: boolean };

type PricingVersion = {
  id: string;
  name: string;
  is_active: boolean;
  valid_from: string;
  service_vehicle_prices: PriceCell[];
  district_surcharges: Surcharge[];
} | null;

function buildGrid(prices: PriceCell[]): Record<string, Record<string, number>> {
  const grid: Record<string, Record<string, number>> = {};
  for (const service of SERVICES) {
    grid[service.code] = {};
    for (const vehicle of VEHICLE_TYPES) {
      const match = prices.find(
        (p) => p.service_code === service.code && p.vehicle_type === vehicle.code,
      );
      grid[service.code][vehicle.code] = match?.base_price ?? 0;
    }
  }
  return grid;
}

export default function PricingEditor({
  agentId,
  pricingVersion,
}: {
  agentId: string;
  pricingVersion: PricingVersion;
}) {
  const [grid, setGrid] = useState(
    buildGrid(pricingVersion?.service_vehicle_prices ?? []),
  );
  const [surcharges, setSurcharges] = useState<
    { district_key: string; surcharge: number }[]
  >(
    (pricingVersion?.district_surcharges ?? []).map((s) => ({
      district_key: s.district_key,
      surcharge: s.surcharge,
    })),
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  function updatePrice(service: string, vehicle: string, value: number) {
    setGrid((prev) => ({
      ...prev,
      [service]: { ...prev[service], [vehicle]: value },
    }));
  }

  function updateSurcharge(index: number, field: "district_key" | "surcharge", value: string) {
    setSurcharges((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === "surcharge" ? Number(value) : value,
      };
      return next;
    });
  }

  function addSurcharge() {
    setSurcharges((prev) => [...prev, { district_key: "", surcharge: 0 }]);
  }

  function removeSurcharge(index: number) {
    setSurcharges((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setStatus("");

    const prices = SERVICES.flatMap((service) =>
      VEHICLE_TYPES.map((vehicle) => ({
        service_code: service.code,
        vehicle_type: vehicle.code,
        base_price: grid[service.code][vehicle.code],
      })),
    );

    const result = await savePricing(
      agentId,
      `Lista ${new Date().toISOString().slice(0, 10)}`,
      prices,
      surcharges.filter((s) => s.district_key.trim()),
    );

    setSaving(false);
    setStatus(result.error ? `Error: ${result.error}` : "Precios guardados.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-3 py-2 text-left font-medium text-zinc-600">
                Servicio
              </th>
              {VEHICLE_TYPES.map((v) => (
                <th key={v.code} className="px-3 py-2 text-left font-medium text-zinc-600">
                  {v.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((service) => (
              <tr key={service.code} className="border-b border-zinc-100">
                <td className="px-3 py-2 font-medium text-zinc-800">
                  {service.label}
                </td>
                {VEHICLE_TYPES.map((vehicle) => (
                  <td key={vehicle.code} className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={grid[service.code][vehicle.code]}
                      onChange={(e) =>
                        updatePrice(service.code, vehicle.code, Number(e.target.value))
                      }
                      className="w-28 rounded-lg border border-zinc-200 px-2 py-1 text-sm"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-700">
          Recargos por comuna
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {surcharges.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={s.district_key}
                onChange={(e) => updateSurcharge(i, "district_key", e.target.value)}
                placeholder="Comuna (ej. conchali)"
                className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                step={1000}
                value={s.surcharge}
                onChange={(e) => updateSurcharge(i, "surcharge", e.target.value)}
                className="w-32 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeSurcharge(i)}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50"
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSurcharge}
            className="w-fit rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            + Agregar comuna
          </button>
        </div>
      </div>

      {status && (
        <p className={status.startsWith("Error") ? "text-sm text-red-600" : "text-sm text-emerald-600"}>
          {status}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-fit rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar precios"}
      </button>
    </div>
  );
}
