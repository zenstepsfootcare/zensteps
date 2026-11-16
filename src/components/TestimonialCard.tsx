import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export function TestimonialCard({ name, location, rating = 5, text }: TestimonialCardProps) {
  return (
    <article className="flex h-full flex-col bg-cream p-6">
      <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-gold" : "fill-border"}`}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <polygon points="10 1 13 7 19 7.5 14.5 12 16 18 10 15 4 18 5.5 12 1 7.5 7 7" />
          </svg>
        ))}
        <span className="ml-2 text-xs font-semibold text-brand">5.0 Verified Visit</span>
      </div>

      <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">&ldquo;{text}&rdquo;</blockquote>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{name}</p>
          <p className="text-xs text-muted">{location}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-brand">
          <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Client Review
        </span>
      </div>
    </article>
  );
}
