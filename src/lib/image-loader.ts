export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }
  // Encode twice: the request pipeline decodes the query once before the
  // route reads it, and searchParams.get decodes again — two layers keep
  // %2F-encoded paths (Firebase Storage objects) and inner ?/& intact.
  return `/api/img?url=${encodeURIComponent(encodeURIComponent(src))}&w=${width}&q=${quality ?? 75}`;
}
