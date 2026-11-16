import Link from "next/link";
import { redirect } from "next/navigation";
import { LuCalendarCheck, LuDownload, LuMessageCircle, LuPhone, LuRefreshCw, LuTrash2 } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { describeDates, filtersQuery, parseFilters } from "@/lib/admin/filters";
import { formatDateTime, telHref } from "@/lib/admin/format";
import { bookingWhere, guestNote, whatsappHref } from "@/lib/admin/leads";
import { BOOKING_STATUSES, statusValues } from "@/lib/admin/statuses";
import { deleteLead, setLeadStatus } from "@/lib/admin/leadActions";
import { Notice, PageHeader, Pagination, StatusBadge, td, th } from "@/components/admin/AdminUI";
import { AutoRefresh, SubmitButton } from "@/components/admin/AdminClient";
import { LeadFilters } from "@/components/admin/LeadFilters";

export const dynamic = "force-dynamic";

const BASE = "/admin/bookings";

export default async function SessionRequestsPage({ searchParams }: PageProps<"/admin/bookings">) {
  await requireAdmin();
  const params = await searchParams;
  const filters = parseFilters(params, statusValues(BOOKING_STATUSES));
  const where = bookingWhere(filters);

  const [rows, total, grouped] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.size,
      take: filters.size,
      select: { id: true, name: true, email: true, phone: true, city: true, interest: true, message: true, status: true, createdAt: true },
    }),
    prisma.contactSubmission.count({ where }),
    prisma.contactSubmission.groupBy({ by: ["status"], where: bookingWhere(filters, false), _count: true }),
  ]);

  const pages = Math.max(1, Math.ceil(total / filters.size));
  if (filters.page > pages) redirect(`${BASE}${filtersQuery(filters, { page: pages })}`);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count]));

  return (
    <>
      <AutoRefresh intervalMs={5 * 60 * 1000} />
      <PageHeader
        title="Session requests"
        description={`Booking requests from the website, ${describeDates(filters).toLowerCase()}. Call each guest to confirm a slot, then mark it Booked.`}
        actions={
          <>
            <a href={`${BASE}/export${filtersQuery(filters)}`} className="bo-btn bo-btn-outline">
              <LuDownload className="size-4" aria-hidden="true" />
              Export CSV
            </a>
            <Link href={`${BASE}${filtersQuery(filters, { page: filters.page })}`} className="bo-btn bo-btn-primary">
              <LuRefreshCw className="size-4" aria-hidden="true" />
              Refresh
            </Link>
          </>
        }
      />

      {params.deleted && <Notice>Request deleted.</Notice>}

      <LeadFilters base={BASE} filters={filters} statuses={BOOKING_STATUSES} counts={counts} searchPlaceholder="Name, phone, therapy, city…" />

      <p className="mb-3 mt-6 px-1 text-sm text-muted">
        <span className="font-semibold text-ink tabular-nums">{total}</span> {total === 1 ? "request" : "requests"} found
      </p>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-sm text-muted">
          No session requests match this view.{" "}
          <Link href={BASE} className="font-medium text-ink underline underline-offset-4">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="bo-card flex max-h-[calc(100dvh-6.5rem)] flex-col overflow-hidden">
          <div className="bo-scroll min-h-0 flex-1 overflow-auto">
            <table className="bo-table w-full min-w-[920px] border-collapse">
              <thead>
                <tr>
                  <th className={`${th} pl-5`}>Guest</th>
                  <th className={th}>Phone</th>
                  <th className={th}>Therapy</th>
                  <th className={th}>City</th>
                  <th className={th}>Their note</th>
                  <th className={th}>Status</th>
                  <th className={th}>Received</th>
                  <th className={`${th} pr-5 text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className={`${td} pl-5`}>
                      <Link href={`${BASE}/${b.id}`} className="font-semibold hover:text-brand-light hover:underline">
                        {b.name}
                      </Link>
                      <a href={`mailto:${b.email}`} className="mt-0.5 block max-w-44 truncate text-xs text-muted hover:text-brand">
                        {b.email}
                      </a>
                    </td>
                    <td className={`${td} whitespace-nowrap tabular-nums`}>
                      {b.phone ? (
                        <a href={telHref(b.phone)} className="font-medium hover:text-brand">
                          {b.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={`${td} max-w-48`}>{b.interest || "—"}</td>
                    <td className={`${td} whitespace-nowrap`}>{b.city || "—"}</td>
                    <td className={`${td} max-w-56 text-secondary`}>
                      <span className="line-clamp-2">{guestNote(b.message) || "—"}</span>
                    </td>
                    <td className={td}>
                      <StatusBadge value={b.status} list={BOOKING_STATUSES} />
                    </td>
                    <td className={`${td} whitespace-pre text-muted tabular-nums`}>{formatDateTime(b.createdAt).replace(", ", "\n")}</td>
                    <td className={`${td} pr-5`}>
                      <div className="flex items-center justify-end gap-1.5">
                        {b.phone && (
                          <>
                            <a href={whatsappHref(b.phone)} target="_blank" rel="noopener noreferrer" className="bo-icon-btn" aria-label={`WhatsApp ${b.name}`} title="WhatsApp">
                              <LuMessageCircle className="size-4" aria-hidden="true" />
                            </a>
                            <a href={telHref(b.phone)} className="bo-icon-btn" aria-label={`Call ${b.name}`} title="Call">
                              <LuPhone className="size-4" aria-hidden="true" />
                            </a>
                          </>
                        )}
                        {b.status !== "booked" && b.status !== "closed" && (
                          <form action={setLeadStatus}>
                            <input type="hidden" name="kind" value="booking" />
                            <input type="hidden" name="id" value={b.id} />
                            <input type="hidden" name="status" value="booked" />
                            <SubmitButton className="bo-icon-btn text-brand" aria-label={`Mark ${b.name} as booked`} title="Mark as booked">
                              <LuCalendarCheck className="size-4" aria-hidden="true" />
                            </SubmitButton>
                          </form>
                        )}
                        <form action={deleteLead}>
                          <input type="hidden" name="kind" value="booking" />
                          <input type="hidden" name="id" value={b.id} />
                          <SubmitButton
                            className="bo-icon-btn text-red-700 hover:bg-red-50 hover:text-red-800"
                            confirm={`Delete the request from ${b.name}? This cannot be undone.`}
                            aria-label={`Delete request from ${b.name}`}
                            title="Delete"
                          >
                            <LuTrash2 className="size-4" aria-hidden="true" />
                          </SubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            className="border-t border-border px-5 py-3"
            page={filters.page}
            pages={pages}
            total={total}
            size={filters.size}
            hrefFor={(page) => `${BASE}${filtersQuery(filters, { page })}`}
            hrefForSize={(size) => `${BASE}${filtersQuery(filters, { size })}`}
          />
        </div>
      )}
    </>
  );
}
