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

export async function generateStaticParams() {
  // Skip prerender at build time — page body queries the DB.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  return VALID_CATEGORIES.map((category) => ({ category }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ state?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const { state } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as RankingCategory)) {
    return { title: "Not Found" };
  }

  const config = CATEGORY_CONFIG[category as RankingCategory];
  const upperState = state?.toUpperCase();
  const stateSuffix = upperState && (STATES as readonly string[]).includes(upperState)
    ? ` in ${upperState}`
    : " in Australia";
  const title = `${config.title}${stateSuffix} | Your Property Guide`;

  return {
    title,
    description: `${config.description} ${
      upperState ? `Filtered to ${upperState} suburbs only.` : ""
    }`.trim(),
    alternates: { canonical: `${SITE_URL}/best-suburbs/${category}` },
    openGraph: {
      url: `${SITE_URL}/best-suburbs/${category}`,
      title,
      description: config.description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BestSuburbsCategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const { state: stateParam } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as RankingCategory)) {
    notFound();
  }

  const cat = category as RankingCategory;
  const state =
    stateParam && (STATES as readonly string[]).includes(stateParam.toUpperCase())
      ? stateParam.toUpperCase()
      : null;

  const suburbs = await getRankedSuburbs(cat, state ?? undefined, 50);

  return (
    <BestSuburbsListing
      category={cat}
      state={state}
      suburbs={suburbs}
      // Use static state routes (/best-suburbs/[category]/[state]) for the
      // chips so users land on canonical SEO URLs rather than ?state= params.
      useStaticStateRoutes
    />
  );
}
