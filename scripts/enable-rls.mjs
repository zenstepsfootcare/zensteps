// Turn on Row Level Security for every table in the public schema of DATABASE_URL.
// Run: node --env-file=.env scripts/enable-rls.mjs   (again after any `prisma db push` that adds a table)
//
// Supabase exposes `public` through its REST API to anyone holding the project's anon key.
// With RLS on and no policies, that API returns nothing; Prisma connects as the table owner
// (postgres), which bypasses RLS, so the website and admin are unaffected.
import pkg from "@prisma/client";

const db = new pkg.PrismaClient();
const tables = await db.$queryRawUnsafe(
  `select c.relname as name, c.relrowsecurity as rls
     from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' order by 1`
);
for (const t of tables) {
  if (!t.rls) await db.$executeRawUnsafe(`alter table public."${t.name.replace(/"/g, '""')}" enable row level security`);
  console.log(`${t.name}: ${t.rls ? "already on" : "enabled"}`);
}
await db.$disconnect();
