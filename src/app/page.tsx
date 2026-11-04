import type { Metadata } from "next";
import { projects as seedProjects } from "@/data/projects";
import { site } from "@/data/site";
import { fetchCatalogServer } from "@/lib/firebase/rest";
import { HomeView } from "./HomeView";

export const metadata: Metadata = {
  title: { absolute: "NovexaHub | Software Development Company & Digital Studio" },
  description:
    "NovexaHub is a worldwide software development company and digital studio: custom websites, mobile apps, ecommerce, SaaS and AI automation — plus ready-made digital products you can buy and customize.",
  alternates: { canonical: site.url },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const catalog = await fetchCatalogServer();
  return <HomeView initialProjects={catalog?.projects ?? seedProjects} />;
}
