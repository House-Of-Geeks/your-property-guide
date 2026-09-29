import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getRankedSuburbs,
  getRankingEligibleCount,
  type RankingCategory,
} from "@/lib/services/suburb-rankings-service";
import { rankingNote } from "@/lib/ranking-notes";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  BestSuburbsListing,
  CATEGORY_CONFIG,
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
  // Skip prerender at build time, page body queries the DB.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  return VALID_CATEGORIES.map((category) => ({ category }));
}

// No `searchParams` here, on purpose. This is an ISR route with a dynamic
// segment and no build-time render; awaiting searchParams in one of those
// throws DYNAMIC_SERVER_USAGE at request time, and all six national pages
// answered 500 until 29 Sep 2026 (the same fault as the suburb /buy and /rent
// pages fixed on 5 Sep; tests/seo/isr-routes.test.ts now guards every route).
// The old `?state=` filter it served is dead: the state chips link to the
// static /best-suburbs/[category]/[state] pages, and a stray `?state=` URL
// renders this page, whose canonical is the national URL.
interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as RankingCategory)) {
    return { title: "Not Found" };
  }

  const config = CATEGORY_CONFIG[category as RankingCategory];
  const title = `${config.title} in Australia`;

  return {
    title,
    description: config.description,
    alternates: { canonical: `${SITE_URL}/best-suburbs/${category}` },
    openGraph: {
      url: `${SITE_URL}/best-suburbs/${category}`,
      // og titles don't get the root title.template — brand them explicitly
      title: `${title} | ${SITE_NAME}`,
      description: config.description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BestSuburbsCategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as RankingCategory)) {
    notFound();
  }

  const cat = category as RankingCategory;
  // One after the other: the runtime pool holds a single connection.
  const suburbs = await getRankedSuburbs(cat, undefined, 50);
  const eligible = await getRankingEligibleCount(cat, undefined);
  const note = rankingNote(cat, null, suburbs.length, eligible);

  return (
    <BestSuburbsListing
      category={cat}
      state={null}
      suburbs={suburbs}
      note={note}
      // Use static state routes (/best-suburbs/[category]/[state]) for the
      // chips so users land on canonical SEO URLs rather than ?state= params.
      useStaticStateRoutes
    />
  );
}
