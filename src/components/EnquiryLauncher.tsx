"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FiMessageSquare, FiPhone, FiX } from "react-icons/fi";
import { ENQUIRY_SENT_KEY, QuickEnquiryForm } from "@/components/QuickEnquiryForm";

const SEEN_KEY = "zen-enquiry-popup-seen"; // per visit (sessionStorage)
const OPENED_KEY = "zen-enquiry-opened"; // stops the button blinking once used
const POPUP_DELAY_MS = 4000;
/** Pages that already are a form, or the end of one. */
const NO_AUTO_POPUP = ["/thanks", "/contact"];

const read = (store: () => Storage, key: string) => {
  try {
    return store().getItem(key);
  } catch {
    return null;
  }
};
const write = (store: () => Storage, key: string) => {
  try {
    store().setItem(key, "1");
  } catch {}
};

/**
 * Site-wide enquiry entry points, rendered by the public Footer:
 * - a popup with the quick enquiry form that opens by itself once per visit,
 * - a blinking "Enquire now" button (desktop) / sticky Call + Enquire bar (mobile).
 * Any element can also open the popup with `window.dispatchEvent(new Event("zen:enquire"))`.
 */
export function EnquiryLauncher({ phone, phoneHref, offer }: { phone: string; phoneHref: string; offer: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // The buttons blink until the form has been opened once this visit; CSS reads this flag.
  const markOpened = () => document.documentElement.setAttribute("data-enquiry-opened", "");

  const open = useCallback(() => {
    const d = dialog.current;
    if (!d || d.open) return;
    d.showModal();
    write(() => sessionStorage, SEEN_KEY);
    write(() => sessionStorage, OPENED_KEY);
    markOpened();
  }, []);

  useEffect(() => {
    if (read(() => sessionStorage, OPENED_KEY)) markOpened();
    window.addEventListener("zen:enquire", open);
    return () => window.removeEventListener("zen:enquire", open);
  }, [open]);

  // Open once per visit, a few seconds in, unless they already enquired or another dialog is up.
  useEffect(() => {
    if (NO_AUTO_POPUP.some((p) => pathname.startsWith(p))) return;
    if (read(() => sessionStorage, SEEN_KEY) || read(() => localStorage, ENQUIRY_SENT_KEY)) return;
    const timer = window.setTimeout(() => {
      // Re-check: a button may already have opened (and they closed) the popup during the delay.
      if (!document.querySelector("dialog[open]") && !read(() => sessionStorage, SEEN_KEY)) open();
    }, POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, open]);

  return (
    <>
      {/* Desktop: floating button */}
      <button
        type="button"
        onClick={open}
        className="btn btn-gold zen-blink fixed bottom-6 right-6 z-40 hidden shadow-lg lg:inline-flex"
      >
        <FiMessageSquare className="h-4 w-4" aria-hidden="true" />
        Enquire Now
      </button>

      {/* Mobile: sticky action bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/10 bg-brand-dark px-3 pt-2 lg:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <a href={phoneHref} className="btn btn-dark min-h-11 flex-1 border border-white/20" aria-label={`Call ${phone}`}>
          <FiPhone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
        <button type="button" onClick={open} className="btn btn-gold zen-blink min-h-11 flex-[2]">
          <FiMessageSquare className="h-4 w-4" aria-hidden="true" />
          Enquire Now
        </button>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="enquiry-popup-title"
        // A click on the backdrop lands on the <dialog> itself; clicks inside land on its children.
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(56rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain bg-paper p-0 text-ink backdrop:bg-brand-dark/70"
      >
        <div className="grid md:grid-cols-[1fr_1.1fr]">
          <div className="relative hidden bg-brand md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/lounge.jpg" alt="" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-x-0 bottom-0 bg-brand-dark/85 p-6 text-white">
              <p className="eyebrow-gold">{offer}</p>
              <p className="mt-2 text-lg font-semibold leading-snug">Your success. Their empowerment. Together, we heal.</p>
            </div>
          </div>
          <div className="relative p-6 sm:p-8">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center text-secondary transition-colors hover:bg-cream hover:text-ink"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="eyebrow pr-10">{offer}</span>
            <h2 id="enquiry-popup-title" className="mt-2 pr-8 text-2xl font-semibold tracking-tight">
              Enquire Now
            </h2>
            <p className="mt-1.5 text-sm text-secondary">
              Leave your details and we will call you, or call us on{" "}
              <a href={phoneHref} className="font-semibold text-brand">
                {phone}
              </a>
              .
            </p>
            <div className="mt-5">
              <QuickEnquiryForm source="website popup" compact />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
