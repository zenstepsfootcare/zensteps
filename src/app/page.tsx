import React from "react";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoHero } from "@/components/VideoHero";
import { HeroEnquiryCard } from "@/components/HeroEnquiryCard";
import { StatsBar } from "@/components/StatsBar";
import { SectionHeader } from "@/components/SectionHeader";
import { AboutIntro } from "@/components/AboutIntro";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { HighlightingSession } from "@/components/HighlightingSession";
import { FranchiseEconomics } from "@/components/FranchiseEconomics";
import { BrandSupport } from "@/components/BrandSupport";
import { FranchiseForm } from "@/components/FranchiseForm";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PostCard } from "@/components/PostCard";
import { BenefitsSection } from "@/components/BenefitsSection";
import { SocialHighlights } from "@/components/SocialHighlights";
import { SECTION_KEYS, sectionSettings } from "@/lib/homeSections";
import { TAGLINES } from "@/lib/franchise";
import { getContact } from "@/lib/siteSettings";
import { FiArrowRight, FiPhone } from "react-icons/fi";

export const revalidate = 3600;

const getHomeData = unstable_cache(
  async () => {
    const [services, benefits, videos, settingRows, testimonials, posts, faqs] = await Promise.all([
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
      prisma.benefit.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, description: true, icon: true },
      }),
      prisma.socialVideo.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 8,
        select: {
          id: true,
          url: true,
          title: true,
          coverImage: true,
          views: true,
          likes: true,
          comments: true,
        },
      }),
      prisma.siteSettings.findMany({
        where: { key: { in: SECTION_KEYS } },
        select: { key: true, value: true },
      }),
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.fAQ.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 10,
      }),
    ]);
    return { services, benefits, videos, settingRows, testimonials, posts, faqs };
  },
  ["zen-steps-home-brochure-v2"],
  { revalidate: 3600, tags: ["home", "services"] }
);

export default async function Home() {
  const data = await getHomeData().catch(() => ({
    services: [],
    benefits: [],
    videos: [],
    settingRows: [],
    testimonials: [],
    posts: [],
    faqs: [],
  }));
  const sections = sectionSettings(data.settingRows);
  const contact = await getContact();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        {/* 1. Video hero */}
        <VideoHero
          title={TAGLINES.promise}
          subtitle="Zen Steps is a premium foot reflexology and wellness centre, with every session given by trained therapists with visual impairments. Book a session, or open your own Zen Steps centre."
          aside={<HeroEnquiryCard source="home page hero" />}
        />

        {/* 2. Franchise at a glance */}
        <StatsBar />

        {/* 3. About us, our goal, foot reflexology map */}
        <AboutIntro />

        {/* 4. Why choose a Zen Steps franchise */}
        <WhyChooseUs />

        {/* 5. Therapy menu */}
        {data.services.length > 0 && (
          <section id="therapies" className="section bg-paper">
            <div className="container-site">
              <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end lg:mb-12">
                <SectionHeader
                  eyebrow="Therapy Menu"
                  title="Choose Your Session"
                  subtitle="Six foot reflexology therapies from 40 to 75 minutes, starting at ₹450."
                />
                <Link href="/services" className="link-arrow shrink-0">
                  <span>View Full Therapy Menu</span>
                  <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.services.map((service) => (
                  <ServiceCard key={service.slug} {...service} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. Benefits of reflexology (admin: Content manager > Benefits / Section settings) */}
        <BenefitsSection benefits={data.benefits} settings={sections} />

        {/* 7. Healing hands, meaningful impact */}
        <HighlightingSession />

        {/* 8. Investment plans and monthly ROI */}
        <FranchiseEconomics />

        {/* 9. Brand support and franchise partner */}
        <BrandSupport />

        {/* 10. Instagram and YouTube highlights (admin: Content manager > Social videos) */}
        <SocialHighlights videos={data.videos} settings={sections} />

        {/* 11. Guest feedback (admin: Testimonials) */}
        {data.testimonials.length > 0 && (
          <section className="section bg-paper">
            <div className="container-site">
              <SectionHeader eyebrow="Guest Stories" title="What Our Guests Say" className="mb-10 lg:mb-12" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {data.testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} {...testimonial} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 12. Franchise application */}
        <section id="apply" className="section bg-cream">
          <div className="container-site">
            <div className="mx-auto max-w-4xl">
              <SectionHeader
                eyebrow="Become a Franchise Partner"
                title="Apply for a Zen Steps Franchise"
                subtitle="Fill in the form, or call us to know more."
                align="center"
                className="mb-6"
              />
              <p className="mb-10 text-center">
                <a href={contact.phoneHref} className="link-arrow">
                  <FiPhone className="h-4 w-4" aria-hidden="true" />
                  <span>{contact.phone}</span>
                </a>
              </p>
              <FranchiseForm />
            </div>
          </div>
        </section>

        {/* 13. FAQs */}
        {data.faqs.length > 0 && (
          <section id="faq" className="section bg-paper">
            <div className="container-site">
              <div className="mx-auto max-w-3xl">
                <SectionHeader
                  eyebrow="Questions"
                  title="Frequently Asked Questions"
                  subtitle="About our franchise plans and our therapy sessions."
                  align="center"
                  className="mb-10"
                />
                <FAQAccordion items={data.faqs} />
              </div>
            </div>
          </section>
        )}

        {/* 14. Latest blog articles (admin: Content manager > Journal) */}
        {data.posts.length > 0 && (
          <section className="section bg-cream">
            <div className="container-site">
              <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end lg:mb-12">
                <SectionHeader
                  eyebrow="Clinical Research & Notes"
                  title="Foot Reflexology & Plantar Science"
                  subtitle="Clinical insights on sole nerve stimulation, plantar fasciitis relief, and tactile therapy."
                />
                <Link href="/journal" className="link-arrow shrink-0">
                  <span>Read the Blog</span>
                  <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.posts.map((post) => (
                  <PostCard key={post.slug} post={post} tone="paper" headingLevel="h3" />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
