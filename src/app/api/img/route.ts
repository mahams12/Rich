import { getCloudflareContext } from "@opennextjs/cloudflare";

// Same-origin image optimization via the Cloudflare IMAGES binding.
// The built-in /_next/image worker path sets no Cache-Control (Firebase
// Storage and Unsplash upstreams are not "immutable"), so every visit
// re-downloaded every image. Responses from this route are cached for a week.
const CACHE_CONTROL = "public, max-age=604800, stale-while-revalidate=86400";
const FETCH_TIMEOUT_MS = 8_000;
const MAX_REDIRECTS = 4;

const ALLOWED_HOSTS = [
  "images.unsplash.com",
  "cdn.pixabay.com",
  "firebasestorage.googleapis.com",
  ".firebasestorage.app",
];

// Every width next/image can emit: imageSizes + deviceSizes.
const WIDTHS = new Set([16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]);

type ImagesBinding = {
  input(body: ReadableStream): {
    transform(options: { width: number; fit: string }): {
      output(options: { format: string; quality: number }): Promise<{ image(): ReadableStream }>;
    };
  };
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

// Mirrors the built-in image handler: redirect: "manual" is required —
// a default "follow" fetch re-parses the target URL and strips the %2F
// encoding Firebase Storage needs in its object path.
async function fetchUpstream(url: string, redirectsLeft: number): Promise<Response | null> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    redirect: "manual",
  });
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const location = response.headers.get("location");
    if (location === null || redirectsLeft < 1) return null;
    return fetchUpstream(new URL(location, url).href, redirectsLeft - 1);
  }
  return response;
}

function passthrough(body: ReadableStream | null, contentType: string) {
  return new Response(body, {
    headers: {
      "content-type": contentType || "application/octet-stream",
      "cache-control": CACHE_CONTROL,
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("url");
  const width = Number(searchParams.get("w"));
  const quality = Number(searchParams.get("q") ?? "75");
  if (!src || !isAllowed(src) || !WIDTHS.has(width) || quality < 40 || quality > 90) {
    return new Response("Bad request", { status: 400 });
  }

  const upstream = await fetchUpstream(new URL(src).href, MAX_REDIRECTS);
  if (!upstream?.ok || !upstream.body) {
    return new Response(`Upstream error: ${upstream?.status ?? "no-response"}`, { status: 502 });
  }
  const type = upstream.headers.get("content-type") ?? "";

  // SVGs and non-images must not be re-encoded — serve bytes as-is.
  if (!type.startsWith("image/") || type.includes("svg")) {
    return passthrough(upstream.body, type);
  }

  let images: ImagesBinding | undefined;
  try {
    images = (getCloudflareContext().env as { IMAGES?: ImagesBinding }).IMAGES;
  } catch {
    images = undefined; // next dev outside the OpenNext context
  }
  if (!images) return passthrough(upstream.body, type);

  const format = (request.headers.get("accept") ?? "").includes("image/avif")
    ? "image/avif"
    : "image/webp";
  try {
    const optimized = await images
      .input(upstream.body)
      .transform({ width, fit: "scale-down" })
      .output({ format, quality });
    return new Response(optimized.image(), {
      headers: {
        "content-type": format,
        "cache-control": CACHE_CONTROL,
        vary: "Accept",
      },
    });
  } catch {
    // Transform failed — refetch and serve the original bytes.
    const retry = await fetchUpstream(new URL(src).href, MAX_REDIRECTS);
    return new Response(retry?.body ?? null, {
      status: retry?.ok ? 200 : 502,
      headers: {
        "content-type": retry?.headers.get("content-type") ?? "application/octet-stream",
        "cache-control": CACHE_CONTROL,
      },
    });
  }
}
