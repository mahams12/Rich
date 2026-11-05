"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section } from "@/components/ui/Button";
import { getBlogPostsWithFallback } from "@/data/posts";
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

const fallbackCovers: Record<string, string> = {
  "how-to-choose-a-software-project-partner-novexahub": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=82",
  "ready-made-websites-vs-custom-software-projects": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=82",
  "mobile-app-and-flutter-software-projects-for-startups": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=82",
  "final-year-software-project-ideas-and-studio-support": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
  "ai-automation-software-projects-for-growing-businesses": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=82",
  "what-is-novexahub-digital-studio-explained": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82",
  "business-website-checklist-2026": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=82",
};

function CoverImage({ post, index }: { post: BlogPost; index: number }) {
  const [failed, setFailed] = useState(false);
  const cover = post.cover || fallbackCovers[post.slug] || "/blog-cover-fallback.svg";
  const className = "absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]";
  // data:/blob: sources can't go through the image optimizer.
  if (!failed && (cover.startsWith("data:") || cover.startsWith("blob:"))) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={cover} alt={`${post.title} article cover`} loading="lazy" className={className} onError={() => setFailed(true)} />
    );
  }
  // Local assets (svg fallback) skip the optimizer; broken remotes degrade to it.
  if (failed || cover.startsWith("/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/blog-cover-fallback.svg" alt={`${post.title} article cover`} loading="lazy" className={className} />
    );
  }
  return (
    <Image
      src={cover}
      alt={`${post.title} article cover`}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      {...(index === 0
        ? { preload: true, fetchPriority: "high" as const }
        : { loading: index < 3 ? ("eager" as const) : ("lazy" as const), fetchPriority: index < 2 ? ("high" as const) : ("auto" as const) })}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const category = post.tags?.[0] || "Insights";
  return (
    <Link href={`/blog/${post.slug}`} onClick={() => rememberBlogNavigation(post.slug)} className="group block overflow-hidden rounded-2xl border border-black/[0.09] bg-[#fffcf8] no-underline transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(22,17,14,0.08)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e8e1d7]">
        <CoverImage post={post} index={index} />
      </div>
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
  const loading = !catalogReady && !initialPosts?.length;
  const featured = useMemo(() => published.filter((post) => post.featured).slice(0, 3), [published]);

  return (
    <Section className="max-w-6xl">
      <header className="border-b border-black/10 pb-8 sm:pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a14b30]">NovexaHub journal</p>
        <h1 className="display mt-3 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">Ideas for building better digital products.</h1>
        <div className="mt-8 rounded-[2rem] border border-black/10 bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a14b30]">Write for NovexaHub — earn for your work</p>
              <p className="mt-3 text-sm leading-6 text-[#6d655d]">
                Passionate about technology, business, AI, digital innovation or creative writing? NovexaHub invites
                writers, students and content creators worldwide to contribute original articles. Write useful content,
                pass editorial review, and earn a reward for every approved article.
              </p>
            </div>
            <Button href="/blog/submit" variant="light" className="shrink-0">Start writing</Button>
          </div>
          <ol className="mt-6 grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {[
              ["01", "Choose your topic", "Pick from approved categories — AI, development, business, marketing, productivity."],
              ["02", "Write your article", "Original, informative and engaging, following editorial guidelines."],
              ["03", "Submit for review", "Send it through the contributor submission portal."],
              ["04", "Get approved", "Manual editorial review for quality, originality and relevance."],
              ["05", "Earn your reward", "A reward for every approved article accumulates in your account."],
            ].map(([n, t, d]) => (
              <li key={n} className="rounded-2xl border border-black/5 bg-white/60 p-3">
                <p className="text-[10px] font-bold text-[#a14b30]">{n}</p>
                <p className="mt-1 font-semibold text-[#16110e]">{t}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-5 text-muted">
            Approved articles earn a $1 reward (or local equivalent at the applicable exchange rate), paid via
            supported methods once the payout threshold is reached. All articles must be original — plagiarized or
            AI-spun submissions are rejected, and submission does not guarantee approval.
          </p>
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
            {published.map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-black/10 pt-7">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-[#fffcf8] p-5">
          <div>
            <p className="font-semibold text-[#211a16]">Write for NovexaHub — earn 50 PKR</p>
            <p className="mt-1 text-sm text-[#756b63]">Share a practical article. Approved submissions are published under your name.</p>
          </div>
          <Button href="/blog/submit">Submit a blog</Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/portfolio">Browse portfolio</Button>
          <Button href="/contact" variant="ghost">Talk to studio</Button>
        </div>
      </div>
    </Section>
  );
}
