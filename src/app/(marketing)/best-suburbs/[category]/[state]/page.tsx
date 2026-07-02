import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getRankedSuburbs,
  type RankingCategory,
} from "@/lib/services/suburb-rankings-service";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  BestSuburbsListing,
  CATEGORY_CONFIG,
  STATES,
  STATE_NAME,
} from "@/components/best-suburbs/BestSuburbsListing";

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

export async function generateMetadata({
  params,
}: CategoryStatePageProps): Promise<Metadata> {
  const { category, state } = await params;

  if (!isValidCategory(category)) return { title: "Not Found" };
  const upperState = normaliseState(state);
  if (!upperState) return { title: "Not Found" };

  const config = CATEGORY_CONFIG[category];
  const stateName = STATE_NAME[upperState];

  const title = `${config.title.replace(" Suburbs", "")} suburbs in ${stateName} (${upperState})`;
  const description = `${config.description} Filtered to ${stateName} suburbs only.`;

  const canonical = `${SITE_URL}/best-suburbs/${category}/${state.toLowerCase()}`;

  return {
    title,
    description,
    alternates: { canonical },
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
  const upperState = normaliseState(state);
  if (!upperState) notFound();

  const suburbs = await getRankedSuburbs(category, upperState, 50);

  return (
    <BestSuburbsListing
      category={category}
      state={upperState}
      suburbs={suburbs}
      useStaticStateRoutes
    />
  );
}
