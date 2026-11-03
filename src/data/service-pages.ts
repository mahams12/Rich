export type ServicePageData = {
  /** Route under the site root, e.g. "web-development". */
  slug: string;
  badge: string;
  /** Metadata <title> — unique per page. */
  title: string;
  /** Visible H1 — unique per page. */
  h1: string;
  description: string;
  keywords: string[];
  /** Intro paragraphs rendered under the H1. */
  hero: string[];
  problems: { title: string; text: string }[];
  deliverables: string[];
  process: { title: string; text: string }[];
  /** Verified stack only — drawn from the studio's published tech list and project technologies. */
  capabilities: string[];
  /** Verified project slugs from src/data/projects.ts. */
  projects: { slug: string; title: string; note: string }[];
  /** Verified post slugs from src/data/posts.ts. */
  posts: { slug: string; title: string }[];
  /** Internal links to sibling service pages. */
  siblings: { href: string; label: string }[];
  faqs: { q: string; a: string }[];
};

export const servicePages: ServicePageData[] = [
  {
    slug: "web-development",
    badge: "Web development",
    title: "Web Development Company — Custom Websites & Web Apps",
    h1: "Web development that ships, not just ships screenshots.",
    description:
      "NovexaHub is a web development company building custom websites, portals and web applications with Next.js, React and TypeScript. Enquire on WhatsApp or email.",
    keywords: [
      "web development company",
      "custom website development",
      "website development services",
      "Next.js development",
      "business website",
      "NovexaHub",
    ],
    hero: [
      "We build websites that carry a business: marketing sites, portals, dashboards and content platforms — designed first, engineered second, and launched with the SEO basics already in place.",
      "You can start two ways. Pick a ready-made website from the portfolio and we brand it for you, or bring a blank page and we scope a custom build around your content, integrations and launch window.",
    ],
    problems: [
      { title: "A site that exists but does nothing", text: "No enquiry flow, no clear offer, no reason to come back. We rebuild around one job: turning a visit into a conversation." },
      { title: "Slow templates that all look the same", text: "Page builders get you online fast and then cap you. Our builds are component-based, so the site can grow without a rewrite." },
      { title: "Content stuck in someone's inbox", text: "We structure your services, locations, team and policies into a maintainable content model instead of hard-coded paragraphs." },
      { title: "SEO left as an afterthought", text: "Titles, canonicals, sitemap, structured data and internal links are part of the build, not a plugin installed after launch." },
    ],
    deliverables: [
      "Design system and page layouts in a shared reviewable file",
      "Responsive, accessible Next.js/React build",
      "Metadata, canonicals, sitemap and structured data",
      "Contact and enquiry flows wired to your inbox or CRM",
      "Content handover notes so your team can edit safely",
      "Launch support window agreed in scope",
    ],
    process: [
      { title: "Scope", text: "We map pages, content sources, integrations and the launch window before quoting." },
      { title: "Design", text: "Layout direction and key screens are approved before build starts." },
      { title: "Build", text: "Component build with staging previews you can click through, not screenshots." },
      { title: "Launch", text: "Redirects, analytics checks and a handover call. Then we stay reachable." },
    ],
    capabilities: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Supabase", "CMS-friendly content models"],
    projects: [
      { slug: "estatevue-property-portal", title: "EstateVue Property Portal", note: "Listings, filters and agent pages for real estate." },
      { slug: "luxestay-hotel-booking", title: "LuxeStay Hotel Booking", note: "Room galleries and a booking enquiry flow for hospitality." },
      { slug: "clinicorn-clinic-website", title: "Clinicorn Clinic Website", note: "A trust-first services and appointments site." },
    ],
    posts: [
      { slug: "business-website-checklist-2026", title: "Business Website Checklist for 2026" },
      { slug: "website-development-cost-in-pakistan", title: "Website Development Cost in Pakistan: A Practical 2026 Guide" },
      { slug: "ready-made-websites-vs-custom-software-projects", title: "Ready-Made Websites vs Custom Software Projects" },
    ],
    siblings: [
      { href: "/ecommerce-development", label: "Ecommerce development" },
      { href: "/custom-software-development", label: "Custom software" },
      { href: "/ui-ux-design", label: "UI/UX design" },
    ],
    faqs: [
      {
        q: "How much does a custom website cost with NovexaHub?",
        a: "Our published starting points are public: landing pages from $280, business sites from $490, hospitality sites from $890 and real-estate portals from $1,180. A final quote is confirmed on WhatsApp or email after we understand your content and integrations.",
      },
      {
        q: "Ready-made site or fully custom build — which should I pick?",
        a: "If your content fits a proven structure, a ready-made site gets you live faster and cheaper. If you need unusual flows, integrations or a very specific brand system, custom is the right spend. We will tell you honestly which fits before you commit.",
      },
      {
        q: "Do you handle SEO during the build?",
        a: "Yes at the technical level: indexable pages, unique metadata, canonical URLs, sitemap, robots rules, structured data and internal links. Rankings depend on content quality and authority over time — we do not sell guaranteed positions.",
      },
      {
        q: "Can you rebuild or restyle an existing website?",
        a: "Yes. Share the current URL and what is not working. If the base is sound we restyle and extend it; if it is fighting you, we rebuild the parts that matter and keep what works.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    badge: "Mobile apps",
    title: "Mobile App Development Company — Flutter, iOS & Android",
    h1: "Mobile app development for iOS and Android from one codebase.",
    description:
      "NovexaHub builds mobile apps with Flutter and Firebase: fitness, delivery, telehealth, logistics and custom concepts. Enquire on WhatsApp or email.",
    keywords: [
      "mobile app development company",
      "Flutter app development",
      "iOS app development",
      "Android app development",
      "mobile app MVP",
      "NovexaHub",
    ],
    hero: [
      "We design and build mobile products with Flutter so one codebase serves iOS and Android — with Firebase behind it for auth, data and notifications where that stack fits.",
      "Start from a ready-made app in the portfolio — fitness, delivery, telehealth, logistics — or bring a new concept and we scope it screen by screen before writing a line of code.",
    ],
    problems: [
      { title: "Two platforms, twice the bill", text: "Flutter keeps iOS and Android on one codebase, so features ship together instead of trailing each other." },
      { title: "A prototype nobody can install", text: "We build toward a real release path: signing, store assets and a checklist, not a demo that only lives on one laptop." },
      { title: "Backend surprises mid-build", text: "Auth, data, notifications and payments are scoped up front so the app architecture matches the product, not the other way round." },
      { title: "Screens that fight thumbs", text: "We design for safe areas, reach and interrupted sessions — the way phones are actually held." },
    ],
    deliverables: [
      "Screen flows and a tappable design before build",
      "Flutter app for iOS and Android",
      "Firebase-backed auth, data and notification setup where scoped",
      "Store-ready assets checklist and release notes",
      "Handover documentation and a launch support window",
    ],
    process: [
      { title: "Scope", text: "Core screens, roles, offline needs and platform targets agreed before quoting." },
      { title: "Design", text: "Flow-first screens reviewed on a real device frame, not a desktop mockup." },
      { title: "Build", text: "Flutter build with staged reviews — you install builds, not screenshots." },
      { title: "Release", text: "Store checklist, assets and submission support per the agreed scope." },
    ],
    capabilities: ["Flutter", "Dart", "Firebase", "WebRTC-ready calling", "Push-ready notification UI", "iOS & Android"],
    projects: [
      { slug: "pulsefit-fitness-app", title: "PulseFit Fitness App", note: "Workout plans, progress charts and memberships." },
      { slug: "biteroute-food-delivery", title: "BiteRoute Food Delivery", note: "Menus, cart, tracking and rider-ready screens." },
      { slug: "pocketclinic-telehealth", title: "PocketClinic Telehealth", note: "Appointments, patient profiles and calling-ready consults." },
    ],
    posts: [
      { slug: "mobile-app-and-flutter-software-projects-for-startups", title: "Mobile App & Flutter Software Projects for Startups" },
      { slug: "mobile-app-development-partner-checklist-2026", title: "Mobile App Development Partner Checklist for 2026" },
    ],
    siblings: [
      { href: "/web-development", label: "Web development" },
      { href: "/saas-development", label: "SaaS development" },
      { href: "/ui-ux-design", label: "UI/UX design" },
    ],
    faqs: [
      {
        q: "Do you build for both iOS and Android?",
        a: "Yes. We build with Flutter so one codebase produces both apps. Platform-specific work — store assets, permissions, release tracks — is part of the scoped release stage.",
      },
      {
        q: "How much does an app cost?",
        a: "Published starting points: fitness and education apps from about $1,190–$1,290, delivery and logistics apps from about $1,490–$1,590, telehealth from $1,680. Custom concepts are quoted after scoping screens and integrations.",
      },
      {
        q: "Can you take over an existing app?",
        a: "Often, yes. Share the stack and access details and we will tell you honestly whether extending or rebuilding is the cheaper path.",
      },
      {
        q: "Do you publish to the App Store and Play Store?",
        a: "We prepare store-ready builds, listings assets and a release checklist, and support submission per the agreed scope. Developer accounts and store fees stay with you — we will walk you through creating them if needed.",
      },
    ],
  },
  {
    slug: "custom-software-development",
    badge: "Custom software",
    title: "Custom Software Development Company — Systems Built Around Work",
    h1: "Custom software development for the way your team actually works.",
    description:
      "NovexaHub builds custom software: internal tools, dashboards, portals, integrations and feature modules. Scoped on WhatsApp or email — no checkout maze.",
    keywords: [
      "custom software development company",
      "business software development",
      "internal tools",
      "dashboard development",
      "software integrations",
      "NovexaHub",
    ],
    hero: [
      "Custom software earns its cost when it removes a repeated cost: a spreadsheet that breaks weekly, a process that lives in one person's head, five tools that refuse to share data.",
      "We build the small, sharp version first — the workflow, the dashboard, the integration — and only grow it where the real usage points. Modules like authentication, chat, payments and notifications are already battle-tested in our catalog, so custom does not mean starting from zero.",
    ],
    problems: [
      { title: "Work tracked across five spreadsheets", text: "We turn the process into one system with statuses, owners and an audit trail instead of version-named files." },
      { title: "Tools that do not talk", text: "Integrations are planned before development — data models, webhooks and failure cases — not bolted on after." },
      { title: "A rebuild every time a feature is needed", text: "Feature modules — auth, chat, payments, notifications, admin tables — drop into what you already have." },
      { title: "Nobody can see the numbers", text: "Dashboards and reporting views built around the metrics your team actually checks every morning." },
    ],
    deliverables: [
      "Workflow map and scoped requirements before build",
      "Working software in staged review builds",
      "Admin views, roles and audit-friendly logs where needed",
      "Integration and webhook documentation",
      "Handover notes and a support window",
    ],
    process: [
      { title: "Map", text: "We document the current process and the cost it creates before proposing software." },
      { title: "Scope", text: "The smallest build that removes the cost is defined — screens, roles, integrations." },
      { title: "Build", text: "Staged builds reviewed against real tasks, not abstract acceptance criteria." },
      { title: "Adopt", text: "Rollout notes, handover and a support window so the system survives first contact." },
    ],
    capabilities: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Supabase", "Webhooks & integrations", "Role-based admin views"],
    projects: [
      { slug: "customcraft-bespoke-build", title: "CustomCraft Bespoke Build", note: "A custom web and app engagement model, scoped per client." },
      { slug: "ledgerly-finance-dashboard", title: "Ledgerly Finance Dashboard", note: "Invoices, cashflow and client reporting for money teams." },
      { slug: "authkit-identity-module", title: "AuthKit Identity Module", note: "Login, register and protected routes as a drop-in feature." },
    ],
    posts: [
      { slug: "how-to-plan-software-integrations-before-development", title: "How to Plan Software Integrations Before Development Starts" },
      { slug: "how-to-choose-a-software-project-partner-novexahub", title: "How to Choose a Software Project Partner" },
    ],
    siblings: [
      { href: "/saas-development", label: "SaaS development" },
      { href: "/ai-automation", label: "AI automation" },
      { href: "/web-development", label: "Web development" },
    ],
    faqs: [
      {
        q: "What counts as custom software here?",
        a: "Anything built around your process instead of a template: internal tools, dashboards, portals, integrations between systems, and individual feature modules like authentication, chat, payments or notifications.",
      },
      {
        q: "How is pricing handled?",
        a: "Everything is quoted after scoping — nothing is charged through this website. Individual feature modules have published starting points (for example authentication from $180, payments from $260); larger systems are quoted against a written scope.",
      },
      {
        q: "Do we own the code?",
        a: "Yes. Handover includes the source, the documentation and the credentials transfer agreed in scope. No lock-in to us for hosting or future work.",
      },
      {
        q: "Can you integrate with tools we already use?",
        a: "That is the usual case. We plan integrations — APIs, webhooks, data models, failure handling — before development starts, and we will flag early if an existing tool cannot do what you need.",
      },
    ],
  },
  {
    slug: "ai-automation",
    badge: "AI automation",
    title: "AI Automation Agency — Workflows & Business Process Automation",
    h1: "AI automation that removes work instead of creating a new tool to manage.",
    description:
      "NovexaHub builds AI automation: support assistants, workflow routing, lead capture and social posting systems. Scoped on WhatsApp or email.",
    keywords: [
      "AI automation agency",
      "AI workflow automation",
      "business process automation",
      "AI support agent",
      "lead automation",
      "NovexaHub",
    ],
    hero: [
      "The useful version of AI automation is boring: a form goes in, the right person gets notified, the status board updates, the follow-up happens. No science project, no new dashboard nobody opens.",
      "We map the repetitive process first, then automate the steps that are actually repeatable — with AI where it helps (answering, drafting, routing) and plain deterministic logic where it is cheaper and more reliable.",
    ],
    problems: [
      { title: "The same question answered forty times a week", text: "A branded AI assistant handles the repeats, captures the lead and hands off to a human when it should." },
      { title: "Work falling between inboxes", text: "Intake forms feed a status board with owners and notifications, so nothing lives only in a chat thread." },
      { title: "Posting that depends on someone remembering", text: "Calendar-driven social posting systems keep a brand moving without a daily scramble." },
      { title: "Automation that breaks silently", text: "We design audit-friendly logs and alert points, so when something fails you find out before your customers do." },
    ],
    deliverables: [
      "Process map showing exactly what gets automated",
      "Branded AI assistant or workflow UI as scoped",
      "Prompt starter kit and handoff rules for AI flows",
      "Notification and status-board setup",
      "Audit-friendly logs and an operations handover",
    ],
    process: [
      { title: "Map", text: "We document the repeated process and where it costs time or loses leads." },
      { title: "Design", text: "The flow is drawn — inputs, decisions, AI steps, human handoffs — before build." },
      { title: "Build", text: "Assistant, forms, boards and notifications assembled and tested against real cases." },
      { title: "Operate", text: "Handover with prompt notes and a support window; we stay reachable for tuning." },
    ],
    capabilities: ["OpenAI", "Claude", "Make/Zapier-ready", "Webhooks", "Branded chat widgets", "Email & WhatsApp notification slots"],
    projects: [
      { slug: "whisper-ai-support-agent", title: "Whisper AI Support Agent", note: "Branded chat that answers, routes and captures leads." },
      { slug: "streamline-workflow-automation", title: "Streamline Workflow Automation", note: "Form in, status board, notifications out." },
      { slug: "postpilot-social-system", title: "PostPilot Social Posting", note: "Calendar, captions, approvals and publish-ready slots." },
    ],
    posts: [
      { slug: "ai-automation-software-projects-for-growing-businesses", title: "AI Automation Software Projects for Growing Businesses" },
    ],
    siblings: [
      { href: "/ai-chatbot-development", label: "AI chatbot development" },
      { href: "/custom-software-development", label: "Custom software" },
      { href: "/saas-development", label: "SaaS development" },
    ],
    faqs: [
      {
        q: "What can you actually automate?",
        a: "Support and FAQ answering, lead capture and routing, intake-to-status-board workflows, social posting calendars, and custom AI workflows for any repetitive process. We will tell you if a process is too irregular to automate reliably.",
      },
      {
        q: "How much does AI automation cost?",
        a: "Published starting points: social posting automation from $640, lead automation from $890, a branded AI support agent from $990 and workflow automation from $1,120. Custom workflows are quoted after we map the process.",
      },
      {
        q: "Do you provide the AI model accounts?",
        a: "The build is yours; model API keys and third-party automation subscriptions stay in your name so you control spend and data. We set up and document the wiring.",
      },
      {
        q: "What happens when the AI gets something wrong?",
        a: "Every flow has human handoff rules and an audit log. AI answers within a bounded knowledge scope and escalates outside it — it does not improvise on your customers.",
      },
    ],
  },
  {
    slug: "saas-development",
    badge: "SaaS development",
    title: "SaaS Development Company — MVP to Product",
    h1: "SaaS development from a scoped MVP to a product that holds up.",
    description:
      "NovexaHub builds SaaS products and MVPs: marketing site, app shell, auth, billing-ready checkout and dashboards. Scoped on WhatsApp or email.",
    keywords: [
      "SaaS development company",
      "SaaS MVP development",
      "SaaS application development",
      "SaaS dashboard",
      "product development",
      "NovexaHub",
    ],
    hero: [
      "A SaaS MVP is not a smaller product — it is the smallest product that proves the core workflow. We scope that workflow first, then build the marketing site, the app shell and the one thing users actually pay for.",
      "Our catalog already carries SaaS-shaped pieces — analytics dashboards, marketing-plus-app shells, auth and billing-ready checkout modules — so an MVP starts from proven parts, not a blank repo.",
    ],
    problems: [
      { title: "An MVP with forty features", text: "We cut scope to the workflow a user would pay for, and park the rest on a real roadmap instead of deleting it quietly." },
      { title: "Marketing site and product built by strangers", text: "The signup story and the app shell are designed together, so the promise on the landing page is the thing inside the product." },
      { title: "Auth and billing rebuilt from scratch", text: "Drop-in modules for authentication, checkout and subscriptions mean budget goes to your differentiator, not plumbing." },
      { title: "No picture of what users do", text: "Dashboards, saved views and analytics-friendly structure are part of the build, so you can see usage instead of guessing." },
    ],
    deliverables: [
      "Scoped MVP definition — one core workflow, written down",
      "Marketing site plus app shell in one design system",
      "Auth, checkout and subscription-ready modules",
      "Dashboard and reporting views for the metrics that matter",
      "Deployment, handover docs and a support window",
    ],
    process: [
      { title: "Scope", text: "Core user, core workflow and the smallest payable version defined before quoting." },
      { title: "Design", text: "Marketing story and product screens designed as one system." },
      { title: "Build", text: "MVP assembled from proven modules plus the custom piece that makes it yours." },
      { title: "Grow", text: "Launch, watch real usage, then expand the roadmap in order of evidence." },
    ],
    capabilities: ["Next.js", "React", "TypeScript", "PostgreSQL", "Supabase", "Stripe-ready checkout", "Auth & role modules", "Analytics-ready views"],
    projects: [
      { slug: "insightops-analytics-saas", title: "InsightOps Analytics SaaS", note: "Marketing site plus app shell for analytics products." },
      { slug: "ledgerly-finance-dashboard", title: "Ledgerly Finance Dashboard", note: "KPI, invoice and cashflow views for money teams." },
      { slug: "checkout-plus-payments", title: "Checkout+ Payments", note: "Payment states and order summary without raw card storage." },
    ],
    posts: [
      { slug: "how-to-scope-a-saas-mvp-before-development", title: "How to Scope a SaaS MVP Before You Hire a Development Team" },
    ],
    siblings: [
      { href: "/custom-software-development", label: "Custom software" },
      { href: "/web-development", label: "Web development" },
      { href: "/ai-automation", label: "AI automation" },
    ],
    faqs: [
      {
        q: "What does a SaaS MVP include here?",
        a: "Typically: the marketing site, the app shell, authentication, a billing-ready checkout path, and the single core workflow the product charges for. Everything else is sequenced on a roadmap after real usage data.",
      },
      {
        q: "How much does a SaaS MVP cost?",
        a: "Published starting points: SaaS marketing-plus-app shells from about $1,350 and dashboards from $760. Custom MVPs are quoted against the scoped workflow — we write the scope down before any number is agreed.",
      },
      {
        q: "Can you build billing and subscriptions?",
        a: "We build Stripe-ready checkout, payment states and subscription UI. The merchant account and commercial terms stay with you; we wire and document the technical side.",
      },
      {
        q: "What happens after the MVP ships?",
        a: "You get handover documentation and a support window. Most teams then expand in order of usage evidence — we can continue on a scoped basis or hand a clean codebase to your in-house team.",
      },
    ],
  },
  {
    slug: "ecommerce-development",
    badge: "Ecommerce",
    title: "Ecommerce Development Company — Stores & Marketplaces",
    h1: "Ecommerce development for stores that need more than a template.",
    description:
      "NovexaHub builds ecommerce websites: catalogs, carts, checkout, brand shops and multi-vendor ready stores. Scoped on WhatsApp or email.",
    keywords: [
      "ecommerce development company",
      "custom ecommerce development",
      "online store development",
      "multi-vendor marketplace",
      "checkout integration",
      "NovexaHub",
    ],
    hero: [
      "A store lives or dies on the boring parts: product pages that answer questions, a cart that never surprises, checkout that does not leak orders. We build those parts properly, then make it look like your brand.",
      "Start from a ready-made storefront — a complete store OS or a beauty-and-lifestyle shop — or scope a custom store with subscriptions, wholesale rules or multi-vendor logic.",
    ],
    problems: [
      { title: "A catalog that reads like a spreadsheet", text: "Product pages structured around buying decisions: what it is, what it costs, what happens next — plus lookbooks where the product deserves them." },
      { title: "Checkout that leaks orders", text: "Clear totals, payment states and a success path that confirms the order instead of hoping. No raw card storage anywhere." },
      { title: "A theme that fights your brand", text: "Storefronts are designed around your product photography and voice, not a template with your logo pasted on." },
      { title: "Growth blocked by the platform", text: "Subscriptions, kits, wholesale pricing and multi-vendor structure are buildable here — custom stores are not locked to a plugin's limits." },
    ],
    deliverables: [
      "Catalog and collection structure for your products",
      "Cart, checkout and order-status flows",
      "Payment-ready integration (provider account stays with you)",
      "Promo, subscription or multi-vendor logic as scoped",
      "Launch support and a handover your team can run",
    ],
    process: [
      { title: "Scope", text: "Catalog size, currencies, shipping regions and any marketplace rules agreed first." },
      { title: "Design", text: "Product page and checkout flows approved before the build." },
      { title: "Build", text: "Storefront assembled, payment path wired, order states tested end to end." },
      { title: "Launch", text: "Test orders, handover and a support window for the first trading weeks." },
    ],
    capabilities: ["Next.js", "React", "Stripe-ready checkout", "PostgreSQL", "Subscription & kit logic", "Multi-vendor structure"],
    projects: [
      { slug: "novacart-ecommerce-os", title: "NovaCart Ecommerce OS", note: "Catalog, cart, checkout and orders in one system." },
      { slug: "glowbar-beauty-shop", title: "GlowBar Beauty Shop", note: "Lookbooks, kits and subscription-ready product cards." },
      { slug: "cartdrawer-shopping-cart", title: "CartDrawer Cart Module", note: "A cart drawer you can drop onto an existing site." },
    ],
    posts: [
      { slug: "ecommerce-product-page-design-practical-buying-guide", title: "Ecommerce Product Pages: A Practical Blueprint" },
      { slug: "shopify-expiring-offline-access-token-migration-2027", title: "Shopify Offline Access Token Migration: A 2027 Checklist" },
    ],
    siblings: [
      { href: "/web-development", label: "Web development" },
      { href: "/saas-development", label: "SaaS development" },
      { href: "/ui-ux-design", label: "UI/UX design" },
    ],
    faqs: [
      {
        q: "How much does an ecommerce site cost?",
        a: "Published starting points: a cart module from $360, a beauty or lifestyle shop from $870 and a full online store from $1,490. Subscriptions, wholesale and multi-vendor stores are quoted after scoping.",
      },
      {
        q: "Can you build a multi-vendor marketplace?",
        a: "Yes — vendor catalogs, split views and marketplace rules are part of our custom store work. The exact structure (commissions, payouts, moderation) is scoped before quoting because it drives the build significantly.",
      },
      {
        q: "Which payment providers do you support?",
        a: "Checkout is built payment-provider-ready — Stripe-style flows with webhook-friendly order states. The merchant account stays in your name; we never store raw card details.",
      },
      {
        q: "Can you move us off Shopify or WooCommerce?",
        a: "We can rebuild the storefront and migrate catalog structure. Whether migration or staying-put is right depends on what is actually painful — share the current store and we will give an honest answer.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    badge: "UI/UX design",
    title: "UI/UX Design — Product, Brand & Print-Ready Design",
    h1: "UI/UX design that makes products feel inevitable, not decorated.",
    description:
      "NovexaHub designs UI/UX for web and mobile, brand identity systems, posters, banners and product design. Scoped on WhatsApp or email.",
    keywords: [
      "UI UX design agency",
      "product design",
      "brand identity design",
      "web app design",
      "poster and banner design",
      "NovexaHub",
    ],
    hero: [
      "Good design work is invisible in the right way: screens that explain themselves, a brand system that survives contact with a real poster, product pages that answer before a customer asks.",
      "We design for web and mobile interfaces, brand identity, and the physical-adjacent work studios usually outsource — posters, banners, packaging direction and product shots — all in one visual language.",
    ],
    problems: [
      { title: "Screens that need a manual", text: "Flow-first design: users should reach the goal without a tooltip tour. We prototype and review on real frames before build." },
      { title: "A logo with no system behind it", text: "Identity work ships with usage rules — color, type, lockups, social kits — so the brand survives beyond the first launch." },
      { title: "Every channel looking like a different company", text: "Posters, banners, product art and UI screens share one visual language, so the campaign and the product match." },
      { title: "Design that dies at handoff", text: "Figma files with named styles and export-ready assets mean your developers actually build what was designed." },
    ],
    deliverables: [
      "Screen flows and prototypes for web or mobile",
      "Design tokens and a usable component style",
      "Brand identity: logo usage, palette, type, social kits",
      "Print-ready posters, banners and campaign sizes",
      "Handover files a developer can build from directly",
    ],
    process: [
      { title: "Listen", text: "Audience, competitors, words you love and words to avoid — before any pixels." },
      { title: "Direction", text: "A visual direction agreed first, so we refine one path instead of guessing ten." },
      { title: "Design", text: "Screens, system and collateral produced in reviewable stages." },
      { title: "Handover", text: "Organized source files, exports and usage notes — plus a revision round per scope." },
    ],
    capabilities: ["Figma", "Adobe", "Design tokens & systems", "Print-ready exports", "Web & mobile UI", "Brand identity systems"],
    projects: [
      { slug: "aurora-brand-identity", title: "Aurora Brand Identity", note: "Logo, color, type and social kits in one system." },
      { slug: "productform-design-system", title: "ProductForm Product Design", note: "Packaging direction and digital product UI." },
      { slug: "framelab-poster-banner-studio", title: "FrameLab Posters & Banners", note: "Print and digital campaign sizes in one language." },
    ],
    posts: [
      { slug: "ecommerce-product-page-design-practical-buying-guide", title: "Ecommerce Product Pages: A Practical Blueprint" },
    ],
    siblings: [
      { href: "/web-development", label: "Web development" },
      { href: "/mobile-app-development", label: "Mobile app development" },
      { href: "/ecommerce-development", label: "Ecommerce development" },
    ],
    faqs: [
      {
        q: "What does a UI/UX engagement include?",
        a: "Flows, screens, prototypes and a usable design system — typically starting from $540 for a web or app UI project. Posters start from $180, banners from $150 and full brand identity from $540 per our published catalog.",
      },
      {
        q: "Do you only design, or do you build too?",
        a: "Both. Design-only is fine — you get organized Figma files a developer can build from. But because we also engineer, our designs are made to be built, not admired.",
      },
      {
        q: "Can you restyle an existing product?",
        a: "Yes — a restyle keeps your working product and replaces the visual system. That is usually the fastest way to make a credible product look credible too.",
      },
      {
        q: "Do you do print work as well as screens?",
        a: "Yes: posters, banners, roll-ups, packaging direction and campaign sizes, exported print-ready with bleed. Print production itself stays with your printer.",
      },
    ],
  },
  {
    slug: "ai-chatbot-development",
    badge: "AI chatbots",
    title: "AI Chatbot Development — Branded Support & Lead Capture",
    h1: "AI chatbot development for support that answers and hands off properly.",
    description:
      "NovexaHub builds AI chatbots: branded support assistants, knowledge-grounded answers, lead capture and human handoff. Scoped on WhatsApp or email.",
    keywords: [
      "AI chatbot development",
      "custom chatbot",
      "AI support assistant",
      "lead capture chatbot",
      "chatbot for website",
      "NovexaHub",
    ],
    hero: [
      "A support chatbot fails two ways: it invents answers, or it traps users who need a human. Ours are built against a bounded knowledge scope with explicit handoff rules — answer what it knows, escalate what it does not.",
      "The widget is the visible part; the useful part is behind it: knowledge-ready prompts, lead capture, transcripts and admin notes your team can maintain.",
    ],
    problems: [
      { title: "A chatbot that hallucinates your pricing", text: "Answers are grounded in a defined knowledge scope — FAQs, policies, product facts — not the open internet." },
      { title: "Users trapped in a bot loop", text: "Explicit handoff rules route to a human with the transcript attached, before frustration turns into a lost lead." },
      { title: "Conversations that vanish", text: "Lead capture and transcript views mean every chat either resolves, becomes a lead or teaches you what to add next." },
      { title: "A widget that screams third-party", text: "The chat is branded to your site and tone of voice, so it reads like your team, not an embedded vendor." },
    ],
    deliverables: [
      "Branded chat widget for your site",
      "Knowledge-ready prompts from your real FAQs and policies",
      "Lead capture and routing to your inbox or CRM",
      "Human handoff flow with transcripts",
      "Admin prompt notes and an operations handover",
    ],
    process: [
      { title: "Collect", text: "We gather your real questions, policies and tone — the knowledge scope is the product." },
      { title: "Design", text: "Answer scope, refusal rules and handoff triggers agreed before build." },
      { title: "Build", text: "Widget, prompts, lead capture and transcripts assembled and tested." },
      { title: "Tune", text: "Real transcripts show what to add; we hand over the notes to keep tuning." },
    ],
    capabilities: ["OpenAI", "Claude", "Knowledge-grounded prompts", "Webhooks", "Lead capture forms", "Transcript & admin views"],
    projects: [
      { slug: "whisper-ai-support-agent", title: "Whisper AI Support Agent", note: "Answers, routes and captures leads with human handoff." },
      { slug: "pulsechat-live-chat", title: "PulseChat Live Chat", note: "Threads, tickets and a support-ready chat UI." },
    ],
    posts: [
      { slug: "ai-automation-software-projects-for-growing-businesses", title: "AI Automation Software Projects for Growing Businesses" },
    ],
    siblings: [
      { href: "/ai-automation", label: "AI automation" },
      { href: "/custom-software-development", label: "Custom software" },
      { href: "/web-development", label: "Web development" },
    ],
    faqs: [
      {
        q: "How much does a custom chatbot cost?",
        a: "A branded AI support agent starts from $990 in our published catalog, and a chat feature module from $190. Custom bot logic is quoted after we see the knowledge scope.",
      },
      {
        q: "Will the bot make things up?",
        a: "It answers within a bounded knowledge scope built from your real FAQs, policies and product facts, and escalates outside it. Grounding and handoff rules are part of the build, not an upgrade.",
      },
      {
        q: "Where do captured leads go?",
        a: "Wherever you work: email, WhatsApp or a webhook into your CRM. Routing is configured per the scope and documented at handover.",
      },
      {
        q: "Can it live on an existing website?",
        a: "Yes. The widget embeds on an existing site, and the prompt layer is independent of your CMS. Share the site and we will confirm fit before quoting.",
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
