"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { ProjectVisual } from "@/components/media/ProjectVisual";
import { Badge, Section } from "@/components/ui/Button";
import { getPublishedProjects } from "@/data/projects";
import { projectCover } from "@/lib/cover";
import type { Project } from "@/types";

export function PortfolioView({ initialProjects }: { initialProjects?: Project[] }) {
  const { projects, catalogReady } = useApp();
  // Server-rendered catalog (if provided) shows immediately; the live snapshot
  // takes over once the client listener delivers fresher data.
  const effectiveProjects = catalogReady || !initialProjects?.length ? projects : initialProjects;
  const list = useMemo(() => getPublishedProjects(effectiveProjects), [effectiveProjects]);
  const [visibleCount, setVisibleCount] = useState(12);
  const loading = !catalogReady && !initialProjects?.length;

  return (
    <Section>
      <Badge>Portfolio</Badge>
      <h1 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">Work worth keeping</h1>
      <p className="mt-4 max-w-2xl text-[#6d655d]">
        Every listing the studio publishes — image, description, and a direct line to WhatsApp or email. Nothing is sold through checkout on this site.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-black/10 bg-card animate-pulse">
            <div className="aspect-[4/3] bg-black/[0.06] sm:aspect-[16/10]" />
            <div className="space-y-3 p-5"><div className="h-3 w-1/3 rounded bg-black/[0.07]" /><div className="h-5 w-3/4 rounded bg-black/[0.07]" /><div className="h-3 w-full rounded bg-black/[0.05]" /><div className="h-3 w-2/3 rounded bg-black/[0.05]" /></div>
          </div>
        )) : null}
        {!loading ? list.slice(0, visibleCount).map((project, index) => (
          <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
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
              </div>
            </div>
          </Link>
        )) : null}
      </div>
      {!loading && list.length > visibleCount ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 12)}
            className="rounded-full border border-black/10 bg-card px-6 py-2.5 text-sm font-semibold text-[#16110e] transition hover:border-[#c45c3a]/40"
          >
            Load more projects
          </button>
        </div>
      ) : null}
    </Section>
  );
}
