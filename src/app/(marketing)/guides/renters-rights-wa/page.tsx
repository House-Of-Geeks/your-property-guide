import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Renter's Rights in Western Australia: Complete Guide (2026) | ${SITE_NAME}`,
  description:
    "WA tenant rights explained: bond, rent increases, repairs, entry rights, and ending a tenancy under the Residential Tenancies Act 1987. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/renters-rights-wa` },
  openGraph: {
    url: `${SITE_URL}/guides/renters-rights-wa`,
    title: "Renter's Rights in Western Australia: Complete Guide (2026)",
    description:
      "WA tenant rights explained: bond, rent increases, repairs, entry rights, and ending a tenancy under the Residential Tenancies Act 1987. Updated 2026.",
    type: "article",
  },
};

export default function RentersRightsWAPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Renter's Rights Western Australia", url: "/guides/renters-rights-wa" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Renter's Rights Western Australia" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 8 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Renter&apos;s Rights in Western Australia: Complete Guide (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Legal disclaimer:</strong> This guide provides general information only and is not
          legal advice. Always verify current rules with WA Consumer Protection or a tenancy advocate
          before taking action.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#act" className="hover:underline">The WA Residential Tenancies Act 1987</a></li>
            <li><a href="#bond" className="hover:underline">Bond rules</a></li>
            <li><a href="#rent-increases" className="hover:underline">Rent increases</a></li>
            <li><a href="#repairs" className="hover:underline">Repairs and maintenance</a></li>
            <li><a href="#entry-rights" className="hover:underline">Landlord entry rights</a></li>
            <li><a href="#ending-tenancy" className="hover:underline">Ending a tenancy</a></li>
            <li><a href="#disputes" className="hover:underline">Resolving disputes</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="act" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The WA Residential Tenancies Act 1987</h2>
          <p className="text-gray-600 mb-4">
            The <strong>Residential Tenancies Act 1987 (WA)</strong> is the primary legislation
            governing residential tenancies in Western Australia. While WA has not introduced the
            sweeping reforms seen in Victoria and Queensland, tenants still have significant legal
            protections.
          </p>
          <p className="text-gray-600 mb-4">
            The Act is administered by <strong>WA Consumer Protection</strong> (part of the Department
            of Mines, Industry Regulation and Safety). Unlike eastern states, WA does not have a
            dedicated tenancy tribunal — disputes go to the Magistrates Court.
          </p>
          <p className="text-gray-600 mb-4">
            Note: The WA government has been reviewing its tenancy laws — check Consumer Protection WA
            for any recent amendments.
          </p>

          <h2 id="bond" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bond Rules</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum bond:</strong> For most properties, the maximum is <strong>4 weeks rent</strong>.
              For furnished properties or those with weekly rent above a set threshold, up to 6 weeks
              may be requested — check the current threshold with Consumer Protection WA.
            </li>
            <li>
              <strong>Lodgement:</strong> The bond must be lodged with the <strong>Bond Administrator</strong>
              (Department of Mines, Industry Regulation and Safety) within 14 days of receipt.
            </li>
            <li>
              <strong>Refund:</strong> If both parties agree, the bond is refunded at the end of
              the tenancy. Disputes go to the Magistrates Court.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Always complete the property condition report and take photos on day one. In WA,
            &quot;fair wear and tear&quot; cannot be claimed from the bond — only damage beyond normal use.
          </p>

          <h2 id="rent-increases" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rent Increases</h2>
          <p className="text-gray-600 mb-4">
            WA&apos;s rent increase rules differ from most other states:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Periodic tenancies:</strong> At least <strong>60 days written notice</strong>
              is required. Unlike NSW, QLD, and VIC, WA does not have a statutory minimum of
              12 months between increases for periodic tenancies — though this may change. Always
              verify the current rule.
            </li>
            <li>
              <strong>Fixed-term tenancies:</strong> Rent can only be increased if the amount (or
              method of calculation) is specified in the tenancy agreement.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            There is no cap on the amount of any rent increase. The Perth rental market has experienced
            significant growth — make sure you research comparable rents in your suburb before
            negotiating with your landlord.
          </p>

          <h2 id="repairs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Repairs and Maintenance</h2>
          <p className="text-gray-600 mb-4">
            Landlords are required to maintain the property in a reasonable state of repair.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Urgent repairs (e.g. burst pipe, gas leak, roof damage after storm, electrical fault)
            must be addressed immediately. If you cannot contact the landlord or agent, you may
            arrange urgent repairs and seek reimbursement up to $1,000.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Non-urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            The landlord must carry out non-urgent repairs within a reasonable time after receiving
            written notice. Always put repair requests in writing. If the landlord fails to act,
            you can apply to the Magistrates Court for a repair order.
          </p>

          <h2 id="entry-rights" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Landlord Entry Rights</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Routine inspections:</strong> Maximum <strong>4 per year</strong>. The landlord
              must give between <strong>7 and 14 days written notice</strong>.
            </li>
            <li>
              <strong>Other entry (e.g. repairs):</strong> At least <strong>24 hours notice</strong>
              is required.
            </li>
            <li>
              <strong>Emergency:</strong> No notice required for a genuine emergency.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Landlords must not enter at unreasonable times. Entry is generally permitted between
            8am and 6pm. If a landlord enters without proper notice, document it and raise it with
            Consumer Protection WA.
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
                  <td className="p-3 border border-gray-200">Fixed term — end of term</td>
                  <td className="p-3 border border-gray-200">30 days</td>
                  <td className="p-3 border border-gray-200">30 days</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Periodic — no grounds</td>
                  <td className="p-3 border border-gray-200">21 days</td>
                  <td className="p-3 border border-gray-200">60 days</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Periodic — significant breach</td>
                  <td className="p-3 border border-gray-200">—</td>
                  <td className="p-3 border border-gray-200">7–14 days (varies)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mb-4">
            WA still allows no-grounds evictions for periodic tenancies (60 days notice). If you are
            served with a notice to vacate that you believe is retaliatory (e.g. after making a
            repair request), seek advice from Consumer Protection WA.
          </p>
          <p className="text-gray-600 mb-4">
            Breaking a fixed-term lease early may require you to compensate the landlord for
            re-letting costs and any period where the property remains vacant. Check your agreement
            and seek advice from a tenancy advocate.
          </p>

          <h2 id="disputes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resolving Disputes</h2>
          <p className="text-gray-600 mb-4">
            Unlike eastern states, WA does not have a dedicated residential tenancy tribunal. Disputes
            are handled through:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Consumer Protection WA:</strong> Offers free conciliation and mediation for
              tenancy disputes. Contact 1300 304 054.
            </li>
            <li>
              <strong>Magistrates Court:</strong> For disputes that cannot be resolved through
              mediation, including bond claims and repair orders.
            </li>
          </ul>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources and Contacts</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Consumer Protection WA</strong>:{" "}
              <a href="https://www.commerce.wa.gov.au/consumer-protection/renting" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">commerce.wa.gov.au/consumer-protection</a>
            </li>
            <li>
              <strong>Tenancy WA</strong> — Free advice and advocacy:{" "}
              <a href="https://www.tenancywa.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tenancywa.org.au</a>
            </li>
            <li>
              <strong>Bond Administrator WA:</strong> 1300 304 054
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Renting in WA?</strong> Browse{" "}
              <Link href="/rent" className="underline hover:text-blue-900">Perth and WA rentals</Link>{" "}
              or explore suburb profiles to compare local rent prices.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/renters-rights-nsw" className="text-primary hover:underline">Renter&apos;s Rights in NSW</Link></li>
              <li><Link href="/guides/renters-rights-vic" className="text-primary hover:underline">Renter&apos;s Rights in Victoria</Link></li>
              <li><Link href="/guides/renters-rights-qld" className="text-primary hover:underline">Renter&apos;s Rights in Queensland</Link></li>
              <li><Link href="/guides/renters-rights-sa" className="text-primary hover:underline">Renter&apos;s Rights in South Australia</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
