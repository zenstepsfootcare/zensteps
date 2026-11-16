import Link from "next/link";
import { LuArrowRight, LuFilePlus, LuImagePlus, LuPenLine, LuSettings } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { createdAtRange } from "@/lib/admin/filters";
import { formatDateTime } from "@/lib/admin/format";
import { BOOKING_STATUSES, FRANCHISE_STATUSES } from "@/lib/admin/statuses";
import { PageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { AutoRefresh } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const month = createdAtRange({ date: "month", from: "", to: "" });

  const [newFranchise, monthFranchise, newBookings, monthBookings, recentFranchise, recentBookings, counts] = await Promise.all([
    prisma.franchiseInquiry.count({ where: { status: "new" } }),
    prisma.franchiseInquiry.count({ where: { createdAt: month } }),
    prisma.contactSubmission.count({ where: { status: "new" } }),
    prisma.contactSubmission.count({ where: { createdAt: month } }),
    prisma.franchiseInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, city: true, state: true, status: true, createdAt: true },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, interest: true, city: true, status: true, createdAt: true },
    }),
    Promise.all([
      prisma.service.count({ where: { isActive: true } }),
      prisma.location.count({ where: { isActive: true } }),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.fAQ.count({ where: { isActive: true } }),
      prisma.testimonial.count({ where: { isActive: true } }),
      prisma.galleryItem.count(),
    ]),
  ]);
  const [therapies, centres, posts, faqs, testimonials, media] = counts;

  const stats = [
    { label: "New franchise enquiries", value: newFranchise, href: "/admin/franchise?status=new", highlight: newFranchise > 0 },
    { label: "Franchise enquiries this month", value: monthFranchise, href: "/admin/franchise?date=month" },
    { label: "New session requests", value: newBookings, href: "/admin/bookings?status=new", highlight: newBookings > 0 },
    { label: "Session requests this month", value: monthBookings, href: "/admin/bookings?date=month" },
  ];

  const website = [
    { label: "Live therapies", value: therapies, href: "/admin/content/services" },
    { label: "Centres", value: centres, href: "/admin/content/locations" },
    { label: "Published posts", value: posts, href: "/admin/content/posts" },
    { label: "FAQs", value: faqs, href: "/admin/content/faqs" },
    { label: "Testimonials", value: testimonials, href: "/admin/content/testimonials" },
    { label: "Media files", value: media, href: "/admin/media" },
  ];

  const actions = [
    { label: "Add a therapy", href: "/admin/content/services/new", icon: LuFilePlus },
    { label: "Write a blog post", href: "/admin/content/posts/new", icon: LuPenLine },
    { label: "Upload images", href: "/admin/media", icon: LuImagePlus },
    { label: "Business details", href: "/admin/settings", icon: LuSettings },
  ];

  return (
    <>
      <AutoRefresh intervalMs={5 * 60 * 1000} />
      <PageHeader
        title={`${greeting()}, ${admin.name.split(" ")[0]}`}
        description="New leads, recent activity and everything on the Zen Steps website, in one place."
      />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className={`bo-card group flex h-full flex-col p-5 transition-colors hover:border-brand/40 ${s.highlight ? "border-gold bg-gold/10" : ""}`}
            >
              <span className="text-3xl font-semibold tracking-tight text-brand tabular-nums">{s.value}</span>
              <span className="mt-1 text-sm text-secondary">{s.label}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-light opacity-0 transition-opacity group-hover:opacity-100">
                Open <LuArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="bo-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 className="font-semibold">Latest franchise enquiries</h2>
            <Link href="/admin/franchise" className="text-sm font-semibold text-brand-light hover:text-brand">
              View all
            </Link>
          </div>
          {recentFranchise.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">No franchise enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentFranchise.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/franchise/${e.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-paper">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{e.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {e.city}, {e.state} · {formatDateTime(e.createdAt)}
                      </span>
                    </span>
                    <StatusBadge value={e.status} list={FRANCHISE_STATUSES} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bo-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 className="font-semibold">Latest session requests</h2>
            <Link href="/admin/bookings" className="text-sm font-semibold text-brand-light hover:text-brand">
              View all
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">No session requests yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentBookings.map((b) => (
                <li key={b.id}>
                  <Link href={`/admin/bookings/${b.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-paper">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{b.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {[b.interest, b.city].filter(Boolean).join(" · ") || "Session request"} · {formatDateTime(b.createdAt)}
                      </span>
                    </span>
                    <StatusBadge value={b.status} list={BOOKING_STATUSES} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="bo-card p-5 xl:col-span-2">
          <h2 className="font-semibold">On the website</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {website.map((w) => (
              <li key={w.label}>
                <Link href={w.href} className="block rounded-lg border border-border px-4 py-3 transition-colors hover:border-brand/40 hover:bg-paper">
                  <span className="block text-xl font-semibold text-ink tabular-nums">{w.value}</span>
                  <span className="text-sm text-secondary">{w.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bo-card p-5">
          <h2 className="font-semibold">Quick actions</h2>
          <ul className="mt-4 space-y-2">
            {actions.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-brand/40 hover:bg-paper">
                  <Icon className="size-4 text-brand" aria-hidden="true" />
                  {label}
                  <LuArrowRight className="ml-auto size-4 text-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
