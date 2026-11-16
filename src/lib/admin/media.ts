import { readdir } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

/** Image paths an admin can pick in image fields: uploads first, then the site's own images. */
export async function imageOptions(): Promise<string[]> {
  const [uploads, bundled] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { mediaType: "image" },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { mediaUrl: true },
    }),
    readdir(path.join(process.cwd(), "public", "images")).catch(() => [] as string[]),
  ]);
  const site = bundled.filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).map((f) => `/images/${f}`);
  return [...new Set([...uploads.map((u) => u.mediaUrl), ...site])];
}
