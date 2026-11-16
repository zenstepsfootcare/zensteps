import React from "react";
import { FiMapPin, FiPhone, FiClock, FiArrowUpRight } from "react-icons/fi";

export interface LocationCardProps {
  id?: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email?: string | null;
  timings?: string | null;
  mapUrl?: string | null;
  image?: string | null;
}

export function LocationCard({
  name,
  city,
  state,
  address,
  phone,
  timings,
  mapUrl,
  image,
}: LocationCardProps) {
  return (
    <article className="flex h-full flex-col bg-paper">
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden bg-border">
          <img src={image} alt={name} className="h-full w-full object-cover" loading="lazy" />
          <span className="chip absolute top-3 left-3 bg-brand text-white">
            {city}, {state}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {!image && (
          <span className="eyebrow mb-2">
            {city}, {state}
          </span>
        )}
        <h3 className="h3 text-ink">{name}</h3>

        <ul className="mt-4 space-y-2.5 text-sm text-secondary">
          <li className="flex items-start gap-2.5">
            <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <span className="leading-relaxed">{address}</span>
          </li>
          {timings && (
            <li className="flex items-start gap-2.5">
              <FiClock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              <span className="leading-relaxed">{timings}</span>
            </li>
          )}
          <li className="flex items-start gap-2.5">
            <FiPhone className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="font-medium text-ink transition-colors hover:text-brand-light"
            >
              {phone}
            </a>
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <a
            href={mapUrl || `https://maps.google.com/?q=${encodeURIComponent(name + " " + address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow"
          >
            <span>Directions</span>
            <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={`/contact?location=${encodeURIComponent(name)}`}
            className="btn btn-brand btn-sm"
          >
            Book Here
          </a>
        </div>
      </div>
    </article>
  );
}
