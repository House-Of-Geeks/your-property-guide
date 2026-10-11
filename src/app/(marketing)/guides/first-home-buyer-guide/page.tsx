import type { Metadata } from "next";
import Link from "next/link";
import { HelpToBuyNote } from "@/components/guide/HelpToBuyNote";
import { FhssNote } from "@/components/guide/FhssNote";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  MiniStampDutyEmbed,
  ScrollTable,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { HomeGuaranteeCapsTable } from "@/components/guide/HomeGuaranteeNote";
import {
  HG_DATES,
  HG_MIN_AGE,
  HG_MIN_DEPOSIT_PCT,
  HG_NO_OWNERSHIP_YEARS,
  HG_SINGLE_PARENT_SELL_WEEKS,
} from "@/lib/data/home-guarantee";
import { FirstHomeByStateTable } from "@/components/guide/FirstHomeStateFacts";
import { FIRST_HOME_DUTY, FIRST_HOME_GRANTS, dutyReliefCell, fmt, firstHomeSources, longDate } from "@/lib/data/first-home-grants";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";
import { AUSTRALIAN_STATES } from "@/lib/utils/stamp-duty";

// Grants and duty relief by state come from src/lib/data/first-home-grants.ts
// and the stamp duty engine (commercial-intent review 10 Oct 2026, buying 0.1
// row 12). The worked example replaces an unsourced "$30,000 to $60,000+".
const G = FIRST_HOME_GRANTS;
const QLD_STACK = G.QLD.amount! + dutyFor("QLD", 700_000, "owner").total;
const COVERS: Record<"any" | "newOnly" | "none", string> = {
  any: "New and established homes",
  newOnly: "New homes, off-the-plan apartments and vacant land only",
  none: "No first home duty relief",
};

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide Australia: Grants, Schemes & Steps (2026)",
  description:
    "Complete guide for Australian first home buyers: federal grants and schemes (FHBG, Family Home Guarantee), state grants by state, stamp duty concessions, and step-by-step buying advice.",
  slug: "first-home-buyer-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 10,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: FRONTMATTER.title,
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

const TLDR = [
  `Stacking helps: in Queensland, on a $700,000 new home, the ${fmt(G.QLD.amount!)} grant plus the transfer duty a first home buyer doesn't pay comes to ${money(QLD_STACK)} (Queensland Revenue Office, read ${longDate(G.QLD.checkedOn)}), before any federal scheme.`,
  `The First Home Guarantee, now called the 5% Deposit Scheme, lets eligible buyers purchase with a ${HG_MIN_DEPOSIT_PCT.firstHome}% deposit and no Lenders Mortgage Insurance. Since ${HG_DATES.expanded} there's no income test and no limit on places.`,
  `The Family Home Guarantee allows single parents to buy with a ${HG_MIN_DEPOSIT_PCT.singleParent}% deposit, no LMI, and is available even if you have previously owned a home.`,
  `First Home Owner Grants apply to new homes only and vary widely by state, from nothing in the ACT to ${fmt(G.QLD.amount!)} in Queensland and ${fmt(G.NT.amount!)} in the Northern Territory.`,
  "NSW, Victoria, Queensland, WA and the ACT give first home buyers stamp duty relief on established homes too; South Australia only on new homes; Tasmania and the NT give none.",
  "Always verify current eligibility, price caps and grant amounts with the relevant government agency before relying on this information.",
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",              label: "Becoming a first home buyer in Australia" },
  { id: "federal-schemes",       label: "Federal government schemes" },
  { id: "fhog-by-state",         label: "First Home Owner Grant by state" },
  { id: "stamp-duty-concessions",label: "Stamp duty concessions" },
  { id: "step-by-step",          label: "Step-by-step buying process" },
  { id: "common-mistakes",       label: "Common mistakes first home buyers make" },
  { id: "using-a-broker",        label: "Using a broker with the First Home Guarantee" },
  { id: "state-guides",          label: "State-specific guides" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I use the First Home Guarantee and the First Home Owner Grant at the same time?",
    answer: "Yes, in most cases. The First Home Guarantee is a federal scheme that lets you buy with a 5% deposit and no LMI; the First Home Owner Grant is a state cash grant. They have different eligibility rules, but if you qualify for both, they stack. The catch is that the FHOG generally only applies to new homes, while the FHBG can be used for both new and established properties.",
  },
  {
    question: "What is the income limit for the First Home Guarantee?",
    answer: `There isn't one. The income test was removed on ${HG_DATES.expanded}, when the scheme was expanded and renamed the Australian Government 5% Deposit Scheme. The Family Home Guarantee for single parents and legal guardians has no income test either. What still applies is the property price cap for the area you buy in.`,
  },
  {
    question: "Do I need to be a first home buyer to use the Family Home Guarantee?",
    answer: `No. The Family Home Guarantee is open to single parents and single legal guardians with at least one dependent child, even if you have previously owned property. If you own a home now, you can still use it as long as you sell that home within ${HG_SINGLE_PARENT_SELL_WEEKS} weeks of settling the new one.`,
  },
  {
    question: "How much deposit do I need to buy a first home in Australia?",
    answer: "Without a government scheme, lenders typically want 20% to avoid LMI. With the First Home Guarantee you can buy with 5%. With the Family Home Guarantee a 2% deposit is enough. Even with the schemes, you also need to budget for stamp duty (where it applies), conveyancing, building inspections, and lender fees, typically 3% to 5% of purchase price on top.",
  },
  {
    question: "What qualifies you as a first home buyer?",
    answer: `It depends on the scheme. A state grant needs you and your partner not to have owned (or, in some states, lived in) a home in Australia before; the rules vary slightly by state. The federal 5% Deposit Scheme takes anyone who has not owned property in Australia in the last ${HG_NO_OWNERSHIP_YEARS} years (Housing Australia), and the ACT's duty scheme anyone who has not owned property anywhere in the last five years.`,
  },
  {
    question: "Do I have to use a mortgage broker to access the First Home Guarantee?",
    answer: "No. You can apply directly with any participating lender. A broker can compare rates across lenders, know which ones offer the 5% Deposit Scheme, and handle the FHBG paperwork as part of your loan application at no cost to you. Brokers are paid by the lender, not by you.",
  },
  {
    question: "What happens if my purchase price exceeds the price cap by a small amount?",
    answer: "For the grant and the 5% Deposit Scheme you lose it entirely: even one dollar over the cap disqualifies the purchase. Stamp duty relief usually tapers instead, through a concession band above the full exemption, so a little over the threshold costs some duty rather than all of it. Plan well under each cap to leave room for negotiation.",
  },
  {
    question: "Can I buy an established home as my first home and still get a grant?",
    answer: "You can use the 5% Deposit Scheme on an established home, but no state pays the First Home Owner Grant on one: it applies only to new builds, off-the-plan and substantially renovated homes. Stamp duty relief on an established home depends on the state: NSW, Victoria, Queensland, WA and the ACT give it; South Australia, Tasmania and the NT don't.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide, NSW",    href: "/guides/first-home-buyer-nsw", description: "State-specific schemes, stamp duty, and price caps for NSW." },
  { title: "First Home Buyer Guide, QLD",    href: "/guides/first-home-buyer-qld", description: "QLD's $30,000 First Home Owner Grant and stamp duty concession explained." },
  { title: "First Home Buyer Guide, VIC",    href: "/guides/first-home-buyer-vic", description: "Victoria's regional grants and stamp duty exemptions." },
  { title: "Lenders Mortgage Insurance",     href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Conveyancing in Australia",      href: "/guides/conveyancing-guide", description: "What conveyancers do, what they cost, and what to ask before signing." },
  { title: "Stamp Duty Calculator",          href: "/stamp-duty-calculator", description: "Estimate your liability state-by-state in under a minute." },
];

export default function FirstHomeBuyerGuidePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="A note on accuracy">
        <p>
          Grant amounts, income limits, and property price caps change regularly.
          Always verify current eligibility with the relevant government agency or
          a licensed professional before relying on this information.
        </p>
      </Callout>

      <h2 id="overview">Becoming a first home buyer in Australia</h2>
      <p className="lead">
        Buying your first home in Australia has never been more government-assisted.
        Federal schemes, state grants, and stamp duty concessions together can save
        eligible buyers tens of thousands of dollars. The challenge is that the
        schemes are complex, have different eligibility rules, and often interact
        with each other in ways that need careful planning.
      </p>
      <p>
        The good news: if you&rsquo;re eligible, combining a federal scheme like the
        First Home Guarantee with a state First Home Owner Grant and stamp duty
        concessions can mean buying your first home with as little as 5% deposit, no
        Lenders Mortgage Insurance, a cash grant, and reduced or zero stamp duty.
      </p>
      <p>
        This guide covers the national picture. For state-specific detail, see our
        guides for{" "}
        <Link href="/guides/first-home-buyer-nsw">NSW</Link>,{" "}
        <Link href="/guides/first-home-buyer-vic">VIC</Link>,{" "}
        <Link href="/guides/first-home-buyer-qld">QLD</Link>,{" "}
        <Link href="/guides/first-home-buyer-wa">WA</Link>,{" "}
        <Link href="/guides/first-home-buyer-sa">SA</Link>,{" "}
        <Link href="/guides/first-home-buyer-tas">TAS</Link>,{" "}
        <Link href="/guides/first-home-buyer-nt">NT</Link>, and{" "}
        <Link href="/guides/first-home-buyer-act">ACT</Link>.
      </p>

      <KeyFigure
        value={money(QLD_STACK)}
        label={`What an eligible first home buyer in Queensland gets on a $700,000 new home: the ${fmt(G.QLD.amount!)} grant plus the transfer duty they don't pay.`}
        context={`Queensland Revenue Office, read ${longDate(G.QLD.checkedOn)}; varies by state and price`}
      />

      <h2 id="federal-schemes">Federal government schemes</h2>
      <p>
        The Australian Government runs several schemes administered through Housing
        Australia (formerly NHFIC). These schemes allow eligible buyers to purchase
        with a smaller deposit without paying Lenders Mortgage Insurance (LMI). The
        government guarantees the gap.
      </p>

      <h3>1. First Home Guarantee (the 5% Deposit Scheme)</h3>
      <p>
        The most widely used scheme. It allows eligible first home buyers to
        purchase a property with as little as a{" "}
        <strong>{HG_MIN_DEPOSIT_PCT.firstHome}% deposit</strong> without paying LMI. On{" "}
        {HG_DATES.expanded} it was expanded and renamed the Australian Government 5%
        Deposit Scheme.
      </p>
      <ul>
        <li><strong>Income limits:</strong> None since {HG_DATES.expanded}</li>
        <li><strong>Who qualifies:</strong> Australian citizens or permanent residents aged {HG_MIN_AGE}+ who haven&rsquo;t owned property in Australia (including a lease of land or company title) in the last {HG_NO_OWNERSHIP_YEARS} years. Apply alone or with one other person.</li>
        <li><strong>Property type:</strong> New and established homes, off-the-plan, house and land packages, and vacant land with a building contract, to live in</li>
        <li><strong>Number of places:</strong> Unlimited, with no waiting list</li>
        <li><strong>How to access:</strong> Apply through a participating lender or a broker.</li>
        <li><strong>Property price caps:</strong> By state and area, below.</li>
      </ul>

      <HomeGuaranteeCapsTable />

      <h3>2. Regional First Home Buyer Guarantee</h3>
      <p>
        Closed. No new regional guarantees have been issued since{" "}
        {HG_DATES.expanded}. Buyers in regional areas now use the 5% Deposit Scheme
        above, at the price cap for their area, with no residency test.
      </p>

      <h3>3. Family Home Guarantee</h3>
      <p>
        Designed for <strong>single parents and single legal guardians</strong> with
        at least one dependent child, and now marketed as the 5% Deposit Scheme for
        single parents. Allows purchase with just a{" "}
        <strong>{HG_MIN_DEPOSIT_PCT.singleParent}% deposit</strong> without LMI.
      </p>
      <ul>
        <li><strong>Income limit:</strong> None since {HG_DATES.expanded}</li>
        <li>You do not need to be a first home buyer. If you own a home, it must be sold within {HG_SINGLE_PARENT_SELL_WEEKS} weeks of settling the new one.</li>
        <li>Unlimited places; you apply on your own, with no joint applications</li>
        <li>The same property price caps as first home buyers</li>
      </ul>

      <h3>4. Help to Buy (Shared Equity Scheme)</h3>
      <HelpToBuyNote as="p" />
      <p>
        The government shares in any rise or fall in the home&rsquo;s value in
        proportion to its share, and you can buy it back over time.
      </p>

      <h3>5. First Home Super Saver scheme (FHSS)</h3>
      <FhssNote as="p" />

      <h2 id="fhog-by-state">First Home Owner Grant by state</h2>
      <p>
        The First Home Owner Grant (FHOG) is a one-off cash grant available in most
        states and territories. It generally only applies to <strong>new homes</strong>{" "}
        (newly built, substantially renovated, or off-the-plan), not established
        properties.
      </p>
      <FirstHomeByStateTable />

      <Callout variant="info" title="Always verify before relying on these figures">
        <p>
          Grant amounts, price caps, and eligibility criteria change. Check the
          relevant state revenue office for the current rules before proceeding.
        </p>
      </Callout>

      <h2 id="stamp-duty-concessions">First home buyer stamp duty concessions</h2>
      <p>
        Stamp duty is one of the biggest upfront costs when buying property. Most
        states offer first home buyers either a full exemption or a reduced rate on
        stamp duty, subject to thresholds.
      </p>

      <MiniStampDutyEmbed />

      <ScrollTable label="First home buyer stamp duty relief by state and territory">
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Relief for an eligible first home buyer</th>
              <th>Covers</th>
              <th>Scheme and source</th>
            </tr>
          </thead>
          <tbody>
            {AUSTRALIAN_STATES.map((st) => {
              const d = FIRST_HOME_DUTY[st];
              return (
                <tr key={st}>
                  <td><strong><Link href={`/guides/stamp-duty-${st.toLowerCase()}`}>{st}</Link></strong></td>
                  <td>{dutyReliefCell(st)}</td>
                  <td>{COVERS[d.covers]}</td>
                  <td>
                    {d.scheme}:{" "}
                    <a href={d.source.href} target="_blank" rel="noopener noreferrer">{d.source.label.split(":")[0]}</a>, read {longDate(d.checkedOn)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollTable>

      <h2 id="step-by-step">Step-by-step buying process for first home buyers</h2>
      <p>
        See our{" "}
        <Link href="/guides/buying-property-australia">Complete Buying Guide</Link>{" "}
        for detailed coverage of each step. For first home buyers specifically, the
        key additional steps are:
      </p>
      <ol>
        <li><strong>Check your FHOG eligibility</strong> before making any offer. The grant is only available if you haven&rsquo;t previously owned property in Australia.</li>
        <li><strong>Apply for your chosen federal scheme</strong> through a participating lender before or during your pre-approval application. It&rsquo;s part of the one process.</li>
        <li><strong>Get pre-approval</strong> specifying you&rsquo;re accessing the First Home Guarantee (or relevant scheme) so the lender structures it correctly.</li>
        <li><strong>Confirm stamp duty concessions with your conveyancer.</strong> Concessions are applied on settlement and reduce the amount you need to pay.</li>
        <li><strong>Apply for the FHOG through your conveyancer or directly with your state revenue office.</strong> Timing varies by state; some pay at settlement, some after.</li>
        <li>Complete the standard buying process: offer, exchange, inspections, conveyancing, settlement.</li>
      </ol>

      <h2 id="common-mistakes">Common mistakes first home buyers make</h2>
      <ul>
        <li><strong>Exceeding the price cap for the FHOG or scheme:</strong> Even $1 over the cap disqualifies you from the entire grant. Stay under.</li>
        <li><strong>Not checking FHOG eligibility before buying an established property:</strong> In most states, the FHOG only applies to new builds. Buying an established home means no grant.</li>
        <li><strong>Underestimating total upfront costs:</strong> First home buyers often budget only for the deposit and forget stamp duty (even if discounted), legal fees, and inspections. Budget 3 to 5% on top of the purchase price for costs.</li>
        <li><strong>Letting pre-approval lapse:</strong> Pre-approvals typically last 90 days. If you&rsquo;re not ready to buy in that window, renew before it expires.</li>
        <li><strong>Buying in a hurry due to FOMO:</strong> The property market has cycles. Missing one property is rarely as catastrophic as buying the wrong one.</li>
        <li><strong>Not getting a building inspection:</strong> On a new property, you may have builder warranty cover, but a defect inspection before settlement is still prudent. On an established property, it&rsquo;s essential.</li>
        <li><strong>Not comparing lenders:</strong> The home loan you get approved for on your first attempt may not be the best rate available to you. A mortgage broker can compare dozens of lenders in one application process.</li>
      </ul>

      <h2 id="using-a-broker">Using a broker with the First Home Guarantee</h2>
      <p>
        You don&rsquo;t have to use a mortgage broker to access the First Home
        Guarantee. You can go direct to a participating lender. However, a good
        broker can:
      </p>
      <ul>
        <li>Compare rates and features across all participating lenders simultaneously</li>
        <li>Know which lenders take part in the 5% Deposit Scheme and how each treats it</li>
        <li>Help structure your application to maximise your approval chances</li>
        <li>Handle the FHBG paperwork as part of your loan application at no extra cost to you</li>
      </ul>
      <p>
        Broker remuneration is paid by the lender, not you. Ensure your broker is
        licenced (check ASIC&rsquo;s register) and ask them to explain how they are
        compensated to understand any potential bias.
      </p>

      <MatchCTA kind="mortgage-broker" />

      <h2 id="state-guides">State-specific first home buyer guides</h2>
      <p>For state-specific detail on grants, concessions, and the buying process:</p>
      <ul>
        <li><Link href="/guides/first-home-buyer-nsw">First Home Buyer Guide, New South Wales</Link></li>
        <li><Link href="/guides/first-home-buyer-vic">First Home Buyer Guide, Victoria</Link></li>
        <li><Link href="/guides/first-home-buyer-qld">First Home Buyer Guide, Queensland</Link></li>
        <li><Link href="/guides/first-home-buyer-wa">First Home Buyer Guide, Western Australia</Link></li>
        <li><Link href="/guides/first-home-buyer-sa">First Home Buyer Guide, South Australia</Link></li>
        <li><Link href="/guides/first-home-buyer-tas">First Home Buyer Guide, Tasmania</Link></li>
        <li><Link href="/guides/first-home-buyer-nt">First Home Buyer Guide, Northern Territory</Link></li>
        <li><Link href="/guides/first-home-buyer-act">First Home Buyer Guide, Australian Capital Territory</Link></li>
      </ul>

      <Sources items={firstHomeSources()} />
    </GuideArticleLayout>
  );
}
