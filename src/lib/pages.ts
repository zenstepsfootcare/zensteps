import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Admin-managed content pages (/pages/[slug]). All queries share the "pages" cache tag,
// which the admin save action expires so edits show on the next request.
const cacheOptions = { revalidate: 3600, tags: ["pages"] };

export const getPublishedPages = unstable_cache(
  () =>
    prisma.page.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: { slug: true, title: true, summary: true, heroImage: true, noIndex: true },
    }),
  ["zen-pages-list-v1"],
  cacheOptions
);

export const getPage = unstable_cache(
  (slug: string) => prisma.page.findFirst({ where: { slug, isPublished: true } }),
  ["zen-page-v1"],
  cacheOptions
);

export const getFooterPages = unstable_cache(
  () =>
    prisma.page.findMany({
      where: { isPublished: true, showInFooter: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: { slug: true, title: true },
    }),
  ["zen-pages-footer-v1"],
  cacheOptions
);
