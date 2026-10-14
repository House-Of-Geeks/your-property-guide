import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { ProposalWorksheet } from "@/components/journeys/ProposalWorksheet";
import { BreadcrumbJsonLd, WebApplicationJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { buildPlan } from "@/lib/plans/engine";
import { FEE_DISCLOSURE, HOW_WE_ARE_PAID_HREF, WHAT_WE_DONT_DO } from "@/lib/service-model";

// /tools/agent-proposal-worksheet (Oct 2026): compare two or three selling
// agents' proposals in dollars at the same price. The maths is in
// src/lib/proposal-worksheet.ts; the interview checklist is the plan
// engine's own "choosing an agent" checklist, so the two can't disagree.

const PATH = "/tools/agent-proposal-worksheet";
const TITLE = "Compare real estate agent proposals: free worksheet";
const DESCRIPTION =
  "Compare up to three agents’ proposals side by side: each one’s total cost in dollars at the same price, what you’d keep, and what to ask before you sign.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { url: `${SITE_URL}${PATH}`, title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

// Printing: only the comparison. The site header, footer and anything fixed
// (the phone bar) are dropped for this page alone; the page's own bands carry
// print:hidden.
const PRINT_CSS = "@media print { header, footer, .fixed { display: none !important; } main { padding: 0 !important; } }";

const STATES = Object.keys(STATE_RATES) as StateCode[];

const LINK = "font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink";

export default function AgentProposalWorksheetPage() {
  // The engine's checklist and offer for a seller choosing an agent.
  const plan = buildPlan({ journey: "selling", state: null, timeframe: null, sellStage: "choosing-agent" });

  return (
    <>
      <style href="agent-proposal-worksheet-print" precedence="default">
        {PRINT_CSS}
      </style>
      <BreadcrumbJsonLd
        items={[
          { name: "Tools", url: "/tools" },
          { name: "Agent proposal worksheet", url: PATH },
        ]}
      />
      <WebApplicationJsonLd name="Agent proposal worksheet" description={DESCRIPTION} url={PATH} />

      <PhotoHero photo="paperwork" breadcrumbs={[{ label: "Tools", href: "/tools" }, { label: "Agent proposal worksheet" }]} className="print:hidden">
        <HeroTitle>Compare agents’ proposals side by side</HeroTitle>
        <HeroLead>
          {`Put each agent’s price estimate, commission, marketing and terms in one place. The worksheet costs every proposal in dollars at the same price, shows what you’d keep, and points out anything worth asking about before you sign.`}
        </HeroLead>
        <p className="mt-6 text-base text-ink-muted">{`Free, with no sign-up. Nothing you type is sent to us.`}</p>
      </PhotoHero>

      <Band spacing="compact" className="print:border-0">
        <ProposalWorksheet />
      </Band>

      <Band tone="quiet" spacing="compact" id="interview-checklist" className="print:hidden">
        <SectionHeading
          size="md"
          title={plan.checklist.title}
          intro="Ask every agent the same questions, and read the agency agreement before you sign it. The answers go straight into the worksheet."
        />
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {plan.checklist.groups.map((g) => (
            <div key={g.heading} className="border-t-2 border-ink pt-5">
              <h3 className="text-xl text-ink">{g.heading}</h3>
              <ul className="mt-4 space-y-3">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-3 text-base text-ink leading-relaxed">
                    <span className="mt-1.5 inline-block h-4 w-4 shrink-0 rounded border border-line-strong" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl text-ink">Questions to settle before you choose</h3>
            <ul className="mt-4 space-y-3">
              {plan.questions.map((q) => (
                <li key={q} className="border-l-2 border-line-strong pl-4 text-base text-ink leading-relaxed">
                  {q}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl text-ink">Read more before the interviews</h3>
            <ul className="mt-4 space-y-2.5 text-base">
              <li>
                <Link href="/guides/questions-to-ask-a-real-estate-agent" className={LINK}>Questions to ask a real estate agent</Link>
              </li>
              <li>
                <Link href="/guides/how-to-choose-a-selling-agent" className={LINK}>How to choose a selling agent</Link>
              </li>
              <li>
                <Link href="/guides/real-estate-agency-agreements-by-state" className={LINK}>Agency agreements by state</Link>
              </li>
              <li>
                <Link href="/guides/how-to-prepare-for-a-property-appraisal" className={LINK}>Preparing for an appraisal</Link>
              </li>
            </ul>
          </div>
        </div>
      </Band>

      <Band tone="dark" spacing="compact" id="one-more-proposal" className="print:hidden">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading size="md" title={plan.help.headline} />
            <p className="mt-5 text-lg text-ink-muted leading-relaxed">{plan.help.body}</p>
            <div className="mt-8">
              <Link href="/get-help?service=selling-agent&from=proposal-worksheet" className={`${BUTTON_PRIMARY} justify-center`}>
                Ask for an introduction <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4 text-base text-ink-muted leading-relaxed">
            <p className="border-t border-line pt-4">
              {FEE_DISCLOSURE}{" "}
              <Link href={HOW_WE_ARE_PAID_HREF} className="text-ink underline underline-offset-4">
                How we’re paid
              </Link>
            </p>
            <p className="border-t border-line pt-4">{WHAT_WE_DONT_DO[1]}</p>
          </div>
        </div>
      </Band>

      <Band spacing="compact" id="commission-guides" className="print:hidden">
        <SectionHeading
          size="md"
          title="Commission in your state"
          intro="Typical rates before GST, from our state guides. No state sets a rate, and every figure is negotiable."
        />
        <ul className="mt-10 grid grid-cols-1 gap-x-8 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {STATES.map((s) => (
            <li key={s} className="border-b border-line">
              <Link href={`/guides/real-estate-commission-${s.toLowerCase()}`} className="group flex items-start justify-between gap-3 py-4">
                <span className="min-w-0">
                  <span className="block font-semibold text-ink group-hover:underline underline-offset-4">Commission in {STATE_NAMES[s]}</span>
                  <span className="block mt-0.5 text-sm text-ink-muted">
                    {STATE_RATES[s].low}% to {STATE_RATES[s].high}%
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-base">
          <li>
            <Link href="/guides/how-to-negotiate-real-estate-agent-commission" className={LINK}>How to negotiate commission</Link>
          </li>
          <li>
            <Link href="/real-estate-commission-calculator" className={LINK}>Commission calculator</Link>
          </li>
          <li>
            <Link href="/selling-costs-calculator" className={LINK}>Selling costs calculator</Link>
          </li>
        </ul>
      </Band>
    </>
  );
}
