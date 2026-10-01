// The FAQ block on /guides/conveyancing-guide, built from the fee data and
// the estimator engine so the answers cannot drift from the page's tables.
// The first four answer the People Also Ask questions on the "conveyancing
// fees nsw" SERP (serp-summary.csv, 30 Sep 2026).
import type { StateCode } from "@/lib/data/commission-rates";
import { CONVEYANCING_FEES, type FeeRange } from "@/lib/data/conveyancing-fees";
import { estimateConveyancingCost, formatFeeRange } from "@/lib/conveyancing-costs";

export interface ConveyancingFaq {
  question: string;
  answer: string;
}

const nsw = CONVEYANCING_FEES.NSW;
const vic = CONVEYANCING_FEES.VIC;
const qld = CONVEYANCING_FEES.QLD;

/**
 * The worked example the guide and the FAQ both quote. The copy says "an
 * $800,000 purchase"; change the article too if this price changes.
 */
export const NSW_EXAMPLE_PRICE = 800_000;
export const NSW_EXAMPLE = estimateConveyancingCost({ state: "NSW", side: "buy", price: NSW_EXAMPLE_PRICE });
export const VIC_EXAMPLE = estimateConveyancingCost({ state: "VIC", side: "buy", price: NSW_EXAMPLE_PRICE });
export const QLD_EXAMPLE = estimateConveyancingCost({ state: "QLD", side: "buy", price: NSW_EXAMPLE_PRICE });

const ORDER: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const AVERAGES = ORDER.map((s) => `${s} $${CONVEYANCING_FEES[s].average!.amount.toLocaleString("en-AU")}`).join(", ").replace(/, (?=[^,]*$)/, " and ");

const dollars = (n: number) => `$${n.toLocaleString("en-AU")}`;
const prose = (r: FeeRange) => formatFeeRange(r, "prose");

export const CONVEYANCING_FAQS: readonly ConveyancingFaq[] = [
  {
    question: "What is the average conveyancing fee in NSW?",
    answer:
      `${dollars(nsw.average!.amount)} is the published NSW average professional fee (OpenAgent conveyancer cost guide, updated 17 September 2026). Behind the average, a licensed conveyancer charges ${prose(nsw.buy)} for a standard residential purchase and a solicitor $1,500 to $3,200 (Our Top 10, updated 27 September 2026); Jameson Law puts a standard purchase at $1,200 to $2,500 (15 March 2026). NSW sets no standard fee, so every practice prices its own work (Coutts Legal, 31 August 2026). On top of the professional fee come disbursements: on an ${dollars(NSW_EXAMPLE_PRICE)} purchase the estimator on this page puts them at ${prose(NSW_EXAMPLE.disbursements)}, including the $182.73 NSW LRS transfer registration and the $146.30 PEXA fee (both from 1 July 2026), for a total of ${prose(NSW_EXAMPLE.total)} before transfer duty.`,
  },
  {
    question: "What is the average fee for conveyancing in Australia?",
    answer:
      `OpenAgent's published averages for a conveyancer's professional fee (updated 17 September 2026) are ${AVERAGES}. Queensland, where only law firms do conveyancing, has the lowest average, and firms there publish fixed fees as low as $885 to buy and $619 to sell (Keylaw, 17 September 2026); the Northern Territory has the highest. Averages leave out disbursements and registration fees, which on an ${dollars(NSW_EXAMPLE_PRICE)} purchase add ${prose(NSW_EXAMPLE.disbursements)} in NSW, ${prose(VIC_EXAMPLE.disbursements)} in Victoria and ${prose(QLD_EXAMPLE.disbursements)} in Queensland, mostly the registry's transfer fee in the last two.`,
  },
  {
    question: "Is it better to use a conveyancer or solicitor?",
    answer:
      `For a standard residential purchase or sale a licensed conveyancer does the same work for less: in NSW ${prose(nsw.buy)} against $1,500 to $3,200 for a solicitor (Our Top 10, 27 September 2026), and in Victoria ${prose(vic.buy)} for a buyer (All Conveyancing Australia, 21 July 2026). A solicitor earns the difference when the matter is not standard: buying through a trust, company or self-managed super fund, a deceased estate with an unresolved title, an off-the-plan contract with unusual terms, a development site, or any transaction where a dispute is likely, because a conveyancer's licence stops at the property transaction and a solicitor can advise on the rest. In Queensland the choice does not exist: the state does not license conveyancers, so law firms do the work (Attwood Marshall Lawyers), at ${prose(qld.buy)} for a purchase (Keylaw, River City Conveyancing and Empire Legal fixed fees, April to September 2026). Our Top 10 (27 September 2026) lists ACT conveyancing as solicitor work too, at $1,800 to $3,000.`,
  },
  {
    question: "Can a conveyancer negotiate price?",
    answer:
      "Not the purchase price: that is between you, the agent and the other party. A conveyancer negotiates the contract around the price, and that is where the money is: special conditions (finance, building and pest, sale of your existing home), the settlement date, inclusions the agent promised verbally, the deposit amount and how it is held, and a price reduction or repairs after an inspection finds defects. Their own fee is also open to negotiation, or at least comparison. Most practices now quote a fixed professional fee with disbursements listed separately, so ask three for a written quote that names every search and certificate; a fee that looks cheap often leaves out the $146.30 PEXA fee and the registration fees. If you think a licensed conveyancer's bill is wrong in NSW, NCAT's Consumer and Commercial Division can hear the dispute if you apply within 60 days of receiving the bill; a solicitor's bill goes to the Office of the Legal Services Commissioner.",
  },
  {
    question: "How do you calculate conveyancing fees?",
    answer:
      `Add three parts. First, the professional fee, which is the conveyancer's or solicitor's charge for the work and is either fixed or, for complex matters, hourly. Second, disbursements: the searches and certificates bought on your behalf (title search, planning or council certificate, water, land tax, strata or owners corporation records) and the PEXA electronic settlement fee of $146.30 from 1 July 2026. Third, the registry's registration fee, which is flat in NSW ($182.73 in 2026/27) and price-based in Victoria ($104.30 plus $2.34 per whole $1,000, capped at $3,614) and Queensland ($248.04 plus $46.56 per $10,000 or part over $180,000). On an ${dollars(NSW_EXAMPLE_PRICE)} NSW purchase that gives ${prose(NSW_EXAMPLE.professional)} plus ${prose(NSW_EXAMPLE.disbursements)}, or ${prose(NSW_EXAMPLE.total)} all up; the estimator above works it for any state, side and price. Transfer (stamp) duty is a tax paid at settlement and is not a conveyancing fee.`,
  },
  {
    question: "What does a conveyancer actually do?",
    answer:
      "A conveyancer reviews the contract of sale, conducts property searches (title, council, zoning, land tax, water), liaises with your lender, prepares and lodges settlement documents on the PEXA platform, and ensures the title is registered correctly in your name. For sellers, they also discharge the existing mortgage and prepare the vendor disclosure documents (Section 32 in Victoria, Form 1 in SA, the contract with its attached certificates in NSW).",
  },
  {
    question: "When should I engage a conveyancer in the buying process?",
    answer:
      "Before you make an offer. The conveyancer should review the contract of sale and any vendor disclosure documents BEFORE you sign anything. Once contracts exchange, you're committed: there's limited cooling-off in some states, and even then, walking away usually means forfeiting part of the deposit.",
  },
  {
    question: "What's a Section 32 / vendor's statement?",
    answer:
      "It's the document a vendor must provide before signing, disclosing material facts about the property: title details, mortgages and easements, zoning, planning overlays, outgoings (rates, body corporate fees), and any building permits or notices. The exact name varies by state (Section 32 in Victoria, Form 1 in SA, contract of sale in NSW). Your conveyancer reviews this for missing or concerning disclosures. Its certificates are a seller's cost: in Victoria about $90 to $180 for the council, water and land tax certificates, plus $80 to $400 for an owners corporation certificate (All Conveyancing Australia, 21 July 2026).",
  },
  {
    question: "Can I do my own conveyancing to save money?",
    answer:
      "Technically yes in most states, practically no for almost everyone. PEXA electronic settlement is restricted to licensed practitioners; missed deadlines and procedural errors can forfeit your deposit; if a licensed conveyancer makes an error, their professional indemnity insurance covers you. The few hundred dollars saved on a $700,000 purchase isn't worth the risk.",
  },
];
