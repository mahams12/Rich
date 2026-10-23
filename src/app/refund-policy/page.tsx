import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalList, LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "How cancellations and refunds work for NovexaHub digital services and products — before work starts, mid-project, after delivery, and for ready-made digital products.",
  alternates: { canonical: `${site.url}/refund-policy` },
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "What This Policy Covers",
    body: (
      <>
        <p>
          NovexaHub sells digital services and digital products only — websites, apps, ecommerce builds, AI
          automations, design work, feature modules, ready-made digital products and academic kits. There is no
          physical shipping and no “return” of goods in the traditional sense, so this policy explains how
          cancellations and refunds work for digital work.
        </p>
        <p>
          Because every order is scoped and quoted individually on WhatsApp or email, the written scope you approve is
          the baseline for judging what has been delivered and what may be refundable.
        </p>
      </>
    ),
  },
  {
    id: "how-payments-work",
    title: "How Payments Work",
    body: (
      <LegalList
        items={[
          "Nothing is charged on this website. After you approve a written scope, we issue an invoice or payment link for the agreed advance or milestone.",
          "Online payments are processed by third-party providers (such as PayFast) on their secure pages; approved refunds are sent back through the original payment method where the processor allows it.",
          "Payment processor fees, bank charges or currency-conversion differences may be non-recoverable; where a fee is not returned to us by the processor, it may be deducted from a refund.",
        ]}
      />
    ),
  },
  {
    id: "cancel-before-start",
    title: "Cancelling Before Work Starts",
    body: (
      <p>
        You may cancel an order any time before work begins — meaning before we have started design, development,
        research or setup for your project. In that case we refund the advance (first instalment) you paid, less any
        non-recoverable payment-processing fees. Tell us on WhatsApp or email with your order reference and we will
        confirm promptly.
      </p>
    ),
  },
  {
    id: "cancel-in-progress",
    title: "Cancelling Mid-Project",
    body: (
      <>
        <p>If you cancel after work has started:</p>
        <LegalList
          items={[
            "Work already completed — including time spent on research, design, development and revisions — is billable and is not refunded.",
            "Amounts you paid for milestones not yet started are refunded.",
            "We hand over the completed portion of work corresponding to what you have paid for.",
            "Where possible, we will show you a simple breakdown of completed vs. unstarted work before settling the refund.",
          ]}
        />
        <p>
          If we have to cancel your order (for example, because we can no longer deliver the agreed scope), we refund
          everything you paid for work we did not deliver — including the advance if nothing was delivered.
        </p>
      </>
    ),
  },
  {
    id: "after-delivery",
    title: "After Delivery — Digital Goods",
    body: (
      <>
        <p>
          Digital deliverables cannot be “returned”. A milestone is treated as delivered once you approve it in
          writing or the acceptance window in your scope passes — as described in the Service Delivery Policy. Once
          files, source code, design exports, documentation or access credentials have been delivered, or the build
          has been deployed or handed over, the order is considered fulfilled and delivered milestones are
          non-refundable.
        </p>
        <p>This applies especially to:</p>
        <LegalList
          items={[
            "Ready-made digital products once source files, archives or access have been delivered.",
            "Delivered design exports (posters, banners, UI kits, brand assets).",
            "Deployed or handed-over websites, apps, dashboards and feature modules.",
            "Downloaded or delivered documentation, kits and academic materials.",
          ]}
        />
      </>
    ),
  },
  {
    id: "eligible",
    title: "When a Refund Is Granted",
    body: (
      <>
        <p>We will refund, in part or in full, where:</p>
        <LegalList
          items={[
            "We fail to deliver the agreed scope and cannot resolve it within a reasonable extension you allow us.",
            "You were charged twice or paid the wrong amount by mistake — the excess is refunded in full.",
            "Work never started and you cancel, as described above.",
            "A technical fault on our side made delivery impossible and we cannot reasonably complete it.",
          ]}
        />
        <p>Refunds are generally not available where:</p>
        <LegalList
          items={[
            "You change your mind after approving a milestone or after delivery.",
            "Delays were caused by missing content, approvals or inputs we requested from you.",
            "A third-party platform (app store, host, gateway, API) rejects, suspends or changes terms outside our control.",
            "The deliverable matches the approved scope but you later decide you want a different direction.",
            "Academic outcomes you expected were not achieved — see our Terms for the academic-integrity clause.",
          ]}
        />
      </>
    ),
  },
  {
    id: "how-to-request",
    title: "How to Request a Refund",
    body: (
      <LegalList
        items={[
          `Email ${site.email} or message WhatsApp ${site.whatsappDisplay} with the subject “Refund request”.`,
          "Include your name, the contact channel you used, the order/project reference and the payment date or transaction ID.",
          "Tell us briefly what went wrong — it helps us resolve it faster.",
          "We aim to acknowledge refund requests within 3 business days and will reply with a decision and next steps after review; where approved, we process the refund through the original payment method, subject to the processor’s timelines.",
        ]}
      />
    ),
  },
  {
    id: "chargebacks",
    title: "Before You File a Chargeback",
    body: (
      <p>
        Please contact us before disputing a payment with your bank or payment provider. Chargebacks on work that was
        delivered as scoped can delay resolution for everyone and may be contested with the delivery records,
        approvals and communication trail from your project. A direct refund request is almost always faster.
      </p>
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
        <Link href="/delivery-policy" className="text-[#c45c3a] underline underline-offset-2">
          Service Delivery Policy
        </Link>
        , which explain how digital orders are scoped, delivered and accepted.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>Refund requests, cancellation questions or payment issues:</p>
        <LegalContact />
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal · NovexaHub"
      title="Refund & Cancellation Policy"
      intro="How cancellations and refunds work for NovexaHub digital services and products — before work starts, mid-project and after delivery."
      updated="October 22, 2026"
      sections={sections}
    />
  );
}
