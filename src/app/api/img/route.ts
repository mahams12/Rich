import { getCloudflareContext } from "@opennextjs/cloudflare";

// Same-origin image optimization via the Cloudflare IMAGES binding.
// The built-in /_next/image worker path sets no Cache-Control (Firebase
// Storage and Unsplash upstreams are not "immutable"), so every visit
// re-downloaded every image. Responses from this route are cached for a week.
const CACHE_CONTROL = "public, max-age=604800, stale-while-revalidate=86400";

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
      output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
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

  const upstream = await fetch(src, { signal: AbortSignal.timeout(8_000) });
  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: 502 });
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
    const result = optimized.response();
    const headers = new Headers(result.headers);
    headers.set("cache-control", CACHE_CONTROL);
    headers.set("vary", "Accept");
    return new Response(result.body, { status: result.status, headers });
  } catch {
    // Transform failed — refetch and serve the original bytes.
    const retry = await fetch(src, { signal: AbortSignal.timeout(8_000) });
    return new Response(retry.body, {
      status: retry.ok ? 200 : 502,
      headers: {
        "content-type": retry.headers.get("content-type") ?? "application/octet-stream",
        "cache-control": CACHE_CONTROL,
      },
    });
  }
}
