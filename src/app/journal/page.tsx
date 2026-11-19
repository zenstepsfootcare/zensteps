import React from "react";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/PostCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog & Clinical Journal — Zen Steps",
  description:
    "Essays, anatomical studies, and clinical observations on plantar health, reflexology, and somatic restoration from the Zen Steps faculty.",
};

const getPosts = unstable_cache(
  async () => {
    return prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
  },
  ["zen-steps-all-posts-v3"],
  { revalidate: 3600, tags: ["journal"] }
);

export default async function JournalPage() {
  const posts = await getPosts().catch(() => []);
  const [featured, ...rest] = posts;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="flex-1">
        <PageHero
          eyebrow="Field Notes & Clinical Journal"
          title="Plantar Science & Foot Reflexology Journal"
          subtitle="Clinical studies, anatomical sole mapping, and tactile therapy observations from the Zen Steps master reflexologists."
        />

        <section className="section bg-paper">
          <div className="container-site">
            {!featured ? (
              <p className="py-16 text-center text-[15px] text-secondary">
                New field notes are being drafted by our clinical faculty. Please check back shortly.
              </p>
            ) : (
              <>
                <PostCard post={featured} featured />

                {rest.length > 0 && (
                  // 3 columns only when rows fill evenly; otherwise 2 (avoids an empty slot)
                  <div
                    className={`mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 ${rest.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}
                  >
                    {rest.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
