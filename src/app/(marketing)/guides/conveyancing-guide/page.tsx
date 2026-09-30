import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  KeyFigure,
  MatchCTA,
  MiniStampDutyEmbed,
  PullQuote,
  ScrollTable,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type RelatedGuide,
} from "@/components/guide";
import { ConveyancingCostEstimator } from "@/components/calculators/ConveyancingCostEstimator";
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";
import {
  CONVEYANCING_FEES,
  CONVEYANCING_SOURCES,
  VIC_TRANSFER,
  QLD_TRANSFER,
  type FeeRange,
} from "@/lib/data/conveyancing-fees";
import {
  estimateConveyancingCost,
  formatFee,
  formatFeeRange,
  type ConveyancingEstimate,
} from "@/lib/conveyancing-costs";
import { CONVEYANCING_FAQS, NSW_EXAMPLE_PRICE } from "@/lib/data/conveyancing-faqs";

const FRONTMATTER: GuideFrontmatter = {
  title: "Conveyancing Fees in Australia (2026): Costs in NSW, VIC, QLD and Every State",
  description:
    "What conveyancing costs to buy or sell in NSW, Victoria, Queensland and every other state: professional fees, searches, PEXA and registry fees from the 2026/27 schedules, a cost estimator, and when to use a solicitor.",
  slug: "conveyancing-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-09-30",
  readingTimeMinutes: 13,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

// The <title> is shorter than the H1: the root layout appends
// " | Your Property Guide", and 60 characters before that suffix is the SERP
// budget (tests/seo/titles.test.ts). The long form stays the H1 and the
// Article headline, which read FRONTMATTER.title.
const SEO_TITLE = "Conveyancing Fees 2026: Costs in NSW, VIC, QLD & Every State";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: SEO_TITLE,
    description: FRONTMATTER.description,
    type: "article",
    publishedTime: FRONTMATTER.publishedAt,
    modifiedTime: FRONTMATTER.updatedAt,
    images: guideOgImages({
      slug: FRONTMATTER.slug,
      title: FRONTMATTER.title,
      description: FRONTMATTER.description,
      persona: FRONTMATTER.persona,
    }),
  },
};

const PRICE = NSW_EXAMPLE_PRICE;
const est = (state: StateCode, side: "buy" | "sell") => estimateConveyancingCost({ state, side, price: PRICE });
const NSW_BUY = est("NSW", "buy");
const NSW_SELL = est("NSW", "sell");
const VIC_BUY = est("VIC", "buy");
const VIC_SELL = est("VIC", "sell");
const QLD_BUY = est("QLD", "buy");
const QLD_SELL = est("QLD", "sell");
const nsw = CONVEYANCING_FEES.NSW;
const vic = CONVEYANCING_FEES.VIC;
const qld = CONVEYANCING_FEES.QLD;
const p = (r: FeeRange) => formatFeeRange(r, "prose");
const PRICE_TEXT = `$${PRICE.toLocaleString("en-AU")}`;
const ALL_STATES: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const OTHER_STATES: StateCode[] = ["WA", "SA", "TAS", "ACT", "NT"];
const vicRegistration = VIC_BUY.lines.find((l) => l.key === "registration")!.low;
const qldRegistration = QLD_BUY.lines.find((l) => l.key === "registration")!.low;

const TLDR = [
  `Professional fees for a standard purchase: NSW ${p(nsw.buy)}, Victoria ${p(vic.buy)}, Queensland ${p(qld.buy)} (fee guides and published fixed fees, April to September 2026). Published state averages run from $1,050 in Queensland to $1,875 in the Northern Territory (OpenAgent, 17 September 2026).`,
  `Disbursements come on top: searches, the $146.30 PEXA settlement fee and the registry's transfer fee from 1 July 2026. On an ${PRICE_TEXT} purchase that is ${p(NSW_BUY.disbursements)} in NSW, ${p(VIC_BUY.disbursements)} in Victoria and ${p(QLD_BUY.disbursements)} in Queensland, where the registry fee rises with the price.`,
  "Queensland does not license conveyancers, so conveyancing there is done by law firms. In the other states a licensed conveyancer (a settlement agent in WA) or a solicitor can act.",
  "Both buyers and sellers engage their own conveyancer. Engage yours before you make an offer so they can review the contract and Section 32 (or equivalent) before you sign.",
  "Red flags in contracts include unusually long settlement periods, missing inclusions, undisclosed title encumbrances, and aggressive sunset clauses on off-the-plan purchases.",
  "Use a solicitor (not a conveyancer) when buying via a trust or SMSF, for complex joint ownership, or when contract disputes are likely.",
];

const TOC: GuideTOCEntry[] = [
  { id: "costs",                    label: "Conveyancing fees by state" },
  { id: "estimator",                label: "Conveyancing cost estimator" },
  { id: "cost-nsw",                 label: "Cost in NSW" },
  { id: "cost-vic",                 label: "Cost in Victoria" },
  { id: "cost-qld",                 label: "Cost in Queensland" },
  { id: "cost-other-states",        label: "WA, SA, Tasmania, ACT and NT" },
  { id: "what-is",                  label: "What conveyancing is" },
  { id: "conveyancer-vs-solicitor", label: "Conveyancer vs solicitor" },
  { id: "process",                  label: "The conveyancing process step by step" },
  { id: "diy",                      label: "DIY conveyancing (not recommended)" },
  { id: "red-flags",                label: "Red flags in contracts" },
  { id: "when-solicitor",           label: "When to use a solicitor instead" },
  { id: "choosing",                 label: "How to choose a conveyancer" },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide",          href: "/guides/first-home-buyer-guide", description: "Where conveyancing fits in the broader buying process." },
  { title: "Buying Property in Australia",    href: "/guides/buying-property-australia", description: "The full step-by-step buying process." },
  { title: "Property Auction Guide",          href: "/guides/property-auction-guide", description: "What changes when you buy at auction (no cooling off)." },
  { title: "Building and Pest Inspection Cost", href: "/guides/building-pest-inspection", description: "The other professional you'll engage before settlement, priced by city." },
  { title: "Real Estate Agent Fees",          href: "/guides/real-estate-agent-fees-australia", description: "If you're selling, the other big professional cost." },
  { title: "Stamp Duty Calculator",           href: "/stamp-duty-calculator", description: "The largest line item your conveyancer will arrange at settlement." },
];

/** The disbursement lines of one worked example, with its mortgage additions. */
function DisbursementTable({ e }: { e: ConveyancingEstimate }) {
  return (
    <ScrollTable label={`Conveyancing costs ${e.side === "buy" ? "buying" : "selling"} in ${e.state} at ${PRICE_TEXT}`}>
      <table>
        <thead>
          <tr>
            <th>{e.side === "buy" ? "Buying" : "Selling"} at {PRICE_TEXT}</th>
            <th>Cost</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Professional fee</td><td>{formatFeeRange(e.professional)}</td><td>See the state summary above</td></tr>
          {e.lines.map((l) => (
            <tr key={l.key}><td>{l.label}</td><td>{formatFeeRange(l)}</td><td>{l.source}</td></tr>
          ))}
          <tr><td><strong>Total</strong></td><td><strong>{formatFeeRange(e.total)}</strong></td><td>Professional fee plus disbursements</td></tr>
          {e.mortgageLines.map((l) => (
            <tr key={l.key}><td>If there is a mortgage: {l.label}</td><td>{formatFeeRange(l)}</td><td>{l.source}</td></tr>
          ))}
          {e.strataLines.map((l) => (
            <tr key={l.key}><td>Strata or owners corporation: {l.label}</td><td>{formatFeeRange(l)}</td><td>{l.source}</td></tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}

export default function ConveyancingGuidePage() {
  return (
    <>
      <HowToJsonLd
        name="How to engage a conveyancer in Australia"
        description="The five-step process for engaging a conveyancer or solicitor for an Australian property transaction."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Pick conveyancer or solicitor", text: "Conveyancer for standard transactions, solicitor for complex ones (deceased estates, foreign buyers, structural disputes)." },
          { name: "Get three quotes", text: "Compare fees, inclusions, and turnaround time. Cheapest is rarely best." },
          { name: "Engage early, before you find a property", text: "Saves a week of vendor-recommended-conveyancer faff later." },
          { name: "Sign engagement and provide details", text: "ID, financing details, and any specific concerns about the property." },
          { name: "Conveyancer runs searches and reviews contract", text: "Title, planning, council rates, and any easements or covenants." },
          { name: "Settlement coordination", text: "Conveyancer arranges PEXA settlement and the discharge of any existing mortgage." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={CONVEYANCING_FAQS}
      related={RELATED}
    >
      <h2 id="costs">How much does conveyancing cost?</h2>
      <p className="lead">
        Conveyancing costs two things: the professional fee for the
        conveyancer&rsquo;s or solicitor&rsquo;s work, and disbursements,
        the searches, certificates, PEXA settlement fee and registry fees
        they pay on your behalf. No state sets the professional fee. The
        table gives the ranges fee guides and firms publish, with the
        published average for each state.
      </p>
      <ScrollTable label="Conveyancing professional fees by state">
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Buying</th>
            <th>Selling</th>
            <th>Published average</th>
            <th>Who does the work</th>
          </tr>
        </thead>
        <tbody>
          {ALL_STATES.map((s) => {
            const f = CONVEYANCING_FEES[s];
            return (
              <tr key={s}>
                <td><strong>{s}</strong></td>
                <td>{formatFeeRange(f.buy)}</td>
                <td>{formatFeeRange(f.sell)}</td>
                <td>{f.average ? formatFee(f.average.amount) : "Not published"}</td>
                <td>{f.practitioner}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </ScrollTable>
      <p>
        <small>
          Professional fee, GST included, before disbursements. Averages from
          OpenAgent&rsquo;s conveyancer cost guide, updated 17 September 2026.
          The source of each range is listed in the state sections and under
          Sources.
        </small>
      </p>

      <h2 id="estimator">Conveyancing cost estimator</h2>
      <p>
        Pick the state, whether you are buying or selling, and the price.
        The estimator adds the state&rsquo;s published fee range to the
        disbursements a standard transaction pays, using the exact 2026/27
        registry and PEXA fees where the state publishes them. Mortgage and
        strata costs are shown as additions.
      </p>
      <div className="not-prose my-6">
        <ConveyancingCostEstimator initialState="NSW" initialSide="buy" initialPrice={PRICE} headingLevel="h3" />
      </div>

      <h2 id="cost-nsw">How much does conveyancing cost in NSW?</h2>
      <p>
        A licensed conveyancer in New South Wales charges{" "}
        {p(nsw.buy)} for a standard purchase or sale, and a solicitor $1,500
        to $3,200 (Our Top 10, updated 27 September 2026). Jameson Law puts a
        standard purchase at $1,200 to $2,500 (15 March 2026), and the
        published NSW average is{" "}
        {formatFee(nsw.average!.amount)} (OpenAgent, 17 September 2026). At
        the top of the market, Westla publishes $2,000 to $3,000 for buyers
        and $2,500 to $3,500 for sellers (2026). NSW sets no standard fee
        (Coutts Legal, 31 August 2026), so the quote is the only number that
        counts.
      </p>
      <p>
        The disbursements are small in NSW because the registry fee is flat:
        NSW Land Registry Services charges $182.73 to register a transfer, a
        mortgage or a discharge from 1 July 2026, whatever the price. The
        buyer&rsquo;s conveyancer orders the council rates certificate
        (section 603) and the water authority&rsquo;s certificate for the
        settlement adjustments; the seller&rsquo;s conveyancer attaches the
        title search, the section 10.7 planning certificate and the
        sewerage service diagram to the contract.
      </p>
      <DisbursementTable e={NSW_BUY} />
      <DisbursementTable e={NSW_SELL} />
      <p>
        Council fees differ: the table uses the City of Sydney&rsquo;s
        certificate prices and Sydney Water&rsquo;s charges, and a land tax
        certificate, strata records and any extra searches are on top.
        Jameson Law&rsquo;s range for all disbursements on a standard
        purchase is $350 to $700.
      </p>
      <KeyFigure
        value={formatFeeRange(NSW_BUY.total)}
        label={`Conveyancing on an ${PRICE_TEXT} NSW purchase: professional fee plus searches, PEXA and NSW LRS registration, before transfer duty and mortgage registration.`}
        context="Our Top 10 (27 Sep 2026), NSW LRS and PEXA schedules from 1 Jul 2026, City of Sydney and Sydney Water 2026-27"
      />
      <p>
        If you think a licensed conveyancer&rsquo;s bill is wrong, the NSW
        Civil and Administrative Tribunal can hear the dispute if you apply
        within 60 days of receiving it; a solicitor&rsquo;s bill goes to the
        Office of the Legal Services Commissioner instead (NCAT, read 30
        September 2026).
      </p>

      <h2 id="cost-vic">How much does conveyancing cost in Victoria?</h2>
      <p>
        Victorian buyers pay {p(vic.buy)} and sellers {p(vic.sell)} in
        professional fees (All Conveyancing Australia, 21 July 2026).
        Conveyancing Explained gives $880 to $2,200 for a standard
        transaction (13 July 2026), Keylaw publishes fixed fees of $1,290 to
        buy and $990 to sell (17 September 2026), and the published Victorian
        average is{" "}
        {formatFee(vic.average!.amount)} (OpenAgent, 17 September 2026).
        Sellers sit higher in some quotes because their conveyancer prepares
        the Section 32 vendor statement.
      </p>
      <p>
        The large line is the buyer&rsquo;s transfer fee. Land Use Victoria
        charges ${VIC_TRANSFER.base.toFixed(2)} plus $
        {VIC_TRANSFER.perThousand.toFixed(2)} for every whole $1,000 of the
        price, capped at ${VIC_TRANSFER.cap.toLocaleString("en-AU")}, to
        register an electronic transfer in 2026/27: {formatFee(vicRegistration)}{" "}
        on an {PRICE_TEXT}{" "}
        purchase. A mortgage adds $129.20 to register and $55.99 in PEXA fees.
      </p>
      <DisbursementTable e={VIC_BUY} />
      <DisbursementTable e={VIC_SELL} />
      <p>
        The seller&rsquo;s certificates (council, water and land tax, $90
        to $180 together, and an owners corporation certificate at $80 to
        $400) go into the Section 32. Search costs are All Conveyancing
        Australia&rsquo;s ranges, which include the search agent&rsquo;s
        margin.
      </p>

      <h2 id="cost-qld">How much does conveyancing cost in Queensland?</h2>
      <p>
        Queensland does not license conveyancers, so a law firm does the
        work (Attwood Marshall Lawyers). Published fixed fees still start
        low: Keylaw charges $885 to buy and $619 to sell with outlays extra
        (17 September 2026), River City Conveyancing $1,400 to buy plus
        searches and $1,100 to sell, and Empire Legal $2,600 to buy and
        $1,600 to sell with every standard search included (28 April 2026).
        The published Queensland average is{" "}
        {formatFee(qld.average!.amount)}, the lowest of any state (OpenAgent,
        17 September 2026).
      </p>
      <p>
        Titles Queensland&rsquo;s transfer fee rises with the price: $
        {QLD_TRANSFER.base.toFixed(2)} up to $180,000, plus $
        {QLD_TRANSFER.perTenThousand.toFixed(2)} for each $10,000 or part of
        $10,000 above it (FY2026/27), which is{" "}
        {formatFee(qldRegistration)} on an {PRICE_TEXT}{" "}
        purchase. Registering a mortgage or releasing one costs $248.04 each. The buyer&rsquo;s
        solicitor runs the searches: title ($25.71 at Titles Queensland),
        council rates ($100 to $300 or more), water ($40 to $100) and land
        tax clearance (about $50, Empire Legal, 28 April 2026).
      </p>
      <DisbursementTable e={QLD_BUY} />
      <DisbursementTable e={QLD_SELL} />
      <p>
        Empire Legal&rsquo;s $2,600 already includes the searches, so the
        top of the total counts them twice; with a fee that excludes them,
        Spire Law puts disbursements including searches at $700 to $1,300 on
        a Sunshine Coast purchase before the transfer fee (2026).
      </p>

      <h2 id="cost-other-states">How much does conveyancing cost in WA, SA, Tasmania, the ACT and the NT?</h2>
      <ScrollTable label="Conveyancing fees in WA, SA, Tasmania, the ACT and the NT">
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Professional fee</th>
            <th>Published average</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {OTHER_STATES.map((s) => {
            const f = CONVEYANCING_FEES[s];
            return (
              <tr key={s}>
                <td><strong>{STATE_NAMES[s].replace(/^the /, "")}</strong></td>
                <td>{formatFeeRange(f.buy)} to buy, {formatFeeRange(f.sell)} to sell</td>
                <td>{f.average ? formatFee(f.average.amount) : "Not published"}</td>
                <td>{f.source}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </ScrollTable>
      <ul>
        <li><strong>Western Australia.</strong> Licensed settlement agents do conveyancing in WA, at $700 to $1,500, with disbursements of $200 to $600 including Landgate registration of about $180 to $320 (ConveyancerCompare, rates for 2025-26).</li>
        <li><strong>South Australia.</strong> The seller&rsquo;s conveyancer prepares the Form 1 vendor statement; fee guides give $700 to $1,600 for the professional fee (Our Top 10, 27 September 2026).</li>
        <li><strong>Tasmania.</strong> The thinnest published data of any state: Our Top 10 puts fees in line with WA and South Australia, and the published average is $1,280 (OpenAgent). Get two written quotes.</li>
        <li><strong>The ACT.</strong> Our Top 10 lists conveyancing as solicitor work at $1,800 to $3,000; Ray Swift Moutrage publishes $1,700 plus GST for a standard purchase or sale. ACT sellers also pay for the building, compliance and pest reports up front and recover them from the buyer at completion.</li>
        <li><strong>The Northern Territory.</strong> The highest published average at $1,875 (OpenAgent). Keylaw charges a fixed $1,490 to buy or sell (17 September 2026) and Voeux Conveyancing from $2,680 to buy and $2,580 to sell.</li>
      </ul>
      <p>
        Outside NSW, Victoria and Queensland the estimator uses Our Top 10&rsquo;s
        disbursement range ($300 to $800 to buy, $100 to $400 to sell) because
        no registry fee schedule was read for those states.
      </p>

      <Callout variant="warning" title="State-specific rules apply">
        <p>
          Conveyancing laws and processes vary by state. The names of vendor
          disclosure documents, cooling-off periods, and contract requirements
          differ. Always engage a licensed conveyancer or solicitor in your
          state for your specific transaction.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Most buyers have no real idea what their conveyancer actually
          does, which is exactly why they pay too much and get too little.
          A conveyancer is not a paperwork-shuffler. They are the person
          who reads the contract for what isn&rsquo;t in it, who pulls the
          searches you didn&rsquo;t know to ask for, and who keeps your
          deposit safe when something goes sideways at the eleventh hour.
          Pick yours like you&rsquo;d pick a surgeon, not like you&rsquo;d
          pick a parking spot.
        </p>
      </EditorNote>

      <h2 id="what-is">What conveyancing is</h2>
      <p>
        Conveyancing is the legal process of transferring ownership of real
        property from one person to another. It encompasses everything from
        reviewing the contract of sale and conducting property searches, through
        to organising settlement and registering the new title.
      </p>
      <p>
        In Australia, both buyers and sellers engage their own conveyancers (or
        solicitors) to handle their respective sides of a transaction. The
        buyer&rsquo;s conveyancer protects the buyer&rsquo;s interests; the
        vendor&rsquo;s conveyancer prepares the contract and disclosure
        documents.
      </p>
      <p>
        Conveyancing is now largely conducted electronically in Australia via
        the <strong>PEXA</strong> (Property Exchange Australia) platform, which
        allows funds to be transferred and title documents lodged digitally at
        settlement. From 1 July 2026 PEXA charges $146.30 for a transfer with
        financial settlement in NSW, Victoria and Queensland.
      </p>

      <h2 id="conveyancer-vs-solicitor">Conveyancer vs solicitor</h2>
      <p>
        Both licensed conveyancers and solicitors (lawyers) can handle property
        conveyancing in most of Australia; in Queensland only law firms can.
        The key differences:
      </p>

      <ScrollTable label="Licensed conveyancer compared with a solicitor">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Licensed conveyancer</th>
            <th>Solicitor</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Qualification</strong></td><td>Specialised conveyancing licence</td><td>Law degree + admission to practice</td></tr>
          <tr><td><strong>Scope</strong></td><td>Property transactions only</td><td>Full legal advice on any matter</td></tr>
          <tr><td><strong>Cost in NSW</strong></td><td>{formatFeeRange(nsw.buy)}</td><td>$1,500–$3,200</td></tr>
          <tr><td><strong>Best for</strong></td><td>Standard residential purchases</td><td>Complex transactions, legal disputes, trust structures</td></tr>
        </tbody>
      </table>
      </ScrollTable>
      <p>
        <small>NSW professional fees, GST included, from Our Top 10, updated 27 September 2026.</small>
      </p>

      <p>
        For the vast majority of straightforward residential purchases, a
        licensed conveyancer is sufficient and more cost-effective. For complex
        transactions (e.g. buying via a trust or company, off-the-plan disputes,
        unusual contract conditions), a solicitor is recommended.
      </p>

      <h2 id="process">The conveyancing process step by step</h2>

      <h3>For buyers</h3>
      <ol>
        <li><strong>Engage your conveyancer early.</strong> Ideally before you make an offer, so they can review the contract before you sign.</li>
        <li><strong>Contract review.</strong> Your conveyancer reviews the contract of sale and vendor&rsquo;s statement (Section 32 in VIC), identifying any unusual conditions, risks, or items requiring negotiation.</li>
        <li><strong>Pre-exchange advice.</strong> Your conveyancer explains your rights and obligations, including the cooling-off period (if applicable), deposit amount, and any conditions in the contract.</li>
        <li><strong>Exchange of contracts.</strong> Both parties sign identical contracts and the deposit is paid. The deal is now binding (with any conditions outstanding).</li>
        <li><strong>Property searches.</strong> Your conveyancer conducts searches: title, council rates and zoning, land tax, water rates, and any planned road or infrastructure works that may affect the property.</li>
        <li><strong>Liaising with your lender.</strong> Your conveyancer coordinates with your bank or mortgage broker to ensure loan documents are ready for settlement.</li>
        <li><strong>Pre-settlement inspection.</strong> Done by you (not your conveyancer), usually 24 to 48 hours before settlement, to confirm the property is in the agreed condition.</li>
        <li><strong>Settlement.</strong> Your conveyancer coordinates the electronic settlement via PEXA. Funds are transferred, the title is registered in your name, and you get the keys.</li>
      </ol>

      <h3>For sellers</h3>
      <p>
        The seller&rsquo;s conveyancer prepares the contract of sale and Section
        32 (VIC) / vendor disclosure documents, reviews the buyer&rsquo;s
        requests for special conditions, and handles settlement to ensure funds
        arrive correctly. They also discharge the existing mortgage.
      </p>

      <h2 id="diy">DIY conveyancing (not recommended)</h2>
      <p>
        In theory, it is possible to conduct your own conveyancing in most
        Australian states. In practice, this is strongly{" "}
        <strong>not recommended</strong> for most buyers and sellers.
      </p>
      <p>Reasons to avoid DIY conveyancing:</p>
      <ul>
        <li>
          <strong>Complexity.</strong> Property law and the conveyancing process
          contain many technical requirements. Missing a step or deadline can
          have serious consequences, including forfeiting your deposit or being
          liable for damages.
        </li>
        <li>
          <strong>No professional indemnity.</strong> If a licensed conveyancer
          makes an error, their professional indemnity insurance covers you. If
          you make an error, you bear the cost entirely.
        </li>
        <li>
          <strong>PEXA access.</strong> Electronic settlement requires access to
          the PEXA platform, which is restricted to licensed practitioners.
        </li>
        <li>
          <strong>Cost saving is minimal.</strong> Conveyancing fees are modest
          relative to the property value. The risk-reward calculus strongly
          favours engaging a professional.
        </li>
      </ul>

      <MatchCTA kind="conveyancer" />

      <PullQuote attribution="Andy McMaster, Editor">
        A conveyancer&rsquo;s real value is the one phone call they make
        that you never see. The clause they negotiated out, the search
        they paid for that flagged the easement, the lender they chased
        on a Friday so your settlement landed on Monday.
      </PullQuote>

      <h2 id="red-flags">Red flags in contracts</h2>
      <p>A good conveyancer will flag these issues, but it helps to know what to watch for:</p>
      <ul>
        <li>
          <strong>Unusually long settlement periods</strong> (e.g. 90+ days
          without explanation). May indicate the vendor has a complicating issue
          to resolve.
        </li>
        <li>
          <strong>Missing inclusions.</strong> Fixtures listed verbally by the
          agent but not included in the contract (e.g. dishwasher, ducted air
          conditioning, garden shed).
        </li>
        <li>
          <strong>Title encumbrances.</strong> Mortgages not yet discharged,
          unregistered easements, or heritage overlays that will restrict future
          development.
        </li>
        <li>
          <strong>GST clauses.</strong> If buying new property from a developer,
          confirm whether the price is inclusive or exclusive of GST.
        </li>
        <li>
          <strong>Unusual &ldquo;as-is&rdquo; clauses.</strong>{" "}
          Some contracts try to limit the vendor&rsquo;s disclosure obligations. Your conveyancer
          should flag these.
        </li>
        <li>
          <strong>Sunset clauses (off-the-plan).</strong> A clause allowing the
          developer to cancel the contract if completion doesn&rsquo;t occur by
          a certain date. Controversial and sometimes misused.
        </li>
      </ul>

      <h2 id="when-solicitor">When to use a solicitor instead</h2>
      <p>
        While a licensed conveyancer handles most standard purchases perfectly
        well, there are situations where the broader legal expertise of a
        solicitor is advisable:
      </p>
      <ul>
        <li>Buying or selling via a trust, company, or self-managed super fund (SMSF)</li>
        <li>Complex joint ownership structures</li>
        <li>Off-the-plan purchases with non-standard contract terms</li>
        <li>Development sites or properties with planning disputes</li>
        <li>Contract disputes or vendor non-disclosure claims</li>
        <li>Commercial property transactions</li>
        <li>Deceased estates where title issues are unresolved</li>
      </ul>

      <h2 id="choosing">How to choose a conveyancer</h2>
      <p>Questions to ask before engaging a conveyancer:</p>
      <ul>
        <li>Are you licensed in this state?</li>
        <li>Do you have experience with this type of property (e.g. off-the-plan, strata)?</li>
        <li>What is your total fee, and which disbursements, including PEXA and the registry&rsquo;s transfer fee, are included?</li>
        <li>Will you be handling my file personally, or will it be delegated?</li>
        <li>What are your communication standards, will you respond to emails within 24 hours?</li>
        <li>Do you use PEXA for electronic settlement?</li>
      </ul>
      <p>
        Avoid choosing a conveyancer solely on price. The cheapest option may
        cut corners on searches or contract review. A few hundred dollars of
        saving is not worth the risk on a $700,000 transaction.
      </p>
      <p>
        Ask your real estate agent, mortgage broker, or friends who have
        recently purchased in the area for recommendations.
      </p>

      <p>
        Speaking of settlement-day costs, your conveyancer will arrange
        payment of stamp duty alongside the loan settlement. Estimate it now:
      </p>
      <MiniStampDutyEmbed />

      <Sources items={CONVEYANCING_SOURCES} />
    </GuideArticleLayout>
    </>
  );
}
