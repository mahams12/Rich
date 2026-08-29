"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { ProjectVisual } from "@/components/media/ProjectVisual";
import { Icon } from "@/components/ui/Icon";
import { getPublishedProjects } from "@/data/projects";
import { projectCover } from "@/lib/cover";

function useMobileFan() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}

export function ProjectFan() {
  const { projects } = useApp();
  const items = useMemo(() => getPublishedProjects(projects).slice(0, 9), [projects]);
  const mobile = useMobileFan();

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

  const xStep = mobile ? 46 : 118;
  const rotateStep = mobile ? 7 : 9;
  const yStep = mobile ? 12 : 22;
  const cardW = mobile ? 104 : 200;
  const cardH = mobile ? 168 : 296;
  const minScale = mobile ? 0.58 : 0.62;
  const scaleDecay = mobile ? 0.1 : 0.09;
  const maxVisible = mobile ? 2 : 4;

  return (
    <section className="overflow-hidden px-3 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d655d]">Industries</p>
        <h2 className="display mt-2 text-2xl tracking-tight sm:mt-3 sm:text-3xl md:text-5xl">Built for every business</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#6d655d] sm:mt-4">
          Real projects for real businesses, from clinics and shops to apps, automation and student kits.
        </p>
        {mobile ? <p className="mt-2 text-xs text-[#6d655d]">Tap a card to browse</p> : null}
      </div>

      <div
        className="relative mx-auto mt-6 h-[12.5rem] max-w-full overflow-hidden sm:mt-8 sm:h-[20rem] md:h-[24rem] md:max-w-6xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        {items.map((project, index) => {
          let offset = index - active;
          const half = Math.floor(items.length / 2);
          if (offset > half) offset -= items.length;
          if (offset < -half) offset += items.length;
          const abs = Math.abs(offset);
          const isCenter = offset === 0;
          const scale = Math.max(minScale, 1 - abs * scaleDecay);

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => setActive(index)}
              className="absolute left-1/2 top-4 origin-bottom overflow-hidden rounded-[1.15rem] border border-black/10 bg-[#2a2420] shadow-[0_18px_40px_rgba(22,17,14,0.16)] sm:top-6 sm:rounded-[1.4rem]"
              style={{
                width: cardW,
                height: cardH,
                zIndex: 40 - abs,
                transform: `translateX(calc(-50% + ${offset * xStep}px)) translateY(${abs * yStep}px) rotate(${offset * rotateStep}deg) scale(${scale})`,
                transition: "transform 1.15s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.15s ease",
                opacity: abs > maxVisible ? 0 : 1,
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
                <span className="absolute bottom-2 left-2 right-2 rounded-xl bg-black/55 px-2 py-1.5 text-left text-white backdrop-blur-sm sm:bottom-3 sm:left-3 sm:right-3 sm:rounded-2xl sm:px-3 sm:py-2">
                  <span className="block text-[8px] font-semibold uppercase tracking-[0.14em] text-white/70 sm:text-[10px]">
                    {project.subcategory}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-tight sm:text-sm">{project.title}</span>
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
