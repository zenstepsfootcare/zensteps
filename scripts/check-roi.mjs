// Run: node scripts/check-roi.mjs   (Node 23.6+ strips the TS types)
// The calculator must open on exactly the brochure's Monthly ROI figures.
import assert from "node:assert/strict";
import { PLAN_PRESETS, computeRoi } from "../src/lib/roi.ts";
import { PLANS, ROI_PROFIT, ROI_ROWS } from "../src/lib/franchise.ts";

const num = (s) => Number(String(s).replace(/[^\d]/g, "")) || 0;
const row = (start, i) => num(ROI_ROWS.find((r) => r.label.startsWith(start)).values[i]);

PLAN_PRESETS.forEach((preset, i) => {
  const r = computeRoi(preset.inputs);
  assert.equal(preset.key, PLANS[i].key);
  assert.equal(preset.inputs.investment, num(PLANS[i].total), preset.key);
  assert.equal(preset.inputs.appointmentsPerDay, row("Expected appointments", i), preset.key);
  assert.equal(r.dailySales, row("Expected sales", i), preset.key);
  assert.equal(r.monthlyTurnover, row("Monthly turnover", i), preset.key);
  assert.equal(r.monthlyExpense, row("Total expenses", i), preset.key);
  assert.equal(r.monthlyProfit, num(ROI_PROFIT[i]), preset.key);
  assert.ok(r.paybackMonths !== null && r.paybackMonths <= 6, `${preset.key} breaks even within 6 months`);
});

// Royalty only from month 7: Essential = 6 × 1,30,000 + 6 × 1,25,000.
assert.equal(computeRoi(PLAN_PRESETS[0].inputs).firstYearProfit, 6 * 130000 + 6 * 125000);

// A centre that never covers its costs has no payback; payback spanning the royalty month is counted.
const base = PLAN_PRESETS[0].inputs;
assert.equal(computeRoi({ ...base, appointmentsPerDay: 1 }).paybackMonths, null);
const slow = computeRoi({ ...base, appointmentsPerDay: 4, costs: { ...base.costs, salary: 0, food: 0, consumables: 0 }, investment: 400000 });
// 4 × 450 × 30 = 54,000/month for 6 months (3,24,000), then 49,000/month: covered in month 8.
assert.equal(slow.paybackMonths, 8);

console.log("roi checks passed");
