import { firebaseProjectId } from "./config";
import { splitCatalogDocs } from "@/lib/catalog";

/**
 * Server-side catalog fetch over the Firestore REST API. The `projects`
 * collection is publicly readable (firestore.rules: allow read: if true), so
 * no auth is required. Used to render blog/portfolio content in the initial
 * HTML instead of waiting for the client-side snapshot listener.
 */

const COLLECTION_URL = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/projects`;

type RestValue = Record<string, unknown> & {
  nullValue?: unknown;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  stringValue?: string;
  timestampValue?: string;
  referenceValue?: string;
  arrayValue?: { values?: RestValue[] };
  mapValue?: { fields?: Record<string, RestValue> };
};

function decodeValue(value: RestValue): unknown {
  if ("nullValue" in value) return null;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("stringValue" in value) return value.stringValue;
  // Keep timestamps as ISO strings — views expect string dates, and these are
  // more useful than the Timestamp objects the client SDK produces.
  if ("timestampValue" in value) return value.timestampValue;
  if ("referenceValue" in value) return value.referenceValue;
  if ("arrayValue" in value) return (value.arrayValue?.values ?? []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue?.fields ?? {});
  return null;
}

function decodeFields(fields: Record<string, RestValue>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = decodeValue(value);
  }
  return out;
}

// Cache the catalog at the edge for 60s — the per-request Firestore REST
// roundtrip costs ~800ms of TTFB. The client-side listener reconciles
// anything fresher after page load anyway.
const CACHE_KEY = "https://cache.internal/catalog-v1";
const CACHE_TTL_MS = 60_000;

type Catalog = ReturnType<typeof splitCatalogDocs>;

export async function fetchCatalogServer(): Promise<Catalog | null> {
  const cache =
    typeof caches !== "undefined"
      ? (caches as unknown as { default: Cache }).default
      : undefined;
  if (cache) {
    try {
      const hit = await cache.match(CACHE_KEY);
      if (hit) {
        const { t, data } = (await hit.json()) as { t: number; data: Catalog };
        if (Date.now() - t < CACHE_TTL_MS) return data;
      }
    } catch {
      // Cache miss/corrupt — fall through to Firestore.
    }
  }
  const catalog = await fetchCatalogFromRest();
  if (cache && catalog) {
    const body = JSON.stringify({ t: Date.now(), data: catalog });
    await cache
      .put(CACHE_KEY, new Response(body, { headers: { "content-type": "application/json" } }))
      .catch(() => undefined);
  }
  return catalog;
}

async function fetchCatalogFromRest(): Promise<Catalog | null> {
  try {
    const docs: { id: string; data: Record<string, unknown> }[] = [];
    let pageToken: string | undefined;
    // Collections stay small, but page defensively (3 pages = 3000 docs max).
    for (let page = 0; page < 3; page++) {
      const url = `${COLLECTION_URL}?pageSize=1000${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
      const res = await fetch(url, { next: { revalidate: 60 } });
      if (!res.ok) return null;
      const json = (await res.json()) as {
        documents?: { name: string; fields?: Record<string, RestValue> }[];
        nextPageToken?: string;
      };
      for (const doc of json.documents ?? []) {
        const id = doc.name.split("/").pop();
        if (!id) continue;
        docs.push({ id, data: decodeFields(doc.fields ?? {}) });
      }
      pageToken = json.nextPageToken;
      if (!pageToken) break;
    }
    return splitCatalogDocs(docs);
  } catch {
    return null;
  }
}
