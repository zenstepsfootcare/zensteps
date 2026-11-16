import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CONTACT } from "@/lib/franchise";

/** Cache tag for everything in this file; the admin settings actions expire it on save. */
export const SETTINGS_TAG = "settings";

/* ---------------- Business details (/admin/settings) ---------------- */

export const CONTACT_FIELDS = {
  phone: { label: "Phone number", example: "+91 89253 83388", help: "Shown in the header, footer and every Call button." },
  whatsapp: { label: "WhatsApp number", example: "+91 89253 83388", help: "Include the country code. Used for the WhatsApp chat link." },
  email: { label: "Email", example: "hello@zensteps.in", help: "Shown on the contact page." },
  franchiseEmail: { label: "Franchise email", example: "franchise@zensteps.in", help: "Shown in the footer and on the franchise page." },
  address: { label: "Centre address", example: CONTACT.address, help: "Shown in the footer, contact and franchise pages." },
  mapUrl: { label: "Google Maps link", example: "https://maps.app.goo.gl/…", help: "Opened by the Directions links." },
} as const;

export type ContactKey = keyof typeof CONTACT_FIELDS;
export const CONTACT_KEYS = Object.keys(CONTACT_FIELDS) as ContactKey[];

export type SiteContact = {
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  franchiseEmail: string;
  address: string;
  mapUrl: string;
};

/** Digits with the Indian country code added to a bare 10-digit mobile number. */
const intl = (s: string) => {
  const d = s.replace(/\D/g, "").replace(/^0+/, "");
  return d.length === 10 ? `91${d}` : d;
};

/** Turns saved values (or the brochure defaults) into ready-to-use links. */
export function toContact(saved: Partial<Record<ContactKey, string>>): SiteContact {
  const phone = saved.phone?.trim() || CONTACT.phone;
  const whatsapp = intl(saved.whatsapp || "") || intl(CONTACT.whatsappHref);
  const mapUrl = saved.mapUrl?.trim() || "";
  return {
    phone,
    phoneHref: `tel:+${intl(phone)}`,
    whatsappHref: `https://wa.me/${whatsapp}`,
    email: saved.email?.trim() || CONTACT.email,
    franchiseEmail: saved.franchiseEmail?.trim() || CONTACT.franchiseEmail,
    address: saved.address?.trim() || CONTACT.address,
    // Only http(s) links reach an href; anything else falls back to the default.
    mapUrl: /^https?:\/\//i.test(mapUrl) ? mapUrl : CONTACT.mapUrl,
  };
}

/* ---------------- Tracking tags (/admin/tracking) ---------------- */

export const TRACKING_FIELDS = {
  gtmId: { label: "Google Tag Manager container ID", pattern: /^GTM-[A-Z0-9]{4,12}$/, example: "GTM-XXXXXXX" },
  gaId: { label: "Google Analytics 4 measurement ID", pattern: /^G-[A-Z0-9]{4,14}$/, example: "G-XXXXXXXXXX" },
  metaPixelId: { label: "Meta (Facebook) Pixel ID", pattern: /^\d{8,20}$/, example: "1234567890123456" },
  clarityId: { label: "Microsoft Clarity project ID", pattern: /^[a-z0-9]{6,20}$/, example: "abcd1234ef" },
} as const;

export type TrackingKey = keyof typeof TRACKING_FIELDS;
export const TRACKING_KEYS = Object.keys(TRACKING_FIELDS) as TrackingKey[];
export type Tracking = Record<TrackingKey, string | null>;

/** GTM/GA ids are upper case, Clarity ids lower case. */
export const normaliseTrackingId = (key: TrackingKey, raw: string) =>
  key === "clarityId" ? raw.trim().toLowerCase() : raw.trim().toUpperCase();

/* ---------------- Cached reads for the public site ---------------- */

const readSettings = unstable_cache(
  async () => {
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: [...CONTACT_KEYS, ...TRACKING_KEYS] } },
      select: { key: true, value: true },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
  },
  ["zen-site-settings-v1"],
  { revalidate: 3600, tags: [SETTINGS_TAG] }
);

const settingsOrEmpty = cache(() => readSettings().catch(() => ({}) as Record<string, string>));

export const getContact = cache(async () => toContact(await settingsOrEmpty()));

/** Configured tags, each null unless it matches its pattern, so a bad value never reaches a script. */
export const getTracking = cache(async (): Promise<Tracking> => {
  const saved = await settingsOrEmpty();
  const valid = (key: TrackingKey) => {
    const v = saved[key];
    return v && TRACKING_FIELDS[key].pattern.test(v) ? v : null;
  };
  return { gtmId: valid("gtmId"), gaId: valid("gaId"), metaPixelId: valid("metaPixelId"), clarityId: valid("clarityId") };
});
