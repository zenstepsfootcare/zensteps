import React from "react";
import Link from "next/link";
import { LuArrowLeft, LuChevronLeft, LuChevronRight, LuCircleCheck, LuCircleAlert } from "react-icons/lu";
import { PAGE_SIZES } from "@/lib/admin/filters";
import type { Tone } from "@/lib/admin/statuses";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand">
          <LuArrowLeft className="size-4" aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">{title}</h1>
          {description && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-secondary">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Notice({ tone = "success", children }: { tone?: "success" | "error"; children: React.ReactNode }) {
  const Icon = tone === "success" ? LuCircleCheck : LuCircleAlert;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
        tone === "success" ? "border-brand/20 bg-brand/5 text-brand" : "border-red-200 bg-red-50 text-red-800"
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

const TONES: Record<Tone, { box: string; dot: string }> = {
  new: { box: "border-sky-200 bg-sky-50", dot: "bg-sky-500" },
  progress: { box: "border-amber-200 bg-amber-50", dot: "bg-amber-500" },
  good: { box: "border-emerald-200 bg-emerald-50", dot: "bg-emerald-600" },
  muted: { box: "border-border bg-paper", dot: "bg-muted" },
  bad: { box: "border-red-200 bg-red-50", dot: "bg-red-500" },
};

/** Colour plus a text label, so status is never told by colour alone. */
export function StatusBadge({
  value,
  list,
}: {
  value: string;
  list: readonly { value: string; label: string; tone: Tone }[];
}) {
  const s = list.find((x) => x.value === value) ?? list[0];
  const t = TONES[s.tone];
  return (
    <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold text-ink", t.box)}>
      <span className={cx("size-1.5 rounded-full", t.dot)} aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function VisibilityBadge({ live, liveLabel = "Live", hiddenLabel = "Hidden" }: { live: boolean; liveLabel?: string; hiddenLabel?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        live ? "border-emerald-200 bg-emerald-50 text-ink" : "border-border bg-paper text-muted"
      )}
    >
      <span className={cx("size-1.5 rounded-full", live ? "bg-emerald-600" : "bg-muted/60")} aria-hidden="true" />
      {live ? liveLabel : hiddenLabel}
    </span>
  );
}

/** A row of link "tabs" with counts, e.g. All 12 · New 3 · Contacted 5. */
export function Segmented({
  label,
  items,
}: {
  label: string;
  items: { key: string; label: string; count?: number; href: string; active: boolean }[];
}) {
  return (
    <div role="group" aria-label={label} className="bo-scroll flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={item.active ? "true" : undefined}
          className={cx(
            "inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors",
            item.active ? "bg-brand text-white" : "text-secondary hover:bg-paper hover:text-ink"
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span
              className={cx(
                "rounded-full px-2 py-0.5 text-xs tabular-nums",
                item.active ? "bg-white/15 text-white" : "bg-paper text-secondary"
              )}
            >
              {item.count}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

/** "Showing 26–50 of 132", page numbers and rows-per-page, all plain links. */
export function Pagination({
  page,
  pages,
  total,
  size,
  hrefFor,
  hrefForSize,
  className,
}: {
  page: number;
  pages: number;
  total: number;
  size: number;
  hrefFor: (page: number) => string;
  /** Omit to hide the rows-per-page choice. */
  hrefForSize?: (size: number) => string;
  className?: string;
}) {
  const first = total === 0 ? 0 : (page - 1) * size + 1;
  const last = Math.min(page * size, total);
  const item = "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2.5 text-sm font-medium tabular-nums transition-colors";
  const idle = "border-border bg-white hover:bg-paper";
  const off = "pointer-events-none border-border bg-white opacity-40";

  return (
    <nav aria-label="Pagination" className={cx("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <p className="text-sm text-muted">
        Showing <span className="font-medium text-ink tabular-nums">{first}</span>–
        <span className="font-medium text-ink tabular-nums">{last}</span> of{" "}
        <span className="font-medium text-ink tabular-nums">{total}</span>
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {pages > 1 && (
          <ul className="flex flex-wrap items-center gap-1">
            <li>
              {page > 1 ? (
                <Link href={hrefFor(page - 1)} className={cx(item, idle)} aria-label="Previous page">
                  <LuChevronLeft className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <span className={cx(item, off)} aria-hidden="true">
                  <LuChevronLeft className="size-4" />
                </span>
              )}
            </li>
            {pageList(page, pages).map((n, i) => (
              <li key={n === "…" ? `gap-${i}` : n}>
                {n === "…" ? (
                  <span className="px-1 text-sm text-muted" aria-hidden="true">
                    …
                  </span>
                ) : (
                  <Link
                    href={hrefFor(n)}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={`Page ${n}`}
                    className={cx(item, n === page ? "border-brand bg-brand text-white" : idle)}
                  >
                    {n}
                  </Link>
                )}
              </li>
            ))}
            <li>
              {page < pages ? (
                <Link href={hrefFor(page + 1)} className={cx(item, idle)} aria-label="Next page">
                  <LuChevronRight className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <span className={cx(item, off)} aria-hidden="true">
                  <LuChevronRight className="size-4" />
                </span>
              )}
            </li>
          </ul>
        )}
        {hrefForSize && (
          <div className="flex items-center gap-1 text-sm text-muted">
            <span className="mr-1">Rows</span>
            {PAGE_SIZES.map((s) => (
              <Link
                key={s}
                href={hrefForSize(s)}
                aria-current={s === size ? "true" : undefined}
                className={cx(item, s === size ? "border-brand bg-brand text-white" : idle)}
              >
                {s}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

/** 1 … 4 5 6 … 12: first, last and the neighbours of the current page. */
export function pageList(page: number, pages: number): (number | "…")[] {
  const wanted = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const n of wanted) {
    if (n - prev === 2) out.push(prev + 1);
    else if (n - prev > 2) out.push("…");
    out.push(n);
    prev = n;
  }
  return out;
}

/** Header cell class shared by every admin table. */
export const th = "h-11 px-4 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap text-muted";
export const td = "px-4 py-3.5 align-top text-sm";
