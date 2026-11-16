/** The public site's origin, used for the sitemap, robots.txt and absolute metadata URLs. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://zensteps.in").replace(/\/+$/, "");
