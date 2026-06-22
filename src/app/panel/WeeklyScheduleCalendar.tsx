type ScheduleBlock = {
  days: number[];
  start_time: string;
  end_time: string;
  slot_interval_minutes: number;
};

const DAY_COLUMNS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

const ROW_HEIGHT_PX = 32;

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

export default function WeeklyScheduleCalendar({
  schedule,
}: {
  schedule: ScheduleBlock[];
}) {
  const validBlocks = schedule.filter((b) => b.days.length > 0);

  let startHour = 8;
  let endHour = 20;

  if (validBlocks.length > 0) {
    const starts = validBlocks.map((b) => toMinutes(b.start_time));
    const ends = validBlocks.map((b) => toMinutes(b.end_time));
    startHour = Math.floor(Math.min(...starts) / 60);
    endHour = Math.ceil(Math.max(...ends) / 60);
  }

  const hours = Array.from(
    { length: Math.max(endHour - startHour, 1) },
    (_, i) => startHour + i,
  );
  const gridStartMinutes = startHour * 60;
  const totalHeight = hours.length * ROW_HEIGHT_PX;

  if (validBlocks.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Agrega un bloque de horario para ver la vista semanal.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <div className="grid min-w-[560px] grid-cols-[48px_repeat(7,1fr)]">
        <div />
        {DAY_COLUMNS.map((day) => (
          <div
            key={day.value}
            className="border-l border-zinc-200 py-2 text-center text-xs font-medium text-zinc-500"
          >
            {day.label}
          </div>
        ))}

        <div className="relative" style={{ height: totalHeight }}>
          {hours.map((hour, i) => (
            <div
              key={hour}
              className="absolute right-1 -translate-y-1/2 text-[11px] text-zinc-400"
              style={{ top: i * ROW_HEIGHT_PX }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {DAY_COLUMNS.map((day) => (
          <div
            key={day.value}
            className="relative border-l border-zinc-200"
            style={{ height: totalHeight }}
          >
            {hours.map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-zinc-100"
                style={{ top: i * ROW_HEIGHT_PX }}
              />
            ))}

            {validBlocks
              .filter((block) => block.days.includes(day.value))
              .map((block, i) => {
                const top =
                  ((toMinutes(block.start_time) - gridStartMinutes) / 60) *
                  ROW_HEIGHT_PX;
                const height =
                  ((toMinutes(block.end_time) - toMinutes(block.start_time)) /
                    60) *
                  ROW_HEIGHT_PX;
                return (
                  <div
                    key={i}
                    className="absolute left-0.5 right-0.5 rounded-md bg-emerald-100 px-1 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-300"
                    style={{ top, height: Math.max(height, 14) }}
                  >
                    {block.start_time}–{block.end_time}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
