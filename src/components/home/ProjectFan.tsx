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
  const items = useMemo(() => getPublishedProjects(projects).slice(0, 9), [projects]);

  const [active, setActive] = useState(Math.floor(Math.min(items.length, 9) / 2));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setActive(Math.floor(Math.min(items.length, 9) / 2));
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [items.length, paused]);

  if (!items.length) return null;

  return (
    <section className="overflow-hidden px-3 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d655d]">Industries</p>
        <h2 className="display mt-2 text-2xl tracking-tight sm:mt-3 sm:text-3xl md:text-5xl">Built for every business</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#6d655d] sm:mt-4">
          Real projects for real businesses, from clinics and shops to apps, automation and student kits.
        </p>
      </div>

      {/* Mobile: swipeable row with peek of next card */}
      <div className="mt-6 md:hidden">
        <p className="mb-3 text-center text-xs text-[#6d655d]">Swipe to explore projects →</p>
        <div className="flex gap-3 overflow-x-auto pb-2 pl-0.5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="relative h-[15.5rem] w-[68vw] max-w-[15rem] shrink-0 snap-center overflow-hidden rounded-[1.15rem] border border-black/10 bg-[#111] shadow-[0_12px_28px_rgba(22,17,14,0.12)]"
            >
              <ProjectVisual
                kind={project.visual.kind}
                mood={project.visual.mood}
                title={project.title}
                cover={projectCover(project)}
                className="h-full w-full"
              />
              <span className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-black/55 px-2.5 py-2 text-left text-white backdrop-blur-sm">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">
                  {project.subcategory}
                </span>
                <span className="mt-0.5 block text-xs font-semibold leading-tight">{project.title}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: arched fan */}
      <div
        className="relative mx-auto mt-8 hidden h-[28rem] max-w-6xl md:block"
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
