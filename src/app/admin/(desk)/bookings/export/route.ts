import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { parseFilters } from "@/lib/admin/filters";
import { csvResponse, formatDateTimeCsv } from "@/lib/admin/format";
import { bookingWhere, guestNote } from "@/lib/admin/leads";
import { BOOKING_STATUSES, statusValues } from "@/lib/admin/statuses";

/** CSV of the session-request list exactly as filtered on screen. */
export async function GET(request: Request) {
  await requireAdmin();
  const filters = parseFilters(Object.fromEntries(new URL(request.url).searchParams), statusValues(BOOKING_STATUSES));
  const rows = await prisma.contactSubmission.findMany({ where: bookingWhere(filters), orderBy: { createdAt: "desc" } });
  return csvResponse(
    "session-requests",
    ["Date (IST)", "Name", "Phone", "Email", "Therapy", "City", "Their note", "Status", "Internal notes"],
    rows.map((r) => [
      formatDateTimeCsv(r.createdAt),
      r.name,
      r.phone ?? "",
      r.email,
      r.interest ?? "",
      r.city ?? "",
      guestNote(r.message).replace(/\s+/g, " "),
      r.status,
      (r.notes ?? "").replace(/\s+/g, " "),
    ])
  );
}
