"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { recordBlogVisit, rememberBlogNavigation } from "@/lib/blogAnalytics";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Section } from "@/components/ui/Button";
import { getBlogPostsWithFallback } from "@/data/posts";
import { isStudioAdmin } from "@/lib/admin";
import type { BlogPost } from "@/types";

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}


function renderInlineLinks(value: string) {
  return value.split(/(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*\*[^*]+\*\*)/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="font-semibold text-[#a14b30] underline decoration-[#c45c3a]/40 underline-offset-4 hover:decoration-current">{link[1]}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function PostCover({ src, alt, className, sizes }: { src: string; alt: string; className: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={failed ? "/blog-cover-fallback.svg" : src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className={className} onError={() => setFailed(true)} />;
}

export function BlogPostView({ initialPosts }: { initialPosts?: BlogPost[] }) {
  const { slug } = useParams<{ slug: string }>();
  const { posts, user, catalogReady, ready } = useApp();
  const effectivePosts = catalogReady || !initialPosts?.length ? posts : initialPosts;
  const availablePosts = useMemo(() => getBlogPostsWithFallback(effectivePosts), [effectivePosts]);
  const post = useMemo(
    () => availablePosts.find((item) => item.slug === slug && !item.deleted),
    [availablePosts, slug],
  );
  useEffect(() => {
    // Wait for auth to resolve so a signed-in admin's own views stay excluded.
    if (ready && post?.status === "published" && !isStudioAdmin(user)) {
      void recordBlogVisit(post.slug).catch(() => undefined);
    }
  }, [post?.slug, post?.status, user, ready]);
  const related = useMemo(() => {
    if (!post) return [];
    const currentTags = new Set((post.tags || []).map((tag) => tag.toLowerCase()));
    return getBlogPostsWithFallback(effectivePosts)
      .filter((item) => item.id !== post.id && item.status === "published" && !item.deleted)
      .map((item) => ({
        item,
        score: (item.tags || []).filter((tag) => currentTags.has(tag.toLowerCase())).length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ item }) => item);
  }, [post, effectivePosts]);

  if (!post || (post.status !== "published" && !isStudioAdmin(user))) {
    return (
      <Section>
        <h1 className="display text-3xl">Post not found</h1>
        <p className="mt-3 text-muted">This article may be unpublished or moved.</p>
        <Button href="/blog" className="mt-6">Back to blog</Button>
      </Section>
    );
  }

  const contentBlocks = post.content
    .split(/\n\s*\n+/)
    .map((item) => item.replace(/https?:\/\/(?:www\.)?novexahub\.live(?:\/[a-zA-Z0-9/_-]*)?/g, "").replace(/\n[\t ]+/g, "\n").trim())
    .filter(Boolean);

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
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a14b30]">
        {post.trending ? "Trending" : "Blog"} · {formatDate(post.publishedAt || post.createdAt)}
      </p>
      <h1 className="display mt-3 text-4xl leading-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-[#6d655d]">{post.excerpt}</p>
      <p className="mt-3 text-sm text-muted">By {post.author}</p>

      {post.cover ? (
        <div className="relative mx-auto mt-7 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl border border-black/10 bg-[#e8e1d7]">
          <PostCover src={post.cover} alt={post.title} sizes="(max-width: 896px) 100vw, 896px" className="absolute inset-0 h-full w-full object-cover object-center" />
        </div>
      ) : null}

      <article className="mx-auto mt-8 max-w-3xl space-y-5 text-[1.05rem] leading-8 text-ink">
        {contentBlocks.map((block, index) => {
          const key = `${index}-${block.slice(0, 32)}`;
          if (block.startsWith("### ")) {
            return <h3 key={key} className="pt-3 text-xl font-bold leading-snug text-ink">{block.slice(4)}</h3>;
          }
          if (block.startsWith("## ")) {
            return <h2 key={key} className="pt-5 text-2xl font-bold leading-snug text-ink">{block.slice(3)}</h2>;
          }
          if (block.split("\n").every((line) => line.startsWith("- "))) {
            return <ul key={key} className="list-disc space-y-2 pl-6">{block.split("\n").map((line, itemIndex) => <li key={itemIndex}>{renderInlineLinks(line.slice(2))}</li>)}</ul>;
          }
          if (block.split("\n").every((line) => /^\d+\. /.test(line))) {
            return <ol key={key} className="list-decimal space-y-2 pl-6">{block.split("\n").map((line, itemIndex) => <li key={itemIndex}>{renderInlineLinks(line.replace(/^\d+\. /, ""))}</li>)}</ol>;
          }
          return <p key={key}>{renderInlineLinks(block)}</p>;
        })}
      </article>

      {post.gallery && post.gallery.length > 1 ? (
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {post.gallery.slice(1).map((src) => (
            <div key={src} className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-black/10 bg-[#e8e1d7]">
              <PostCover src={src} alt="" sizes="(max-width: 640px) 100vw, 280px" className="absolute inset-0 h-full w-full object-cover object-center" />
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
        <section className="mx-auto mt-12 max-w-5xl">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-black/10 pb-3">
            <h2 className="display text-2xl">Related reading</h2>
            <Link href="/blog" className="text-sm font-semibold text-[#a14b30] hover:underline">All articles</Link>
          </div>
          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/blog/${item.slug}`} onClick={() => rememberBlogNavigation(item.slug)} className="group block overflow-hidden rounded-2xl border border-black/[0.09] bg-[#fffcf8] no-underline transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(22,17,14,0.08)]">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e8e1d7]">
                  <PostCover src={item.cover || "/blog-cover-fallback.svg"} alt={`${item.title} article cover`} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a14b30]">{item.tags?.[0] || "Insights"}</p>
                  <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-[#211a16] group-hover:text-[#a14b30]">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#756b63]">{item.excerpt}</p>
                  <span className="mt-3 inline-flex text-sm font-semibold text-[#211a16]">Read article →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </Section>
  );
}
