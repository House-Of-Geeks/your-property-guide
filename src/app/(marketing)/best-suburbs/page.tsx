import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Suburbs in Australia | Your Property Guide",
  description:
    "Discover the best Australian suburbs ranked by schools, growth, affordability, walkability, flood risk, and rental yield. Find your perfect suburb.",
  alternates: { canonical: `${SITE_URL}/best-suburbs` },
  openGraph: {
    url: `${SITE_URL}/best-suburbs`,
    title: "Best Suburbs in Australia | Your Property Guide",
    description:
      "Discover the best Australian suburbs ranked by schools, growth, affordability, walkability, flood risk, and rental yield.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const CATEGORIES = [
  {
    slug: "for-families",
    title: "Best for Families",
    description:
      "Top suburbs with the highest-rated schools (by ICSEA) and high proportions of family households.",
    icon: "/images/icons/people.svg",
  },
  {
    slug: "highest-growth",
    title: "Highest Growth",
    description:
      "Suburbs with the strongest annual house price growth, ideal for capital-gain focused buyers.",
    icon: "/images/icons/growth.svg",
  },
  {
    slug: "most-affordable",
    title: "Most Affordable",
    description:
      "Suburbs with the lowest median house prices, great entry points into the property market.",
    icon: "/images/icons/median.svg",
  },
  {
    slug: "most-walkable",
    title: "Most Walkable",
    description:
      "Suburbs with the highest walk scores, perfect for those who love living close to shops, cafes, and transport.",
    icon: "/images/icons/walkability.svg",
  },
  {
    slug: "lowest-flood-risk",
    title: "Lowest Flood Risk",
    description:
      "Suburbs assessed as low flood risk or with no hazard record, peace of mind for homeowners.",
    icon: "/images/icons/hazard.svg",
  },
  {
    slug: "best-rental-yield",
    title: "Best Rental Yield",
    description:
      "Suburbs with the highest gross rental yields, top picks for investment property buyers.",
    icon: "/images/icons/yield.svg",
  },
];

export default function BestSuburbsHubPage() {
  return (
    <>
      <CollectionPageJsonLd
        name="Best Suburbs Australia"
        description="Rankings of the best Australian suburbs by family-friendliness, growth, affordability, and more."
        url="/best-suburbs"
      />
      <BreadcrumbJsonLd items={[{ name: "Best Suburbs", url: "/best-suburbs" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-24">
          <div className="mb-10">
            <Breadcrumbs items={[{ label: "Best Suburbs" }]} />
          </div>

          {/* Magazine masthead */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              Six ranked lists
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Best suburbs
            </span>
          </div>

          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            The best suburbs, by{" "}
            <span className="italic font-light text-primary">what matters</span>{" "}
            to you.
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
            Six rankings across schools, growth, affordability, walkability,
            flood safety and rental yield. Built on real public data, with no
            marketing spin.
          </p>
        </div>
      </section>

      {/* Category cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(({ slug, title, description, icon }) => (
            <Link
              key={slug}
              href={`/best-suburbs/${slug}`}
              className="group rounded-2xl border border-line bg-surface-raised p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-surface-warm border border-line mb-4">
                <Image src={icon} alt="" width={32} height={32} aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl text-ink group-hover:text-primary transition-colors mb-2 leading-tight">
                {title}
              </h2>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5">{description}</p>
              <span className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors">
                Browse rankings →
              </span>
            </Link>
          ))}
        </div>

        {/* Methodology note */}
        <div className="mt-12 rounded-2xl border border-line bg-surface-warm p-6 text-sm font-sans text-ink-muted leading-relaxed">
          <p className="text-xs uppercase tracking-[0.25em] text-ink-subtle mb-2">Methodology</p>
          <p>
            Rankings are built from publicly available data, ACARA school scores, ABS Census
            demographics, Geoscience Australia flood risk assessments, and OpenStreetMap walkability
            indicators. Updated periodically.
          </p>
        </div>
      </div>
    </>
  );
}
