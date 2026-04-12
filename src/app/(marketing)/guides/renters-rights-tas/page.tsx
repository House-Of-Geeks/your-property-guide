import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Renter's Rights in Tasmania: Complete Guide for Tenants (2026) | ${SITE_NAME}`,
  description:
    "Complete guide to tenant rights in Tasmania. Bond rules, rent increases (42 days notice, 12 months between), inspections, repairs, ending a tenancy, and how to resolve disputes through CBOS and the Magistrates Court. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/renters-rights-tas` },
  openGraph: {
    url: `${SITE_URL}/guides/renters-rights-tas`,
    title: "Renter's Rights in Tasmania: Complete Guide for Tenants (2026)",
    description:
      "Complete guide to tenant rights in Tasmania. Bond rules, rent increases (42 days notice, 12 months between), inspections, repairs, ending a tenancy, and how to resolve disputes through CBOS and the Magistrates Court. Updated 2026.",
    type: "article",
  },
};

export default function RentersRightsTasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Renter's Rights Tasmania", url: "/guides/renters-rights-tas" },
        ]}
      />
      <GuideArticleJsonLd
        title="Renter's Rights in Tasmania: Complete Guide for Tenants (2026)"
        description="Complete guide to tenant rights in Tasmania. Bond rules, rent increases (42 days notice, 12 months between), inspections, repairs, ending a tenancy, and how to resolve disputes through CBOS and the Magistrates Court. Updated 2026."
        url="/guides/renters-rights-tas"
        datePublished="2026-04-01"
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Renter's Rights Tasmania" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 9 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Renter&apos;s Rights in Tasmania: Complete Guide for Tenants (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Legal disclaimer:</strong> This guide provides general information only and is
          not legal advice. Laws change — always verify current rules with Consumer, Building and
          Occupational Services Tasmania (cbos.tas.gov.au) or the Tenants&apos; Union of Tasmania before
          taking action.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#rta" className="hover:underline">The Residential Tenancy Act 1997 (Tas)</a></li>
            <li><a href="#lease-types" className="hover:underline">Lease types</a></li>
            <li><a href="#bond" className="hover:underline">Bond rules and the Rental Deposit Authority</a></li>
            <li><a href="#rent-increases" className="hover:underline">Rent increases</a></li>
            <li><a href="#inspections" className="hover:underline">Routine inspections</a></li>
            <li><a href="#repairs" className="hover:underline">Repairs and maintenance</a></li>
            <li><a href="#ending-tenancy" className="hover:underline">Ending a tenancy</a></li>
            <li><a href="#disputes" className="hover:underline">Resolving disputes</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="rta" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Residential Tenancy Act 1997 (Tasmania)</h2>
          <p className="text-gray-600 mb-4">
            Tasmania&apos;s residential tenancy laws are governed by the{" "}
            <strong>Residential Tenancy Act 1997</strong>. This legislation establishes the rights
            and obligations of both landlords and tenants throughout the tenancy — from the initial
            rental agreement through to bond refunds and dispute resolution.
          </p>
          <p className="text-gray-600 mb-4">
            The Act is administered by <strong>Consumer, Building and Occupational Services (CBOS)</strong>,
            a division of the Department of Justice. CBOS provides information, assistance, and
            dispute resolution support for Tasmanian renters and landlords.
          </p>
          <p className="text-gray-600 mb-4">
            The Act applies to most residential tenancies in Tasmania, including houses, units,
            apartments, and rooms in share houses. Some categories — such as social housing and
            holiday lettings — may have different rules.
          </p>

          <h2 id="lease-types" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lease Types</h2>
          <p className="text-gray-600 mb-4">
            Residential tenancies in Tasmania can be:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Fixed term tenancy:</strong> A lease with a defined start and end date,
              typically 6 or 12 months. During this period, the landlord cannot end the tenancy
              without grounds, and the tenant cannot vacate without a break fee (unless exemptions
              apply such as family violence).
            </li>
            <li>
              <strong>Periodic tenancy:</strong> A rolling tenancy with no defined end date. Fixed
              term leases commonly convert to periodic once they expire if no new lease is signed.
              Either party can end a periodic tenancy with the correct notice.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Always ensure you have a written tenancy agreement. While verbal agreements are
            technically valid under the Act, a written agreement provides clarity and is essential
            evidence if a dispute arises.
          </p>

          <h2 id="bond" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bond Rules and the Rental Deposit Authority</h2>
          <p className="text-gray-600 mb-4">
            In Tasmania, a bond (security deposit) may be required at the start of a tenancy.
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum bond:</strong> 4 weeks rent. A landlord cannot legally request more.
            </li>
            <li>
              <strong>Lodgement:</strong> The landlord must lodge the bond with the{" "}
              <strong>Rental Deposit Authority (RDA)</strong>, which operates under Consumer,
              Building and Occupational Services (CBOS). The bond must be lodged within
              a specified timeframe and you should receive confirmation.
            </li>
            <li>
              <strong>Condition report:</strong> Complete a detailed condition report at the
              start of the tenancy. Both parties should sign it. This report is your primary
              evidence in any bond dispute at the end of the tenancy.
            </li>
            <li>
              <strong>Refund:</strong> At the end of the tenancy, if the property is in the same
              condition as when you moved in (allowing for fair wear and tear), your full bond
              must be returned. Disputes about bond deductions are resolved through CBOS or
              the Magistrates Court.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Always take dated photographs on your move-in day and keep them safely. Photograph every
            room, all fixtures, and any existing damage. This protects you from unjustified
            bond deductions.
          </p>

          <h2 id="rent-increases" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rent Increases</h2>
          <p className="text-gray-600 mb-4">
            Tasmanian law provides clear protections around rent increases:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Minimum period:</strong> There must be at least <strong>12 months</strong>{" "}
              between any two rent increases.
            </li>
            <li>
              <strong>Notice required:</strong> The landlord must give at least{" "}
              <strong>42 days written notice</strong> before a rent increase takes effect.
            </li>
            <li>
              <strong>Fixed term:</strong> Rent cannot be increased during a fixed term tenancy
              unless the amount of the increase (or a method for calculating it) is specified in
              the tenancy agreement.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            There are no rent caps in Tasmania — landlords can increase rent by any amount,
            subject to the notice and frequency rules above. If you believe an increase is
            unconscionable, you can seek assistance from CBOS or apply to the Magistrates Court.
          </p>
          <p className="text-gray-600 mb-4">
            Always respond to a rent increase notice in writing — even if you accept it — to
            maintain a clear paper trail.
          </p>

          <h2 id="inspections" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Routine Inspections</h2>
          <p className="text-gray-600 mb-4">
            Landlords have the right to conduct routine inspections of the rental property, but
            with important limits:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum frequency:</strong> No more than <strong>4 routine inspections
              per year</strong>.
            </li>
            <li>
              <strong>Notice required:</strong> The landlord must give at least{" "}
              <strong>24 hours written notice</strong> before a routine inspection.
            </li>
            <li>
              <strong>Reasonable time:</strong> Inspections must be conducted at a reasonable
              time (not excessively early or late in the day).
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            If a landlord enters without proper notice or conducts inspections more frequently
            than permitted, this is a breach of your rights. Document each occurrence and raise
            it with CBOS.
          </p>

          <h2 id="repairs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Repairs and Maintenance</h2>
          <p className="text-gray-600 mb-4">
            Landlords are legally required to maintain the rental property in a reasonable state
            of repair. Under the Tasmanian Act, repairs are categorised as urgent or non-urgent.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Urgent repairs involve essential services or situations that make the property
            uninhabitable or unsafe. The landlord must address these as soon as possible —
            effectively within 24 hours. Examples include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Burst water pipe or serious water leak</li>
            <li>Gas leak</li>
            <li>Dangerous electrical fault</li>
            <li>Blocked or broken toilet (sole toilet in the property)</li>
            <li>Serious roof or structural damage</li>
            <li>Failure of essential services (hot water, heating)</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Always notify the landlord or agent in writing (email or text message) for urgent
            repairs, even if you also call. If the landlord cannot be reached or fails to act,
            document all attempts and contact CBOS for guidance.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Non-urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            For non-urgent repairs, put your request in writing. The landlord should respond
            within a reasonable time. If repairs are not carried out, you can apply to the
            Magistrates Court for a repair order.
          </p>
          <p className="text-gray-600 mb-4">
            Keep copies of all written repair requests. Email is ideal because it automatically
            timestamps your communication.
          </p>

          <h2 id="ending-tenancy" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ending a Tenancy</h2>
          <p className="text-gray-600 mb-4">
            The notice periods required to end a tenancy in Tasmania depend on whether it is a
            periodic or fixed-term tenancy, and who is giving the notice.
          </p>

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
                  <td className="p-3 border border-gray-200">Periodic tenancy — no grounds</td>
                  <td className="p-3 border border-gray-200">14 days</td>
                  <td className="p-3 border border-gray-200">42 days</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Periodic tenancy — with grounds (breach)</td>
                  <td className="p-3 border border-gray-200">14 days</td>
                  <td className="p-3 border border-gray-200">14 days</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Fixed term — at end of term</td>
                  <td className="p-3 border border-gray-200">Check agreement terms</td>
                  <td className="p-3 border border-gray-200">Check agreement terms</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            <strong>Breaking a fixed-term lease early</strong> may result in you being liable for
            rent until a new tenant is found, plus reasonable re-letting costs. There are
            exemptions — such as family violence, or the property becoming uninhabitable. Seek
            advice from CBOS or the Tenants&apos; Union before vacating a fixed-term lease early.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Family violence:</strong> Tasmania has provisions allowing tenants experiencing
            family violence to end a tenancy with appropriate notice and supporting documentation
            without incurring break fees. Contact the Tenants&apos; Union for support.
          </p>

          <h2 id="disputes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resolving Disputes</h2>
          <p className="text-gray-600 mb-4">
            When a dispute arises between a landlord and tenant in Tasmania, there are several
            avenues for resolution:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Consumer, Building and Occupational Services (CBOS)</h3>
          <p className="text-gray-600 mb-4">
            CBOS is the first point of contact for most tenancy disputes. They provide:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Free information and advice about rights and obligations</li>
            <li>Assistance with informal dispute resolution</li>
            <li>Guidance on the formal dispute process</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Magistrates Court</h3>
          <p className="text-gray-600 mb-4">
            More serious disputes — including bond disputes, repair orders, and eviction challenges —
            are resolved through the <strong>Magistrates Court of Tasmania</strong>. The court has
            a residential tenancy division that handles these matters.
          </p>
          <p className="text-gray-600 mb-4">
            Filing fees are relatively modest, and applications can be made without a lawyer for
            straightforward matters. However, for complex disputes (significant bond amounts,
            contested evictions), consider seeking legal advice from the Tenants&apos; Union or
            Legal Aid Tasmania.
          </p>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources and Contacts</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Consumer, Building and Occupational Services (CBOS)</strong> — Official tenancy regulator:{" "}
              <a href="https://www.cbos.tas.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cbos.tas.gov.au</a>
            </li>
            <li>
              <strong>Tenants&apos; Union of Tasmania</strong> — Free advice for tenants:{" "}
              <a href="https://www.tutas.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tutas.org.au</a>
            </li>
            <li>
              <strong>Rental Deposit Authority (RDA)</strong> — Bond lodgement and refunds:{" "}
              Contact through CBOS at{" "}
              <a href="https://www.cbos.tas.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cbos.tas.gov.au</a>
            </li>
            <li>
              <strong>Legal Aid Commission of Tasmania</strong> — Free legal advice:{" "}
              <a href="https://www.legalaid.tas.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">legalaid.tas.gov.au</a>
            </li>
            <li>
              <strong>Magistrates Court Tasmania</strong> — Tenancy disputes:{" "}
              <a href="https://www.magistratescourt.tas.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">magistratescourt.tas.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Renting in Tasmania?</strong> Browse{" "}
              <Link href="/rent" className="underline hover:text-blue-900">rental properties in Tasmania</Link>{" "}
              or use our{" "}
              <Link href="/rental-yield-calculator" className="underline hover:text-blue-900">rental yield calculator</Link>{" "}
              to understand the market.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/renters-rights-nsw" className="text-primary hover:underline">Renter&apos;s Rights in NSW</Link></li>
              <li><Link href="/guides/renters-rights-vic" className="text-primary hover:underline">Renter&apos;s Rights in Victoria</Link></li>
              <li><Link href="/guides/renters-rights-qld" className="text-primary hover:underline">Renter&apos;s Rights in Queensland</Link></li>
              <li><Link href="/guides/renters-rights-wa" className="text-primary hover:underline">Renter&apos;s Rights in Western Australia</Link></li>
              <li><Link href="/guides/renters-rights-sa" className="text-primary hover:underline">Renter&apos;s Rights in South Australia</Link></li>
              <li><Link href="/guides/renters-rights-nt" className="text-primary hover:underline">Renter&apos;s Rights in the Northern Territory</Link></li>
              <li><Link href="/guides/renters-rights-act" className="text-primary hover:underline">Renter&apos;s Rights in the ACT</Link></li>
              <li><Link href="/guides/first-home-buyer-tas" className="text-primary hover:underline">First Home Buyer Guide Tasmania</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
