import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Renter's Rights in South Australia: Complete Guide (2026) | ${SITE_NAME}`,
  description:
    "SA tenant rights explained: bond, rent increases, repairs, entry rights, and ending a tenancy under the Residential Tenancies Act 1995. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/renters-rights-sa` },
  openGraph: {
    url: `${SITE_URL}/guides/renters-rights-sa`,
    title: "Renter's Rights in South Australia: Complete Guide (2026)",
    description:
      "SA tenant rights explained: bond, rent increases, repairs, entry rights, and ending a tenancy under the Residential Tenancies Act 1995. Updated 2026.",
    type: "article",
  },
};

export default function RentersRightsSAPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Renter's Rights South Australia", url: "/guides/renters-rights-sa" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Renter's Rights South Australia" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 8 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Renter&apos;s Rights in South Australia: Complete Guide (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Legal disclaimer:</strong> This guide provides general information only and is not
          legal advice. Always verify current rules with Consumer and Business Services SA (CBS) or
          a tenancy advocate before taking action.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#act" className="hover:underline">The SA Residential Tenancies Act 1995</a></li>
            <li><a href="#bond" className="hover:underline">Bond rules</a></li>
            <li><a href="#rent-increases" className="hover:underline">Rent increases</a></li>
            <li><a href="#repairs" className="hover:underline">Repairs and maintenance</a></li>
            <li><a href="#entry-rights" className="hover:underline">Landlord entry rights</a></li>
            <li><a href="#ending-tenancy" className="hover:underline">Ending a tenancy</a></li>
            <li><a href="#disputes" className="hover:underline">Resolving disputes: SACAT</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="act" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The SA Residential Tenancies Act 1995</h2>
          <p className="text-gray-600 mb-4">
            The <strong>Residential Tenancies Act 1995 (SA)</strong> governs all residential tenancies
            in South Australia. It sets out the rights and responsibilities of landlords and tenants,
            covering everything from bond lodgement to repairs, entry rights, and ending a tenancy.
          </p>
          <p className="text-gray-600 mb-4">
            The Act is administered by <strong>Consumer and Business Services SA (CBS)</strong>.
            Disputes that cannot be resolved through CBS are referred to the
            <strong> South Australian Civil and Administrative Tribunal (SACAT)</strong>.
          </p>
          <p className="text-gray-600 mb-4">
            South Australia has progressively updated its tenancy laws in recent years. As of April 2026,
            SA still permits no-grounds evictions on periodic tenancies with 90 days notice. Check CBS
            for any current or proposed amendments.
          </p>

          <h2 id="bond" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bond Rules</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum bond:</strong> In most cases, the maximum bond is <strong>4 weeks rent</strong>.
              For furnished properties or where the weekly rent exceeds a set threshold, a higher bond
              may be permitted — verify with CBS.
            </li>
            <li>
              <strong>Lodgement:</strong> The bond must be lodged with <strong>Consumer and Business
              Services SA</strong> within a prescribed timeframe (typically within 7 days of receipt).
              You should receive a receipt.
            </li>
            <li>
              <strong>Refund:</strong> If both parties agree, the bond is refunded at the end of the
              tenancy. Disputes go to SACAT.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Complete and sign the property condition report at the start and end of your tenancy.
            Take timestamped photos. This documentation protects you in any bond dispute.
          </p>

          <h2 id="rent-increases" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rent Increases</h2>
          <p className="text-gray-600 mb-4">
            In South Australia, the rules around rent increases are:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Frequency:</strong> Rent can only be increased <strong>once every 12 months</strong>
              for periodic tenancies.
            </li>
            <li>
              <strong>Notice:</strong> At least <strong>60 days written notice</strong> must be given
              before the rent increase takes effect.
            </li>
            <li>
              <strong>Fixed-term tenancies:</strong> Rent cannot be increased during a fixed term
              unless the amount of the increase is specified in the tenancy agreement.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            If you believe a rent increase is excessive or unreasonable, you can apply to SACAT for
            a review. SACAT will consider what similar properties in the area are renting for.
          </p>

          <h2 id="repairs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Repairs and Maintenance</h2>
          <p className="text-gray-600 mb-4">
            Landlords are legally required to maintain the property in a good state of repair and in
            compliance with health and safety standards. Repair obligations are split between urgent
            and non-urgent:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Must be fixed as soon as possible (effectively immediately). Examples include burst pipes,
            gas leaks, major structural damage, electrical faults, loss of essential services
            (water, gas, electricity), and breakdown of heating or cooling in extreme temperatures.
          </p>
          <p className="text-gray-600 mb-4">
            If the landlord cannot be contacted, tenants may arrange urgent repairs and seek
            reimbursement. Check CBS for current limits on self-arranged urgent repair costs.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Non-urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            The landlord must address non-urgent repairs within a reasonable time after receiving
            written notice. Always put requests in writing (email is acceptable) and keep records.
            If the landlord fails to act within a reasonable time, you can apply to SACAT for a
            repair order.
          </p>

          <h2 id="entry-rights" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Landlord Entry Rights</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Routine inspections:</strong> The landlord must give reasonable notice (typically
              7–14 days) and inspections are generally limited to 4 per year.
            </li>
            <li>
              <strong>Entry for repairs or showing the property:</strong> At least 24 hours notice
              is required.
            </li>
            <li>
              <strong>Emergency:</strong> No notice is required for emergency entry (e.g. flood,
              gas leak, fire).
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Entry must occur at a reasonable time — generally between 8am and 8pm. If a landlord
            enters without proper notice or more frequently than permitted, this is a breach of the
            Act. Document it and report it to CBS.
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
                  <td className="p-3 border border-gray-200">28 days</td>
                  <td className="p-3 border border-gray-200">28 days</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Periodic — no grounds</td>
                  <td className="p-3 border border-gray-200">21 days</td>
                  <td className="p-3 border border-gray-200">90 days</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Periodic — significant breach</td>
                  <td className="p-3 border border-gray-200">—</td>
                  <td className="p-3 border border-gray-200">14–30 days (depending on breach)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mb-4">
            SA still permits no-grounds evictions on periodic tenancies, but the 90-day notice period
            provides tenants with some security. If you believe an eviction notice is retaliatory
            or not made in good faith, seek advice from a tenancy advocate or CBS.
          </p>
          <p className="text-gray-600 mb-4">
            If you need to break a fixed-term lease early, you may be liable for the landlord&apos;s
            reasonable reletting costs. Check your agreement and seek advice before taking action.
          </p>

          <h2 id="disputes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resolving Disputes: SACAT</h2>
          <p className="text-gray-600 mb-4">
            The <strong>South Australian Civil and Administrative Tribunal (SACAT)</strong> handles
            residential tenancy disputes in SA. Applications can be lodged online at sacat.sa.gov.au.
          </p>
          <p className="text-gray-600 mb-4">
            SACAT deals with:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Bond disputes</li>
            <li>Repair orders</li>
            <li>Challenging rent increases</li>
            <li>Termination disputes</li>
            <li>Compensation claims</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Consumer and Business Services SA also offers free mediation as a first step. Contact
            CBS on 131 882 before applying to SACAT.
          </p>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources and Contacts</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Consumer and Business Services SA (CBS)</strong>:{" "}
              <a href="https://www.cbs.sa.gov.au/renting" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cbs.sa.gov.au/renting</a>
            </li>
            <li>
              <strong>Tenants&apos; Information &amp; Advocacy Service (TIAS)</strong>:{" "}
              <a href="https://www.syc.net.au/tias" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">syc.net.au/tias</a>
            </li>
            <li>
              <strong>SACAT</strong>:{" "}
              <a href="https://www.sacat.sa.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">sacat.sa.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Renting in SA?</strong> Browse{" "}
              <Link href="/rent" className="underline hover:text-blue-900">Adelaide and SA rentals</Link>{" "}
              or explore{" "}
              <Link href="/suburbs" className="underline hover:text-blue-900">suburb profiles</Link>{" "}
              with local median rent data.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/renters-rights-nsw" className="text-primary hover:underline">Renter&apos;s Rights in NSW</Link></li>
              <li><Link href="/guides/renters-rights-vic" className="text-primary hover:underline">Renter&apos;s Rights in Victoria</Link></li>
              <li><Link href="/guides/renters-rights-qld" className="text-primary hover:underline">Renter&apos;s Rights in Queensland</Link></li>
              <li><Link href="/guides/renters-rights-wa" className="text-primary hover:underline">Renter&apos;s Rights in Western Australia</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
