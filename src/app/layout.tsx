import localFont from "next/font/local";
import type { Metadata } from "next";
import { Suspense } from "react";
import { preconnect } from "react-dom";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { Tracker } from "@/components/analytics/Tracker";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { AppProvider } from "@/components/providers/AppProvider";
import { AdminBar } from "@/components/admin/AdminBar";
import { SiteFooter, SiteHeader, WhatsAppFab } from "@/components/layout/SiteChrome";
import { site } from "@/data/site";
import "./globals.css";

// Self-hosted variable font — next/font/google fetches at build time and fails
// on restricted build networks (Cloudflare), so the woff2 ships with the repo.
const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "NovexaHub | Software Development Company & Digital Studio",
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
    title: "NovexaHub — Software development company for websites, apps and custom work",
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
  preconnect("https://firestore.googleapis.com");
  preconnect("https://firebasestorage.googleapis.com");
  preconnect("https://images.unsplash.com");
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <ConsentBanner />
        <AppProvider>
          <Suspense fallback={null}>
            <Tracker />
          </Suspense>
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
