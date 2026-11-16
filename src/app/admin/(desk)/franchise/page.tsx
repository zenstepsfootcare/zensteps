import Link from "next/link";
import { redirect } from "next/navigation";
import { LuCheck, LuDownload, LuMessageCircle, LuPhone, LuRefreshCw, LuTrash2 } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { describeDates, filtersQuery, parseFilters } from "@/lib/admin/filters";
import { formatDateTime, telHref } from "@/lib/admin/format";
import { franchiseWhere, whatsappHref } from "@/lib/admin/leads";
import { FRANCHISE_STATUSES, statusValues } from "@/lib/admin/statuses";
import { deleteLead, setLeadStatus } from "@/lib/admin/leadActions";
import { Notice, PageHeader, Pagination, StatusBadge, td, th } from "@/components/admin/AdminUI";
import { AutoRefresh, SubmitButton } from "@/components/admin/AdminClient";
import { LeadFilters } from "@/components/admin/LeadFilters";

export const dynamic = "force-dynamic";

const BASE = "/admin/franchise";

export default async function FranchiseEnquiriesPage({ searchParams }: PageProps<"/admin/franchise">) {
  await requireAdmin();
  const params = await searchParams;
  const filters = parseFilters(params, statusValues(FRANCHISE_STATUSES));
  const where = franchiseWhere(filters);

  const [rows, total, grouped] = await Promise.all([
    prisma.franchiseInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.size,
      take: filters.size,
      select: { id: true, name: true, email: true, phone: true, city: true, state: true, investment: true, message: true, status: true, createdAt: true },
    }),
    prisma.franchiseInquiry.count({ where }),
    // Tab counts follow the date range and search, so "New 3" means new in this view.
    prisma.franchiseInquiry.groupBy({ by: ["status"], where: franchiseWhere(filters, false), _count: true }),
  ]);

  const pages = Math.max(1, Math.ceil(total / filters.size));
  if (filters.page > pages) redirect(`${BASE}${filtersQuery(filters, { page: pages })}`);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count]));

  return (
    <>
      <AutoRefresh intervalMs={5 * 60 * 1000} />
      <PageHeader
        title="Franchise enquiries"
        description={`Applications from the franchise form, ${describeDates(filters).toLowerCase()}. Refreshes every 5 minutes.`}
        actions={
          <>
            {/* A plain anchor: the export is a file download, not a page. */}
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

      {params.deleted && <Notice>Enquiry deleted.</Notice>}

      <LeadFilters
        base={BASE}
        filters={filters}
        statuses={FRANCHISE_STATUSES}
        counts={counts}
        searchPlaceholder="Name, phone, email, city…"
      />

      <p className="mb-3 mt-6 px-1 text-sm text-muted">
        <span className="font-semibold text-ink tabular-nums">{total}</span> {total === 1 ? "enquiry" : "enquiries"} found
      </p>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-sm text-muted">
          No franchise enquiries match this view.{" "}
          <Link href={BASE} className="font-medium text-ink underline underline-offset-4">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="bo-card flex max-h-[calc(100dvh-6.5rem)] flex-col overflow-hidden">
          <div className="bo-scroll min-h-0 flex-1 overflow-auto">
            <table className="bo-table w-full min-w-[960px] border-collapse">
              <thead>
                <tr>
                  <th className={`${th} pl-5`}>Applicant</th>
                  <th className={th}>Phone</th>
                  <th className={th}>Location</th>
                  <th className={th}>Setup</th>
                  <th className={th}>Message</th>
                  <th className={th}>Status</th>
                  <th className={th}>Received</th>
                  <th className={`${th} pr-5 text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id} className="border-t border-border">
                    <td className={`${td} pl-5`}>
                      <Link href={`${BASE}/${e.id}`} className="font-semibold hover:text-brand-light hover:underline">
                        {e.name}
                      </Link>
                      <a href={`mailto:${e.email}`} className="mt-0.5 block max-w-44 truncate text-xs text-muted hover:text-brand">
                        {e.email}
                      </a>
                    </td>
                    <td className={`${td} whitespace-nowrap tabular-nums`}>
                      <a href={telHref(e.phone)} className="font-medium hover:text-brand">
                        {e.phone}
                      </a>
                    </td>
                    <td className={`${td} whitespace-nowrap`}>
                      {e.city}
                      <span className="block text-xs text-muted">{e.state}</span>
                    </td>
                    <td className={`${td} max-w-40 text-secondary`}>{e.investment || "—"}</td>
                    <td className={`${td} max-w-56 text-secondary`}>
                      <span className="line-clamp-2">{e.message || "—"}</span>
                    </td>
                    <td className={td}>
                      <StatusBadge value={e.status} list={FRANCHISE_STATUSES} />
                    </td>
                    <td className={`${td} whitespace-pre text-muted tabular-nums`}>{formatDateTime(e.createdAt).replace(", ", "\n")}</td>
                    <td className={`${td} pr-5`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a href={whatsappHref(e.phone)} target="_blank" rel="noopener noreferrer" className="bo-icon-btn" aria-label={`WhatsApp ${e.name}`} title="WhatsApp">
                          <LuMessageCircle className="size-4" aria-hidden="true" />
                        </a>
                        <a href={telHref(e.phone)} className="bo-icon-btn" aria-label={`Call ${e.name}`} title="Call">
                          <LuPhone className="size-4" aria-hidden="true" />
                        </a>
                        {e.status === "new" && (
                          <form action={setLeadStatus}>
                            <input type="hidden" name="kind" value="franchise" />
                            <input type="hidden" name="id" value={e.id} />
                            <input type="hidden" name="status" value="contacted" />
                            <SubmitButton className="bo-icon-btn text-brand" aria-label={`Mark ${e.name} as contacted`} title="Mark as contacted">
                              <LuCheck className="size-4" aria-hidden="true" />
                            </SubmitButton>
                          </form>
                        )}
                        <form action={deleteLead}>
                          <input type="hidden" name="kind" value="franchise" />
                          <input type="hidden" name="id" value={e.id} />
                          <SubmitButton
                            className="bo-icon-btn text-red-700 hover:bg-red-50 hover:text-red-800"
                            confirm={`Delete the enquiry from ${e.name}? This cannot be undone.`}
                            aria-label={`Delete enquiry from ${e.name}`}
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
