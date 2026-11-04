# Blog Content Clusters, Editorial Backlog & Internal-Linking Plan

## 1. Existing posts → cluster map

| Post (slug) | Cluster | Money page it feeds | Links added in this branch |
|---|---|---|---|
| how-to-choose-a-software-project-partner-novexahub | Hiring/partner | `/services`, `/portfolio` | yes (portfolio, services) |
| ready-made-websites-vs-custom-software-projects | Web + custom software | `/web-development`, `/custom-software-development` | yes |
| mobile-app-and-flutter-software-projects-for-startups | Mobile | `/mobile-app-development` | yes |
| mobile-app-development-partner-checklist-2026 | Mobile | `/mobile-app-development` | yes |
| final-year-software-project-ideas-and-studio-support | Academic | `/portfolio` | yes (portfolio) |
| ai-automation-software-projects-for-growing-businesses | AI automation | `/ai-automation` | yes (websites, custom software, automation) |
| what-is-novexahub-digital-studio-explained | Brand | `/services`, `/portfolio` | yes |
| business-website-checklist-2026 | Web | `/web-development`, `/ecommerce-development`, `/mobile-app-development`, `/custom-software-development` | yes |
| how-to-plan-software-integrations-before-development | Custom software | `/custom-software-development`, `/ecommerce-development`, `/saas-development` | yes |
| ecommerce-product-page-design-practical-buying-guide | Ecommerce + UI/UX | `/ecommerce-development`, `/web-development` | yes |
| shopify-expiring-offline-access-token-migration-2027 | Ecommerce/integrations | `/ecommerce-development` | yes |
| website-development-cost-in-pakistan | Web (regional interest, global-relevant pricing guidance) | `/web-development` | yes |
| how-to-scope-a-saas-mvp-before-development | SaaS | `/saas-development` | yes |
| ecommerce-website-development-pakistan (content string) | Ecommerce | `/ecommerce-development`, `/projects/novacart-ecommerce-os` | yes (project + service links) |

No posts required consolidation: each covers a distinct intent. Overlap watch — the two mobile posts serve different intents (startup MVP planning vs partner selection), keep both.

## 2. Editorial backlog — 14 reviewed briefs (draft, do not mass-publish)

Publish cadence suggestion: 1–2/week max, human-reviewed. Every brief must pass: original angle, no invented stats/quotes/clients, cites only verifiable external sources, ends with one contextual link to its cluster service page.

### Web development cluster → `/web-development`
1. **“Website Redesign vs Rebuild: How to Decide”** — decision framework using cost, SEO-equity and platform-limit criteria. Links: business-website-checklist-2026.
2. **“Core Web Vitals on a Marketing Site: What Actually Moves the Needle”** — image strategy, fonts, third-party scripts; reference PageSpeed docs.
3. **“What a Website Handover Should Include”** — ownership, docs, accounts checklist (mirrors our own handover promises).

### Mobile cluster → `/mobile-app-development`
4. **“Flutter vs Native in 2026: When One Codebase Wins and When It Doesn’t”** — honest trade-offs, no Flutter evangelism.
5. **“App Store + Play Store Launch Checklist”** — accounts, assets, review timelines; complements partner-checklist post.

### Custom software cluster → `/custom-software-development`
6. **“Spreadsheet to System: Signals Your Process Needs Real Software”** — qualification criteria before a build.
7. **“Build vs Buy vs Extend: A Framework for Business Software Decisions”** — bridges ready-made/custom post.

### AI automation cluster → `/ai-automation` + `/ai-chatbot-development`
8. **“Which Business Processes Are Safe to Automate with AI?”** — risk tiers, human-review patterns.
9. **“Grounding a Support Chatbot: Knowledge Scope, Refusals and Handoffs”** — mirrors how Whisper is actually built.

### SaaS cluster → `/saas-development`
10. **“SaaS Pricing Page UX: Presenting Plans Without Dark Patterns”** — honest-pricing UX guidance.
11. **“Multi-Tenant Basics for First-Time SaaS Founders”** — data isolation options at MVP stage.

### Ecommerce cluster → `/ecommerce-development`
12. **“Marketplace vs Single-Brand Store: Architecture Differences That Matter”** — vendor models, payouts, moderation.
13. **“Checkout Analytics: Reading Drop-Off Without Over-Tracking”** — privacy-aware measurement.

### UI/UX cluster → `/ui-ux-design`
14. **“Design Tokens: The Smallest System That Keeps a Brand Consistent”** — practical intro, Figma-linked.

## 3. Internal-linking rules (applied + standing)

- Blog posts link **out** to exactly one primary service page (their cluster’s) + portfolio/contact where natural; service pages link **back** to their cluster posts (“Keep reading” section).
- Project pages link category → service page (in sidebar, labelled ready-made vs custom build).
- Footer carries all 8 service pages; `/services` chip-row links them; homepage carousel points at the four mapped ones.
- Anchor text describes the destination (“web development”, “NovaCart ecommerce project”) — never “click here”, never repeated exact-match stuffing.
- New posts must declare their cluster at briefing time; orphan posts are not published.

## 4. Phase-3 case-study note

Brief candidates re-verified against the live Firestore catalog: **FinBotics** (`finbotics-ai-personal-finance-tax-assistant`) and the **real-estate platform** (`real-estate-property-listing-management-platform`) DO exist as live-published projects — their pages now resolve from the merged catalog and appear in the sitemap. TripsAdora, SafeApp and Nozama AI remain unverified anywhere — nothing written about them. Seed descriptions for NovaCart, Whisper, PulseFit, EstateVue were expanded using only facts already in their entries (NovaCart and EstateVue are currently remote-deleted, so those slugs 404 until restored). All are labelled “Ready-made studio product” vs “Custom studio build” on their pages — demo/studio work is never presented as paid client engagements.
