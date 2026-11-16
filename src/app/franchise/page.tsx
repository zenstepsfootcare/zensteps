import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FranchiseForm } from "@/components/FranchiseForm";
import { FranchiseEconomics } from "@/components/FranchiseEconomics";
import { BrandSupport } from "@/components/BrandSupport";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { StatsBar } from "@/components/StatsBar";
import { HighlightingSession } from "@/components/HighlightingSession";
import { SectionHeader } from "@/components/SectionHeader";
import { HeroVideo } from "@/components/HeroVideo";
import { HeroEnquiryCard } from "@/components/HeroEnquiryCard";
import { BRAND_VIDEO } from "@/components/VideoHero";
import { FRANCHISE_FROM, TAGLINES } from "@/lib/franchise";
import { getContact } from "@/lib/siteSettings";
import { preload } from "react-dom";
import { FiArrowRight, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Zen Steps Franchise – Start From ₹1.5 Lakh",
  description:
    "Open a Zen Steps foot reflexology centre from ₹1.5 lakh. Break-even within 6 months, profit margin up to 80%, with interiors, therapists and marketing provided by the brand.",
};

export default async function FranchisePage() {
  preload(BRAND_VIDEO.poster, { as: "image", fetchPriority: "high" });
  const contact = await getContact();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        {/* Franchise hero with background video */}
        <section className="relative isolate overflow-hidden bg-brand-dark text-white">
          {/* No overlay: the film shows at full clarity; text-legible keeps copy readable */}
          <HeroVideo {...BRAND_VIDEO} className="absolute inset-0 -z-10 h-full w-full object-cover" />

          <div className="container-site grid grid-cols-1 items-center gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
            <div className="text-legible max-w-3xl lg:col-span-7">
              <img src="/zensteps-logo.png" alt="Zen Steps" className="mb-8 h-16 w-auto object-contain sm:h-20" />

              <span className="eyebrow-gold">Franchise starting from {FRANCHISE_FROM}</span>

              <h1 className="h1 mt-4 text-white">{TAGLINES.promise}</h1>

              <p className="lead mt-5 max-w-2xl text-white/85">
                Open your own Zen Steps foot reflexology centre. We provide the interior design, reflexology materials,
                trained therapists and marketing support. {TAGLINES.journey}.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#apply" className="btn btn-gold">
                  <span>Apply for Franchise</span>
                  <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="#investment" className="btn btn-dark">
                  Investment &amp; ROI
                </a>
                <a
                  href={contact.phoneHref}
                  className="inline-flex h-12 items-center justify-center gap-2 px-2 text-sm font-semibold text-white/90 transition-colors hover:text-white"
                >
                  <FiPhone className="h-4 w-4 text-gold" aria-hidden="true" />
                  <span>Call {contact.phone}</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <HeroEnquiryCard source="franchise page hero" />
            </div>
          </div>
        </section>

        <StatsBar />

        <WhyChooseUs />

        {/* Investment plans and monthly ROI */}
        <FranchiseEconomics />

        {/* Brand support and franchise partner */}
        <BrandSupport />

        {/* Real sessions and social impact */}
        <HighlightingSession />

        {/* Application form */}
        <section id="apply" className="section bg-cream">
          <div className="container-site">
            <div className="mx-auto max-w-4xl">
              <SectionHeader
                eyebrow="Become a Franchise Partner"
                title="Apply for a Zen Steps Franchise"
                subtitle="Tell us where you would like to open your centre and which setup suits you. Our franchise team will call you."
                align="center"
                className="mb-10"
              />
              <FranchiseForm />
            </div>
          </div>
        </section>

        {/* Direct franchise desk contact */}
        <section className="border-t border-border bg-paper">
          <div className="container-site flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">Call us to know more</h2>
              <p className="mt-1 flex items-start gap-2 text-[15px] text-secondary">
                <FiMapPin className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <span>{contact.address}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm font-semibold text-ink sm:flex-row sm:items-center sm:gap-8">
              <a href={contact.phoneHref} className="flex items-center gap-2 transition-colors hover:text-brand-light">
                <FiPhone className="h-4 w-4 text-brand" aria-hidden="true" />
                <span>{contact.phone}</span>
              </a>
              <a
                href={`mailto:${contact.franchiseEmail}`}
                className="flex items-center gap-2 transition-colors hover:text-brand-light"
              >
                <FiMail className="h-4 w-4 text-brand" aria-hidden="true" />
                <span>{contact.franchiseEmail}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
