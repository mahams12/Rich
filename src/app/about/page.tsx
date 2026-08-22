import type { Metadata } from "next";
import { Badge, Button, Section } from "@/components/ui/Button";
import { processSteps, trust } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About NovexaHub",
  description:
    "NovexaHub is a digital studio. Discover ready-made websites, apps, design packs, ads, video, software features, final-year kits and assignment writing — then message WhatsApp or email to start.",
};

export default function AboutPage() {
  return (
    <Section>
      <Badge>Why us</Badge>
      <h1 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">Professional digital work should feel as discoverable as Pinterest.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        {site.name} exists so a founder can find a website, app, poster pack, ad kit, automation, feature or student project, then talk to us on WhatsApp or email — without a checkout maze.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {trust.map((item) => (
          <article key={item.title} className="glass rounded-3xl p-6">
            <h2 className="display text-2xl">{item.title}</h2>
            <p className="mt-2 text-muted">{item.text}</p>
          </article>
        ))}
      </div>
      <h2 className="display mt-12 text-3xl">The promise</h2>
      <p className="mt-3 max-w-2xl text-muted">Find it. Customize it. Build it. We are a marketplace for ready-made products and a studio for everything that still needs a human.</p>
      <div className="mt-8 grid gap-3 md:grid-cols-5">
        {processSteps.map((step) => (
          <div key={step.n} className="rounded-3xl border border-black/10 p-4">
            <p className="text-[#c45c3a]">{step.n}</p>
            <p className="mt-1 font-semibold">{step.title}</p>
          </div>
        ))}
      </div>
      <Button href="/portfolio" className="mt-10">Browse the work</Button>
    </Section>
  );
}
