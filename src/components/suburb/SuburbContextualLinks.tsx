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

// Map state code → state-specific guides we have today.
function guidesForState(state: string | undefined): { label: string; href: string }[] {
  const stateLower = (state ?? "").toLowerCase();
  const links: { label: string; href: string }[] = [
    { label: "How much deposit do I need?", href: "/guides/how-much-deposit-to-buy-a-house" },
    { label: "Buying property in Australia", href: "/guides/buying-property-australia" },
  ];

  if (["nsw", "vic", "qld", "wa", "sa", "tas", "nt", "act"].includes(stateLower)) {
    links.unshift({
      label: `First home buyer guide, ${stateLower.toUpperCase()}`,
      href: `/guides/first-home-buyer-${stateLower}`,
    });
  }
  if (["nsw", "vic", "qld", "sa", "wa"].includes(stateLower)) {
    links.push({
      label: `Granny flat guide, ${stateLower.toUpperCase()}`,
      href: `/guides/granny-flat-guide-${stateLower}`,
    });
  }
  if (["nsw", "vic", "qld", "sa", "wa", "tas", "nt", "act"].includes(stateLower)) {
    links.push({
      label: `Renter's rights, ${stateLower.toUpperCase()}`,
      href: `/guides/renters-rights-${stateLower}`,
    });
  }
  return links.slice(0, 5);
}

export function SuburbContextualLinks({ suburb }: SuburbContextualLinksProps) {
  const { name, slug, state, nearbySuburbs } = suburb;
  const nearby = nearbySuburbs.slice(0, 6);
  const guideLinks = guidesForState(state);

  return (
    <div className="border-t border-line mt-16 pt-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">

        {/* For Sale */}
        <div>
          <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">For Sale</h3>
          <ul className="space-y-2">
            {[
              { label: `Houses for sale in ${name}`,    href: `/buy?suburb=${slug}&propertyType=house` },
              { label: `Units for sale in ${name}`,     href: `/buy?suburb=${slug}&propertyType=unit` },
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

        {/* Guides */}
        <div>
          <h3 className="text-xs font-sans font-medium text-ink uppercase tracking-[0.2em] mb-3">Guides</h3>
          <ul className="space-y-2">
            {guideLinks.map((l) => (
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
