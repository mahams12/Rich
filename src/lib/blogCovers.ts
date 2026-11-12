import type { BlogPost } from "@/types";

// Verified article-specific covers. These win over stale/invalid URLs saved in
// older live blog records (see resolveBlogCover).
const fallbackCovers: Record<string, string> = {
  "how-to-choose-a-software-project-partner-novexahub": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=82",
  "ready-made-websites-vs-custom-software-projects": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=82",
  "mobile-app-and-flutter-software-projects-for-startups": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=82",
  "final-year-software-project-ideas-and-studio-support": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
  "ai-automation-software-projects-for-growing-businesses": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=82",
  "what-is-novexahub-digital-studio-explained": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82",
  "business-website-checklist-2026": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=82",
  "how-to-improve-your-business-with-a-website": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82",
  "ai-automation-for-small-businesses-in-2026-practical-ways-to-save-time-and-grow-faster": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=82",
};

/**
 * Cover candidates for a post, best first. The stored cover (uploaded to
 * Firebase Storage or an external URL saved on the record) wins; curated
 * per-slug covers act as the runtime fallback for records whose stored URL
 * is stale or undeliverable. If nothing exists, both are undefined.
 */
export function blogCoverSources(post: Pick<BlogPost, "slug" | "title" | "cover">): {
  src?: string;
  fallbackSrc?: string;
} {
  const normalizedTitle = post.title.toLowerCase();
  const titleCover = normalizedTitle.includes("how to improve your business with a website")
    ? "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82"
    : normalizedTitle.includes("ai automation for small businesses")
      ? "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=82"
      : undefined;
  const stored = post.cover?.trim() || undefined;
  const mapped = titleCover || fallbackCovers[post.slug];
  const src = stored || mapped;
  const fallbackSrc = stored && mapped && mapped !== stored ? mapped : undefined;
  return { src, fallbackSrc };
}

/**
 * Rewrite an Unsplash (imgix) URL to the width actually rendered, so cards
 * don't download hero-sized files. Non-Unsplash sources pass through.
 */
export function sizedCover(src: string | undefined, width: number): string | undefined {
  if (!src || !src.startsWith("https://images.unsplash.com/")) return src;
  try {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    if (!url.searchParams.has("q")) url.searchParams.set("q", "80");
    return url.toString();
  } catch {
    return src;
  }
}
