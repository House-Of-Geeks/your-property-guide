import { prisma } from "./db";

// Cached lookup: "name|state|postcode" → slug
let cache: Map<string, string> | null = null;

function normalise(s: string): string {
  return s.trim().toLowerCase();
}

export async function getSlugMap(): Promise<Map<string, string>> {
  if (cache) return cache;
  const suburbs = await prisma.suburb.findMany({
    select: { slug: true, name: true, state: true, postcode: true },
  });
  cache = new Map();
  for (const s of suburbs) {
    cache.set(`${normalise(s.name)}|${normalise(s.state)}|${s.postcode.trim()}`, s.slug);
  }
  return cache;
}

export function invalidateCache(): void {
  cache = null;
}

/**
 * Resolve a suburb name + state + postcode to a DB slug.
 * Returns null if not found (suburb not yet in DB — data is stored anyway
 * in the stats tables with suburbSlug: null, ready for when we add it).
 */
export async function resolveSlug(
  name: string,
  state: string,
  postcode: string
): Promise<string | null> {
  const map = await getSlugMap();

  // Exact match
  const key = `${normalise(name)}|${normalise(state)}|${postcode.trim()}`;
  const exact = map.get(key);
  if (exact) return exact;

  // Postcode-only fallback (handles name spelling differences)
  const pcode = postcode.trim();
  const stateNorm = normalise(state);
  const matches: string[] = [];
  for (const [k, slug] of map) {
    const parts = k.split("|");
    if (parts[1] === stateNorm && parts[2] === pcode) matches.push(slug);
  }
  return matches.length === 1 ? matches[0] : null;
}
