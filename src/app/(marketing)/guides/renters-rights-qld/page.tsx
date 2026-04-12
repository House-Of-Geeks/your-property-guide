import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Renter's Rights in Queensland: Complete Guide (2026) | ${SITE_NAME}`,
  description:
    "Queensland tenant rights explained: bond, rent increases, repairs, entry, pets, and 2024 tenancy reforms. Includes RTA and QCAT dispute info. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/renters-rights-qld` },
  openGraph: {
    url: `${SITE_URL}/guides/renters-rights-qld`,
    title: "Renter's Rights in Queensland: Complete Guide (2026)",
    description:
      "Queensland tenant rights explained: bond, rent increases, repairs, entry, pets, and 2024 tenancy reforms. Includes RTA and QCAT dispute info. Updated 2026.",
    type: "article",
  },
};

export default function RentersRightsQLDPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Renter's Rights Queensland", url: "/guides/renters-rights-qld" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Renter's Rights Queensland" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 10 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Renter&apos;s Rights in Queensland: Complete Guide (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Legal disclaimer:</strong> This guide provides general information only and is not
          legal advice. Queensland tenancy law was significantly updated in 2024 — always verify
          current rules with the RTA (rta.qld.gov.au) before taking action.
        </div>

        {/* Key highlight */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-800">
          <strong>2024 QLD reforms:</strong> Queensland introduced new laws in 2024 requiring
          landlords to have valid grounds for ending a tenancy (similar to Victoria&apos;s 2021 reforms)
          and making it harder to unreasonably refuse pets. Check{" "}
          <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer" className="underline">rta.qld.gov.au</a>{" "}
          for the latest position on implementation.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#act" className="hover:underline">The QLD Residential Tenancies Act</a></li>
            <li><a href="#bond" className="hover:underline">Bond rules</a></li>
            <li><a href="#rent-increases" className="hover:underline">Rent increases</a></li>
            <li><a href="#repairs" className="hover:underline">Repairs and maintenance</a></li>
            <li><a href="#entry-rights" className="hover:underline">Landlord entry rights</a></li>
            <li><a href="#pets" className="hover:underline">Pet ownership (2024 reforms)</a></li>
            <li><a href="#ending-tenancy" className="hover:underline">Ending a tenancy</a></li>
            <li><a href="#grounds-reform" className="hover:underline">Grounds for ending tenancy (2024)</a></li>
            <li><a href="#disputes" className="hover:underline">Resolving disputes: RTA &amp; QCAT</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="act" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The QLD Residential Tenancies and Rooming Accommodation Act 2008</h2>
          <p className="text-gray-600 mb-4">
            The <strong>Residential Tenancies and Rooming Accommodation Act 2008 (QLD)</strong> is the
            primary legislation covering residential tenancies in Queensland. It covers standard
            residential tenancies (houses and apartments) as well as rooming accommodation (boarding
            houses, student accommodation).
          </p>
          <p className="text-gray-600 mb-4">
            The Act is administered by the <strong>Residential Tenancies Authority (RTA)</strong>,
            which also provides dispute resolution services and manages rental bonds. Queensland
            significantly updated its tenancy laws in 2024, introducing new grounds-based eviction
            rules and enhanced pet rights.
          </p>

          <h2 id="bond" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bond Rules</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum bond:</strong> 4 weeks rent. The landlord cannot request more unless
              the weekly rent exceeds a set threshold (check the RTA for current limits).
            </li>
            <li>
              <strong>Lodgement:</strong> The bond must be lodged with the <strong>RTA</strong> within
              10 days of the tenancy agreement starting. You should receive a receipt.
            </li>
            <li>
              <strong>Refund:</strong> At the end of the tenancy, both parties can agree to a bond
              refund via the RTA&apos;s online system. If there is a dispute, you apply to the RTA
              dispute resolution service or QCAT.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Complete a detailed property condition report on move-in and request a signed copy.
            Take dated photographs. This is critical for bond refunds.
          </p>

          <h2 id="rent-increases" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rent Increases</h2>
          <p className="text-gray-600 mb-4">
            Queensland&apos;s rent increase rules:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Frequency:</strong> No more than <strong>once every 12 months</strong> for
              any tenancy (whether fixed term or periodic).
            </li>
            <li>
              <strong>Notice:</strong> The landlord must give at least <strong>2 months (60 days)
              written notice</strong> before any rent increase.
            </li>
            <li>
              For fixed-term agreements, the amount of any increase must be specified in the agreement
              — the landlord cannot unilaterally increase rent during a fixed term.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Queensland does not cap the amount of rent increases, only their frequency and notice
            requirements. If you believe an increase is excessive, you can seek advice from the RTA.
          </p>

          <h2 id="repairs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Repairs and Maintenance</h2>
          <p className="text-gray-600 mb-4">
            Queensland categorises repairs into three levels:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Emergency repairs</h3>
          <p className="text-gray-600 mb-4">
            Must be addressed <strong>immediately</strong>. Examples: burst water pipe, gas leak,
            serious roof damage after storm, breakdown of essential services. If the landlord cannot
            be contacted, tenants can arrange emergency repairs themselves up to $300 and claim
            reimbursement.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Must be attended to within <strong>24 to 48 hours</strong> of notification. Examples:
            broken water heater, fridge failure (if included in lease), broken pool gate.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Non-urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Should be addressed within a <strong>reasonable time</strong> — typically 7 days after
            written notice for minor repairs, longer for complex works. Always request repairs in
            writing and keep copies.
          </p>

          <h2 id="entry-rights" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Landlord Entry Rights</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Routine inspections:</strong> Maximum <strong>4 per year</strong>; the first
              inspection cannot occur until at least <strong>3 months after the tenancy starts</strong>.
              <strong> 7 days written notice</strong> is required.
            </li>
            <li>
              <strong>General entry for repairs:</strong> 24 hours notice required.
            </li>
            <li>
              <strong>Emergency:</strong> No notice required for genuine emergencies.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Entry must occur between 8am and 6pm on any day except Sundays and public holidays
            (unless the tenant agrees). Landlords must not enter more than is reasonably necessary.
          </p>

          <h2 id="pets" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pet Ownership — 2024 Reforms</h2>
          <p className="text-gray-600 mb-4">
            Following the 2024 reforms, Queensland landlords <strong>cannot unreasonably refuse</strong>
            a tenant&apos;s request to keep a pet. Acceptable reasons for refusal include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>The type of pet is unsuitable for the property (e.g. a large dog in a small unit)</li>
            <li>Body corporate by-laws prohibit pets</li>
            <li>The number of pets would be unreasonable for the property</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Landlords must respond to a pet request within 14 days. If they refuse, they must provide
            written reasons. Tenants can dispute an unreasonable refusal through the RTA.
          </p>

          <h2 id="ending-tenancy" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ending a Tenancy</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Situation</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Tenant notice</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Landlord notice</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="p-3 border border-gray-200">End of fixed term</td>
                  <td className="p-3 border border-gray-200">2 weeks (14 days)</td>
                  <td className="p-3 border border-gray-200">Must have valid reason (post-2024)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Periodic — no grounds (pre-2024 rules)</td>
                  <td className="p-3 border border-gray-200">2 weeks</td>
                  <td className="p-3 border border-gray-200">2 months (transitional)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">With grounds (e.g. serious breach)</td>
                  <td className="p-3 border border-gray-200">—</td>
                  <td className="p-3 border border-gray-200">1 month (or as specified)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mb-4">
            Check with the RTA for current notice periods as transitional provisions from the 2024
            reforms may still apply.
          </p>

          <h2 id="grounds-reform" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Grounds for Ending Tenancy — 2024 Reforms</h2>
          <p className="text-gray-600 mb-4">
            Queensland introduced legislation in 2024 requiring landlords to have valid grounds
            to end a tenancy — moving towards the model adopted by Victoria in 2021. Valid grounds
            include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Property sold requiring vacant possession</li>
            <li>Owner or family member moving into the property</li>
            <li>Major renovations or demolition</li>
            <li>Serious or repeated breach of the agreement by the tenant</li>
          </ul>
          <p className="text-gray-600 mb-4">
            The implementation of these reforms was being phased in as of April 2026. Visit{" "}
            <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">rta.qld.gov.au</a>{" "}
            for the current status of all 2024 reform provisions.
          </p>

          <h2 id="disputes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resolving Disputes: RTA &amp; QCAT</h2>
          <p className="text-gray-600 mb-4">
            Queensland has a two-step dispute resolution process:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>RTA Dispute Resolution Service:</strong> Free, phone-based conciliation service
              available to both landlords and tenants. Most disputes are resolved here without
              going to tribunal.
            </li>
            <li>
              <strong>QCAT (Queensland Civil and Administrative Tribunal):</strong> If conciliation
              fails, either party can apply to QCAT for a formal decision. Applications can be
              lodged online.
            </li>
          </ol>
          <p className="text-gray-600 mb-4">
            Contact the RTA Dispute Resolution Service on 1800 512 888.
          </p>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources and Contacts</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Residential Tenancies Authority (RTA)</strong>:{" "}
              <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">rta.qld.gov.au</a>
            </li>
            <li>
              <strong>Tenants Queensland</strong> — Free advice:{" "}
              <a href="https://www.tenantsqld.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tenantsqld.org.au</a>
            </li>
            <li>
              <strong>QCAT</strong>:{" "}
              <a href="https://www.qcat.qld.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">qcat.qld.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Renting in Queensland?</strong> Browse{" "}
              <Link href="/rent" className="underline hover:text-blue-900">Queensland rentals</Link>{" "}
              or explore our{" "}
              <Link href="/suburbs" className="underline hover:text-blue-900">suburb profiles</Link>{" "}
              including local schools and amenity data.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/renters-rights-nsw" className="text-primary hover:underline">Renter&apos;s Rights in NSW</Link></li>
              <li><Link href="/guides/renters-rights-vic" className="text-primary hover:underline">Renter&apos;s Rights in Victoria</Link></li>
              <li><Link href="/guides/renters-rights-wa" className="text-primary hover:underline">Renter&apos;s Rights in Western Australia</Link></li>
              <li><Link href="/guides/renters-rights-sa" className="text-primary hover:underline">Renter&apos;s Rights in South Australia</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
