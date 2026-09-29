import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { SuburbMatchButton } from "./SuburbMatchButton";
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
  // Eyebrow above the H1, e.g. "Listings in", "Schools in", "Rental market in".
  eyebrow: string;
  // The H1.
  title: React.ReactNode;
  // Subtitle line below H1, optional.
  subtitle?: React.ReactNode;
  // Optional final breadcrumb leaf label (e.g. "Houses for Sale"). When set,
  // breadcrumbs render Suburbs > {suburb name} > {leaf}.
  breadcrumbLeaf?: string;
  // Optional tab strip across the bottom of the header. Drawn from two tabs:
  // the page being read alone is not navigation (the profile link above is).
  tabs?: readonly SuburbSubrouteTab[];
}

// Shared editorial header for any sub-page under /suburbs/[slug]. Carries the
// suburb-page visual language down through the children: warm-cream surface,
// faint contour SVG behind the copy, Playfair display H1, optional tab strip
// of sibling sub-routes for fast switching.

export function SuburbSubrouteHeader({
  suburb,
  eyebrow,
  title,
  subtitle,
  breadcrumbLeaf,
  tabs,
}: SuburbSubrouteHeaderProps) {
  return (
    <section className="relative bg-surface-warm border-b border-line overflow-hidden">
      <Image
        src="/images/illustrations/contour.svg"
        alt=""
        width={1200}
        height={800}
        aria-hidden="true"
        className="absolute -right-32 -top-32 w-[1000px] max-w-none opacity-[0.10] pointer-events-none select-none"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Suburbs", href: "/suburbs" },
              { label: suburb.name, href: `/suburbs/${suburb.slug}` },
              ...(breadcrumbLeaf ? [{ label: breadcrumbLeaf }] : []),
            ]}
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-9">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                {eyebrow}
              </span>
              <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                {suburb.name} {suburb.state} {suburb.postcode}
              </span>
            </div>
            <h1 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium max-w-[20ch]">
              {title}
            </h1>
            {subtitle && (
              <p className="font-display font-light text-lg sm:text-xl text-ink leading-snug max-w-2xl mt-5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="lg:col-span-3 lg:text-right space-y-3">
            {/* Above-the-fold guide CTA. Same button as the main suburb-page
                hero, deep-links the selling-guide funnel with this suburb
                pre-answered. Visitors landing on a listings sub-page from
                Google ("[suburb] houses for sale" etc.) are mid-decision;
                give them a one-click path into the funnel. */}
            <div className="lg:flex lg:justify-end">
              <SuburbMatchButton suburbSlug={suburb.slug} suburbName={suburb.name} />
            </div>
            <Link
              href={`/suburbs/${suburb.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {suburb.name} profile
            </Link>
          </div>
        </div>

        {tabs && tabs.length > 1 && (
          <nav
            aria-label={`${suburb.name} sub-pages`}
            className="mt-8 -mb-2 overflow-x-auto"
          >
            <ol className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const isActive = tab.active === true;
                return (
                  <li key={tab.href}>
                    <Link
                      href={tab.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`
                        inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors
                        ${isActive
                          ? "bg-ink text-white"
                          : "bg-surface-raised border border-line-strong text-ink-muted hover:border-ink hover:text-ink"}
                      `}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}
