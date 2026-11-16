// Run: node scripts/check-franchise.mjs   (Node 23.6+ strips the TS types)
import assert from "node:assert/strict";
import { PLANS, ROI_PROFIT, ROI_ROWS, sessionOptions } from "../src/lib/franchise.ts";

assert.deepEqual(sessionOptions("40 min / 60 min", "₹450 / ₹550"), [
  { duration: "40 min", price: "₹450" },
  { duration: "60 min", price: "₹550" },
]);
assert.deepEqual(sessionOptions("75 min", "₹1,000"), [{ duration: "75 min", price: "₹1,000" }]);
assert.deepEqual(sessionOptions("45 minutes", null), [{ duration: "45 minutes", price: "" }]);
assert.deepEqual(sessionOptions("40 min / 60 min", "₹600"), [
  { duration: "40 min", price: "₹600" },
  { duration: "60 min", price: "₹600" },
]);
assert.deepEqual(sessionOptions(null, undefined), []);

// The brochure's ROI table must add up for every plan.
const num = (s) => Number(String(s).replace(/[^\d]/g, "")) || 0;
PLANS.forEach((plan, i) => {
  const row = (start) => num(ROI_ROWS.find((r) => r.label.startsWith(start)).values[i]);
  const expenses = ["Consumables", "Staff salary", "Rent", "Staff food", "Electricity"].reduce((sum, l) => sum + row(l), 0);
  assert.equal(row("Expected appointments") * row("Average billing"), row("Expected sales"), plan.key);
  assert.equal(row("Expected sales") * 30, row("Monthly turnover"), plan.key);
  assert.equal(expenses, row("Total expenses"), plan.key);
  assert.equal(row("Monthly turnover") - row("Total expenses"), num(ROI_PROFIT[i]), plan.key);
  assert.equal(num(plan.franchiseFee) + num(plan.interior ?? ""), num(plan.total), plan.key);
});

console.log("franchise content checks passed");
