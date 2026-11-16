import React from "react";
import Link from "next/link";
import { FiCheck, FiArrowRight, FiClock } from "react-icons/fi";
import { sessionOptions } from "@/lib/franchise";

export interface ServiceCardProps {
  id?: string;
  title: string;
  slug: string;
  shortDesc: string;
  description?: string;
  image: string;
  duration?: string | null;
  price?: string | null;
  benefits?: string[];
  sortOrder?: number;
}

export function ServiceCard({ title, slug, shortDesc, image, duration, price, benefits = [] }: ServiceCardProps) {
  const options = sessionOptions(duration, price);
  return (
    <article className="flex h-full flex-col bg-cream">
      <div className="relative aspect-[16/10] overflow-hidden bg-border">
        <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="h3 text-ink">
          <Link href={`/services/${slug}`} className="transition-colors hover:text-brand-light">
            {title}
          </Link>
        </h3>

        {options.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Session options">
            {options.map((o) => (
              <li key={`${o.duration}-${o.price}`} className="inline-flex items-center gap-2 bg-paper px-3 py-1.5 text-sm">
                {o.duration && (
                  <span className="inline-flex items-center gap-1.5 text-secondary">
                    <FiClock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    {o.duration}
                  </span>
                )}
                {o.price && <span className="font-semibold text-brand tabular-nums">{o.price}</span>}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-secondary">{shortDesc}</p>

        {benefits.length > 0 && (
          <ul className="mt-4 space-y-2">
            {benefits.slice(0, 3).map((benefit, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-secondary">
                <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <Link href={`/services/${slug}`} className="link-arrow">
            <span>View Details</span>
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href={`/contact?service=${encodeURIComponent(slug)}`} className="btn btn-brand btn-sm">
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
