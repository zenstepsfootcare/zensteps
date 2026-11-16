// Every timestamp here belongs to an Indian business, so the zone is pinned rather than
// left to the server clock (which is UTC on most hosts).
const IST = "Asia/Kolkata";

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: IST });
const dateOnly = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: IST });
const csvDateTime = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: IST,
});

/** e.g. "14 Nov 2026, 1:27 pm" */
export const formatDateTime = (d: Date) => dateTime.format(d);
/** e.g. "14 Nov 2026" */
export const formatDate = (d: Date) => dateOnly.format(d);
/** "2026-11-14 13:27"- sorts as text in a spreadsheet. */
export const formatDateTimeCsv = (d: Date) => csvDateTime.format(d).replace(", ", " ");
/** "2026-11-14" in IST, for file names. */
export const istDateStamp = (d: Date = new Date()) => csvDateTime.format(d).slice(0, 10);

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** A value starting with = + - @ runs as a formula in Excel/Sheets; keep it text. */
export function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n]/.test(safe) || safe !== value ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** A UTF-8 CSV download (the BOM makes Excel read ₹ and – correctly). */
export function csvResponse(filename: string, header: string[], rows: string[][]) {
  const body = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
  return new Response("﻿" + body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}-${istDateStamp()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
