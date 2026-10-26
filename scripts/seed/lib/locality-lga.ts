/**
 * Locality (suburb) -> LGA lookup helpers shared by import-suburb-lgas.ts,
 * build-locality-lga.ts and the offline validation test.
 *
 * Source data: ABS ASGS Edition 3 allocation files (Suburbs and Localities
 * 2021 and Local Government Areas 2025), joined at Mesh Block level. See
 * build-locality-lga.ts for how scripts/seed/data/locality-lga.json is built.
 */

export type LocalityLgaData = {
  source: string;
  /** state (QLD) -> normalised locality name -> LGA (app spelling) */
  localities: Record<string, Record<string, string>>;
  /** localities split across councils: state -> normalised name -> [[lga, km2], ...] largest first */
  splits: Record<string, Record<string, Array<[string, number]>>>;
  /**
   * Same-named localities in one state that sit in different councils
   * (ABS writes them "Newtown (Ipswich - Qld)" and "Newtown (Toowoomba - Qld)").
   * state -> normalised name -> [[lga, postcodes the locality overlaps], ...].
   * The postcode only picks WHICH locality is meant; the council always comes
   * from that locality's own boundary.
   */
  ambiguous: Record<string, Record<string, Array<[string, string[]]>>>;
};

// LGA values that are not real geographic areas - never assign these
export const SKIP_LGAS = new Set([
  "",
  "Unincorporated ACT",
  "Unincorporated SA",
  "Unincorporated NSW",
  "Unincorporated Vic",
  "Unincorporated Tas",
  "Unincorporated NT",
  "No usual address",
  "Migratory - Offshore - Shipping",
  "Outside Australia",
  "Not Applicable",
]);

// ABS renamed these councils; the app (src/lib/utils/lga-names.ts and the
// existing Suburb.region values) still uses the spelling on the right.
const LGA_APP_SPELLING: Record<string, string> = {
  "Merri-bek": "Moreland",
  "Lower Eyre": "Lower Eyre Peninsula",
};

// Strip state disambiguation suffixes added when a name is not unique
// nationally, e.g. "Central Highlands (Qld)" -> "Central Highlands"
export function cleanLgaName(name: string): string {
  return name.replace(/\s*\([A-Za-z.]+\)\s*$/, "").trim();
}

/** Canonical council spelling as stored in Suburb.region, or null if not a real area. */
export function appLgaName(rawAbsName: string): string | null {
  const cleaned = cleanLgaName(rawAbsName);
  if (SKIP_LGAS.has(rawAbsName) || SKIP_LGAS.has(cleaned)) return null;
  return LGA_APP_SPELLING[cleaned] ?? cleaned;
}

/** Lowercase, drop ABS qualifiers like "(Ipswich - Qld)" and punctuation so DB names and ABS names compare equal. */
export function normaliseLocality(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*$/, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['`.]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function nameVariants(norm: string): string[] {
  const out = [norm];
  if (/^mount /.test(norm)) out.push(norm.replace(/^mount /, "mt "));
  if (/^mt /.test(norm)) out.push(norm.replace(/^mt /, "mount "));
  if (/^saint /.test(norm)) out.push(norm.replace(/^saint /, "st "));
  if (/^st /.test(norm)) out.push(norm.replace(/^st /, "saint "));
  return out;
}

export type Resolution =
  | { kind: "matched"; lga: string; split?: Array<[string, number]> }
  | { kind: "ambiguous" }
  | { kind: "unmatched" };

/** Locality-level lookup. Never falls back to postcode. */
export function resolveLocality(
  data: LocalityLgaData,
  name: string,
  state: string,
  postcode?: string,
): Resolution {
  const st = state.toUpperCase();
  const table = data.localities[st];
  if (!table) return { kind: "unmatched" };
  for (const v of nameVariants(normaliseLocality(name))) {
    const dupes = data.ambiguous[st]?.[v];
    if (dupes) {
      const hits = new Set(dupes.filter(([, pcs]) => postcode && pcs.includes(postcode)).map(([l]) => l));
      return hits.size === 1 ? { kind: "matched", lga: [...hits][0] } : { kind: "ambiguous" };
    }
    const lga = table[v];
    if (lga) return { kind: "matched", lga, split: data.splits[st]?.[v] };
  }
  return { kind: "unmatched" };
}

export type SuburbRow = { slug: string; name: string; state: string; postcode: string; region: string };

export type PlanEntry = {
  slug: string;
  name: string;
  from: string;
  to: string;
  split?: Array<[string, number]>;
};

export type Plan = {
  changes: PlanEntry[];
  unchanged: number;
  splitLogged: PlanEntry[];
  unmatched: SuburbRow[];
  ambiguous: SuburbRow[];
};

/** Decide the new region for every suburb. Unmatched suburbs keep their existing value. */
export function planRegions(data: LocalityLgaData, suburbs: SuburbRow[]): Plan {
  const plan: Plan = { changes: [], unchanged: 0, splitLogged: [], unmatched: [], ambiguous: [] };
  for (const s of suburbs) {
    const r = resolveLocality(data, s.name, s.state, s.postcode);
    if (r.kind === "ambiguous") { plan.ambiguous.push(s); continue; }
    if (r.kind === "unmatched") { plan.unmatched.push(s); continue; }
    const entry: PlanEntry = { slug: s.slug, name: s.name, from: s.region, to: r.lga, split: r.split };
    if (r.split) plan.splitLogged.push(entry);
    if (s.region === r.lga) plan.unchanged++;
    else plan.changes.push(entry);
  }
  return plan;
}
