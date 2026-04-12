import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Renter's Rights in NSW: Complete Guide for Tenants (2026) | ${SITE_NAME}`,
  description:
    "Everything NSW tenants need to know: bond rules, rent increases, repairs, entry rights, ending a tenancy, and how to resolve disputes. Updated for 2026.",
  alternates: { canonical: `${SITE_URL}/guides/renters-rights-nsw` },
  openGraph: {
    url: `${SITE_URL}/guides/renters-rights-nsw`,
    title: "Renter's Rights in NSW: Complete Guide for Tenants (2026)",
    description:
      "Everything NSW tenants need to know: bond rules, rent increases, repairs, entry rights, ending a tenancy, and how to resolve disputes. Updated for 2026.",
    type: "article",
  },
};

export default function RentersRightsNSWPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Renter's Rights NSW", url: "/guides/renters-rights-nsw" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Renter's Rights NSW" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 10 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Renter&apos;s Rights in NSW: Complete Guide for Tenants (2026)
        </h1>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Legal disclaimer:</strong> This guide provides general information only and is not
          legal advice. Laws change — always verify current rules with NSW Fair Trading or the
          Tenants&apos; Union NSW before taking action.
        </div>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#rta" className="hover:underline">The NSW Residential Tenancies Act 2010</a></li>
            <li><a href="#lease-types" className="hover:underline">Lease types: fixed term vs periodic</a></li>
            <li><a href="#bond" className="hover:underline">Bond rules</a></li>
            <li><a href="#rent-increases" className="hover:underline">Rent increases</a></li>
            <li><a href="#repairs" className="hover:underline">Repairs and maintenance</a></li>
            <li><a href="#entry-rights" className="hover:underline">Landlord entry rights</a></li>
            <li><a href="#ending-tenancy" className="hover:underline">Ending a tenancy</a></li>
            <li><a href="#no-grounds" className="hover:underline">No-grounds evictions in NSW</a></li>
            <li><a href="#domestic-violence" className="hover:underline">Domestic violence protections</a></li>
            <li><a href="#disputes" className="hover:underline">Resolving disputes: NCAT</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="rta" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The NSW Residential Tenancies Act 2010</h2>
          <p className="text-gray-600 mb-4">
            The <strong>Residential Tenancies Act 2010 (NSW)</strong> is the primary legislation governing
            the relationship between landlords and tenants in New South Wales. It sets out the rights and
            responsibilities of both parties — from the moment a lease is signed through to bond refunds
            after vacating.
          </p>
          <p className="text-gray-600 mb-4">
            Significant reforms were introduced in 2023, most notably requiring landlords to give
            12 months between rent increases and strengthening protections for renters in periodic
            (month-to-month) agreements. The Act is administered by <strong>NSW Fair Trading</strong>,
            and disputes are resolved through the NSW Civil and Administrative Tribunal (NCAT).
          </p>
          <p className="text-gray-600 mb-4">
            The Act applies to most residential tenancies in NSW, including houses, apartments, and
            shared housing. Some arrangements — such as boarding houses and social housing — have
            separate rules.
          </p>

          <h2 id="lease-types" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lease Types: Fixed Term vs Periodic</h2>
          <p className="text-gray-600 mb-4">
            There are two main types of residential tenancy in NSW:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Fixed term tenancy:</strong> A lease with a defined start and end date (commonly
              6 or 12 months). During this period, the landlord generally cannot end the tenancy
              without grounds, and the tenant cannot leave without penalty unless circumstances
              allow (e.g. domestic violence, the property becomes uninhabitable).
            </li>
            <li>
              <strong>Periodic tenancy:</strong> A &quot;rolling&quot; agreement with no fixed end date —
              often what a fixed-term lease becomes once it expires. Either party can end it with
              the correct notice period.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            If you stay in a property after your fixed term ends without signing a new lease, your
            tenancy automatically becomes periodic. The same terms and conditions apply — including
            rent amount — until a new agreement is made.
          </p>

          <h2 id="bond" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bond Rules</h2>
          <p className="text-gray-600 mb-4">
            A bond is a security deposit paid at the start of a tenancy. In NSW:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum bond:</strong> 4 weeks rent. A landlord cannot legally ask for more.
            </li>
            <li>
              <strong>Lodgement:</strong> The landlord or agent must lodge your bond with
              <strong> NSW Fair Trading</strong> (via the <em>Rental Bonds Online</em> system) within
              10 working days of receiving it. You should receive a receipt.
            </li>
            <li>
              <strong>Refund:</strong> At the end of the tenancy, if the property is in the same
              condition as when you moved in (allowing for fair wear and tear), the full bond must
              be refunded. If there is a dispute, either party can apply to NCAT for a determination.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Always take dated photos on move-in day and keep a copy of the condition report. This is
            your strongest evidence if there is a bond dispute later.
          </p>

          <h2 id="rent-increases" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rent Increases</h2>
          <p className="text-gray-600 mb-4">
            NSW introduced stricter rent increase rules in 2023. Key requirements:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Minimum 12 months</strong> must pass between any two rent increases (this applies
              to both fixed-term and periodic tenancies).
            </li>
            <li>
              <strong>60 days written notice</strong> must be given before any rent increase takes effect.
            </li>
            <li>
              Rent cannot be increased during a fixed-term lease unless the amount of the increase is
              specified in the tenancy agreement.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            If you believe a rent increase is excessive, you can apply to NCAT to have it reviewed.
            NCAT will consider factors like comparable rents in the area.
          </p>
          <p className="text-gray-600 mb-4">
            Note: NSW does not have rent caps or limits on the amount of an increase — only on the
            frequency and notice required.
          </p>

          <h2 id="repairs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Repairs and Maintenance</h2>
          <p className="text-gray-600 mb-4">
            Landlords are legally required to keep the rental property in a reasonable state of repair.
            Repairs fall into two categories:
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Urgent repairs must be addressed as soon as possible — effectively immediately. Under the
            Act, urgent repairs include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Burst water service or serious water leak</li>
            <li>Blocked or broken toilet (where no other is available)</li>
            <li>Serious roof leak</li>
            <li>Gas leak</li>
            <li>Dangerous electrical fault</li>
            <li>Flooding or serious flood damage</li>
            <li>Serious storm or fire damage</li>
            <li>Failure or breakdown of gas, electricity, or water supply</li>
            <li>Failure of cooling or heating system in extreme weather</li>
            <li>Fault in lift or staircase</li>
          </ul>
          <p className="text-gray-600 mb-4">
            If the landlord cannot be contacted or fails to act, tenants may arrange urgent repairs
            themselves (up to $1,000) and claim reimbursement. Keep all receipts.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Non-urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            For non-urgent repairs (e.g. a dripping tap, broken dishwasher), the landlord has
            <strong> 14 days</strong> to respond after receiving written notice. Always request
            repairs in writing (email is fine) so you have a record.
          </p>
          <p className="text-gray-600 mb-4">
            If the landlord does not carry out repairs within 14 days, you can apply to NCAT for
            a repair order.
          </p>

          <h2 id="entry-rights" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Landlord Entry Rights</h2>
          <p className="text-gray-600 mb-4">
            A landlord or agent does not have the right to enter the rental property whenever they like.
            The rules under the NSW RTA are:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>General entry:</strong> At least <strong>24 hours written notice</strong> is required.
            </li>
            <li>
              <strong>Routine inspections:</strong> At least <strong>7 days written notice</strong>;
              no more than <strong>4 inspections per year</strong>.
            </li>
            <li>
              <strong>Emergency:</strong> No notice required if there is an emergency (e.g. suspected
              gas leak, flood).
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            Entry must occur between 8am and 8pm, and not on a Sunday or public holiday (unless agreed
            by both parties). If your landlord enters without proper notice, this is a breach of the
            Act — document it and raise it with NSW Fair Trading or NCAT.
          </p>

          <h2 id="ending-tenancy" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ending a Tenancy</h2>
          <p className="text-gray-600 mb-4">
            Notice periods depend on whether you have a fixed term or periodic tenancy, and whether it
            is the tenant or landlord giving notice.
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
                  <td className="p-3 border border-gray-200">Fixed term — end of term</td>
                  <td className="p-3 border border-gray-200">14 days</td>
                  <td className="p-3 border border-gray-200">30 days</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Periodic — no grounds</td>
                  <td className="p-3 border border-gray-200">21 days</td>
                  <td className="p-3 border border-gray-200">90 days</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Periodic — with grounds (e.g. non-payment)</td>
                  <td className="p-3 border border-gray-200">21 days</td>
                  <td className="p-3 border border-gray-200">30 days (some grounds vary)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            Breaking a fixed-term lease early generally requires you to pay a break fee (or
            &quot;lease break costs&quot;), which is calculated based on how far into the lease you are.
            There are exemptions — such as domestic violence or the property becoming uninhabitable.
          </p>

          <h2 id="no-grounds" className="text-2xl font-bold text-gray-900 mt-8 mb-4">No-Grounds Evictions in NSW</h2>
          <p className="text-gray-600 mb-4">
            Unlike Victoria (which abolished no-grounds evictions in 2021), <strong>NSW still permits
            no-grounds evictions</strong> on periodic tenancies. This means a landlord can end your
            tenancy without giving a reason — but must give <strong>90 days notice</strong>.
          </p>
          <p className="text-gray-600 mb-4">
            For fixed-term tenancies, the landlord cannot end the tenancy without grounds during the
            fixed term (e.g. they can&apos;t evict you mid-lease just to raise the rent).
          </p>
          <p className="text-gray-600 mb-4">
            NSW tenant advocates have long campaigned to end no-grounds evictions. As of April 2026,
            these provisions remain in place — but this is subject to change. Check the Tenants&apos; Union
            NSW website for the latest updates.
          </p>

          <h2 id="domestic-violence" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Domestic Violence Provisions</h2>
          <p className="text-gray-600 mb-4">
            NSW has specific protections for tenants experiencing domestic violence. Under the Act:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              A tenant experiencing domestic violence can <strong>end a fixed-term lease immediately
              and without penalty</strong> by providing evidence such as a domestic violence order (DVO),
              police report, or statutory declaration.
            </li>
            <li>
              A co-tenant who is the perpetrator can be removed from the lease to protect the victim.
            </li>
            <li>
              Victims are not liable for break fees or compensation claims related to the early
              termination.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            If you are in immediate danger, call 000. For support, contact 1800RESPECT
            (1800 737 732) or DVConnect on 1800 811 811.
          </p>

          <h2 id="disputes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resolving Disputes: NCAT</h2>
          <p className="text-gray-600 mb-4">
            The <strong>NSW Civil and Administrative Tribunal (NCAT)</strong> handles disputes between
            landlords and tenants, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Bond disputes</li>
            <li>Rent increases</li>
            <li>Repair orders</li>
            <li>Unlawful entry</li>
            <li>Termination disputes</li>
          </ul>
          <p className="text-gray-600 mb-4">
            NCAT applications are generally low-cost and accessible. Before applying, you can also
            try NSW Fair Trading&apos;s <strong>free dispute resolution service</strong>, which mediates
            between parties without the formality of a tribunal hearing.
          </p>
          <p className="text-gray-600 mb-4">
            Applications can be lodged online at <strong>ncat.nsw.gov.au</strong>.
          </p>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources and Contacts</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>NSW Fair Trading</strong> — Official tenancy regulator:{" "}
              <a href="https://www.fairtrading.nsw.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fairtrading.nsw.gov.au</a>
            </li>
            <li>
              <strong>Tenants&apos; Union NSW</strong> — Free advice and advocacy:{" "}
              <a href="https://www.tenants.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tenants.org.au</a>
            </li>
            <li>
              <strong>Rental Bonds Online</strong> — Check and manage your bond:{" "}
              <a href="https://www.fairtrading.nsw.gov.au/bonds" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fairtrading.nsw.gov.au/bonds</a>
            </li>
            <li>
              <strong>NCAT</strong> — Lodge a dispute:{" "}
              <a href="https://www.ncat.nsw.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ncat.nsw.gov.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Renting in NSW?</strong> Browse{" "}
              <Link href="/rent" className="underline hover:text-blue-900">rentals on Your Property Guide</Link>{" "}
              or use our{" "}
              <Link href="/rental-yield-calculator" className="underline hover:text-blue-900">rental yield calculator</Link>{" "}
              to understand the market.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-2">Related guides</p>
            <ul className="text-sm space-y-1">
              <li><Link href="/guides/renters-rights-vic" className="text-primary hover:underline">Renter&apos;s Rights in Victoria</Link></li>
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
