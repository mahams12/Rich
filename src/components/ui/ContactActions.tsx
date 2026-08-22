"use client";

import { enquireMessage, openMailClient, whatsappUrl } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";

export function ContactActions({
  title,
  extra,
  className,
  stacked,
}: {
  title?: string;
  extra?: string;
  className?: string;
  stacked?: boolean;
}) {
  const message = title ? enquireMessage(title, extra) : undefined;
  const subject = title ? `Enquiry: ${title}` : `Project enquiry — ${site.name}`;

  return (
    <div className={cn("flex flex-wrap gap-3", stacked && "flex-col", className)}>
      <a
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold no-underline"
        style={{ background: "#25D366", color: "#052e16" }}
      >
        <Icon name="whatsapp" className="h-4 w-4" />
        WhatsApp
      </a>
      <button
        type="button"
        title={`Email ${site.email}`}
        onClick={() => openMailClient(subject, message)}
        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        style={{ background: "#16110e", color: "#ffffff" }}
      >
        <Icon name="mail" className="h-4 w-4" />
        Email studio
      </button>
    </div>
  );
}
