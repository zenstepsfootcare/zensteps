import React from "react";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { LocationCard } from "@/components/LocationCard";
import { FiArrowRight } from "react-icons/fi";
import { FRANCHISE_FROM } from "@/lib/franchise";

export const revalidate = 3600;

const getLocationsData = unstable_cache(
  async () => {
    const locations = await prisma.location.findMany({
      where: { isActive: true },
      orderBy: [{ state: "asc" }, { city: "asc" }],
    });
    return { locations };
  },
  ["zen-steps-locations-brochure-v1"],
  { revalidate: 3600, tags: ["locations"] }
);

export default async function LocationsPage() {
  const { locations } = await getLocationsData().catch(() => ({ locations: [] }));

  type LocationItem = (typeof locations)[number];
  const groupedByState: Record<string, LocationItem[]> = {};
  for (const loc of locations) {
    if (!groupedByState[loc.state]) {
      groupedByState[loc.state] = [];
    }
    groupedByState[loc.state].push(loc);
  }

  const states = Object.keys(groupedByState).sort();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow={locations.length === 1 ? "Our Centre" : "Our Centres"}
          title="Visit Zen Steps."
          subtitle="Relax, refresh and rejuvenate with a foot reflexology session given by our trained therapists with visual impairments."
        />

        {/* State quick-jump navigation (only useful once there is more than one state) */}
        {states.length > 1 && (
          <nav
            aria-label="Filter centres by state"
            className="sticky top-16 z-40 border-b border-border bg-paper lg:top-20"
          >
            <div className="container-site no-scrollbar flex items-center gap-2 overflow-x-auto py-3">
              <span className="mr-2 shrink-0 text-sm font-semibold text-ink">Filter by State:</span>
              {states.map((st) => (
                <a
                  key={st}
                  href={`#${st.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex h-9 shrink-0 items-center bg-cream px-3.5 text-sm font-medium text-secondary transition-colors hover:bg-brand hover:text-white"
                >
                  {st} ({groupedByState[st].length})
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Locations grouped by state */}
        <section className="section bg-cream">
          <div className="container-site space-y-14 lg:space-y-16">
            {states.map((state) => {
              const stateLocations = groupedByState[state];
              const stateAnchor = state.toLowerCase().replace(/\s+/g, "-");
              return (
                <div key={state} id={stateAnchor} className="scroll-mt-36 lg:scroll-mt-40">
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <span className="eyebrow">State</span>
                      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink lg:text-[1.75rem]">
                        {state}
                      </h2>
                    </div>
                    <span className="shrink-0 text-sm text-muted">
                      {stateLocations.length} {stateLocations.length === 1 ? "Centre" : "Centres"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stateLocations.map((loc) => (
                      <LocationCard key={loc.slug} {...loc} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Franchise banner */}
        <section className="section bg-paper">
          <div className="container-site">
            <div className="flex flex-col items-start justify-between gap-6 bg-cream p-6 sm:p-10 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <span className="eyebrow">Franchise starting from {FRANCHISE_FROM}</span>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  Bring Zen Steps to your city
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary">
                  Open your own centre with interiors, reflexology materials, trained therapists and marketing support
                  from the brand.
                </p>
              </div>
              <Link href="/franchise" className="btn btn-brand w-full shrink-0 sm:w-auto">
                <span>Apply for Franchise</span>
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
