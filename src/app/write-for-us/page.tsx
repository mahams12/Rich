import type { Metadata } from "next";
import { Badge, Button, Section } from "@/components/ui/Button";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Write for Us — Contributor Program & Paid Article Rewards",
  description:
    "Write for NovexaHub: contribute original articles on technology, AI, development, business and digital marketing. Pass editorial review and earn a reward for every approved article.",
  keywords: [
    "write for us",
    "guest post guidelines",
    "paid article writing",
    "tech blog contributor",
    "contribute articles",
    "NovexaHub contributor program",
  ],
  alternates: { canonical: `${site.url}/write-for-us` },
  openGraph: {
    title: "Write for NovexaHub — earn for your work",
    description: "Contribute original articles and earn a reward for every approved post.",
    url: `${site.url}/write-for-us`,
  },
};

const steps = [
  { n: "01", title: "Choose your topic", text: "Explore our approved writing categories and select a topic that interests you." },
  { n: "02", title: "Write your article", text: "Create an original, informative and engaging article following our editorial guidelines." },
  { n: "03", title: "Submit for review", text: "Send your article through our contributor submission portal." },
  { n: "04", title: "Get approved", text: "Our editorial team manually reviews each submission for quality, originality and relevance." },
  { n: "05", title: "Earn your reward", text: "Receive the applicable reward for every approved article. Your earnings accumulate in your contributor account." },
];

const topics = [
  "Artificial Intelligence & Technology",
  "Software & Web Development",
  "Business & Entrepreneurship",
  "Digital Marketing & SEO",
  "Productivity & Innovation",
  "Startups & Online Business",
];

const guidelines = [
  "All articles must be original.",
  "Completely plagiarized or AI-spun submissions are not accepted.",
  "Every article is subject to manual editorial review.",
  "Payment is only awarded for approved articles.",
  "Submission does not guarantee approval.",
  "Payment thresholds, processing times and applicable fees are disclosed before withdrawal.",
];

export default function WriteForUsPage() {
  return (
    <Section className="max-w-4xl">
      <Badge>Contributor program</Badge>
      <h1 className="display mt-4 text-4xl sm:text-5xl">Write for NovexaHub. Earn for your work.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[#756b63]">
        Your words deserve recognition. Are you passionate about technology, business, AI, digital innovation or
        creative writing? NovexaHub invites writers, students, bloggers and content creators from around the world to
        contribute original articles to our growing digital publication. Write useful content, submit your work for
        editorial review, and earn a reward for every approved article.
      </p>

      <h2 className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-[#a14b30]">How it works</h2>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step) => (
          <li key={step.n} className="rounded-2xl border border-black/10 bg-card p-4">
            <p className="text-xs font-bold text-[#a14b30]">{step.n}</p>
            <p className="mt-1.5 font-semibold text-[#16110e]">{step.title}</p>
            <p className="mt-1 text-xs leading-5 text-[#756b63]">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#a14b30]">What can you write about?</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#4a423c]">
            {topics.map((topic) => (
              <li key={topic} className="flex gap-2">
                <span className="text-[#a14b30]">•</span>
                {topic}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-black/10 bg-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#a14b30]">How much can you earn?</h2>
          <p className="mt-4 text-sm leading-6 text-[#4a423c]">
            Contributors receive a fixed reward of <strong>$1 for every 5–10 approved blogs</strong>, calculated
            according to our internal rules and regulations (or its equivalent in your local currency for
            eligible international contributors, using the applicable exchange rate). <strong>Payouts are
            received after 5 approved articles</strong> — earnings accumulate in your contributor account
            until the threshold is reached.
          </p>
          <h3 className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#a14b30]">Payment options</h3>
          <p className="mt-2 text-sm leading-6 text-[#4a423c]">
            Available payment methods may include supported bank transfers, Payoneer and other eligible payment
            services, depending on your country.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#a14b30]">Important guidelines</h2>
        <ul className="mt-4 grid gap-2 text-sm text-[#4a423c] sm:grid-cols-2">
          {guidelines.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#a14b30]">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-[#fffcf8] p-6">
        <div>
          <p className="font-semibold text-[#211a16]">Start writing today.</p>
          <p className="mt-1 text-sm text-[#756b63]">
            Your knowledge can create value. Your writing can earn rewards. Join the NovexaHub Contributor Program.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/blog/submit">Submit a blog</Button>
          <Button href="/blog" variant="ghost">Read the journal</Button>
        </div>
      </div>
    </Section>
  );
}
