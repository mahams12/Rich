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
  "luxestay-hotel-booking": shot("photo-1566073771259-6a8506099945"),
  "novacart-ecommerce-os": shot("photo-1607082349566-187342175e2f"),
  "pulsefit-fitness-app": shot("photo-1534438327276-14e5300c3a48"),
  "ledgerly-finance-dashboard": shot("photo-1460925895917-afdab827c52f"),
  "whisper-ai-support-agent": shot("photo-1677442136019-21780ecad995"),
  "aurora-brand-identity": shot("photo-1634942537034-2531766687b1"),
  "streamline-workflow-automation": shot("photo-1558494949-ef010cbdcc31"),
  "pocketclinic-telehealth": shot("photo-1576091160399-112ba8d25d1f"),
  "pixelforge-creative-studio": shot("photo-1618005182384-a83a8bd57fbe"),
  "authkit-identity-module": shot("photo-1614064641938-3bbee52942c7"),
  "reels-engine": shot("photo-1611162616475-46b635cb6868"),
  "checkout-plus-payments": shot("photo-1563013544-824ae1b704d3"),
  "campuscraf-final-year-kit": shot("photo-1488190211105-23925edfa36e"),
  "estatevue-property-portal": shot("photo-1560518883-ce09059eeffa"),
  "glowbar-beauty-shop": shot("photo-1596462502278-27bfdc403348"),
  "insightops-analytics-saas": shot("photo-1551288049-bebda4e38f71"),
  "callmesh-in-app-calling": shot("photo-1478737270239-2f02b77fc618"),
  "storygrid-content-platform": shot("photo-1457369804613-52c61a468e7d"),
  "framelab-poster-banner-studio": shot("photo-1541701494587-cb58502866ab"),
  "productform-design-system": shot("photo-1581235720704-06d3acfcb36f"),
  "cuthouse-video-edit-pack": shot("photo-1492691527719-9d1e07e534b4"),
  "adlume-campaign-ads": shot("photo-1432888498266-38ffec3eaf0a"),
  "postpilot-social-system": shot("photo-1611162616305-c69b3c7b4d07"),
  "biteroute-food-delivery": shot("photo-1504674900247-0877df9cc836"),
  "tableandthyme-restaurant": shot("photo-1414235077428-338989a2e8c0"),
  "learnnest-education-platform": shot("photo-14565130808-af0986bc3504"),
  "cartdrawer-shopping-cart": shot("photo-1472851294608-062f824d29cc"),
  "pulsechat-live-chat": shot("photo-1577563908411-5077b6dc7624"),
  "pageforge-frontend-pages": shot("photo-1547658719-da2b51169166"),
  "thesisforge-assignment-kit": shot("photo-1455390582262-044cdead277a"),
  "agrisense-fyp-iot": shot("photo-1530836369250-ef72a3f5cda8"),
  "customcraft-bespoke-build": shot("photo-1517694712202-14dd9538aa97"),
  "ridegrid-logistics-app": shot("photo-1586528116311-ad8dd3c8310d"),
  "clinicorn-clinic-website": shot("photo-1666214280557-f1b5022eb634"),
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
  return project.cover || bySlug[project.slug] || byCategory[project.category] || byCategory.websites;
}

export function projectGalleryShots(project: Project): [string, string, string] {
  const cover = projectCover(project);
  const gallery = project.gallery ?? [];
  return [gallery[0] || cover, gallery[1] || cover, gallery[2] || cover];
}
