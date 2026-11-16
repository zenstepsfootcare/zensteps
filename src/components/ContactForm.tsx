"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import { THERAPIES } from "@/lib/franchise";

const FIRST_VISIT = "Not sure yet – help me choose";

// useSearchParams() needs a Suspense boundary for static prerendering; the fallback reserves the form's space.
export function ContactForm() {
  return (
    <Suspense fallback={<div className="min-h-[680px] border border-border bg-white" aria-hidden="true" />}>
      <ContactFormInner />
    </Suspense>
  );
}

function ContactFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";
  const preselectedLocation = searchParams.get("location") || "";
  const preselectedTherapy = THERAPIES.find((t) => t.slug === preselectedService)?.title;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: preselectedLocation ? "Chennai" : "",
    interest: preselectedTherapy ?? FIRST_VISIT,
    message: preselectedLocation ? `Preferred centre: ${preselectedLocation}` : "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.city.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "general",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          interest: form.interest,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed. Please check your details.");
      }

      toast.success("Enquiry received! We will call you to confirm your slot.");
      router.push("/thanks");
    } catch (err) {
      toast.error((err instanceof Error && err.message) || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="@container border border-border bg-white p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <span className="eyebrow">Book a Session</span>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Book Your Foot Reflexology Session
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-secondary">
          Tell us the therapy and time that suit you. We will call you to confirm your slot.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 @lg:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">
            Your Name <span className="text-brand-light">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Ananya Rao"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="label">
            Email Address <span className="text-brand-light">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ananya@example.com"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="label">
            Contact Number <span className="text-brand-light">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex shrink-0 items-center border border-r-0 border-border bg-cream px-3.5 text-sm font-medium text-secondary">
              +91
            </span>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              required
              autoComplete="tel-national"
              value={form.phone}
              onChange={handleChange}
              placeholder="98765 43210"
              className="field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-city" className="label">
            Your City <span className="text-brand-light">*</span>
          </label>
          <input
            id="contact-city"
            type="text"
            name="city"
            required
            autoComplete="address-level2"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Chennai"
            className="field"
          />
        </div>

        <div className="@lg:col-span-2">
          <label htmlFor="contact-interest" className="label">
            Therapy
          </label>
          <select
            id="contact-interest"
            name="interest"
            value={form.interest}
            onChange={handleChange}
            className="field"
          >
            {THERAPIES.map((t) => (
              <option key={t.slug} value={t.title}>
                {t.title} ({t.duration} · {t.price})
              </option>
            ))}
            <option value={FIRST_VISIT}>{FIRST_VISIT}</option>
          </select>
        </div>

        <div className="@lg:col-span-2">
          <label htmlFor="contact-message" className="label">
            Specific Concerns or Preferred Time Slot
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="E.g. 60-minute session, Saturday morning, first visit…"
            className="field"
          />
        </div>
      </div>

      <div className="mt-8">
        <button type="submit" disabled={loading} className="btn btn-brand w-full sm:w-auto sm:px-8">
          <span>{loading ? "Submitting…" : "Request a Session"}</span>
          <FiArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
