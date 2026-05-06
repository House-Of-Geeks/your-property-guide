import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getRankedSuburbs,
  type RankingCategory,
} from "@/lib/services/suburb-rankings-service";
import { SITE_URL } from "@/lib/constants";
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

// Pre-render every category × state combination at build time so they ship as
// static HTML for crawlers. 6 × 8 = 48 SEO permutations targeting long-tail
// queries like "highest growth suburbs Queensland".
export async function generateStaticParams() {
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

  const title = `${config.title.replace(" Suburbs", "")} suburbs in ${stateName} (${upperState}) | Your Property Guide`;
  const description = `${config.description} Filtered to ${stateName} suburbs only.`;

  const canonical = `${SITE_URL}/best-suburbs/${category}/${state.toLowerCase()}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title,
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
