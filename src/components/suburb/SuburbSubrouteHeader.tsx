import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { SuburbMatchButton } from "./SuburbMatchButton";

export interface SuburbSubrouteTab {
  label: string;
  href: string;
  active?: boolean;
}

// Standard listing-tab strip for the 6 listing sub-routes. Pass the active
// segment to mark the corresponding tab.
export type SuburbListingTab =
  | "buy"
  | "rent"
  | "houses"
  | "units"
  | "townhouses"
  | "land"
  | "rental-market";

export function getSuburbListingTabs(slug: string, active: SuburbListingTab): SuburbSubrouteTab[] {
  const items: { label: string; key: SuburbListingTab; href: string }[] = [
    { label: "For sale",      key: "buy",            href: `/suburbs/${slug}/buy` },
    { label: "For rent",      key: "rent",           href: `/suburbs/${slug}/rent` },
    { label: "Houses",        key: "houses",         href: `/suburbs/${slug}/houses` },
    { label: "Units",         key: "units",          href: `/suburbs/${slug}/units` },
    { label: "Townhouses",    key: "townhouses",     href: `/suburbs/${slug}/townhouses` },
    { label: "Land",          key: "land",           href: `/suburbs/${slug}/land` },
    { label: "Rental market", key: "rental-market",  href: `/suburbs/${slug}/rental-market` },
  ];
  return items.map((i) => ({ label: i.label, href: i.href, active: i.key === active }));
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
  // Optional tab strip across the bottom of the header.
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

        {tabs && tabs.length > 0 && (
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
