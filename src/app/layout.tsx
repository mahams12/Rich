import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
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
  authors: [{ name: "NovexaHub", url: site.url }],
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
  robots: { index: true, follow: true },
  alternates: { canonical: site.url },
  icons: { icon: "/brand/icon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.whatsappDisplay,
  description: site.description,
  slogan: site.tagline,
  logo: `${site.url}/brand/icon.svg`,
  knowsAbout: site.keywords.slice(0, 18),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
