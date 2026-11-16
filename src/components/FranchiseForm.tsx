"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { INDIAN_STATES } from "@/lib/constants";
import { PLAN_OPTIONS } from "@/lib/franchise";

export function FranchiseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    investment: PLAN_OPTIONS[PLAN_OPTIONS.length - 1],
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in your contact information.");
      return;
    }

    if (!form.state) {
      toast.error("Please select your state.");
      return;
    }

    if (!form.city.trim()) {
      toast.error("Please specify your target city.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "franchise",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          state: form.state,
          city: form.city.trim(),
          investment: form.investment,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed. Please check the form.");
      }

      toast.success("Application submitted successfully!");
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
        <span className="eyebrow">Franchise Application</span>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Start Your Zen Steps Centre
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-secondary">
          Share a few details and our franchise team will call you to discuss the setup that suits you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 @lg:grid-cols-2">
        <div>
          <label htmlFor="franchise-name" className="label">
            Full Name <span className="text-brand-light">*</span>
          </label>
          <input
            id="franchise-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Ramesh Kulkarni"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="franchise-email" className="label">
            Email Address <span className="text-brand-light">*</span>
          </label>
          <input
            id="franchise-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@business.com"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="franchise-phone" className="label">
            Contact Number <span className="text-brand-light">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex shrink-0 items-center border border-r-0 border-border bg-cream px-3.5 text-sm font-medium text-secondary">
              +91
            </span>
            <input
              id="franchise-phone"
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
          <label htmlFor="franchise-state" className="label">
            State / Union Territory <span className="text-brand-light">*</span>
          </label>
          <select
            id="franchise-state"
            name="state"
            required
            value={form.state}
            onChange={handleChange}
            className="field"
          >
            <option value="">Select your state / UT</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="franchise-city" className="label">
            City / District <span className="text-brand-light">*</span>
          </label>
          <input
            id="franchise-city"
            type="text"
            name="city"
            required
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Madurai, Coimbatore, Bengaluru"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="franchise-investment" className="label">
            Preferred Setup
          </label>
          <select
            id="franchise-investment"
            name="investment"
            value={form.investment}
            onChange={handleChange}
            className="field"
          >
            {PLAN_OPTIONS.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div className="@lg:col-span-2">
          <label htmlFor="franchise-message" className="label">
            About You and Your Space
          </label>
          <textarea
            id="franchise-message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Your business background, whether you own or rent a space, and when you would like to open…"
            className="field"
          />
        </div>
      </div>

      <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-secondary">
        <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        <span>
          By submitting, you agree to be contacted by Zen Steps about the franchise opportunity.
        </span>
      </p>

      <div className="mt-8">
        <button type="submit" disabled={loading} className="btn btn-brand w-full sm:w-auto sm:px-8">
          <span>{loading ? "Submitting…" : "Submit Franchise Application"}</span>
          <FiArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
