import { serviceCovers } from "@/lib/cover";

export const showcaseServices = [
  {
    kicker: "Defined website refresh",
    title: "Website Development",
    text: "A website that does more than exist: fast, sharp, and built to convert visitors into customers.",
    href: "/services#websites",
    image: serviceCovers.website,
    icon: "monitor" as const,
  },
  {
    kicker: "Scoped application build",
    title: "App Development",
    text: "Mobile apps that feel right and work right for real users on real devices.",
    href: "/services#mobile",
    image: serviceCovers.app,
    icon: "phone" as const,
  },
  {
    kicker: "Workflow-led systems build",
    title: "Systems Development",
    text: "Custom portals, dashboards, and workflows built around how your team actually works.",
    href: "/services#features",
    image: serviceCovers.systems,
    icon: "grid" as const,
  },
  {
    kicker: "Advisory engagement",
    title: "Studio Consulting",
    text: "Honest scoping for websites, apps, ecommerce and automation — without a sales theatre.",
    href: "/contact",
    image: serviceCovers.consulting,
    icon: "spark" as const,
  },
  {
    kicker: "Scoped creative production",
    title: "AI Media",
    text: "AI-generated photos, videos, and hero treatments that give your brand a look others cannot copy.",
    href: "/services#ai",
    image: serviceCovers.aiMedia,
    icon: "spark" as const,
  },
  {
    kicker: "Scoped identity engagement",
    title: "Brand & Design",
    text: "UI/UX, posters, banners, product design and identity systems that feel intentional.",
    href: "/services#uiux",
    image: serviceCovers.brand,
    icon: "spark" as const,
  },
];

export const techStack = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Tailwind", slug: "tailwindcss" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Flutter", slug: "flutter" },
  { name: "Supabase", slug: "supabase" },
  { name: "Docker", slug: "docker" },
  { name: "GitHub", slug: "github" },
  { name: "Vercel", slug: "vercel" },
  { name: "GSAP", slug: "greensock" },
];

export const aiStudio = [
  { name: "OpenAI", slug: "openai" },
  { name: "Claude", slug: "anthropic" },
  { name: "Midjourney", slug: "midjourney" },
  { name: "Flow", slug: "future" },
];
