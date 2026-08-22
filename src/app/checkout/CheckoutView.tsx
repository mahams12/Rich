"use client";

import { ContactActions } from "@/components/ui/ContactActions";
import { Badge, Section } from "@/components/ui/Button";

export function CheckoutView() {
  return (
    <Section className="max-w-2xl text-center">
      <Badge>Direct enquiry</Badge>
      <h1 className="display mt-4 text-4xl">No checkout on this site</h1>
      <p className="mx-auto mt-4 max-w-lg text-[#6d655d]">
        Purchase and customization happen on WhatsApp or email, so we can scope the work clearly before anything starts.
      </p>
      <div className="mt-8 flex justify-center">
        <ContactActions />
      </div>
    </Section>
  );
}
