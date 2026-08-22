import type { CategoryId, FeatureModule, Review } from "@/types";

export const categories: Array<{
  id: CategoryId;
  name: string;
  blurb: string;
  keywords: string;
}> = [
  { id: "websites", name: "Websites of any kind", blurb: "Business, hotel, clinic, restaurant, SaaS, landing pages — or a custom site for your idea.", keywords: "website development, custom websites, landing pages, portals" },
  { id: "mobile", name: "Any kind of app", blurb: "Android, iOS and Flutter: fitness, delivery, social, health, education, logistics and more.", keywords: "mobile app development, Flutter apps, iOS, Android" },
  { id: "ecommerce", name: "Ecommerce", blurb: "Stores, catalogs, carts, checkout, payments and brand shops.", keywords: "ecommerce website, shopping cart, payment integration" },
  { id: "ai", name: "AI & automation", blurb: "Assistants, workflows, posting automation and business process bots.", keywords: "AI automation, AI assistants, social posting automation" },
  { id: "uiux", name: "UI/UX & product design", blurb: "Screens, posters, banners, product design, prototypes and brand systems.", keywords: "UI UX design, posters, banners, product design" },
  { id: "creative", name: "Ads, video & posting", blurb: "Beautiful ads, video editing, social creatives and campaign kits.", keywords: "video editing, advertisements, social media posting" },
  { id: "features", name: "Any feature or page", blurb: "Cart, chat, calling, reels, payments, frontend pages — add one piece to what you have.", keywords: "cart feature, chat feature, reels, payment integration, frontend pages" },
  { id: "academic", name: "Final-year & assignments", blurb: "Defendable prototypes, documentation kits and structured writing help.", keywords: "final year projects, assignment writing, student prototypes" },
];

export type ServiceOffering = {
  name: string;
  detail: string;
  from: number;
  days: string;
  search: string;
};

export const serviceCatalog: Array<{
  id: CategoryId;
  name: string;
  intro: string;
  offerings: ServiceOffering[];
}> = [
  {
    id: "websites",
    name: "Websites — any category",
    intro: "If it lives on the web, we can design and build it. Ready-made shells or a fully custom site.",
    offerings: [
      { name: "Business / corporate site", detail: "About, services, team, contact and SEO structure.", from: 490, days: "5–10", search: "business website" },
      { name: "Landing pages", detail: "One high-converting page or a pack of campaign pages.", from: 280, days: "3–6", search: "landing page" },
      { name: "Hotel & hospitality", detail: "Rooms, galleries, booking enquiry and stay stories.", from: 890, days: "7–12", search: "hotel website" },
      { name: "Restaurant & cafe", detail: "Menus, reservations, locations and a warm brand site.", from: 620, days: "5–9", search: "restaurant website" },
      { name: "Clinic & healthcare", detail: "Doctors, appointments, services and trust-first UI.", from: 760, days: "6–12", search: "clinic website" },
      { name: "Real estate portal", detail: "Listings, maps, filters and agent pages.", from: 1180, days: "10–14", search: "real estate" },
      { name: "Education / courses", detail: "Course catalog, enrollments and student-facing pages.", from: 840, days: "8–14", search: "education website" },
      { name: "SaaS + dashboard", detail: "Marketing site plus an admin or product shell.", from: 760, days: "6–14", search: "SaaS dashboard" },
      { name: "Portfolio / studio", detail: "Masonry work, case studies and enquiry CTAs.", from: 540, days: "4–8", search: "portfolio website" },
      { name: "Custom website (your idea)", detail: "Any niche: NGO, events, directory, membership, intranet.", from: 490, days: "scoped", search: "custom website" },
    ],
  },
  {
    id: "mobile",
    name: "Apps — any kind",
    intro: "Flutter-ready or native-feeling products. Fitness, delivery, social, health, learning, logistics or your own concept.",
    offerings: [
      { name: "Fitness & wellness app", detail: "Plans, progress, memberships and trainer profiles.", from: 1290, days: "12–16", search: "fitness app" },
      { name: "Food delivery app", detail: "Menus, cart, tracking and rider-ready screens.", from: 1490, days: "14–18", search: "food delivery" },
      { name: "Telehealth / clinic app", detail: "Appointments, profiles and calling-ready consults.", from: 1680, days: "14–18", search: "telehealth" },
      { name: "Social / community app", detail: "Feeds, profiles, stories and chat-ready shells.", from: 1390, days: "12–18", search: "social app" },
      { name: "Education app", detail: "Lessons, quizzes, progress and certificates UI.", from: 1190, days: "12–16", search: "education app" },
      { name: "Logistics / ride app", detail: "Book, track, driver and passenger flows.", from: 1590, days: "14–18", search: "logistics app" },
      { name: "Custom app (your idea)", detail: "Any category of Android, iOS or Flutter product.", from: 1190, days: "scoped", search: "mobile app" },
    ],
  },
  {
    id: "ecommerce",
    name: "Ecommerce stores",
    intro: "Catalogs, carts, checkout and brand shops — from beauty to general retail.",
    offerings: [
      { name: "Full online store", detail: "Catalog, cart, checkout, orders and promo slots.", from: 1490, days: "10–14", search: "ecommerce" },
      { name: "Beauty / lifestyle shop", detail: "Lookbooks, kits and high-converting product stories.", from: 870, days: "7–10", search: "beauty shop" },
      { name: "Cart + checkout only", detail: "Drop a cart drawer and payment-ready checkout onto an existing site.", from: 360, days: "3–6", search: "cart" },
      { name: "Custom store", detail: "Subscriptions, multi-vendor, wholesale or your catalog rules.", from: 870, days: "scoped", search: "online store" },
    ],
  },
  {
    id: "ai",
    name: "AI automations",
    intro: "Assistants that answer, workflows that route, and posting systems that keep a brand moving.",
    offerings: [
      { name: "AI support agent", detail: "Branded chat, knowledge prompts and human handoff.", from: 990, days: "7–10", search: "AI assistant" },
      { name: "Business workflow automation", detail: "Form in, status board, notifications out.", from: 1120, days: "8–12", search: "workflow automation" },
      { name: "Social posting automation", detail: "Calendar, captions, approvals and publish-ready slots.", from: 640, days: "6–9", search: "social posting" },
      { name: "Sales / lead automation", detail: "Capture, score, follow-up and CRM-friendly logs.", from: 890, days: "7–12", search: "lead automation" },
      { name: "Custom AI workflow", detail: "Any repetitive process you want a system to remember.", from: 640, days: "scoped", search: "AI automation" },
    ],
  },
  {
    id: "uiux",
    name: "UI/UX, posters, banners & product design",
    intro: "Screens, systems and print-ready visuals — not only app wireframes.",
    offerings: [
      { name: "UI/UX for web or app", detail: "Flows, screens, prototypes and a usable design system.", from: 540, days: "5–10", search: "UI UX" },
      { name: "Posters", detail: "Event, product launch and campaign posters, print and digital.", from: 180, days: "2–5", search: "posters" },
      { name: "Banners", detail: "Web banners, social covers, roll-ups and ad sizes.", from: 150, days: "2–4", search: "banners" },
      { name: "Product design", detail: "Packaging, product shots direction and digital product UI.", from: 420, days: "5–8", search: "product design" },
      { name: "Brand identity", detail: "Logo, color, type, social kits and usage rules.", from: 540, days: "5–8", search: "brand identity" },
      { name: "Customized web & app UI", detail: "Restyle an existing product to feel expensive and consistent.", from: 490, days: "scoped", search: "product design" },
    ],
  },
  {
    id: "creative",
    name: "Beautiful ads, video & posting",
    intro: "Motion, cuts and campaign creatives that look bought, not templated.",
    offerings: [
      { name: "Video editing", detail: "Reels, ads, explainers, showreels and YouTube cuts.", from: 320, days: "3–8", search: "video editing" },
      { name: "Beautiful ads", detail: "Static and motion ads for Meta, TikTok, YouTube and display.", from: 260, days: "3–7", search: "ads" },
      { name: "Social posting pack", detail: "A month of posts, stories and captions in one visual language.", from: 240, days: "4–8", search: "social posting" },
      { name: "Campaign kit", detail: "Ads + posters + banners + short video in one drop.", from: 540, days: "6–10", search: "campaign" },
    ],
  },
  {
    id: "features",
    name: "Any feature, page or frontend",
    intro: "Buy a module instead of a whole product. Cart, chat, calling, reels, payments, or any page you are missing.",
    offerings: [
      { name: "Cart feature", detail: "Drawer, totals, quantity and checkout handoff.", from: 220, days: "3–5", search: "cart" },
      { name: "Payment integration", detail: "Checkout, receipts and payment states. No raw card storage.", from: 260, days: "3–6", search: "payments" },
      { name: "Chat feature", detail: "Live chat UI, threads and ticket-ready layouts.", from: 190, days: "3–5", search: "chat" },
      { name: "Calling feature", detail: "Ring, mute, camera and end-call screens.", from: 340, days: "5–8", search: "calling" },
      { name: "Reels feature", detail: "Vertical feed, stories tray and profile grid.", from: 320, days: "6–9", search: "reels" },
      { name: "Authentication", detail: "Login, register, reset and protected routes.", from: 180, days: "3–5", search: "authentication" },
      { name: "Frontend / any pages", detail: "Home, about, pricing, product, blog, dashboard — any page.", from: 160, days: "2–7", search: "frontend pages" },
      { name: "Maps, search, admin & more", detail: "Maps, notifications, wishlists, reviews, CMS, analytics.", from: 150, days: "3–7", search: "feature" },
    ],
  },
  {
    id: "academic",
    name: "Final-year projects & assignment writing",
    intro: "Defendable prototypes, documentation structure and writing kits. You stay responsible for originality and university rules.",
    offerings: [
      { name: "Final-year project (your idea)", detail: "Working prototype, diagrams, demo script and doc outline.", from: 420, days: "8–14", search: "final year" },
      { name: "IoT / AI student kit", detail: "Sensor or model-backed demo with architecture notes.", from: 480, days: "10–16", search: "final year" },
      { name: "Assignment writing kit", detail: "Structured draft, citations layout, slides and formatting.", from: 90, days: "3–8", search: "assignment" },
      { name: "Documentation & presentation", detail: "Report outline, figures and a defense-ready deck.", from: 160, days: "4–8", search: "documentation" },
    ],
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Fatima Rahman",
    role: "Founder, GlowBar",
    quote: "We had a store live in days, not months. The checkout felt premium and my team did not need a briefing deck.",
    rating: 5,
    projectType: "Ecommerce website",
    sample: false,
    projectSlug: "novacart-ecommerce-os",
  },
  {
    id: "r2",
    name: "Marcus Chen",
    role: "Ops lead",
    quote: "The dashboard looked expensive on day one. We only swapped copy and metrics and shipped.",
    rating: 4,
    projectType: "SaaS dashboard",
    sample: false,
    projectSlug: "ledgerly-finance-dashboard",
  },
  {
    id: "r3",
    name: "Priya Nair",
    role: "Studio owner",
    quote: "I picked a look I loved, asked for two changes, and we were aligned before any build started.",
    rating: 3,
    projectType: "Brand identity",
    sample: false,
    projectSlug: "aurora-brand-identity",
  },
  {
    id: "r4",
    name: "James Okonkwo",
    role: "Hotel manager",
    quote: "WhatsApp replies were fast and the booking site finally matches how the hotel actually feels.",
    rating: 5,
    projectType: "Hotel website",
    sample: false,
    projectSlug: "luxestay-hotel-booking",
  },
  {
    id: "r5",
    name: "Elena Voss",
    role: "Product designer",
    quote: "The AI concierge reads like a real teammate. Support volume dropped in the first week.",
    rating: 4,
    projectType: "AI assistant",
    sample: false,
    projectSlug: "whisper-ai-support-agent",
  },
  {
    id: "r6",
    name: "Ibrahim Malik",
    role: "Final-year student",
    quote: "The kit helped me structure a demo I could actually explain. I still wrote my own report.",
    rating: 3,
    projectType: "Final-year kit",
    sample: false,
    projectSlug: "campuscraf-final-year-kit",
  },
  {
    id: "r7",
    name: "Sofia Alvarez",
    role: "Cafe owner",
    quote: "Posters, banners and the site finally matched. People thought we hired a big studio.",
    rating: 5,
    projectType: "Poster & banner pack",
    sample: false,
    projectSlug: "framelab-poster-banner-studio",
  },
  {
    id: "r8",
    name: "Kenji Watanabe",
    role: "Creator",
    quote: "The video cut and ad pack looked native to the feed. We did not have to explain the brand twice.",
    rating: 4,
    projectType: "Video + ads",
    sample: false,
    projectSlug: "cuthouse-video-edit-pack",
  },
];

export const featureModules: FeatureModule[] = [
  { id: "f1", name: "Chat", summary: "Live chat UI, tickets and saved threads.", price: 190, deliveryDays: 3, tags: ["chat", "support"] },
  { id: "f2", name: "Payments", summary: "Checkout, receipts and payment states.", price: 260, deliveryDays: 4, tags: ["payments", "checkout"] },
  { id: "f3", name: "Authentication", summary: "Login, register and protected routes.", price: 180, deliveryDays: 3, tags: ["auth", "security"] },
  { id: "f4", name: "Reels & Stories", summary: "Vertical video feed and story tray.", price: 320, deliveryDays: 6, tags: ["reels", "social"] },
  { id: "f5", name: "In-app Calling", summary: "Ring, mute, camera and end-call states.", price: 340, deliveryDays: 6, tags: ["calling", "webrtc"] },
  { id: "f6", name: "Maps", summary: "Store locators, listings and pins.", price: 210, deliveryDays: 4, tags: ["maps", "locations"] },
  { id: "f7", name: "Notifications", summary: "In-app bells, email and push-ready slots.", price: 150, deliveryDays: 3, tags: ["notifications"] },
  { id: "f8", name: "Admin Dashboard", summary: "Tables, filters, KPIs and roles.", price: 390, deliveryDays: 7, tags: ["admin", "dashboard"] },
  { id: "f9", name: "Shopping Cart", summary: "Drawer, quantities, totals and checkout handoff.", price: 220, deliveryDays: 4, tags: ["cart", "ecommerce"] },
  { id: "f10", name: "Frontend pages", summary: "Home, about, pricing, product, blog — any page you need.", price: 160, deliveryDays: 3, tags: ["frontend", "pages"] },
  { id: "f11", name: "Search", summary: "Keyword, filters and empty states that still look designed.", price: 170, deliveryDays: 3, tags: ["search", "filters"] },
  { id: "f12", name: "Reviews & ratings", summary: "Stars, photos and moderation-ready review cards.", price: 140, deliveryDays: 3, tags: ["reviews"] },
  { id: "f13", name: "Wishlist / favourites", summary: "Save, sync and a signed-in heart state.", price: 120, deliveryDays: 2, tags: ["wishlist", "favourites"] },
  { id: "f14", name: "Booking calendar", summary: "Slots, timezone-friendly times and confirmations.", price: 240, deliveryDays: 5, tags: ["booking"] },
  { id: "f15", name: "Live location", summary: "Tracking map, ETA and status chips.", price: 280, deliveryDays: 5, tags: ["maps", "tracking"] },
  { id: "f16", name: "Multi-language", summary: "Language switch, RTL-ready layout notes.", price: 190, deliveryDays: 4, tags: ["i18n"] },
  { id: "f17", name: "CMS / blog", summary: "Editorial pages, tags and SEO article templates.", price: 230, deliveryDays: 5, tags: ["cms", "blog"] },
  { id: "f18", name: "File uploads", summary: "Avatars, documents and progress states.", price: 150, deliveryDays: 3, tags: ["uploads"] },
  { id: "f19", name: "Subscriptions", summary: "Plans, billing periods and upgrade/downgrade UI.", price: 250, deliveryDays: 5, tags: ["subscriptions", "billing"] },
  { id: "f20", name: "Analytics widgets", summary: "Charts, funnels and saved views inside your product.", price: 210, deliveryDays: 4, tags: ["analytics"] },
];

export const faqs = [
  {
    q: "Can I buy a ready-made project as-is?",
    a: "Yes. Open the project, then message us on WhatsApp or email. We confirm what you want, then start.",
  },
  {
    q: "What if I need changes?",
    a: "Use the customize tab on a project, then send those notes with WhatsApp or email. We confirm scope before work begins.",
  },
  {
    q: "Do I need an account to browse?",
    a: "No. Anyone can browse. Login is only for saving favourites and reviews.",
  },
  {
    q: "How do payments work?",
    a: "Nothing is charged on this website. Price and timing are agreed on WhatsApp or email after we understand the work.",
  },
  {
    q: "Can I add a single feature or a single page?",
    a: "Yes. Tell us the module — cart, chat, payments, reels, calling, authentication or any frontend page — and we will quote it.",
  },
  {
    q: "Do you design posters, banners and ads — not only websites?",
    a: "Yes. UI/UX, product design, posters, banners, social posting packs, ads and video editing are first-class services.",
  },
  {
    q: "Do you take final-year projects and assignment writing?",
    a: "Yes, as kits: prototypes, documentation structure, slides and writing help. You remain responsible for originality and your university’s rules.",
  },
];

export const processSteps = [
  { n: "01", title: "Discover", text: "Browse visual project cards like a gallery, not a brochure." },
  { n: "02", title: "Message", text: "WhatsApp or email the project you want, as-is or with notes." },
  { n: "03", title: "Scope", text: "We confirm the work, window and quote before anything starts." },
  { n: "04", title: "Build", text: "We assemble, brand and harden the product for launch." },
  { n: "05", title: "Deliver", text: "You receive the build, handover and a clear status trail." },
];

export const trust = [
  { title: "Direct human contact", text: "WhatsApp and email. No checkout maze, no ticket queue." },
  { title: "Custom when you need it", text: "Ready-made, a single feature, or a scoped change request." },
  { title: "Clear before we start", text: "Scope and timing are agreed with you, not guessed at a cart." },
  { title: "Human support", text: "You talk to the studio. We stay reachable after handover." },
];

export const serviceTicker = serviceCatalog.flatMap((group) => group.offerings.map((item) => item.name));
