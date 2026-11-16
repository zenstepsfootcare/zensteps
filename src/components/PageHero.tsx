import React from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

/** Shared dark hero for inner pages. Aligned to the site container, text width capped for readability. */
export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="bg-brand text-white">
      <div className="container-site py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <span className="eyebrow-gold">{eyebrow}</span>
          <h1 className="h1 mt-4 text-white">{title}</h1>
          {subtitle && <p className="lead mt-5 text-white/80">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
