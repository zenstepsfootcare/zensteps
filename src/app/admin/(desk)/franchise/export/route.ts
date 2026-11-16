import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { parseFilters } from "@/lib/admin/filters";
import { csvResponse, formatDateTimeCsv } from "@/lib/admin/format";
import { franchiseWhere } from "@/lib/admin/leads";
import { FRANCHISE_STATUSES, statusValues } from "@/lib/admin/statuses";

/** CSV of the franchise list exactly as filtered on screen. */
export async function GET(request: Request) {
  await requireAdmin();
  const filters = parseFilters(Object.fromEntries(new URL(request.url).searchParams), statusValues(FRANCHISE_STATUSES));
  const rows = await prisma.franchiseInquiry.findMany({ where: franchiseWhere(filters), orderBy: { createdAt: "desc" } });
  return csvResponse(
    "franchise-enquiries",
    ["Date (IST)", "Name", "Phone", "Email", "City", "State", "Preferred setup", "Message", "Status", "Internal notes"],
    rows.map((r) => [
      formatDateTimeCsv(r.createdAt),
      r.name,
      r.phone,
      r.email,
      r.city,
      r.state,
      r.investment ?? "",
      (r.message ?? "").replace(/\s+/g, " "),
      r.status,
      (r.notes ?? "").replace(/\s+/g, " "),
    ])
  );
}
