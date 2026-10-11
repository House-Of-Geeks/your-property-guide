import type { Metadata } from "next";
import Link from "next/link";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { StampDutyStateLinks } from "@/components/calculators/StampDutyStateLinks";
import { STATE_DUTY_SCHEDULES } from "@/lib/utils/stamp-duty";
import { ABBR, AUSTRALIAN_STATES, money, dutyFor } from "@/lib/data/stamp-duty-state";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, ScrollTable, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { FIRST_HOME_DUTY, dutyReliefCell, fmt, longDate } from "@/lib/data/first-home-grants";

// First home buyer lines come from src/lib/data/first-home-grants.ts, whose
// thresholds are the engine's (commercial-intent review 10 Oct 2026, buying
// 0.2 and 3.1). The duty range replaces an unsourced "$20,000 to $60,000".
const FHD = FIRST_HOME_DUTY;
const DUTY_750K = AUSTRALIAN_STATES.map((st) => ({ st, duty: dutyFor(st, 750_000, "owner").total })).sort((a, b) => a.duty - b.duty);
const LOW = DUTY_750K[0];
const HIGH = DUTY_750K[DUTY_750K.length - 1];
const DUTY_RANGE = `${money(LOW.duty)} to ${money(HIGH.duty)}`;
const SURCHARGES = AUSTRALIAN_STATES.flatMap((st) => (STATE_DUTY_SCHEDULES[st].foreign ? [STATE_DUTY_SCHEDULES[st].foreign!.rate * 100] : []));
const COVERS: Record<"any" | "newOnly" | "none", string> = {
  any: "New and established",
  newOnly: "New homes and land only",
  none: "None",
};

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Stamp Duty Calculator",
  description:
    "Estimate stamp duty across all eight Australian states and territories, with first home buyer concessions and foreign buyer surcharges. Rates checked against each revenue office on 30 September 2026.",
  slug: "stamp-duty-calculator",
  schemaName: "Stamp Duty Calculator Australia",
  schemaDescription: "Calculate stamp duty costs across all Australian states and territories.",
  updatedAt: "2026-10-11",
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
  openGraph: {
    url: `${SITE_URL}/${FRONTMATTER.slug}`,
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "How is stamp duty calculated in Australia?",
    answer:
      "Stamp duty (also called transfer duty or conveyance duty) is calculated on a sliding scale based on the property purchase price. Each state and territory sets its own rates and brackets, so the amount varies significantly depending on where you buy.",
  },
  {
    question: "Do first home buyers pay stamp duty?",
    answer:
      `It depends on the state. On an established home, an eligible first home buyer pays no duty up to ${fmt(FHD.NSW.exemptTo!)} in NSW, ${fmt(FHD.QLD.exemptTo!)} in Queensland, ${fmt(FHD.VIC.exemptTo!)} in Victoria and ${fmt(FHD.WA.exemptTo!)} in WA (from ${FHD.WA.from}), with a reduced amount above those lines. In the ACT, an eligible buyer who has not owned property for five years pays nothing at any price from ${FHD.ACT.from}. SA gives relief only on new homes and land. Tasmania's exemption ended on 30 June 2026, and the NT pays a grant instead of a duty concession. Checked against each revenue office on ${longDate(FHD.NSW.checkedOn)} and ${longDate(FHD.SA.checkedOn)}.`,
  },
  {
    question: "Who is exempted from stamp duty?",
    answer:
      `No one is exempt in every state; each sets its own rules. The largest relief is for first home buyers: in NSW an eligible first home buyer pays no transfer duty on a home up to ${fmt(FHD.NSW.exemptTo!)} (Revenue NSW, contracts from ${FHD.NSW.from}, read ${longDate(FHD.NSW.checkedOn)}). NSW also exempts some transfers between spouses and charges deceased estates a concessional rate; our state guides list each state's exemptions.`,
  },
  {
    question: "What is the foreign buyer surcharge?",
    answer: `Foreign buyers of residential property pay a surcharge on top of standard duty: ${AUSTRALIAN_STATES.filter((st) => STATE_DUTY_SCHEDULES[st].foreign)
      .map((st) => `${ABBR[st]} ${Math.round(STATE_DUTY_SCHEDULES[st].foreign!.rate * 100)}%`)
      .join(", ")}. The ACT and the NT charge no foreign purchaser duty surcharge. On a $750,000 home in NSW the 9% surcharge adds ${money(750_000 * 0.09)} to the ${money(dutyFor("NSW", 750_000, "owner").total)} of transfer duty (rates checked 30 September 2026).`,
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
              thresholds and worked examples. Figures are for an owner-occupier, rates checked 30 September 2026.
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
            Stamp duty (officially called <em>transfer duty</em> or <em>conveyance duty</em> in
            most states) is a state government tax on property transfers. It&rsquo;s
            charged on the contract price of the property and is paid by the buyer
            at settlement.
          </p>
          <p>
            It&rsquo;s the single largest upfront cost most buyers face after the deposit.
            On a $750,000 home an owner-occupier pays from {money(LOW.duty)} in {ABBR[LOW.st]} to{" "}
            {money(HIGH.duty)} in {ABBR[HIGH.st]}. That is before any first home buyer relief.
          </p>

          <KeyFigure
            value={DUTY_RANGE}
            label="Stamp duty on a $750,000 home for an owner-occupier who is not a first home buyer, across the eight states and territories."
            context="Our calculator on each revenue office's rates, checked 30 September 2026"
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
            <li><strong>Whether you&rsquo;re a foreign buyer.</strong> A surcharge of {Math.min(...SURCHARGES)}% to {Math.max(...SURCHARGES)}% applies in six states on top of standard duty; the ACT and the NT charge none.</li>
          </ul>

          <h2>First home buyer stamp duty by state</h2>
          <p>
            What an eligible first home buyer pays, state by state, with the date each
            revenue office was checked:
          </p>
          <ScrollTable label="First home buyer stamp duty relief by state and territory">
            <table>
              <thead>
                <tr>
                  <th>State</th>
                  <th>First home buyer relief</th>
                  <th>Covers</th>
                  <th>From</th>
                  <th>Source, checked</th>
                </tr>
              </thead>
              <tbody>
                {AUSTRALIAN_STATES.map((st) => {
                  const d = FHD[st];
                  return (
                    <tr key={st}>
                      <td><Link href={`/guides/first-home-buyer-${st.toLowerCase()}`}>First home buyer guide {ABBR[st]}</Link></td>
                      <td>{dutyReliefCell(st)}</td>
                      <td>{COVERS[d.covers]}</td>
                      <td>{d.from || "Not applicable"}</td>
                      <td>
                        <a href={d.source.href} target="_blank" rel="noopener noreferrer">{d.source.label.split(":")[0]}</a>, {longDate(d.checkedOn)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollTable>
          <p>
            Where a state has a concession band, duty scales back up to the full rate
            across the band, so a price a little over the exemption line costs some
            duty rather than all of it. Above the top of the band the full rate
            applies, so when you&rsquo;re negotiating near a threshold, the maths matters.
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
            <li>Off-the-plan stamp duty concessions where they apply (VIC notably).</li>
            <li>Concessional duty for older buyers / pensioners (varies by state).</li>
          </ul>
          <p>
            For a complete settlement-cost breakdown, a conveyancer is the
            right person to ask. <Link href="/find-an-expert?intent=buying">Get connected</Link>{" "}
            if you want a free intro to one.
          </p>
        </>
      }
    />
  );
}
