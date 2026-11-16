import React from "react";
import { FRANCHISE_FROM } from "@/lib/franchise";

const stats = [
  { value: FRANCHISE_FROM, label: "Franchise starting from", detail: "Essential 1-seater setup" },
  { value: "6 Months", label: "Break-even", detail: "Quick break-even with efficient operations" },
  { value: "Up to 80%", label: "Profit margin", detail: "High-profit business model" },
  { value: "₹5,000", label: "Monthly royalty", detail: "Only from the 7th month onwards" },
];

export function StatsBar() {
  return (
    <section className="bg-cream" aria-label="Franchise highlights">
      <div className="container-site py-10 lg:py-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col lg:border-l lg:border-border lg:px-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="order-2 mt-2 text-sm font-semibold text-ink">{stat.label}</dt>
              <dd className="order-1 text-2xl font-semibold tracking-tight text-brand tabular-nums sm:text-3xl lg:text-4xl">
                {stat.value}
              </dd>
              <dd className="order-3 mt-1 text-sm leading-relaxed text-secondary">{stat.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
