import type { Metadata } from "next";
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
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { STATE_NAMES } from "@/lib/data/commission-rates";
import {
  HTB_CHECKED_ON,
  HTB_INCOME_LIMITS,
  HTB_MIN_DEPOSIT_PCT,
  HTB_PRICE_CAPS,
  HTB_SHARE,
  HTB_SOURCES,
  SHARED_EQUITY_SCHEMES,
  type StateScheme,
} from "@/lib/data/help-to-buy";
import { EXAMPLE_LOAN_RATE, computeHelpToBuy, defaultHtbInput } from "@/lib/help-to-buy-calc";

const FRONTMATTER: GuideFrontmatter = {
  title: "Shared Equity Schemes in Australia (2026): Help to Buy and Every State Scheme",
  description:
    "Every shared equity scheme in Australia and whether it's open: Help to Buy, Queensland's Boost to Buy, WA's Keystart, SA's HomeStart and Tasmania's MyHome, plus the closed Victorian Homebuyer Fund and NSW Shared Equity Home Buyer Helper.",
  slug: "shared-equity-schemes-australia",
  publishedAt: "2026-10-07",
  updatedAt: "2026-10-07",
  readingTimeMinutes: 8,
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

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const checkedOn = new Date(HTB_CHECKED_ON).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const MATCH_HREF = "/find-an-expert?intent=buying&from=shared-equity#match";
const scheme = (name: string) => SHARED_EQUITY_SCHEMES.find((s) => s.name === name) as StateScheme;
const STATUS_LABEL: Record<StateScheme["status"], string> = { open: "Open", limited: "Open, limited", closed: "Closed" };
const where = (s: StateScheme) => (s.state === "national" ? "Australia-wide" : STATE_NAMES[s.state].replace(/^the /, ""));
const EXR = computeHelpToBuy(defaultHtbInput());

const TLDR = [
  "Shared equity means a government contributes part of the price of your home and is repaid a matching share of its value when you sell or buy it back. You borrow less and pay no rent on its share.",
  `Help to Buy is the national scheme: up to ${HTB_SHARE.new.max}% of a new home or ${HTB_SHARE.existing.max}% of an existing one, a ${HTB_MIN_DEPOSIT_PCT}% deposit, and income limits of ${fmt(HTB_INCOME_LIMITS.single)} single or ${fmt(HTB_INCOME_LIMITS.joint)} joint.`,
  "State schemes still open: Queensland's Boost to Buy (regional places only in round 2), WA's Keystart shared ownership loans, SA's HomeStart Shared Equity Option and Tasmania's MyHome.",
  "Closed: the Victorian Homebuyer Fund (10 September 2025) and NSW's Shared Equity Home Buyer Helper (30 June 2024). Buyers in those states now use Help to Buy.",
  "You can't combine Help to Buy with a state shared equity scheme or the 5% Deposit Scheme.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",     label: "What shared equity is" },
  { id: "all-schemes", label: "Every scheme and its status" },
  { id: "closed",      label: "Victoria and NSW: the closed schemes" },
  { id: "open-state",  label: "The state schemes still open" },
  { id: "choosing",    label: "Help to Buy or a state scheme?" },
  { id: "getting-out", label: "Getting out of a shared equity scheme" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is a shared equity scheme and how does it work?",
    answer:
      "A government contributes part of the price of your home, so you need a smaller deposit and loan. You pay no rent or interest on its share. " +
      "When you sell, or when you buy its share back, it receives the same percentage of the home's value at that time, so it shares in any growth.",
  },
  {
    question: "Is the Victorian Homebuyer Fund still open?",
    answer:
      "No. The Victorian Homebuyer Fund closed to new applications on 10 September 2025. Victorian buyers can use the federal Help to Buy scheme instead, " +
      `with price caps of ${fmt(HTB_PRICE_CAPS.VIC.capital)} in Melbourne and Geelong and ${fmt(HTB_PRICE_CAPS.VIC.rest ?? 0)} elsewhere in Victoria.`,
  },
  {
    question: "Is there a shared equity scheme in NSW?",
    answer:
      "Only Help to Buy. NSW's own Shared Equity Home Buyer Helper closed on 30 June 2024. " +
      `Help to Buy's NSW price caps are ${fmt(HTB_PRICE_CAPS.NSW.capital)} in Sydney and the named regional centres, and ${fmt(HTB_PRICE_CAPS.NSW.rest ?? 0)} elsewhere.`,
  },
  {
    question: "Is the shared equity scheme a good idea?",
    answer:
      `It suits buyers who can't service a full loan. On a $700,000 home, Help to Buy cuts repayments from about ${fmt(EXR.fivePercent.monthlyRepayment)} to ${fmt(EXR.monthlyRepayment)} a month at ${EXAMPLE_LOAN_RATE}% (against a 5% deposit loan). ` +
      "The cost is the share of growth you give up, and limits on renting the home out. If you can comfortably service the bigger loan, the 5% Deposit Scheme lets you keep all the growth.",
  },
  {
    question: "How much can I borrow with shared equity?",
    answer:
      "Shared equity doesn't raise what a lender will lend you; it lowers how much you need. Your loan is the price less your deposit and the government's share, " +
      "and the lender still has to be satisfied you can repay it. The Help to Buy calculator works out the loan and repayments for a given price.",
  },
  {
    question: "Can I use Help to Buy with Boost to Buy?",
    answer:
      "No. Help to Buy can't be combined with any other shared equity scheme, and Queensland's Boost to Buy excludes anyone receiving Commonwealth shared equity. You choose one.",
  },
  {
    question: "How do you get out of a shared equity scheme?",
    answer:
      "Under Help to Buy you buy the government's share back, in steps of at least 5% of the home's value or all at once, or you sell and it receives its share of the sale. " +
      "Refinancing to a lender outside the scheme means repaying its share in full. State schemes have their own rules; check the scheme's terms.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Help to Buy Scheme Guide", href: "/guides/help-to-buy-scheme-australia", description: "The national scheme in full: limits, caps, lenders and what happens when you sell." },
  { title: "Help to Buy Calculator", href: "/help-to-buy-calculator", description: "Your eligibility, the government's share and your repayments." },
  { title: "5% Deposit Scheme (First Home Guarantee)", href: "/guides/first-home-guarantee", description: "The alternative that keeps all the growth with you." },
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Every federal and state scheme for first home buyers." },
];

const SOURCES: SourceItem[] = [
  ...SHARED_EQUITY_SCHEMES.map((s) => ({ label: s.source.label, href: s.source.href, note: `read ${checkedOn}` })),
  { label: HTB_SOURCES.directions.label, href: HTB_SOURCES.directions.href, note: "Help to Buy can't be combined with other shared equity schemes (s17(d), Sch 1 cl 1.6)" },
  { label: HTB_SOURCES.customerGuide.label, href: HTB_SOURCES.customerGuide.href },
];

export default function SharedEquitySchemesPage() {
  const helpToBuy = scheme("Help to Buy");
  const open = SHARED_EQUITY_SCHEMES.filter((s) => s.state !== "national" && s.status !== "closed");
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={TLDR} toc={TOC} faqs={FAQS} related={RELATED}>
      <h2 id="what-is">What shared equity is</h2>
      <p className="lead">
        In a shared equity scheme a government contributes part of the price of
        your home, so you need a smaller deposit and a smaller loan. You pay no
        rent or interest on its share. When you sell, or buy its share back, it
        receives the same percentage of the home&rsquo;s value at that time.
      </p>
      <p>
        The trade-off is always the same: lower repayments now, in exchange for a
        share of the growth later. The national scheme is{" "}
        <Link href="/guides/help-to-buy-scheme-australia">Help to Buy</Link>; four states
        also run their own.
      </p>

      <h2 id="all-schemes">Every scheme and its status</h2>
      <p>From each scheme&rsquo;s official page, read {checkedOn}.</p>
      <ScrollTable label="Shared equity schemes in Australia">
        <table style={{ minWidth: 680 }}>
          <thead>
            <tr><th>Scheme</th><th>Where</th><th>Status</th><th>Headline terms</th></tr>
          </thead>
          <tbody>
            {SHARED_EQUITY_SCHEMES.map((s) => (
              <tr key={s.name}>
                <td><a href={s.source.href} rel="nofollow noopener" target="_blank">{s.name}</a></td>
                <td>{where(s)}</td>
                <td>
                  <strong>{STATUS_LABEL[s.status]}</strong>
                  <span className="block text-sm">{s.statusNote}</span>
                </td>
                <td>{s.terms ?? "n/a"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <Callout variant="warning" title="You can only use one">
        <p>
          Help to Buy can&rsquo;t be combined with any other shared equity scheme or
          with the 5% Deposit Scheme. It can be combined with first home owner
          grants, stamp duty concessions and the{" "}
          <Link href="/guides/first-home-super-saver-scheme">First Home Super Saver Scheme</Link>.
        </p>
      </Callout>

      <h2 id="closed">Victoria and NSW: the closed schemes</h2>
      <p>
        <strong>The Victorian Homebuyer Fund</strong> closed to new applications on 10
        September 2025, and the State Revenue Office lists it among its closed
        schemes. <strong>NSW&rsquo;s Shared Equity Home Buyer Helper</strong> closed on 30
        June 2024. In both states, shared equity now means Help to Buy:
      </p>
      <ul>
        <li>
          <strong>Victoria:</strong> {fmt(HTB_PRICE_CAPS.VIC.capital)} in Melbourne and Geelong,{" "}
          {fmt(HTB_PRICE_CAPS.VIC.rest ?? 0)} elsewhere. <Link href="/guides/help-to-buy-scheme-victoria">Help to Buy in Victoria</Link>.
        </li>
        <li>
          <strong>NSW:</strong> {fmt(HTB_PRICE_CAPS.NSW.capital)} in Sydney and the named regional centres,{" "}
          {fmt(HTB_PRICE_CAPS.NSW.rest ?? 0)} elsewhere. <Link href="/guides/help-to-buy-scheme-nsw">Help to Buy in NSW</Link>.
        </li>
      </ul>

      <h2 id="open-state">The state schemes still open</h2>
      {open.map((s) => (
        <div key={s.name}>
          <h3>{s.name} ({where(s)})</h3>
          <p>
            {s.statusNote}. {s.terms && <>{s.terms}.</>}{" "}
            <a href={s.source.href} rel="nofollow noopener" target="_blank">Official page</a>.
          </p>
        </div>
      ))}
      <p>
        Help to Buy is also available in all four states:{" "}
        <Link href="/guides/help-to-buy-scheme-qld">Queensland</Link>,{" "}
        <Link href="/guides/help-to-buy-scheme-wa">Western Australia</Link>, and South Australia and Tasmania
        (see the <Link href="/guides/help-to-buy-scheme-australia#price-caps">price caps</Link>).
      </p>

      <h2 id="choosing">Help to Buy or a state scheme?</h2>
      <p>Where you have a choice, compare on four things:</p>
      <ul>
        <li><strong>Income limits.</strong> Help to Buy&rsquo;s are {fmt(HTB_INCOME_LIMITS.single)} single and {fmt(HTB_INCOME_LIMITS.joint)} joint. Boost to Buy&rsquo;s are higher; HomeStart&rsquo;s is set on net household income.</li>
        <li><strong>The share.</strong> Help to Buy goes to {HTB_SHARE.new.max}% of a new home; Boost to Buy to 30%, HomeStart to 25%.</li>
        <li><strong>The price cap</strong> in the area you&rsquo;re buying.</li>
        <li><strong>Availability.</strong> {helpToBuy.statusNote}; Boost to Buy has regional places only in its current round.</li>
      </ul>
      <p>
        The <Link href="/help-to-buy-calculator">Help to Buy calculator</Link> shows the national
        scheme&rsquo;s numbers; for a state scheme, ask its lender for the same figures and compare.
      </p>

      <h2 id="getting-out">Getting out of a shared equity scheme</h2>
      <p>
        Under Help to Buy you can buy the government&rsquo;s share back in steps of at
        least 5% of the home&rsquo;s value, or all at once, at a valuation you pay for.
        Selling repays its share from the proceeds. Refinancing to a lender outside the
        scheme means repaying its share in full. State schemes set their own rules, so
        read the scheme&rsquo;s terms before you sign.
      </p>
      <MatchCTA
        lead="Not sure which scheme fits? Tell us where you're buying and we'll introduce one vetted specialist who can compare them on your numbers."
        ctaLabel="Find your specialist"
        href={MATCH_HREF}
      />

      <Sources items={SOURCES} />
    </GuideArticleLayout>
  );
}
