// Suburb rows that are postal delivery names, institutions or shopping-centre
// post offices, not localities, and what the site does with them. The list is
// generated from production by scripts/seo/non-localities.ts using the rules
// in locality-names.ts; this module is the lookups.
//
// Every entry's URLs redirect (next.config.ts): to the real suburb of the same
// name in the same postcode where there is one, otherwise to the postcode
// page, which lists the name as what it is. The entries are left out of the
// suburb lists, the suburb picker, the nearby-suburb links and the sitemaps.
import data from "@/lib/data/non-localities.json";
import type { NonLocalityKind } from "@/lib/locality-names";

export interface NonLocality {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  kind: NonLocalityKind;
  /** Slug of the real suburb of the same name in the same postcode, when there is one. */
  parent: string | null;
}

export const NON_LOCALITIES: readonly NonLocality[] = data.entries as NonLocality[];
export const NON_LOCALITIES_AS_AT: string = data.generatedAt;

const BY_SLUG = new Map(NON_LOCALITIES.map((e) => [e.slug, e]));

/** For Prisma `notIn` filters on suburb lists. */
export const NON_LOCALITY_SLUGS: string[] = NON_LOCALITIES.map((e) => e.slug);

/**
 * Prisma `where` fragment for any query that lists suburbs. The rows still
 * carry figures of their own (a walk score of 100, a census-proxy median),
 * so a list that ranks or counts on the raw columns picks them up unless it
 * says otherwise. tests/seo/non-localities.test.ts checks every file that
 * lists suburbs.
 */
export const LOCALITIES_ONLY = { slug: { notIn: NON_LOCALITY_SLUGS } };

export function isNonLocalitySlug(slug: string): boolean {
  return BY_SLUG.has(slug);
}

export function nonLocalityBySlug(slug: string): NonLocality | null {
  return BY_SLUG.get(slug) ?? null;
}

/** Where the entry's old URLs go: its suburb, or its postcode page. */
export function nonLocalityTarget(e: Pick<NonLocality, "parent" | "postcode">): string {
  return e.parent ? `/suburbs/${e.parent}` : `/postcodes/${e.postcode}`;
}

export function nonLocalitiesInPostcode(postcode: string): NonLocality[] {
  return NON_LOCALITIES.filter((e) => e.postcode === postcode);
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
