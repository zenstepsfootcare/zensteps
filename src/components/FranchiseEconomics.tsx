import React from "react";
import { FiInfo } from "react-icons/fi";
import { SectionHeader } from "@/components/SectionHeader";
import { RoiCalculator } from "@/components/RoiCalculator";
import { FRANCHISE_FROM, PLANS, ROI_NOTE, ROI_PROFIT, ROI_ROWS } from "@/lib/franchise";

/** Investment plans, investment breakdown and the monthly ROI projection (from the brochure). */
export function FranchiseEconomics() {
  return (
    <section id="investment" className="section bg-paper">
      <div className="container-site">
        <SectionHeader
          eyebrow="Investment Plans"
          title={`Start Your Zen Steps Centre From ${FRANCHISE_FROM}`}
          subtitle="Three setup sizes, from a single-seater studio to a 3+ seater centre. Pick the one that fits your space and budget."
          className="mb-10 lg:mb-12"
        />

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <li key={plan.key} className="flex flex-col bg-cream">
              <div className="aspect-[16/7] overflow-hidden bg-border">
                <img
                  src={plan.image}
                  alt={`${plan.name} therapy room with ${plan.seats.toLowerCase()} reflexology chairs`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="eyebrow">{plan.seats}</span>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{plan.name}</h3>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-brand tabular-nums">{plan.total}</p>
                <p className="text-sm text-muted">Total investment</p>

                <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-secondary">Franchise fee</dt>
                    <dd className="font-semibold text-ink tabular-nums">{plan.franchiseFee}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-secondary">Interior design</dt>
                    <dd className="text-right font-semibold text-ink tabular-nums">{plan.interior ?? "Not required"}</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-6">
                  <a href="#apply" className="btn btn-brand w-full">
                    Apply for {plan.name}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Monthly ROI */}
        <div id="roi" className="mt-16 scroll-mt-28 lg:mt-20">
          <div className="mb-6 max-w-3xl">
            <span className="eyebrow mb-3">Monthly ROI</span>
            <h3 className="text-2xl font-semibold tracking-tight text-ink lg:text-[1.75rem]">
              Estimated Monthly Revenue &amp; Profit Projection
            </h3>
          </div>

          <div className="overflow-x-auto border border-border bg-white">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="sr-only">Estimated monthly revenue, expenses and profit for each setup</caption>
              <thead>
                <tr className="bg-brand text-white">
                  {/* The label column stays put while the plan columns scroll on small screens. */}
                  <th scope="col" className="sticky left-0 z-10 w-44 bg-brand px-4 py-3.5 text-left font-semibold sm:w-auto">
                    Business details
                  </th>
                  {PLANS.map((plan) => (
                    <th key={plan.key} scope="col" className="px-4 py-3.5 text-right font-semibold">
                      <span className="block text-gold">{plan.name.replace(" Setup", "")}</span>
                      <span className="block text-xs font-medium text-white/70">{plan.seats}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROI_ROWS.map((row, i) => {
                  const total = i === ROI_ROWS.length - 1;
                  return (
                    <tr key={row.label} className={`border-t border-border ${total ? "bg-cream font-semibold" : ""}`}>
                      <th
                        scope="row"
                        className={`sticky left-0 z-10 px-4 py-3 text-left font-medium text-ink ${total ? "bg-cream" : "bg-white"}`}
                      >
                        {row.label}
                      </th>
                      {row.values.map((v, j) => (
                        <td key={j} className="px-4 py-3 text-right text-secondary tabular-nums">
                          {v}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-brand-dark text-white">
                  <th scope="row" className="sticky left-0 z-10 bg-brand-dark px-4 py-4 text-left text-base font-semibold text-gold">
                    Estimated monthly profit
                  </th>
                  {ROI_PROFIT.map((v) => (
                    <td key={v} className="px-4 py-4 text-right text-lg font-semibold text-gold tabular-nums">
                      {v}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-secondary">
            <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <span>{ROI_NOTE}</span>
          </p>
        </div>

        {/* Interactive ROI calculator */}
        <div id="roi-calculator" className="mt-16 scroll-mt-28 lg:mt-20">
          <div className="mb-6 max-w-3xl">
            <span className="eyebrow mb-3">ROI Calculator</span>
            <h3 className="text-2xl font-semibold tracking-tight text-ink lg:text-[1.75rem]">Work Out Your Own Returns</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-secondary">
              Pick a setup to start from the brochure figures, then change appointments, billing or any monthly cost
              to match your location.
            </p>
          </div>
          <RoiCalculator disclaimer={ROI_NOTE} />
        </div>
      </div>
    </section>
  );
}
