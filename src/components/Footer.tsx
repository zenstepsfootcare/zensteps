import React from "react";
import Link from "next/link";
import { FiArrowUpRight, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { getFooterPages } from "@/lib/pages";
import { ABOUT, FRANCHISE_FROM, ROI_NOTE, TAGLINES, THERAPIES } from "@/lib/franchise";
import { getContact } from "@/lib/siteSettings";
import { TrackingTags } from "@/components/TrackingTags";
import { EnquiryLauncher } from "@/components/EnquiryLauncher";

const franchiseLinks = [
  { label: "Franchise Opportunity", href: "/franchise" },
  { label: "Investment Plans", href: "/franchise#investment" },
  { label: "Monthly ROI", href: "/franchise#roi" },
  { label: "ROI Calculator", href: "/franchise#roi-calculator" },
  { label: "Brand Support", href: "/franchise#support" },
  { label: "Apply for Franchise", href: "/franchise#apply", highlight: true },
];

const therapyLinks = THERAPIES.map((t) => ({ label: t.title, href: `/services/${t.slug}` }));

const exploreLinks = [
  { label: "About Zen Steps", href: "/about" },
  { label: "Our Centre", href: "/locations" },
  { label: "Book a Session", href: "/contact" },
  { label: "Blog", href: "/journal" },
  { label: "Admin Login", href: "/admin/login" },
];

function FooterColumn({
  title,
  links,
  className = "",
}: {
  title: string;
  links: { label: string; href: string; highlight?: boolean }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className={`transition-colors ${
                link.highlight ? "font-semibold text-gold hover:text-white" : "text-white/65 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  // Policy/info pages flagged "Show in footer" in admin (replaces hard-coded links that 404'd)
  const [footerPages, contact] = await Promise.all([getFooterPages().catch(() => []), getContact()]);

  return (
    <footer className="bg-brand-dark text-white">
      {/* Analytics tags and the enquiry popup live here because every public page, and no admin page, renders the footer. */}
      <TrackingTags />
      <EnquiryLauncher phone={contact.phone} phoneHref={contact.phoneHref} offer={`Franchise starting from ${FRANCHISE_FROM}`} />
      {/* Franchise callout */}
      <div className="border-b border-white/10 bg-brand">
        <div className="container-site flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow-gold">Franchise starting from {FRANCHISE_FROM}</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white lg:text-3xl">{TAGLINES.promise}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
              Open a Zen Steps centre with interiors, reflexology materials, trained therapists and marketing support
              from the brand. {TAGLINES.journey}.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/franchise#apply" className="btn btn-gold">
              <span>Apply for Franchise</span>
              <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={contact.phoneHref} className="btn btn-outline-light">
              <FiPhone className="h-4 w-4" aria-hidden="true" />
              <span>{contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="container-site py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="Zen Steps home">
              <img src="/zensteps-logo.png" alt="Zen Steps" className="h-14 w-auto object-contain" />
            </Link>
            <p className="mt-3 text-sm italic text-gold">{TAGLINES.logo}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{ABOUT.paragraphs[0]}</p>
            <ul className="mt-6 space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  {contact.address}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={contact.phoneHref} className="transition-colors hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiMail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={`mailto:${contact.franchiseEmail}`} className="transition-colors hover:text-white">
                  {contact.franchiseEmail}
                </a>
              </li>
            </ul>
          </div>

          <FooterColumn title="Franchise" links={franchiseLinks} className="lg:col-span-3 lg:pl-6" />
          <FooterColumn title="Therapies" links={therapyLinks} className="lg:col-span-3" />
          <FooterColumn title="Explore" links={exploreLinks} className="lg:col-span-2" />
        </div>

        {/* Disclaimer */}
        <p className="mt-12 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/50">
          <strong className="font-semibold text-white/70">Disclaimer:</strong> {ROI_NOTE} Foot reflexology supports
          relaxation and general well-being and is not a substitute for medical diagnosis or treatment.
        </p>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Zen Steps. {TAGLINES.impact}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerPages.map((page) => (
              <Link key={page.slug} href={`/pages/${page.slug}`} className="transition-colors hover:text-white">
                {page.title}
              </Link>
            ))}
            <a href="/sitemap.xml" className="transition-colors hover:text-white">
              Sitemap
            </a>
            <span className="font-semibold text-gold">{TAGLINES.mantra}</span>
          </div>
        </div>
      </div>
      {/* Room for the sticky mobile Call / Enquire bar so it never covers the last line. */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </footer>
  );
}
