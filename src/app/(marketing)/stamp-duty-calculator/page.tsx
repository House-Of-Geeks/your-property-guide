import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { StampDutyStateLinks } from "@/components/calculators/StampDutyStateLinks";
import { STAMP_DUTY_VERIFIED_ON, STATE_DUTY_SCHEDULES } from "@/lib/utils/stamp-duty";
import { ABBR, AUSTRALIAN_STATES, IN, money, dutyFor } from "@/lib/data/stamp-duty-state";
import { FIRST_HOME_REVIEWED_ON, currentExemptTo, formatPolicyDate, grantFor } from "@/lib/policy/first-home";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Stamp Duty Calculator",
  description:
    "Estimate stamp duty across all eight Australian states and territories, with first home buyer concessions by contract date and property type, and foreign buyer surcharges. Rates checked against each revenue office on 30 September 2026, first home rules on 14 October 2026.",
  slug: "stamp-duty-calculator",
  schemaName: "Stamp Duty Calculator Australia",
  schemaDescription: "Calculate stamp duty costs across all Australian states and territories.",
  updatedAt: "2026-10-20",
  persona: "first-home",
};

// Stamp duty is a 74k/mo AU query — the highest-volume calculator query
// on the site. Title leans into year + state coverage to win the snippet.
const META_TITLE = "Stamp Duty Calculator 2026: All Australian States";
const META_DESCRIPTION = "Free stamp duty calculator for all eight Australian states and territories, with first home buyer concessions and foreign buyer surcharges. Rates checked 30 Sep 2026.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/${FRONTMATTER.slug}`,
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FOREIGN_RATES = AUSTRALIAN_STATES.flatMap((st) => (STATE_DUTY_SCHEDULES[st].foreign ? [STATE_DUTY_SCHEDULES[st].foreign!.rate] : []));

// The direct answer at one price, from the same engine as the calculator
// (rates checked against each revenue office), instead of a typed
// "$20,000 to $60,000" (search and conversion baseline, 20 Oct 2026).
const EXAMPLE_PRICE = 800_000;
const EXAMPLE_DUTY = AUSTRALIAN_STATES.map((st) => ({ st, total: dutyFor(st, EXAMPLE_PRICE, "owner").total })).sort((a, b) => a.total - b.total);
const DUTY_LOWEST = EXAMPLE_DUTY[0];
const DUTY_HIGHEST = EXAMPLE_DUTY[EXAMPLE_DUTY.length - 1];

const FAQS: FaqItem[] = [
  {
    question: "How is stamp duty calculated in Australia?",
    answer:
      "Stamp duty (also called transfer duty or conveyance duty) is calculated on a sliding scale based on the property purchase price. Each state and territory sets its own rates and brackets, so the amount varies significantly depending on where you buy.",
  },
  {
    question: "Do first home buyers pay stamp duty?",
    answer: `It depends on the state, the date you sign and what you buy. On an established home, an eligible first home buyer pays no duty up to ${money(currentExemptTo("NSW") ?? 0)} in NSW, ${money(currentExemptTo("QLD") ?? 0)} in Queensland, ${money(currentExemptTo("VIC") ?? 0)} in Victoria and ${money(currentExemptTo("WA") ?? 0)} in WA, with a reduced amount above those lines. Queensland and SA charge no duty at any price on a new home or vacant land to build one, and SA gives no relief on an established home. In the ACT, an eligible buyer who has held no property interest for five years pays nothing at any price from 1 July 2026. Tasmania's exemption ended for settlements after 30 June 2026, and the NT pays a ${money(grantFor("NT", FIRST_HOME_REVIEWED_ON, "new").version?.amount ?? 0)} grant on a new home instead of a duty concession. The calculator applies the rule for the contract date you enter (the settlement date in Tasmania). First home rules checked against each revenue office on ${formatPolicyDate(FIRST_HOME_REVIEWED_ON)}.`,
  },
  {
    question: "What is the foreign buyer surcharge?",
    answer: `Foreign buyers of residential property pay a surcharge on top of standard duty: ${AUSTRALIAN_STATES.filter((st) => STATE_DUTY_SCHEDULES[st].foreign)
      .map((st) => `${ABBR[st]} ${Math.round(STATE_DUTY_SCHEDULES[st].foreign!.rate * 100)}%`)
      .join(", ")}. The ACT and the NT charge no foreign purchaser duty surcharge. On a $750,000 home in NSW the ${Math.round(STATE_DUTY_SCHEDULES.NSW.foreign!.rate * 100)}% surcharge adds ${money(750_000 * STATE_DUTY_SCHEDULES.NSW.foreign!.rate)} to the ${money(dutyFor("NSW", 750_000, "owner").total)} of transfer duty (rates checked ${formatPolicyDate(STAMP_DUTY_VERIFIED_ON)}).`,
  },
  {
    question: "When is stamp duty paid?",
    answer:
      "Stamp duty is typically due at settlement (when you take possession of the property). Your conveyancer or solicitor will arrange payment as part of the settlement process.",
  },
  {
    question: "Is stamp duty tax deductible?",
    answer:
      "For investment properties, stamp duty forms part of the cost base of the asset and may reduce capital gains tax when you sell. It is not immediately deductible in the year of purchase. For owner-occupied homes, stamp duty is not deductible. Always consult a tax professional for your specific situation.",
  },
  {
    question: "Can I include stamp duty in my home loan?",
    answer:
      "Sometimes. Lenders can lend against the contract price plus an allowance for stamp duty (and other settlement costs) up to a maximum LVR (loan-to-value ratio). If you have a smaller deposit, you may need to cover stamp duty in cash on top of the deposit, or accept a higher LVR (and likely LMI). A broker can model both scenarios for your situation.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide",   href: "/guides/first-home-buyer-guide", description: "How federal schemes, state grants, and stamp duty concessions stack." },
  { title: "Borrowing Power Calculator", href: "/borrowing-power-calculator", description: "What you can borrow once you know what you'll pay in duty." },
  { title: "Conveyancing Guide",       href: "/guides/conveyancing-guide",     description: "Who handles stamp duty payment at settlement." },
  { title: "First Home Buyer NSW",     href: "/guides/first-home-buyer-nsw",   description: "NSW concessions and thresholds in detail." },
  { title: "First Home Buyer VIC",     href: "/guides/first-home-buyer-vic",   description: "Victoria's stamp duty exemption explained." },
  { title: "First Home Buyer QLD",     href: "/guides/first-home-buyer-qld",   description: "Queensland's first home concession in full." },
];

export default function StampDutyCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={
        <>
          <StampDutyCalculator />
          <section id="by-state" className="scroll-mt-28 max-w-5xl mx-auto mt-12">
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-2">Calculate by state</h2>
            <p className="font-sans text-base text-ink-muted mb-5">
              Each state page runs this calculator locked to that state, with its full rates table, first home buyer
              thresholds and worked examples. Figures are for an owner-occupier, rates checked {formatPolicyDate(STAMP_DUTY_VERIFIED_ON)}.
            </p>
            <StampDutyStateLinks />
          </section>
        </>
      }
      faqs={FAQS}
      related={RELATED}
      intent="buying"
      explainer={
        <>
          <h2>What stamp duty actually is</h2>
          <p>
            Stamp duty (officially called <em>transfer duty</em> or <em>conveyance duty</em>{" "}in
            most states) is a state government tax on property transfers. It&rsquo;s
            charged on the contract price of the property and is paid by the buyer
            at settlement.
          </p>
          <p>
            It&rsquo;s the largest upfront cost most buyers face after the deposit. On an{" "}
            {money(EXAMPLE_PRICE)} home bought to live in, by a buyer who isn’t a first home buyer, duty ranges from{" "}
            {money(DUTY_LOWEST.total)} in {IN[DUTY_LOWEST.st]} to {money(DUTY_HIGHEST.total)} in {IN[DUTY_HIGHEST.st]}{" "}
            (rates checked {formatPolicyDate(STAMP_DUTY_VERIFIED_ON)}). Eligible first home buyers often pay far less, or
            nothing, below their state’s threshold.
          </p>

          <KeyFigure
            value={`${money(DUTY_LOWEST.total)}–${money(DUTY_HIGHEST.total)}`}
            label={`Stamp duty on an ${money(EXAMPLE_PRICE)} home for an owner-occupier who isn’t a first home buyer, across the eight states and territories.`}
            context={`From the calculator’s schedules, rates checked ${formatPolicyDate(STAMP_DUTY_VERIFIED_ON)}`}
          />

          <h2>How rates differ across states</h2>
          <p>
            Every state and territory sets its own duty schedule. A $700,000
            purchase can attract noticeably different duty in NSW, Victoria, and
            Queensland. The calculator above runs the current schedule for each.
          </p>
          <p>
            For the full rates, worked examples and first home buyer rules in
            your state, see the dedicated guide:{" "}
            <Link href="/guides/stamp-duty-nsw">NSW</Link>,{" "}
            <Link href="/guides/stamp-duty-vic">VIC</Link>,{" "}
            <Link href="/guides/stamp-duty-qld">QLD</Link>,{" "}
            <Link href="/guides/stamp-duty-wa">WA</Link>,{" "}
            <Link href="/guides/stamp-duty-sa">SA</Link>,{" "}
            <Link href="/guides/stamp-duty-tas">TAS</Link>,{" "}
            <Link href="/guides/stamp-duty-nt">NT</Link>,{" "}
            <Link href="/guides/stamp-duty-act">ACT</Link>.
          </p>
          <p>
            Three things make the biggest difference between states:
          </p>
          <ul>
            <li><strong>Whether you&rsquo;re a first home buyer.</strong> Most states give first home buyers either a full or partial exemption below a threshold.</li>
            <li><strong>Whether you&rsquo;re buying as an owner-occupier or investor.</strong> Owner-occupier discounts exist in several states.</li>
            <li><strong>Whether you&rsquo;re a foreign buyer.</strong> A surcharge of {Math.round(Math.min(...FOREIGN_RATES) * 100)}% to {Math.round(Math.max(...FOREIGN_RATES) * 100)}% applies in every state except the ACT and the NT, on top of standard duty.</li>
          </ul>

          <h2>First home buyer concessions in plain English</h2>
          <p>
            For state-by-state detail, see our state-specific first home buyer
            guides:{" "}
            <Link href="/guides/first-home-buyer-nsw">NSW</Link>,{" "}
            <Link href="/guides/first-home-buyer-vic">VIC</Link>,{" "}
            <Link href="/guides/first-home-buyer-qld">QLD</Link>,{" "}
            <Link href="/guides/first-home-buyer-wa">WA</Link>,{" "}
            <Link href="/guides/first-home-buyer-sa">SA</Link>,{" "}
            <Link href="/guides/first-home-buyer-tas">TAS</Link>,{" "}
            <Link href="/guides/first-home-buyer-nt">NT</Link>,{" "}
            <Link href="/guides/first-home-buyer-act">ACT</Link>.
          </p>
          <p>
            Most states have a price threshold below which duty is fully exempt
            for eligible first home buyers, and a concessional band above that
            where duty scales back to the full rate. Some rules depend on what
            you buy (Queensland and SA charge nothing on a new home or land to
            build, with no cap) and on the date: the calculator applies the rule
            for the contract date you enter, and in Tasmania the settlement date.
            Above the top of the band the concession is gone, so when
            you&rsquo;re negotiating near a threshold, the maths matters.
          </p>

          <Callout variant="warning" title="Verify before you settle">
            <p>
              State duty schedules and concessions change. Confirm the current
              rates with your state revenue office or your conveyancer before
              relying on any specific figure. Concessions also have eligibility
              tests, you must usually occupy the property as your principal
              residence within a set window after settlement.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t cover</h2>
          <ul>
            <li>Mortgage registration fee and transfer fee (small, but real, add a few hundred dollars per state).</li>
            <li>Discretionary trust or company purchases (different duty treatment in some states).</li>
            <li>Off-the-plan stamp duty concessions open to all buyers (Victoria and WA have them).</li>
            <li>Income tests, residence rules and partial concessions a state publishes no formula for; the result says when one applies.</li>
            <li>Concessional duty for older buyers / pensioners (varies by state).</li>
          </ul>
          <p>
            For a complete settlement-cost breakdown, a conveyancer is the
            right person to ask: our{" "}
            <Link href="/guides/conveyancing-guide">conveyancing guide</Link>{" "}
            covers what they do and what they charge. To put duty in your whole
            budget, the{" "}
            <Link href="/affordability-calculator">affordability calculator</Link>{" "}
            combines it with your deposit and borrowing power, and a{" "}
            <Link href="/plan?j=buying">next-step plan</Link> sets out what to do
            next for where you’re up to.
          </p>
        </>
      }
    />
  );
}
