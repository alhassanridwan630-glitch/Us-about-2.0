const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Emits UTC times, so the event lands at the right moment in every timezone. */
export function makeIcs(o: { title: string; start: Date; hours?: number; location?: string; description?: string }) {
  const end = new Date(o.start.getTime() + (o.hours ?? 2) * 36e5);
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//US&ABOUT//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${utc(o.start)}-${Math.random().toString(36).slice(2)}@usandabout`, `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(o.start)}`, `DTEND:${utc(end)}`, `SUMMARY:${esc(o.title)}`,
    ...(o.location ? [`LOCATION:${esc(o.location)}`] : []), ...(o.description ? [`DESCRIPTION:${esc(o.description)}`] : []),
    "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}
export function downloadFile(name: string, text: string, type: string) {
  const u = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
