import type { Metadata } from "next";
import { posts } from "@/data/posts";
import { site } from "@/data/site";
import { BlogPostView } from "./BlogPostView";

export function generateStaticParams() {
  return posts.filter((item) => item.status === "published").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return { title: "Blog post" };
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  const jsonLd = post
    ? {
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
      }
    : null;

  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      <BlogPostView />
    </>
  );
}
