import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BUTTON_PRIMARY, HeroTitle, PhotoHero } from "@/components/premium";
import { guideFunnelHref } from "@/lib/guide-funnel";
import { subpageTabs, type SubpageAvailability, type SubpageTab, type SuburbSubpage } from "@/lib/suburb-subpages";

export type SuburbSubrouteTab = SubpageTab;

// Standard tab strip for the listing sub-routes and the rental market. Pass
// the active segment to mark its tab, and the suburb's availability
// (getSuburbSubpageAvailability): a tab is a link, so one is drawn only for
// a sub-page with something on it. Until 29 Sep 2026 all seven were drawn on
// every sub-page of every suburb, six of them to empty pages.
export type SuburbListingTab = SuburbSubpage;

export function getSuburbListingTabs(
  slug: string,
  active: SuburbListingTab,
  availability: SubpageAvailability,
): SuburbSubrouteTab[] {
  return subpageTabs(slug, active, availability);
}

interface SuburbSubrouteHeaderProps {
  suburb: { name: string; slug: string; state: string; postcode: string };
  /**
   * Kept for the listing sub-pages that still pass it ("Listings in").
   * Not drawn: the H1 says what the page is, and the location line under
   * the breadcrumbs says where.
   */
  eyebrow?: string;
  /** The H1. Say the query: "Frankston rental market", "Schools in Frankston". */
  title: React.ReactNode;
  /** The answer: one or two sentences with the figure people searched for, and its source. */
  subtitle?: React.ReactNode;
  /** Optional final breadcrumb leaf label (e.g. "Houses for Sale"). */
  breadcrumbLeaf?: string;
  /** Sibling sub-pages. Drawn from two tabs: the page being read alone is not navigation. */
  tabs?: readonly SuburbSubrouteTab[];
  /**
   * Key figures under the answer, left column. They sit on the dark hero:
   * text in ink tokens reads as is, and a white panel carries .tone-light.
   */
  children?: React.ReactNode;
  /**
   * The page's one action. Defaults to the selling guide button, under the
   * answer; a page's own action (a card or a form) sits beside the answer
   * on desktop and straight after it on a phone, as a white card (it is
   * wrapped in .tone-light). Pass null for none (a page whose form sits
   * right below the header).
   */
  action?: React.ReactNode | null;
  /** Recorded with a lead from the default action (?from=). */
  from?: string;
}

/**
 * Shared header for the sub-pages under /suburbs/[slug]. Answer first: the
 * H1 names the query, the subtitle answers it with a sourced figure, and the
 * one action sits beside it. Premium hero (BRAND.md section 11): the library
 * street photo under the flat charcoal overlay, decorative and never
 * captioned as the suburb, then the sub-page strip on white. Kept short so
 * the answer and the action fit a phone's first screen.
 */
export function SuburbSubrouteHeader({
  suburb,
  title,
  subtitle,
  breadcrumbLeaf,
  tabs,
  children,
  action,
  from,
}: SuburbSubrouteHeaderProps) {
  const defaultAction =
    action === undefined ? (
      <Link
        href={guideFunnelHref("selling", { suburb: suburb.slug, from })}
        className={`${BUTTON_PRIMARY} w-full sm:w-auto justify-center`}
      >
        Selling in {suburb.name}? Get the free guide
        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
      </Link>
    ) : null;

  return (
    <>
      <PhotoHero
        photo="street"
        breadcrumbs={[
          { label: "Suburbs", href: "/suburbs" },
          { label: suburb.name, href: `/suburbs/${suburb.slug}` },
          ...(breadcrumbLeaf ? [{ label: breadcrumbLeaf }] : []),
        ]}
        aside={action ? <div className="tone-light">{action}</div> : undefined}
      >
        <HeroTitle>{title}</HeroTitle>
        {subtitle && (
          <div className="mt-6 text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl [&_strong]:text-ink">
            {subtitle}
          </div>
        )}
        {children && <div className="mt-8">{children}</div>}
        {defaultAction && <div className="mt-8">{defaultAction}</div>}
      </PhotoHero>

      <nav aria-label={`${suburb.name} pages`} className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <ol className="flex items-center gap-6 min-w-max text-sm">
            <li>
              <Link
                href={`/suburbs/${suburb.slug}`}
                className="inline-flex items-center gap-1.5 py-3 font-medium text-ink hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                {suburb.name} profile
              </Link>
            </li>
            {tabs && tabs.length > 1 &&
              tabs.map((tab) => {
                const isActive = tab.active === true;
                return (
                  <li key={tab.href}>
                    <Link
                      href={tab.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex py-3 border-b-2 transition-colors ${
                        isActive
                          ? "border-ink text-ink font-semibold"
                          : "border-transparent text-ink-muted hover:text-ink"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
          </ol>
        </div>
      </nav>
    </>
  );
}

interface SubrouteActionCardProps {
  heading: string;
  body?: React.ReactNode;
  href: string;
  cta: string;
  /** Secondary links under the button: text links, never a second button. */
  children?: React.ReactNode;
  /** Small print, e.g. the fee disclosure. */
  note?: React.ReactNode;
}

/** The one action of a sub-page, as a white card beside the answer on the dark hero. */
export function SubrouteActionCard({ heading, body, href, cta, children, note }: SubrouteActionCardProps) {
  return (
    <div className="tone-light rounded-xl border border-line bg-white p-5 sm:p-6">
      <h2 className="font-display text-lg sm:text-xl font-bold text-ink leading-snug tracking-tight">{heading}</h2>
      {body && <div className="mt-1.5 font-sans text-sm sm:text-[15px] text-ink-muted leading-relaxed">{body}</div>}
      <Link href={href} className={`mt-4 ${BUTTON_PRIMARY} w-full sm:w-auto justify-center`}>
        {cta}
        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
      </Link>
      {children && <div className="mt-4 font-sans text-sm text-ink-muted leading-relaxed">{children}</div>}
      {note && <p className="mt-3 font-sans text-xs text-ink-subtle leading-relaxed">{note}</p>}
    </div>
  );
}
