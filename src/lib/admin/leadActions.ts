"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { BOOKING_STATUSES, FRANCHISE_STATUSES, statusValues } from "@/lib/admin/statuses";

const KINDS = {
  franchise: { base: "/admin/franchise", statuses: statusValues(FRANCHISE_STATUSES) },
  booking: { base: "/admin/bookings", statuses: statusValues(BOOKING_STATUSES) },
} as const;
type Kind = keyof typeof KINDS;

function read(form: FormData) {
  const kind = String(form.get("kind")) as Kind;
  const id = String(form.get("id") || "");
  if (!(kind in KINDS) || !id) throw new Error("Unknown lead");
  return { kind, id, ...KINDS[kind], returnTo: String(form.get("returnTo") || "") };
}

async function update(kind: Kind, id: string, data: { status?: string; notes?: string | null }) {
  if (kind === "franchise") await prisma.franchiseInquiry.update({ where: { id }, data });
  else await prisma.contactSubmission.update({ where: { id }, data: { ...data, ...(data.status ? { isRead: true } : {}) } });
}

export async function setLeadStatus(form: FormData) {
  await requireAdmin();
  const { kind, id, base, statuses, returnTo } = read(form);
  const status = String(form.get("status") || "");
  if (!(statuses as readonly string[]).includes(status)) throw new Error("Unknown status");
  await update(kind, id, { status });
  revalidatePath("/admin", "layout"); // menu badges and the bell count
  if (returnTo === "detail") redirect(`${base}/${id}?saved=status`);
}

export async function saveLeadNotes(form: FormData) {
  await requireAdmin();
  const { kind, id, base } = read(form);
  const notes = String(form.get("notes") || "").trim().slice(0, 5000);
  await update(kind, id, { notes: notes || null });
  redirect(`${base}/${id}?saved=notes`);
}

export async function deleteLead(form: FormData) {
  await requireAdmin();
  const { kind, id, base, returnTo } = read(form);
  if (kind === "franchise") await prisma.franchiseInquiry.delete({ where: { id } });
  else await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  if (returnTo === "list") redirect(`${base}?deleted=1`);
}
