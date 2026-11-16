"use client";

import React, { useId, useMemo, useState } from "react";
import { FiRotateCcw } from "react-icons/fi";
import { COST_FIELDS, PLAN_PRESETS, computeRoi, type RoiCosts, type RoiInputs } from "@/lib/roi";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Math.round(n));

/** Inputs are held as text so a field can sit empty while it is retyped; empty counts as 0. */
type Form = { appointments: string; billing: string; royalty: string } & Record<keyof RoiCosts, string>;

const toForm = (i: RoiInputs): Form => ({
  appointments: String(i.appointmentsPerDay),
  billing: String(i.averageBilling),
  royalty: String(i.royalty),
  ...(Object.fromEntries(Object.entries(i.costs).map(([k, v]) => [k, String(v)])) as Record<keyof RoiCosts, string>),
});

const digits = (v: string, max = 10_000_000) => {
  const d = v.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  return d === "" ? "" : String(Math.min(Number(d), max));
};
const n = (v: string) => Number(v) || 0;

function MoneyInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted" aria-hidden="true">
        ₹
      </span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(digits(e.target.value))}
        className="field pl-8 text-right tabular-nums"
      />
    </div>
  );
}

/**
 * Pick a setup to load the brochure's figures, then change any of them. Every result
 * follows from appointments × billing − monthly costs; royalty starts in month 7.
 */
export function RoiCalculator({ disclaimer }: { disclaimer: string }) {
  const uid = useId();
  const [plan, setPlan] = useState(0);
  const preset = PLAN_PRESETS[plan].inputs;
  const [form, setForm] = useState<Form>(() => toForm(preset));
  const set = (key: keyof Form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const choose = (i: number) => {
    setPlan(i);
    setForm(toForm(PLAN_PRESETS[i].inputs));
  };

  const result = useMemo(
    () =>
      computeRoi({
        ...preset,
        appointmentsPerDay: n(form.appointments),
        averageBilling: n(form.billing),
        royalty: n(form.royalty),
        costs: Object.fromEntries(COST_FIELDS.map(({ key }) => [key, n(form[key])])) as RoiCosts,
      }),
    [form, preset]
  );

  const edited = JSON.stringify(form) !== JSON.stringify(toForm(preset));
  const profitable = result.monthlyProfit > 0;
  const share = Math.min(100, Math.max(0, result.margin));
  const sliderMax = Math.max(60, n(form.appointments));

  return (
    <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
      {/* Inputs */}
      <div className="border border-border bg-white p-5 sm:p-7 lg:col-span-7">
        <div role="group" aria-label="Setup" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {PLAN_PRESETS.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => choose(i)}
              aria-pressed={plan === i}
              className={`min-h-11 border px-3 py-2 text-sm font-semibold transition-colors ${
                plan === i ? "border-brand bg-brand text-white" : "border-border bg-paper text-ink hover:border-brand"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mt-7">
          <label htmlFor={`${uid}-appointments`} className="label">
            Appointments per day
          </label>
          <div className="flex items-center gap-4">
            <input
              id={`${uid}-appointments`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={form.appointments}
              onChange={(e) => set("appointments", digits(e.target.value, 500))}
              className="field w-24 shrink-0 text-right tabular-nums"
            />
            <input
              type="range"
              min={0}
              max={sliderMax}
              value={Math.min(n(form.appointments), sliderMax)}
              onChange={(e) => set("appointments", e.target.value)}
              aria-label="Appointments per day"
              aria-valuetext={`${form.appointments || 0} appointments`}
              className="h-2 w-full cursor-pointer accent-[#04362b]"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-billing`} className="label">
              Average billing per customer
            </label>
            <MoneyInput id={`${uid}-billing`} value={form.billing} onChange={(v) => set("billing", v)} />
            <p className="mt-1.5 text-xs text-muted">Therapies range from ₹450 to ₹1,100.</p>
          </div>
          <div>
            <label htmlFor={`${uid}-royalty`} className="label">
              Royalty per month
            </label>
            <MoneyInput id={`${uid}-royalty`} value={form.royalty} onChange={(v) => set("royalty", v)} />
            <p className="mt-1.5 text-xs text-muted">Only from the 7th month onwards.</p>
          </div>
        </div>

        <div className="mt-7 border-t border-border pt-6">
          <fieldset>
            <legend className="eyebrow mb-4">Monthly costs</legend>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {COST_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label htmlFor={`${uid}-${key}`} className="label">
                    {label}
                  </label>
                  <MoneyInput id={`${uid}-${key}`} value={form[key]} onChange={(v) => set(key, v)} />
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          type="button"
          onClick={() => choose(plan)}
          disabled={!edited}
          className="btn btn-outline mt-7 disabled:opacity-40"
        >
          <FiRotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset to {PLAN_PRESETS[plan].label.split(" ·")[0]} figures
        </button>
      </div>

      {/* Results */}
      <div className="lg:sticky lg:top-28 lg:col-span-5">
        <div className="bg-brand p-6 text-white sm:p-8" aria-live="polite">
          <p className="eyebrow-gold">Estimated net profit per month</p>
          <p className={`mt-2 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl ${profitable ? "text-gold" : "text-red-300"}`}>
            {inr(result.monthlyProfit)}
          </p>
          <p className="mt-1 text-sm text-white/70">Months 1–6, before royalty</p>

          <div className="mt-6 flex h-2.5 overflow-hidden bg-white/15" role="img" aria-label={`${share}% of turnover is profit`}>
            <div className="bg-gold transition-[width] duration-300" style={{ width: `${share}%` }} />
          </div>
          <p className="mt-2 text-sm text-white/70">{result.margin}% of turnover is profit</p>

          <dl className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
            {[
              ["Sales per day", inr(result.dailySales)],
              ["Monthly turnover", inr(result.monthlyTurnover)],
              ["Total expenses per month", inr(result.monthlyExpense)],
              ["Profit per month from month 7", inr(result.profitAfterRoyalty)],
              ["First-year profit", inr(result.firstYearProfit)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <dt className="text-white/70">{label}</dt>
                <dd className="font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 bg-brand-dark px-4 py-3 text-sm leading-relaxed">
            {result.paybackMonths !== null ? (
              <>
                Recovers the {inr(preset.investment)} investment in about{" "}
                <strong className="text-gold">
                  {result.paybackMonths} {result.paybackMonths === 1 ? "month" : "months"}
                </strong>
                .
              </>
            ) : (
              "At these figures the centre does not cover its costs."
            )}
          </p>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">{disclaimer}</p>
      </div>
    </div>
  );
}
