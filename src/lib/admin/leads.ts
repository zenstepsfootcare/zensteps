import type { Prisma } from "@prisma/client";
import { createdAtRange, type ListFilters } from "@/lib/admin/filters";

const contains = (q: string) => ({ contains: q, mode: "insensitive" as const });

/** Franchise enquiries matching the list filters (shared by the list page and CSV export). */
export function franchiseWhere(f: ListFilters, withStatus = true): Prisma.FranchiseInquiryWhereInput {
  const createdAt = createdAtRange(f);
  return {
    ...(createdAt ? { createdAt } : {}),
    ...(withStatus && f.status ? { status: f.status } : {}),
    ...(f.q
      ? { OR: [{ name: contains(f.q) }, { email: contains(f.q) }, { phone: { contains: f.q } }, { city: contains(f.q) }, { state: contains(f.q) }] }
      : {}),
  };
}

/** Session requests matching the list filters (shared by the list page and CSV export). */
export function bookingWhere(f: ListFilters, withStatus = true): Prisma.ContactSubmissionWhereInput {
  const createdAt = createdAtRange(f);
  return {
    ...(createdAt ? { createdAt } : {}),
    ...(withStatus && f.status ? { status: f.status } : {}),
    ...(f.q
      ? {
          OR: [
            { name: contains(f.q) },
            { email: contains(f.q) },
            { phone: { contains: f.q } },
            { city: contains(f.q) },
            { interest: contains(f.q) },
          ],
        }
      : {}),
  };
}

/** The guest's own words: the website stores "City: …\nInterest: …\nNotes: …". */
export function guestNote(message: string) {
  const note = message.match(/Notes:\s*([\s\S]*)$/)?.[1]?.trim() ?? message.trim();
  return note === "N/A" ? "" : note;
}

/** wa.me link for an Indian mobile number typed with or without +91. */
export function whatsappHref(phone: string) {
  const d = phone.replace(/\D/g, "").replace(/^0+/, "");
  return `https://wa.me/${d.length === 10 ? `91${d}` : d}`;
}
