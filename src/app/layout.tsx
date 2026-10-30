import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Suspense } from "react";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { AppProvider } from "@/components/providers/AppProvider";
import { AdminBar } from "@/components/admin/AdminBar";
import { SiteFooter, SiteHeader, WhatsAppFab } from "@/components/layout/SiteChrome";
import { site } from "@/data/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "NovexaHub | Websites, Apps, Studio Work",
    template: "%s | NovexaHub",
  },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.name,
  creator: site.name,
  publisher: site.name,
  authors: [{ name: "NovexaHub", url: site.url }],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "NovexaHub — Digital studio for websites, apps and custom work",
    description: site.description,
    images: [{ url: "/brand/hero-studio.jpg", width: 1536, height: 1024, alt: "NovexaHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovexaHub.live",
    description: site.description,
    images: ["/brand/hero-studio.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/brand/icon.svg" },
  appleWebApp: { capable: false },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      alternateName: ["Novexa Hub", "Novexa", "novexahub.live"],
      url: site.url,
      email: site.email,
      telephone: site.whatsappDisplay,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Flat # 401, Building A-1, Sheranwala Heighs",
        addressLocality: "Lahore",
        addressCountry: "PK",
      },
      description: site.description,
      slogan: site.tagline,
      logo: `${site.url}/brand/icon.svg`,
      knowsAbout: site.keywords.slice(0, 18),
      sameAs: [
        "https://hamza-portfolio-livid.vercel.app/",
        "https://maham-profile.vercel.app/",
      ],
      founder: [
        {
          "@type": "Person",
          name: "Syed Hamza Mehdi",
          jobTitle: "Co-founder, Full-Stack Software Engineer",
          url: "https://hamza-portfolio-livid.vercel.app/",
          image: `${site.url}/founders/hamza-mehdi.jpg`,
        },
        {
          "@type": "Person",
          name: "Maham Saeed",
          jobTitle: "Co-founder, Software Engineer",
          url: "https://maham-profile.vercel.app/",
          image: `${site.url}/founders/maham-saeed.jpg`,
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      alternateName: ["Novexa Hub", "Novexa"],
      description: site.description,
      publisher: { "@id": `${site.url}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${site.url}/explore?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#service`,
      name: site.name,
      url: site.url,
      email: site.email,
      telephone: site.whatsappDisplay,
      description: site.description,
      areaServed: "Worldwide",
      parentOrganization: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <AppProvider>
          <SiteHeader />
          <AdminBar />
          <main className="flex-1 overflow-x-clip max-w-full">{children}</main>
          <SiteFooter />
          <WhatsAppFab />
        </AppProvider>
      </body>
    </html>
  );
}
