"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import {
  LuCalendarCheck,
  LuCircleHelp,
  LuFileText,
  LuFootprints,
  LuHandshake,
  LuImages,
  LuInbox,
  LuLayoutDashboard,
  LuLayoutTemplate,
  LuMapPin,
  LuMegaphone,
  LuNewspaper,
  LuRadar,
  LuSearch,
  LuSettings,
  LuSlidersHorizontal,
  LuSparkles,
  LuStar,
  LuUserCog,
  LuUsers,
  LuVideo,
} from "react-icons/lu";

// Icons are looked up by name because the menu is built on the server and components
// cannot be passed into a client component as props.
const ICONS = {
  dashboard: LuLayoutDashboard,
  leads: LuInbox,
  franchise: LuHandshake,
  bookings: LuCalendarCheck,
  content: LuLayoutTemplate,
  therapy: LuFootprints,
  centre: LuMapPin,
  benefit: LuSparkles,
  faq: LuCircleHelp,
  star: LuStar,
  team: LuUsers,
  video: LuVideo,
  sections: LuSlidersHorizontal,
  publish: LuNewspaper,
  page: LuFileText,
  media: LuImages,
  marketing: LuMegaphone,
  tracking: LuRadar,
  settings: LuSettings,
  users: LuUserCog,
} satisfies Record<string, IconType>;

export type BackofficeIcon = keyof typeof ICONS;
export type BackofficeItem = { label: string; href: string; icon: BackofficeIcon; badge?: number };
export type BackofficeModule = { label: string; icon: BackofficeIcon; caption?: string; items: BackofficeItem[] };

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** The deepest menu href the current path sits under. */
function useActiveHref(modules: BackofficeModule[]) {
  const pathname = usePathname();
  let best = "";
  for (const item of modules.flatMap((m) => m.items)) {
    const under = pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (under && item.href.length > best.length) best = item.href;
  }
  return best;
}

function Badge({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-brand tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function BackofficeSidebar({ modules }: { modules: BackofficeModule[] }) {
  const activeHref = useActiveHref(modules);
  const current = modules.find((m) => m.items.some((i) => i.href === activeHref)) ?? modules[0];
  const CurrentIcon = ICONS[current.icon];

  return (
    <div className="sticky top-0 hidden h-dvh shrink-0 lg:flex">
      <aside className="flex w-[5.75rem] flex-col items-center bg-brand-dark py-4 pl-2 text-white">
        <Link
          href="/admin"
          aria-label="Zen Steps admin home"
          className="mr-2 grid size-12 place-items-center rounded-2xl bg-gold text-brand transition-colors hover:bg-gold-hover"
        >
          <LuFootprints className="size-6" aria-hidden="true" />
        </Link>
        <span className="mr-2 mt-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/55">Menu</span>
        <nav aria-label="Admin sections" className="no-scrollbar mt-5 flex w-full flex-1 flex-col gap-1 overflow-y-auto py-4">
          {modules.map((module) => {
            const Icon = ICONS[module.icon];
            const active = module === current;
            const count = module.items.reduce((n, i) => n + (i.badge ?? 0), 0);
            return (
              <Link
                key={module.label}
                href={module.items[0].href}
                aria-current={active ? "true" : undefined}
                className={cx(
                  "bo-rail-link group relative flex min-h-[4.5rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-l-2xl pr-2 text-[0.72rem] font-medium transition-colors",
                  !active && "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <span
                  className={cx(
                    "relative grid size-10 place-items-center rounded-xl transition-colors",
                    active ? "bg-gold/25 text-brand" : "bg-white/[0.06] group-hover:bg-white/10"
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {count > 0 && !active && (
                    <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-gold ring-2 ring-brand-dark" aria-hidden="true" />
                  )}
                </span>
                {module.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <aside className="flex w-64 flex-col border-r border-border bg-white">
        <div className="flex h-[4.5rem] shrink-0 items-center gap-3 border-b border-border px-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream text-brand">
            <CurrentIcon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold leading-tight text-ink">{current.label}</p>
            {current.caption && <p className="truncate text-xs text-muted">{current.caption}</p>}
          </div>
        </div>
        <nav aria-label={`${current.label} menu`} className="bo-scroll flex-1 space-y-1 overflow-y-auto p-3">
          {current.items.map((item) => {
            const Icon = ICONS[item.icon];
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex min-h-10 items-center gap-3 rounded-xl border px-3 text-sm font-medium transition-colors",
                  active ? "border-brand/40 bg-cream text-ink" : "border-transparent text-secondary hover:bg-paper hover:text-ink"
                )}
              >
                <Icon className={cx("size-4 shrink-0", active && "text-brand")} aria-hidden="true" />
                <span className="truncate">{item.label}</span>
                <Badge count={item.badge} />
              </Link>
            );
          })}
        </nav>
        <p className="m-3 rounded-xl bg-paper p-3 text-xs leading-relaxed text-muted">
          Changes publish to the website as soon as you save.
        </p>
      </aside>
    </div>
  );
}

/** Below `lg` the rail and sub-menu collapse into one scrollable strip. */
export function BackofficeMobileNav({ modules }: { modules: BackofficeModule[] }) {
  const activeHref = useActiveHref(modules);
  const nav = useRef<HTMLElement>(null);
  // Bring the current page's tab into view; on a phone most tabs start off-screen.
  useEffect(() => {
    nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeHref]);
  return (
    <nav ref={nav} aria-label="Admin menu" className="bo-scroll flex gap-1.5 overflow-x-auto border-b border-border bg-white px-4 py-2.5 lg:hidden">
      {modules.flatMap((m) => m.items).map((item) => {
        const Icon = ICONS[item.icon];
        const active = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors",
              active ? "border-brand/40 bg-cream text-ink" : "border-transparent text-secondary hover:bg-paper"
            )}
          >
            <Icon className={cx("size-4", active && "text-brand")} aria-hidden="true" />
            {item.label}
            <Badge count={item.badge} />
          </Link>
        );
      })}
    </nav>
  );
}

/** Jump to any admin page by name; Ctrl/⌘+K focuses it from anywhere. */
export function BackofficeSearch({ modules }: { modules: BackofficeModule[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const items = modules.flatMap((m) => m.items.map((i) => ({ ...i, group: m.label })));

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        input.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function open(query: string) {
    const field = input.current;
    const q = query.trim().toLowerCase();
    if (!field || !q) return;
    const hit = items.find((i) => i.label.toLowerCase() === q) ?? items.find((i) => i.label.toLowerCase().includes(q));
    if (!hit) {
      field.setCustomValidity(`No admin page called “${query.trim()}”.`);
      field.reportValidity();
      return;
    }
    field.value = "";
    field.blur();
    router.push(hit.href);
  }

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(event) => {
        event.preventDefault();
        open(input.current?.value ?? "");
      }}
    >
      <label htmlFor="admin-search" className="sr-only">
        Search admin pages
      </label>
      <LuSearch className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        ref={input}
        id="admin-search"
        type="search"
        list="admin-search-pages"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search menus and pages…"
        onChange={(event) => {
          event.currentTarget.setCustomValidity("");
          // Picking a suggestion fills in an exact label: go straight there.
          if (items.some((i) => i.label === event.currentTarget.value)) open(event.currentTarget.value);
        }}
        className="h-11 w-full rounded-xl border border-border bg-paper pl-10 pr-16 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/80 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/15 sm:text-sm"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-white px-2 py-1 font-sans text-xs text-muted sm:block">
        Ctrl&nbsp;K
      </kbd>
      <datalist id="admin-search-pages">
        {items.map((i) => (
          <option key={i.href} value={i.label}>
            {i.group}
          </option>
        ))}
      </datalist>
    </form>
  );
}
