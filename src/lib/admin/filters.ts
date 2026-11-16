// Admin list filters (search, status, dates, page) read from and written back to the URL,
// so every filtered view can be bookmarked, refreshed and exported as shown.

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000; // IST has no daylight saving
const DAY_MS = 24 * 60 * 60 * 1000;

export const DATE_PRESETS = [
  { key: "", label: "All time" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 days" },
  { key: "month", label: "This month" },
] as const;

export const PAGE_SIZES = [25, 50, 100] as const;

export type ListFilters = {
  q: string;
  status: string;
  /** "", "today", "yesterday", "7d", "month" or "custom" */
  date: string;
  /** YYYY-MM-DD, IST, inclusive; only read when date is "custom" */
  from: string;
  to: string;
  page: number;
  size: number;
};

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : "");
const isDay = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export function parseFilters(params: Params, statuses: readonly string[] = []): ListFilters {
  let from = isDay(one(params.from)) ? one(params.from) : "";
  let to = isDay(one(params.to)) ? one(params.to) : "";
  if (from && to && from > to) [from, to] = [to, from];

  const raw = one(params.date);
  const date =
    raw === "custom" || (!raw && (from || to))
      ? from || to
        ? "custom"
        : ""
      : DATE_PRESETS.some((p) => p.key === raw)
        ? raw
        : "";

  const size = Number(one(params.size));
  const status = one(params.status).toLowerCase();
  return {
    q: one(params.q).slice(0, 100),
    status: statuses.includes(status) ? status : "",
    date,
    from: date === "custom" ? from : "",
    to: date === "custom" ? to : "",
    page: Math.max(1, Math.floor(Number(one(params.page))) || 1),
    size: (PAGE_SIZES as readonly number[]).includes(size) ? size : PAGE_SIZES[0],
  };
}

/** Query string for `f` with `changes` applied. Any change but the page resets to page 1. */
export function filtersQuery(f: ListFilters, changes: Partial<ListFilters> = {}): string {
  const next = { ...f, ...changes };
  if (!("page" in changes)) next.page = 1;
  const sp = new URLSearchParams();
  if (next.q) sp.set("q", next.q);
  if (next.status) sp.set("status", next.status);
  if (next.date) sp.set("date", next.date);
  if (next.date === "custom") {
    if (next.from) sp.set("from", next.from);
    if (next.to) sp.set("to", next.to);
  }
  if (next.size !== PAGE_SIZES[0]) sp.set("size", String(next.size));
  if (next.page > 1) sp.set("page", String(next.page));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function istDayStart(instant: number) {
  const ist = new Date(instant + IST_OFFSET_MS);
  return Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - IST_OFFSET_MS;
}

/** The createdAt window for the chosen dates (IST midnights), or undefined for all time. */
export function createdAtRange(f: Pick<ListFilters, "date" | "from" | "to">, now = Date.now()) {
  const today = istDayStart(now);
  switch (f.date) {
    case "today":
      return { gte: new Date(today), lt: new Date(today + DAY_MS) };
    case "yesterday":
      return { gte: new Date(today - DAY_MS), lt: new Date(today) };
    case "7d":
      return { gte: new Date(today - 6 * DAY_MS), lt: new Date(today + DAY_MS) };
    case "month": {
      const ist = new Date(now + IST_OFFSET_MS);
      const y = ist.getUTCFullYear();
      const m = ist.getUTCMonth();
      return { gte: new Date(Date.UTC(y, m, 1) - IST_OFFSET_MS), lt: new Date(Date.UTC(y, m + 1, 1) - IST_OFFSET_MS) };
    }
    case "custom": {
      const range: { gte?: Date; lt?: Date } = {};
      if (f.from) range.gte = new Date(Date.parse(`${f.from}T00:00:00Z`) - IST_OFFSET_MS);
      if (f.to) range.lt = new Date(Date.parse(`${f.to}T00:00:00Z`) - IST_OFFSET_MS + DAY_MS);
      return range.gte || range.lt ? range : undefined;
    }
    default:
      return undefined;
  }
}

export function describeDates(f: Pick<ListFilters, "date" | "from" | "to">): string {
  if (f.date === "custom") {
    if (f.from && f.to) return f.from === f.to ? f.from : `${f.from} to ${f.to}`;
    if (f.from) return `from ${f.from}`;
    if (f.to) return `up to ${f.to}`;
  }
  return DATE_PRESETS.find((p) => p.key === f.date)?.label ?? "All time";
}
