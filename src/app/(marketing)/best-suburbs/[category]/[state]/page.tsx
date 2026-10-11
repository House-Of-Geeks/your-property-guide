import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getRankedSuburbs,
  getRankingEligibleCount,
  type RankingCategory,
} from "@/lib/services/suburb-rankings-service";
import { isRanked, rankingNote } from "@/lib/ranking-notes";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { bestSuburbsStateTitle } from "@/lib/best-suburbs-headlines";
import {
  BestSuburbsListing,
  CATEGORY_CONFIG,
  STATES,
  STATE_NAME,
} from "@/components/best-suburbs/BestSuburbsListing";
import { CityEditionPage } from "@/components/best-suburbs/CityEdition";
import { CAPITAL_CITIES, getCapitalCity, type CapitalCity } from "@/lib/utils/metro";
import {
  CITY_EDITION_CATEGORIES,
  cityEditionDescription,
  cityEditionPath,
  cityEditionTitle,
  editionCoverage,
  isCityEditionCategory,
  isCityEditionIndexable,
} from "@/lib/city-editions";
import {
  cityEditionLinks,
  getCityEdition,
  indexableCityEditionsForLinks,
} from "@/lib/services/city-rankings-service";

export const revalidate = 86400;

const VALID_CATEGORIES: RankingCategory[] = [
  "for-families",
  "highest-growth",
  "most-affordable",
  "most-walkable",
  "lowest-flood-risk",
  "best-rental-yield",
];

// These 48 category × state SEO permutations are generated on-demand (ISR)
// rather than at build. Each one runs the DB-heavy getRankedSuburbs query, and
// prerendering all of them in a burst is what the Railway connection proxy
// drops under, failing the whole build. dynamicParams (default true) + the
// revalidate above render + cache each on first request instead. (The same
// NEXT_PHASE guard is used across the other DB-backed routes.)
export async function generateStaticParams() {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const out: { category: string; state: string }[] = [];
  for (const category of VALID_CATEGORIES) {
    for (const state of STATES) {
      out.push({ category, state: state.toLowerCase() });
    }
  }
  // The city editions share the segment: /best-suburbs/{category}/{city}.
  for (const category of CITY_EDITION_CATEGORIES) {
    for (const city of CAPITAL_CITIES) {
      if (isRanked(category, city.state)) out.push({ category, state: city.slug });
    }
  }
  return out;
}

interface CategoryStatePageProps {
  params: Promise<{ category: string; state: string }>;
}

function isValidCategory(c: string): c is RankingCategory {
  return (VALID_CATEGORIES as string[]).includes(c);
}

function normaliseState(s: string): string | null {
  const upper = s.toUpperCase();
  return (STATES as readonly string[]).includes(upper) ? upper : null;
}

// The second segment is a state code or a capital city's slug. A city
// edition (tracker item 22) is the same category over Greater {City}, with a
// section per suburb; it answers noindex and stays out of the city sitemap
// when fewer than ten suburbs qualify or the measure cannot rank them (the
// walk score's tie at 100): isCityEditionIndexable, read by both.
async function cityEditionMetadata(category: RankingCategory, city: CapitalCity): Promise<Metadata> {
  const edition = await getCityEdition(category, city);
  const title = cityEditionTitle(category, city);
  const description = cityEditionDescription(edition);
  const canonical = `${SITE_URL}${cityEditionPath(category, city.slug)}`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: isCityEditionIndexable(category, city.state, edition.suburbs.length, editionCoverage(edition)) ? undefined : { index: false, follow: true },
    openGraph: {
      url: canonical,
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export async function generateMetadata({
  params,
}: CategoryStatePageProps): Promise<Metadata> {
  const { category, state } = await params;

  if (!isValidCategory(category)) return { title: "Not Found" };
  const city = getCapitalCity(state);
  if (city) return isCityEditionCategory(category) ? cityEditionMetadata(category, city) : { title: "Not Found" };
  const upperState = normaliseState(state);
  if (!upperState) return { title: "Not Found" };

  const config = CATEGORY_CONFIG[category];
  const stateName = STATE_NAME[upperState];

  const title = bestSuburbsStateTitle(category, upperState);
  const description = `${config.description} Filtered to ${stateName} suburbs only.`;

  const canonical = `${SITE_URL}/best-suburbs/${category}/${state.toLowerCase()}`;

  return {
    title,
    description,
    alternates: { canonical },
    // A state with nothing to rank (no 12-month change, no suburb-level
    // rent) says so and stays out of the index until there is.
    robots: isRanked(category, upperState) ? undefined : { index: false, follow: true },
    openGraph: {
      url: canonical,
      // og titles don't get the root title.template — brand them explicitly
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BestSuburbsCategoryStatePage({
  params,
}: CategoryStatePageProps) {
  const { category, state } = await params;

  if (!isValidCategory(category)) notFound();
  const city = getCapitalCity(state);
  if (city) {
    if (!isCityEditionCategory(category)) notFound();
    // One after the other: the runtime pool holds a single connection.
    const edition = await getCityEdition(category, city);
    const indexable = await indexableCityEditionsForLinks();
    return <CityEditionPage edition={edition} indexable={indexable} updatedAt={new Date()} />;
  }
  const upperState = normaliseState(state);
  if (!upperState) notFound();

  // One after the other: the runtime pool holds a single connection.
  // Nothing is fetched for a ranking the state's figures cannot support.
  const ranked = isRanked(category, upperState);
  const suburbs = ranked ? await getRankedSuburbs(category, upperState, 50) : [];
  const eligible = ranked ? await getRankingEligibleCount(category, upperState) : null;
  const note = rankingNote(category, upperState, suburbs.length, eligible);
  // The state's city edition, where it has ten suburbs to show.
  const cityEditions = cityEditionLinks(await indexableCityEditionsForLinks(), { category, state: upperState });

  return (
    <BestSuburbsListing
      category={category}
      state={upperState}
      suburbs={suburbs}
      note={note}
      cityEditions={cityEditions}
      useStaticStateRoutes
    />
  );
}
