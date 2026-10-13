import type { Metadata } from "next";
import { OffMarketTeaser } from "@/components/property/OffMarketTeaser";
import { OffMarketRegisterForm } from "@/components/forms/OffMarketRegisterForm";
import { BreadcrumbJsonLd } from "@/components/seo";
import { unstable_cache } from "next/cache";
import { getOffMarketProperties } from "@/lib/services/property-service";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

// The listings come from the DB. As a static ISR page this served its
// build-time render (the build is DB-free: "0 live listings") for up to a
// day after every deploy, so a listing added in that window stayed hidden.
// Render on request instead and cache the listings for an hour, the pattern
// /regions uses.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Off-Market Properties",
  description: "Access exclusive off-market properties across Australia. Register to receive alerts for properties not listed on public portals.",
  alternates: { canonical: `${SITE_URL}/off-market` },
  openGraph: { url: `${SITE_URL}/off-market`, title: "Off-Market Properties", description: "Access exclusive off-market properties across Australia. Register to receive alerts for properties not listed on public portals.", type: "website" },
  twitter: { card: "summary_large_image" },
};

// The data cache outlives a deploy, so the deployment is part of the key:
// a listing's shape changes with the code that renders it.
const getCachedOffMarket = unstable_cache(
  () => getOffMarketProperties(),
  ["off-market:v1", process.env.VERCEL_DEPLOYMENT_ID ?? "local"],
  { revalidate: 3600, tags: ["off-market"] },
);

export default async function OffMarketPage() {
  const offMarketProperties = await getCachedOffMarket();

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Off-Market", url: "/off-market" }]} />

      <PhotoHero photo="verandah" breadcrumbs={[{ label: "Off-Market" }]}>
        <p className="text-sm text-ink-muted mb-5">
          {offMarketProperties.length} current {offMarketProperties.length === 1 ? "listing" : "listings"}
        </p>
        <HeroTitle>
          Properties <span>before they hit the market</span>
        </HeroTitle>
        <HeroLead>
          Off-market opportunities not listed on realestate.com.au or Domain.
          Register your brief and we&apos;ll email you matching off-market properties.
          Your details are never passed to agents.
        </HeroLead>

        {/* Stat row */}
        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-6 max-w-2xl">
          <div>
            <p className="text-3xl font-bold text-ink leading-none tracking-[-0.03em]">
              {offMarketProperties.length}
            </p>
            <p className="text-sm text-ink-muted mt-2">
              live listings
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-ink leading-none tracking-[-0.03em]">Instant</p>
            <p className="text-sm text-ink-muted mt-2">
              email alerts
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-ink leading-none tracking-[-0.03em]">Free</p>
            <p className="text-sm text-ink-muted mt-2">
              no obligation
            </p>
          </div>
        </div>
      </PhotoHero>

      <Band tone="quiet" spacing="compact">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Teasers */}
          <div className="lg:col-span-2">
            <SectionHeading size="md" title="Current off-market listings" />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {offMarketProperties.map((property) => (
                <OffMarketTeaser key={property.id} property={property} />
              ))}
            </div>
          </div>

          {/* Register form */}
          <div>
            <div className="rounded-xl bg-surface-raised border border-line p-6 sticky top-24">
              <p className="text-sm text-ink-subtle mb-2">
                Private brief
              </p>
              <h3 className="text-2xl text-ink mb-2 leading-tight">
                Register for access
              </h3>
              <p className="text-base text-ink-muted leading-relaxed mb-6">
                Tell us what you&apos;re looking for and we&apos;ll match you with off-market opportunities.
              </p>
              <OffMarketRegisterForm />
            </div>
          </div>
        </div>
      </Band>
    </>
  );
}
