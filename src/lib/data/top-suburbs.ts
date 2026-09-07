// The suburbs people search for most, from the Search Console export that
// also drives the post-deploy warm-up (src/lib/data/prebuild-suburbs.json,
// profile slugs ordered by Google impressions). Fix item 5: the state and
// capital-city pages link to them so the pages that carry the impressions
// sit two clicks from the root and get recrawled first after a change.
import prebuild from "./prebuild-suburbs.json";
import { CAPITAL_CITIES, capitalCityFor } from "@/lib/utils/metro";

export interface TopSuburb {
  slug: string;
  name: string;
  state: string;
  postcode: string;
}

const SLUG = /^(.+)-(nsw|vic|qld|wa|sa|tas|nt|act)-(\d{4})$/;

function parseSlug(slug: string): TopSuburb | null {
  const m = SLUG.exec(slug);
  if (!m) return null;
  const name = m[1].split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return { slug, name, state: m[2].toUpperCase(), postcode: m[3] };
}

/** Ordered by impressions, most first. */
export const TOP_SUBURBS: TopSuburb[] = prebuild.slugs.map(parseSlug).filter((s): s is TopSuburb => s !== null);

export function topSuburbsForState(state: string, limit = 24): TopSuburb[] {
  const st = state.toUpperCase();
  return TOP_SUBURBS.filter((s) => s.state === st).slice(0, limit);
}

export function topSuburbsForCity(citySlug: string, limit = 24): TopSuburb[] {
  const city = CAPITAL_CITIES.find((c) => c.slug === citySlug);
  if (!city) return [];
  return TOP_SUBURBS.filter((s) => s.state === city.state && capitalCityFor(s.state, s.postcode)?.slug === city.slug).slice(0, limit);
}
