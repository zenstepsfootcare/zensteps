import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { formatDateTime, telHref } from "@/lib/admin/format";
import { guestNote } from "@/lib/admin/leads";
import { BOOKING_STATUSES } from "@/lib/admin/statuses";
import { Notice, PageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { LeadContactCard, LeadDeleteCard, LeadNotesCard, LeadStatusCard, term } from "@/components/admin/LeadPanels";

export const dynamic = "force-dynamic";

export default async function SessionRequestPage({ params, searchParams }: PageProps<"/admin/bookings/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const b = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!b) notFound();
  const note = guestNote(b.message);

  return (
    <>
      <PageHeader
        back={{ href: "/admin/bookings", label: "All session requests" }}
        title={b.name}
        description={`Session request received ${formatDateTime(b.createdAt)}.`}
        actions={<StatusBadge value={b.status} list={BOOKING_STATUSES} />}
      />

      {saved === "status" && <Notice>Status updated.</Notice>}
      {saved === "notes" && <Notice>Notes saved.</Notice>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="bo-card p-5">
            <h2 className="font-semibold">Request</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className={term}>Therapy</dt>
                <dd className="mt-1 font-semibold">{b.interest || "Not chosen"}</dd>
              </div>
              <div>
                <dt className={term}>City</dt>
                <dd className="mt-1">{b.city || "—"}</dd>
              </div>
              <div>
                <dt className={term}>Phone</dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {b.phone ? (
                    <a href={telHref(b.phone)} className="text-brand hover:underline">
                      {b.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className={term}>Email</dt>
                <dd className="mt-1 break-all font-semibold">
                  <a href={`mailto:${b.email}`} className="text-brand hover:underline">
                    {b.email}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-border pt-5">
              <h3 className={term}>Their note</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{note || "No note left."}</p>
            </div>
          </section>

          <LeadNotesCard kind="booking" id={b.id} notes={b.notes} />
        </div>

        <div className="space-y-6">
          <LeadStatusCard kind="booking" id={b.id} status={b.status} statuses={BOOKING_STATUSES} />
          <LeadContactCard name={b.name} phone={b.phone} email={b.email} />
          <LeadDeleteCard kind="booking" id={b.id} name={b.name} />
        </div>
      </div>
    </>
  );
}
