import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects as seedProjects } from "@/data/projects";
import { site } from "@/data/site";
import { fetchCatalogServer } from "@/lib/firebase/rest";
import { ProjectDetailView } from "./ProjectDetailView";
import type { Project } from "@/types";

async function catalogProjects(): Promise<Project[]> {
  // Same merged source the detail view uses — metadata, JSON-LD, static
  // params and sitemap can never disagree about whether a slug exists.
  const catalog = await fetchCatalogServer();
  return catalog?.projects ?? seedProjects;
}

export async function generateStaticParams() {
  const projects = await catalogProjects();
  return projects
    .filter((project) => project.status === "published" && !project.deleted)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = (await catalogProjects()).find((item) => item.slug === slug && item.status === "published");
  if (!project) return { title: "Project", robots: { index: false } };
  return {
    title: `${project.title} — ${project.subcategory}`,
    description: project.description,
    keywords: [...project.tags, ...project.technologies, "NovexaHub", "digital studio"],
    alternates: { canonical: `${site.url}/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.tagline,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await catalogProjects();
  const project = projects.find((item) => item.slug === slug && item.status === "published");
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        brand: { "@type": "Brand", name: site.name },
        url: `${site.url}/projects/${project.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Portfolio", item: `${site.url}/portfolio` },
          { "@type": "ListItem", position: 3, name: project.title, item: `${site.url}/projects/${project.slug}` },
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
