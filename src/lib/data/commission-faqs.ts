// One "People also ask" question per state commission guide (fix item 12),
// taken from the Google Australia results for "real estate commission {state}"
// on 5 and 7 September 2026, answered with figures from the same data as the
// cost table and a named source. Off-topic PAA questions (agent complaints,
// conflicts of interest, the hardest month to sell) were left out. Kept to one
// per page: with the five existing questions that makes six, the guide's cap.
import type { FaqItem } from "@/components/guide/Faq";
import { STATE_COMMISSION, STATE_RATES, nationalRange, pct, type StateCode } from "./commission-rates";
import { money, sellingCostTable } from "./selling-costs";

const amount = (state: StateCode, price: number, rate: number) => money(Math.round((price * rate) / 100));

function build(): Record<StateCode, FaqItem> {
  const nat = nationalRange();
  const nsw = STATE_RATES.NSW, vic = sellingCostTable("VIC"), qld = STATE_RATES.QLD, sa = STATE_RATES.SA, wa = STATE_RATES.WA, tas = STATE_RATES.TAS, act = STATE_RATES.ACT, nt = STATE_RATES.NT;
  return {
    NSW: {
      question: "What tax do you pay when you sell a house in NSW?",
      answer: `If the house is your home, usually none. The main residence exemption means no capital gains tax, and stamp duty is paid by the buyer, not the seller. What you do pay is the 10% GST on the agent's commission and marketing: at the ${nsw.typical}% state average (OpenAgent, September 2026), ${amount("NSW", 800_000, nsw.typical)} of commission on an $800,000 sale becomes ${money(Math.round(800_000 * nsw.typical / 100 * 1.1))} with GST. An investment property is different: capital gains tax applies to the gain, with selling costs such as commission and conveyancing reducing it. The ATO's guidance on property and capital gains tax sets out the rules; get advice on your own numbers before you list.`,
    },
    VIC: {
      question: "What are the typical fees involved in selling a house in Victoria?",
      answer: `Commission is the biggest: published averages run ${vic.commission.low}% to ${vic.commission.high}% of the price, with a state average of ${vic.commission.typical}% (OpenAgent, September 2026), so ${money(vic.commission.typicalAmount)} on an $800,000 sale before GST. Then marketing and photography of roughly $2,000 to $8,000, conveyancing of $800 to $2,500, the Section 32 vendor statement and its certificates at about $300 to $800, an auctioneer of $400 to $1,200 if you go to auction, and a mortgage discharge fee of $150 to $400 if you have a loan. Added up in the table above, an $800,000 Victorian sale costs about ${money(vic.totalLow)} to ${money(vic.totalHigh)} before GST on the commission, or ${vic.totalLowPct}% to ${vic.totalHighPct}% of the price, and ${money(vic.totalLowWithGst)} to ${money(vic.totalHighWithGst)} with it. Consumer Affairs Victoria explains what the vendor statement must contain.`,
    },
    QLD: {
      question: "How to calculate real estate commission in QLD?",
      answer: `Multiply the sale price by the agreed rate. Published Queensland averages run ${qld.low}% to ${qld.high}%, with a state average of ${qld.typical}% (OpenAgent, September 2026), so an $800,000 sale at ${qld.typical}% is ${amount("QLD", 800_000, qld.typical)} before GST and ${money(Math.round(800_000 * qld.typical / 100 * 1.1))} with it. There has been no regulated maximum since Queensland deregulated commission at the end of 2014, so the rate is whatever you and the agent write into the appointment form (Form 6), and the Queensland Government's selling guidance treats it as a negotiated fee. Some agents use a tiered structure with a higher rate on the amount above a target price, so check which part of the price each rate applies to. The commission calculator on this site does the arithmetic for any price and rate.`,
    },
    SA: {
      question: "What is the commission for most real estate agents?",
      answer: `Across Australia, published averages and medians run from ${pct(nat.low)} to ${pct(nat.high)} of the sale price depending on the state and the area, and state averages from ${pct(nat.averageLow)} to ${pct(nat.averageHigh)} (OpenAgent, September 2026). In South Australia the published figures run ${sa.low}% to ${sa.high}% with a state average of ${sa.typical}%, so an $800,000 Adelaide sale at the ${pct(STATE_COMMISSION.SA.capital.rate)} Adelaide average costs about ${amount("SA", 800_000, STATE_COMMISSION.SA.capital.rate)} in commission before GST, or ${amount("SA", 800_000, sa.high)} at ${sa.high}%. There is no set rate: Consumer and Business Services licenses land agents in SA but does not fix what they charge, so the percentage in the sales agency agreement is whatever you negotiate, and two or three written quotes are the only reliable way to find the going rate in your suburb.`,
    },
    WA: {
      question: "Do you pay stamp duty when selling a house in WA?",
      answer: `No. Transfer duty in Western Australia is paid by the buyer and assessed by RevenueWA on the purchase price, so it never appears on the seller's side of settlement. What a WA seller does pay is the agent's commission, with published averages of ${wa.low}% to ${wa.high}% and a state average of ${wa.typical}%, which is ${amount("WA", 600_000, wa.typical)} on a $600,000 sale before GST, plus marketing, conveyancing and any mortgage discharge fee, and capital gains tax only if the property was an investment rather than your home. The one way duty touches a seller is if you are also buying: it applies to the property you purchase, not the one you sell.`,
    },
    TAS: {
      question: "How much is stamp duty on a property in Tasmania?",
      answer: `Sellers don't pay it. Property transfer duty in Tasmania is the buyer's cost, charged by the State Revenue Office on a sliding scale that rises with the price, and the SRO's calculator gives the exact figure for any purchase. As the seller, your costs are the agent's commission, with published figures of ${tas.low}% to ${tas.high}%, which is ${amount("TAS", 600_000, tas.low)} to ${amount("TAS", 600_000, tas.high)} on a $600,000 sale before GST, plus marketing, conveyancing, the council and water certificates for the contract, an auctioneer if you go to auction, and a discharge fee if you have a mortgage. The table above works those through at $600,000.`,
    },
    ACT: {
      question: "What is the lowest commission a realtor will take?",
      answer: `In Canberra the published figures run from ${act.low}% (OpenAgent's average, September 2026) to ${act.high}% (bRight Agent's median, February 2026): ${amount("ACT", 800_000, act.low)} on an $800,000 sale before GST, against ${amount("ACT", 800_000, act.high)} at ${act.high}%. Both are the lowest state or territory figures in their reports. Individual quotes can sit below an average, and fixed-fee and online agencies advertise flat amounts, usually with less of the work done for you. Access Canberra licenses ACT agents and does not set commission, so any rate is negotiable. Compare what each agent includes, especially the marketing budget, before deciding that the lowest rate is the cheapest sale: on $800,000 each 0.1% is $800 before GST.`,
    },
    NT: {
      question: "How to work out commission on real estate?",
      answer: `Sale price multiplied by the agreed rate. In the Northern Territory published figures run ${nt.low}% to ${nt.high}%, with a territory average of ${nt.typical}% (OpenAgent, September 2026), so an $800,000 Darwin sale at ${nt.typical}% is ${amount("NT", 800_000, nt.typical)} before GST and ${money(Math.round(800_000 * nt.typical / 100 * 1.1))} with it; a $600,000 sale is ${amount("NT", 600_000, nt.typical)} and ${money(Math.round(600_000 * nt.typical / 100 * 1.1))}. Check whether the quote includes GST, whether marketing is on top, and, for a tiered agreement, which part of the price each rate applies to. The NT Government's guidance on dealing with a real estate agent says the agreement must state the fees or commission you agree to pay, and the commission calculator on this site does the arithmetic for any price.`,
    },
  };
}

export const COMMISSION_PAA_FAQ: Record<StateCode, FaqItem> = build();
