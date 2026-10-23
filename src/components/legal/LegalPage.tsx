import Link from "next/link";
import { Badge, Section } from "@/components/ui/Button";
import { site } from "@/data/site";
import { whatsappUrl } from "@/lib/contact";

export type LegalSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalContact() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 not-prose">
      <p className="font-semibold text-[#16110e]">{site.name}</p>
      <p className="mt-2">
        Website:{" "}
        <Link href="/" className="text-[#c45c3a] underline underline-offset-2">
          {site.url}
        </Link>
      </p>
      <p>
        Email:{" "}
        <a href={`mailto:${site.email}`} className="text-[#c45c3a] underline underline-offset-2">
          {site.email}
        </a>
      </p>
      <p>
        WhatsApp:{" "}
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c45c3a] underline underline-offset-2"
        >
          {site.whatsappDisplay}
        </a>
      </p>
      <p>Office: {site.address}</p>
    </div>
  );
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <Section>
      <Badge>{eyebrow}</Badge>
      <h1 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-[#6d655d]">{intro}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Last updated: {updated}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">On this page</p>
          <nav className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:space-y-1" aria-label="On this page">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-black/10 bg-card px-3 py-1.5 text-xs font-semibold hover:border-[#c45c3a]/40 lg:rounded-lg lg:border-0 lg:bg-transparent lg:px-2 lg:py-1 lg:text-sm lg:font-normal lg:text-[#6d655d] lg:hover:text-[#c45c3a]"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 space-y-5">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="glass scroll-mt-28 rounded-3xl p-6 sm:p-8">
              <h2 className="display text-2xl">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-6 text-[#4a433c]">{section.body}</div>
            </section>
          ))}
          <p className="text-xs leading-5 text-muted">
            This page is provided for general information and governs your use of {site.domain}. If anything here is
            unclear, ask us on WhatsApp or email before ordering.
          </p>
        </article>
      </div>
    </Section>
  );
}
