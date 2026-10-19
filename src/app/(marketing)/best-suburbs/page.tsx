import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Best Suburbs in Australia",
  description:
    "Discover the best Australian suburbs ranked by schools, growth, affordability, walkability, flood risk, and rental yield. Find your perfect suburb.",
  alternates: { canonical: `${SITE_URL}/best-suburbs` },
  openGraph: { ...DEFAULT_OG,
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

      <PhotoHero photo="market" breadcrumbs={[{ label: "Best Suburbs" }]}>
        <p className="text-sm text-ink-muted mb-5">
          Six ranked lists &middot; Best suburbs
        </p>
        <HeroTitle>
          The best suburbs, by{" "}
          <span>what matters</span>{" "}
          to you
        </HeroTitle>
        <HeroLead>
          Six rankings across schools, growth, affordability, walkability,
          flood safety and rental yield. Built on real public data, with no
          marketing spin.
        </HeroLead>
      </PhotoHero>

      {/* Category cards */}
      <Band tone="quiet" spacing="compact">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(({ slug, title, description, icon }) => (
            <Link
              key={slug}
              href={`/best-suburbs/${slug}`}
              className="group flex flex-col rounded-xl border border-line bg-surface-raised p-6 hover:border-ink transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-surface-warm border border-line mb-5">
                <Image src={icon} alt="" width={32} height={32} aria-hidden="true" />
              </div>
              <h2 className="text-2xl text-ink leading-tight tracking-[-0.02em] group-hover:text-primary transition-colors mb-2">
                {title}
              </h2>
              <p className="text-base text-ink-muted leading-relaxed">{description}</p>
              <span className="mt-auto pt-6 text-base font-semibold text-ink group-hover:text-primary transition-colors">
                Browse rankings →
              </span>
            </Link>
          ))}
        </div>

        {/* Methodology note */}
        <div className="mt-10 max-w-3xl border-t border-line pt-6 text-sm text-ink-muted leading-relaxed">
          <p className="text-sm font-semibold text-ink mb-2">Methodology</p>
          <p>
            Rankings are built from publicly available data, ACARA school scores, ABS Census
            demographics, Geoscience Australia flood risk assessments, and OpenStreetMap walkability
            indicators. Updated periodically.
          </p>
        </div>
      </Band>
    </>
  );
}
