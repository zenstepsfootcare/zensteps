import React from "react";
import { FiCheck } from "react-icons/fi";
import { BRAND_SUPPORT, PARTNER_CRITERIA, ROYALTY } from "@/lib/franchise";

/** What the brand provides, the royalty, and who makes a good franchise partner. */
export function BrandSupport() {
  return (
    <section id="support" className="section bg-cream">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col bg-paper p-6 sm:p-8 lg:p-10">
            <span className="eyebrow">Brand Support</span>
            <h2 className="h2 mt-3 text-ink">We Set You Up and Stay With You</h2>
            <ul className="mt-6 space-y-3.5">
              {BRAND_SUPPORT.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-secondary">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-brand text-gold">
                    <FiCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <div className="flex flex-col gap-1 bg-brand p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <span className="eyebrow-gold">Royalty fee</span>
                  <p className="mt-1 text-sm text-white/80">{ROYALTY.from}</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-gold tabular-nums">{ROYALTY.amount}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-paper">
            <div className="aspect-[16/7] overflow-hidden bg-border">
              <img
                src="/images/spa-bowl.jpg"
                alt="Folded towels, aromatic oils and a brass foot bowl with floating flowers"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <span className="eyebrow">Franchise Partner</span>
              <h2 className="h2 mt-3 text-ink">Who We Are Looking For</h2>
              <ul className="mt-6 space-y-3.5">
                {PARTNER_CRITERIA.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-secondary">
                    <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-brand" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
