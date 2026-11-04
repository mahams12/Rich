import type { MetadataRoute } from "next";
import { getBlogPostsWithFallback, posts as seedPosts } from "@/data/posts";
import { projects as seedProjects } from "@/data/projects";
import { site } from "@/data/site";
import { fetchCatalogServer } from "@/lib/firebase/rest";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/portfolio",
    "/blog",
    "/explore",
    "/services",
    "/web-development",
    "/mobile-app-development",
    "/custom-software-development",
    "/ai-automation",
    "/ai-chatbot-development",
    "/saas-development",
    "/ecommerce-development",
    "/ui-ux-design",
    "/graphic-design",
    "/video-editing",
    "/features",
    "/builder",
    "/about",
    "/our-team",
    "/reviews",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/delivery-policy",
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.9 : 0.8,
  }));

  // fetchCatalogServer returns the merged catalogue (remote + bundled seeds),
  // the same source project pages resolve from — no emitted URL can hit the
  // in-app "not found" state. Seeds are the fallback when the fetch fails.
  const catalog = await fetchCatalogServer();
  const projects = catalog?.projects ?? seedProjects;
  // Same merged post list the blog views render — no orphaned URLs either way.
  const posts = getBlogPostsWithFallback(catalog?.posts ?? seedPosts);

  const projectRoutes = projects
    .filter((project) => project.status === "published" && !project.deleted)
    .map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      lastModified: new Date(project.publishedAt || project.createdAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Every code-published blog in src/data/posts.ts is included automatically.
  // Keep this data-driven: never hardcode individual article slugs here.
  const postRoutes = Array.from(
    new Map(
      posts
        .filter((post) => post.status === "published" && !post.deleted && post.slug)
        .map((post) => [post.slug, post]),
    ).values(),
  ).map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
