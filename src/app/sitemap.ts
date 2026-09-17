import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/portfolio",
    "/blog",
    "/explore",
    "/services",
    "/features",
    "/builder",
    "/about",
    "/reviews",
    "/contact",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.9 : 0.8,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const postRoutes = posts
    .filter((post) => post.status === "published")
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
