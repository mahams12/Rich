import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { fetchCatalogServer } from "@/lib/firebase/rest";
import { ProjectDetailView } from "./ProjectDetailView";

export function generateStaticParams() {
  return projects
    .filter((project) => project.status === "published" && !project.deleted)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project" };
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
  const project = projects.find((item) => item.slug === slug);
  const jsonLd = project
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        brand: { "@type": "Brand", name: site.name },
        url: `${site.url}/projects/${project.slug}`,
      }
    : null;

  const catalog = await fetchCatalogServer();
  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      <ProjectDetailView initialProjects={catalog?.projects} />
    </>
  );
}
