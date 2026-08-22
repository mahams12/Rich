"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { ProjectVisual } from "@/components/media/ProjectVisual";
import { Badge, Section } from "@/components/ui/Button";
import { getPublishedProjects } from "@/data/projects";
import { projectCover } from "@/lib/cover";

export function PortfolioView() {
  const { projects } = useApp();
  const list = useMemo(() => getPublishedProjects(projects), [projects]);

  return (
    <Section>
      <Badge>Portfolio</Badge>
      <h1 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">Work worth keeping</h1>
      <p className="mt-4 max-w-2xl text-[#6d655d]">
        Every listing the studio publishes — image, description, and a direct line to WhatsApp or email. Nothing is sold through checkout on this site.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-card">
              <div className="relative aspect-[4/3] overflow-hidden">
                <ProjectVisual
                  kind={project.visual.kind}
                  mood={project.visual.mood}
                  title={project.title}
                  cover={projectCover(project)}
                  className="h-full w-full transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c45c3a]">{project.subcategory}</p>
                <h2 className="display mt-1 text-xl tracking-tight">{project.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#6d655d]">{project.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
