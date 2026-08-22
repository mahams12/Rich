"use client";

import { useMemo, useState } from "react";
import { Badge, Section } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useApp } from "@/components/providers/AppProvider";
import { reviews as studioReviews } from "@/data/content";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mb-3 flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" className={`h-4 w-4 ${i < rating ? "text-[#c45c3a]" : "text-black/15"}`} />
      ))}
    </div>
  );
}

export function ReviewsView() {
  const { reviews } = useApp();
  const live = useMemo(() => [...reviews, ...studioReviews], [reviews]);
  const [open, setOpen] = useState(false);
  const preview = 6;
  const visible = open ? live : live.slice(0, preview);

  return (
    <Section>
      <Badge>Client reviews</Badge>
      <h1 className="display mt-4 text-4xl">Reviews</h1>
      <p className="mt-3 max-w-2xl text-[#6d655d]">
        What clients say about the work. Signed-in users can also publish a review on any project — new ones appear here live.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {visible.map((item) => (
          <blockquote key={item.id} className="rounded-3xl border border-black/10 bg-card p-6">
            <Stars rating={item.rating} />
            <p className="text-lg text-ink">“{item.quote}”</p>
            <p className="mt-4 text-sm text-[#6d655d]">{item.name} · {item.role} · {item.projectType}</p>
          </blockquote>
        ))}
      </div>
      {live.length > preview ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="text-sm font-semibold text-[#16110e] underline-offset-4 hover:underline"
          >
            {open ? "See less" : "See more"}
          </button>
        </div>
      ) : null}
    </Section>
  );
}
