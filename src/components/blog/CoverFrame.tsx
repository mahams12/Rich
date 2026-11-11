"use client";

import { useState } from "react";

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
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src?: string;
  alt: string;
  className: string;
  imgClassName?: string;
  /** Above-the-fold images: eager load + high fetch priority. */
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className={imgClassName ?? "absolute inset-0 h-full w-full object-cover object-center"}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
