"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectVisual } from "@/components/media/ProjectVisual";
import { TiltCard } from "@/components/ui/TiltCard";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Section, inputClass } from "@/components/ui/Button";
import { ContactActions } from "@/components/ui/ContactActions";
import { Icon } from "@/components/ui/Icon";
import { isStudioAdmin } from "@/lib/admin";
import { reviews as catalogReviews } from "@/data/content";
import { relatedProjects } from "@/data/projects";
import { countWords } from "@/lib/format";
import { projectGalleryShots } from "@/lib/cover";

export function ProjectDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { projects, toggleFavourite, isFavourite, user, reviews: liveReviews, addReview, deleteProject } = useApp();
  const project = projects.find((item) => item.slug === slug);
  const [tab, setTab] = useState<"overview" | "features" | "customize">("overview");
  const [words, setWords] = useState("");
  const [gallery, setGallery] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const related = useMemo(() => (project ? relatedProjects(project.slug, projects) : []), [project, projects]);
  const projectReviews = useMemo(() => {
    const live = liveReviews.filter((item) => item.projectSlug === project?.slug);
    const catalog = catalogReviews.filter((item) => item.projectSlug === project?.slug);
    return [...live, ...catalog];
  }, [liveReviews, project?.slug]);

  if (!project) {
    return (
      <Section>
        <h1 className="display text-3xl">Project not found</h1>
        <Button href="/portfolio" className="mt-6">Back to portfolio</Button>
      </Section>
    );
  }

  const remaining = project.maxCustomizationWords - countWords(words);
  const loved = isFavourite(project.id);
  const shots = projectGalleryShots(project);
  const activeShot = shots[gallery];
  const extra = words.trim()
    ? `Customization notes:\n${words.trim()}`
    : undefined;

  return (
    <Section>
      {isStudioAdmin(user) ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-[#c45c3a]/30 bg-[#c45c3a]/5 px-4 py-3">
          <p className="text-sm font-semibold text-[#c45c3a]">Admin controls</p>
          <Button href={`/admin/projects/${project.id}`} variant="ghost" className="px-3 py-1.5 text-xs">
            Edit listing
          </Button>
          <Button href="/admin/projects/new" variant="ghost" className="px-3 py-1.5 text-xs">
            New project
          </Button>
          <button
            type="button"
            className="ml-auto text-xs font-semibold text-rose-700 hover:underline"
            onClick={() => {
              if (window.confirm(`Delete “${project.title}”? This removes it from the portfolio.`)) {
                deleteProject(project.id);
                router.push("/portfolio");
              }
            }}
          >
            Delete project
          </button>
        </div>
      ) : null}
      <p className="text-xs uppercase tracking-[0.18em] text-[#6d655d]">
        <Link href="/portfolio" className="hover:text-ink">Portfolio</Link> / {project.category}
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-black/10">
            <div className="relative h-[360px] sm:h-[440px]">
              <TiltCard max={6} className="h-full w-full">
                <ProjectVisual
                  key={activeShot}
                  kind={project.visual.kind}
                  mood={project.visual.mood}
                  title={project.title}
                  cover={activeShot}
                  className="h-full w-full"
                />
              </TiltCard>
              <Badge className="absolute left-4 top-4 z-40 bg-black/50 text-white">Preview {gallery + 1}/3</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
              {[0, 1, 2].map((shot) => (
                <button key={shot} type="button" onClick={() => setGallery(shot)} className={`h-20 overflow-hidden rounded-2xl ${gallery === shot ? "ring-2 ring-[#c45c3a]" : "opacity-70"}`}>
                  <ProjectVisual kind={project.visual.kind} mood={project.visual.mood} title={`${project.title} ${shot + 1}`} cover={shots[shot]} className="h-full w-full" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            {(["overview", "features", "customize"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm capitalize ${tab === item ? "bg-[#16110e] text-white" : "border border-black/10 bg-white text-[#16110e]"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-3xl border border-black/10 bg-card p-6">
            {tab === "overview" ? (
              <div className="space-y-4 text-[#4a433c]">
                <p>{project.description}</p>
                <p><strong className="text-ink">Included:</strong> {project.included.join(" · ")}</p>
                <p><strong className="text-ink">Not included:</strong> {project.notIncluded.join(" · ")}</p>
                <p><strong className="text-ink">Support:</strong> {project.support}</p>
              </div>
            ) : null}
            {tab === "features" ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-[#4a433c]"><Icon name="check" className="mt-0.5 h-4 w-4 text-[#c45c3a]" />{feature}</li>
                ))}
              </ul>
            ) : null}
            {tab === "customize" ? (
              <div>
                <p className="text-sm text-[#6d655d]">{project.customizationNotes}</p>
                <textarea value={words} onChange={(e) => setWords(e.target.value)} className={`${inputClass} mt-4 min-h-36`} placeholder="Describe the changes you need. We will send this with your WhatsApp or email." />
                <p className={`mt-2 text-xs ${remaining < 0 ? "text-rose-600" : "text-[#6d655d]"}`}>{countWords(words)} / {project.maxCustomizationWords} words</p>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="h-max space-y-5 rounded-[2rem] border border-black/10 bg-card p-6">
          <Badge>{project.availability === "ready" ? "Available now" : "Short queue"}</Badge>
          <h1 className="display text-3xl">{project.title}</h1>
          <p className="text-[#6d655d]">{project.tagline}</p>
          <p className="text-sm text-[#4a433c]">Typical window: {project.deliveryDays} days. Quote confirmed on WhatsApp or email — no checkout on this site.</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded-full bg-black/[0.03] px-3 py-1 text-xs">{tech}</span>
            ))}
          </div>
          <ContactActions title={project.title} extra={extra} stacked />
          <button type="button" className="flex w-full items-center justify-center gap-2 text-sm text-[#6d655d]" onClick={() => { const ok = toggleFavourite(project.id); if (!ok) router.push(`/login?next=/projects/${project.slug}`); }}>
            <Icon name={loved ? "heart-fill" : "heart"} className={loved ? "text-[#c45c3a]" : ""} /> Save to favourites
          </button>
        </aside>
      </div>

      <div className="mt-12">
        <h2 className="display text-2xl">Reviews</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(projectReviews.length ? projectReviews : catalogReviews.slice(0, 2)).map((item) => (
            <blockquote key={item.id} className="rounded-3xl border border-black/10 bg-card p-5">
              <div className="mb-2 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className={`h-3.5 w-3.5 ${i < item.rating ? "text-[#c45c3a]" : "text-black/15"}`} />
                ))}
              </div>
              <p className="text-ink/80">“{item.quote}”</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#6d655d]">
                {item.name} · {item.projectType}
              </p>
            </blockquote>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-black/10 bg-card p-6">
          <h3 className="font-semibold">Write a review</h3>
          {user ? (
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                const ok = addReview({
                  projectSlug: project.slug,
                  projectType: project.subcategory,
                  quote: reviewText,
                  rating: reviewRating,
                });
                if (ok) setReviewText("");
              }}
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setReviewRating(value)} className={value <= reviewRating ? "text-[#c45c3a]" : "text-black/20"} aria-label={`${value} stars`}>
                    <Icon name="star" className="h-5 w-5" />
                  </button>
                ))}
              </div>
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} className={`${inputClass} min-h-24`} placeholder="What did you think of this work?" />
              <Button type="submit">Publish review</Button>
            </form>
          ) : (
            <p className="mt-3 text-sm text-[#6d655d]">
              <Link href={`/login?next=/projects/${project.slug}`} className="font-semibold text-[#16110e]">Login</Link> to publish a live review on this project.
            </p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="display text-2xl">Related projects</h2>
        <div className="mt-4 masonry">
          {related.map((item) => (
            <ProjectCard key={item.id} project={item} />
          ))}
        </div>
      </div>
    </Section>
  );
}
