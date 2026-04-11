import type { Metadata } from "next";
import { Lock, Eye, Bell, Shield } from "lucide-react";
import { OffMarketTeaser } from "@/components/property/OffMarketTeaser";
import { OffMarketRegisterForm } from "@/components/forms/OffMarketRegisterForm";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getOffMarketProperties } from "@/lib/services/property-service";
import { SITE_URL } from "@/lib/constants";

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Off-Market", url: "/off-market" }]} />
      <Breadcrumbs items={[{ label: "Off-Market" }]} />

      {/* Hero */}
      <div className="gradient-brand rounded-2xl p-8 sm:p-12 text-white mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-6 h-6" />
            <span className="text-sm font-medium uppercase tracking-wider">Exclusive Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Off-Market Properties</h1>
          <p className="text-lg text-white/90 mt-3">
            Get first access to properties before they hit the open market. Our agents have exclusive listings
            that you won&apos;t find on realestate.com.au or Domain.
          </p>
          <div className="flex flex-wrap gap-6 mt-6">
            <Stat icon={<Eye className="w-5 h-5" />} value={offMarketProperties.length} label="Off-market listings" />
            <Stat icon={<Bell className="w-5 h-5" />} value="Instant" label="Email alerts" />
            <Stat icon={<Shield className="w-5 h-5" />} value="Free" label="No obligation" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Teasers */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Current Off-Market Listings ({offMarketProperties.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {offMarketProperties.map((property) => (
              <OffMarketTeaser key={property.id} property={property} />
            ))}
          </div>
        </div>

        {/* Register form */}
        <div>
          <div className="rounded-xl bg-white shadow-card border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Register for Access</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tell us what you&apos;re looking for and we&apos;ll match you with off-market opportunities.
            </p>
            <OffMarketRegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="font-bold text-lg">{value}</p>
        <p className="text-xs text-white/80">{label}</p>
      </div>
    </div>
  );
}
