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
  // Which listing sub-pages have stock (getSuburbSubpageAvailability). The
  // For Sale and For Rent columns link only to those, and are left out when
  // there are none: until 29 Sep 2026 every profile linked eight listing
  // pages, empty for all but 13 suburbs.
  availability: SubpageAvailability;
}

// Two columns on a phone; from there the grid follows the number of columns
// drawn, so four columns sit two by two on a tablet instead of three and one.
// Tailwind reads class names from the source, so each is spelt out.
const GRID_COLUMNS: Record<number, string> = {
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3 lg:grid-cols-6",
};

function nearbyName(slug: string): string {
  // Strip trailing state-postcode suffix (e.g. "-qld-4500") and title-case
  return slug
    .replace(/-[a-z]{2,3}-\d{4}$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Evergreen guide + calculator links for the lead-gen surface, split into
// buying and selling intent. A state-labelled link goes to that state's
// guide (buying 3.1 and 3.3 of the commercial intent review, 10 Oct 2026):
// until then "First home buyer guide, NSW" and the stamp duty link landed on
// the national pages, and the suburb template is the one surface that can
// give the eight state guides contextual, state-partitioned links. Without
// a known state the national pages stay.
export const STATE_GUIDE_STATES = new Set(["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"]);

export function buyingLinksForState(state: string | undefined): { label: string; href: string }[] {
  const stateUpper = (state ?? "").toUpperCase();
  const stateSlug = stateUpper.toLowerCase();
  const known = STATE_GUIDE_STATES.has(stateSlug);
  const firstHome = known
    ? { label: `First home buyer guide, ${stateUpper}`, href: `/guides/first-home-buyer-${stateSlug}` }
    : { label: "First home buyer guide", href: "/guides/first-home-buyer-guide" };
  const stampDuty = known
    ? { label: `${stateUpper} stamp duty calculator`, href: `/guides/stamp-duty-${stateSlug}` }
    : { label: "Stamp duty calculator", href: "/stamp-duty-calculator" };
  return [
    firstHome,
    { label: "How much deposit to buy a house", href: "/guides/how-much-deposit-to-buy-a-house" },
    { label: "Buying property in Australia", href: "/guides/buying-property-australia" },
    { label: "Borrowing power calculator", href: "/borrowing-power-calculator" },
    stampDuty,
  ];
}

// States with a dedicated commission guide at /guides/real-estate-commission-{slug}.
const COMMISSION_GUIDE_STATES = STATE_GUIDE_STATES;

export function sellingLinksForState(state: string | undefined): { label: string; href: string }[] {
  const stateUpper = (state ?? "").toUpperCase();
  const stateSlug = stateUpper.toLowerCase();
  // The state-labelled anchor should land on the state commission page, not
  // the national hub — the suburb template is the only surface that can give
  // the eight state pages contextual, state-partitioned internal links.
  const agentFees = COMMISSION_GUIDE_STATES.has(stateSlug)
    ? { label: `Real estate agent fees, ${stateUpper}`, href: `/guides/real-estate-commission-${stateSlug}` }
    : { label: "Real estate agent fees", href: "/guides/real-estate-agent-fees-australia" };
  return [
    { label: "How to sell a house in Australia", href: "/guides/how-to-sell-a-house-australia" },
    agentFees,
    { label: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first" },
    { label: "Commission calculator", href: "/real-estate-commission-calculator" },
    { label: "Free property appraisal", href: "/appraisal" },
  ];
}

export function SuburbContextualLinks({ suburb, availability }: SuburbContextualLinksProps) {
  const { name, slug, state, postcode, nearbySuburbs } = suburb;
  const nearby = nearbySuburbs.slice(0, 6);
  const buyingLinks = buyingLinksForState(state);
  const sellingLinks = sellingLinksForState(state);
  // Canonical static sub-pages, not /buy?suburb=… query-param URLs:
  // query-param variants split link equity and aren't the indexed canonical
  // for these property-type queries.
  const forSaleLinks = [
    { show: availability.houses,     label: `Houses for sale in ${name}`,     href: `/suburbs/${slug}/houses` },
    { show: availability.units,      label: `Units for sale in ${name}`,      href: `/suburbs/${slug}/units` },
    { show: availability.townhouses, label: `Townhouses for sale in ${name}`, href: `/suburbs/${slug}/townhouses` },
    { show: availability.land,       label: `Land for sale in ${name}`,       href: `/suburbs/${slug}/land` },
    { show: availability.buy,        label: `All properties for sale in ${name}`, href: `/suburbs/${slug}/buy` },
  ].filter((l) => l.show);
  const columns = 3 + (forSaleLinks.length > 0 ? 1 : 0) + (availability.rent ? 1 : 0) + (nearby.length > 0 ? 1 : 0);

  return (
    <div className="border-t border-line mt-16 pt-10">
      <div className={`grid grid-cols-2 ${GRID_COLUMNS[columns]} gap-8`}>

        {/* For Sale: the listing pages that have stock */}
        {forSaleLinks.length > 0 && (
          <div>
            <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">For Sale</h3>
            <ul className="space-y-2">
              {forSaleLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-sm text-ink-muted hover:text-primary transition-colors leading-snug block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* For Rent: only when rentals are listed */}
        {availability.rent && (
          <div>
            <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">For Rent</h3>
            <ul className="space-y-2">
              {[
                { label: `Houses for rent in ${name}`,    href: `/rent?suburb=${slug}&propertyType=house` },
                { label: `Units for rent in ${name}`,     href: `/rent?suburb=${slug}&propertyType=unit` },
                { label: `All rentals in ${name}`,        href: `/suburbs/${slug}/rent` },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-sm text-ink-muted hover:text-primary transition-colors leading-snug block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suburb */}
        <div>
          <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">{name}</h3>
          <ul className="space-y-2">
            {[
              { label: `${name} suburb profile`,  href: `/suburbs/${slug}` },
              { label: `Schools in ${name}`,      href: `/suburbs/${slug}#schools` },
              { label: `Market data for ${name}`, href: `/suburbs/${slug}#market` },
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
              { label: "Find a local expert",     href: `/find-an-expert?suburb=${slug}` },
              { label: "Get a free appraisal",   href: `/appraisal` },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-sans text-sm text-ink-muted hover:text-primary transition-colors leading-snug block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Buying */}
        <div>
          <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">Buying</h3>
          <ul className="space-y-2">
            {buyingLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-sans text-sm text-ink-muted hover:text-primary transition-colors leading-snug block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Selling */}
        <div>
          <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">Selling</h3>
          <ul className="space-y-2">
            {sellingLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-sans text-sm text-ink-muted hover:text-primary transition-colors leading-snug block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Surrounding Suburbs */}
        {nearby.length > 0 && (
          <div>
            <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">Surrounding Suburbs</h3>
            <ul className="space-y-2">
              {nearby.map((nearSlug) => (
                <li key={nearSlug}>
                  <Link href={`/suburbs/${nearSlug}`} className="font-sans text-sm text-ink-muted hover:text-primary transition-colors leading-snug block">
                    {nearbyName(nearSlug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Compare prompt: drives users into the high-SEO-value compare page. */}
      {nearby.length > 0 && (
        <div className="mt-12 rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
            Side by side
          </p>
          <h3 className="font-display text-2xl text-ink mb-3 leading-tight">
            Compare {name} <span className="italic text-primary">vs</span> a nearby suburb
          </h3>
          <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5 max-w-2xl">
            See median prices, growth, schools, walkability and risk side by side
            in one view.
          </p>
          <div className="flex flex-wrap gap-2">
            {nearby.slice(0, 8).map((nearSlug) => (
              <Link
                key={nearSlug}
                href={`/suburbs/${slug}/vs/${nearSlug}`}
                className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
              >
                vs {nearbyName(nearSlug)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
