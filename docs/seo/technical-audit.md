# NovexaHub SEO Technical Audit

Date: 2026-11-03 · Branch: `seo/worldwide-strategy` · Scope: worldwide English SEO program, Phases 1–5.

## 1. Route inventory (public, indexable)

| Route | Type | Title | Canonical | Notes |
|---|---|---|---|---|
| `/` | Static shell + dynamic catalog | NovexaHub \| Buy Ready-Made Digital Products & Custom Software | `https://novexahub.live` | FAQPage JSON-LD |
| `/portfolio` | `force-dynamic` | Portfolio | `/portfolio` | SSR catalog via Firestore REST |
| `/projects/[slug]` | `force-dynamic` + static params | `{title} — {subcategory}` | `/projects/{slug}` | CreativeWork + BreadcrumbList |
| `/blog` | `force-dynamic` | Blog — Software Projects, Apps & NovexaHub Insights | `/blog` | |
| `/blog/[slug]` | `force-dynamic` + static params | `seoTitle \|\| {title} \| NovexaHub Blog` | `/blog/{slug}` | BlogPosting JSON-LD |
| `/blog/submit` | client | (uses root title) | — | UGC form; left indexable |
| `/services` | static | All Digital Services | `/services` | ItemList JSON-LD |
| `/web-development` | static | Web Development Company — Custom Websites & Web Apps | `/web-development` | NEW |
| `/mobile-app-development` | static | Mobile App Development Company — Flutter, iOS & Android | `/mobile-app-development` | NEW |
| `/custom-software-development` | static | Custom Software Development Company | `/custom-software-development` | NEW |
| `/ai-automation` | static | AI Automation Agency — Workflows & BPA | `/ai-automation` | NEW |
| `/ai-chatbot-development` | static | AI Chatbot Development — Support & Lead Capture | `/ai-chatbot-development` | NEW |
| `/saas-development` | static | SaaS Development Company — MVP to Product | `/saas-development` | NEW |
| `/ecommerce-development` | static | Ecommerce Development Company — Stores & Marketplaces | `/ecommerce-development` | NEW |
| `/ui-ux-design` | static | UI/UX Design — Product, Brand & Print-Ready | `/ui-ux-design` | NEW |
| `/features` | static | Feature modules — Cart, Chat, Reels, Payments, Pages | `/features` | |
| `/explore` | client | Explore Digital Products | `/explore` | Search/filter UI; canonical set |
| `/builder` | static | Solution Builder | `/builder` | |
| `/about`, `/our-team`, `/reviews`, `/contact` | static | unique | each canonical | |
| `/privacy-policy`, `/terms`, `/refund-policy`, `/delivery-policy` | static | unique | each canonical | |

**Blocked in robots.txt** (intentional): `/admin`, `/api`, `/auth`, `/checkout`, `/dashboard`, `/favourites`, `/login`, `/register`, `/notifications`.

**Excluded from sitemap**: all blocked routes + `/blog/submit`, `/checkout/success`. Sitemap = 23 static routes (incl. the 8 new service pages) + published posts + published projects, all canonical and indexable.

## 2. Findings & fixes applied in this branch

### F1 — Homepage/portfolio project-count inconsistency (FIXED)
- **Cause**: `HomeView` read `useApp().projects`, which is `[]` during SSR and first paint (the stub provider returns an empty catalog whenever Firebase is configured). SSR HTML therefore rendered “0 published projects” and `ProjectFan` returned `null` until the client snapshot arrived. `/portfolio` was unaffected because it server-fetches the catalog.
- **Fix**: `src/app/page.tsx` now calls `fetchCatalogServer()` (same verified source as portfolio/blog pages) and passes `initialProjects` to `HomeView`; `HomeView` merges it with the live store exactly like `PortfolioView` and feeds the published list to `ProjectFan`. If the REST fetch fails, bundled seed projects are the SSR fallback so the homepage never renders a false “0”. The bottom CTA omits the count entirely when the catalog is empty rather than printing “0”.
- **Source of truth**: Firestore `projects` collection via `fetchCatalogServer` → live snapshot reconciles client-side.

### F2 — Unsupported testimonials (FIXED)
- The 8 seed reviews in `src/data/content.ts` presented invented personas (e.g. “Founder, GlowBar” — GlowBar is the studio’s own catalog product). `ProjectDetailView` additionally injected two unrelated reviews onto every project page.
- **Fix**: all seed reviews flagged `sample: true`; homepage, `/reviews` and project detail now filter out `sample` items and show an honest empty state. Live user-submitted reviews (created with `sample: false` in `AppProviderLive`) still display. Data retained so real, attributable quotes can replace them.

### F3 — Dead internal links in blog CTAs (FIXED)
- Several posts ended with bare `https://novexahub.live/...` URLs that rendered as plain text (the renderer only linked `[text](url)` and only for `https?://` targets).
- **Fix**: `renderInlineLinks` now supports internal `/path` links rendered via `next/link`. Bare external URLs to our own pages converted to internal markdown links across 14 posts; contextual service-page links added at natural anchor points.

### F4 — robots.txt (IMPROVED)
- Added `/api` and `/auth` to disallow (image proxy + OAuth callback should never be indexed). All revenue/content routes remain crawlable.

### F5 — Structured data (IMPROVED)
- Added `BreadcrumbList` to `/projects/[slug]`; `Service` + `BreadcrumbList` + `FAQPage` on each service page; provider references the existing `#organization` node. No review/rating schema added anywhere — honest.

### F6 — Analytics (ADDED, existing pixel only)
- `fbq Contact` standard event on WhatsApp + email clicks (`ContactActions`, footer link, `WhatsAppFab`). Form submissions already fire `Lead` on confirmed submit in `ContactView`. No new trackers; same consent surface as the existing pixel.

### F7 — Internal linking (IMPROVED)
- New “Core services” footer column, service-page chip links on `/services`, homepage carousel cards now point at the dedicated pages, project pages link category → matching service page, service pages link to sibling services + verified projects + related posts.

## 3. Verified facts used on new pages

- Stack: Next.js, React, TypeScript, Tailwind, Node.js, PostgreSQL, Flutter, Firebase, Supabase, Docker, GSAP, Figma/Adobe, OpenAI, Claude, Make/Zapier-ready, WebRTC-ready, Stripe-ready — all already published in `techStack`/`aiStudio`/project `technologies`.
- Prices: only the `from` values already published in `serviceCatalog` (e.g. business site from $490, full store from $1,490, AI agent from $990). No new prices invented.
- Projects linked on service pages are existing published slugs in `src/data/projects.ts`.
- **Case-study candidates:** FinBotics and the real-estate platform DO exist — as live Firestore projects (`finbotics-ai-personal-finance-tax-assistant`, `real-estate-property-listing-management-platform`), not in the repo. TripsAdora, SafeApp and Nozama AI remain unverified (not in repo, git history or the live catalog) — nothing was written about them. Seed descriptions for NovaCart, Whisper, PulseFit and EstateVue were expanded using only fields already present in each entry. NOTE: novacart and estatevue are remote-deleted in the live catalog and no longer resolve publicly.

## 4. Known limitations / owner actions

- **Firestore vs seeds — RESOLVED in this round**: `splitCatalogDocs` now merges remote docs + bundled seeds (remote wins by id; `deleted:true` docs suppress their seed twin). Live listener and server fetch produce one identical catalog, consumed by sitemap, `generateStaticParams`, `generateMetadata`, JSON-LD and all views. Unknown, remote-deleted and non-`published` slugs return a real 404 via `notFound()`; metadata for missing slugs emits `noindex`. Verified live: 11 remote-published + ~21 surviving seed projects; service pages link only live-published slugs.
- **Reviews**: seed testimonials hidden until replaced by attributable ones; consider collecting real reviews via the existing signed-in review flow.
- **www/legacy**: `www`, `novexahub.net`, `www.novexahub.net` 301 → apex in middleware (already correct pre-branch).
- **Search Console / Bing**: verification meta wired via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION` env — owner must supply values + submit `sitemap.xml`, review Coverage/Page-Indexing, and validate the keyword hypotheses in `keyword-map.md` against real query data.
- **`/blog/submit`** now emits `noindex,follow` metadata — crawlable but kept out of the index.
- **FAQ rich results**: FAQPage schema REMOVED (homepage + service pages) following Google's May 2026 discontinuation of FAQ rich results. The visible FAQ content stays. Remaining JSON-LD: Organization, WebSite+SearchAction, ProfessionalService, Service, BreadcrumbList, BlogPosting, CreativeWork, ItemList — all match visible page content.
- **`dynamic = "force-dynamic"` + `generateStaticParams`** coexist on blog/project routes — pre-existing pattern, works with the Firestore-refresh model; left unchanged.

## 5. Validation

See PR description for exact `eslint`, `tsc --noEmit` and `next build` output. Commands:

```bash
npm run lint
npx tsc --noEmit
npm run build        # next build --webpack (OpenNext/Cloudflare target)
```

### Second-round additions
- Homepage repositioned: title/H1/copy now lead with “software development company / worldwide digital studio” while keeping the ready-made marketplace.
- `/graphic-design` and `/video-editing` service pages added (framelab/aurora product links replaced with live-published work: adlume, storygrid, glowbar, cuthouse, reels).
- Service-page project links audited against the live merged catalog — all now resolve.
- Meta events: `Lead` fires once per confirmed form submit; `Contact` fires once per WhatsApp/email click (handlers verified — no StrictMode/duplicate paths).

### Fourth-round additions
- `WebSite` JSON-LD: removed retired `SearchAction` (Google deprecated the sitelinks search box); Organization/ProfessionalService/WebSite/Service/BreadcrumbList/BlogPosting/CreativeWork/ItemList remain and all match visible content.
- `/services` ItemList schema now links each offering to its dedicated service page (category → page map), improving crawl paths and entity clarity.
- Sitemap `lastModified` no longer falls back to `Date.now()` — dates are emitted only when a real timestamp exists (avoids false freshness signals).
- Blog deletion tombstones now suppress bundled twins (mergePosts keeps deleted docs; getBlogPostsWithFallback suppresses by id+slug and filters output); drafts get noindex + real 404s.
- Meta `Contact` fires on all WhatsApp/email entry points (fab, footer, ContactActions, ContactView direct lines); `Lead` single-fires per confirmed submit — rapid submissions are client-guarded.
- Remaining audit notes: OG image /brand/hero-studio.jpg exists; canonicals verified unique on all indexable routes; /blog/submit is noindex; /auth,/api,/checkout,/dashboard,/favourites,/login,/register,/notifications disallowed; middleware 301s www+legacy to apex.
