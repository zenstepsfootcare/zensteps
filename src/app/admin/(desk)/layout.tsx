import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LuBell, LuExternalLink, LuFootprints } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { COLLECTIONS } from "@/lib/admin/collections";
import {
  BackofficeMobileNav,
  BackofficeSearch,
  BackofficeSidebar,
  type BackofficeModule,
} from "@/components/admin/BackofficeNav";
import { SignOutButton } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zen Steps Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDeskLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  const [newFranchise, newBookings] = await Promise.all([
    prisma.franchiseInquiry.count({ where: { status: "new" } }),
    prisma.contactSubmission.count({ where: { status: "new" } }),
  ]);
  const newLeads = newFranchise + newBookings;

  const c = COLLECTIONS;
  const modules: BackofficeModule[] = [
    { label: "Home", icon: "dashboard", items: [{ label: "Dashboard", href: "/admin", icon: "dashboard" }] },
    {
      label: "Leads",
      icon: "leads",
      caption: newLeads ? `${newLeads} new` : "All caught up",
      items: [
        { label: "Franchise enquiries", href: "/admin/franchise", icon: "franchise", badge: newFranchise },
        { label: "Session requests", href: "/admin/bookings", icon: "bookings", badge: newBookings },
      ],
    },
    {
      label: "Content",
      icon: "content",
      caption: "Website sections",
      items: [
        { label: c.services.label, href: "/admin/content/services", icon: "therapy" },
        { label: c.locations.label, href: "/admin/content/locations", icon: "centre" },
        { label: c.benefits.label, href: "/admin/content/benefits", icon: "benefit" },
        { label: c.faqs.label, href: "/admin/content/faqs", icon: "faq" },
        { label: c.testimonials.label, href: "/admin/content/testimonials", icon: "star" },
        { label: c.team.label, href: "/admin/content/team", icon: "team" },
        { label: c.videos.label, href: "/admin/content/videos", icon: "video" },
        { label: "Home sections", href: "/admin/content/sections", icon: "sections" },
      ],
    },
    {
      label: "Publish",
      icon: "publish",
      caption: "Blog and pages",
      items: [
        { label: c.posts.label, href: "/admin/content/posts", icon: "publish" },
        { label: c.pages.label, href: "/admin/content/pages", icon: "page" },
      ],
    },
    { label: "Media", icon: "media", items: [{ label: "Media library", href: "/admin/media", icon: "media" }] },
    { label: "Marketing", icon: "marketing", items: [{ label: "Tracking & pixels", href: "/admin/tracking", icon: "tracking" }] },
    {
      label: "Settings",
      icon: "settings",
      items: [
        { label: "Business details", href: "/admin/settings", icon: "settings" },
        { label: "Admin users", href: "/admin/users", icon: "users" },
      ],
    },
  ];

  const initials = (admin.name || admin.email)
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-dvh bg-paper text-ink">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <BackofficeSidebar modules={modules} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[4.5rem] items-center gap-3 border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6">
          <Link href="/admin" aria-label="Zen Steps admin home" className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-dark text-gold lg:hidden">
            <LuFootprints className="size-5" aria-hidden="true" />
          </Link>
          <div className="hidden min-w-0 flex-1 justify-center sm:flex">
            <div className="w-full max-w-xl">
              <BackofficeSearch modules={modules} />
            </div>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link href="/" target="_blank" className="bo-icon-btn border-transparent" aria-label="View website (opens in a new tab)" title="View website">
              <LuExternalLink className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href={newBookings > newFranchise ? "/admin/bookings?status=new" : "/admin/franchise?status=new"}
              aria-label={`${newLeads} new ${newLeads === 1 ? "lead" : "leads"}`}
              title="New leads"
              className="bo-icon-btn relative border-transparent"
            >
              <LuBell className="size-5" aria-hidden="true" />
              {newLeads > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[0.6rem] font-semibold text-white tabular-nums">
                  {newLeads > 99 ? "99+" : newLeads}
                </span>
              )}
            </Link>
            <div className="ml-1 flex items-center gap-2.5 border-l border-border pl-3">
              <div className="grid size-10 place-items-center rounded-full bg-brand-dark text-sm font-semibold text-gold">{initials}</div>
              <div className="hidden min-w-0 xl:block">
                <p className="max-w-44 truncate text-sm font-medium">{admin.name || admin.email}</p>
                <p className="text-xs capitalize text-muted">{admin.role}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </header>

        <BackofficeMobileNav modules={modules} />

        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
