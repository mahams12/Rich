import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminHosts, domains, primaryHosts } from "@/data/domains";

/** Edge middleware so OpenNext/Cloudflare can host-route admin.novexahub.live. */
export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0];
  const { pathname, search } = request.nextUrl;

  // Canonicalize to https://<apex>: fold www + legacy domains and plain http
  // into a single origin so crawlers see one version of every page.
  const mirrorHosts = new Set<string>([domains.www, domains.legacy.primary, `www.${domains.legacy.primary}`]);
  if (mirrorHosts.has(host)) {
    return NextResponse.redirect(`https://${domains.primary}${pathname}${search}`, 301);
  }
  const prodHosts = new Set<string>([domains.primary, domains.admin]);
  if (prodHosts.has(host) && request.nextUrl.protocol === "http:") {
    return NextResponse.redirect(`https://${host}${pathname}${search}`, 301);
  }

  if (primaryHosts.has(host) && pathname.startsWith("/admin")) {
    const target = new URL(`${pathname}${search}`, domains.adminUrl);
    return NextResponse.redirect(target);
  }

  if (!adminHosts.has(host)) return NextResponse.next();

  if (pathname.startsWith("/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", "/admin");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
