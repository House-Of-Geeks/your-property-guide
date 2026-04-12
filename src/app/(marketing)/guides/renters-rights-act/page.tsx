import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Renter's Rights in the ACT: Complete Guide for Canberra Tenants (2026) | ${SITE_NAME}`,
  description:
    "Complete guide to tenant rights in the ACT. Bond rules, rent increases (8 weeks notice, 12 months between), no-grounds eviction protections, ACAT dispute resolution, and Canberra's strong tenant laws. Updated 2026.",
  alternates: { canonical: `${SITE_URL}/guides/renters-rights-act` },
  openGraph: {
    url: `${SITE_URL}/guides/renters-rights-act`,
    title: "Renter's Rights in the ACT: Complete Guide for Canberra Tenants (2026)",
    description:
      "Complete guide to tenant rights in the ACT. Bond rules, rent increases (8 weeks notice, 12 months between), no-grounds eviction protections, ACAT dispute resolution, and Canberra's strong tenant laws. Updated 2026.",
    type: "article",
  },
};

export default function RentersRightsACTPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: "Renter's Rights ACT", url: "/guides/renters-rights-act" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Renter's Rights ACT" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026 · 10 min read</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Renter&apos;s Rights in the ACT: Complete Guide for Canberra Tenants (2026)
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Legal disclaimer:</strong> This guide provides general information only and is
          not legal advice. ACT tenancy laws are subject to change. Always verify current rules
          with the ACT Civil and Administrative Tribunal (acat.act.gov.au) or the Tenants&apos; Union
          ACT before taking action.
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">In this guide</p>
          <ul className="space-y-1 text-sm text-primary">
            <li><a href="#rta" className="hover:underline">The Residential Tenancies Act 1997 (ACT)</a></li>
            <li><a href="#lease-types" className="hover:underline">Lease types</a></li>
            <li><a href="#bond" className="hover:underline">Bond rules</a></li>
            <li><a href="#rent-increases" className="hover:underline">Rent increases</a></li>
            <li><a href="#inspections" className="hover:underline">Routine inspections</a></li>
            <li><a href="#repairs" className="hover:underline">Repairs and maintenance</a></li>
            <li><a href="#no-grounds" className="hover:underline">No-grounds evictions: ACT&apos;s strong protections</a></li>
            <li><a href="#pets" className="hover:underline">Pets in rental properties</a></li>
            <li><a href="#ending-tenancy" className="hover:underline">Ending a tenancy</a></li>
            <li><a href="#disputes" className="hover:underline">Resolving disputes: ACAT</a></li>
            <li><a href="#resources" className="hover:underline">Resources and contacts</a></li>
          </ul>
        </div>

        <div className="prose prose-gray max-w-none">

          <h2 id="rta" className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Residential Tenancies Act 1997 (ACT)</h2>
          <p className="text-gray-600 mb-4">
            The ACT&apos;s residential tenancy laws are governed by the{" "}
            <strong>Residential Tenancies Act 1997 (ACT)</strong>. The ACT has progressively
            strengthened tenant protections over recent years, and as of 2026, the ACT offers
            some of the strongest renter protections of any Australian jurisdiction.
          </p>
          <p className="text-gray-600 mb-4">
            Key improvements in recent ACT reforms include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Abolition of &quot;no cause&quot; (no-grounds) evictions in most circumstances</li>
            <li>Increased notice periods for rent increases</li>
            <li>Strengthened pet ownership rights</li>
            <li>Enhanced minimum standards for rental properties</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Disputes are resolved through the <strong>ACT Civil and Administrative Tribunal
            (ACAT)</strong>, which has a dedicated tenancy division.
          </p>

          <h2 id="lease-types" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lease Types</h2>
          <p className="text-gray-600 mb-4">
            Residential tenancies in the ACT can be:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Fixed term tenancy:</strong> A tenancy with a defined start and end date.
              During the fixed term, the landlord cannot end the tenancy except for specific
              grounds (e.g. serious breach of the tenancy agreement). The tenant may vacate early
              but may be liable for a break fee.
            </li>
            <li>
              <strong>Periodic tenancy:</strong> An ongoing arrangement with no set end date.
              In the ACT, periodic tenancies continue after the end of a fixed term unless a
              new agreement is signed. Both parties can end a periodic tenancy with appropriate
              notice, but only on specified grounds (see no-grounds evictions below).
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            All ACT tenancy agreements must be in writing. The landlord must use the standard form
            tenancy agreement and provide a copy to the tenant before or at the time of signing.
          </p>

          <h2 id="bond" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bond Rules</h2>
          <p className="text-gray-600 mb-4">
            Bond rules in the ACT:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Maximum bond:</strong> 4 weeks rent. Landlords cannot request a higher amount.
            </li>
            <li>
              <strong>Lodgement:</strong> The landlord must lodge the bond with the{" "}
              <strong>ACT Revenue Office</strong> within 14 days of receiving it. You should
              receive a receipt confirming the lodgement.
            </li>
            <li>
              <strong>Condition report:</strong> The landlord must provide an ingoing condition
              report before the tenancy begins. Both parties should sign it and retain a copy.
              Document and photograph any existing damage at the time you move in.
            </li>
            <li>
              <strong>Bond refund:</strong> At the end of the tenancy, the bond is refunded if
              the property is in the same condition as at move-in, allowing for fair wear and tear.
              Disputes are resolved through ACAT.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            The ACT Revenue Office holds bonds in trust during the tenancy. If the landlord
            wishes to make a claim on the bond, they must apply to ACAT — they cannot simply
            deduct money unilaterally.
          </p>

          <h2 id="rent-increases" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rent Increases</h2>
          <p className="text-gray-600 mb-4">
            The ACT has strong protections around rent increases:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Minimum period:</strong> At least <strong>12 months</strong> must pass
              between any two rent increases.
            </li>
            <li>
              <strong>Notice required:</strong> The landlord must give at least{" "}
              <strong>8 weeks written notice</strong> before a rent increase takes effect.
              This is one of the longest notice periods in Australia.
            </li>
            <li>
              <strong>Fixed term:</strong> Rent cannot be increased during a fixed term unless the
              amount or formula for the increase is specified in the tenancy agreement.
            </li>
            <li>
              <strong>Excessive increases:</strong> Tenants can apply to ACAT to have a rent
              increase reviewed if they believe it is excessive. ACAT will consider comparable
              rents in the area when making a determination.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            The ACT does not have formal rent caps, but the combination of the 12-month minimum
            period, 8-week notice requirement, and ACAT review rights provides meaningful
            protection against rapid or unreasonable increases.
          </p>

          <h2 id="inspections" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Routine Inspections</h2>
          <p className="text-gray-600 mb-4">
            Landlords in the ACT have the right to conduct routine inspections, subject to
            important restrictions:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>Notice required:</strong> At least <strong>2 weeks written notice</strong>{" "}
              must be given before a routine inspection. This is significantly longer than most
              other states.
            </li>
            <li>
              <strong>Maximum frequency:</strong> No more than <strong>4 routine inspections
              per year</strong>.
            </li>
            <li>
              <strong>Reasonable time:</strong> Inspections must occur at a reasonable time of
              day — not excessively early, late, or on public holidays.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            If your landlord gives less than 2 weeks notice, you do not have to allow entry for
            a routine inspection. Document any breach and contact ACAT if the problem persists.
          </p>

          <h2 id="repairs" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Repairs and Maintenance</h2>
          <p className="text-gray-600 mb-4">
            The landlord must maintain the property in a reasonable state of repair and comply
            with health, safety, and building standards.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            Urgent repairs affect essential services or the safety of occupants and must be
            addressed immediately. Examples include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Gas or electrical fault</li>
            <li>Burst water pipe or serious leak</li>
            <li>Failure of hot water, heating, or cooling</li>
            <li>Broken roof or serious storm damage</li>
            <li>Blocked or failed sewerage</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Notify the landlord in writing immediately for urgent repairs. If the landlord
            fails to respond within a reasonable time, contact ACAT for an urgent repair order.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Non-urgent repairs</h3>
          <p className="text-gray-600 mb-4">
            For non-urgent repairs, put your request in writing and allow a reasonable time
            (generally 14 days) for the landlord to arrange repairs. If repairs are not made,
            you can apply to ACAT for a repair order or compensation.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Minimum standards</h3>
          <p className="text-gray-600 mb-4">
            The ACT has introduced <strong>minimum rental standards</strong> requiring that
            rental properties meet certain requirements for energy efficiency, safety, and
            habitability. Key standards include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Fixed heating in the main living area</li>
            <li>Window coverings for privacy</li>
            <li>Adequate ventilation</li>
            <li>Smoke alarms (compliance with relevant standards)</li>
            <li>Adequate weatherproofing</li>
          </ul>
          <p className="text-gray-600 mb-4">
            If your rental property does not meet these minimum standards, contact ACAT for
            a compliance order.
          </p>

          <h2 id="no-grounds" className="text-2xl font-bold text-gray-900 mt-8 mb-4">No-Grounds Evictions: ACT&apos;s Strong Protections</h2>
          <p className="text-gray-600 mb-4">
            The ACT has significantly stronger protections against eviction than most other
            Australian states. In the ACT, <strong>landlords generally need grounds to end a
            tenancy</strong> — including for periodic tenancies.
          </p>
          <p className="text-gray-600 mb-4">
            Acceptable grounds for a landlord to end a tenancy in the ACT include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>The landlord (or their family) genuinely intends to occupy the property</li>
            <li>The landlord intends to demolish or substantially renovate the property</li>
            <li>The property is being sold and vacant possession is required</li>
            <li>Serious or repeated breach of the tenancy agreement by the tenant</li>
            <li>The tenant has caused serious damage or injury</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Critically, if a landlord gives a &quot;no grounds&quot; notice, the tenant can challenge it
            at ACAT. The landlord must establish that a valid ground exists. This is a significant
            practical protection compared to NSW and WA, where no-grounds evictions on periodic
            tenancies remain available to landlords.
          </p>
          <p className="text-gray-600 mb-4">
            If you receive an eviction notice that appears to be without valid grounds, contact
            ACAT or the Tenants&apos; Union ACT immediately.
          </p>

          <h2 id="pets" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pets in Rental Properties</h2>
          <p className="text-gray-600 mb-4">
            The ACT has introduced <strong>pet-friendly tenancy laws</strong> that make it harder
            for landlords to refuse pets without good reason.
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              Tenants can apply to keep a pet, and landlords must have <strong>reasonable grounds</strong>{" "}
              to refuse. Simply &quot;no pets&quot; as a blanket policy without a specific reason is not
              sufficient.
            </li>
            <li>
              Reasonable grounds to refuse a pet might include: the property has no secure yard,
              the property rules (e.g. strata bylaws) prohibit pets, or the specific animal would
              cause damage that cannot reasonably be remediated.
            </li>
            <li>
              If a landlord refuses a pet request, the tenant can apply to ACAT to challenge the
              decision.
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            The ACT&apos;s pet laws represent a progressive step forward in recognising that pets are
            important to many tenants&apos; wellbeing — particularly in Canberra where a large proportion
            of the population rents long-term.
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
                  <td className="p-3 border border-gray-200">Periodic tenancy (with grounds)</td>
                  <td className="p-3 border border-gray-200">3 weeks</td>
                  <td className="p-3 border border-gray-200">8 weeks (general grounds)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Fixed term — end of term</td>
                  <td className="p-3 border border-gray-200">3 weeks before end</td>
                  <td className="p-3 border border-gray-200">6 weeks before end</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Serious breach</td>
                  <td className="p-3 border border-gray-200">N/A</td>
                  <td className="p-3 border border-gray-200">7 days (after breach notice)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mb-4">
            Note: exact notice periods under the ACT Act are technical and may have been updated
            since the publication of this guide. Always verify current requirements at acat.act.gov.au.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Family violence:</strong> Tenants experiencing family violence can end a
            tenancy without the standard notice periods or break fees. Contact the Tenants&apos; Union
            ACT or 1800RESPECT (1800 737 732) for support.
          </p>

          <h2 id="disputes" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resolving Disputes: ACAT</h2>
          <p className="text-gray-600 mb-4">
            The <strong>ACT Civil and Administrative Tribunal (ACAT)</strong> is the primary
            forum for resolving residential tenancy disputes in the ACT. ACAT handles:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Bond disputes</li>
            <li>Rent increase challenges</li>
            <li>Repair orders and minimum standards complaints</li>
            <li>Unlawful entry disputes</li>
            <li>Eviction challenges (including no-grounds notices)</li>
            <li>Pet refusal disputes</li>
            <li>Compensation claims</li>
          </ul>
          <p className="text-gray-600 mb-4">
            ACAT applications can be lodged online. The tribunal is designed to be accessible to
            self-represented parties, and for straightforward disputes, legal representation is
            not necessary. The Tenants&apos; Union ACT can assist in preparing your application.
          </p>
          <p className="text-gray-600 mb-4">
            There is a modest application fee (reduced or waived for holders of concession cards).
            ACAT typically lists residential tenancy disputes within a few weeks.
          </p>

          <h2 id="resources" className="text-2xl font-bold text-gray-900 mt-8 mb-4">Resources and Contacts</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>
              <strong>ACT Civil and Administrative Tribunal (ACAT)</strong> — Tenancy disputes:{" "}
              <a href="https://www.acat.act.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">acat.act.gov.au</a>
            </li>
            <li>
              <strong>Tenants&apos; Union ACT</strong> — Free advice and advocacy:{" "}
              <a href="https://www.tenantsact.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tenantsact.org.au</a>
            </li>
            <li>
              <strong>ACT Revenue Office</strong> — Bond lodgement:{" "}
              <a href="https://www.revenue.act.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">revenue.act.gov.au</a>
            </li>
            <li>
              <strong>Access Canberra</strong> — General ACT government services:{" "}
              <a href="https://www.accesscanberra.act.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">accesscanberra.act.gov.au</a>
            </li>
            <li>
              <strong>Legal Aid ACT</strong> — Free legal advice:{" "}
              <a href="https://www.legalaidact.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">legalaidact.org.au</a>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Renting in Canberra?</strong> Browse{" "}
              <Link href="/rent" className="underline hover:text-blue-900">ACT rental properties</Link>{" "}
              or use our{" "}
              <Link href="/rental-yield-calculator" className="underline hover:text-blue-900">rental yield calculator</Link>{" "}
              to understand the Canberra market.
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
              <li><Link href="/guides/renters-rights-tas" className="text-primary hover:underline">Renter&apos;s Rights in Tasmania</Link></li>
              <li><Link href="/guides/renters-rights-nt" className="text-primary hover:underline">Renter&apos;s Rights in the Northern Territory</Link></li>
              <li><Link href="/guides/first-home-buyer-act" className="text-primary hover:underline">First Home Buyer Guide ACT</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
