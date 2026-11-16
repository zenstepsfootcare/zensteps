import React from "react";
import Link from "next/link";
import { preload } from "react-dom";
import { FiArrowRight, FiCheckCircle, FiPhone } from "react-icons/fi";
import { HeroVideo } from "@/components/HeroVideo";
import { FRANCHISE_FROM, TAGLINES } from "@/lib/franchise";
import { getContact } from "@/lib/siteSettings";

/**
 * The brand film opens on ~0.9s of pure black and closes on a white logo card + black tail
 * (measured frame by frame). Heroes play only the footage in between, and the poster is the
 * frame at `start`, so the first paint is real footage instead of a black box.
 */
export const BRAND_VIDEO = {
  src: "/zen steps 5.mp4",
  poster: "/images/hero-poster.jpg",
  start: 0.95,
  end: 15.75, // white logo card starts ~16.1s; timeupdate fires every ~0.25s
};

interface VideoHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  videoUrl?: string;
  /** Shown beside the copy on large screens (under it on small ones), e.g. the enquiry form. */
  aside?: React.ReactNode;
}

const proofPoints = [`Franchise from ${FRANCHISE_FROM}`, "Break-even within 6 months", "Profit margin up to 80%"];

export async function VideoHero({
  title,
  subtitle,
  ctaText = "Apply for Franchise",
  ctaLink = "#apply",
  videoUrl = BRAND_VIDEO.src,
  aside,
}: VideoHeroProps) {
  const contact = await getContact();
  const isBrandFilm = videoUrl === BRAND_VIDEO.src;
  // Fetch the poster with the page's highest-priority resources so it paints immediately.
  if (isBrandFilm) preload(BRAND_VIDEO.poster, { as: "image", fetchPriority: "high" });

  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-white">
      <HeroVideo
        {...(isBrandFilm ? BRAND_VIDEO : {})}
        src={videoUrl}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* No overlay: the film shows at full clarity; text-legible keeps copy readable on bright frames */}

      <div
        className={`container-site min-h-[540px] items-center py-16 sm:py-20 lg:min-h-[640px] lg:py-24 ${
          aside ? "grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12" : "flex"
        }`}
      >
        <div className={`text-legible max-w-3xl ${aside ? "lg:col-span-7" : ""}`}>
          <span className="eyebrow-gold">Foot reflexology {TAGLINES.byline.toLowerCase()}</span>

          <h1 className="h1 mt-4 text-white">{title}</h1>

          <p className="lead mt-5 max-w-2xl text-white/85">{subtitle}</p>

          <ul className="mt-6 flex flex-col gap-2.5 text-sm font-medium text-white sm:flex-row sm:flex-wrap sm:gap-x-6">
            {proofPoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href={ctaLink} className="btn btn-gold">
              <span>{ctaText}</span>
              <FiArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn btn-dark">
              Book a Session
            </Link>
            <a
              href={contact.phoneHref}
              className="inline-flex h-12 items-center justify-center gap-2 px-2 text-sm font-semibold text-white/90 transition-colors hover:text-white"
            >
              <FiPhone className="h-4 w-4 text-gold" aria-hidden="true" />
              <span>{contact.phone}</span>
            </a>
          </div>
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}
