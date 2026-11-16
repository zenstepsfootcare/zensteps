import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { AboutIntro } from "@/components/AboutIntro";
import { HighlightingSession } from "@/components/HighlightingSession";
import { TAGLINES } from "@/lib/franchise";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Zen Steps – Foot Reflexology by People With Visual Impairments",
  description:
    "Zen Steps is a premium foot reflexology and wellness centre in Chennai, creating meaningful employment for visually impaired therapists.",
};

const getAboutData = unstable_cache(
  async () => {
    const team = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return { team };
  },
  ["zen-steps-about-brochure-v1"],
  { revalidate: 3600, tags: ["team"] }
);

export default async function AboutPage() {
  const { team } = await getAboutData().catch(() => ({ team: [] }));

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="About Zen Steps"
          title="Relax. Refresh. Rejuvenate."
          subtitle="A premium foot reflexology and wellness centre where every session is given by trained therapists with visual impairments."
        />

        <AboutIntro />

        <HighlightingSession />

        {/* Team (admin: Team) */}
        {team.length > 0 && (
          <section className="section bg-paper">
            <div className="container-site">
              <SectionHeader eyebrow="Our People" title="The Team Behind Zen Steps" className="mb-10 lg:mb-12" />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((member) => (
                  <article key={member.id} className="flex flex-col bg-cream">
                    {member.image && (
                      <div className="aspect-[4/3] overflow-hidden bg-border">
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="eyebrow">{member.role}</span>
                      <h3 className="h3 mt-2 text-ink">{member.name}</h3>
                      {member.bio && <p className="mt-3 text-sm leading-relaxed text-secondary">{member.bio}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section border-t border-border bg-paper">
          <div className="container-site">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="h2 text-ink">{TAGLINES.impact}</h2>
              <p className="lead mt-4 text-secondary">
                Book a session at our Chennai centre, or bring Zen Steps to your city with a franchise from ₹1.5 lakh.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/contact" className="btn btn-brand">
                  Book a Session
                </Link>
                <Link href="/franchise" className="btn btn-outline">
                  Explore the Franchise
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
