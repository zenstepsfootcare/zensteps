import { redirect } from "next/navigation";

/** The old combined inbox; leads now have their own pages. */
export default function LegacyEnquiriesPage() {
  redirect("/admin/franchise");
}
