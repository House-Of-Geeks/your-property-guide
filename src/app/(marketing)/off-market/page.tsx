import type { Metadata } from "next";
import Image from "next/image";
import { OffMarketTeaser } from "@/components/property/OffMarketTeaser";
import { OffMarketRegisterForm } from "@/components/forms/OffMarketRegisterForm";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getOffMarketProperties } from "@/lib/services/property-service";
import { SITE_URL } from "@/lib/constants";

// ISR — DB-querying services have build-phase guards, so we cache for 24h
// instead of running a function on every visit.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Off-Market Properties",
  description: "Access exclusive off-market properties across Australia. Register to receive alerts for properties not listed on public portals.",
  alternates: { canonical: `${SITE_URL}/off-market` },
  openGraph: { url: `${SITE_URL}/off-market`, title: "Off-Market Properties", description: "Access exclusive off-market properties across Australia. Register to receive alerts for properties not listed on public portals.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function OffMarketPage() {
  const offMarketProperties = await getOffMarketProperties();

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Off-Market", url: "/off-market" }]} />

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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Off-Market" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {offMarketProperties.length} current {offMarketProperties.length === 1 ? "listing" : "listings"}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Properties <span className="italic text-primary">before they hit the market</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Off-market opportunities not listed on realestate.com.au or Domain.
            Register your brief and our agents will match you privately.
          </p>

          {/* Stat row */}
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6 max-w-2xl">
            <div>
              <p className="font-display text-2xl text-ink leading-none">
                {offMarketProperties.length}
              </p>
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mt-1.5">
                live listings
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink leading-none">Instant</p>
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mt-1.5">
                email alerts
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink leading-none">Free</p>
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mt-1.5">
                no obligation
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Teasers */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-ink mb-6 pb-2 border-b border-line">
              Current off-market listings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {offMarketProperties.map((property) => (
                <OffMarketTeaser key={property.id} property={property} />
              ))}
            </div>
          </div>

          {/* Register form */}
          <div>
            <div className="rounded-2xl bg-surface-raised border border-line p-6 sticky top-24">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                Private brief
              </p>
              <h3 className="font-display text-xl text-ink mb-2 leading-tight">
                Register for access
              </h3>
              <p className="font-sans text-sm text-ink-muted mb-6">
                Tell us what you&apos;re looking for and we&apos;ll match you with off-market opportunities.
              </p>
              <OffMarketRegisterForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
