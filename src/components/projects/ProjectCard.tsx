"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectVisual } from "@/components/media/ProjectVisual";
import { Icon } from "@/components/ui/Icon";
import { TiltCard } from "@/components/ui/TiltCard";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "@/lib/cn";
import { projectCover } from "@/lib/cover";
import type { Project } from "@/types";

const heights = {
  short: "h-44",
  medium: "h-56",
  tall: "h-72",
};

export function ProjectCard({ project, featuredNote }: { project: Project; featuredNote?: boolean }) {
  const { isFavourite, toggleFavourite, user } = useApp();
  const router = useRouter();
  const loved = isFavourite(project.id);

  return (
    <article className="masonry-item">
      <div className="overflow-hidden rounded-[1.4rem] border border-black/10 bg-card">
        <Link href={`/projects/${project.slug}`} className="block">
          <div className={cn("relative overflow-hidden", heights[project.visual.height])}>
            <TiltCard max={7} className="h-full w-full">
              <ProjectVisual kind={project.visual.kind} mood={project.visual.mood} title={project.title} cover={projectCover(project)} className="h-full w-full" />
            </TiltCard>
            <div className="pointer-events-none absolute left-3 top-3 z-30 flex flex-wrap gap-1.5">
              {project.featured ? <span className="rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">Featured</span> : null}
              {project.trending ? <span className="rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/80">Trending</span> : null}
            </div>
          </div>
        </Link>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#c45c3a]">{project.subcategory}</p>
              <Link href={`/projects/${project.slug}`} className="display mt-1 block text-lg leading-tight tracking-tight">
                {project.title}
              </Link>
            </div>
            <button
              type="button"
              aria-label={loved ? "Remove favourite" : "Save to favourites"}
              onClick={() => {
                const ok = toggleFavourite(project.id);
                if (!ok && !user) router.push(`/login?next=/projects/${project.slug}`);
              }}
              className={cn("grid h-10 w-10 place-items-center rounded-full border border-black/10", loved && "text-[#c45c3a]")}
            >
              <Icon name={loved ? "heart-fill" : "heart"} />
            </button>
          </div>
          <p className="line-clamp-2 text-sm text-[#6d655d]">{project.tagline}</p>
          <div className="flex items-center justify-between text-xs text-[#6d655d]">
            <span className="inline-flex items-center gap-1"><Icon name="clock" className="h-3.5 w-3.5" /> {project.deliveryDays} days typical</span>
            <span className="inline-flex items-center gap-1"><Icon name="star" className="h-3.5 w-3.5 text-[#c45c3a]" /> {project.rating}</span>
          </div>
          {featuredNote ? <p className="text-[11px] uppercase tracking-[0.14em] text-[#6d655d]">WhatsApp or email to enquire</p> : null}
        </div>
      </div>
    </article>
  );
}
