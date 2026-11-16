import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { getPublishedPages } from "@/lib/pages";
import { FiArrowRight } from "react-icons/fi";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Information & Policies — Zen Steps",
  description: "Guides, policies, and information pages from Zen Steps.",
};

export default async function PagesIndex() {
  const pages = (await getPublishedPages().catch(() => [])).filter((p) => !p.noIndex);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Zen Steps Information"
          title="Guides, Policies & Useful Information."
          subtitle="Everything else you may want to know about Zen Steps, our centres, and how we work."
        />

        <section className="section bg-paper">
          <div className="container-site">
            {pages.length === 0 ? (
              <p className="py-16 text-center text-[15px] text-secondary">
                Information pages will appear here soon.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                  <li key={page.slug} className="flex">
                    <Link
                      href={`/pages/${page.slug}`}
                      className="group flex w-full flex-col bg-cream p-6 transition-colors hover:bg-border/60 sm:p-8"
                    >
                      <h2 className="h3 text-ink">{page.title}</h2>
                      {page.summary && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-secondary">{page.summary}</p>
                      )}
                      <span className="link-arrow mt-auto pt-6">
                        <span>Read Page</span>
                        <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
