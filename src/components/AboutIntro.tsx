import React from "react";
import { LuTarget } from "react-icons/lu";
import { ABOUT } from "@/lib/franchise";

/** About us, our goal and the foot reflexology map (from the brochure). */
export function AboutIntro({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <section id="about" className="section bg-paper">
      <div className="container-site">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="eyebrow">About Us</span>
            <Heading className="h2 mt-3 text-ink">Where Foot Care Begins With Passion</Heading>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-secondary sm:text-base">
              {ABOUT.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex gap-5 bg-brand p-6 text-white sm:p-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand-dark text-gold">
                <LuTarget className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gold">Our Goal</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/85 sm:text-[15px]">{ABOUT.goal}</p>
              </div>
            </div>
          </div>

          <figure className="lg:col-span-7">
            <div className="border border-border bg-white p-3 sm:p-5">
              <img
                src="/images/foot-reflexology-chart.jpg"
                alt="Foot reflexology chart: reflex points on the right and left soles, from the head, eyes and sinuses at the toes to the lungs, liver, kidneys, colon, lower back and sciatic nerve towards the heel."
                width={594}
                height={392}
                className="h-auto w-full"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">
              Every area of the sole is linked to a part of the body. Our therapists work these reflex points by touch.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
