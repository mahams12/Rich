"use client";

import { ContactActions } from "@/components/ui/ContactActions";
import { Badge, Button, Section } from "@/components/ui/Button";

export function SuccessView() {
  return (
    <Section className="max-w-xl text-center">
      <Badge>Studio</Badge>
      <h1 className="display mt-3 text-4xl">Talk to us to start</h1>
      <p className="mt-4 text-[#6d655d]">
        Payments are not taken on the website. Message WhatsApp or email and we will confirm scope, timing and price with you.
      </p>
      <div className="mt-8 flex justify-center">
        <ContactActions />
      </div>
      <div className="mt-6">
        <Button href="/portfolio" variant="ghost">View portfolio</Button>
      </div>
    </Section>
  );
}
