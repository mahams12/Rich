import { getCloudflareContext } from "@opennextjs/cloudflare";

// Same-origin image optimization with caching.
//
// The built-in /_next/image worker handler optimizes images correctly but
// cannot set Cache-Control, so browsers re-downloaded every image on every
// visit. This route proxies to that handler through the worker's self-
// reference service binding (top-level fetch, where remote URLs like
// Firebase Storage's %2F-encoded object paths survive intact) and stamps
// a long-lived Cache-Control on the response.
const CACHE_CONTROL = "public, max-age=604800, stale-while-revalidate=86400";

const ALLOWED_HOSTS = [
  "images.unsplash.com",
  "cdn.pixabay.com",
  "firebasestorage.googleapis.com",
  ".firebasestorage.app",
];

// Every width next/image can emit: imageSizes + deviceSizes.
const WIDTHS = new Set([16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]);

type Env = {
  WORKER_SELF_REFERENCE?: { fetch(input: string | Request, init?: RequestInit): Promise<Response> };
};

function isAllowed(src: string): boolean {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;
    return ALLOWED_HOSTS.some((host) =>
      host.startsWith(".") ? url.hostname.endsWith(host) : url.hostname === host,
    );
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let src = searchParams.get("url");
  // The pipeline decodes the query once before this route runs, so a
  // double-encoded url arrives still encoded; decode the last layer here.
  if (src?.startsWith("http%3A") || src?.startsWith("https%3A")) {
    try {
      src = decodeURIComponent(src);
    } catch {
      src = null;
    }
  }
  const width = Number(searchParams.get("w"));
  const quality = Number(searchParams.get("q") ?? "75");
  if (!src || !isAllowed(src) || !WIDTHS.has(width) || quality < 1 || quality > 100) {
    return new Response("Bad request", { status: 400 });
  }

  const proxyPath = `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  const accept = request.headers.get("accept") ?? "image/avif,image/webp,*/*";

  let env: Env = {};
  try {
    env = getCloudflareContext().env as Env;
  } catch {
    env = {};
  }

  let upstream: Response | null = null;
  if (env.WORKER_SELF_REFERENCE) {
    // Worker-internal request to the built-in optimizer.
    upstream = await env.WORKER_SELF_REFERENCE.fetch(
      new Request(`${new URL(request.url).origin}${proxyPath}`, {
        headers: { accept },
      }),
    );
  } else {
    // Local dev fallback: proxy over plain HTTP.
    try {
      upstream = await fetch(`${new URL(request.url).origin}${proxyPath}`, {
        headers: { accept },
        signal: AbortSignal.timeout(8_000),
      });
    } catch {
      upstream = null;
    }
  }

  if (!upstream?.ok || !upstream.body) {
    const detail = upstream ? await upstream.text().catch(() => "") : "";
    return new Response(
      `Upstream error: ${upstream?.status ?? "no-response"} ${detail.slice(0, 300)}`,
      {
        status: 502,
        headers: {
          "x-debug-binding": String(!!env.WORKER_SELF_REFERENCE),
          "x-debug-src": src.slice(0, 300),
        },
      },
    );
  }

  const headers = new Headers(upstream.headers);
  headers.set("cache-control", CACHE_CONTROL);
  return new Response(upstream.body, { status: upstream.status, headers });
}
