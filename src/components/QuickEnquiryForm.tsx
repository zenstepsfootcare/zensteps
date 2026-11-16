"use client";

import React, { useId, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import { INDIAN_STATES } from "@/lib/constants";

/** Set once a quick enquiry is sent, so the popup stops offering itself. */
export const ENQUIRY_SENT_KEY = "zen-enquiry-sent";

type Interest = "franchise" | "session";

/**
 * The short enquiry form used in the hero, the popup and behind the blinking
 * Enquire button. Franchise enquiries and session requests land in their own
 * admin lists; `source` is saved in the message so the admin shows where it came from.
 */
export function QuickEnquiryForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const id = useId();
  const router = useRouter();
  const [interest, setInterest] = useState<Interest>("franchise");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (k: string) => String(data.get(k) ?? "").trim();
    const message = `Quick enquiry from the ${source}.`;
    const body =
      interest === "franchise"
        ? { type: "franchise", name: value("name"), email: value("email"), phone: value("phone"), state: value("state"), city: value("city"), investment: "Not sure yet – help me choose", message }
        : { type: "general", name: value("name"), email: value("email"), phone: value("phone"), city: value("city"), interest: "Not sure yet – help me choose", message };

    setLoading(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Please check your details and try again.");
      try {
        localStorage.setItem(ENQUIRY_SENT_KEY, "1");
      } catch {}
      toast.success("Thank you! We will call you shortly.");
      router.push("/thanks");
    } catch (err) {
      toast.error((err instanceof Error && err.message) || "Could not send. Please try again.");
      setLoading(false);
    }
  }

  const gap = compact ? "gap-3" : "gap-4";

  return (
    <form onSubmit={submit} className={`grid grid-cols-1 ${gap}`}>
      <div role="radiogroup" aria-label="I am interested in" className="grid grid-cols-2 gap-2">
        {(
          [
            ["franchise", "Franchise"],
            ["session", "Book a session"],
          ] as const
        ).map(([value, label]) => (
          <label
            key={value}
            className={`flex min-h-11 cursor-pointer items-center justify-center border px-3 text-sm font-semibold transition-colors ${
              interest === value ? "border-brand bg-brand text-white" : "border-border bg-paper text-ink hover:border-brand"
            }`}
          >
            <input
              type="radio"
              name="interest"
              value={value}
              checked={interest === value}
              onChange={() => setInterest(value)}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="sr-only">
          Your name
        </label>
        <input id={`${id}-name`} name="name" required minLength={2} autoComplete="name" placeholder="Your name *" className="field" />
      </div>

      <div className="flex">
        <span className="inline-flex shrink-0 items-center border border-r-0 border-border bg-cream px-3 text-sm font-medium text-secondary">
          +91
        </span>
        <label htmlFor={`${id}-phone`} className="sr-only">
          Mobile number
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          required
          minLength={8}
          autoComplete="tel-national"
          inputMode="tel"
          placeholder="Mobile number *"
          className="field"
        />
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" spellCheck={false} placeholder="Email address *" className="field" />
      </div>

      <div className={interest === "franchise" ? "grid grid-cols-2 gap-2" : ""}>
        {interest === "franchise" && (
          <div>
            <label htmlFor={`${id}-state`} className="sr-only">
              State
            </label>
            <select id={`${id}-state`} name="state" required defaultValue="" className="field">
              <option value="" disabled>
                State *
              </option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor={`${id}-city`} className="sr-only">
            City
          </label>
          <input id={`${id}-city`} name="city" required minLength={2} autoComplete="address-level2" placeholder="City *" className="field" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn btn-gold w-full">
        <span>{loading ? "Sending…" : interest === "franchise" ? "Get Franchise Details" : "Request a Session"}</span>
        <FiArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <p className="text-center text-xs text-muted">We will call you back. No spam.</p>
    </form>
  );
}
