"use client";

import { FormEvent, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Badge, Button, Field, Section, inputClass } from "@/components/ui/Button";
import { ContactActions } from "@/components/ui/ContactActions";
import { openMailClient, whatsappUrl } from "@/lib/contact";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";

export function ContactView() {
  const { addContact, user } = useApp();
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    addContact({
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      project: String(data.get("project") || ""),
      message: String(data.get("message") || ""),
    });
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <Section>
      <Badge>Contact</Badge>
      <h1 className="display mt-4 text-4xl">Tell us what you need</h1>
      <p className="mt-3 max-w-xl text-[#6d655d]">Tell us about a website, app, design pack, ads, video, feature or student kit. Or skip the form and use WhatsApp or email.</p>
      <div className="mt-6">
        <ContactActions />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={submit} className="glass space-y-4 rounded-[2rem] p-6">
          <Field label="Name">
            <input name="name" required defaultValue={user?.name} className={inputClass} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required defaultValue={user?.email} className={inputClass} />
          </Field>
          <Field label="Project or topic">
            <select name="project" className={inputClass} defaultValue="">
              <option value="">What do you need?</option>
              <option>Website (any category)</option>
              <option>Mobile app (any kind)</option>
              <option>Ecommerce / cart / payments</option>
              <option>AI automation / posting</option>
              <option>UI/UX, posters, banners, product design</option>
              <option>Ads / video editing</option>
              <option>A specific feature or page</option>
              <option>Final-year project</option>
              <option>Assignment writing kit</option>
              <option>Custom mix</option>
            </select>
          </Field>
          <Field label="Message">
            <textarea name="message" required minLength={12} className={`${inputClass} min-h-36`} />
          </Field>
          <Button type="submit">Send request</Button>
          {sent ? <p className="text-sm text-[#c45c3a]">Request sent. We will reply on WhatsApp or email.</p> : null}
        </form>
        <aside className="space-y-4 rounded-[2rem] border border-black/10 p-6">
          <p className="font-semibold">Direct lines</p>
          <button
            type="button"
            onClick={() => openMailClient(`Project enquiry — ${site.name}`)}
            className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-semibold text-[#16110e] transition hover:border-[#c45c3a]/40"
          >
            <Icon name="mail" className="h-4 w-4 shrink-0 text-[#c45c3a]" />
            <span>{site.email}</span>
          </button>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#16110e] no-underline transition hover:border-[#25D366]/50"
          >
            <Icon name="whatsapp" className="h-4 w-4 shrink-0 text-[#25D366]" />
            <span>WhatsApp {site.whatsappDisplay}</span>
          </a>
          <p className="text-xs leading-5 text-muted">Tap email to open Gmail compose to the studio, or WhatsApp to message directly.</p>
        </aside>
      </div>
    </Section>
  );
}
