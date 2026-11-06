"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { ProjectVisual } from "@/components/media/ProjectVisual";
import { Badge, Section } from "@/components/ui/Button";
import { getPublishedProjects } from "@/data/projects";
import { projectCover } from "@/lib/cover";
import type { Project } from "@/types";

export function PortfolioView({ initialProjects }: { initialProjects?: Project[] }) {
  const { projects, catalogReady } = useApp();
  // Server-rendered catalogue is the crawlable baseline; the live snapshot
  // replaces it only when it has usable project data.
  const effectiveProjects = catalogReady && projects.length
    ? projects
    : initialProjects?.length
      ? initialProjects
      : projects;
  const list = useMemo(() => getPublishedProjects(effectiveProjects), [effectiveProjects]);
  const loading = !list.length && !catalogReady;

  return (
    <Section>
      <Badge>Portfolio</Badge>
      <h1 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">Work worth keeping</h1>
      <p className="mt-4 max-w-2xl text-[#6d655d]">
        Explore NovexaHub's published websites, apps, ecommerce platforms, dashboards and automation projects. Open any project to see its details, features, technologies and customization options.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-black/10 bg-card animate-pulse">
            <div className="aspect-[4/3] bg-black/[0.06] sm:aspect-[16/10]" />
            <div className="space-y-3 p-5"><div className="h-3 w-1/3 rounded bg-black/[0.07]" /><div className="h-5 w-3/4 rounded bg-black/[0.07]" /><div className="h-3 w-full rounded bg-black/[0.05]" /><div className="h-3 w-2/3 rounded bg-black/[0.05]" /></div>
          </div>
        )) : null}
        {!loading ? list.map((project, index) => (
          <article key={project.id} className="group">
            <Link href={`/projects/${project.slug}`} className="block">
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-card">
                <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                  <ProjectVisual
                    kind={project.visual.kind}
                    mood={project.visual.mood}
                    title={project.title}
                    cover={projectCover(project)}
                    priority={index < 3}
                    preload={index === 0}
                    className="h-full w-full transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a14b30]">{project.subcategory}</p>
                  <h2 className="display mt-1 text-xl tracking-tight">{project.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#6d655d]">{project.description}</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-[#a14b30]">View project details</span>
                </div>
              </div>
            </Link>
          </article>
        )) : null}
      </div>
    </Section>
  );
}
