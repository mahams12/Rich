import type { Metadata } from "next";
import { Section } from "@/components/ui/Button";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the founders and specialists behind NovexaHub across software engineering, mobile development, sales and marketing.",
  alternates: { canonical: `${site.url}/our-team` },
};

const founders = [
  {
    name: "Syed Hamza Mehdi",
    role: "Co-founder · Full-Stack Software Engineer",
    description:
      "Leads product engineering and technical delivery at NovexaHub, working across web platforms, backend systems, integrations and end-to-end software products.",
    email: "mehihamza1@gmail.com",
    profile: "https://hamza-portfolio-livid.vercel.app/",
    photo: "/founders/hamza-mehdi-avatar.png",
    initials: "HM",
  },
  {
    name: "Maham Saeed",
    role: "Co-founder · Software Engineer",
    description:
      "Helps shape digital products from idea to implementation, with a focus on software engineering, product experiences and building practical solutions for users and businesses.",
    email: "maham.inbox@gmail.com",
    profile: "https://maham-profile.vercel.app/",
    photo: "/founders/maham-saeed-avatar.png",
    initials: "MS",
  },
];

const team = [
  {
    name: "Zukhruf Fatima",
    role: "Sales & Marketing Manager",
    description:
      "Builds client relationships and helps businesses find the right digital solution. Focuses on sales coordination, understanding project requirements, communicating value and supporting marketing initiatives that grow the NovexaHub brand.",
    email: "zukhruf@novexahub.live",
    initials: "ZF",
  },
  {
    name: "Ahmad Mazhar",
    role: "Senior Software Engineer",
    description:
      "Works across native Android and iOS application development, mobile architecture, platform-specific integrations and performance-focused engineering. Helps turn product requirements into reliable mobile experiences across devices.",
    email: "ahmadmazhar2555@gmail.com",
    initials: "AM",
  },
];

function PersonCard({
  person,
}: {
  person: (typeof founders)[number] | (typeof team)[number];
}) {
  const photo = "photo" in person ? person.photo : undefined;
  const profile = "profile" in person ? person.profile : undefined;
  return (
    <article className="flex h-full flex-col rounded-3xl border border-black/10 bg-card p-6 sm:p-7">
      <div className="flex items-center gap-4">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={person.name} loading="lazy" className="h-16 w-16 rounded-2xl object-cover ring-1 ring-black/10" />
        ) : (
          <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a1410] text-lg font-bold text-white">{person.initials}</div>
        )}
        <div className="min-w-0">
          <h2 className="display text-xl leading-tight">{person.name}</h2>
          <p className="mt-1 text-sm font-medium text-[#c45c3a]">{person.role}</p>
        </div>
      </div>
      <p className="mt-5 flex-1 text-sm leading-7 text-[#6d655d]">{person.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href={`mailto:${person.email}`} className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition hover:border-[#c45c3a] hover:text-[#c45c3a]">
          Email {person.name.split(" ")[0]}
        </a>
        {profile ? (
          <a href={profile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full bg-[#1a1410] px-4 py-2 text-xs font-semibold !text-white transition hover:bg-[#c45c3a] hover:!text-white">
            View portfolio
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function OurTeamPage() {
  return (
    <>
      <section className="bg-[#1a1410] px-4 py-16 text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e18a69]">The people behind the work</p>
          <h1 className="display mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">A team built around ideas, craft and delivery.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Meet the founders and specialists bringing together engineering, mobile development, sales and marketing to move digital projects forward.
          </p>
        </div>
      </section>
      <Section>
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c45c3a]">Leadership</p>
          <h2 className="display mt-2 text-3xl">Founders</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#6d655d]">The co-founders guiding the studio’s direction, product thinking and technical delivery.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {founders.map((person) => <PersonCard key={person.name} person={person} />)}
        </div>
      </Section>
      <Section className="pt-0">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c45c3a]">Our people</p>
          <h2 className="display mt-2 text-3xl">Meet the team</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#6d655d]">The specialists supporting client growth and building dependable digital products.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {team.map((person) => <PersonCard key={person.name} person={person} />)}
        </div>
      </Section>
    </>
  );
}
