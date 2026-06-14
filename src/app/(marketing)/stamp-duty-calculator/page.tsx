import type { Metadata } from "next";
import Link from "next/link";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Stamp Duty Calculator",
  description:
    "Estimate stamp duty across all eight Australian states and territories. Includes first home buyer concessions and foreign buyer surcharges. Updated for 2025/26 rates.",
  slug: "stamp-duty-calculator",
  schemaName: "Stamp Duty Calculator Australia",
  schemaDescription: "Calculate stamp duty costs across all Australian states and territories.",
  updatedAt: "2026-04-15",
  persona: "first-home",
};

// Stamp duty is a 74k/mo AU query — the highest-volume calculator query
// on the site. Title leans into year + state coverage to win the snippet.
const META_TITLE = "Stamp Duty Calculator 2026: All Australian States";
const META_DESCRIPTION = "Free stamp duty calculator for all eight Australian states and territories. Includes first home buyer concessions and foreign buyer surcharges, updated for 2025/26 rates. No sign-up.";

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
      "Most states offer concessions or full exemptions for first home buyers. Queensland offers a full concession up to $700,000, NSW up to $800,000, VIC up to $600,000, and WA up to $450,000. The ACT has an income-tested exemption scheme. SA does not offer a stamp duty concession but has a separate First Home Owner Grant.",
  },
  {
    question: "What is the foreign buyer surcharge?",
    answer:
      "Foreign buyers of residential property pay an additional surcharge on top of standard duty. Rates are: NSW 8%, VIC 8%, QLD 8%, WA 7%, SA 7%, TAS 8%. The NT and ACT do not charge a foreign buyer surcharge.",
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
      calculator={<StampDutyCalculator />}
      faqs={FAQS}
      related={RELATED}
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
            On a typical capital-city purchase it usually lands somewhere between
            $20,000 and $60,000 of unavoidable cash, before concessions.
          </p>

          <KeyFigure
            value="$20k–$60k+"
            label="What unconcessioned stamp duty typically costs on a capital-city purchase, before any first-home or owner-occupier discount."
            context="Estimate, varies by state and price"
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
            <li><strong>Whether you&rsquo;re a foreign buyer.</strong> A surcharge of 7% to 8% applies in most states on top of standard duty.</li>
          </ul>

          <h2>First home buyer concessions in plain English</h2>
          <p>
            For state-by-state detail, see our state-specific first home buyer
            guides:{" "}
            <Link href="/guides/first-home-buyer-nsw">NSW</Link>,{" "}
            <Link href="/guides/first-home-buyer-vic">VIC</Link>,{" "}
            <Link href="/guides/first-home-buyer-qld">QLD</Link>,{" "}
            <Link href="/guides/first-home-buyer-wa">WA</Link>.
          </p>
          <p>
            Each state has a price threshold below which duty is fully exempt or
            heavily reduced for eligible first home buyers, and usually a
            concessional band above that where duty scales back to the full rate.
            <strong> Even one dollar over the cap removes the concession entirely</strong>,
            so when you&rsquo;re negotiating near a threshold, the maths matters.
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
