import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Renter's Rights in Victoria: Complete Guide (2026) | ${SITE_NAME}`,
  description:
    "Victoria's renter rights explained: no-grounds evictions abolished, pet ownership, bond rules, rent increases, VCAT disputes. Updated for 2026.",
  alternates: { canonical: `${SITE_URL}/guides/renters-rights-vic` },
  openGraph: {
    url: `${SITE_URL}/guides/renters-rights-vic`,
    title: "Renter's Rights in Victoria: Complete Guide (2026)",
    description:
      "Victoria's renter rights explained: no-grounds evictions abolished, pet ownership, bond rules, rent increases, VCAT disputes. Updated for 2026.",
    type: "article",
  },
};

export default function RentersRightsVICPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Renter's Rights Victoria", url: "/guides/renters-rights-vic" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Renter's Rights Victoria" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 10 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Renter&apos;s Rights in Victoria: Complete Guide (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Legal disclaimer:</strong> This guide provides general information only and is not
          legal advice. Laws change — always verify current rules with Consumer Affairs Victoria or
          Tenants Victoria before taking action.
        </div>

        {/* Key highlight */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-sm text-green-800">
          <strong>Victoria leads the way:</strong> Since March 2021, no-grounds evictions have been
          <strong> abolished</strong> in Victoria. Landlords must have a valid reason to end a tenancy.
          Victoria also has stronger pet rights and modification rights than most other states.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#rta" className="hover:underline">The Victorian Residential Tenancies Act</a></li>
            <li><a href="#bond" className="hover:underline">Bond rules</a></li>
            <li><a href="#rent-increases" className="hover:underline">Rent increases</a></li>
            <li><a href="#repairs" className="hover:underline">Repairs and maintenance</a></li>
            <li><a href="#entry-rights" className="hover:underline">Landlord entry rights</a></li>
            <li><a href="#modifications" className="hover:underline">Modifications to the property</a></li>
            <li><a href="#pets" className="hover:underline">Pet ownership</a></li>
            <li><a href="#ending-tenancy" className="hover:underline">Ending a tenancy</a></li>
            <li><a href="#no-grounds" className="hover:underline">No-grounds evictions abolished</a></li>
            <li><a href="#disputes" className="hover:underline">Resolving disputes: VCAT</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="rta" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Victorian Residential Tenancies Act 1997</h2>
          <p className="text-gray-600 mb-4">
            The <strong>Residential Tenancies Act 1997 (VIC)</strong> governs all residential tenancies
            in Victoria. The Act was significantly reformed in March 2021, introducing some of the
            strongest renter protections in Australia — including the abolition of no-grounds evictions,
            expanded modification rights, and new pet ownership rules.
          </p>
          <p className="text-gray-600 mb-4">
            The reforms added over 130 new minimum standards for rental properties. Properties must
            now meet basic standards of habitability including working locks, functional heating, draught
            sealing, adequate lighting in bathrooms and laundries, and a vermin-proof rubbish bin.
          </p>
          <p className="text-gray-600 mb-4">
            The Act is administered by <strong>Consumer Affairs Victoria</strong>, with disputes heard
            by the Victorian Civil and Administrative Tribunal (VCAT).
          </p>

          <h2 id="bond" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bond Rules</h2>
          <p className="text-gray-600 mb-4">
            Victoria&apos;s bond rules differ from most other states:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum bond:</strong> For properties renting at <strong>$900/week or less</strong>,
              the maximum bond is 1 month&apos;s rent. For properties above $900/week, the maximum is
              2 months&apos; rent.
            </li>
            <li>
              <strong>Lodgement:</strong> The landlord or agent must lodge the bond with the
              <strong> Residential Tenancies Bond Authority (RTBA)</strong> within 10 business days.
              You can check your bond at rtba.vic.gov.au.
            </li>
            <li>
              <strong>Claiming the bond:</strong> If landlord and tenant agree, the bond can be
              refunded at the end of tenancy. Disputes go to VCAT.
            </li>
          </ul>

          <h2 id="rent-increases" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rent Increases</h2>
          <p className="text-gray-600 mb-4">
            Victoria&apos;s rent increase rules:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Frequency:</strong> Rent can only be increased <strong>once every 12 months</strong>,
              regardless of whether the tenancy is fixed term or periodic.
            </li>
            <li>
              <strong>Notice:</strong> The landlord must give at least <strong>60 days written notice</strong>
              before any rent increase takes effect.
            </li>
            <li>
              <strong>Challenge:</strong> If you believe the rent increase is excessive, you can
              apply to VCAT within 30 days of receiving the notice.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            During a fixed-term tenancy, rent can only be increased if the amount or method of
            calculation is specified in the agreement.
          </p>

          <h2 id="repairs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Repairs and Maintenance</h2>
          <p className="text-gray-600 mb-4">
            Landlords must keep the property in good repair and in compliance with all health and safety
            laws. Repairs are classified as urgent or non-urgent:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Urgent repairs must be attended to within <strong>24 hours</strong> of being reported.
            These include burst pipes, gas leaks, dangerous electrical faults, serious flooding,
            a failure of cooling or heating, and blocked sewers.
          </p>
          <p className="text-gray-600 mb-4">
            If a landlord fails to respond to an urgent repair, tenants may arrange repairs up to
            $2,500 (increased under 2021 reforms) and claim reimbursement.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Non-urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Non-urgent repairs must be completed within <strong>14 days</strong> of written notice.
            Document all repair requests in writing and keep records of the landlord&apos;s responses.
          </p>

          <h2 id="entry-rights" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Landlord Entry Rights</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Routine inspections:</strong> Maximum <strong>4 per year</strong>; at least
              <strong> 24 hours notice</strong> required (but no more than 14 days in advance).
            </li>
            <li>
              <strong>General entry:</strong> At least 24 hours notice is required for most types of
              entry (e.g. showing the property to prospective tenants or buyers).
            </li>
            <li>
              <strong>Emergency:</strong> No notice required in a genuine emergency.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Entry must take place between 8am and 6pm on weekdays, or 9am and 6pm on Saturdays.
            Entry is not permitted on Sundays or public holidays without consent.
          </p>

          <h2 id="modifications" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Modifications to the Property</h2>
          <p className="text-gray-600 mb-4">
            This is one of the most significant areas where VIC differs from other states.
            Since the 2021 reforms, renters can make <strong>minor modifications</strong> to the
            property without needing the landlord&apos;s permission. Examples include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Hanging pictures with nails or hooks</li>
            <li>Installing curtain rods or blinds</li>
            <li>Securing furniture to walls for safety</li>
            <li>Installing picture hooks, garden stakes, or doormats</li>
          </ul>
          <p className="text-gray-600 mb-4">
            For more significant modifications (e.g. installing a dishwasher, air conditioning, or
            making structural changes), the landlord&apos;s consent is required — but they cannot
            unreasonably refuse.
          </p>
          <p className="text-gray-600 mb-4">
            When vacating, the tenant must restore the property to its original condition (or the
            landlord may agree to leave modifications in place).
          </p>

          <h2 id="pets" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pet Ownership</h2>
          <p className="text-gray-600 mb-4">
            Victoria has some of the most progressive pet ownership rules in Australia:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              Renters <strong>can keep pets</strong> — landlords cannot simply refuse without reason.
            </li>
            <li>
              A landlord may only refuse on <strong>reasonable grounds</strong> as defined in the Act
              (e.g. the property is not suitable for the size of the pet, or keeping the pet would
              breach council rules).
            </li>
            <li>
              If the landlord refuses, they must apply to <strong>VCAT</strong> within 14 days with
              their reasons. The tenant can challenge the refusal.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Landlords cannot charge a &quot;pet bond&quot; in Victoria. However, tenants remain responsible
            for any damage caused by their pet.
          </p>

          <h2 id="ending-tenancy" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ending a Tenancy</h2>
          <p className="text-gray-600 mb-4">
            The major reform introduced in 2021 is that landlords must now have a <strong>valid
            reason</strong> to end a tenancy — &quot;no grounds&quot; notices are no longer permitted.
            Valid reasons include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>The property has been sold and the buyer requires vacant possession — <strong>60 days notice</strong></li>
            <li>The property requires major renovations or demolition — <strong>60 days notice</strong></li>
            <li>The owner or their immediate family is moving in — <strong>60 days notice</strong></li>
            <li>Significant breach of duties by the renter — VCAT order required</li>
          </ul>

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
                  <td className="p-3 border border-gray-200">28 days</td>
                  <td className="p-3 border border-gray-200">Must have valid reason</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Periodic — sold (vacant possession)</td>
                  <td className="p-3 border border-gray-200">N/A</td>
                  <td className="p-3 border border-gray-200">60 days</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Periodic — major renovations</td>
                  <td className="p-3 border border-gray-200">N/A</td>
                  <td className="p-3 border border-gray-200">60 days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="no-grounds" className="text-2xl font-bold text-gray-900 mt-8 mb-4">No-Grounds Evictions: Abolished in VIC</h2>
          <p className="text-gray-600 mb-4">
            Since <strong>March 2021</strong>, it has been illegal for a Victorian landlord to issue
            a &quot;no grounds&quot; notice to vacate. This means a landlord cannot end your tenancy simply
            because they want to, without providing a legally valid reason.
          </p>
          <p className="text-gray-600 mb-4">
            If you receive a notice to vacate that does not cite a valid reason, or you believe the
            stated reason is not genuine (e.g. the owner claiming to move in, then re-listing the
            property), you can challenge it at VCAT.
          </p>
          <p className="text-gray-600 mb-4">
            This protection applies to both fixed-term and periodic tenancies.
          </p>

          <h2 id="disputes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resolving Disputes: VCAT</h2>
          <p className="text-gray-600 mb-4">
            The <strong>Victorian Civil and Administrative Tribunal (VCAT)</strong> handles tenancy
            disputes in Victoria. Applications can be made online and hearings are generally held
            within a few weeks for urgent matters.
          </p>
          <p className="text-gray-600 mb-4">
            Common VCAT applications include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Bond disputes</li>
            <li>Repair orders</li>
            <li>Challenging rent increases</li>
            <li>Challenging notices to vacate</li>
            <li>Pet permission disputes</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Consumer Affairs Victoria also provides free dispute resolution services before going to VCAT.
          </p>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources and Contacts</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Consumer Affairs Victoria</strong>:{" "}
              <a href="https://www.consumer.vic.gov.au/renting" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">consumer.vic.gov.au/renting</a>
            </li>
            <li>
              <strong>Tenants Victoria</strong> — Free advice and advocacy:{" "}
              <a href="https://www.tenantsvic.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tenantsvic.org.au</a>
            </li>
            <li>
              <strong>RTBA</strong> — Check your bond:{" "}
              <a href="https://www.rtba.vic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">rtba.vic.gov.au</a>
            </li>
            <li>
              <strong>VCAT</strong> — Lodging a dispute:{" "}
              <a href="https://www.vcat.vic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vcat.vic.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Renting in Victoria?</strong> Browse{" "}
              <Link href="/rent" className="underline hover:text-blue-900">rentals on Your Property Guide</Link>{" "}
              or explore{" "}
              <Link href="/suburbs" className="underline hover:text-blue-900">suburb profiles</Link>{" "}
              to find your next home.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/renters-rights-nsw" className="text-primary hover:underline">Renter&apos;s Rights in NSW</Link></li>
              <li><Link href="/guides/renters-rights-qld" className="text-primary hover:underline">Renter&apos;s Rights in Queensland</Link></li>
              <li><Link href="/guides/renters-rights-wa" className="text-primary hover:underline">Renter&apos;s Rights in Western Australia</Link></li>
              <li><Link href="/guides/renters-rights-sa" className="text-primary hover:underline">Renter&apos;s Rights in South Australia</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
