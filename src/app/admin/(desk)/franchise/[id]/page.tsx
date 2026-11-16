import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { formatDateTime, telHref } from "@/lib/admin/format";
import { FRANCHISE_STATUSES } from "@/lib/admin/statuses";
import { Notice, PageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { LeadContactCard, LeadDeleteCard, LeadNotesCard, LeadStatusCard, term } from "@/components/admin/LeadPanels";

export const dynamic = "force-dynamic";

export default async function FranchiseEnquiryPage({ params, searchParams }: PageProps<"/admin/franchise/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const e = await prisma.franchiseInquiry.findUnique({ where: { id } });
  if (!e) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/franchise", label: "All franchise enquiries" }}
        title={e.name}
        description={`Franchise application received ${formatDateTime(e.createdAt)}.`}
        actions={<StatusBadge value={e.status} list={FRANCHISE_STATUSES} />}
      />

      {saved === "status" && <Notice>Status updated.</Notice>}
      {saved === "notes" && <Notice>Notes saved.</Notice>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="bo-card p-5">
            <h2 className="font-semibold">Application</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className={term}>Phone</dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  <a href={telHref(e.phone)} className="text-brand hover:underline">
                    {e.phone}
                  </a>
                </dd>
              </div>
              <div className="min-w-0">
                <dt className={term}>Email</dt>
                <dd className="mt-1 break-all font-semibold">
                  <a href={`mailto:${e.email}`} className="text-brand hover:underline">
                    {e.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={term}>Location</dt>
                <dd className="mt-1">
                  {e.city}, {e.state}
                </dd>
              </div>
              <div>
                <dt className={term}>Preferred setup</dt>
                <dd className="mt-1">{e.investment || "Not specified"}</dd>
              </div>
              <div>
                <dt className={term}>Last updated</dt>
                <dd className="mt-1">{formatDateTime(e.updatedAt)}</dd>
              </div>
            </dl>
            {e.message && (
              <div className="mt-5 border-t border-border pt-5">
                <h3 className={term}>About them and their space</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{e.message}</p>
              </div>
            )}
          </section>

          <LeadNotesCard kind="franchise" id={e.id} notes={e.notes} />
        </div>

        <div className="space-y-6">
          <LeadStatusCard kind="franchise" id={e.id} status={e.status} statuses={FRANCHISE_STATUSES} />
          <LeadContactCard name={e.name} phone={e.phone} email={e.email} />
          <LeadDeleteCard kind="franchise" id={e.id} name={e.name} />
        </div>
      </div>
    </>
  );
}
