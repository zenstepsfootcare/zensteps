import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { getCollection, modelOf } from "@/lib/admin/collections";
import { imageOptions } from "@/lib/admin/media";
import { EntryEditor } from "@/components/admin/EntryEditor";

export const dynamic = "force-dynamic";

export default async function EditEntryPage({ params, searchParams }: PageProps<"/admin/content/[type]/[id]">) {
  await requireAdmin();
  const { type, id } = await params;
  const c = getCollection(type);
  if (!c) notFound();
  const [entry, images] = await Promise.all([modelOf(c).findUnique({ where: { id } }), imageOptions()]);
  if (!entry) notFound();
  const { error } = await searchParams;
  return <EntryEditor c={c} entry={entry} images={images} nextOrder={0} error={typeof error === "string" ? error : undefined} />;
}
