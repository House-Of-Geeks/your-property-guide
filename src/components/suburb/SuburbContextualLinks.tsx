import Link from "next/link";

interface SuburbContextualLinksProps {
  suburb: {
    name: string;
    slug: string;
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

export function SuburbContextualLinks({ suburb }: SuburbContextualLinksProps) {
  const { name, slug, nearbySuburbs } = suburb;
  const nearby = nearbySuburbs.slice(0, 6);

  return (
    <div className="border-t border-gray-200 mt-16 pt-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">

        {/* For Sale */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">For Sale</h3>
          <ul className="space-y-2">
            {[
              { label: `Houses for sale in ${name}`,    href: `/buy?suburb=${slug}&propertyType=house` },
              { label: `Units for sale in ${name}`,     href: `/buy?suburb=${slug}&propertyType=unit` },
              { label: `All properties for sale in ${name}`, href: `/suburbs/${slug}/buy` },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-gray-500 hover:text-primary transition-colors leading-snug block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Rent */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">For Rent</h3>
          <ul className="space-y-2">
            {[
              { label: `Houses for rent in ${name}`,    href: `/rent?suburb=${slug}&propertyType=house` },
              { label: `Units for rent in ${name}`,     href: `/rent?suburb=${slug}&propertyType=unit` },
              { label: `All rentals in ${name}`,        href: `/suburbs/${slug}/rent` },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-gray-500 hover:text-primary transition-colors leading-snug block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Suburb */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">{name}</h3>
          <ul className="space-y-2">
            {[
              { label: `${name} suburb profile`,  href: `/suburbs/${slug}` },
              { label: `Schools in ${name}`,      href: `/suburbs/${slug}#schools` },
              { label: `Market data for ${name}`, href: `/suburbs/${slug}#market` },
              { label: "Find a local agent",      href: `/agents` },
              { label: "Get a free appraisal",   href: `/appraisal` },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-gray-500 hover:text-primary transition-colors leading-snug block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Surrounding Suburbs */}
        {nearby.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Surrounding Suburbs</h3>
            <ul className="space-y-2">
              {nearby.map((nearSlug) => (
                <li key={nearSlug}>
                  <Link href={`/suburbs/${nearSlug}`} className="text-sm text-gray-500 hover:text-primary transition-colors leading-snug block">
                    {nearbyName(nearSlug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
