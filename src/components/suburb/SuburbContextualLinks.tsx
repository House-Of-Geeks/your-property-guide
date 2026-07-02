import Link from "next/link";

interface SuburbContextualLinksProps {
  suburb: {
    name: string;
    slug: string;
    state?: string;
    nearbySuburbs: string[];
  };
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

function sellingLinksForState(state: string | undefined): { label: string; href: string }[] {
  const stateUpper = (state ?? "").toUpperCase();
  const agentFees = stateUpper
    ? `Real estate agent fees, ${stateUpper}`
    : "Real estate agent fees";
  return [
    { label: "How to sell a house in Australia", href: "/guides/how-to-sell-a-house-australia" },
    { label: agentFees, href: "/guides/real-estate-agent-fees-australia" },
    { label: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first" },
    { label: "Commission calculator", href: "/real-estate-commission-calculator" },
    { label: "Free property appraisal", href: "/appraisal" },
  ];
}

export function SuburbContextualLinks({ suburb }: SuburbContextualLinksProps) {
  const { name, slug, state, nearbySuburbs } = suburb;
  const nearby = nearbySuburbs.slice(0, 6);
  const buyingLinks = buyingLinksForState(state);
  const sellingLinks = sellingLinksForState(state);

  return (
    <div className="border-t border-line mt-16 pt-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">

        {/* For Sale */}
        <div>
          <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">For Sale</h3>
          <ul className="space-y-2">
            {/* Canonical static sub-pages, not /buy?suburb=… query-param
                URLs — query-param variants split link equity and aren't
                the indexed canonical for these property-type queries. */}
            {[
              { label: `Houses for sale in ${name}`,     href: `/suburbs/${slug}/houses` },
              { label: `Units for sale in ${name}`,      href: `/suburbs/${slug}/units` },
              { label: `Townhouses for sale in ${name}`, href: `/suburbs/${slug}/townhouses` },
              { label: `Land for sale in ${name}`,       href: `/suburbs/${slug}/land` },
              { label: `All properties for sale in ${name}`, href: `/suburbs/${slug}/buy` },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-sans text-sm text-ink-muted hover:text-primary transition-colors leading-snug block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Rent */}
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

        {/* Suburb */}
        <div>
          <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">{name}</h3>
          <ul className="space-y-2">
            {[
              { label: `${name} suburb profile`,  href: `/suburbs/${slug}` },
              { label: `Schools in ${name}`,      href: `/suburbs/${slug}#schools` },
              { label: `Market data for ${name}`, href: `/suburbs/${slug}#market` },
              { label: "Find a local agent",      href: `/agents?suburb=${slug}` },
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
