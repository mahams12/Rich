/** Meta Pixel — NovexaHub Website Leads */
export const META_PIXEL_ID = "1614024586904934";

export function trackMetaPageView(): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", "PageView");
}

/** Standard Meta Lead event — call only after a confirmed contact form submission. */
export function trackMetaLead(): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", "Lead");
}
