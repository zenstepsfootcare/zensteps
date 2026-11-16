"use server";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { deleteObject, keyFromUrl } from "@/lib/storage";

export async function deleteMedia(form: FormData) {
  await requireAdmin();
  const item = await prisma.galleryItem.delete({ where: { id: String(form.get("id")) } });
  // Only files the uploader wrote are removed: from the storage bucket, or public/uploads/<uuid>.<ext> on disk.
  const key = keyFromUrl(item.mediaUrl);
  if (key) await deleteObject(key).catch((e) => console.error("[media] storage delete failed:", (e as Error).message));
  else if (/^\/uploads\/[\w-]+\.\w+$/.test(item.mediaUrl)) await unlink(path.join(process.cwd(), "public", item.mediaUrl)).catch(() => {});
  revalidatePath("/admin/media");
}
