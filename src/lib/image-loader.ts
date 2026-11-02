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
  return `/api/img?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}
