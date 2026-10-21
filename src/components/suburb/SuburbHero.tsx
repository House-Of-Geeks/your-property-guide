import Link from "next/link";
import type { ReactNode } from "react";
import { HeroTitle, PhotoHero } from "@/components/premium";
import { SuburbSearch } from "./SuburbSearch";
import type { Suburb } from "@/types";
import { hasLga, isCapitalCouncil, lgaCouncilName } from "@/lib/utils/lga";
import { slugify } from "@/lib/utils/slug";
import { formatUpdatedDate } from "@/lib/suburb-dates";

interface SuburbHeroProps {
  suburb: Suburb;
  /** The Greater-capital the suburb sits in, for the place line and the city market link. */
  capitalCity?: { name: string; slug: string } | null;
  /** When a feed last refreshed this suburb's data; the "Updated" line is drawn only when there is one. */
  updatedAt?: Date | string | null;
  /** The answer: the published median (or why there is none) and the next step. */
  children: ReactNode;
  /**
   * Supporting figures: beside the answer on a wide screen, under it on a
   * phone. It sits on the dark hero, so a white card carries .tone-light.
   */
  aside?: ReactNode;
}

// The first screen of a suburb profile (Oct 2026 layout). Three quarters of
// the template's searches are lookups ("{suburb} postcode", "{suburb} median
// house price"), so it answers them before anything else: the H1 carries the
// suburb, state and postcode (the form every ranking rival uses), the line
// under it places the suburb, and the page passes in the median with its
// source and the next step. The satellite iframe that sat here was the
// page's LCP and its heaviest request, and moved to a click-to-load map in
// the Location section. Premium hero (BRAND.md section 11, 13 Oct 2026): the
// library street photo under the flat charcoal overlay. The photo is
// generic and decorative (alt ""), never this suburb, so it is never
// captioned as one.
const LINK = "text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink";

export function SuburbHero({ suburb, capitalCity, updatedAt, children, aside }: SuburbHeroProps) {
  const lga = hasLga(suburb);
  const regionLabel = lga ? lgaCouncilName(suburb.region) : null;
  // "Greater {capital}" only where the capital is this suburb's own council,
  // or no LGA is known: a suburb in another council's area is not placed in
  // the capital's.
  const capitalLink = capitalCity && (!lga || isCapitalCouncil(suburb.region, capitalCity)) ? capitalCity : null;
  const updated = updatedAt ? formatUpdatedDate(updatedAt) : null;
  return (
    <PhotoHero
      photo="street"
      breadcrumbs={[
        { label: "Suburbs", href: "/suburbs" },
        { label: `${suburb.name} ${suburb.state} ${suburb.postcode}` },
      ]}
      aside={aside}
    >
      <HeroTitle>{`${suburb.name}, ${suburb.state} ${suburb.postcode}`}</HeroTitle>
      <p className="mt-4 text-base sm:text-lg text-ink-muted leading-relaxed">
        {regionLabel && (
          <Link href={`/regions/${slugify(suburb.region)}`} className={LINK}>
            {regionLabel}
          </Link>
        )}
        {regionLabel && capitalLink && <span aria-hidden="true"> · </span>}
        {capitalLink && (
          <Link href={`/property-market/${capitalLink.slug}`} className={LINK}>
            {`Greater ${capitalLink.name}`}
          </Link>
        )}
        {(regionLabel || capitalLink) && <span aria-hidden="true"> · </span>}
        <Link href={`/postcodes/${suburb.postcode}`} className={LINK}>
          {`All suburbs in postcode ${suburb.postcode}`}
        </Link>
      </p>
      {updated && (
        <p className="mt-2 text-sm text-ink-subtle">
          Updated <time dateTime={updated.iso}>{updated.label}</time>
        </p>
      )}
      {children}
    </PhotoHero>
  );
}

export interface SuburbSectionLink {
  label: string;
  href: string;
}

/**
 * The in-page section bar, straight under the hero, with the suburb search
 * at its right (from sm; it sat beside the breadcrumbs before the photo
 * hero). Sticks under the site header (64px on a phone, 72px from sm),
 * which sits above it (z-50): at top-0 it slid under the header and
 * vanished. Sections give themselves scroll-mt-32 / sm:scroll-mt-36 so a
 * jump lands below both bars.
 */
export function SuburbSectionNav({ links }: { links: readonly SuburbSectionLink[] }) {
  return (
    <div className="sticky top-16 sm:top-[72px] z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex items-center gap-4">
        <nav aria-label="On this page" className="min-w-0 flex-1">
          <ul className="flex overflow-x-auto px-2 sm:px-0 sm:-mx-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((l) => (
              <li key={l.href} className="shrink-0">
                <a
                  href={l.href}
                  className="block px-3 py-3 text-sm font-medium text-ink-muted hover:text-ink border-b-2 border-transparent hover:border-ink transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SuburbSearch />
      </div>
    </div>
  );
}
