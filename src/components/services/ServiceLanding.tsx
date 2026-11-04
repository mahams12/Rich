import Link from "next/link";
import { Badge, Button, Section } from "@/components/ui/Button";
import { ContactActions } from "@/components/ui/ContactActions";
import { site } from "@/data/site";
import type { ServicePageData } from "@/data/service-pages";

function serviceJsonLd(data: ServicePageData) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: data.badge,
        serviceType: data.title,
        description: data.description,
        url: `${site.url}/${data.slug}`,
        areaServed: "Worldwide",
        provider: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
          { "@type": "ListItem", position: 3, name: data.badge, item: `${site.url}/${data.slug}` },
        ],
      },
    ],
  };
}

export function ServiceLanding({ data }: { data: ServicePageData }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(data)) }} />
      <Section>
        <p className="text-xs uppercase tracking-[0.18em] text-[#6d655d]">
          <Link href="/services" className="hover:text-ink">Services</Link> / {data.badge}
        </p>
        <div className="mt-6 max-w-4xl">
          <Badge>{data.badge}</Badge>
          <h1 className="display mt-4 text-4xl tracking-tight sm:text-5xl">{data.h1}</h1>
          {data.hero.map((para) => (
            <p key={para.slice(0, 32)} className="mt-4 max-w-2xl text-[#6d655d]">{para}</p>
          ))}
          <div className="mt-7">
            <ContactActions title={data.badge} />
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <h2 className="display text-3xl tracking-tight">Problems this solves</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {data.problems.map((item) => (
            <article key={item.title} className="rounded-3xl border border-black/10 bg-card p-5">
              <h3 className="font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-[#6d655d]">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="display text-3xl tracking-tight">What you get</h2>
            <ul className="mt-5 space-y-3">
              {data.deliverables.map((item) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-black/10 bg-card px-4 py-3 text-sm text-[#4a433c]">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#a14b30]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display text-3xl tracking-tight">How the work runs</h2>
            <ol className="mt-5 space-y-3">
              {data.process.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-black/10 bg-card px-4 py-3">
                  <p className="text-sm font-semibold">
                    <span className="mr-2 text-[#a14b30]">{String(index + 1).padStart(2, "0")}</span>
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-[#6d655d]">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <h2 className="display text-3xl tracking-tight">Stack we work with</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {data.capabilities.map((item) => (
            <span key={item} className="rounded-full border border-black/10 bg-card px-3 py-1.5 text-xs font-semibold">{item}</span>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="display text-3xl tracking-tight">Related work</h2>
          <Button href="/portfolio" variant="ghost">Full portfolio</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {data.projects.map((item) => (
            <Link key={item.slug} href={`/projects/${item.slug}`} className="group rounded-3xl border border-black/10 bg-card p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(22,17,14,0.08)]">
              <h3 className="font-semibold tracking-tight group-hover:text-[#a14b30]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#6d655d]">{item.note}</p>
            </Link>
          ))}
        </div>
        {data.posts.length ? (
          <div className="mt-8">
            <h2 className="display text-2xl tracking-tight">Keep reading</h2>
            <ul className="mt-4 space-y-2">
              {data.posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="font-semibold text-[#a14b30] underline decoration-[#c45c3a]/40 underline-offset-4 hover:decoration-current">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-2">
          {data.siblings.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border border-black/10 bg-card px-3 py-1.5 text-xs font-semibold hover:border-[#c45c3a]/40">
              {item.label}
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <h2 className="display text-3xl tracking-tight">Questions</h2>
        <div className="mt-6 divide-y divide-black/10 overflow-hidden rounded-[1.4rem] border border-black/10 bg-card">
          {data.faqs.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-[#a14b30] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-[#6d655d]">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-[1.6rem] bg-[#1a1410] px-6 py-14 text-center text-white">
          <h2 className="display text-4xl tracking-tight">Tell us what you are building</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Scope and timing are agreed before anything starts. WhatsApp or email — no checkout maze.
          </p>
          <div className="mt-7 flex justify-center">
            <ContactActions title={data.badge} />
          </div>
        </div>
      </Section>
    </>
  );
}
