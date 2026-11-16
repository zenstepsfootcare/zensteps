import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { RichContent } from "@/components/RichContent";
import { getPage } from "@/lib/pages";

export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await prisma.page
    .findMany({ where: { isPublished: true }, select: { slug: true } })
    .catch(() => []);
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug).catch(() => null);
  if (!page) return { title: "Page — Zen Steps" };
  const title = page.seoTitle || `${page.title} — Zen Steps`;
  const description = page.seoDescription || page.summary || undefined;
  return {
    title,
    description,
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, images: page.heroImage ? [page.heroImage] : undefined },
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug).catch(() => null);
  if (!page) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        <PageHero eyebrow="Zen Steps" title={page.title} subtitle={page.summary || undefined} />

        <section className="section bg-paper">
          <div className="container-site">
            {/* left-aligned with the hero title above; width capped for comfortable reading */}
            <div className="max-w-3xl">
              {page.heroImage && (
                <div className="mb-10 aspect-[16/9] overflow-hidden bg-border">
                  <img src={page.heroImage} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <RichContent content={page.content} />
              <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
                Last updated{" "}
                {new Date(page.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
