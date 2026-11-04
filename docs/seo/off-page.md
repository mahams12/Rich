# Off-Page & International Readiness

## 1. International strategy

- **One global English site.** `areaServed: "Worldwide"` in Organization/Service schema reflects reality: delivery is remote via WhatsApp/email.
- **Do not create USA/UK/Canada/Australia/Germany/UAE/Saudi variants** until genuinely differentiated local proof exists (local case studies, local pricing, local delivery terms). The two Pakistan-focused posts exist because the studio is based in Lahore and the pricing data is real — that is the honest pattern to copy, not a template for spinning city pages.
- If Search Console later shows concentrated demand from one market, revisit with real evidence first.

## 2. Directory profile copy (draft — owner submits, no accounts created by agent)

**Clutch / GoodFirms / DesignRush — short description (draft):**
> NovexaHub is a digital studio building custom websites, mobile apps (Flutter, iOS, Android), ecommerce stores, SaaS MVPs, AI automation and chatbots, and UI/UX design. The studio sells ready-made digital products from a public portfolio alongside fully custom engagements. Scoping, pricing and timing are agreed directly over WhatsApp or email — no checkout maze. NovexaHub is a small founder-led team based in Lahore, Pakistan, working with clients worldwide.

**Profile facts that are safe to claim:** services listed on /services; published starting prices from the service catalog; portfolio items actually visible at /portfolio; founders named on /our-team.
**Do not claim:** client counts, revenue, years in business, ratings, awards, named clients, or “top agency” badges until real and verifiable.

## 3. Review acquisition (ethical)

- Use the existing signed-in review flow on project pages — ask real customers post-delivery.
- Seed/sample testimonials are currently hidden from display; only publish quotes that can be attributed to a real person with permission.
- Never incentivize reviews, never post on behalf of clients, never import reviews from elsewhere.

## 4. Outreach/backlink checklist (manual, ethical)

Targets — pick for relevance, not metric-chasing:

- [ ] Founder portfolios already linked in Organization schema `sameAs` — keep consistent bios that link back to novexahub.live.
- [ ] Developer/design communities where the founders already participate (share posts only where self-promotion is allowed).
- [ ] Guest articles on small business/software blogs — pitch from `content-clusters.md` briefs, not spun copies.
- [ ] Vendor/tool directories that accept free listings (Flutter community directories, Next.js showcases like the Vercel gallery if eligible, Figma community for the design system work).
- [ ] Local startup/ecosystem directories for Lahore/Pakistan tech (real location, real business — legitimate).
- [ ] Supplier/partner pages where an actual relationship exists.

**Never:** paid bulk links, PBNs, comment/forum spam, link exchanges-at-scale, automated directory submitters, or fake-review profiles.

## 5. Analytics/conversion state

- Meta Pixel fires `PageView` (existing) and `Lead` on confirmed contact-form submit (existing).
- This branch adds `Contact` standard event on WhatsApp + email clicks (fab, footer, all `ContactActions`).
- No consent banner exists; the pixel loads for all visitors as before — flagging for owner review against their privacy obligations (Privacy Policy covers tracking).
- GA4/Search Console verification env vars exist (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`); owner to supply.

## 6. Remaining owner-gated items

1. Google Search Console + Bing Webmaster verification → submit sitemap.xml → validate keyword hypotheses in `keyword-map.md`.
2. Confirm Firestore `projects` collection contains all published slugs referenced by sitemap and service pages.
3. Replace `sample` seed reviews with attributable quotes or leave hidden.
4. Create/verify Clutch & GoodFirms profiles using the draft copy above.
5. Optional: `noindex` on `/blog/submit`.
