import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { FiCheck, FiArrowLeft, FiClock, FiPhone } from "react-icons/fi";
import { sessionOptions } from "@/lib/franchise";
import { getContact } from "@/lib/siteSettings";

export const revalidate = 3600;

export async function generateStaticParams() {
  const services = await prisma.service
    .findMany({ where: { isActive: true }, select: { slug: true } })
    .catch(() => []);
  return services.map((s) => ({ slug: s.slug }));
}

const getService = unstable_cache(
  async (slug: string) => {
    return prisma.service.findFirst({
      where: { slug, isActive: true },
    });
  },
  ["zen-steps-single-service-brochure-v1"],
  { revalidate: 3600, tags: ["services"] }
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Therapy — Zen Steps" };
  return {
    title: `${service.title} — Zen Steps Foot Reflexology`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug).catch(() => null);

  if (!service) {
    notFound();
  }
  const options = sessionOptions(service.duration, service.price);
  const contact = await getContact();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        {/* Therapy hero */}
        <section className="bg-brand text-white">
          <div className="container-site py-12 sm:py-16 lg:py-20">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Therapy Menu</span>
            </Link>

            <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <span className="eyebrow-gold">Therapy Menu</span>

                <h1 className="h1 mt-4 text-white">{service.title}</h1>

                <p className="lead mt-5 text-white/80">{service.shortDesc}</p>

                {options.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-3" aria-label="Session options">
                    {options.map((o) => (
                      <li
                        key={`${o.duration}-${o.price}`}
                        className="flex items-center gap-3 bg-brand-dark px-4 py-3 text-sm"
                      >
                        {o.duration && (
                          <span className="inline-flex items-center gap-1.5 text-white/80">
                            <FiClock className="h-4 w-4 text-gold" aria-hidden="true" />
                            {o.duration}
                          </span>
                        )}
                        {o.price && <span className="text-lg font-semibold text-gold tabular-nums">{o.price}</span>}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#reserve" className="btn btn-gold">
                    Book This Therapy
                  </a>
                  <a href={contact.phoneHref} className="btn btn-outline-light">
                    <FiPhone className="h-4 w-4" aria-hidden="true" />
                    <span>Call {contact.phone}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="aspect-[16/11] overflow-hidden bg-brand-dark">
                  <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Protocol description and booking */}
        <section className="section bg-paper">
          <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="eyebrow">About This Therapy</span>
              <h2 className="h2 mt-3 text-ink">What to Expect</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-secondary">
                {service.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {service.benefits.length > 0 && (
                <div className="mt-10 bg-cream p-6 sm:p-8">
                  <h3 className="h3 text-ink">Benefits</h3>
                  <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-secondary">
                        <FiCheck className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <dl className="mt-8 space-y-3 border-t border-border pt-6 text-sm leading-relaxed text-secondary">
                <div>
                  <dt className="inline font-semibold text-ink">Your therapist: </dt>
                  <dd className="inline">
                    Sessions are given by trained therapists with visual impairments, who work the reflex points by touch.
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-ink">Preparation: </dt>
                  <dd className="inline">
                    Arrive 10 minutes before your session. Wear comfortable, loose trousers that roll up easily above the
                    mid-calf.
                  </dd>
                </div>
              </dl>
            </div>

            {/* Embedded appointment form */}
            <div id="reserve" className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
