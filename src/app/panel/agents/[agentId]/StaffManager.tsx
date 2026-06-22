"use client";

import { useState } from "react";
import { saveStaffMember, setStaffActive } from "./actions";

const SERVICE_OPTIONS = [
  { code: "lavado_basico", label: "Lavado básico" },
  { code: "lavado_premium", label: "Lavado premium" },
  { code: "encerado_full", label: "Encerado full" },
];

type Staff = {
  id: string;
  name: string;
  calendar_id: string | null;
  services: string[] | null;
  is_active: boolean;
  display_order: number;
};

export default function StaffManager({
  agentId,
  staff,
}: {
  agentId: string;
  staff: Staff[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setStatus("");

    const name = String(formData.get("name") || "").trim();
    const calendarId = String(formData.get("calendarId") || "").trim();
    const services = formData.getAll("services").map(String);

    if (!name) {
      setStatus("Error: ingresa un nombre.");
      setSaving(false);
      return;
    }

    const result = await saveStaffMember(agentId, {
      id: editing?.id,
      name,
      calendar_id: calendarId,
      services,
      display_order: editing?.display_order ?? staff.length,
    });

    setSaving(false);

    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }

    setShowForm(false);
    setEditing(null);
    window.location.reload();
  }

  async function handleToggleActive(person: Staff) {
    await setStaffActive(person.id, !person.is_active);
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-4">
      {staff.length === 0 && !showForm && (
        <p className="text-sm text-zinc-500">
          No hay personas registradas. Si el negocio tiene un solo operador,
          no es necesario agregar nada aquí.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {staff.map((person) => (
          <li
            key={person.id}
            className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-900">
                {person.name}
              </p>
              <p className="text-xs text-zinc-500">
                {person.services && person.services.length > 0
                  ? person.services.join(", ")
                  : "Atiende todos los servicios"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditing(person);
                  setShowForm(true);
                }}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(person)}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                {person.is_active ? "Desactivar" : "Activar"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showForm ? (
        <form
          action={handleSubmit}
          className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Nombre
            </label>
            <input
              name="name"
              defaultValue={editing?.name ?? ""}
              required
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Calendar ID
            </label>
            <input
              name="calendarId"
              defaultValue={editing?.calendar_id ?? ""}
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              placeholder="persona@group.calendar.google.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Servicios que atiende (vacío = todos)
            </label>
            <div className="mt-1 flex flex-wrap gap-3">
              {SERVICE_OPTIONS.map((s) => (
                <label key={s.code} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    name="services"
                    value={s.code}
                    defaultChecked={editing?.services?.includes(s.code)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          {status && (
            <p className={status.startsWith("Error") ? "text-sm text-red-600" : "text-sm text-emerald-600"}>
              {status}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-fit rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          + Agregar persona
        </button>
      )}
    </div>
  );
}
