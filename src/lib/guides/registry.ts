// Every published guide in one list: the static guides under
// src/app/(marketing)/guides/<slug>/page.tsx and the articles in
// src/lib/data/blog-posts. The guides sitemap, /guides, the category pages,
// the hubs' "Related guides" lists and the glossary's "Go deeper" links all
// read it, so a guide's title, URL and date are never typed twice and a
// retitled or refreshed guide changes everywhere at once.
//
// Static guides: title, description and dates come from the FRONTMATTER in
// each page.tsx, collected into src/lib/data/static-guides.json by
// scripts/guides/static-guide-manifest.ts (a test fails while that file
// differs from the pages). The eight cost-of-selling and eight stamp duty
// state guides build their frontmatter from data and are read here directly.
import manifest from "@/lib/data/static-guides.json";
import { blogPosts } from "@/lib/data/blogs";
import { COST_OF_SELLING_STATES } from "@/lib/data/cost-of-selling-state";
import { costOfSellingFrontmatter } from "@/lib/guides/cost-of-selling-frontmatter";
import { AUSTRALIAN_STATES } from "@/lib/data/stamp-duty-state";
import { stampDutyFrontmatter } from "@/lib/guides/stamp-duty-frontmatter";
import { categoryToSlug } from "@/lib/services/blog-service";

export type GuideKind = "guide" | "article";

export interface GuideEntry {
  slug: string;
  /** Path on this site, /guides/<slug>. */
  href: string;
  title: string;
  description: string;
  /** YYYY-MM-DD, as the page records it. */
  publishedAt: string;
  updatedAt?: string;
  /** "guide": a static guide page; "article": a blog or news post. */
  kind: GuideKind;
  /** An article's blog category ("Selling", "News"); unset for a static guide. */
  articleCategory?: string;
}

interface StaticGuideRecord {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
}

function staticEntry(r: StaticGuideRecord): GuideEntry {
  return {
    slug: r.slug,
    href: `/guides/${r.slug}`,
    title: r.title,
    description: r.description,
    publishedAt: r.publishedAt,
    ...(r.updatedAt ? { updatedAt: r.updatedAt } : {}),
    kind: "guide",
  };
}

const STATIC_GUIDES: GuideEntry[] = [
  ...(manifest.guides as StaticGuideRecord[]),
  ...COST_OF_SELLING_STATES.map((state) => costOfSellingFrontmatter(state)),
  ...AUSTRALIAN_STATES.map((state) => stampDutyFrontmatter(state)),
]
  .map(staticEntry)
  .sort((a, b) => a.slug.localeCompare(b.slug));

const ARTICLES: GuideEntry[] = blogPosts
  .map((p) => ({
    slug: p.slug,
    href: `/guides/${p.slug}`,
    title: p.title,
    description: p.excerpt,
    publishedAt: p.publishedAt,
    ...(p.updatedAt ? { updatedAt: p.updatedAt } : {}),
    kind: "article" as const,
    articleCategory: p.category,
  }))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));

/** Every published guide: static guides (by slug), then articles (newest first). */
export const ALL_GUIDES: readonly GuideEntry[] = [...STATIC_GUIDES, ...ARTICLES];

const BY_SLUG = new Map(ALL_GUIDES.map((g) => [g.slug, g]));

export function getGuide(slug: string): GuideEntry | undefined {
  return BY_SLUG.get(slug);
}

/** The guides for these slugs, in the order given; unknown slugs are skipped (a test keeps every list resolvable). */
export function resolveGuides(slugs: readonly string[]): GuideEntry[] {
  return slugs.map((s) => BY_SLUG.get(s)).filter((g): g is GuideEntry => g !== undefined);
}

/**
 * The date the page itself reports as dateModified: FRONTMATTER.updatedAt
 * falling back to publishedAt (GuideArticleLayout), an article's updatedAt
 * falling back to publishedAt (ArticleJsonLd). Undefined when the page
 * records no date, so the sitemap omits lastmod rather than invent one.
 */
export function guideLastModified(g: GuideEntry): string | undefined {
  return g.updatedAt || g.publishedAt || undefined;
}

// ─── Categories on /guides ────────────────────────────────────────────

export type GuideSectionId =
  | "first-home"
  | "buying"
  | "finance"
  | "selling"
  | "upgrading"
  | "investing"
  | "renovating"
  | "renters"
  | "market"
  | "more";

export interface GuideSection {
  /** Anchor on /guides (the five original ids are kept for old links). */
  id: GuideSectionId;
  label: string;
  blurb: string;
  icon: string;
  /** Static guides in reading order, the pillar first. Each static guide sits in exactly one section. */
  guides: readonly string[];
  /** Blog categories whose articles this section lists, newest first. */
  articleCategories: readonly string[];
  /** Blog category page (/guides/category/<slug>) that also lists this section's static guides. */
  categoryPage?: string;
}

const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as const;
const perState = (prefix: string) => STATES.map((s) => `${prefix}-${s}`);

export const GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: "first-home",
    label: "First home buyers",
    blurb: "Grants, schemes, deposits and LMI. Start with the national guide, then read the one for your state.",
    icon: "/images/icons/guide.svg",
    guides: [
      "first-home-buyer-guide",
      ...perState("first-home-buyer"),
      "first-home-owner-grant-australia",
      "first-home-guarantee",
      "help-to-buy-scheme-australia",
      "first-home-super-saver-scheme",
      "how-much-deposit-to-buy-a-house",
      "lenders-mortgage-insurance-guide",
      "first-home-buyer-mistakes-to-avoid",
    ],
    articleCategories: [],
    categoryPage: "Buying Guide",
  },
  {
    id: "buying",
    label: "Buying a home",
    blurb: "From the search to settlement: inspections, the contract, cooling-off, auctions and the offer.",
    icon: "/images/icons/map.svg",
    guides: [
      "buying-property-australia",
      "due-diligence-checklist-buying-a-house",
      "building-pest-inspection",
      "conveyancing-guide",
      "cooling-off-period-by-state-australia",
      "cooling-off-period-vic",
      "property-auction-guide",
      "how-to-negotiate-property-price-australia",
      "settlement-day-australia",
      "how-long-does-it-take-to-buy-a-house-australia",
      "best-time-to-buy-property-australia",
      "best-brisbane-suburbs-for-families-2026",
      "foreign-buyer-firb-guide",
    ],
    articleCategories: ["Buying Guide"],
    categoryPage: "Buying Guide",
  },
  {
    id: "finance",
    label: "Home loans and stamp duty",
    blurb: "What a lender will approve, how to structure the loan, and the duty each state charges on the purchase.",
    icon: "/images/icons/calculator.svg",
    guides: [
      "how-much-can-i-borrow-australia",
      "home-loan-pre-approval-australia",
      "how-to-choose-a-mortgage-broker",
      "fixed-vs-variable-rate-guide",
      "offset-accounts-explained-australia",
      ...perState("stamp-duty"),
    ],
    articleCategories: [],
    categoryPage: "Buying Guide",
  },
  {
    id: "selling",
    label: "Selling your home",
    blurb: "Picking an agent, what selling costs in each state, and how commission and the campaign work.",
    icon: "/images/icons/broker.svg",
    guides: [
      "how-to-sell-a-house-australia",
      "how-much-is-my-house-worth-australia",
      "how-to-choose-a-selling-agent",
      "questions-to-ask-a-real-estate-agent",
      "how-to-prepare-for-a-property-appraisal",
      "best-time-to-sell-a-house-australia",
      "auction-vs-private-treaty",
      "what-to-fix-before-selling-a-house",
      "home-staging-cost-australia",
      "cost-of-selling-a-house-australia",
      ...perState("cost-of-selling-a-house"),
      "real-estate-agent-fees-australia",
      "how-to-negotiate-real-estate-agent-commission",
      ...perState("real-estate-commission"),
    ],
    articleCategories: ["Selling"],
    categoryPage: "Selling",
  },
  {
    id: "upgrading",
    label: "Upgrading or downsizing",
    blurb: "When two transactions need to talk to each other: sell or buy first, bridging loans and their alternatives, deposit bonds, and downsizing.",
    icon: "/images/icons/people.svg",
    guides: ["sell-first-or-buy-first", "bridging-loans-guide", "bridging-loan-alternatives", "deposit-bonds", "downsizers-guide"],
    articleCategories: [],
  },
  {
    id: "investing",
    label: "Property investors",
    blurb: "Tax, yield and running costs: negative gearing, depreciation, SMSF property and granny flats.",
    icon: "/images/icons/growth.svg",
    guides: [
      "negative-gearing-australia",
      "property-depreciation-guide",
      "capital-growth-vs-cash-flow-australia",
      "house-vs-apartment-investment-australia",
      "rentvesting-australia",
      "property-management-fees-australia",
      "buyers-agent-cost-australia",
      "smsf-property-guide",
      "sydney-vs-melbourne-property-market",
      "granny-flat-guide-nsw",
      "granny-flat-guide-vic",
      "granny-flat-guide-qld",
      "granny-flat-guide-sa",
      "granny-flat-guide-wa",
    ],
    articleCategories: ["Investment"],
    categoryPage: "Investment",
  },
  {
    id: "renovating",
    label: "Renovating and building",
    blurb: "What the work costs and how to find a builder you can trust.",
    icon: "/images/icons/median.svg",
    guides: ["renovation-cost-australia-2026", "how-to-find-a-builder-australia"],
    articleCategories: [],
  },
  {
    id: "renters",
    label: "Renters",
    blurb: "Your rights as a tenant, state by state: bond, rent increases, repairs, entry, and ending a tenancy.",
    icon: "/images/icons/hazard.svg",
    guides: perState("renters-rights"),
    articleCategories: [],
  },
  {
    id: "market",
    label: "Market updates and news",
    blurb: "City market reports, rate decisions, budget changes and scheme news, newest first.",
    icon: "/images/icons/yield.svg",
    guides: [],
    articleCategories: ["Market Update", "News", "Suburb Guide"],
  },
];

export interface GuideSectionWithGuides {
  section: GuideSection;
  guides: GuideEntry[];
}

/**
 * The /guides listing: every published guide once, grouped by section.
 * A static guide no section names, or an article in a blog category no
 * section claims, lands in a trailing "More guides" group rather than
 * dropping off the page (tests/seo/guide-registry.test.ts keeps that
 * group empty).
 */
export function guidesBySection(): GuideSectionWithGuides[] {
  const placed = new Set<string>();
  const out: GuideSectionWithGuides[] = GUIDE_SECTIONS.map((section) => {
    const guides = [
      ...resolveGuides(section.guides).filter((g) => g.kind === "guide"),
      ...ARTICLES.filter((a) => a.articleCategory && section.articleCategories.includes(a.articleCategory)),
    ].filter((g) => !placed.has(g.slug));
    guides.forEach((g) => placed.add(g.slug));
    return { section, guides };
  });
  const rest = ALL_GUIDES.filter((g) => !placed.has(g.slug));
  if (rest.length > 0) {
    out.push({
      section: {
        id: "more",
        label: "More guides",
        blurb: "Guides not yet filed under a topic.",
        icon: "/images/icons/guide.svg",
        guides: [],
        articleCategories: [],
      },
      guides: rest,
    });
  }
  return out.filter((s) => s.guides.length > 0);
}

/**
 * Static guides a blog category page lists below its articles, grouped by
 * section ("Buying Guide" takes first home, buying, and loans and stamp
 * duty). Match on the category's URL slug so "Buying Guide" and
 * "buying-guide" agree.
 */
export function staticGuidesForCategoryPage(category: string): GuideSectionWithGuides[] {
  const slug = categoryToSlug(category);
  return GUIDE_SECTIONS.filter((s) => s.categoryPage && categoryToSlug(s.categoryPage) === slug)
    .map((section) => ({ section, guides: resolveGuides(section.guides).filter((g) => g.kind === "guide") }))
    .filter((s) => s.guides.length > 0);
}
