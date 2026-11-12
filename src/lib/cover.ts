import type { Project } from "@/types";

const used = new Set<string>();

function shot(id: string) {
  if (used.has(id)) {
    throw new Error(`Duplicate cover image: ${id}`);
  }
  used.add(id);
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;
}

export const serviceCovers = {
  website: shot("photo-1461749280684-dccba630e2f6"),
  app: shot("photo-1551650975-87deedd944c3"),
  systems: shot("photo-1518770660439-4636190af475"),
  consulting: shot("photo-1497366811353-6870744d04b2"),
  aiMedia: shot("photo-1620712943543-bcc4688e7485"),
  brand: shot("photo-1626785774573-4b799315345d"),
};

const bySlug: Record<string, string> = {
  "luxestay-hotel-booking": "/project-covers/luxestay-hotel-booking.svg",
  "novacart-ecommerce-os": "/project-covers/novacart-ecommerce-os.svg",
  "pulsefit-fitness-app": "/project-covers/pulsefit-fitness-app.svg",
  "ledgerly-finance-dashboard": "/project-covers/ledgerly-finance-dashboard.svg",
  "whisper-ai-support-agent": "/project-covers/whisper-ai-support-agent.svg",
  "aurora-brand-identity": "/project-covers/aurora-brand-identity.svg",
  "streamline-workflow-automation": "/project-covers/streamline-workflow-automation.svg",
  "pocketclinic-telehealth": "/project-covers/pocketclinic-telehealth.svg",
  "pixelforge-creative-studio": "/project-covers/pixelforge-creative-studio.svg",
  "authkit-identity-module": "/project-covers/authkit-identity-module.svg",
  "reels-engine": "/project-covers/reels-engine.svg",
  "checkout-plus-payments": "/project-covers/checkout-plus-payments.svg",
  "campuscraf-final-year-kit": "/project-covers/campuscraf-final-year-kit.svg",
  "estatevue-property-portal": "/project-covers/estatevue-property-portal.svg",
  "glowbar-beauty-shop": "/project-covers/glowbar-beauty-shop.svg",
  "insightops-analytics-saas": "/project-covers/insightops-analytics-saas.svg",
  "callmesh-in-app-calling": "/project-covers/callmesh-in-app-calling.svg",
  "storygrid-content-platform": "/project-covers/storygrid-content-platform.svg",
  "framelab-poster-banner-studio": "/project-covers/framelab-poster-banner-studio.svg",
  "productform-design-system": "/project-covers/productform-design-system.svg",
  "cuthouse-video-edit-pack": "/project-covers/cuthouse-video-edit-pack.svg",
  "adlume-campaign-ads": "/project-covers/adlume-campaign-ads.svg",
  "postpilot-social-system": "/project-covers/postpilot-social-system.svg",
  "biteroute-food-delivery": "/project-covers/biteroute-food-delivery.svg",
  "tableandthyme-restaurant": "/project-covers/tableandthyme-restaurant.svg",
  "learnnest-education-platform": "/project-covers/learnnest-education-platform.svg",
  "cartdrawer-shopping-cart": "/project-covers/cartdrawer-shopping-cart.svg",
  "pulsechat-live-chat": "/project-covers/pulsechat-live-chat.svg",
  "pageforge-frontend-pages": "/project-covers/pageforge-frontend-pages.svg",
  "thesisforge-assignment-kit": "/project-covers/thesisforge-assignment-kit.svg",
  "agrisense-fyp-iot": "/project-covers/agrisense-fyp-iot.svg",
  "customcraft-bespoke-build": "/project-covers/customcraft-bespoke-build.svg",
  "ridegrid-logistics-app": "/project-covers/ridegrid-logistics-app.svg",
  "clinicorn-clinic-website": "/project-covers/clinicorn-clinic-website.svg",
};

const byCategory: Record<string, string> = {
  websites: shot("photo-1498050108023-c5249f4df085"),
  mobile: shot("photo-1511707171634-5f897ff02aa9"),
  ecommerce: shot("photo-1441986300917-64674bd600d8"),
  ai: shot("photo-1639322537228-f710d846310a"),
  uiux: shot("photo-1586717791821-3f44a563fa4c"),
  creative: shot("photo-1618005198919-d3d4b5a92ead"),
  features: shot("photo-1516321318423-f06f85e504b3"),
  academic: shot("photo-1481627834876-b7833e8f5570"),
};

export function projectCover(project: Project) {
  const firstGallery = project.gallery?.map((item) => item.trim()).find(Boolean);
  const uploaded = [firstGallery, project.cover?.trim()].find((value) =>
    value && /firebasestorage\.googleapis\.com|\.firebasestorage\.app/i.test(value),
  );
  return uploaded || bySlug[project.slug] || firstGallery || project.cover || byCategory[project.category] || byCategory.websites;
}

/** Uploaded gallery images only (1–4). Falls back to cover/stock when none uploaded. */
export function projectGalleryImages(project: Project): string[] {
  const uploaded = (project.gallery ?? []).map((item) => item.trim()).filter(Boolean).slice(0, 4);
  if (uploaded.length) return uploaded;
  const cover = project.cover?.trim();
  if (cover) return [cover];
  return [projectCover(project)];
}
