// Run: node scripts/check-admin.mjs   (Node 23.6+ strips the TS types)
import assert from "node:assert/strict";
import { createdAtRange, filtersQuery, parseFilters } from "../src/lib/admin/filters.ts";

// Filters: unknown values fall back, reversed custom ranges are swapped, page 1 is implied.
const f = parseFilters({ q: " ravi ", status: "NEW", date: "custom", from: "2026-11-10", to: "2026-11-01", page: "3", size: "999" }, ["new", "contacted"]);
assert.deepEqual(f, { q: "ravi", status: "new", date: "custom", from: "2026-11-01", to: "2026-11-10", page: 3, size: 25 });
assert.equal(parseFilters({ status: "bogus", date: "never" }, ["new"]).status, "");
assert.equal(parseFilters({ from: "2026-11-01" }).date, "custom");
assert.equal(filtersQuery(f, { status: "contacted" }), "?q=ravi&status=contacted&date=custom&from=2026-11-01&to=2026-11-10");
assert.equal(filtersQuery(f, { page: 2 }), "?q=ravi&status=new&date=custom&from=2026-11-01&to=2026-11-10&page=2");

// Day windows are IST midnights: 10:00 IST on 14 Nov 2026 is 04:30 UTC.
const now = Date.parse("2026-11-14T04:30:00Z");
assert.deepEqual(createdAtRange({ date: "today", from: "", to: "" }, now), {
  gte: new Date("2026-11-13T18:30:00Z"),
  lt: new Date("2026-11-14T18:30:00Z"),
});
assert.equal(createdAtRange({ date: "7d", from: "", to: "" }, now).gte.toISOString(), "2026-11-07T18:30:00.000Z");
assert.deepEqual(createdAtRange({ date: "custom", from: "2026-11-01", to: "2026-11-01" }, now), {
  gte: new Date("2026-10-31T18:30:00Z"),
  lt: new Date("2026-11-01T18:30:00Z"),
});
assert.equal(createdAtRange({ date: "", from: "", to: "" }, now), undefined);

console.log("admin checks passed");
