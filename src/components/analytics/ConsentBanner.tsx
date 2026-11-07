"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => { if (!getConsent()) setOpen(true); }, []);
  if (!open) return null;

  const chip = (on: boolean) =>
    `rounded-full px-3 py-1 text-[11px] font-semibold transition ${on ? "bg-emerald-100 text-emerald-800" : "bg-black/[0.06] text-[#6d655d]"}`;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-2xl rounded-3xl border border-black/10 bg-white p-5 shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[26rem]">
      <p className="font-semibold text-[#16110e]">Cookies & privacy</p>
      <p className="mt-1 text-xs leading-5 text-[#6d655d]">
        We use cookies for essential site features, and — with your permission — anonymous analytics and marketing
        measurement. See our{" "}
        <Link href="/privacy-policy" className="font-semibold text-[#a14b30] underline-offset-4 hover:underline">Privacy Policy</Link>.
      </p>
      {customize ? (
        <div className="mt-3 space-y-2 rounded-2xl bg-black/[0.03] p-3 text-xs">
          <div className="flex items-center justify-between"><span className="font-semibold">Necessary</span><span className={chip(true)}>Always on</span></div>
          <button type="button" onClick={() => setAnalytics(!analytics)} className="flex w-full items-center justify-between text-left">
            <span><span className="font-semibold">Analytics</span> — anonymous usage stats</span><span className={chip(analytics)}>{analytics ? "On" : "Off"}</span>
          </button>
          <button type="button" onClick={() => setMarketing(!marketing)} className="flex w-full items-center justify-between text-left">
            <span><span className="font-semibold">Marketing</span> — ad measurement (Meta Pixel)</span><span className={chip(marketing)}>{marketing ? "On" : "Off"}</span>
          </button>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setConsent({ analytics: true, marketing: true }); setOpen(false); }}
          className="rounded-full bg-[#16110e] px-4 py-2 text-xs font-semibold text-white"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => { setConsent({ analytics: false, marketing: false }); setOpen(false); }}
          className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[#4a423c]"
        >
          Reject all
        </button>
        <button
          type="button"
          onClick={() => customize ? (setConsent({ analytics, marketing }), setOpen(false)) : setCustomize(true)}
          className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[#4a423c]"
        >
          {customize ? "Save choices" : "Customize"}
        </button>
      </div>
    </div>
  );
}
