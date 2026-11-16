// Editable copy for the home page "Benefits" and "Social highlights" sections.
// Stored in the SiteSettings table; these defaults apply until an admin saves a value.
export const SECTION_DEFAULTS = {
  benefitsEyebrow: "Foot Reflexology Benefits",
  benefitsTitle: "How Regular Sessions Help You",
  benefitsSubtitle:
    "Each session works the reflex points of the feet to help you relax, sleep better and feel refreshed.",
  benefitsImage: "/images/reflexology-benefits.jpg", // frame from the brand hero video
  socialEyebrow: "Follow Our Journey",
  socialTitle: "Moments From Our Therapy Rooms",
  socialSubtitle:
    "Real Zen Steps sessions with our visually impaired therapists, as shared with our community on Instagram and YouTube.",
  instagramUrl: "",
  youtubeUrl: "",
} as const;

export type SectionKey = keyof typeof SECTION_DEFAULTS;
export type SectionSettings = Record<SectionKey, string>;

export const SECTION_KEYS = Object.keys(SECTION_DEFAULTS) as SectionKey[];

/** Merge saved SiteSettings rows over the defaults. Blank saved values fall back to the default. */
export function sectionSettings(rows: { key: string; value: string }[]): SectionSettings {
  const merged: SectionSettings = { ...SECTION_DEFAULTS };
  for (const row of rows) {
    if (row.key in merged && row.value.trim()) merged[row.key as SectionKey] = row.value.trim();
  }
  return merged;
}

export interface SocialEmbed {
  platform: "youtube" | "instagram";
  embedUrl: string;
  thumbnail: string | null;
  vertical: boolean;
}

/** Turn a pasted YouTube / Instagram link into an embeddable player URL. Returns null for anything else. */
export function parseSocialUrl(url: string): SocialEmbed | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) {
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&playsinline=1`,
      thumbnail: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
      vertical: url.includes("/shorts/"),
    };
  }

  const ig = url.match(/instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/);
  if (ig) {
    const kind = ig[1] === "reels" ? "reel" : ig[1];
    return {
      platform: "instagram",
      embedUrl: `https://www.instagram.com/${kind}/${ig[2]}/embed/`,
      thumbnail: null, // Instagram has no public thumbnail URL; admins add a cover image
      vertical: true,
    };
  }

  return null;
}
