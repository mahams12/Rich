import ResumeBuilder from "./ResumeBuilder";
import { site } from "@/data/site";

export const metadata = {
  title: "Free Resume Builder Online | Professional CV Templates",
  description:
    "Build a professional resume for free with NovexaHub Resume Studio. Customize editable CV templates, import PDF or Word resumes, compare job-description keywords and save your resume as PDF.",
  keywords: [
    "free resume builder",
    "online resume builder",
    "free CV maker",
    "professional CV templates",
    "ATS-conscious resume structure",
    "resume keyword checker",
    "resume builder for fresh graduates",
    "resume keyword optimizer",
    "download resume as PDF",
    "LinkedIn resume import",
    "NovexaHub Resume Studio",
  ],
  alternates: { canonical: site.url + "/resume-builder" },
  openGraph: {
    type: "website",
    url: site.url + "/resume-builder",
    title: "Free Resume Builder — Build a Better CV | NovexaHub",
    description:
      "Build a polished, job-ready resume with editable professional templates, live preview, PDF and Word import, and job-description keyword matching.",
    siteName: site.name,
  },
  twitter: {
    card: "summary",
    title: "Free Resume Builder | NovexaHub",
    description:
      "Create, customize and export a professional resume with free editable templates.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "NovexaHub Resume Studio",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "A free online resume builder with editable CV templates, local document import, PDF export and job-description keyword matching.",
      url: site.url + "/resume-builder",
      publisher: { "@type": "Organization", name: "NovexaHub", url: site.url },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is NovexaHub Resume Studio free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can create and edit resumes, use the available templates and export a PDF without creating an account.",
          },
        },
        {
          "@type": "Question",
          name: "Can I import an existing resume?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Import a PDF, DOCX, TXT, JSON or LinkedIn CSV export. Imported content is parsed in your browser and can be edited before export.",
          },
        },
        {
          "@type": "Question",
          name: "Does the keyword optimizer guarantee an ATS score?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. It compares your resume content with a job description and highlights matched and missing terms. It is not an employer ATS and does not guarantee selection or an ATS score.",
          },
        },
      ],
    },
  ],
};

export default function ResumeBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ResumeBuilder />
    </>
  );
}
