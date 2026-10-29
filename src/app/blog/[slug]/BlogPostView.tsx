"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Section } from "@/components/ui/Button";
import { getBlogPostsWithFallback } from "@/data/posts";
import { isStudioAdmin } from "@/lib/admin";

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

export function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  const { posts, user } = useApp();
  const availablePosts = useMemo(() => getBlogPostsWithFallback(posts), [posts]);
  const post = useMemo(
    () => availablePosts.find((item) => item.slug === slug && !item.deleted),
    [availablePosts, slug],
  );
  const related = useMemo(() => {
    if (!post) return [];
    return getBlogPostsWithFallback(posts)
      .filter((item) => item.id !== post.id)
      .slice(0, 3);
  }, [post, posts]);

  if (!post || (post.status !== "published" && !isStudioAdmin(user))) {
    return (
      <Section>
        <h1 className="display text-3xl">Post not found</h1>
        <p className="mt-3 text-muted">This article may be unpublished or moved.</p>
        <Button href="/blog" className="mt-6">Back to blog</Button>
      </Section>
    );
  }

  const paragraphs = post.content.split(/\n\n+/).map((item) => item.trim()).filter(Boolean);

  return (
    <Section className="max-w-5xl">
      {isStudioAdmin(user) ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge>Admin</Badge>
          <Button href={`/admin/blog/${post.id}`} variant="ghost" className="px-3 py-1.5 text-xs">
            Edit post
          </Button>
        </div>
      ) : null}
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c45c3a]">
        {post.trending ? "Trending" : "Blog"} · {formatDate(post.publishedAt || post.createdAt)}
      </p>
      <h1 className="display mt-3 text-4xl leading-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-[#6d655d]">{post.excerpt}</p>
      <p className="mt-3 text-sm text-muted">By {post.author}</p>

      {post.cover ? (
        <div className="mx-auto mt-7 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl border border-black/10 bg-[#e8e1d7] sm:max-h-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt={post.title}
            className="block h-full w-full object-cover object-center"
            onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/blog-cover-fallback.svg"; }}
          />
        </div>
      ) : null}

      <article className="mx-auto mt-8 max-w-3xl space-y-5 text-[1.05rem] leading-8 text-ink">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </article>

      {post.gallery && post.gallery.length > 1 ? (
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {post.gallery.slice(1).map((src) => (
            <div key={src} className="aspect-[4/3] overflow-hidden rounded-xl border border-black/10 bg-[#e8e1d7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="block h-full w-full object-cover" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/blog-cover-fallback.svg"; }} />
            </div>
          ))}
        </div>
      ) : null}

      {post.tags.length ? (
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-muted">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-3 border-t border-black/10 pt-8">
        <Button href="/contact">Enquire with NovexaHub</Button>
        <Button href="/portfolio" variant="ghost">See portfolio</Button>
        <Button href="/blog" variant="ghost">All posts</Button>
      </div>

      {related.length ? (
        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="display text-2xl">Related reading</h2>
          <ul className="mt-4 space-y-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/blog/${item.slug}`} className="font-semibold text-[#c45c3a] hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
