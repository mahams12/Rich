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
    "/write-for-us",
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

  // Match the published catalogue used by portfolio and project detail routes.
  const catalog = await fetchCatalogServer();
  const projects = catalog?.projects ?? seedProjects;
  const posts = getBlogPostsWithFallback(catalog?.posts ?? seedPosts);

  // De-duplicate by slug so the sitemap never advertises competing URLs for
  // the same detail route.
  const uniqueProjects = Array.from(
    new Map(
      projects
        .filter((project) => project.status === "published" && !project.deleted && project.slug)
        .map((project) => [project.slug, project]),
    ).values(),
  );

  const projectRoutes = uniqueProjects.map((project) => {
    const modified = project.publishedAt || project.createdAt;
    return {
      url: `${site.url}/projects/${project.slug}`,
      lastModified: modified && !Number.isNaN(Date.parse(modified)) ? new Date(modified) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  const postRoutes = Array.from(
    new Map(
      posts
        .filter((post) => post.status === "published" && !post.deleted && post.slug)
        .map((post) => [post.slug, post]),
    ).values(),
  ).map((post) => {
    const modified = post.updatedAt || post.publishedAt || post.createdAt;
    return {
      url: `${site.url}/blog/${post.slug}`,
      lastModified: modified && !Number.isNaN(Date.parse(modified)) ? new Date(modified) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    };
  });

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
