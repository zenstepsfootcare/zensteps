import React from "react";
import { LuCalendarDays, LuSearch } from "react-icons/lu";
import { DATE_PRESETS, PAGE_SIZES, filtersQuery, type ListFilters } from "@/lib/admin/filters";
import { Segmented } from "@/components/admin/AdminUI";

/** Date presets + custom range, status tabs with counts, and search, all kept in the URL. */
export function LeadFilters({
  base,
  filters,
  statuses,
  counts,
  searchPlaceholder,
}: {
  base: string;
  filters: ListFilters;
  statuses: readonly { value: string; label: string }[];
  counts: Record<string, number>;
  searchPlaceholder: string;
}) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const keep = (omit: (keyof ListFilters)[]) => (
    <>
      {!omit.includes("q") && filters.q && <input type="hidden" name="q" value={filters.q} />}
      {!omit.includes("status") && filters.status && <input type="hidden" name="status" value={filters.status} />}
      {!omit.includes("date") && filters.date && filters.date !== "custom" && <input type="hidden" name="date" value={filters.date} />}
      {!omit.includes("date") && filters.date === "custom" && (
        <>
          <input type="hidden" name="date" value="custom" />
          {filters.from && <input type="hidden" name="from" value={filters.from} />}
          {filters.to && <input type="hidden" name="to" value={filters.to} />}
        </>
      )}
      {filters.size !== PAGE_SIZES[0] && <input type="hidden" name="size" value={filters.size} />}
    </>
  );

  return (
    <section aria-label="Filters" className="bo-card space-y-4 p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <LuCalendarDays className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <Segmented
            label="Date received"
            items={DATE_PRESETS.map((p) => ({
              key: p.key || "all",
              label: p.label,
              href: `${base}${filtersQuery(filters, { date: p.key, from: "", to: "" })}`,
              active: filters.date === p.key,
            }))}
          />
        </div>

        <form method="get" action={base} className="flex flex-wrap items-end gap-2">
          {keep(["date"])}
          <input type="hidden" name="date" value="custom" />
          <label className="text-xs font-medium text-muted">
            From
            <input name="from" type="date" defaultValue={filters.from} className="bo-field mt-1 h-9 w-40" />
          </label>
          <label className="text-xs font-medium text-muted">
            To
            <input name="to" type="date" defaultValue={filters.to} className="bo-field mt-1 h-9 w-40" />
          </label>
          <button type="submit" className={`bo-btn bo-btn-sm h-9 ${filters.date === "custom" ? "bo-btn-primary" : "bo-btn-outline"}`}>
            {filters.date === "custom" ? "Update range" : "Custom range"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 lg:flex-row lg:items-center lg:justify-between">
        <Segmented
          label="Status"
          items={[
            { key: "all", label: "All", count: total, href: `${base}${filtersQuery(filters, { status: "" })}`, active: !filters.status },
            ...statuses.map((s) => ({
              key: s.value,
              label: s.label,
              count: counts[s.value] ?? 0,
              href: `${base}${filtersQuery(filters, { status: s.value })}`,
              active: filters.status === s.value,
            })),
          ]}
        />

        <form method="get" action={base} className="flex w-full gap-2 lg:max-w-sm">
          {keep(["q"])}
          <div className="relative min-w-0 flex-1">
            <label htmlFor="lead-search" className="sr-only">
              Search
            </label>
            <LuSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="lead-search"
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder={searchPlaceholder}
              spellCheck={false}
              autoComplete="off"
              className="bo-field pl-9"
            />
          </div>
          <button type="submit" className="bo-btn bo-btn-outline">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
