import React from "react";
import { FiAward } from "react-icons/fi";
import { FRANCHISE_FROM, TAGLINES } from "@/lib/franchise";

/** The headline offer, set large: "Franchise starting from ₹1.5 Lakh". */
export function FranchisePriceBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-4 border-2 border-gold bg-brand-dark/85 px-5 py-3.5 sm:gap-5 sm:px-6 ${className}`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center bg-gold text-brand sm:h-14 sm:w-14" aria-hidden="true">
        <FiAward className="h-6 w-6 sm:h-7 sm:w-7" />
      </span>
      <span className="text-left">
        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/85">Franchise starting from</span>
        <span className="block text-3xl font-bold leading-tight tracking-tight text-gold sm:text-4xl">{FRANCHISE_FROM}</span>
        <span className="block text-xs italic text-white/75">{TAGLINES.journey}</span>
      </span>
    </div>
  );
}
