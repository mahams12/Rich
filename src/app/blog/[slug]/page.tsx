import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostsWithFallback, posts as seedPosts } from "@/data/posts";
import { site } from "@/data/site";
import { fetchCatalogServer } from "@/lib/firebase/rest";
import { BlogPostView } from "./BlogPostView";
import type { BlogPost } from "@/types";

async function catalogPosts(): Promise<BlogPost[]> {
  // Merged remote + bundled posts — the same set the view renders.
  const catalog = await fetchCatalogServer();
  return getBlogPostsWithFallback(catalog?.posts ?? seedPosts);
}

export async function generateStaticParams() {
  const posts = await catalogPosts();
  return posts.filter((item) => item.status === "published" && !item.deleted).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = (await catalogPosts()).find((item) => item.slug === slug && !item.deleted && item.status === "published");
  if (!post) return { title: "Blog post", robots: { index: false } };
  const title = post.seoTitle || `${post.title} | NovexaHub Blog`;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    keywords: [...post.keywords, ...post.tags, "NovexaHub", "novexahub.live", "software project"],
    alternates: { canonical: `${site.url}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${site.url}/blog/${post.slug}`,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await catalogPosts();
  const post = posts.find((item) => item.slug === slug && !item.deleted && item.status === "published");
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: { "@type": "Organization", name: post.author || site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/brand/icon.svg` },
    },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
    image: post.cover || undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostView initialPosts={posts} />
    </>
  );
}
