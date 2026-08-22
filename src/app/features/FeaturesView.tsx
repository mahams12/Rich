"use client";

import { useMemo, useState } from "react";
import { Badge, Section } from "@/components/ui/Button";
import { ContactActions } from "@/components/ui/ContactActions";
import { featureModules } from "@/data/content";

const groups = [
  { label: "Commerce", tags: ["cart", "payments", "checkout", "subscriptions", "billing"] },
  { label: "Social & realtime", tags: ["chat", "reels", "calling", "webrtc", "social"] },
  { label: "Pages & frontend", tags: ["frontend", "pages", "cms", "blog"] },
  { label: "Product core", tags: ["auth", "admin", "search", "maps", "notifications", "uploads", "analytics", "booking", "reviews", "wishlist", "i18n", "tracking"] },
];

export function FeaturesView() {
  const [selected, setSelected] = useState<string[]>([]);
  const names = featureModules.filter((item) => selected.includes(item.id)).map((item) => item.name);
  const note = names.length ? `I want these modules: ${names.join(", ")}.` : undefined;

  const grouped = useMemo(() => {
    const used = new Set<string>();
    const buckets = groups.map((group) => {
      const items = featureModules.filter((item) => item.tags.some((tag) => group.tags.includes(tag)));
      items.forEach((item) => used.add(item.id));
      return { ...group, items };
    });
    const rest = featureModules.filter((item) => !used.has(item.id));
    if (rest.length) buckets.push({ label: "More modules", tags: [], items: rest });
    return buckets;
  }, []);

  return (
    <Section>
      <Badge>Feature modules</Badge>
      <h1 className="display mt-4 text-4xl sm:text-5xl">Add a module, a page, or a capability — not a whole product.</h1>
      <p className="mt-4 max-w-2xl text-[#6d655d]">
        Cart, payments, chat, calling, reels, authentication, maps, notifications, admin, frontend pages and more. Pick what you need, then WhatsApp or email us.
      </p>
      {grouped.map((group) => (
        <div key={group.label} className="mt-10">
          <h2 className="display text-2xl">{group.label}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {group.items.map((item) => {
              const on = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected((cur) => (on ? cur.filter((id) => id !== item.id) : [...cur, item.id]))}
                  className={`card-lift rounded-3xl border border-black/10 bg-card p-5 text-left ${on ? "ring-2 ring-[#c45c3a]" : ""}`}
                >
                  <p className="display text-xl">{item.name}</p>
                  <p className="mt-2 text-sm text-[#6d655d]">{item.summary}</p>
                  <p className="mt-4 text-sm text-[#4a433c]">{item.deliveryDays} day typical window</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-card p-5">
        <div>
          <p className="text-sm text-[#6d655d]">{selected.length ? `${selected.length} selected` : "Pick modules, then message us"}</p>
          <p className="display text-2xl">WhatsApp or email</p>
        </div>
        <ContactActions title="feature modules" extra={note} />
      </div>
    </Section>
  );
}
