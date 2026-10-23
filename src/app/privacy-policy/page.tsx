import type { Metadata } from "next";
import { LegalContact, LegalList, LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How NovexaHub collects, uses, shares and protects personal information when you browse novexahub.live or enquire about our digital studio services.",
  alternates: { canonical: `${site.url}/privacy-policy` },
};

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <>
        <p>
          NovexaHub (“NovexaHub”, “we”, “us” or “our”) is a digital studio offering website development, software
          development, UI/UX, branding, digital products and related services through{" "}
          <a href={site.url} className="text-[#c45c3a] underline underline-offset-2">
            {site.url}
          </a>{" "}
          and associated channels.
        </p>
        <p>
          We respect your privacy and are committed to protecting personal information entrusted to us. This Privacy
          Policy describes how we collect, use, store, share and safeguard information when you browse our website,
          contact us, create an account, request services or otherwise interact with NovexaHub.
        </p>
        <p>
          By using our website or services, you acknowledge this policy. If you do not agree with these practices,
          please discontinue use and contact us with any questions.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <p>Depending on how you interact with NovexaHub, we may collect:</p>
        <p className="font-semibold text-[#16110e]">Information you provide</p>
        <LegalList
          items={[
            "Name, email address and message details submitted through contact forms or email.",
            "WhatsApp or other messaging details you choose to share when enquiring about a project.",
            "Account details used for client login or notifications, where you create or access an account.",
            "Project requirements, files, feedback and other materials you send while working with the studio.",
          ]}
        />
        <p className="font-semibold text-[#16110e]">Information collected automatically</p>
        <LegalList
          items={[
            "Technical data such as IP address, browser type, device type, operating system and approximate location derived from network data.",
            "Usage data such as pages viewed, referring URLs, timestamps and interaction patterns on our website.",
            "Cookie and similar technology data, as described below.",
          ]}
        />
        <p>
          We do not collect payment card details on this website. Project purchases and custom work are arranged
          through direct communication channels such as WhatsApp or email, and any online payment is completed on the
          payment provider’s own secure page.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    body: (
      <>
        <p>We use personal information for legitimate business purposes, including to:</p>
        <LegalList
          items={[
            "Operate, maintain and improve the NovexaHub website and studio services.",
            "Respond to enquiries, provide quotes, deliver projects and offer support.",
            "Create and manage client accounts or notification preferences where applicable.",
            "Send service-related communications about requests, deliveries or account activity.",
            "Process payments and keep the records required for accounting, tax and contractual obligations.",
            "Monitor performance, diagnose issues, prevent abuse and protect our systems and users.",
            "Understand how the website is used so we can improve content and experience.",
          ]}
        />
        <p>
          We process information where necessary to perform a contract, pursue legitimate interests that are not
          overridden by your rights, comply with law, or where you have provided consent (for example, optional
          marketing communications, where offered).
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>
          Cookies are small text files stored on your device when you visit a website. NovexaHub may use cookies and
          similar technologies to keep the site working reliably, remember preferences, maintain sessions, understand
          traffic patterns and improve performance.
        </p>
        <p>
          You can control or delete cookies through your browser settings. Blocking certain cookies may affect website
          features such as login sessions or personalization. Browser help pages typically explain how to manage
          cookie preferences for your device.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Analytics and Third-Party Services",
    body: (
      <>
        <p>
          NovexaHub relies on carefully selected third-party providers to host, operate, secure and improve our
          website and services. These may include infrastructure and hosting providers, analytics tools,
          authentication or database platforms, email delivery tools, messaging channels, payment processors and other
          operational service providers.
        </p>
        <p>
          Based on our current production setup, this may include providers such as Cloudflare (website hosting and
          delivery), Firebase / Google Cloud services (for example authentication, storage and analytics where
          enabled), payment processors such as PayFast where a payment link is shared with you, and communication
          channels such as email or WhatsApp that you choose to use when contacting us.
        </p>
        <p>
          Third-party providers may process information according to their own privacy policies and terms. We
          encourage you to review those policies. NovexaHub does not control every aspect of how independent providers
          handle data once it is shared with them for the purpose of delivering their services to us.
        </p>
      </>
    ),
  },
  {
    id: "information-sharing",
    title: "Information Sharing",
    body: (
      <>
        <p>
          NovexaHub does <strong>not sell</strong> your personal information. We may share information only as needed
          to operate our business and deliver services, including with:
        </p>
        <LegalList
          items={[
            "Service providers who help us run the website, communications, analytics or studio operations.",
            "Hosting and infrastructure providers that store or transmit website and application data.",
            "Payment processors where applicable for invoices or commercial transactions arranged outside or alongside the website.",
            "Professional advisers such as legal, accounting or security consultants where necessary.",
            "Authorities, courts or regulators when required by applicable law or to protect rights, safety and security.",
            "Business successors in connection with a merger, acquisition, financing, reorganization or sale of assets.",
          ]}
        />
        <p>
          Where we engage service providers, we expect them to use personal information only to perform services for
          NovexaHub and in accordance with applicable confidentiality and data-protection obligations.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data Security",
    body: (
      <>
        <p>
          We use reasonable technical and organizational measures designed to protect personal information against
          unauthorized access, alteration, disclosure or destruction. These measures may include access controls,
          encrypted transport (HTTPS), provider security features and internal handling practices appropriate to the
          nature of the data and our operations.
        </p>
        <p>
          No method of transmission or storage is completely secure. While we work to protect information, we cannot
          guarantee absolute security. Please use strong unique passwords for any accounts and notify us promptly if
          you suspect unauthorized access related to NovexaHub services.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    body: (
      <>
        <p>
          We retain personal information only for as long as reasonably necessary for the purposes described in this
          policy — including project delivery, client support, legitimate business records, contractual needs, legal
          or accounting requirements, dispute resolution and security.
        </p>
        <p>
          Retention periods vary depending on the type of information and the context in which it was collected. When
          information is no longer needed, we take steps to delete, anonymize or securely archive it in line with our
          operational practices and legal obligations.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights",
    body: (
      <>
        <p>
          Depending on the laws that apply to you (including where you live and how you interact with us), you may
          have rights to:
        </p>
        <LegalList
          items={[
            "Access personal information we hold about you.",
            "Request correction of inaccurate or incomplete information.",
            "Request deletion of personal information, subject to legal or contractual retention needs.",
            "Withdraw consent where processing is based on consent.",
            "Object to certain processing activities.",
            "Request information about how your data is processed.",
          ]}
        />
        <p>
          To exercise these rights, contact us using the details below. We may need to verify your identity before
          fulfilling a request. Some requests may be limited where law requires or permits us to retain information,
          or where fulfilling a request would adversely affect others.
        </p>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    title: "Children’s Privacy",
    body: (
      <>
        <p>
          NovexaHub’s website and studio services are not intentionally directed toward children, and we do not
          knowingly collect personal information from children where prohibited by applicable law.
        </p>
        <p>
          If you believe a child has provided personal information to NovexaHub in a manner that is not permitted,
          please contact us and we will take appropriate steps to review and, where required, delete the information.
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "External Links",
    body: (
      <p>
        Our website may contain links to third-party websites, tools, portfolios, social platforms or resources. Those
        sites are operated by independent parties. NovexaHub is not responsible for their content, security or privacy
        practices. We encourage you to read the privacy policy of every third-party site you visit.
      </p>
    ),
  },
  {
    id: "policy-changes",
    title: "Changes to This Privacy Policy",
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal
          requirements or business practices. When we make changes, we will revise the “Last updated” date at the top
          of this page.
        </p>
        <p>
          We encourage you to review this page periodically. Continued use of the website or services after an update
          constitutes acknowledgment of the revised policy, except where applicable law requires additional notice or
          consent.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "Contact Us",
    body: (
      <>
        <p>
          If you have questions about this Privacy Policy, our data practices or a privacy-related request, contact:
        </p>
        <LegalContact />
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal · NovexaHub"
      title="Privacy Policy"
      intro="Your privacy matters to us. This policy explains how NovexaHub collects, uses and protects your information."
      updated="October 22, 2026"
      sections={sections}
    />
  );
}
