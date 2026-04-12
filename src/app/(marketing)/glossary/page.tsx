import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Property Glossary: A-Z of Australian Real Estate Terms | ${SITE_NAME}`,
  description:
    "Complete glossary of Australian property and real estate terms. Plain English definitions for buyers, sellers, investors and renters.",
  alternates: { canonical: `${SITE_URL}/glossary` },
  openGraph: {
    url: `${SITE_URL}/glossary`,
    title: "Property Glossary: A-Z of Australian Real Estate Terms",
    description:
      "Complete glossary of Australian property and real estate terms. Plain English definitions for buyers, sellers, investors and renters.",
    type: "article",
  },
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Property Glossary", url: "/glossary" }]} />
      <Breadcrumbs items={[{ label: "Property Glossary" }]} />

      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Last updated: April 2026</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Property Glossary: A-Z of Australian Real Estate Terms
        </h1>
        <p className="text-gray-600 mb-8">
          Plain English definitions for 80+ Australian property and real estate terms — whether
          you&apos;re buying, selling, investing, or renting.
        </p>

        {/* Alphabet navigation */}
        <div className="flex flex-wrap gap-2 mb-10">
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={`#section-${letter}`}
              className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* A */}
        <section id="section-A" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">A</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Adjustable Rate Mortgage</dt>
            <dd className="text-gray-600 mb-4">
              A home loan where the interest rate can change over the life of the loan, typically
              in line with market rates or an index set by the lender. In Australia, this is more
              commonly called a <em>variable rate loan</em>. Your repayments can go up or down when
              the rate changes — for example, when the RBA changes the cash rate.
            </dd>

            <dt className="font-semibold text-gray-900">Appraisal</dt>
            <dd className="text-gray-600 mb-4">
              An estimate of a property&apos;s market value, usually provided by a real estate agent or
              registered valuer. An agent&apos;s appraisal is typically free and informal — it&apos;s used to
              guide pricing for sale. A formal valuation (by a registered valuer) is used by lenders
              to assess how much they will lend.
            </dd>

            <dt className="font-semibold text-gray-900">Appreciation</dt>
            <dd className="text-gray-600 mb-4">
              The increase in a property&apos;s value over time. For example, if a house purchased for
              $700,000 is now worth $850,000, it has appreciated by $150,000 (or about 21.4%).
              Appreciation is influenced by market conditions, local demand, infrastructure, and
              economic factors.
            </dd>

            <dt className="font-semibold text-gray-900">Auction</dt>
            <dd className="text-gray-600 mb-4">
              A method of selling property where registered bidders compete publicly for the property.
              The property is sold to the highest bidder, provided they meet or exceed the vendor&apos;s
              reserve price. In Australia, buying at auction is unconditional — there is no cooling-off
              period and no subject-to-finance clause.
            </dd>

            <dt className="font-semibold text-gray-900">Auction Clearance Rate</dt>
            <dd className="text-gray-600 mb-4">
              The percentage of properties that sell at or immediately after auction in a given week
              or period. A clearance rate above 70% generally indicates a strong seller&apos;s market;
              below 60% suggests a buyer&apos;s market. This metric is closely watched in Sydney and
              Melbourne as a real-time indicator of market sentiment.
            </dd>
          </dl>
        </section>

        {/* B */}
        <section id="section-B" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">B</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Balloon Payment</dt>
            <dd className="text-gray-600 mb-4">
              A large lump-sum payment due at the end of a loan term, after a series of smaller
              regular repayments. Uncommon in standard Australian home loans but sometimes seen in
              commercial or vendor finance arrangements. The borrower either refinances or sells
              the property to cover the balloon.
            </dd>

            <dt className="font-semibold text-gray-900">Body Corporate</dt>
            <dd className="text-gray-600 mb-4">
              The legal entity that manages and maintains the common areas and shared facilities
              of a strata or community title development (e.g. apartments, townhouses). All lot
              owners are members and pay levies. Also called an &quot;owners corporation&quot; in VIC and
              NSW. Body corporate fees can significantly affect investment returns.
            </dd>

            <dt className="font-semibold text-gray-900">Bond (Rental)</dt>
            <dd className="text-gray-600 mb-4">
              A security deposit paid by a tenant at the start of a tenancy, held by the state
              government bond authority (e.g. NSW Fair Trading, RTBA in VIC). The bond is refunded
              at the end of the tenancy if the property is left in good condition. Maximum bond is
              typically 4 weeks rent (varies by state).
            </dd>

            <dt className="font-semibold text-gray-900">Break Fee (Lease)</dt>
            <dd className="text-gray-600 mb-4">
              A fee payable by a tenant who ends a fixed-term lease before the agreed end date. The
              amount depends on how far through the lease you are and the state&apos;s legislation. In NSW,
              the fee is calculated based on a formula; in other states it may cover the landlord&apos;s
              reasonable reletting costs.
            </dd>

            <dt className="font-semibold text-gray-900">Bridging Finance</dt>
            <dd className="text-gray-600 mb-4">
              A short-term loan used to &quot;bridge&quot; the gap when buying a new property before selling
              an existing one. Bridging loans carry higher interest rates than standard home loans
              and are typically repaid once the existing property settles. They carry risk if the
              existing property takes longer to sell than anticipated.
            </dd>

            <dt className="font-semibold text-gray-900">Building Inspection</dt>
            <dd className="text-gray-600 mb-4">
              A professional assessment of a property&apos;s structural condition, usually conducted before
              exchange of contracts. Inspectors check for structural defects, dampness, roof condition,
              and other issues. A combined building and pest inspection costs around $400–$800 and is
              strongly recommended before any purchase.
            </dd>

            <dt className="font-semibold text-gray-900">Buyer&apos;s Agent</dt>
            <dd className="text-gray-600 mb-4">
              A licensed real estate professional who represents and advocates for a property buyer
              (not the seller). Buyer&apos;s agents research properties, conduct due diligence, and
              negotiate on the buyer&apos;s behalf. They charge either a flat fee or a percentage of the
              purchase price (typically 1–2.5%). Particularly valuable in competitive or unfamiliar
              markets.
            </dd>
          </dl>
        </section>

        {/* C */}
        <section id="section-C" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">C</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Capital Gain</dt>
            <dd className="text-gray-600 mb-4">
              The profit made when a property is sold for more than it was purchased for. For example,
              buying at $500,000 and selling at $750,000 results in a $250,000 capital gain. Capital
              gains may be subject to Capital Gains Tax (CGT).
            </dd>

            <dt className="font-semibold text-gray-900">Capital Gains Tax (CGT)</dt>
            <dd className="text-gray-600 mb-4">
              A tax on the profit made from selling a capital asset (including investment properties).
              In Australia, CGT is part of income tax — the gain is added to your taxable income in
              the year of sale. Properties held for more than 12 months receive a 50% CGT discount.
              Your primary residence (principal place of residence) is generally exempt from CGT.
            </dd>

            <dt className="font-semibold text-gray-900">Cash Rate (RBA)</dt>
            <dd className="text-gray-600 mb-4">
              The interest rate set by the Reserve Bank of Australia (RBA) for overnight loans between
              banks. The cash rate is the primary tool the RBA uses to manage inflation and economic
              activity. When the RBA raises the cash rate, banks typically pass on increases to
              variable mortgage rates within weeks.
            </dd>

            <dt className="font-semibold text-gray-900">Caveat</dt>
            <dd className="text-gray-600 mb-4">
              A legal notice lodged on a property&apos;s title to warn others that a third party has or
              claims an interest in the property. For example, a caveat might be lodged by someone
              who paid a deposit on a property before settlement, or by a creditor. A title search
              will reveal any caveats on a property.
            </dd>

            <dt className="font-semibold text-gray-900">Certificate of Title</dt>
            <dd className="text-gray-600 mb-4">
              The official government document that records ownership of a parcel of land. In most
              Australian states, land titles are now held electronically (e-conveyancing). The
              certificate shows the registered owner, any mortgages, caveats, or easements on the land.
            </dd>

            <dt className="font-semibold text-gray-900">Chattels</dt>
            <dd className="text-gray-600 mb-4">
              Moveable personal property that is not permanently attached to a building. In property
              sales, it is important to clarify what chattels are included (e.g. dishwasher, light
              fittings, window furnishings). Items that are part of the structure (fixed) are
              typically included in the sale unless excluded in the contract.
            </dd>

            <dt className="font-semibold text-gray-900">Clearance Certificate</dt>
            <dd className="text-gray-600 mb-4">
              A document from the ATO confirming that a property vendor is a resident of Australia
              for tax purposes. Required at settlement for property sales above $750,000. Without it,
              the buyer must withhold 12.5% of the purchase price and remit it to the ATO.
            </dd>

            <dt className="font-semibold text-gray-900">Commission (Agent)</dt>
            <dd className="text-gray-600 mb-4">
              The fee paid to a real estate agent for selling a property, typically expressed as a
              percentage of the sale price. Rates vary by state (commonly 1.5%–3.5%) and are
              negotiable. Commission is usually only payable upon successful settlement.
            </dd>

            <dt className="font-semibold text-gray-900">Comparison Rate</dt>
            <dd className="text-gray-600 mb-4">
              A standardised interest rate that incorporates most fees and charges associated with a
              loan (in addition to the base interest rate), expressed as an annual percentage. Required
              to be advertised by Australian lenders, it allows more accurate comparison between loan
              products. Always compare the comparison rate, not just the advertised rate.
            </dd>

            <dt className="font-semibold text-gray-900">Completion</dt>
            <dd className="text-gray-600 mb-4">
              The final stage of a property purchase, also known as settlement, when ownership
              transfers from vendor to buyer. Funds are exchanged, the title is transferred, and the
              buyer receives the keys. In Australia, settlement typically occurs 30–90 days after
              exchange of contracts.
            </dd>

            <dt className="font-semibold text-gray-900">Compulsory Acquisition</dt>
            <dd className="text-gray-600 mb-4">
              The power of government (federal, state, or local) to acquire privately owned land for
              public purposes (e.g. road widening, infrastructure projects), with or without the
              owner&apos;s consent. Owners must be paid compensation, but disputes about the amount can
              end up in court.
            </dd>

            <dt className="font-semibold text-gray-900">Contract of Sale</dt>
            <dd className="text-gray-600 mb-4">
              The legally binding document that sets out the terms and conditions of a property
              sale, including the purchase price, settlement date, deposit amount, and any special
              conditions (e.g. subject to finance, building inspection). Prepared by the vendor&apos;s
              solicitor or conveyancer.
            </dd>

            <dt className="font-semibold text-gray-900">Conveyancer / Conveyancing</dt>
            <dd className="text-gray-600 mb-4">
              Conveyancing is the legal process of transferring property ownership from vendor to
              buyer. A conveyancer (or solicitor) handles the contract review, searches, title
              transfer, and settlement process. In most states, buyers and sellers engage separate
              conveyancers.
            </dd>

            <dt className="font-semibold text-gray-900">Cooling Off Period</dt>
            <dd className="text-gray-600 mb-4">
              A period (typically 2–5 business days, depending on state) after signing a contract of
              sale during which the buyer can withdraw from the purchase, usually forfeiting a small
              penalty (often 0.25% of the price). There is no cooling-off period for properties sold
              at auction. Rules vary significantly by state.
            </dd>

            <dt className="font-semibold text-gray-900">Cross-Collateralisation</dt>
            <dd className="text-gray-600 mb-4">
              Where multiple properties are used as security for a single loan, or where a lender
              links different loans together. This can limit your flexibility to sell one property
              without affecting others. Experienced property investors often avoid cross-collateralisation
              to maintain independent control of each asset.
            </dd>
          </dl>
        </section>

        {/* D */}
        <section id="section-D" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">D</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Debt-to-Income Ratio (DTI)</dt>
            <dd className="text-gray-600 mb-4">
              The ratio of a borrower&apos;s total debt to their gross annual income. Australian regulators
              have asked lenders to limit high DTI lending (above 6x income). For example, if you earn
              $100,000 and have $600,000 in total debt, your DTI is 6. A high DTI can affect your
              ability to borrow.
            </dd>

            <dt className="font-semibold text-gray-900">Depreciation (Property)</dt>
            <dd className="text-gray-600 mb-4">
              The decline in value of a building or its fixtures and fittings over time due to wear
              and tear. Investment property owners can claim depreciation as a tax deduction. A
              quantity surveyor prepares a depreciation schedule that details the deductible amounts
              each year. This can be a significant tax benefit for new or recently constructed properties.
            </dd>

            <dt className="font-semibold text-gray-900">Deposit Bond</dt>
            <dd className="text-gray-600 mb-4">
              A guarantee (not cash) provided by an insurer that substitutes for a cash deposit when
              exchanging contracts. Used when a buyer has their funds tied up elsewhere (e.g. in an
              existing property yet to sell). If the buyer defaults, the bond issuer pays the vendor
              and then recovers the money from the buyer.
            </dd>

            <dt className="font-semibold text-gray-900">Development Application (DA)</dt>
            <dd className="text-gray-600 mb-4">
              A formal application to the local council for approval to carry out development work
              (e.g. building a house, extending a property, or changing land use). DAs are assessed
              against the local planning scheme. Some developments may qualify as &quot;complying
              development&quot; and bypass the DA process.
            </dd>

            <dt className="font-semibold text-gray-900">Discharge Fee</dt>
            <dd className="text-gray-600 mb-4">
              A fee charged by a lender when a mortgage is paid off (discharged) from the property&apos;s
              title. Typically $150–$400. Also called an &quot;exit fee&quot; at some lenders, though these
              were banned for new loans taken out after 2011 in Australia.
            </dd>

            <dt className="font-semibold text-gray-900">Draw Down</dt>
            <dd className="text-gray-600 mb-4">
              The process of accessing loan funds, either all at once or in stages. Used most
              commonly with construction loans, where funds are released progressively as building
              milestones are reached (e.g. slab poured, frame complete, lockup, fit-out).
            </dd>

            <dt className="font-semibold text-gray-900">Dual Occupancy</dt>
            <dd className="text-gray-600 mb-4">
              A property that contains two separate dwellings on the same lot — either attached
              (e.g. duplex) or detached (e.g. house plus granny flat). Dual occupancy can be an
              effective strategy for generating rental income. Approval requirements vary by state
              and council.
            </dd>
          </dl>
        </section>

        {/* E */}
        <section id="section-E" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">E</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Easement</dt>
            <dd className="text-gray-600 mb-4">
              A legal right for a third party to use a portion of someone else&apos;s land for a specific
              purpose, such as a drainage easement, power line corridor, or right of way for a
              neighbour. Easements appear on the title and can affect what you can build on that
              part of the land.
            </dd>

            <dt className="font-semibold text-gray-900">Encumbrance</dt>
            <dd className="text-gray-600 mb-4">
              Any right, interest, or liability attached to a property that may limit the owner&apos;s
              use or reduce its value — such as a mortgage, caveat, easement, or restrictive covenant.
              A full title search before purchase will reveal all encumbrances.
            </dd>

            <dt className="font-semibold text-gray-900">Equity</dt>
            <dd className="text-gray-600 mb-4">
              The difference between what a property is worth and what is owed on it. For example,
              a property worth $800,000 with a $500,000 mortgage has $300,000 in equity. Equity can
              be used as security to borrow additional funds (e.g. to purchase an investment property
              or fund renovations).
            </dd>

            <dt className="font-semibold text-gray-900">Exchange of Contracts</dt>
            <dd className="text-gray-600 mb-4">
              The point at which both vendor and buyer sign (and exchange) identical copies of the
              contract of sale, making the agreement legally binding. The buyer typically pays the
              deposit at exchange. In NSW, exchange is the critical milestone — the cooling-off period
              (if any) starts from exchange.
            </dd>

            <dt className="font-semibold text-gray-900">Exclusive Agency Agreement</dt>
            <dd className="text-gray-600 mb-4">
              A contract appointing one real estate agent as the sole agent to sell a property for a
              specified period (typically 60–90 days). During this period, commission is payable to
              the appointed agent even if the property is sold through another party. Most residential
              auction campaigns use exclusive agreements.
            </dd>
          </dl>
        </section>

        {/* F */}
        <section id="section-F" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">F</h2>
          <dl>
            <dt className="font-semibold text-gray-900">FIRB (Foreign Investment Review Board)</dt>
            <dd className="text-gray-600 mb-4">
              The Australian government body that reviews foreign investment proposals in Australia.
              Most foreign nationals require FIRB approval before purchasing residential property.
              Generally limited to new dwellings, off-the-plan purchases, or established dwellings
              for redevelopment. Application fees apply and can be significant.
            </dd>

            <dt className="font-semibold text-gray-900">Fixed Interest Rate</dt>
            <dd className="text-gray-600 mb-4">
              A home loan where the interest rate is locked for a set period (typically 1–5 years),
              regardless of changes to the RBA cash rate. Provides certainty over repayments but
              usually comes with restrictions on extra repayments and break costs if you exit the
              fixed period early.
            </dd>

            <dt className="font-semibold text-gray-900">Fixtures</dt>
            <dd className="text-gray-600 mb-4">
              Items that are permanently attached to a property and generally included in the sale,
              such as built-in wardrobes, light fittings, and kitchen cupboards. Distinct from
              chattels (moveable items). If in doubt whether something is included, clarify in the
              contract of sale.
            </dd>

            <dt className="font-semibold text-gray-900">Freehold</dt>
            <dd className="text-gray-600 mb-4">
              The most common form of property ownership in Australia — outright ownership of the
              land and any buildings on it, with no time limit. Contrast with leasehold (common in
              the ACT, where residential land is leased from the government for 99 years).
            </dd>

            <dt className="font-semibold text-gray-900">Funds to Complete</dt>
            <dd className="text-gray-600 mb-4">
              The total amount of money a buyer needs to have available at settlement to complete
              the purchase. This includes the balance of the purchase price (after deposit), stamp
              duty, legal fees, and any adjustments for rates and water. Your conveyancer will
              calculate this shortly before settlement.
            </dd>
          </dl>
        </section>

        {/* G */}
        <section id="section-G" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">G</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Gazumping</dt>
            <dd className="text-gray-600 mb-4">
              When a vendor accepts a higher offer from a different buyer after verbally agreeing to
              sell to someone else, but before contracts have been exchanged. Gazumping is legal in
              most Australian states because verbal agreements are not binding — only a signed contract
              of sale creates a legal obligation. It is most common in NSW in competitive markets.
            </dd>

            <dt className="font-semibold text-gray-900">Gearing (Positive / Negative / Neutral)</dt>
            <dd className="text-gray-600 mb-4">
              The relationship between an investment property&apos;s rental income and its expenses
              (including interest). <em>Negative gearing</em>: expenses exceed income, creating a
              tax-deductible loss. <em>Positive gearing</em>: income exceeds expenses, generating
              taxable profit. <em>Neutral gearing</em>: income equals expenses.
            </dd>

            <dt className="font-semibold text-gray-900">Gross Rental Yield</dt>
            <dd className="text-gray-600 mb-4">
              Annual rental income as a percentage of the property&apos;s purchase price, before
              deducting expenses. Calculated as: (weekly rent × 52 ÷ property price) × 100. For
              example, a $600,000 property renting at $500/week has a gross yield of 4.3%. Compare
              with net rental yield (after expenses).
            </dd>

            <dt className="font-semibold text-gray-900">GST on Property</dt>
            <dd className="text-gray-600 mb-4">
              Goods and Services Tax (10%) generally applies to the sale of new residential properties
              by developers but not to the resale of existing homes between private individuals.
              Commercial properties and new subdivisions may also attract GST. If buying a new
              property, confirm whether the advertised price is GST-inclusive.
            </dd>
          </dl>
        </section>

        {/* H */}
        <section id="section-H" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">H</h2>
          <dl>
            <dt className="font-semibold text-gray-900">HEM (Household Expenditure Measure)</dt>
            <dd className="text-gray-600 mb-4">
              A benchmark used by Australian lenders to assess a borrower&apos;s living expenses when
              calculating loan serviceability. If a borrower&apos;s declared expenses are lower than HEM,
              the lender typically uses HEM. HEM was introduced to address concerns about lenders
              accepting unrealistically low expense estimates.
            </dd>

            <dt className="font-semibold text-gray-900">Hold-Over Tenancy</dt>
            <dd className="text-gray-600 mb-4">
              When a tenant remains in a property after their fixed-term lease has expired, without
              signing a new agreement. The tenancy continues on the same terms as the original lease
              but becomes a periodic (month-to-month) tenancy. Rules on notice periods in this
              situation vary by state.
            </dd>
          </dl>
        </section>

        {/* I */}
        <section id="section-I" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">I</h2>
          <dl>
            <dt className="font-semibold text-gray-900">ICSEA</dt>
            <dd className="text-gray-600 mb-4">
              Index of Community Socio-Educational Advantage — a score used by ACARA to indicate
              the socio-educational background of a school&apos;s student population. The average ICSEA
              score is 1,000. Scores above 1,000 indicate a higher-than-average advantaged student
              population; below 1,000 indicates disadvantage. Used by parents comparing schools and
              by researchers analysing educational outcomes.
            </dd>

            <dt className="font-semibold text-gray-900">Interest-Only Loan</dt>
            <dd className="text-gray-600 mb-4">
              A home loan where you only pay the interest component for a set period (typically 1–5
              years), without reducing the principal. Popular with investors as it keeps repayments
              lower and preserves cash flow. After the interest-only period, repayments switch to
              principal and interest, which means higher repayments.
            </dd>

            <dt className="font-semibold text-gray-900">Interest Rate Buffer</dt>
            <dd className="text-gray-600 mb-4">
              APRA requires lenders to assess whether borrowers can afford their loan repayments
              if interest rates were to rise by at least 3 percentage points above the actual loan rate.
              This &quot;serviceability buffer&quot; is designed to protect borrowers from rate increases and
              is a key reason why your assessed borrowing capacity may be lower than you expect.
            </dd>
          </dl>
        </section>

        {/* J */}
        <section id="section-J" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">J</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Joint Tenants (vs Tenants in Common)</dt>
            <dd className="text-gray-600 mb-4">
              Two ways to co-own property. <em>Joint tenants</em> each own 100% of the property
              together — if one owner dies, their share automatically passes to the surviving owner(s)
              (right of survivorship). Commonly used by married couples. <em>Tenants in common</em>
              each own a defined share (e.g. 50/50 or 70/30), which can be passed through a will.
              Commonly used by business partners or unmarried couples.
            </dd>
          </dl>
        </section>

        {/* L */}
        <section id="section-L" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">L</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Land Tax</dt>
            <dd className="text-gray-600 mb-4">
              An annual state government tax on the total unimproved value of land you own above a
              threshold. Your principal place of residence is generally exempt. Investment properties
              are subject to land tax, and the rates vary significantly by state. Land tax can
              materially affect the economics of property investment — factor it into your analysis.
            </dd>

            <dt className="font-semibold text-gray-900">Land Transfer Duty</dt>
            <dd className="text-gray-600 mb-4">
              See <em>Stamp Duty (Transfer Duty)</em>.
            </dd>

            <dt className="font-semibold text-gray-900">Lenders Mortgage Insurance (LMI)</dt>
            <dd className="text-gray-600 mb-4">
              Insurance that protects the lender (not the borrower) if the borrower defaults and
              the property is sold for less than the outstanding loan. Required when the loan-to-value
              ratio (LVR) exceeds 80%. LMI can cost tens of thousands of dollars — it is usually
              added to the loan. Some lenders waive LMI for professionals (e.g. doctors, lawyers)
              or for government-backed schemes.
            </dd>

            <dt className="font-semibold text-gray-900">Lien</dt>
            <dd className="text-gray-600 mb-4">
              A legal claim against a property as security for a debt. A mortgage is the most common
              form of lien. Other liens can include unpaid council rates, outstanding body corporate
              levies, or builder&apos;s liens. Liens are registered on the property&apos;s title.
            </dd>

            <dt className="font-semibold text-gray-900">Line of Credit</dt>
            <dd className="text-gray-600 mb-4">
              A flexible loan facility that allows you to borrow up to a set limit using your property
              as security, drawing and repaying funds as needed (similar to a large credit card). Often
              used by investors to fund renovations or purchase deposits. Interest is charged only on
              the drawn balance.
            </dd>

            <dt className="font-semibold text-gray-900">Loan to Value Ratio (LVR)</dt>
            <dd className="text-gray-600 mb-4">
              The ratio of a loan amount to the value of the property being purchased, expressed as
              a percentage. If you borrow $640,000 to buy an $800,000 property, your LVR is 80%.
              Lenders use LVR to assess risk — loans above 80% LVR typically require LMI. Lower LVR
              means lower risk for the lender and often access to better rates.
            </dd>
          </dl>
        </section>

        {/* M */}
        <section id="section-M" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">M</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Median Price</dt>
            <dd className="text-gray-600 mb-4">
              The middle price in a ranked list of all sale prices in a given suburb and period.
              Half of sales occurred above the median, half below. The median is preferred over
              the average (mean) because it is less distorted by extreme high or low sales. A suburb
              with a $700,000 median means half of homes sold for more and half for less.
            </dd>

            <dt className="font-semibold text-gray-900">Mortgage</dt>
            <dd className="text-gray-600 mb-4">
              A loan secured against real estate. The property serves as security — if the borrower
              defaults, the lender can sell the property to recover the debt. In Australia, most home
              loans are structured as principal and interest mortgages repaid over 25–30 years. The
              mortgage is registered on the property&apos;s title.
            </dd>

            <dt className="font-semibold text-gray-900">Mortgage Broker</dt>
            <dd className="text-gray-600 mb-4">
              A licensed professional who helps borrowers find and apply for home loans from a panel
              of lenders. Mortgage brokers are paid by the lender (via upfront and trail commissions),
              not typically by the borrower. They are required by law to act in the borrower&apos;s best
              interest (best interests duty). Useful for comparing a wide range of loan products.
            </dd>

            <dt className="font-semibold text-gray-900">Mortgagee in Possession</dt>
            <dd className="text-gray-600 mb-4">
              When a lender takes control of a property after a borrower defaults on their loan.
              The lender may then sell the property (mortgagee sale) to recover the outstanding debt.
              Mortgagee sales are often priced below market value for a quick sale, but buyers take
              on more risk as the property is typically sold without warranties.
            </dd>
          </dl>
        </section>

        {/* N */}
        <section id="section-N" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">N</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Negative Gearing</dt>
            <dd className="text-gray-600 mb-4">
              When an investment property&apos;s expenses (interest, rates, management, depreciation)
              exceed its rental income, creating a net loss. This loss can be used to offset other
              taxable income, reducing the investor&apos;s tax bill. Negative gearing is a common strategy
              in Australia, though the benefit depends on the investor&apos;s marginal tax rate.
            </dd>

            <dt className="font-semibold text-gray-900">Net Rental Yield</dt>
            <dd className="text-gray-600 mb-4">
              Annual rental income as a percentage of property value, after deducting all expenses
              (management fees, rates, insurance, maintenance, body corporate, etc.). A more realistic
              measure of investment return than gross yield. Net yields are typically 1–1.5% lower
              than gross yields.
            </dd>

            <dt className="font-semibold text-gray-900">Non-Conforming Loan</dt>
            <dd className="text-gray-600 mb-4">
              A home loan provided to borrowers who do not meet standard lending criteria — for
              example, those with bad credit, irregular income, or high LVR. Non-conforming loans
              typically carry higher interest rates than standard loans to compensate for the higher
              risk. Also called &quot;low doc&quot; or &quot;specialist&quot; loans in some contexts.
            </dd>
          </dl>
        </section>

        {/* O */}
        <section id="section-O" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">O</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Offset Account</dt>
            <dd className="text-gray-600 mb-4">
              A transaction account linked to a home loan where the balance reduces the interest
              charged on the loan. If you have a $500,000 loan and $50,000 in your offset account,
              you only pay interest on $450,000. Offset accounts are a highly effective way to reduce
              interest costs while keeping funds accessible.
            </dd>

            <dt className="font-semibold text-gray-900">Open Listing</dt>
            <dd className="text-gray-600 mb-4">
              An agency agreement where the vendor can appoint multiple agents to sell the property
              simultaneously. Commission is only paid to the agent who ultimately sells the property.
              Less common for residential property, where exclusive agreements are the norm.
            </dd>

            <dt className="font-semibold text-gray-900">Option Fee</dt>
            <dd className="text-gray-600 mb-4">
              A payment made to secure the exclusive right to purchase a property at a specified
              price within a set time period. If the buyer exercises the option (proceeds with the
              purchase), the fee typically counts toward the purchase price. If not exercised, the
              fee is forfeited. Common in commercial property and development deals.
            </dd>
          </dl>
        </section>

        {/* P */}
        <section id="section-P" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">P</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Pre-Approval (Conditional Approval)</dt>
            <dd className="text-gray-600 mb-4">
              An assessment by a lender indicating how much they would be willing to lend you,
              subject to satisfactory valuation and verification of your information. Pre-approval
              is not a guarantee of finance — it is conditional. It is valid for a set period
              (typically 3–6 months) and gives you confidence when making offers or bidding at auction.
            </dd>

            <dt className="font-semibold text-gray-900">Principal and Interest</dt>
            <dd className="text-gray-600 mb-4">
              The standard home loan repayment structure where each payment covers both interest
              charges and a portion of the principal (the amount borrowed). Over time, as the
              principal reduces, a greater portion of each repayment goes toward the principal. Most
              owner-occupier loans are principal and interest.
            </dd>

            <dt className="font-semibold text-gray-900">Private Sale</dt>
            <dd className="text-gray-600 mb-4">
              A method of selling property through a negotiated price process, rather than auction.
              The vendor sets an asking price; buyers make offers and negotiate. Private sales often
              include a cooling-off period and may include conditions such as subject to finance or
              building inspection. More common in some states (e.g. QLD, WA) than auction-dominated
              markets (Sydney, Melbourne).
            </dd>

            <dt className="font-semibold text-gray-900">Proportional Ownership</dt>
            <dd className="text-gray-600 mb-4">
              Where two or more people own a property in specified shares (e.g. 60/40 or 70/30)
              rather than equally. This structure, used under a tenants in common arrangement, allows
              owners with different financial contributions to hold ownership shares that reflect
              their investment.
            </dd>

            <dt className="font-semibold text-gray-900">Put and Call Option</dt>
            <dd className="text-gray-600 mb-4">
              A contract giving one party the right to require the other to buy or sell a property
              at an agreed price within a set timeframe. A &quot;put&quot; option gives the seller the right
              to require the buyer to purchase; a &quot;call&quot; option gives the buyer the right to require
              the seller to sell. Commonly used in development transactions to control a property
              without full commitment.
            </dd>
          </dl>
        </section>

        {/* Q */}
        <section id="section-Q" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Q</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Quantity Surveyor (QS)</dt>
            <dd className="text-gray-600 mb-4">
              A professional who estimates and manages the costs of construction and building works.
              For investment properties, a quantity surveyor prepares a <em>tax depreciation
              schedule</em> — a report itemising the depreciation claimable on the building and its
              fixtures. This schedule is submitted with your tax return each year to claim the
              deductions. A good QS can save investors thousands in tax annually.
            </dd>
          </dl>
        </section>

        {/* R */}
        <section id="section-R" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">R</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Redraw Facility</dt>
            <dd className="text-gray-600 mb-4">
              A home loan feature that allows you to access extra repayments you have made above
              the minimum. If you have paid $30,000 extra into your loan, you can redraw that
              amount (subject to lender conditions). Unlike an offset account, funds in redraw have
              already reduced your loan balance and may have different tax implications.
            </dd>

            <dt className="font-semibold text-gray-900">Refinancing</dt>
            <dd className="text-gray-600 mb-4">
              The process of replacing an existing mortgage with a new one — either with the same
              lender or a different one. People refinance to access a lower interest rate, release
              equity, consolidate debt, or change loan features. Refinancing may involve discharge
              fees and establishment fees for the new loan.
            </dd>

            <dt className="font-semibold text-gray-900">Rentvesting</dt>
            <dd className="text-gray-600 mb-4">
              A strategy where someone rents the home they live in (often in a preferred location)
              while purchasing an investment property in a more affordable area. Rentvesting allows
              investors to enter the property market without giving up lifestyle preferences, while
              benefiting from investment property tax deductions and potential capital growth.
            </dd>

            <dt className="font-semibold text-gray-900">Restrictive Covenant</dt>
            <dd className="text-gray-600 mb-4">
              A condition registered on a property&apos;s title that restricts how the land can be used
              or what can be built on it. For example, a covenant may prohibit building more than
              one dwelling, or require materials of a specific type. Covenants are enforceable
              regardless of who owns the property and survive on the title indefinitely.
            </dd>

            <dt className="font-semibold text-gray-900">Right of Way</dt>
            <dd className="text-gray-600 mb-4">
              An easement granting the right to pass over another person&apos;s land. For example, a
              shared driveway that provides access to a neighbouring property. Rights of way appear
              on the title and must be disclosed in a sale — they cannot be removed without the
              benefit holder&apos;s agreement.
            </dd>
          </dl>
        </section>

        {/* S */}
        <section id="section-S" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">S</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Section 32 (VIC)</dt>
            <dd className="text-gray-600 mb-4">
              Also known as the &quot;Vendor&apos;s Statement,&quot; this is a document prepared by the vendor&apos;s
              legal representative in Victoria that must be provided to prospective buyers before
              signing a contract. It discloses key information about the property including title
              details, outgoings, zoning, and any known defects or restrictions. Reviewing the
              Section 32 carefully (with a conveyancer) is essential before signing anything.
            </dd>

            <dt className="font-semibold text-gray-900">Serviceability</dt>
            <dd className="text-gray-600 mb-4">
              A lender&apos;s assessment of whether a borrower can afford to repay a loan. Lenders assess
              income, expenses, existing debts, and apply a serviceability buffer (currently 3% above
              the loan rate). Your borrowing capacity is largely determined by serviceability — even
              if you have a large deposit, a lender won&apos;t lend you more than you can service.
            </dd>

            <dt className="font-semibold text-gray-900">Settlement</dt>
            <dd className="text-gray-600 mb-4">
              The final step of a property transaction where ownership officially transfers from
              vendor to buyer. At settlement, the balance of the purchase price is paid, the title
              is transferred, and the buyer receives the keys. Settlement typically occurs 30–90 days
              after exchange of contracts. In Australia, most settlements now occur electronically
              via the PEXA platform.
            </dd>

            <dt className="font-semibold text-gray-900">Stamp Duty (Transfer Duty)</dt>
            <dd className="text-gray-600 mb-4">
              A state government tax payable by property buyers on the purchase price. Rates vary
              significantly by state and property value — it can represent a major upfront cost
              (e.g. $30,000–$50,000+ on a $1M property in NSW). First home buyers may be eligible
              for exemptions or concessions. Use our{" "}
              <a href="/stamp-duty-calculator" className="text-primary hover:underline">stamp duty calculator</a>{" "}
              to estimate your liability.
            </dd>

            <dt className="font-semibold text-gray-900">Strata Title</dt>
            <dd className="text-gray-600 mb-4">
              A form of property ownership used for apartments, townhouses, and units within a
              larger complex. Each owner holds title to their individual lot (their apartment) plus
              an undivided share in the common property (foyer, lifts, garden). The building is
              managed by a body corporate (or owners corporation) funded by owner levies.
            </dd>

            <dt className="font-semibold text-gray-900">Subject to Finance Clause</dt>
            <dd className="text-gray-600 mb-4">
              A condition in a contract of sale that allows the buyer to withdraw from the purchase
              without penalty if they are unable to obtain finance approval within a specified
              timeframe (typically 14–21 days). This clause does not apply to auction purchases.
              It protects the buyer but gives the vendor less certainty.
            </dd>
          </dl>
        </section>

        {/* T */}
        <section id="section-T" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">T</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Tenants in Common</dt>
            <dd className="text-gray-600 mb-4">
              See <em>Joint Tenants (vs Tenants in Common)</em>.
            </dd>

            <dt className="font-semibold text-gray-900">Title Search</dt>
            <dd className="text-gray-600 mb-4">
              A search of the official land titles register to confirm ownership, identify any
              encumbrances (mortgages, caveats, easements), and check for any other registered
              interests. Conducted by conveyancers as part of the conveyancing process. A title
              search is a fundamental step in any property purchase.
            </dd>

            <dt className="font-semibold text-gray-900">Transfer Duty</dt>
            <dd className="text-gray-600 mb-4">
              See <em>Stamp Duty (Transfer Duty)</em>.
            </dd>
          </dl>
        </section>

        {/* U */}
        <section id="section-U" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">U</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Unconditional Contract</dt>
            <dd className="text-gray-600 mb-4">
              A contract of sale with no outstanding conditions — both parties are legally bound to
              complete the transaction. Auction purchases are unconditional from the moment the hammer
              falls. Private sale contracts become unconditional once all conditions (such as finance
              and building inspection) are satisfied or waived.
            </dd>

            <dt className="font-semibold text-gray-900">Unencumbered</dt>
            <dd className="text-gray-600 mb-4">
              A property (or the equity in a property) that is free from any mortgages, caveats, or
              other registered interests. An unencumbered property can be used as security for a new
              loan without any complications from existing charges.
            </dd>
          </dl>
        </section>

        {/* V */}
        <section id="section-V" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">V</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Valuation</dt>
            <dd className="text-gray-600 mb-4">
              A formal assessment of a property&apos;s market value by a licensed property valuer.
              Banks commission valuations before approving a mortgage to ensure the property
              provides adequate security. Bank valuations are often conservative and may come in
              below the contract price — which can affect borrowing capacity.
            </dd>

            <dt className="font-semibold text-gray-900">Variable Rate</dt>
            <dd className="text-gray-600 mb-4">
              A home loan interest rate that can move up or down in response to changes in the
              market or lender policy (typically linked to the RBA cash rate). Variable rate loans
              offer more flexibility than fixed rate loans (e.g. unlimited extra repayments, offset
              accounts) but less payment certainty.
            </dd>

            <dt className="font-semibold text-gray-900">Vendor</dt>
            <dd className="text-gray-600 mb-4">
              The seller of a property. In Australian real estate, the person selling is referred
              to as the &quot;vendor&quot; and the person buying is the &quot;purchaser&quot; or &quot;buyer.&quot;
            </dd>

            <dt className="font-semibold text-gray-900">Vendor Finance</dt>
            <dd className="text-gray-600 mb-4">
              An arrangement where the seller (vendor) provides finance to the buyer, rather than
              the buyer obtaining a bank loan. The buyer pays the purchase price in instalments
              directly to the vendor. Vendor finance is uncommon in mainstream residential property
              but may be used in regional areas or where buyers have difficulty obtaining bank finance.
            </dd>

            <dt className="font-semibold text-gray-900">Vendor&apos;s Statement</dt>
            <dd className="text-gray-600 mb-4">
              A document prepared by the seller&apos;s legal representative that discloses key information
              about the property to potential buyers. Known as a Section 32 in VIC and a Vendor
              Disclosure Statement in other states. Includes title details, zoning, outgoings, and
              known encumbrances.
            </dd>
          </dl>
        </section>

        {/* W */}
        <section id="section-W" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">W</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Writ</dt>
            <dd className="text-gray-600 mb-4">
              A legal order issued by a court. In property, a writ may be registered on a property&apos;s
              title if a court has ordered the owner to pay a debt. A writ can prevent the sale or
              refinancing of a property until the underlying debt is resolved. A title search will
              reveal any writs registered against the property.
            </dd>
          </dl>
        </section>

        {/* Z */}
        <section id="section-Z" className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Z</h2>
          <dl>
            <dt className="font-semibold text-gray-900">Zoning</dt>
            <dd className="text-gray-600 mb-4">
              The classification of land by local government that determines what can be built or
              done on it. Common residential zones include low density (single houses), medium density
              (townhouses, small apartments), and high density (apartment buildings). Zoning directly
              affects what you can build on a block and its development potential — always check the
              zoning before purchasing land for development.
            </dd>
          </dl>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
          <p className="text-sm text-blue-800">
            <strong>Learn more:</strong> Explore our{" "}
            <a href="/guides" className="underline hover:text-blue-900">guides</a>{" "}
            covering buying, renting, investing, and selling property in Australia.
          </p>
        </div>
      </div>
    </div>
  );
}
