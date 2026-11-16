import { redirect } from "next/navigation";
import { getCollection } from "@/lib/admin/collections";

/** Old links looked like /admin/content?type=services&edit=<id>; send them to the new pages. */
export default async function ContentIndexPage({ searchParams }: PageProps<"/admin/content">) {
  const { type, edit } = await searchParams;
  if (type === "settings") redirect("/admin/content/sections");
  const c = getCollection(typeof type === "string" ? type : "services") ?? getCollection("services")!;
  redirect(typeof edit === "string" && edit ? `/admin/content/${c.key}/${edit}` : `/admin/content/${c.key}`);
}
