"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Badge, Button, Section } from "@/components/ui/Button";
import { getPublishedProjects } from "@/data/projects";

const steps = [
  {
    key: "business",
    q: "What are you building for?",
    options: ["Local business", "Ecommerce brand", "SaaS / dashboard", "Creator / studio", "Clinic / services", "Restaurant / cafe", "Design / ads / video", "Student project"],
  },
  {
    key: "platform",
    q: "Which platform?",
    options: ["Website", "Mobile app", "Both", "Feature / page only", "Design / video / ads"],
  },
  {
    key: "budget",
    q: "Comfortable budget?",
    options: ["Under $500", "$500–$1,000", "$1,000–$1,600", "Flexible"],
  },
  {
    key: "deadline",
    q: "When do you need it?",
    options: ["This week", "2 weeks", "A month", "Flexible"],
  },
];

export function BuilderView() {
  const { projects } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = steps[step];
  const done = step >= steps.length;

  const matches = useMemo(() => {
    let list = getPublishedProjects(projects);
    const platform = answers.platform;
    const budget = answers.budget;
    const business = answers.business;
    if (platform === "Website") list = list.filter((item) => ["websites", "ecommerce", "creative"].includes(item.category));
    if (platform === "Mobile app") list = list.filter((item) => item.category === "mobile" || item.category === "features");
    if (platform === "Feature / page only") list = list.filter((item) => item.category === "features");
    if (platform === "Design / video / ads") list = list.filter((item) => item.category === "uiux" || item.category === "creative");
    if (budget === "Under $500") list = list.filter((item) => item.price <= 500);
    if (budget === "$500–$1,000") list = list.filter((item) => item.price <= 1000);
    if (budget === "$1,000–$1,600") list = list.filter((item) => item.price <= 1600);
    if (business === "Student project") list = list.filter((item) => item.category === "academic" || item.featured);
    if (business === "Ecommerce brand") list = list.filter((item) => item.category === "ecommerce" || item.category === "websites");
    if (business === "Design / ads / video") list = list.filter((item) => item.category === "uiux" || item.category === "creative");
    if (business === "Restaurant / cafe") list = list.filter((item) => item.tags.join(" ").toLowerCase().includes("restaurant") || item.category === "websites");
    if (business === "Clinic / services") list = list.filter((item) => item.tags.join(" ").toLowerCase().includes("clinic") || item.category === "websites" || item.category === "mobile");
    return list.slice(0, 6);
  }, [answers, projects]);

  return (
    <Section>
      <Badge>Solution builder</Badge>
      <h1 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">Answer a few questions. We point you at the right product.</h1>
      <p className="mt-4 max-w-2xl text-[#6d655d]">No account needed. When you are ready, WhatsApp or email the mix you want.</p>

      {!done ? (
        <div className="glass mt-10 max-w-2xl rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Step {step + 1} of {steps.length}</p>
          <h2 className="display mt-3 text-3xl">{current.q}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`rounded-2xl border px-4 py-4 text-left transition ${answers[current.key] === option ? "border-[#c45c3a] bg-[#c45c3a]/10" : "border-black/10 bg-black/[0.03] hover:border-black/10"}`}
                onClick={() => {
                  setAnswers((cur) => ({ ...cur, [current.key]: option }));
                  setStep((n) => n + 1);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="display text-3xl">Recommended for you</h2>
          <p className="mt-2 text-muted">Based on {Object.values(answers).join(" · ")}</p>
          <div className="mt-6 masonry">
            {matches.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact">Talk through a custom mix</Button>
            <Button variant="ghost" onClick={() => { setStep(0); setAnswers({}); }}>Start over</Button>
          </div>
        </div>
      )}
    </Section>
  );
}
