"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Button";

type Founder = {
  name: string;
  role: string;
  photo: string;
  email: string;
  phone: string;
  profile: string;
  /** Covers the real portrait inside the embedded profile (position tuned to that site's hero). */
  coverClass?: string;
};

const founders: Founder[] = [
  {
    name: "Syed Hamza Mehdi",
    role: "Co-founder · Full-Stack Software Engineer",
    photo: "/founders/hamza-mehdi-avatar.png",
    email: "mehihamza1@gmail.com",
    phone: "+92 304 4319234",
    profile: "https://hamza-portfolio-livid.vercel.app/",
  },
  {
    name: "Maham Saeed",
    role: "Co-founder · Software Engineer",
    photo: "/founders/maham-saeed-avatar.png",
    email: "maham.inbox@gmail.com",
    phone: "+92 309 6557185",
    profile: "https://maham-profile.vercel.app/",
    coverClass: "left-[62%] top-[36%] w-[22%]",
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
      className="group rounded-3xl border border-black/10 bg-card px-6 py-7 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c45c3a]"
    >
      <img
        src={founder.photo}
        alt={`${founder.name}, ${founder.role} at NovexaHub`}
        loading="lazy"
        className="mx-auto h-28 w-28 rounded-full object-cover shadow-md ring-4 ring-[#ebe6de] transition duration-300 group-hover:scale-105 sm:h-32 sm:w-32"
      />
      <p className="mt-4 font-semibold">{founder.name}</p>
      <p className="mt-0.5 text-sm text-[#6d655d]">{founder.role}</p>
      <div className="mt-3 flex flex-col items-center gap-1 text-sm text-[#6d655d]">
        <span className="inline-flex items-center gap-1.5 break-all">
          <Icon name="mail" className="h-3.5 w-3.5 shrink-0 text-[#c45c3a]" />
          {founder.email}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="phone" className="h-3.5 w-3.5 shrink-0 text-[#c45c3a]" />
          {founder.phone}
        </span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#c45c3a]/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c45c3a] transition group-hover:bg-[#c45c3a] group-hover:text-white">
        View profile
        <Icon name="arrow-ne" className="h-3 w-3" />
      </span>
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
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Open in new tab
              <Icon name="arrow-ne" className="h-3 w-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="relative flex-1">
          <iframe src={founder.profile} title={`${founder.name} — profile`} className="h-full w-full bg-white" />
          {founder.coverClass ? (
            <img
              src={founder.photo}
              alt=""
              aria-hidden="true"
              className={`pointer-events-none absolute z-20 aspect-square rounded-full object-cover shadow-lg ${founder.coverClass}`}
            />
          ) : null}
        </div>
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
