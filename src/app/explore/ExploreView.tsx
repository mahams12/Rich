"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useApp } from "@/components/providers/AppProvider";
import { Button, Section, inputClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { categories } from "@/data/content";
import { getPublishedProjects, projectSortTime } from "@/data/projects";
import type { CategoryId } from "@/types";

export function ExploreView() {
  const params = useSearchParams();
  const router = useRouter();
  const { projects } = useApp();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<string>(params.get("category") ?? "all");
  const [sort, setSort] = useState(params.get("sort") ?? "newest");
  const [maxDays, setMaxDays] = useState(21);
  const [mode, setMode] = useState<"all" | "ready" | "custom">("all");
  const [visible, setVisible] = useState(8);

  const list = useMemo(() => {
    let items = getPublishedProjects(projects);
    if (category !== "all") items = items.filter((item) => item.category === category);
    if (mode === "ready") items = items.filter((item) => item.readyMade);
    if (mode === "custom") items = items.filter((item) => item.customizable && !item.readyMade);
    items = items.filter((item) => item.deliveryDays <= maxDays);
    const query = q.trim().toLowerCase();
    if (query) {
      items = items.filter((item) =>
        [item.title, item.tagline, item.category, item.subcategory, ...item.tags, ...item.features, ...item.technologies]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }
    items = [...items].sort((a, b) => {
      if (sort === "delivery") return a.deliveryDays - b.deliveryDays;
      if (sort === "popular") return b.favourites - a.favourites;
      if (sort === "featured") return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
      return projectSortTime(b) - projectSortTime(a) || b.id.localeCompare(a.id);
    });
    return items;
  }, [category, maxDays, mode, projects, q, sort]);

  function apply() {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category !== "all") next.set("category", category);
    if (sort !== "featured") next.set("sort", sort);
    router.replace(`/explore?${next.toString()}`);
  }

  return (
    <Section>
      <p className="text-xs uppercase tracking-[0.2em] text-[#c45c3a]">Explore</p>
      <h1 className="display mt-2 text-4xl">Every digital product, visually</h1>
      <p className="mt-3 max-w-2xl text-muted">Search websites of any kind, mobile apps, ecommerce, AI automation, UI/UX, posters, banners, product design, ads, video editing, posting, cart/chat/calling/reels/pages, customized builds, final-year kits and assignment writing.</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="glass h-max space-y-4 rounded-3xl p-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-muted">Search</span>
            <div className="relative mt-2">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} onBlur={apply} placeholder="Keywords, tech, features" className={`${inputClass} pl-9`} />
            </div>
          </label>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Category</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip active={category === "all"} onClick={() => { setCategory("all"); }}>All</Chip>
              {categories.map((item) => (
                <Chip key={item.id} active={category === item.id} onClick={() => setCategory(item.id as CategoryId)}>
                  {item.name.split("&")[0]}
                </Chip>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-muted">Delivery ≤ {maxDays} days</span>
            <input type="range" min={3} max={21} value={maxDays} onChange={(e) => setMaxDays(Number(e.target.value))} className="mt-3 w-full accent-[#c45c3a]" />
          </label>
          <div className="flex gap-2">
            {(["all", "ready", "custom"] as const).map((item) => (
              <Chip key={item} active={mode === item} onClick={() => setMode(item)}>
                {item === "all" ? "Any" : item === "ready" ? "Ready-made" : "Custom"}
              </Chip>
            ))}
          </div>
          <Button onClick={apply} variant="ghost" className="w-full">Apply</Button>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">{list.length} projects</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${inputClass} w-auto py-2`}>
              <option value="featured">Featured</option>
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="delivery">Delivery time</option>
            </select>
          </div>
          <div className="masonry">
            {list.slice(0, visible).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {visible < list.length ? (
            <div className="mt-8 text-center">
              <Button variant="ghost" onClick={() => setVisible((v) => v + 8)}>Load more</Button>
            </div>
          ) : null}
          {!list.length ? <p className="glass rounded-3xl p-8 text-center text-muted">No matches. Try website, app, poster, video, cart, chat, reels, assignment or Flutter.</p> : null}
        </div>
      </div>
    </Section>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-[#c45c3a] text-white" : "bg-black/[0.03] text-muted"}`}
    >
      {children}
    </button>
  );
}
