import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { THERAPIES } from "@/lib/franchise";
import { siteUrl } from "@/lib/site";

/** Rebuilt hourly, so a therapy, post or page published in the admin reaches the sitemap without a deploy. */
export const revalidate = 3600;

const STATIC: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/franchise", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/locations", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/journal", priority: 0.6, changeFrequency: "weekly" },
  { path: "/pages", priority: 0.3, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fixed = STATIC.map((s) => ({ url: `${siteUrl}${s.path}`, lastModified: now, changeFrequency: s.changeFrequency, priority: s.priority }));

  try {
    const [services, posts, pages] = await Promise.all([
      prisma.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { isPublished: true, noIndex: false }, select: { slug: true, updatedAt: true } }),
      prisma.page.findMany({ where: { isPublished: true, noIndex: false }, select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...fixed,
      ...services.map((s) => ({ url: `${siteUrl}/services/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
      ...posts.map((p) => ({ url: `${siteUrl}/journal/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
      ...pages.map((p) => ({ url: `${siteUrl}/pages/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "yearly" as const, priority: 0.3 })),
    ];
  } catch {
    // A slightly stale sitemap is fine; a failed build is not.
    return [...fixed, ...THERAPIES.map((t) => ({ url: `${siteUrl}/services/${t.slug}`, lastModified: now, priority: 0.7 }))];
  }
}
