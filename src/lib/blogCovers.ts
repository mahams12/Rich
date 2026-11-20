import type { BlogPost } from "@/types";

// Curated local covers take precedence over stale or invalid stored URLs.
const fallbackCovers: Record<string, string> = {
  "website-accessibility-checklist-pakistani-businesses": "/blog-covers/website-accessibility-checklist-pakistani-businesses.svg",
  "saas-subscription-billing-integration-guide": "/blog-covers/saas-subscription-billing-integration-guide.svg",
  "b2b-ecommerce-development-pakistan-buyer-portal-guide": "/blog-covers/b2b-ecommerce-development-pakistan-buyer-portal-guide.svg",
  "ai-customer-support-automation-guide": "/blog-covers/ai-customer-support-automation-guide.svg",
  "business-website-redesign-pakistan-launch-guide": "/blog-covers/business-website-redesign-pakistan-launch-guide.svg",
  "multi-vendor-marketplace-development-build-guide": "/blog-covers/multi-vendor-marketplace-development-build-guide.svg",
  "business-process-automation-pakistan-workflow-guide": "/blog-covers/business-process-automation-pakistan-workflow-guide.svg",
  "how-to-choose-a-software-project-partner-novexahub": "/blog-covers/how-to-choose-a-software-project-partner-novexahub.svg",
  "ready-made-websites-vs-custom-software-projects": "/blog-covers/ready-made-websites-vs-custom-software-projects.svg",
  "mobile-app-and-flutter-software-projects-for-startups": "/blog-covers/mobile-app-and-flutter-software-projects-for-startups.svg",
  "final-year-software-project-ideas-and-studio-support": "/blog-covers/final-year-software-project-ideas-and-studio-support.svg",
  "ai-automation-software-projects-for-growing-businesses": "/blog-covers/ai-automation-software-projects-for-growing-businesses.svg",
  "what-is-novexahub-digital-studio-explained": "/blog-covers/what-is-novexahub-digital-studio-explained.svg",
  "business-website-checklist-2026": "/blog-covers/business-website-checklist-2026.svg",
  "how-to-plan-software-integrations-before-development": "/blog-covers/how-to-plan-software-integrations-before-development.svg",
  "ecommerce-product-page-design-practical-buying-guide": "/blog-covers/ecommerce-product-page-design-practical-buying-guide.svg",
  "shopify-expiring-offline-access-token-migration-2027": "/blog-covers/shopify-expiring-offline-access-token-migration-2027.svg",
  "website-development-cost-in-pakistan": "/blog-covers/website-development-cost-in-pakistan.svg",
  "mobile-app-development-cost-pakistan-2026-budget-guide": "/blog-covers/mobile-app-development-cost-pakistan-2026-budget-guide.svg",
  "ecommerce-platform-selection-2026-international-business-guide": "/blog-covers/ecommerce-platform-selection-2026-international-business-guide.svg",
  "custom-erp-software-cost-pakistan-2026-guide": "/blog-covers/custom-erp-software-cost-pakistan-2026-guide.svg",
  "ai-invoice-processing-automation-business-guide": "/blog-covers/ai-invoice-processing-automation-business-guide.svg",
  "multi-tenant-saas-architecture-guide": "/blog-covers/multi-tenant-saas-architecture-guide.svg",
  "website-maintenance-checklist-pakistan-businesses": "/blog-covers/website-maintenance-checklist-pakistan-businesses.svg",
  "custom-web-application-development-guide": "/blog-covers/custom-web-application-development-guide.svg",
  "ecommerce-payment-integration-pakistan-guide": "/blog-covers/ecommerce-payment-integration-pakistan-guide.svg",
};

/**
 * Cover candidates for a post, best first. The stored cover (uploaded to
 * Firebase Storage or an external URL saved on the record) wins; curated
 * per-slug covers act as the runtime fallback for records whose stored URL
 * is stale or undeliverable. If nothing exists, both are undefined.
 */
export function blogCoverSources(post: Pick<BlogPost, "slug" | "title" | "cover">): {
  src?: string;
  fallbackSrc?: string;
} {
  const stored = post.cover?.trim() || undefined;
  const isFirebaseUpload = Boolean(stored && /firebasestorage\.googleapis\.com|\.firebasestorage\.app/i.test(stored));
  const local = fallbackCovers[post.slug];
  const src = isFirebaseUpload ? stored : local || stored;
  const fallbackSrc = isFirebaseUpload ? local : undefined;
  return { src, fallbackSrc };
}

/**
 * Rewrite an Unsplash (imgix) URL to the width actually rendered, so cards
 * don't download hero-sized files. Non-Unsplash sources pass through.
 */
export function sizedCover(src: string | undefined, width: number): string | undefined {
  if (!src || !src.startsWith("https://images.unsplash.com/")) return src;
  try {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    if (!url.searchParams.has("q")) url.searchParams.set("q", "80");
    return url.toString();
  } catch {
    return src;
  }
}
