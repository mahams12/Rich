"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { ProjectVisual } from "@/components/media/ProjectVisual";
import { Icon } from "@/components/ui/Icon";
import { getPublishedProjects } from "@/data/projects";
import { projectCover } from "@/lib/cover";

export function ProjectFan() {
  const { projects } = useApp();
  const items = useMemo(() => {
    const published = getPublishedProjects(projects);
    const featured = published.filter((item) => item.featured);
    const pool = featured.length >= 7 ? featured : published;
    return pool.slice(0, 9);
  }, [projects]);

  const [active, setActive] = useState(Math.floor(Math.min(items.length, 9) / 2));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [items.length, paused]);

  if (!items.length) return null;

  return (
    <section className="overflow-hidden px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d655d]">Industries</p>
        <h2 className="display mt-3 text-3xl tracking-tight sm:text-5xl">Built for every business</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#6d655d]">
          Real projects for real businesses, from clinics and shops to apps, automation and student kits.
        </p>
      </div>

      <div
        className="relative mx-auto mt-8 h-[28rem] max-w-6xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((project, index) => {
          let offset = index - active;
          const half = Math.floor(items.length / 2);
          if (offset > half) offset -= items.length;
          if (offset < -half) offset += items.length;
          const abs = Math.abs(offset);
          const rotate = offset * 9;
          const x = offset * 118;
          const y = abs * 22;
          const scale = Math.max(0.62, 1 - abs * 0.09);
          const isCenter = offset === 0;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => setActive(index)}
              className="absolute left-1/2 top-6 h-[22rem] w-[13.5rem] origin-bottom overflow-hidden rounded-[1.4rem] border border-black/10 bg-[#111] shadow-[0_18px_40px_rgba(22,17,14,0.16)]"
              style={{
                zIndex: 40 - abs,
                transform: `translateX(calc(-50% + ${x}px)) translateY(${y}px) rotate(${rotate}deg) scale(${scale})`,
                transition: "transform 1.15s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.15s ease",
                opacity: abs > 4 ? 0 : 1,
              }}
              aria-label={project.title}
            >
              <ProjectVisual
                kind={project.visual.kind}
                mood={project.visual.mood}
                title={project.title}
                cover={projectCover(project)}
                className="h-full w-full"
              />
              {isCenter ? (
                <span className="absolute bottom-3 left-3 right-3 rounded-2xl bg-black/55 px-3 py-2 text-left text-white backdrop-blur-sm">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    {project.subcategory}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold leading-tight">{project.title}</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <Link href="/portfolio" className="inline-flex items-center gap-1 text-sm font-semibold text-[#16110e]">
          View full portfolio
          <Icon name="arrow-ne" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
