// One-off: copy every row from the old local database into the Supabase one.
// Run: node --env-file=.env scripts/copy-local-to-supabase.mjs
// Source = LOCAL_DATABASE_URL, target = DATABASE_URL. Safe to re-run: existing ids are skipped.
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const { LOCAL_DATABASE_URL, DATABASE_URL } = process.env;
if (!LOCAL_DATABASE_URL || !DATABASE_URL) throw new Error("Set LOCAL_DATABASE_URL and DATABASE_URL");
if (LOCAL_DATABASE_URL === DATABASE_URL) throw new Error("Source and target are the same database");

const source = new PrismaClient({ datasources: { db: { url: LOCAL_DATABASE_URL } } });
const target = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

// The schema has no foreign keys, so order does not matter.
const MODELS = [
  "admin",
  "siteSettings",
  "heroSlide",
  "service",
  "location",
  "blogPost",
  "page",
  "testimonial",
  "teamMember",
  "fAQ",
  "benefit",
  "socialVideo",
  "galleryItem",
  "franchiseInquiry",
  "contactSubmission",
];

let mismatch = false;
for (const model of MODELS) {
  const rows = await source[model].findMany();
  if (rows.length) await target[model].createMany({ data: rows, skipDuplicates: true });
  const [from, to] = [rows.length, await target[model].count()];
  if (from !== to) mismatch = true;
  console.log(`${model.padEnd(18)} local ${String(from).padStart(3)}  supabase ${String(to).padStart(3)}${from === to ? "" : "  <-- differs"}`);
}

await Promise.all([source.$disconnect(), target.$disconnect()]);
if (mismatch) process.exitCode = 1;
