import React from "react";
import { BrandIcon } from "@/components/BrandIcon";
import { WHY_CHOOSE } from "@/lib/franchise";

export function WhyChooseUs() {
  return (
    <section id="why-zen-steps" className="section bg-brand text-white">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow-gold">Why Choose Us</span>
          <h2 className="h2 mt-3 text-white">Why Choose a Zen Steps Franchise</h2>
          <p className="lead mt-4 text-white/80">
            A low-investment wellness business with the brand behind you at every step, from setup to staffing to
            marketing.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {WHY_CHOOSE.map((item) => (
            <li key={item.title} className="bg-brand p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center bg-brand-dark text-gold">
                <BrandIcon name={item.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-gold">{item.title}</h3>
              {item.highlight && (
                <p className="mt-3 inline-block bg-gold px-3 py-1 text-sm font-bold uppercase tracking-wide text-brand">
                  {item.highlight}
                </p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-[15px]">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
