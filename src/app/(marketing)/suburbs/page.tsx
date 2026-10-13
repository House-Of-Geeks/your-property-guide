import type { Metadata } from "next";
import { Suspense } from "react";
import { CloudSun, Footprints, GraduationCap, House, ShieldAlert, TrendingUp } from "lucide-react";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { SuburbsResults } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the SuburbsResults Suspense child below so the parent stays in the CDN
// cache while only the dynamic results chunk re-renders per state/query.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Browse All Australian Suburbs | Property Data & Profiles",
  description: "Search every Australian suburb for property market data, median prices, school catchments, climate, walkability, and local insights.",
  alternates: { canonical: `${SITE_URL}/suburbs` },
  openGraph: { url: `${SITE_URL}/suburbs`, title: "Browse All Australian Suburbs", description: "Search every Australian suburb for property market data.", type: "website" },
  twitter: { card: "summary_large_image" },
};

// What every profile carries. Line icons in the primary colour (they sat on
// the grey band as two-tone SVGs that vanish on the charcoal hero).
const FEATURES = [
  { icon: House,         title: "Median",  note: "house & unit prices" },
  { icon: TrendingUp,    title: "12mo",    note: "growth & trend" },
  { icon: GraduationCap, title: "Schools", note: "primary & secondary" },
  { icon: Footprints,    title: "Walk",    note: "score & transit" },
  { icon: ShieldAlert,   title: "Risk",    note: "flood, bushfire, crime" },
  { icon: CloudSun,      title: "Climate", note: "temp, rain, sun" },
] as const;

interface PageProps {
  searchParams: Promise<{ state?: string; q?: string; count?: string }>;
}

export default function SuburbsPage({ searchParams }: PageProps) {
  return (
    <>
      <CollectionPageJsonLd
        name="Browse All Australian Suburbs"
        description="Search every Australian suburb for property market data, median prices, school catchments, and local insights."
        url="/suburbs"
      />
      <BreadcrumbJsonLd items={[{ name: "Suburbs", url: "/suburbs" }]} />

      {/* Premium hero (BRAND.md section 11): the library street photo, a
          generic street that is decorative and never captioned as a place. */}
      <PhotoHero photo="street" breadcrumbs={[{ label: "Suburbs" }]}>
        <p className="text-[13px] font-sans text-ink-subtle mb-5">
          Every Australian suburb
        </p>
        <HeroTitle>
          Australian suburbs, <span>data and all</span>
        </HeroTitle>
        <HeroLead>
          Median prices, growth, schools, walk score, climate, hazard and
          crime. Sourced and dated. No paywall, no sign-up, no email gate.
        </HeroLead>

        <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-6 border-t border-line pt-8">
          {FEATURES.map(({ icon: Icon, title, note }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon className="w-6 h-6 mt-0.5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">{title}</p>
                <p className="font-sans text-[13px] text-ink-subtle">{note}</p>
              </div>
            </li>
          ))}
        </ul>
      </PhotoHero>

      <Band spacing="compact">
        <Suspense fallback={null}>
          <SuburbsResults searchParams={searchParams} />
        </Suspense>
      </Band>
    </>
  );
}
