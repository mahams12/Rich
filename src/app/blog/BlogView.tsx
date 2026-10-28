"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Section } from "@/components/ui/Button";
import { getPublishedPosts } from "@/data/posts";
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
  const cover = post.cover || fallbackCovers[post.slug];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group glass overflow-hidden rounded-[1.75rem] no-underline transition hover:-translate-y-0.5"
    >
      {cover ? (
        <div className="h-44 w-full overflow-hidden bg-[#f3efe8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={`${post.title} — NovexaHub blog article cover`} className="h-full w-full object-cover object-center" />
        </div>
      ) : (
        <div className="flex h-44 items-end bg-[#16110e] p-5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c45c3a]">
            {post.trending ? "Trending" : post.featured ? "Featured" : "Blog"}
          </span>
        </div>
      )}
      <div className="space-y-2 p-5">
        <p className="text-xs text-muted">{formatDate(post.publishedAt || post.createdAt)}</p>
        <h2 className="font-display text-lg font-bold leading-snug text-ink group-hover:text-[#c45c3a]">{post.title}</h2>
        <p className="line-clamp-3 text-sm text-[#6d655d]">{post.excerpt}</p>
      </div>
    </Link>
  );
}

export function BlogView() {
  const { posts } = useApp();
  const published = useMemo(() => getPublishedPosts(posts), [posts]);
  const featured = published.filter((item) => item.featured || item.trending).slice(0, 3);

  return (
    <Section>
      <Badge>Blog</Badge>
      <h1 className="display mt-4 text-4xl sm:text-5xl">Trends, software projects & NovexaHub</h1>
      <p className="mt-3 max-w-2xl text-[#6d655d]">
        Guides on software projects, ready-made websites, apps, AI automation, and how to work with the NovexaHub studio on novexahub.live.
      </p>

      {featured.length ? (
        <div className="mt-10">
          <h2 className="display text-2xl">Trending</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-12">
        <h2 className="display text-2xl">All posts</h2>
        {published.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No posts published yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/portfolio">Browse portfolio</Button>
        <Button href="/contact" variant="ghost">Talk to studio</Button>
      </div>
    </Section>
  );
}
