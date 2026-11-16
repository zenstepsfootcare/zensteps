import React from "react";
import { LuMail, LuMessageCircle, LuPhone, LuTrash2 } from "react-icons/lu";
import { telHref } from "@/lib/admin/format";
import { whatsappHref } from "@/lib/admin/leads";
import { deleteLead, saveLeadNotes, setLeadStatus } from "@/lib/admin/leadActions";
import { SubmitButton } from "@/components/admin/AdminClient";

type Kind = "franchise" | "booking";

export const term = "text-xs font-semibold uppercase tracking-wide text-muted";

export function LeadContactCard({ name, phone, email }: { name: string; phone: string | null; email: string }) {
  return (
    <section className="bo-card p-5">
      <h2 className="font-semibold">Contact {name.split(" ")[0]}</h2>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {phone && (
          <>
            <a href={telHref(phone)} className="bo-btn bo-btn-primary w-full">
              <LuPhone className="size-4" aria-hidden="true" />
              Call {phone}
            </a>
            <a href={whatsappHref(phone)} target="_blank" rel="noopener noreferrer" className="bo-btn bo-btn-outline w-full">
              <LuMessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </a>
          </>
        )}
        <a href={`mailto:${email}`} className="bo-btn bo-btn-outline w-full">
          <LuMail className="size-4" aria-hidden="true" />
          Email
        </a>
      </div>
    </section>
  );
}

export function LeadStatusCard({
  kind,
  id,
  status,
  statuses,
}: {
  kind: Kind;
  id: string;
  status: string;
  statuses: readonly { value: string; label: string }[];
}) {
  return (
    <section className="bo-card p-5">
      <h2 className="font-semibold">Status</h2>
      <form action={setLeadStatus} className="mt-4 space-y-3">
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="returnTo" value="detail" />
        <label htmlFor="lead-status" className="sr-only">
          Status
        </label>
        <select id="lead-status" name="status" defaultValue={status} className="bo-field">
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <SubmitButton className="bo-btn bo-btn-primary w-full" pendingLabel="Saving…">
          Update status
        </SubmitButton>
      </form>
    </section>
  );
}

export function LeadNotesCard({ kind, id, notes }: { kind: Kind; id: string; notes: string | null }) {
  return (
    <section className="bo-card p-5">
      <h2 className="font-semibold">Internal notes</h2>
      <p className="mt-1 text-xs text-muted">Only visible in the admin. Record each call so whoever follows up next knows where it stands.</p>
      <form action={saveLeadNotes} className="mt-4 space-y-3">
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <label htmlFor="lead-notes" className="sr-only">
          Internal notes
        </label>
        <textarea
          id="lead-notes"
          name="notes"
          rows={6}
          maxLength={5000}
          defaultValue={notes ?? ""}
          placeholder="14 Nov: called, asked for a callback on Monday…"
          className="bo-field"
        />
        <SubmitButton className="bo-btn bo-btn-primary" pendingLabel="Saving…">
          Save notes
        </SubmitButton>
      </form>
    </section>
  );
}

export function LeadDeleteCard({ kind, id, name }: { kind: Kind; id: string; name: string }) {
  return (
    <section className="rounded-xl border border-red-200 bg-red-50/60 p-5">
      <h2 className="font-semibold text-red-800">Delete this lead</h2>
      <p className="mt-1.5 text-xs text-secondary">Permanent. Close it with a status instead unless it was sent in error.</p>
      <form action={deleteLead} className="mt-4">
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="returnTo" value="list" />
        <SubmitButton className="bo-btn bo-btn-danger bo-btn-sm" pendingLabel="Deleting…" confirm={`Delete the lead from ${name}? This cannot be undone.`}>
          <LuTrash2 className="size-4" aria-hidden="true" />
          Delete permanently
        </SubmitButton>
      </form>
    </section>
  );
}
