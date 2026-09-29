// Suburb rows that are not places, and what the site does with them. The list
// is generated from production by scripts/seo/non-localities.ts using the
// rules in locality-names.ts and postcode-states.ts; this module is the
// lookups.
//
// Entries are postal delivery names, institutions, shopping-centre post
// offices, and rows filed under the wrong state ("Sydney, SA 2000"). Every
// entry's URLs redirect (next.config.ts): to the real suburb where there is
// one, otherwise to the postcode page, which lists a delivery name as what it
// is. Hidden rows have nowhere to go ("Not Disclosed"): their pages answer
// 404. Both are left out of the suburb lists, the suburb picker, the
// nearby-suburb links and the sitemaps.
import data from "@/lib/data/non-localities.json";
import { DELIVERY_KINDS, type NonLocalityKind } from "@/lib/locality-names";

export interface NonLocality {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  kind: NonLocalityKind;
  /** Slug of the real suburb it belongs to or stands beside, when there is one. */
  parent: string | null;
}

/** A row that is not a place and has nowhere to redirect to. */
export interface HiddenRow {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  reason: string;
}

export const NON_LOCALITIES: readonly NonLocality[] = data.entries as NonLocality[];
export const HIDDEN_ROWS: readonly HiddenRow[] = data.hidden as HiddenRow[];
export const NON_LOCALITIES_AS_AT: string = data.generatedAt;

const BY_SLUG = new Map(NON_LOCALITIES.map((e) => [e.slug, e]));
const HIDDEN = new Set(HIDDEN_ROWS.map((h) => h.slug));

/** For Prisma `notIn` filters on suburb lists: the entries and the hidden rows. */
export const NON_LOCALITY_SLUGS: string[] = [...NON_LOCALITIES.map((e) => e.slug), ...HIDDEN_ROWS.map((h) => h.slug)];

/**
 * Rows that are not even a delivery name: misfiled and hidden. The postcode
 * lists leave these out and keep the delivery names, because a postcode used
 * only for a mail centre has a page and one that holds only "Not Disclosed"
 * does not.
 */
export const MISFILED_SLUGS: string[] = [
  ...NON_LOCALITIES.filter((e) => e.kind === "misfiled").map((e) => e.slug),
  ...HIDDEN_ROWS.map((h) => h.slug),
];

/**
 * Prisma `where` fragment for any query that lists suburbs. The rows still
 * carry figures of their own (a walk score of 100, a census-proxy median),
 * so a list that ranks or counts on the raw columns picks them up unless it
 * says otherwise. tests/seo/non-localities.test.ts checks every file that
 * lists suburbs.
 */
export const LOCALITIES_ONLY = { slug: { notIn: NON_LOCALITY_SLUGS } };

export function isNonLocalitySlug(slug: string): boolean {
  return BY_SLUG.has(slug) || HIDDEN.has(slug);
}

/** A hidden row's pages answer 404: suburb-service returns no suburb for it. */
export function isHiddenSlug(slug: string): boolean {
  return HIDDEN.has(slug);
}

export function nonLocalityBySlug(slug: string): NonLocality | null {
  return BY_SLUG.get(slug) ?? null;
}

/** Where the entry's old URLs go: its suburb, or its postcode page. */
export function nonLocalityTarget(e: Pick<NonLocality, "parent" | "postcode">): string {
  return e.parent ? `/suburbs/${e.parent}` : `/postcodes/${e.postcode}`;
}

/** The delivery names in a postcode, for the postcode page. A misfiled row is not one. */
export function nonLocalitiesInPostcode(postcode: string): NonLocality[] {
  return NON_LOCALITIES.filter((e) => e.postcode === postcode && DELIVERY_KINDS.includes(e.kind));
}

export interface RedirectRule {
  source: string;
  destination: string;
  permanent: true;
}

/**
 * Two rules per entry: the profile, and anything under it (sub-pages keep
 * their path on the parent suburb; a postcode page has none). next.config.ts
 * builds the same rules from the same file; tests/seo/non-localities.test.ts
 * holds the two together.
 */
export function nonLocalityRedirects(
  entries: readonly Pick<NonLocality, "slug" | "parent" | "postcode">[] = NON_LOCALITIES,
): RedirectRule[] {
  return entries.flatMap((e) => {
    const target = nonLocalityTarget(e);
    return [
      { source: `/suburbs/${e.slug}`, destination: target, permanent: true as const },
      { source: `/suburbs/${e.slug}/:path*`, destination: e.parent ? `${target}/:path*` : target, permanent: true as const },
    ];
  });
}
