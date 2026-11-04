import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceLanding } from "@/components/services/ServiceLanding";
import { getServicePage } from "@/data/service-pages";
import { site } from "@/data/site";

const data = getServicePage("ai-automation");

export const metadata: Metadata = data
  ? {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      alternates: { canonical: `${site.url}/${data.slug}` },
      openGraph: {
        title: data.title,
        description: data.description,
        url: `${site.url}/${data.slug}`,
      },
    }
  : {};

export default function Page() {
  if (!data) notFound();
  return <ServiceLanding data={data} />;
}
