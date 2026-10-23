import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalList, LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using novexahub.live and ordering NovexaHub digital services — quotes, payment, delivery, revisions, intellectual property and cancellations.",
  alternates: { canonical: `${site.url}/terms` },
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About These Terms",
    body: (
      <>
        <p>
          These Terms &amp; Conditions (“Terms”) govern your use of{" "}
          <a href={site.url} className="text-[#c45c3a] underline underline-offset-2">
            {site.url}
          </a>{" "}
          and any digital products or services you order from NovexaHub (“NovexaHub”, “we”, “us”, “our”). By browsing
          the website, sending an enquiry, approving a quote or making a payment, you agree to these Terms.
        </p>
        <p>
          If you are ordering on behalf of a company or another person, you confirm you are authorized to accept these
          Terms for them. If you do not agree, please do not use the website or order our services.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "Our Services",
    body: (
      <>
        <p>
          NovexaHub is a digital studio. We design and build digital products and services only — nothing physical is
          sold or shipped. Our services include, among others:
        </p>
        <LegalList
          items={[
            "Websites of any category — business sites, landing pages, portals, ecommerce stores and custom builds.",
            "Mobile and web applications, dashboards, portals and custom software features.",
            "AI automations, assistants, workflow and social-posting systems.",
            "UI/UX, brand identity, posters, banners, product design, ads and video editing.",
            "Individual feature modules — cart, checkout, payments, chat, calling, authentication and more.",
            "Ready-made digital products shown in our portfolio, delivered as-is or customized.",
            "Academic kits — final-year prototypes, documentation structure and writing assistance.",
          ]}
        />
        <p>
          The website is a catalogue and enquiry channel. Nothing is charged on the site itself — every order is
          scoped, quoted and confirmed directly with you on WhatsApp or email before work begins.
        </p>
      </>
    ),
  },
  {
    id: "quotes",
    title: "Enquiries, Quotes & Scope",
    body: (
      <>
        <LegalList
          items={[
            "Send us the project, service or feature you want through WhatsApp, email or the contact form.",
            "We reply with a written scope: what is included, the delivery window, the price and the payment schedule.",
            "An order is confirmed only when you approve the written scope and pay the agreed advance (first instalment).",
            "Anything not written into the scope is not included — extra work is quoted separately before we start it.",
            "Prices shown on the website are starting estimates; your confirmed quote is what applies to your order.",
          ]}
        />
        <p>
          A quote is valid for the period stated in it. If no period is stated, treat it as valid for 14 days — after
          that we may re-quote to reflect availability or changed requirements.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "Pricing & Payment Terms",
    body: (
      <>
        <LegalList
          items={[
            "Work typically begins after an agreed advance payment; the balance is due on agreed milestones or before final handover, as written in your scope.",
            "Invoices and payment links are shared directly. Online payments are processed by third-party providers (such as PayFast) on their own secure pages — we never ask for or store your card details.",
            "You are responsible for paying through the channel and reference we give you. Keep your payment receipt or transaction ID.",
            "Fees charged by banks, wallets or payment processors are borne by the client unless we agree otherwise in writing.",
            "If a milestone payment is late, we may pause work until it is settled; paused time extends the delivery window.",
            "All prices are quoted and payable in the currency stated in your invoice.",
          ]}
        />
        <p>
          For cancellations and refunds, see our{" "}
          <Link href="/refund-policy" className="text-[#c45c3a] underline underline-offset-2">
            Refund Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "client-responsibilities",
    title: "Your Responsibilities",
    body: (
      <LegalList
        items={[
          "Provide accurate requirements, brand assets, content, logins and approvals when we ask for them.",
          "Review deliveries and send consolidated feedback within the acceptance window we agree.",
          "Make sure you own or are licensed to use every asset, text, image, logo or piece of content you give us.",
          "Keep your contact channel reachable — delays in replies or inputs move the delivery date.",
          "Use deliverables lawfully and, for academic kits, follow your institution’s rules on originality and authorship.",
        ]}
      />
    ),
  },
  {
    id: "revisions",
    title: "Revisions & Changes",
    body: (
      <>
        <p>
          Each scope includes the revision rounds and the acceptance window written into it. A revision means a
          reasonable adjustment to the agreed scope — not a new feature, a redesign, or a change of direction.
        </p>
        <LegalList
          items={[
            "Requests beyond the agreed scope or revision rounds are quoted as a change request before we start them.",
            "Once you approve a milestone or final delivery in writing — or the acceptance window passes — later changes are treated as new work.",
            "Urgent timelines can usually be arranged and may carry a rush fee, agreed in advance.",
          ]}
        />
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery & Acceptance",
    body: (
      <p>
        Deliveries are digital: preview links, deployed builds, source files, design exports, documentation or access
        credentials, as listed in your scope. Delivery windows start from the date we receive your first payment{" "}
        <em>and</em> the inputs we need from you. Full details are in our{" "}
        <Link href="/delivery-policy" className="text-[#c45c3a] underline underline-offset-2">
          Service Delivery Policy
        </Link>
        .
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    body: (
      <>
        <LegalList
          items={[
            "Your materials stay yours. You guarantee you have the rights to whatever you send us.",
            "Once your order is paid in full, the final deliverables made for you are yours to use for your business.",
            "Until full payment is received, deliverables remain licensed for review only and may not be used commercially or redistributed.",
            "We may reuse our own pre-existing tools, code libraries, frameworks and know-how inside your project; those remain ours or their licensors’, licensed to you as part of the deliverable.",
            "Unless we agree otherwise in writing, we may show finished work in our portfolio and marketing.",
            "Ready-made products may be sold to more than one client unless your scope says the build is exclusive.",
          ]}
        />
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    body: (
      <p>
        Many projects depend on services we do not control — hosting, domains, app stores, payment gateways, APIs,
        Firebase, Cloudflare, Google, Meta or WhatsApp. Their fees, approval decisions, outages, policy changes or
        account actions are outside our control and outside our refund responsibility. Where a third-party account is
        needed (hosting, store, gateway), you are responsible for keeping it in good standing unless your scope says
        we manage it.
      </p>
    ),
  },
  {
    id: "academic",
    title: "Academic Kits",
    body: (
      <p>
        Final-year and assignment deliverables are provided as study aids: prototypes, structure, documentation
        guidance and writing support. You remain responsible for how you use them, for the originality of what you
        submit, and for following your institution’s academic-integrity rules. NovexaHub does not guarantee grades or
        outcomes.
      </p>
    ),
  },
  {
    id: "warranties",
    title: "Warranties & Liability",
    body: (
      <>
        <p>
          We warrant that deliverables will substantially match the approved scope, and we will fix defects reported
          within the agreed acceptance window at no extra cost. Beyond that, services are provided “as is” — we do not
          warrant uninterrupted operation of third-party platforms, specific business results, rankings, revenue or
          grades.
        </p>
        <p>
          To the extent permitted by law, NovexaHub’s total liability for an order is limited to the amount you
          actually paid for that order. We are not liable for indirect or consequential losses such as lost profit,
          lost data or lost opportunity.
        </p>
      </>
    ),
  },
  {
    id: "site-use",
    title: "Using This Website",
    body: (
      <LegalList
        items={[
          "Do not misuse the website: no scraping at scale, no probing for vulnerabilities, no interfering with other users or our systems.",
          "Accounts are personal — keep your login details confidential and tell us if you suspect unauthorized access.",
          "Website content (text, visuals, branding, project cards) is owned by or licensed to NovexaHub; do not copy it without permission.",
          "We may suspend access where we reasonably believe the website or services are being abused.",
        ]}
      />
    ),
  },
  {
    id: "disputes",
    title: "Governing Law & Disputes",
    body: (
      <p>
        If something goes wrong, talk to us first — most issues are solved fastest on WhatsApp or email. These Terms
        and any dispute arising from them are governed by the laws of Pakistan. You agree to attempt good-faith
        negotiation before formal proceedings; where a dispute cannot be resolved informally, it may be brought
        before the courts of Lahore, Pakistan.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    body: (
      <p>
        We may update these Terms as the studio and its services evolve. The current version is always on this page
        with its “Last updated” date. Orders already in progress stay under the version in force when the order was
        confirmed, unless a change is required by law.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>Questions about these Terms, an order or a quote? Reach the studio directly:</p>
        <LegalContact />
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal · NovexaHub"
      title="Terms & Conditions"
      intro="The terms that govern your use of novexahub.live and every digital service or product you order from NovexaHub."
      updated="October 22, 2026"
      sections={sections}
    />
  );
}
