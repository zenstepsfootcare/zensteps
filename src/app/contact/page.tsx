import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { FRANCHISE_FROM } from "@/lib/franchise";
import { getContact } from "@/lib/siteSettings";
import { FiPhone, FiMail, FiMapPin, FiArrowRight, FiMessageCircle } from "react-icons/fi";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Zen Steps – Book a Foot Reflexology Session",
  description: "Call us or send a request to book a foot reflexology session at Zen Steps, Ambattur, Chennai.",
};

export default async function ContactPage() {
  const contact = await getContact();
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Contact Us"
          title="Book a Session or Ask About the Franchise."
          subtitle="Call us to know more, or send a request and we will call you back to confirm your slot."
        />

        <section className="section bg-paper">
          <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Contact details */}
            <div className="lg:col-span-5">
              <span className="eyebrow">Get in Touch</span>
              <h2 className="h2 mt-3 text-ink">How to Reach Zen Steps</h2>

              <ul className="mt-8 space-y-6 bg-cream p-6 sm:p-8">
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-paper text-brand">
                    <FiPhone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Call Us</h3>
                    <a
                      href={contact.phoneHref}
                      className="mt-1 block text-lg font-semibold text-brand transition-colors hover:text-brand-light"
                    >
                      {contact.phone}
                    </a>
                    <span className="mt-1 block text-sm text-muted">Sessions and franchise enquiries</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-paper text-brand">
                    <FiMessageCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">WhatsApp</h3>
                    <a
                      href={contact.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-[15px] font-semibold text-brand transition-colors hover:text-brand-light"
                    >
                      Chat with us
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-paper text-brand">
                    <FiMail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Email</h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-1 block text-[15px] font-semibold text-brand transition-colors hover:text-brand-light"
                    >
                      {contact.email}
                    </a>
                    <span className="mt-1 block text-sm text-muted">Franchise: {contact.franchiseEmail}</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-paper text-brand">
                    <FiMapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Visit Us</h3>
                    <p className="mt-1 text-sm leading-relaxed text-secondary">{contact.address}</p>
                    <a
                      href={contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-arrow mt-2"
                    >
                      <span>Get directions</span>
                      <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              </ul>

              {/* Franchise callout */}
              <div className="mt-6 bg-brand p-6 text-white sm:p-8">
                <span className="eyebrow-gold">Franchise starting from {FRANCHISE_FROM}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">Looking to open a Zen Steps centre?</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  See the investment plans, monthly ROI and what the brand provides.
                </p>
                <Link
                  href="/franchise"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  <span>Explore the Franchise</span>
                  <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Booking form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
