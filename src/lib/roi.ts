// The ROI calculator's model: the brochure's Monthly ROI table, made interactive.
// Import-free so scripts/check-roi.mjs can verify it against the brochure figures.

export type RoiCosts = {
  consumables: number;
  salary: number;
  rent: number;
  food: number;
  electricity: number;
};

export type RoiInputs = {
  appointmentsPerDay: number;
  averageBilling: number;
  daysPerMonth: number;
  costs: RoiCosts;
  /** Royalty per month, charged only from `royaltyFromMonth` onwards (brochure: ₹5,000 from month 7). */
  royalty: number;
  royaltyFromMonth: number;
  investment: number;
};

export const COST_FIELDS: { key: keyof RoiCosts; label: string }[] = [
  { key: "consumables", label: "Consumables" },
  { key: "salary", label: "Staff salary" },
  { key: "rent", label: "Rent" },
  { key: "food", label: "Staff food & accommodation" },
  { key: "electricity", label: "Electricity bill" },
];

/** The three brochure setups, in PLANS order (src/lib/franchise.ts). */
export const PLAN_PRESETS: { key: string; label: string; inputs: RoiInputs }[] = [
  {
    key: "essential",
    label: "Essential · 1 seater",
    inputs: {
      appointmentsPerDay: 12,
      averageBilling: 450,
      daysPerMonth: 30,
      costs: { consumables: 7000, salary: 15000, rent: 0, food: 10000, electricity: 0 },
      royalty: 5000,
      royaltyFromMonth: 7,
      investment: 150000,
    },
  },
  {
    key: "signature",
    label: "Signature · 2 seater",
    inputs: {
      appointmentsPerDay: 23,
      averageBilling: 450,
      daysPerMonth: 30,
      costs: { consumables: 13000, salary: 30000, rent: 15000, food: 15000, electricity: 7000 },
      royalty: 5000,
      royaltyFromMonth: 7,
      investment: 350000,
    },
  },
  {
    key: "premium",
    label: "Premium · 3+ seater",
    inputs: {
      appointmentsPerDay: 45,
      averageBilling: 450,
      daysPerMonth: 30,
      costs: { consumables: 20000, salary: 60000, rent: 25000, food: 20000, electricity: 10000 },
      royalty: 5000,
      royaltyFromMonth: 7,
      investment: 450000,
    },
  },
];

export type RoiResult = {
  dailySales: number;
  monthlyTurnover: number;
  monthlyExpense: number;
  /** Months 1–6, before royalty: the brochure's "Estimated Monthly Profit". */
  monthlyProfit: number;
  /** From the royalty month onwards. */
  profitAfterRoyalty: number;
  /** Whole-number percent of turnover kept as profit (before royalty). */
  margin: number;
  firstYearProfit: number;
  /** Months until cumulative profit covers the investment; null if not within 10 years. */
  paybackMonths: number | null;
};

const MAX_MONTHS = 120;

export function computeRoi(i: RoiInputs): RoiResult {
  const dailySales = i.appointmentsPerDay * i.averageBilling;
  const monthlyTurnover = dailySales * i.daysPerMonth;
  const monthlyExpense = Object.values(i.costs).reduce((sum, v) => sum + v, 0);
  const monthlyProfit = monthlyTurnover - monthlyExpense;
  const profitAfterRoyalty = monthlyProfit - i.royalty;
  const profitInMonth = (m: number) => (m >= i.royaltyFromMonth ? profitAfterRoyalty : monthlyProfit);

  let firstYearProfit = 0;
  for (let m = 1; m <= 12; m++) firstYearProfit += profitInMonth(m);

  let paybackMonths: number | null = null;
  if (i.investment <= 0) paybackMonths = 0;
  else {
    let recovered = 0;
    for (let m = 1; m <= MAX_MONTHS; m++) {
      recovered += profitInMonth(m);
      if (recovered >= i.investment) {
        paybackMonths = m;
        break;
      }
    }
  }

  return {
    dailySales,
    monthlyTurnover,
    monthlyExpense,
    monthlyProfit,
    profitAfterRoyalty,
    margin: monthlyTurnover > 0 ? Math.round((monthlyProfit / monthlyTurnover) * 100) : 0,
    firstYearProfit,
    paybackMonths,
  };
}
