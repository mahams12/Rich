import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalList, LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Service Delivery Policy",
  description:
    "How NovexaHub delivers digital services and products — delivery channels, timelines, milestones, acceptance and what your handover includes. No physical shipping applies.",
  alternates: { canonical: `${site.url}/delivery-policy` },
};

const sections: LegalSection[] = [
  {
    id: "digital-only",
    title: "Digital Delivery Only",
    body: (
      <>
        <p>
          NovexaHub sells software and digital services exclusively. <strong>No physical goods are sold or
          shipped</strong>, so there is no postal address to ship to, no courier and no shipping fee — this policy is
          our equivalent of a shipping policy, written for digital work.
        </p>
        <p>
          Everything you order is delivered electronically to the contact channel you used (WhatsApp or email) or to
          the destination agreed in your scope — a repository, a deployed URL, a cloud link or a file transfer.
        </p>
      </>
    ),
  },
  {
    id: "channels",
    title: "Delivery Channels",
    body: (
      <>
        <p>Depending on what you ordered, delivery happens through one or more of:</p>
        <LegalList
          items={[
            "Preview or staging links you can open in a browser while work is in progress.",
            "A deployed production URL on your hosting or ours, as agreed in the scope.",
            "Source-code handover via a Git repository or a compressed archive.",
            "Design exports — Figma/source files, PDFs, PNG/SVG assets, video files.",
            "Documentation — setup notes, credentials handover and usage guides.",
            "Direct file transfer through WhatsApp, email attachments or a shared drive link.",
          ]}
        />
      </>
    ),
  },
  {
    id: "timelines",
    title: "Delivery Timelines",
    body: (
      <>
        <LegalList
          items={[
            "The delivery window is written into your approved quote. Estimates shown on the services page (e.g. “5–10 days”) are typical ranges, not a guaranteed date.",
            "The clock starts when we have received both the first payment and the inputs we need from you — content, brand assets, logins or approvals.",
            "Milestone deliveries arrive progressively: you will see work-in-progress, not just a final drop at the end.",
            "If a timeline is at risk — from scope changes, delayed inputs or third-party dependencies — we tell you early with a revised estimate rather than going silent.",
          ]}
        />
      </>
    ),
  },
  {
    id: "milestones",
    title: "Milestones, Previews & Acceptance",
    body: (
      <LegalList
        items={[
          "Larger projects are split into milestones, each with its own preview, approval step and acceptance window.",
          "You accept a delivery by approving it in writing on WhatsApp or email, or by the acceptance window passing with the work matching the agreed scope.",
          "Issues reported inside the acceptance window that contradict the approved scope are fixed at no extra cost.",
          "Requests beyond the approved scope are welcome — they are quoted as new work before we start.",
        ]}
      />
    ),
  },
  {
    id: "what-you-get",
    title: "What a Handover Includes",
    body: (
      <>
        <p>A completed delivery typically includes, as written in your scope:</p>
        <LegalList
          items={[
            "The finished build, design files or agreed deliverables.",
            "Source files and editable assets where the scope includes them.",
            "Transfer of credentials, admin access or repository ownership where applicable.",
            "A short handover note: how to run, update or deploy what you received.",
            "A clear record of what was delivered, kept in the same thread you ordered through.",
          ]}
        />
      </>
    ),
  },
  {
    id: "your-side",
    title: "What Affects Delivery",
    body: (
      <p>
        Delivery dates assume timely inputs. Missing or late content, delayed approvals, inaccessible accounts or
        third-party holds (app-store review, payment-gateway verification, hosting or domain issues) extend the
        window. We will always tell you what we are waiting on — check the thread or ask us any time.
      </p>
    ),
  },
  {
    id: "problems",
    title: "If a Delivery Goes Wrong",
    body: (
      <LegalList
        items={[
          "A link or file that does not open? Tell us — we resend or repackage it at no cost.",
          "Delivered work does not match the approved scope? Report it inside the acceptance window and we fix it.",
          "We cannot deliver the agreed scope at all? See the Refund Policy — you are covered for undelivered work.",
        ]}
      />
    ),
  },
  {
    id: "related",
    title: "Related Policies",
    body: (
      <p>
        This policy works together with our{" "}
        <Link href="/terms" className="text-[#c45c3a] underline underline-offset-2">
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link href="/refund-policy" className="text-[#c45c3a] underline underline-offset-2">
          Refund &amp; Cancellation Policy
        </Link>
        .
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>Questions about a delivery in progress or a handover:</p>
        <LegalContact />
      </>
    ),
  },
];

export default function DeliveryPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal · NovexaHub"
      title="Service Delivery Policy"
      intro="How NovexaHub delivers digital services and products — channels, timelines, milestones, acceptance and handover. No physical shipping applies."
      updated="October 22, 2026"
      sections={sections}
    />
  );
}
