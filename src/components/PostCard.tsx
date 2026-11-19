import React from "react";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  tags?: string[];
  publishedAt: Date | string | null;
}

export function formatPostDate(date: Date | string, month: "short" | "long" = "short") {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month, year: "numeric" });
}

function PostMeta({ post }: { post: PostCardData }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <FiUser className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
        <span>{post.author}</span>
      </span>
      {post.publishedAt && (
        <span className="flex items-center gap-1.5">
          <FiCalendar className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          <time dateTime={new Date(post.publishedAt).toISOString()}>{formatPostDate(post.publishedAt)}</time>
        </span>
      )}
    </div>
  );
}

/** Blog card. `featured` renders the wide image-left layout used for the newest post. */
export function PostCard({
  post,
  tone = "cream",
  featured = false,
  headingLevel = "h2",
}: {
  post: PostCardData;
  tone?: "cream" | "paper";
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const href = `/journal/${post.slug}`;
  const surface = tone === "cream" ? "bg-cream" : "bg-paper";
  const chip = tone === "cream" ? "bg-paper" : "bg-cream";

  return (
    <article className={`flex h-full flex-col ${surface} ${featured ? "lg:grid lg:grid-cols-12" : ""}`}>
      <div className={`relative aspect-[16/10] overflow-hidden bg-transparent ${featured ? "lg:col-span-7 lg:aspect-auto lg:min-h-[380px]" : ""}`}>
        <img
          src={post.coverImage}
          alt={post.title}
          className={`h-full w-full object-cover ${featured ? "lg:absolute lg:inset-0" : ""}`}
          loading={featured ? "eager" : "lazy"}
        />
        <span className={`chip absolute top-3 left-3 ${chip} font-semibold text-ink`}>{post.category}</span>
      </div>

      <div className={`flex flex-1 flex-col p-6 ${featured ? "lg:col-span-5 lg:justify-center lg:p-10" : ""}`}>
        {featured && <span className="eyebrow mb-3">Latest Article</span>}
        <PostMeta post={post} />
        <Heading
          className={`mt-3 text-ink ${featured ? "text-2xl font-semibold leading-tight tracking-tight lg:text-[1.75rem]" : "h3"}`}
        >
          <Link href={href} className="transition-colors hover:text-brand-light">
            {post.title}
          </Link>
        </Heading>
        <p className={`mt-2 text-sm leading-relaxed text-secondary ${featured ? "sm:text-base" : "line-clamp-3"}`}>
          {post.excerpt}
        </p>

        <div className={`flex items-center justify-between gap-4 pt-6 ${featured ? "" : "mt-auto"}`}>
          <Link href={href} className="link-arrow">
            <span>{featured ? "Read Article" : "Read Note"}</span>
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {post.tags && post.tags.length > 0 && (
            <span className={`chip ${chip} text-secondary`}>{post.tags[0]}</span>
          )}
        </div>
      </div>
    </article>
  );
}
