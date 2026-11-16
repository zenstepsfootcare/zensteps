import React from "react";
import { FRANCHISE_FROM } from "@/lib/franchise";
import { QuickEnquiryForm } from "@/components/QuickEnquiryForm";

/** The enquiry form card that sits beside the hero copy. */
export function HeroEnquiryCard({ source }: { source: string }) {
  return (
    <div id="hero-enquiry" className="border-t-4 border-gold bg-paper p-6 text-ink sm:p-7">
      <span className="eyebrow">Franchise starting from {FRANCHISE_FROM}</span>
      <h2 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">Enquire Now</h2>
      <p className="mt-1 text-sm text-secondary">Get the franchise details or book a session. We will call you back.</p>
      <div className="mt-5">
        <QuickEnquiryForm source={source} compact />
      </div>
    </div>
  );
}
