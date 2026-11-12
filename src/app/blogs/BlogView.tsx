"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";
import { getBlogPostsWithFallback } from "@/data/posts";
import { blogCoverSources, sizedCover } from "@/lib/blogCovers";
import { CoverFrame } from "@/components/blog/CoverFrame";
import type { BlogPost } from "@/types";
import { rememberBlogNavigation } from "@/lib/blogAnalytics";

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

const cardImgClass =
  "absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]";

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const category = post.tags?.[0] || "Insights";
  const { src, fallbackSrc } = blogCoverSources(post);
  return (
    <Link href={`/blogs/${post.slug}`} onClick={() => rememberBlogNavigation(post.slug)} className="group block overflow-hidden rounded-2xl border border-black/[0.09] bg-[#fffcf8] no-underline transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(22,17,14,0.08)]">
      <CoverFrame
        src={sizedCover(src, 640)}
        fallbackSrc={sizedCover(fallbackSrc, 640)}
        alt={`${post.title} article cover`}
        eager={index < 3}
        className="relative aspect-[16/9] w-full overflow-hidden"
        imgClassName={cardImgClass}
      />
      <div className="p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a14b30]">
          <span className="max-w-[65%] truncate">{category}</span><span className="text-black/25">/</span><span className="font-medium tracking-normal text-[#6f655d]">{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>
        <h2 className="mt-3 line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.02em] text-[#211a16] group-hover:text-[#a14b30]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#756b63]">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#211a16]">Read article <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
      </div>
    </Link>
  );
}

export function BlogView({ initialPosts }: { initialPosts?: BlogPost[] }) {
  const { posts, catalogReady } = useApp();
  // Server-rendered catalog (if provided) shows immediately; the live snapshot
  // takes over once the client listener delivers fresher data.
  const effectivePosts = catalogReady || !initialPosts?.length ? posts : initialPosts;
  const published = useMemo(() => getBlogPostsWithFallback(effectivePosts), [effectivePosts]);
  const [visibleCount, setVisibleCount] = useState(12);
  const loading = !catalogReady && !initialPosts?.length;
  const featured = useMemo(() => published.filter((post) => post.featured).slice(0, 3), [published]);

  return (
    <Section className="max-w-6xl">
      <header className="border-b border-black/10 pb-8 sm:pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a14b30]">NovexaHub journal</p>
        <h1 className="display mt-3 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">Ideas for building better digital products.</h1>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-card p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a14b30]">Write for NovexaHub</p>
            <p className="mt-1 text-sm text-[#756b63]">Contribute original articles and earn for every approved post.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/blogs/submit">Submit a blog</Button>
            <Button href="/write-for-us" variant="ghost">How to write</Button>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#756b63]">Practical advice on websites, software projects, mobile apps and AI automation — from the NovexaHub studio.</p>
      </header>

      <div className="mt-9">
        {featured.length ? (
          <div className="mb-10">
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-black/10 pb-3">
              <h2 className="display text-2xl">Featured</h2>
              <span className="text-xs text-[#6f655d]">Picked by the studio</span>
            </div>
            <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
            </div>
          </div>
        ) : null}
        <div className="mb-4 flex items-end justify-between gap-4 border-b border-black/10 pb-3">
          <h2 className="display text-2xl">Latest articles</h2>
          {published.length ? <span className="text-xs text-[#6f655d]">{published.length} articles</span> : null}
        </div>
        {loading ? (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading articles">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-black/[0.09] bg-[#fffcf8] animate-pulse">
                <div className="aspect-[16/9] w-full bg-[#e8e1d7]" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-1/3 rounded bg-black/[0.07]" />
                  <div className="h-5 w-3/4 rounded bg-black/[0.07]" />
                  <div className="h-3 w-full rounded bg-black/[0.05]" />
                  <div className="h-3 w-2/3 rounded bg-black/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : published.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No posts published yet.</p>
        ) : (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {published.slice(0, visibleCount).map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
          </div>
        )}
        {published.length > visibleCount ? (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 12)}
              className="rounded-full border border-black/10 bg-card px-6 py-2.5 text-sm font-semibold text-[#16110e] transition hover:border-[#c45c3a]/40"
            >
              Load more articles
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-10 border-t border-black/10 pt-7">
        <div className="flex flex-wrap gap-3">
          <Button href="/portfolio">Browse portfolio</Button>
          <Button href="/contact" variant="ghost">Talk to studio</Button>
        </div>
      </div>
    </Section>
  );
}
