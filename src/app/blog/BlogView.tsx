"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";
import { getBlogPostsWithFallback } from "@/data/posts";
import type { BlogPost } from "@/types";

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

const fallbackCovers: Record<string, string> = {
  "how-to-choose-a-software-project-partner-novexahub": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=82",
  "ready-made-websites-vs-custom-software-projects": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=82",
  "mobile-app-and-flutter-software-projects-for-startups": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=82",
  "final-year-software-project-ideas-and-studio-support": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
  "ai-automation-software-projects-for-growing-businesses": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=82",
  "what-is-novexahub-digital-studio-explained": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82",
  "business-website-checklist-2026": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=82",
};

function PostCard({ post }: { post: BlogPost }) {
  const cover = post.cover || fallbackCovers[post.slug] || "/blog-cover-fallback.svg";
  const category = post.tags?.[0] || (post.trending ? "Trending" : "Insights");
  return (
    <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl border border-black/[0.09] bg-[#fffcf8] no-underline transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(22,17,14,0.08)]">
      <div className="aspect-[16/9] max-h-[150px] overflow-hidden bg-[#e8e1d7]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={`${post.title} article cover`} loading="lazy" className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/blog-cover-fallback.svg"; }} />
      </div>
      <div className="p-5 sm:p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a14b30]">
          <span className="max-w-[65%] truncate">{category}</span><span className="text-black/25">/</span><span className="font-medium tracking-normal text-[#81776e]">{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>
        <h2 className="mt-3 line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.02em] text-[#211a16] group-hover:text-[#a14b30]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#756b63]">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#211a16]">Read article <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
      </div>
    </Link>
  );
}

export function BlogView() {
  const { posts } = useApp();
  const published = useMemo(() => getBlogPostsWithFallback(posts), [posts]);
  const featured = published.find((item) => item.featured || item.trending);
  const remaining = published.filter((item) => item.id !== featured?.id);

  return (
    <Section className="max-w-6xl">
      <header className="border-b border-black/10 pb-8 sm:pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a14b30]">NovexaHub journal</p>
        <h1 className="display mt-3 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">Ideas for building better digital products.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#756b63]">Practical advice on websites, software projects, mobile apps and AI automation — from the NovexaHub studio.</p>
      </header>

      {published.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No posts published yet.</p>
      ) : (
        <>
          {featured ? (
            <div className="mt-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#81776e]">Editor’s pick</p>
              <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-2xl border border-black/[0.09] bg-[#fffcf8] no-underline sm:grid-cols-[0.9fr_1.1fr]">
                <div className="aspect-[16/9] overflow-hidden bg-[#e8e1d7] sm:aspect-auto sm:min-h-[210px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featured.cover || fallbackCovers[featured.slug] || "/blog-cover-fallback.svg"} alt={`${featured.title} article cover`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/blog-cover-fallback.svg"; }} />
                </div>
                <div className="flex flex-col justify-center p-5 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a14b30]">Featured article <span className="px-1 text-black/25">/</span> {formatDate(featured.publishedAt || featured.createdAt)}</p>
                  <h2 className="display mt-3 text-2xl leading-tight sm:text-3xl">{featured.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#756b63]">{featured.excerpt}</p>
                  <span className="mt-5 text-sm font-bold text-[#a14b30]">Read article <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            </div>
          ) : null}

          {remaining.length ? (
            <div className="mt-10">
              <div className="mb-4 flex items-end justify-between gap-4 border-b border-black/10 pb-3">
                <h2 className="display text-2xl">Latest articles</h2>
                <span className="text-xs text-[#81776e]">{remaining.length} articles</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {remaining.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            </div>
          ) : null}
        </>
      )}

      <div className="mt-10 flex flex-wrap gap-3 border-t border-black/10 pt-7">
        <Button href="/portfolio">Browse portfolio</Button>
        <Button href="/contact" variant="ghost">Talk to studio</Button>
      </div>
    </Section>
  );
}
