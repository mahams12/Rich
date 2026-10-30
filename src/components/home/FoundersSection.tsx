"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Button";

type Founder = {
  name: string;
  role: string;
  photo: string;
  profile: string;
};

const founders: Founder[] = [
  {
    name: "Syed Hamza Mehdi",
    role: "Co-founder · Full-Stack Software Engineer",
    photo: "/founders/hamza-mehdi.png",
    profile: "https://hamza-portfolio-livid.vercel.app/",
  },
  {
    name: "Maham Saeed",
    role: "Co-founder · Software Engineer",
    photo: "/founders/maham-saeed.jpg",
    profile: "https://maham-profile.vercel.app/",
  },
];

const CUSTOMER_COUNT = 2000;

function useInView() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function CountUp({ target }: { target: number }) {
  const { ref, inView } = useInView();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return (
    <div ref={ref} className="inline-flex items-baseline">
      <span className="display text-5xl tracking-tight text-[#c45c3a] tabular-nums sm:text-6xl">
        {value.toLocaleString("en-US")}+
      </span>
    </div>
  );
}

function FounderCard({ founder, onOpen }: { founder: Founder; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${founder.name}'s profile`}
      className="group overflow-hidden rounded-3xl border border-black/10 bg-card text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c45c3a]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe6de]">
        <img
          src={founder.photo}
          alt={`${founder.name}, ${founder.role} at NovexaHub`}
          loading="lazy"
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
        <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          View profile
          <Icon name="arrow-ne" className="h-3 w-3" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div>
          <p className="font-semibold">{founder.name}</p>
          <p className="mt-0.5 text-sm text-[#6d655d]">{founder.role}</p>
        </div>
        <Icon name="user" className="h-5 w-5 shrink-0 text-[#c45c3a]" />
      </div>
    </button>
  );
}

function ProfileOverlay({ founder, onClose }: { founder: Founder; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`${founder.name} profile`}>
      <button type="button" aria-label="Close profile" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1a1410] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <p className="truncate font-semibold text-white">{founder.name}</p>
          <div className="flex items-center gap-2">
            <a
              href={founder.profile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Open in new tab
              <Icon name="arrow-ne" className="h-3 w-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        </div>
        <iframe src={founder.profile} title={`${founder.name} — profile`} className="h-full w-full flex-1 bg-white" />
      </div>
    </div>
  );
}

export function FoundersSection() {
  const [active, setActive] = useState<Founder | null>(null);
  return (
    <Section>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c45c3a]">Founders</p>
        <h2 className="display mt-2 text-3xl tracking-tight">The people behind NovexaHub</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[#6d655d]">
          Two engineers building every product and custom project. Tap a photo to see their work — it opens right here.
        </p>
      </div>
      <div className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
        {founders.map((founder) => (
          <FounderCard key={founder.name} founder={founder} onOpen={() => setActive(founder)} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <CountUp target={CUSTOMER_COUNT} />
        <p className="mt-1 text-sm font-semibold text-[#16110e]">customers satisfied</p>
        <p className="mt-1 text-xs text-[#6d655d]">and counting — every project shipped on time</p>
      </div>
      {active ? <ProfileOverlay founder={active} onClose={() => setActive(null)} /> : null}
    </Section>
  );
}
