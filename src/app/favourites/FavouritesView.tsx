"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button, Section } from "@/components/ui/Button";

export function FavouritesView() {
  const { user, favourites, projects } = useApp();
  const saved = projects.filter((item) => favourites.includes(item.id));

  if (!user) {
    return (
      <Section>
        <h1 className="display text-4xl">Favourites</h1>
        <p className="mt-3 text-muted">Sign in to keep a private list of projects.</p>
        <Button href="/login?next=/favourites" className="mt-6">Login to continue</Button>
      </Section>
    );
  }

  return (
    <Section>
      <h1 className="display text-4xl">Your saved work</h1>
      <p className="mt-3 text-muted">{saved.length} project{saved.length === 1 ? "" : "s"}</p>
      {saved.length ? (
        <div className="mt-8 masonry">
          {saved.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="glass mt-8 rounded-3xl p-8">Nothing saved yet. Heart a card in the <Link href="/portfolio" className="text-[#c45c3a]">portfolio</Link>.</p>
      )}
    </Section>
  );
}
