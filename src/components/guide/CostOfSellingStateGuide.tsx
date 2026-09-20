import Link from "next/link";
import type { Metadata } from "next";
import { Callout, GuideArticleLayout, MatchCTA, SellingCostTable, Sources, type GuideFrontmatter, type GuideTOCEntry, type RelatedGuide } from "@/components/guide";
import { SellingCostsCalculator } from "@/components/calculators/SellingCostsCalculator";
import { STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { EXAMPLE_PRICE, money, sellingCostTable } from "@/lib/data/selling-costs";
import { COST_OF_SELLING_AS_OF, COST_OF_SELLING_STATE, COST_OF_SELLING_STATES } from "@/lib/data/cost-of-selling-state";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

/** Frontmatter for a state cost guide; the route files build their metadata from it. */
export function costOfSellingFrontmatter(state: StateCode): GuideFrontmatter {
  const g = COST_OF_SELLING_STATE[state];
  const t = sellingCostTable(state);
  return {
    title: `Cost of Selling a House in ${t.stateName} (2026): Commission, Fees and Calculator`,
    description: `Every cost of selling a house in ${t.stateName}: commission of ${t.commission.low}% to ${t.commission.high}%, marketing, conveyancing, the ${g.state === "NSW" || g.state === "WA" || g.state === "TAS" || g.state === "NT" ? "legal documents" : t.documents.label.toLowerCase()}, tax, and what is different in ${t.stateName}. Worked at ${money(t.price)}, with a calculator.`,
    slug: g.slug,
    publishedAt: COST_OF_SELLING_AS_OF,
    updatedAt: COST_OF_SELLING_AS_OF,
    readingTimeMinutes: 9,
    author: { name: "Your Property Guide editorial", role: "Australian property research" },
    reviewedBy: { name: "Andy McMaster", role: "Editor" },
    persona: "selling",
  };
}

export function costOfSellingMetadata(state: StateCode): Metadata {
  const f = costOfSellingFrontmatter(state);
  return {
    title: f.title,
    description: f.description,
    alternates: { canonical: `${SITE_URL}/guides/${f.slug}` },
    openGraph: {
      url: `${SITE_URL}/guides/${f.slug}`,
      title: f.title,
      description: f.description,
      type: "article",
      publishedTime: f.publishedAt,
      modifiedTime: f.updatedAt,
      images: guideOgImages({ slug: f.slug, title: f.title, description: f.description, persona: f.persona }),
    },
  };
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Renders a paragraph string, turning [text](/path) into links. */
function Para({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <p>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return m ? <Link key={i} href={m[2]}>{m[1]}</Link> : <span key={i}>{p}</span>;
      })}
    </p>
  );
}

const pctOf = (amount: number, price: number) => `${(Math.round((amount / price) * 1000) / 10).toFixed(1)}%`;

export function CostOfSellingStateGuide({ state }: { state: StateCode }) {
  const g = COST_OF_SELLING_STATE[state];
  const t = sellingCostTable(state);
  const r = STATE_RATES[state];
  const name = t.stateName;
  const price = EXAMPLE_PRICE[state];
  const medianCommissionLow = Math.round((g.capitalMedian * r.low) / 100);
  const medianCommissionHigh = Math.round((g.capitalMedian * r.high) / 100);
  const medianCommissionTypical = Math.round((g.capitalMedian * r.typical) / 100);

  const article = /^8/.test(String(price)) ? "an" : "a";
  const tldr = [
    `Selling ${article} ${money(price)} house in ${name} typically costs ${money(t.totalLow)} to ${money(t.totalHigh)} all-in, ${t.totalLowPct}% to ${t.totalHighPct}% of the price, before any capital gains tax.`,
    `Commission is the biggest line: ${r.low}% to ${r.high}% in ${name}, most often around ${r.typical}%, so ${money(t.commission.lowAmount)} to ${money(t.commission.highAmount)} at ${money(price)}. GST of 10% usually applies on top, and the rate is negotiable.`,
    `${t.documents.label}: ${money(t.documents.low)} to ${money(t.documents.high)}. ${t.documents.note}`,
    `Marketing (${money(2_000)} to ${money(8_000)}) is payable whether or not the property sells; conveyancing runs ${money(800)} to ${money(2_500)}; an auctioneer and a mortgage discharge fee apply only if you auction or have a loan.`,
    `Stamp duty is the buyer's cost. Your main residence is normally exempt from capital gains tax; an investment is not. Every seller now needs an ATO clearance certificate or the buyer withholds 15%.`,
  ];

  const toc: GuideTOCEntry[] = [
    { id: "cost-table", label: `What it costs to sell in ${name}` },
    { id: "calculator", label: "Selling costs calculator" },
    { id: "commission", label: `Commission in ${name}` },
    ...g.differences.map((d) => ({ id: slugify(d.heading), label: d.heading })),
    { id: "save", label: "Where you can save" },
    { id: "other-states", label: "Cost of selling in other states" },
  ];

  const related: RelatedGuide[] = [
    { title: `Real estate commission in ${name}`, href: `/guides/real-estate-commission-${state.toLowerCase()}`, description: `Typical ${name} rates, worked examples and how to negotiate.` },
    { title: "Selling costs calculator", href: "/selling-costs-calculator", description: "Every line of the bill, with net proceeds after your loan." },
    { title: "The cost of selling a house in Australia", href: "/guides/cost-of-selling-a-house-australia", description: "The national guide to each cost line." },
    { title: "How to negotiate agent commission", href: "/guides/how-to-negotiate-real-estate-agent-commission", description: "Tiered structures and the questions that move the rate." },
    { title: "How to choose a selling agent", href: "/guides/how-to-choose-a-selling-agent", description: "Compare on results, not rate." },
    { title: "Agency agreements by state", href: "/guides/real-estate-agency-agreements-by-state", description: "What the agreement must say and the clauses to change." },
  ];

  return (
    <GuideArticleLayout frontmatter={costOfSellingFrontmatter(state)} tldr={tldr} toc={toc} faqs={g.faqs} related={related}>
      <Callout variant="warning" title="Indicative figures, not quotes">
        <p>
          Commission is not regulated in {name} and every other line is quoted individually by agents, conveyancers and lenders.
          The ranges here are typical market figures as at September 2026. Get written quotes for your own sale and confirm anything
          tax-related with the ATO or a registered tax agent.
        </p>
      </Callout>

      {g.intro.map((p, i) => <Para key={i} text={p} />)}

      <SellingCostTable state={state} />

      <h2 id="calculator">Selling costs calculator for {name}</h2>
      <p>
        Preset to the typical {name} commission of {r.typical}% and the mid-point of the {t.documents.label.toLowerCase()} range.
        Change any figure, add your loan balance, and the result shows what lands in your account at settlement. The{" "}
        <Link href="/selling-costs-calculator">full selling costs calculator</Link> covers every state.
      </p>
      <div className="not-prose my-6">
        <SellingCostsCalculator initialState={state} initialPrice={price} headingLevel="h3" showGuideCta={false} />
      </div>

      <h2 id="commission">Commission in {name}</h2>
      <p>
        Agents in {name} typically charge {r.low}% to {r.high}% of the sale price, with around {r.typical}% the most common rate. At the{" "}
        {money(price)} this guide works its examples at, that is {money(t.commission.lowAmount)} to {money(t.commission.highAmount)}, or{" "}
        {money(t.commission.typicalAmount)} at the typical rate, before GST. On the {g.capital} median dwelling value of {money(g.capitalMedian)}{" "}
        (Cotality, August 2026) the same range is {money(medianCommissionLow)} to {money(medianCommissionHigh)}, with {money(medianCommissionTypical)} typical.
        The difference between the top and bottom of the range on a median {g.capital} sale is {money(medianCommissionHigh - medianCommissionLow)}, which is why
        the rate is worth a conversation. Our <Link href={`/guides/real-estate-commission-${state.toLowerCase()}`}>{name} commission guide</Link> has the detail and the{" "}
        <Link href="/guides/how-to-negotiate-real-estate-agent-commission">negotiation guide</Link> the method.
      </p>
      <p>
        Two checks before you compare rates. Ask whether the quote includes GST: a {r.typical}% rate excluding GST is {(r.typical * 1.1).toFixed(2)}% all-in.
        And ask what is included: some agents bundle the auctioneer and part of the marketing, others charge every item separately, so the cheaper
        rate is not always the cheaper agent. See <Link href="/guides/fixed-fee-vs-commission-real-estate-agents">fixed fee vs commission</Link> for the
        alternative models.
      </p>

      <MatchCTA kind="selling-agent" />

      {g.differences.map((d) => (
        <section key={d.heading}>
          <h2 id={slugify(d.heading)}>{d.heading}</h2>
          {d.body.map((p, i) => <Para key={i} text={p} />)}
        </section>
      ))}

      <h2 id="save">Where you can save</h2>
      <ul>
        <li>
          <strong>The rate.</strong> Every 0.1% on a {money(price)} sale is {money(Math.round(price / 1000))}. Get three appraisals, ask each agent to
          justify their rate against their last ten results, and ask for a tiered structure that pays more above a target price.
        </li>
        <li>
          <strong>Marketing.</strong> Insist on an itemised schedule, choose the portal tier that fits the price bracket, and ask about rebates.
          A {money(4_000)} campaign sells most suburban houses; {money(8_000)} is for a premium listing, not a default.
        </li>
        <li>
          <strong>Presentation.</strong> Spend where it returns: a clean, decluttered, freshly painted home photographs like a styled one. Our guide to{" "}
          <Link href="/guides/what-to-fix-before-selling-a-house">what to fix before selling</Link> ranks the jobs, and{" "}
          <Link href="/guides/home-staging-cost-australia">home staging costs</Link> shows when styling pays.
        </li>
        <li>
          <strong>The method of sale.</strong> An auction adds the auctioneer and usually a bigger marketing budget. It earns that back in a competitive
          market and not in a slow one; <Link href="/guides/auction-vs-private-treaty">auction vs private treaty</Link> sets out when.
        </li>
        <li>
          <strong>Timing the loan.</strong> If you are on a fixed rate, ask the lender for the break cost before you list. It can be larger than
          every other line in the table combined, and a settlement date after the fixed term ends may avoid it.
        </li>
      </ul>
      <p>
        As a share of the price, {name} selling costs at {money(price)} run {pctOf(t.totalLow, price)} to {pctOf(t.totalHigh, price)} before tax.
        The national guide to <Link href="/guides/cost-of-selling-a-house-australia">the cost of selling a house</Link> explains each line in full.
      </p>

      <h2 id="other-states">Cost of selling in other states</h2>
      <ul>
        {COST_OF_SELLING_STATES.filter((s) => s !== state).map((s) => (
          <li key={s}>
            <Link href={`/guides/${COST_OF_SELLING_STATE[s].slug}`}>Cost of selling a house in {sellingCostTable(s).stateName}</Link>: commission{" "}
            {STATE_RATES[s].low}% to {STATE_RATES[s].high}%.
          </li>
        ))}
      </ul>

      <MatchCTA kind="selling-agent" />

      <Sources items={g.sources} />
    </GuideArticleLayout>
  );
}
