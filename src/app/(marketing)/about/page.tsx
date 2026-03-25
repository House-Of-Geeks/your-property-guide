import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo";
import { SITE_NAME } from "@/lib/constants";
import { Home, Users, TrendingUp, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: "Your Property Guide is the Moreton Bay region's dedicated property portal. Learn about our mission to connect buyers with local agents.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={[{ name: "About", url: "/about" }]} />
      <Breadcrumbs items={[{ label: "About" }]} />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">About Your Property Guide</h1>

        <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
          <p>
            Your Property Guide is the Moreton Bay region&apos;s dedicated property portal, built to serve the unique needs
            of buyers, sellers, and renters across suburbs like Burpengary, Caboolture, Narangba, Morayfield,
            Deception Bay, and North Lakes.
          </p>
          <p>
            Unlike the big national portals, we focus exclusively on the Moreton Bay corridor. This means deeper
            local insights, stronger agent relationships, and access to properties you won&apos;t find anywhere else
            &mdash; including our exclusive off-market listings.
          </p>
          <p>
            We partner with trusted local agencies and agents who know every street, school, and shopping
            centre in their suburbs. When you enquire through Your Property Guide, you&apos;re connected directly
            with the agent who knows the area best.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10">
          {[
            { icon: <Home className="w-6 h-6" />, title: "Local Focus", desc: "Dedicated to the Moreton Bay region" },
            { icon: <Users className="w-6 h-6" />, title: "Trusted Agents", desc: "Verified local professionals" },
            { icon: <TrendingUp className="w-6 h-6" />, title: "Market Data", desc: "Real-time suburb insights" },
            { icon: <Shield className="w-6 h-6" />, title: "Off-Market", desc: "Exclusive pre-market access" },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-lg gradient-brand text-white flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
