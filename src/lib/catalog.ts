import { projects as seedProjects, sortProjectsNewestFirst } from "@/data/projects";
import { sortPostsNewestFirst } from "@/data/posts";
import type { BlogPost, Project } from "@/types";

export function isBlogRemoteDoc(data: Record<string, unknown>, id: string) {
  return (
    data._kind === "blog" ||
    id.startsWith("blog_") ||
    // Older blog documents may predate the _kind marker and blog_ ID prefix.
    // A full article body + excerpt + slug distinguishes them from projects.
    (typeof data.content === "string" &&
      typeof data.excerpt === "string" &&
      typeof data.slug === "string")
  );
}

export function mergeProjects(remote: Project[]) {
  return sortProjectsNewestFirst(
    remote.filter((item) =>
      !item.deleted &&
      !isBlogRemoteDoc(item as unknown as Record<string, unknown>, item.id),
    ),
  );
}

export function mergePosts(remote: BlogPost[]) {
  return sortPostsNewestFirst(remote.filter((item) => !item.deleted));
}

export function mapBlogDoc(id: string, data: Record<string, unknown>): BlogPost {
  const rawId = typeof data.id === "string" ? data.id : id.replace(/^blog_/, "");
  return {
    ...(data as unknown as BlogPost),
    id: rawId,
  };
}

/**
 * Projects and blog posts share the public `projects` collection. Splits a list
 * of raw documents into the two catalogues — used by the live snapshot listener
 * and the server-side REST fetch so both paths produce identical results.
 *
 * Project catalogue = remote documents + bundled seeds for any id the remote
 * does not cover. Remote wins: an admin-deleted project (deleted: true doc)
 * stays hidden even though a seed with the same id exists, because it occupies
 * the id slot. This keeps sitemap, metadata and detail pages consistent —
 * every emitted /projects/{slug} resolves to real content.
 */
export function splitCatalogDocs(docs: { id: string; data: Record<string, unknown> }[]) {
  const remoteProjects: Project[] = [];
  const remotePosts: BlogPost[] = [];
  for (const item of docs) {
    if (isBlogRemoteDoc(item.data, item.id)) {
      remotePosts.push(mapBlogDoc(item.id, item.data));
    } else {
      remoteProjects.push({ ...(item.data as unknown as Project), id: item.id });
    }
  }
  const remoteById = new Map(remoteProjects.map((item) => [item.id, item]));
  const seedExtras = seedProjects.filter((item) => !item.deleted && !remoteById.has(item.id));
  return { projects: mergeProjects([...remoteProjects, ...seedExtras]), posts: mergePosts(remotePosts) };
}
