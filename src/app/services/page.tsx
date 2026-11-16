import React from "react";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { TAGLINES } from "@/lib/franchise";
import { getContact } from "@/lib/siteSettings";
import { FiPhone } from "react-icons/fi";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Therapy Menu – Zen Steps Foot Reflexology",
  description:
    "Sleep Care, Total Wellness, Blood Circulation, Women’s Hormone Balance, Muscle Relief and Detox foot reflexology sessions from ₹450 at Zen Steps, Chennai.",
};

const getServicesData = unstable_cache(
  async () => {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return { services };
  },
  ["zen-steps-services-brochure-v1"],
  { revalidate: 3600, tags: ["services"] }
);

const steps = [
  {
    step: "Step 01",
    title: "Choose Your Therapy",
    text: "Pick a session from the menu, or tell us how you feel and we will suggest one.",
  },
  {
    step: "Step 02",
    title: "Settle In",
    text: "Relax in a reclining lounge chair while your therapist prepares your feet.",
  },
  {
    step: "Step 03",
    title: "Reflexology Session",
    text: "Your therapist works the reflex points of both feet by touch, with natural, high-quality oils.",
  },
  {
    step: "Step 04",
    title: "Leave Refreshed",
    text: "Take a moment to rest and rehydrate before you head back into your day.",
  },
];

export default async function ServicesPage() {
  const [{ services }, contact] = await Promise.all([getServicesData().catch(() => ({ services: [] })), getContact()]);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Therapy Menu"
          title="Foot Reflexology Sessions for Every Need."
          subtitle="Six therapies from 40 to 75 minutes, each given by trained therapists with visual impairments. Relax, refresh and rejuvenate."
        />

        {/* Services grid */}
        <section className="section bg-paper">
          <div className="container-site">
            <SectionHeader
              eyebrow="Sessions & Prices"
              title="Choose Your Session"
              subtitle="Prices are per session. Some therapies come in two lengths; pick the one that suits your time."
              className="mb-10 lg:mb-12"
            />

            {services.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service.slug} {...service} />
                ))}
              </div>
            ) : (
              <p className="bg-cream p-8 text-center text-secondary">
                Our therapy menu is being updated. Call{" "}
                <a href={contact.phoneHref} className="font-semibold text-brand">
                  {contact.phone}
                </a>{" "}
                to book a session.
              </p>
            )}
          </div>
        </section>

        {/* What to expect */}
        <section className="section bg-cream">
          <div className="container-site">
            <SectionHeader eyebrow={TAGLINES.mantra} title="How a Session Works" className="mb-10 lg:mb-12" />

            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((item) => (
                <li key={item.step} className="bg-paper p-6">
                  <span className="text-sm font-semibold text-brand-light">{item.step}</span>
                  <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Group bookings */}
        <section className="section bg-paper">
          <div className="container-site">
            <div className="flex flex-col items-start justify-between gap-6 bg-cream p-6 sm:p-10 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  Booking for family, friends or a group?
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary">
                  Call us and we will arrange sessions side by side.
                </p>
              </div>
              <a href={contact.phoneHref} className="btn btn-brand w-full shrink-0 sm:w-auto">
                <FiPhone className="h-4 w-4" aria-hidden="true" />
                <span>Call {contact.phone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
