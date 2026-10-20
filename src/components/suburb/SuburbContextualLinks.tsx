import Link from "next/link";
import type { SubpageAvailability } from "@/lib/suburb-subpages";

interface SuburbContextualLinksProps {
  suburb: {
    name: string;
    slug: string;
    state?: string;
    postcode?: string;
    nearbySuburbs: string[];
  };
  // Which sub-pages have something on them (getSuburbSubpageAvailability):
  // the rental market row is drawn only with a rental row. The For Sale and
  // For Rent listing columns went with the listing sub-pages on 14 Oct 2026
  // (docs/portal-consolidation-2026-10-14.md).
  availability: SubpageAvailability;
}

function nearbyName(slug: string): string {
  // Strip trailing state-postcode suffix (e.g. "-qld-4500") and title-case
  return slug
    .replace(/-[a-z]{2,3}-\d{4}$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Evergreen guide + calculator links for the lead-gen surface, split into
// buying and selling intent. State label personalises the two state-aware
// rows; the destinations are the canonical national guides.
function buyingLinksForState(state: string | undefined): { label: string; href: string }[] {
  const stateUpper = (state ?? "").toUpperCase();
  const firstHome = stateUpper
    ? `First home buyer guide, ${stateUpper}`
    : "First home buyer guide";
  return [
    { label: firstHome, href: "/guides/first-home-buyer-guide" },
    { label: "How much deposit to buy a house", href: "/guides/how-much-deposit-to-buy-a-house" },
    { label: "Buying property in Australia", href: "/guides/buying-property-australia" },
    { label: "Borrowing power calculator", href: "/borrowing-power-calculator" },
    { label: "Stamp duty calculator", href: "/stamp-duty-calculator" },
  ];
}

// States with dedicated guides at /guides/real-estate-commission-{slug} and
// /guides/cost-of-selling-a-house-{slug}.
const STATE_GUIDE_STATES = new Set(["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"]);

function sellingLinksForState(state: string | undefined): { label: string; href: string }[] {
  const stateUpper = (state ?? "").toUpperCase();
  const stateSlug = stateUpper.toLowerCase();
  // The state-labelled anchors land on the state pages, not the national
  // hubs: the suburb template is the only surface that can give the state
  // guides contextual, state-partitioned internal links (and Bing ranks
  // them for the seller searches that become leads).
  const hasStateGuides = STATE_GUIDE_STATES.has(stateSlug);
  const agentFees = hasStateGuides
    ? { label: `Agent fees and commission in ${stateUpper}`, href: `/guides/real-estate-commission-${stateSlug}` }
    : { label: "Real estate agent fees", href: "/guides/real-estate-agent-fees-australia" };
  const costOfSelling = hasStateGuides
    ? { label: `Cost of selling a house in ${stateUpper}`, href: `/guides/cost-of-selling-a-house-${stateSlug}` }
    : { label: "Cost of selling a house", href: "/guides/cost-of-selling-a-house-australia" };
  return [
    agentFees,
    costOfSelling,
    { label: "How to sell a house in Australia", href: "/guides/how-to-sell-a-house-australia" },
    { label: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first" },
    { label: "Commission calculator", href: "/real-estate-commission-calculator" },
    { label: "Free property appraisal", href: "/appraisal" },
  ];
}

// Desktop columns by the number of link groups drawn, so no group sits alone
// on a second row. Tailwind reads class names from the source: spelt out.
const LG_COLUMNS: Record<number, string> = {
  3: "lg:grid-cols-3",
  5: "lg:grid-cols-5",
};

const LINK = "font-sans text-[15px] text-ink-muted hover:text-ink underline-offset-4 hover:underline leading-snug";

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[15px] font-sans font-semibold text-ink mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={LINK}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The related-links block at the foot of a suburb profile: the suburb's
 * own pages, its neighbours (profiles and side-by-side comparisons), the
 * seller guides for its state and the buyer tools. One tidy block, so the
 * neighbours are linked once here rather than in three places up the page.
 */
export function SuburbContextualLinks({ suburb, availability }: SuburbContextualLinksProps) {
  const { name, slug, state, postcode, nearbySuburbs } = suburb;
  const nearby = nearbySuburbs.slice(0, 10);
  const compare = nearbySuburbs.slice(0, 6);
  const buyingLinks = buyingLinksForState(state);
  const sellingLinks = sellingLinksForState(state);
  const stateUpper = (state ?? "").toUpperCase();

  const suburbLinks = [
    { label: `${name} house prices`, href: `/suburbs/${slug}#market` },
    ...(availability["rental-market"]
      ? [{ label: `${name} rental market`, href: `/suburbs/${slug}/rental-market` }]
      : []),
    { label: `Schools in ${name}`, href: `/suburbs/${slug}#schools` },
    // Postcode pages rank for "{suburb} postcode" queries but had
    // zero inlinks from their member suburbs — this row gives every
    // postcode page contextual internal equity from its suburbs.
    ...(postcode
      ? [{ label: `All suburbs in ${postcode}`, href: `/postcodes/${postcode}` }]
      : []),
    // Points at the match funnel, not /agents — the agent
    // directory is paused (placeholder profiles only) per Andy,
    // 2026-07-03, and the funnel converts better anyway.
    { label: `Real estate agents in ${name}`, href: `/suburbs/${slug}/agents` },
    { label: "Find a local expert", href: `/find-an-expert?suburb=${slug}` },
  ];

  const groups = 3 + (nearby.length > 0 ? 2 : 0);

  return (
    <section aria-labelledby="related-heading" className="border-t border-line pt-10 sm:pt-12">
      <h2 id="related-heading" className="font-display text-2xl sm:text-3xl font-normal text-ink leading-tight tracking-[-0.02em] mb-8">
        More on {name} and nearby
      </h2>
      <div className={`grid grid-cols-2 ${LG_COLUMNS[groups]} gap-x-6 sm:gap-x-8 gap-y-10`}>
        <LinkColumn title={name} links={suburbLinks} />

        {nearby.length > 0 && (
          <LinkColumn
            title="Nearby suburbs"
            links={nearby.map((s) => ({ label: nearbyName(s), href: `/suburbs/${s}` }))}
          />
        )}

        {/* Compare: drives readers into the side-by-side pages. */}
        {compare.length > 0 && (
          <LinkColumn
            title="Compare side by side"
            links={compare.map((s) => ({ label: `${name} vs ${nearbyName(s)}`, href: `/suburbs/${slug}/vs/${s}` }))}
          />
        )}

        <LinkColumn title={stateUpper ? `Selling in ${stateUpper}` : "Selling"} links={sellingLinks} />

        <LinkColumn title="Buying" links={buyingLinks} />
      </div>
    </section>
  );
}
