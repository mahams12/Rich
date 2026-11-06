import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects as seedProjects } from "@/data/projects";
import { site } from "@/data/site";
import { fetchCatalogServer } from "@/lib/firebase/rest";
import { ProjectDetailView } from "./ProjectDetailView";
import type { Project } from "@/types";

async function catalogProjects(): Promise<Project[]> {
  // Keep the detail route, metadata, static params and sitemap aligned.
  // A deleted listing must never remain accessible through a stale direct URL.
  const catalog = await fetchCatalogServer();
  const source = catalog?.projects ?? seedProjects;
  const bySlug = new Map<string, Project>();
  for (const project of source) {
    if (project.status !== "published" || project.deleted || !project.slug) continue;
    if (!bySlug.has(project.slug)) bySlug.set(project.slug, project);
  }
  return [...bySlug.values()];
}

export async function generateStaticParams() {
  return (await catalogProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = (await catalogProjects()).find((item) => item.slug === slug);
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };

  const description = project.description.replace(/\\s+/g, " ").trim();
  const socialImage =
    project.gallery?.find((image) => typeof image === "string" && image.trim()) ||
    project.cover ||
    undefined;
  const title = `${project.title} — ${project.subcategory}`;
  const url = `${site.url}/projects/${project.slug}`;

  return {
    title,
    description,
    keywords: [...project.tags, ...project.technologies, project.subcategory, "NovexaHub"],
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: site.name,
      ...(socialImage ? { images: [{ url: socialImage, alt: `${project.title} project preview` }] } : {}),
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await catalogProjects();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const projectImage =
    project.gallery?.find((image) => typeof image === "string" && image.trim()) ||
    project.cover ||
    undefined;
  const projectUrl = `${site.url}/projects/${project.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${projectUrl}#project`,
        name: project.title,
        description: project.description,
        ...(projectImage ? { image: projectImage } : {}),
        keywords: [...project.tags, ...project.technologies, project.subcategory],
        mainEntityOfPage: projectUrl,
        brand: { "@type": "Brand", name: site.name },
        creator: { "@type": "Organization", name: site.name, url: site.url },
        url: projectUrl,
        ...(project.publishedAt ? { datePublished: project.publishedAt } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Portfolio", item: `${site.url}/portfolio` },
          { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectDetailView initialProjects={projects} />
    </>
  );
}
