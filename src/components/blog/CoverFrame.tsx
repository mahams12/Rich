"use client";

import { useMemo, useState } from "react";

/**
 * Blog cover frame. Renders the image directly from its original URL — this
 * deliberately bypasses next/image and the /api/img optimizer proxy, which
 * can return 502 on Cloudflare when its self-reference image-optimizer
 * request fails (leaving empty placeholder boxes on the page).
 *
 * When there is no source or the image fails, the whole frame unmounts —
 * no placeholder graphic, no empty colour block.
 */
export function CoverFrame({
  src,
  fallbackSrc,
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src?: string;
  /** Tried in order after `src` fails — e.g. curated stock cover behind a stored upload. */
  fallbackSrc?: string;
  alt: string;
  className: string;
  imgClassName?: string;
  /** Above-the-fold images: eager load + high fetch priority. */
  eager?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const candidates = useMemo(
    () => [...new Set([src, fallbackSrc].filter((item): item is string => Boolean(item)))],
    [src, fallbackSrc],
  );
  const active = candidates[index];
  if (!active) return null;
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={active}
        src={active}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className={imgClassName ?? "absolute inset-0 h-full w-full object-cover object-center"}
        onError={() => setIndex((i) => i + 1)}
      />
    </div>
  );
}
