import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { BrandIcon } from "@/components/BrandIcon";
import { PILLARS, TAGLINES } from "@/lib/franchise";

export function HighlightingSession() {
  return (
    <section id="highlight-session" className="section bg-brand text-white">
      <div className="container-site">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Real sessions at the Zen Steps centre */}
          <div className="lg:col-span-7">
            <figure className="bg-brand-dark">
              <img
                src="/images/highlight-session.jpg"
                alt="Zen Steps certified visually impaired therapists performing therapeutic foot reflexology on guests resting in comfortable recliners"
                width={1600}
                height={900}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
              <figcaption className="p-5 text-sm leading-relaxed text-white/80 sm:p-6">
                <span className="mb-1 block font-semibold text-gold">{TAGLINES.byline}</span>
                Every Zen Steps session is given by trained therapists with visual impairments, who work the reflex
                points of the feet by touch.
              </figcaption>
            </figure>
          </div>

          <div className="lg:col-span-5">
            <span className="eyebrow-gold">{TAGLINES.mantra}</span>
            <h2 className="h2 mt-3 text-white">Healing Hands. Meaningful Impact.</h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Every visit supports dignified, skilled employment for people with visual impairments. Your guests leave
              relaxed; your centre creates real opportunity.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
              {PILLARS.map((item) => (
                <li key={item.title} className="flex items-start gap-4 bg-brand py-4 sm:p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-brand-dark text-gold">
                    <BrandIcon name={item.icon} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/contact" className="btn btn-gold">
                <span>Book a Session</span>
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/franchise" className="btn btn-outline-light">
                Own a Franchise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
