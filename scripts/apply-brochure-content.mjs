// One-off: swap the seeded placeholder content for the Nov 2026 brochure content.
// Run: node scripts/apply-brochure-content.mjs [--dry]   (Node 23.6+ strips the TS types)
// Safe to re-run: placeholders are hidden (isActive=false), never deleted, and existing
// brochure rows are left alone so later admin edits survive.
import pkg from "@prisma/client";
import { CONTACT, DEFAULT_BENEFITS, DEFAULT_FAQS, THERAPIES } from "../src/lib/franchise.ts";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const dry = process.argv.includes("--dry");

const PLACEHOLDERS = {
  services: [
    "sole-serenity-therapy",
    "barefoot-grounding-therapy",
    "detox-reflexology-herbal-soak",
    "stone-path-reflexology",
    "acupressure-mat-session",
    "femme-balance-reflexology",
    "herbal-foot-soak-ritual",
    "vita-flex-energy-alignment",
    "meridian-walking-meditation",
    "junior-steppers-programme",
  ],
  locations: [
    "adyar-chennai",
    "choolaimedu-chennai",
    "koramangala-bangalore",
    "indiranagar-bangalore",
    "banjara-hills-hyderabad",
    "bandra-mumbai",
    "connaught-place-delhi",
    "rs-puram-coimbatore",
  ],
  people: ["Dr. Meera Venkatesh", "Rajesh Sundaram", "Anitha Krishnan"],
  testimonials: ["Siddharth Raman", "Priyanka Nambiar", "Anand Vardhan", "Meenakshi Sundaram"],
  benefits: [
    "Deeper, Restful Sleep",
    "Lower Everyday Stress",
    "Healthier Blood Flow",
    "Balanced Digestion",
    "Mind-Body Connection",
    "Complete Relaxation",
    "Natural Pain Relief",
    "Renewed Energy",
    "Gentle Detox Support",
    "Stronger Natural Defences",
    "Easier Movement",
    "Clearer Focus",
  ],
  faqs: [
    "How does foot reflexology differ from a standard foot massage?",
    "What should I wear when visiting a Zen Steps centre?",
    "Is stone-path walking painful for sensitive feet?",
    "Can pregnant women take reflexology sessions?",
    "How does the Zen Steps Franchise model operate across India?",
    "What hygiene and sterilization protocols are followed?",
  ],
};

// Only overwrite settings still holding the seed placeholder.
const SETTINGS = [
  { key: "phone", from: "+91 1800 123 4567", to: CONTACT.phone },
  { key: "whatsapp", from: "+9118001234567", to: "+918925383388" },
  { key: "address", from: "42, Gandhi Nagar Main Road, Adyar, Chennai - 600020", to: CONTACT.address },
  { key: "tagline", from: "Walk Your Way to Wellness", to: "Where foot care begins with passion" },
];

const verb = (live, planned) => (dry ? planned : live);

async function hide(label, delegate, where) {
  const filter = { ...where, isActive: true };
  const n = await delegate.count({ where: filter });
  if (n && !dry) await delegate.updateMany({ where: filter, data: { isActive: false } });
  console.log(`${verb("hid", "would hide")} ${n} placeholder ${label}`);
}

async function addMissing(label, delegate, key, rows) {
  for (const row of rows) {
    if (await delegate.findFirst({ where: { [key]: row[key] } })) {
      console.log(`kept ${label}: ${row[key]}`);
      continue;
    }
    if (!dry) await delegate.create({ data: row });
    console.log(`${verb("added", "would add")} ${label}: ${row[key]}`);
  }
}

async function main() {
  await addMissing(
    "service",
    prisma.service,
    "slug",
    THERAPIES.map((t, i) => ({ ...t, benefits: [...t.benefits], sortOrder: i + 1, isActive: true }))
  );
  await hide("services", prisma.service, { slug: { in: PLACEHOLDERS.services } });

  await addMissing(
    "benefit",
    prisma.benefit,
    "title",
    DEFAULT_BENEFITS.map((b, i) => ({ ...b, sortOrder: i + 1, isActive: true }))
  );
  await hide("benefits", prisma.benefit, { title: { in: PLACEHOLDERS.benefits } });

  await addMissing("FAQ", prisma.fAQ, "question", DEFAULT_FAQS.map((f) => ({ ...f, isActive: true })));
  await hide("FAQs", prisma.fAQ, { question: { in: PLACEHOLDERS.faqs } });

  await addMissing("centre", prisma.location, "slug", [
    {
      name: "Zen Steps Ambattur",
      slug: "zen-steps-ambattur",
      city: "Chennai",
      state: "Tamil Nadu",
      address: CONTACT.address,
      phone: CONTACT.phone,
      mapUrl: CONTACT.mapUrl,
      image: "/images/session-room.jpg",
      isActive: true,
    },
  ]);
  await hide("centres", prisma.location, { slug: { in: PLACEHOLDERS.locations } });

  await hide("testimonials", prisma.testimonial, { name: { in: PLACEHOLDERS.testimonials } });
  await hide("team members", prisma.teamMember, { name: { in: PLACEHOLDERS.people } });

  const byline = { author: { in: PLACEHOLDERS.people } };
  const posts = await prisma.blogPost.count({ where: byline });
  if (posts && !dry) await prisma.blogPost.updateMany({ where: byline, data: { author: "Zen Steps" } });
  console.log(`${verb("credited", "would credit")} ${posts} blog posts to "Zen Steps"`);

  for (const s of SETTINGS) {
    const row = await prisma.siteSettings.findUnique({ where: { key: s.key } });
    if (row?.value !== s.from) {
      console.log(`kept setting ${s.key}`);
      continue;
    }
    if (!dry) await prisma.siteSettings.update({ where: { key: s.key }, data: { value: s.to } });
    console.log(`${verb("updated", "would update")} setting ${s.key}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
