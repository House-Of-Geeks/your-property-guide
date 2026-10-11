import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  MatchCTA,
  ScrollTable,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { STATE_DUTY_SCHEDULES, type AustralianState } from "@/lib/utils/stamp-duty";
import {
  HTB_CHECKED_ON,
  HTB_INCOME_LIMITS,
  HTB_LENDERS,
  HTB_MIN_DEPOSIT_PCT,
  HTB_MIN_REPAYMENT_PCT,
  HTB_PRICE_CAPS,
  HTB_SHARE,
  HTB_SOURCES,
  HTB_UPTAKE,
  HTB_YEAR,
  SHARED_EQUITY_SCHEMES,
  STATE_CAPITALS,
} from "@/lib/data/help-to-buy";
import { HTB_STATE_PAGES, type HtbStatePage } from "@/lib/data/help-to-buy-states";
import { EXAMPLE_LOAN_RATE, computeHelpToBuy, defaultHtbInput } from "@/lib/help-to-buy-calc";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const checkedOn = new Date(HTB_CHECKED_ON).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** The figures a state page prints, computed once so the TLDR, FAQ and body agree. */
export function htbStateFigures(state: AustralianState) {
  const page = HTB_STATE_PAGES[state] as HtbStatePage;
  const caps = HTB_PRICE_CAPS[state];
  const ex = computeHelpToBuy({ ...defaultHtbInput(), state, area: "capital", home: "existing", price: page.examplePrice, deposit: page.examplePrice * 0.02 });
  const duty = STATE_DUTY_SCHEDULES[state].firstHome;
  const stateScheme = SHARED_EQUITY_SCHEMES.find((s) => s.state === state);
  return { page, caps, ex, duty, stateScheme };
}

export function htbStateTldr(state: AustralianState): string[] {
  const { page, caps, stateScheme } = htbStateFigures(state);
  return [
    `Help to Buy is available in ${page.name}. The government contributes up to ${HTB_SHARE.new.max}% of a new home or ${HTB_SHARE.existing.max}% of an existing one, and you need a ${HTB_MIN_DEPOSIT_PCT}% deposit.`,
    `The ${page.name} price caps are ${fmt(caps.capital)} in ${STATE_CAPITALS[state]}${caps.regionalCentres.length ? ` and ${caps.regionalCentres.join(", ")}` : ""} and ${fmt(caps.rest ?? caps.capital)} elsewhere in the state.`,
    `For ${HTB_YEAR} your taxable income must be ${fmt(HTB_INCOME_LIMITS.single)} or less as a single, or ${fmt(HTB_INCOME_LIMITS.joint)} for a couple or single parent.`,
    ...page.tldrExtras,
    stateScheme?.status === "closed"
      ? `${stateScheme.name}: ${stateScheme.statusNote}, so Help to Buy is now the shared equity option in ${page.name}.`
      : stateScheme
        ? `${stateScheme.name}: ${stateScheme.statusNote}. You can use it or Help to Buy, not both, and neither with the 5% Deposit Scheme.`
        : "You can't combine Help to Buy with the 5% Deposit Scheme or a state shared equity scheme.",
  ];
}

export function htbStateToc(): GuideTOCEntry[] {
  return [
    { id: "price-caps", label: "Price caps and where they apply" },
    { id: "example", label: "A worked example" },
    { id: "eligibility", label: "Who can use it" },
    { id: "combine", label: "Grants and stamp duty you can add" },
    { id: "state-scheme", label: "The state's own scheme" },
    { id: "apply", label: "How to apply" },
  ];
}

export function htbStateFaqs(state: AustralianState): FaqItem[] {
  const { page, caps, ex, stateScheme } = htbStateFigures(state);
  return [
    {
      question: `Is Help to Buy available in ${page.name}?`,
      answer:
        `Yes. ${page.availableSince} You apply through one of the ${HTB_LENDERS.length} participating lenders or a broker that works with them.`,
    },
    {
      question: `What is the Help to Buy price cap in ${page.name}?`,
      answer:
        `${fmt(caps.capital)} in ${STATE_CAPITALS[state]}${caps.regionalCentres.length ? ` and the regional centres of ${caps.regionalCentres.join(", ")}` : ""}, and ${fmt(caps.rest ?? caps.capital)} in the rest of ${page.name}. ` +
        "The caps haven't changed since the scheme started and aren't indexed.",
    },
    {
      question: `How much deposit do I need for Help to Buy in ${page.name}?`,
      answer:
        `At least ${HTB_MIN_DEPOSIT_PCT}% of the price: ${fmt(page.examplePrice * 0.02)} on a ${fmt(page.examplePrice)} home. With the government's ${ex.sharePct}% on an existing home, your loan would be ${fmt(ex.loan)}, about ${fmt(ex.monthlyRepayment)} a month at ${EXAMPLE_LOAN_RATE}%. ` +
        "You'll also need money for stamp duty, legal costs and loan fees.",
    },
    {
      // A People Also Ask question on the NSW, VIC, SA and Help to Buy SERPs (commercial-intent review 10 Oct 2026, section 6).
      question: `What does it mean if the government owns ${HTB_SHARE.existing.max}% of your house?`,
      answer:
        `Under Help to Buy the government pays up to ${HTB_SHARE.existing.max}% of an existing home's price, or ${HTB_SHARE.new.max}% of a new one, and owns that share. ` +
        `You pay no rent on it, can buy it back in steps of at least ${HTB_MIN_REPAYMENT_PCT}% of the home's value, and repay its share of the sale price when you sell (Housing Australia, read ${checkedOn}).`,
    },
    ...page.faqs,
    ...(stateScheme
      ? [{
          question: stateScheme.status === "closed" ? `Is the closed ${stateScheme.name} an alternative to Help to Buy?` : `Can I use Help to Buy with ${stateScheme.name}?`,
          answer:
            stateScheme.status === "closed"
              ? `No. ${stateScheme.name}: ${stateScheme.statusNote}, so Help to Buy is now the shared equity option in ${page.name}.`
              : `No. Help to Buy can't be combined with another shared equity scheme, so you choose one. ${stateScheme.name}: ${stateScheme.statusNote}.`,
        }]
      : []),
  ];
}

export function htbStateRelated(state: AustralianState): RelatedGuide[] {
  const { page } = htbStateFigures(state);
  return [
    { title: "Help to Buy Scheme Guide", href: "/guides/help-to-buy-scheme-australia", description: "The national rules in full: buying back, selling, renovating and more." },
    { title: "Help to Buy Calculator", href: "/help-to-buy-calculator", description: "Your eligibility, the government's share and your repayments." },
    { title: `First Home Buyer Guide ${page.short}`, href: page.firstHomeGuide, description: `Every grant, duty concession and scheme in ${page.name}.` },
    { title: "Shared Equity Schemes in Australia", href: "/guides/shared-equity-schemes-australia", description: "Help to Buy and each state's scheme, and which are open." },
    { title: "Stamp Duty Calculator", href: "/stamp-duty-calculator", description: "Duty on the purchase, with first home buyer concessions." },
  ];
}

export function HelpToBuyStateGuide({ state, frontmatter }: { state: AustralianState; frontmatter: GuideFrontmatter }) {
  const { page, caps, ex, duty, stateScheme } = htbStateFigures(state);
  const matchHref = `/find-an-expert?intent=buying&from=help-to-buy-${page.slugSuffix}#match`;
  const sources: SourceItem[] = [
    { label: HTB_SOURCES.priceCaps.label, href: HTB_SOURCES.priceCaps.href, note: `read ${checkedOn}` },
    { label: HTB_SOURCES.thresholds.label, href: HTB_SOURCES.thresholds.href },
    { label: HTB_SOURCES.directions.label, href: HTB_SOURCES.directions.href },
    { label: HTB_SOURCES.lenders.label, href: HTB_SOURCES.lenders.href, note: `read ${checkedOn}` },
    { label: duty.source.label, href: duty.source.href, note: "first home buyer duty concession" },
    ...page.sources,
    ...(stateScheme ? [{ label: stateScheme.source.label, href: stateScheme.source.href, note: `read ${checkedOn}` }] : []),
    `Worked example: ${EXAMPLE_LOAN_RATE}% over 30 years is an example rate, not a quote.`,
  ];
  return (
    <GuideArticleLayout
      frontmatter={frontmatter}
      tldr={htbStateTldr(state)}
      toc={htbStateToc()}
      faqs={htbStateFaqs(state)}
      related={htbStateRelated(state)}
    >
      <p className="lead">{page.intro}</p>

      <h2 id="price-caps">Price caps and where they apply</h2>
      <ScrollTable label={`Help to Buy price caps in ${page.name}`}>
        <table>
          <thead>
            <tr><th>Area</th><th>Price cap</th></tr>
          </thead>
          <tbody>
            <tr><td>{STATE_CAPITALS[state]}{caps.regionalCentres.length ? ` and ${caps.regionalCentres.join(", ")}` : ""}</td><td>{fmt(caps.capital)}</td></tr>
            {caps.rest !== null && <tr><td>Rest of {page.name}</td><td>{fmt(caps.rest)}</td></tr>}
          </tbody>
        </table>
      </ScrollTable>
      <p>{page.capsNote}</p>

      <h2 id="example">A worked example</h2>
      <p>
        A {fmt(page.examplePrice)} existing home in {STATE_CAPITALS[state]}, with a {HTB_MIN_DEPOSIT_PCT}% deposit and the
        government&rsquo;s full {ex.sharePct}%:
      </p>
      <ScrollTable label={`Help to Buy worked example, ${page.name}`}>
        <table>
          <thead>
            <tr><th></th><th>Help to Buy</th><th>5% Deposit Scheme</th></tr>
          </thead>
          <tbody>
            <tr><td>Your deposit</td><td>{fmt(page.examplePrice * 0.02)}</td><td>{fmt(ex.fivePercent.deposit)}</td></tr>
            <tr><td>Government share</td><td>{fmt(ex.governmentContribution)}</td><td>None</td></tr>
            <tr><td>Your home loan</td><td>{fmt(ex.loan)}</td><td>{fmt(ex.fivePercent.loan)}</td></tr>
            <tr><td>Monthly repayment, 30 years at {EXAMPLE_LOAN_RATE}%</td><td>{fmt(ex.monthlyRepayment)}</td><td>{fmt(ex.fivePercent.monthlyRepayment)}</td></tr>
            <tr><td>{page.name} first home buyer stamp duty on an established home</td><td>{ex.stampDuty === 0 ? "None" : fmt(ex.stampDuty ?? 0)}</td><td>{ex.stampDuty === 0 ? "None" : fmt(ex.stampDuty ?? 0)}</td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        {page.exampleNote} Run your own figures in the{" "}
        <Link href="/help-to-buy-calculator">Help to Buy calculator</Link>.
      </p>

      <h2 id="eligibility">Who can use it</h2>
      <ul>
        <li>Australian citizens aged 18 or over; permanent residents aren&rsquo;t eligible.</li>
        <li>Taxable income for {HTB_YEAR} of {fmt(HTB_INCOME_LIMITS.single)} or less as a single, {fmt(HTB_INCOME_LIMITS.joint)} for a couple or single parent.</li>
        <li>You can&rsquo;t own property now, but you don&rsquo;t have to be a first home buyer.</li>
        <li>You must live in the home, and the lender must be satisfied you couldn&rsquo;t buy without the scheme.</li>
      </ul>
      <p>
        The full rules, including buying back the government&rsquo;s share, selling, renovating and
        renting out, are in the <Link href="/guides/help-to-buy-scheme-australia">Help to Buy guide</Link>.
        {page.uptakeNote && <> {page.uptakeNote}</>}
      </p>

      <h2 id="combine">Grants and stamp duty you can add</h2>
      <p>
        Help to Buy can be combined with a first home owner grant, stamp duty concessions and the{" "}
        <Link href="/guides/first-home-super-saver-scheme">First Home Super Saver Scheme</Link>. In {page.name}:
      </p>
      <ul>
        {page.combine.map((c) => <li key={c.title}><strong>{c.title}:</strong> {c.body}</li>)}
        <li>
          <strong>First home buyer stamp duty on an established home:</strong>{" "}
          {duty.exemptTo ? <>no duty up to {fmt(duty.exemptTo)}</> : <>no full exemption</>}
          {duty.concessionTo ? <>, with a reduced rate up to {fmt(duty.concessionTo)}</> : null} ({duty.schemeName}, from{" "}
          {duty.from}).
        </li>
      </ul>
      <p>
        You can&rsquo;t combine Help to Buy with the{" "}
        <Link href="/guides/first-home-guarantee">5% Deposit Scheme</Link> or a state shared equity scheme.
      </p>

      <h2 id="state-scheme">The state&rsquo;s own scheme</h2>
      {stateScheme ? (
        <>
          <p>
            <strong>{stateScheme.name}:</strong> {stateScheme.statusNote}.
            {stateScheme.terms && <> {stateScheme.terms}.</>}{" "}
            <a href={stateScheme.source.href} rel="nofollow noopener" target="_blank">Official page</a>.
          </p>
          <p>{page.stateSchemeNote}</p>
        </>
      ) : (
        <p>{page.stateSchemeNote}</p>
      )}
      <p>
        Every scheme and its status is in our guide to{" "}
        <Link href="/guides/shared-equity-schemes-australia">shared equity schemes in Australia</Link>.
      </p>

      <h2 id="apply">How to apply</h2>
      <p>
        Apply through a participating lender or a broker that works with one: {HTB_LENDERS.map((l) => l.name).join(", ")}.{" "}
        {page.lenderNote} The lender&rsquo;s conditional approval reserves a place for 90 days, and your contract
        must allow at least 30 days to settlement.
      </p>
      <Callout variant="info" title="Places">
        <p>
          Places are shared between the states by population: 10,000 a year nationally. Housing Australia
          doesn&rsquo;t publish how many are left in {page.name}; your lender tells you if one is available.
          {(HTB_UPTAKE.strongestDemand as readonly string[]).includes(page.name) && <> Demand has been strongest in {HTB_UPTAKE.strongestDemand.join(", then ")}.</>}
        </p>
      </Callout>
      <MatchCTA
        lead={`Buying in ${page.name} with Help to Buy? Tell us where: one specialist receives your details and pays us a fee for the introduction; you pay us nothing. No commitment.`}
        ctaLabel="Find your specialist"
        href={matchHref}
      />

      <Sources items={sources} />
    </GuideArticleLayout>
  );
}
