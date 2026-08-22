import type { Metadata } from "next";
import { Badge, Button, Section } from "@/components/ui/Button";
import { ContactActions } from "@/components/ui/ContactActions";
import { serviceCatalog } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "All Digital Services",
  description:
    "NovexaHub studio services: any category of website or app, ecommerce, AI automation, UI/UX, posters, banners, product design, social posting, ads, video editing, feature modules, final-year projects and assignment writing kits.",
};

const packs = [
  { title: "Launch website", text: "Business site, landing, clinic, restaurant or a custom category." },
  { title: "App MVP", text: "Any kind of Flutter-ready app: fitness, delivery, social, health, logistics." },
  { title: "Design + ads", text: "UI/UX, posters, banners, product design, posting and beautiful ads." },
  { title: "Feature drop", text: "Cart, chat, calling, reels, payments or any frontend page." },
  { title: "Automation", text: "AI assistant, workflow, social posting or lead routing." },
  { title: "Academic kit", text: "Final-year prototype or assignment writing structure." },
];

const catalogLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "NovexaHub digital services",
  url: `${site.url}/services`,
  itemListElement: serviceCatalog.flatMap((group, gi) =>
    group.offerings.map((item, ii) => ({
      "@type": "ListItem",
      position: gi * 20 + ii + 1,
      name: item.name,
      description: item.detail,
      url: `${site.url}/contact`,
    })),
  ),
};

export default function ServicesPage() {
  return (
    <Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogLd) }} />
      <Badge>Custom studio</Badge>
      <h1 className="display mt-4 max-w-4xl text-4xl sm:text-5xl">Every service we actually do — not a short brochure list.</h1>
      <p className="mt-4 max-w-2xl text-[#6d655d]">
        Any category of website or app. Ecommerce. AI automations. UI/UX, posters, banners and product design. Message WhatsApp or email to purchase or customize — nothing is charged on this site.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {serviceCatalog.map((group) => (
          <a key={group.id} href={`#${group.id}`} className="rounded-full border border-black/10 bg-card px-3 py-1.5 text-xs font-semibold hover:border-[#c45c3a]/40">
            {group.name.split("—")[0].split("&")[0].trim()}
          </a>
        ))}
      </div>

      <div className="mt-12 space-y-12">
        {serviceCatalog.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-28">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="display text-3xl">{group.name}</h2>
                <p className="mt-2 max-w-2xl text-[#6d655d]">{group.intro}</p>
              </div>
              <Button href={`/explore?category=${group.id}`} variant="ghost">
                See related work
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.offerings.map((item) => (
                <article key={item.name} className="card-lift rounded-3xl border border-black/10 bg-card p-5">
                  <h3 className="font-semibold tracking-tight">{item.name}</h3>
                  <p className="mt-2 text-sm text-[#6d655d]">{item.detail}</p>
                  <p className="mt-4 text-sm text-[#4a433c]">{item.days} days typical</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <h2 className="display mt-16 text-3xl">Starting packs</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {packs.map((pack) => (
          <div key={pack.title} className="rounded-3xl border border-black/10 p-5">
            <p className="font-semibold">{pack.title}</p>
            <p className="mt-2 text-sm text-[#6d655d]">{pack.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <ContactActions />
      </div>
    </Section>
  );
}
