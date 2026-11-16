import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RichContent } from "@/components/RichContent";
import { PostCard, formatPostDate } from "@/components/PostCard";
import { FiArrowLeft, FiCalendar, FiUser } from "react-icons/fi";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await prisma.blogPost
    .findMany({ where: { isPublished: true }, select: { slug: true } })
    .catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

const getPost = unstable_cache(
  async (slug: string) => {
    return prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
    });
  },
  ["zen-steps-single-post-v2"],
  { revalidate: 3600, tags: ["journal"] }
);

const getMorePosts = unstable_cache(
  async (slug: string) => {
    return prisma.blogPost.findMany({
      where: { isPublished: true, slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  },
  ["zen-steps-more-posts-v1"],
  { revalidate: 3600, tags: ["journal"] }
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return { title: "Field Note — Zen Steps" };
  const title = post.seoTitle || `${post.title} — Zen Steps Journal`;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    keywords: post.tags,
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: [post.author],
    },
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const more = await getMorePosts(slug).catch(() => []);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage || undefined,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Zen Steps" },
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
        />

        <article className="section bg-paper">
          <div className="container-site">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-brand"
              >
                <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back to Blog</span>
              </Link>

              <header className="mt-10">
                <span className="eyebrow">{post.category} &middot; Clinical Field Note</span>
                <h1 className="h1 mt-4 text-ink">{post.title}</h1>
                <p className="lead mt-5 text-secondary">{post.excerpt}</p>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4 text-sm text-muted">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="flex items-center gap-1.5 font-medium text-ink">
                      <FiUser className="h-4 w-4 text-brand" aria-hidden="true" />
                      <span>{post.author}</span>
                    </span>
                    {post.publishedAt && (
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="h-4 w-4 text-brand" aria-hidden="true" />
                        <time dateTime={new Date(post.publishedAt).toISOString()}>
                          {formatPostDate(post.publishedAt, "long")}
                        </time>
                      </span>
                    )}
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="chip bg-cream text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </header>

              {post.coverImage && (
                <div className="mt-10 aspect-[16/9] overflow-hidden bg-border">
                  <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                </div>
              )}

              <RichContent content={post.content} className="mt-10" />

              {/* Post footer CTA */}
              <aside className="mt-16 bg-cream p-8 text-center sm:p-10">
                <span className="eyebrow">Take the Next Step</span>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  Ready to experience the physiological benefits firsthand?
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-secondary">
                  Schedule an appointment at your nearest Zen Steps centre or explore our signature Sole Serenity protocol.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/services" className="btn btn-brand">
                    Book Session
                  </Link>
                  <Link href="/locations" className="btn btn-outline">
                    Locate Centre
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </article>

        {more.length > 0 && (
          <section className="section border-t border-border bg-paper" aria-labelledby="keep-reading">
            <div className="container-site">
              <div className="mb-10 flex items-end justify-between gap-6">
                <h2 id="keep-reading" className="h2 text-ink">
                  Keep Reading
                </h2>
                <Link href="/journal" className="link-arrow shrink-0">
                  All Articles
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {more.map((p) => (
                  <PostCard key={p.slug} post={p} headingLevel="h3" />
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
