import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { getCollection, modelOf } from "@/lib/admin/collections";
import { imageOptions } from "@/lib/admin/media";
import { EntryEditor } from "@/components/admin/EntryEditor";

export const dynamic = "force-dynamic";

export default async function NewEntryPage({ params, searchParams }: PageProps<"/admin/content/[type]/new">) {
  await requireAdmin();
  const c = getCollection((await params).type);
  if (!c) notFound();
  const { error } = await searchParams;
  const [images, count] = await Promise.all([imageOptions(), modelOf(c).count()]);
  return <EntryEditor c={c} entry={null} images={images} nextOrder={count + 1} error={typeof error === "string" ? error : undefined} />;
}
