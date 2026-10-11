import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { AppraisalForm } from "@/components/forms/AppraisalForm";
import { SuburbValueRange } from "@/components/journey/SuburbValueRange";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { COVERAGE_CAVEAT } from "@/lib/match-coverage";
import { AUSSIE_GUIDE, CAV_PROPERTY_PRICES, NSW_AGENCY_AGREEMENTS, cite, valuationCostCited } from "@/lib/data/appraisal-sources";

// Form lives in the hero's right column (above the fold on desktop, second
// position on mobile after the headline) so visitors arrive on a page that
// renders the conversion action immediately. Previous layout buried the
// form below a 7xl headline + illustration which capped completion rates.

export const metadata: Metadata = {
  title: "Free Property Appraisal from a Local Agent | No Obligation",
  description: "Ask a local agent for a free property appraisal: what an appraisal is, how it differs from a bank valuation or online estimate, what to have ready, and what happens next.",
  alternates: { canonical: `${SITE_URL}/appraisal` },
  openGraph: { url: `${SITE_URL}/appraisal`, title: "Free Property Appraisal from a Local Agent | No Obligation", description: "Ask a local real estate agent for a free property appraisal, with no commitment to list.", type: "website" },
  twitter: { card: "summary_large_image" },
};

// F4 (10 Oct 2026): no speed or match promise the network cannot back.
const TRUST_POINTS = [
  "One local agent, not a call centre or a panel",
  "Ask for the comparable sales behind the figure",
  "No commitment to list, with them or anyone",
];

// Valuation plan item 5. The page was a form with no indexable content:
// seven impressions in the site's whole history against ~9,200 searches a
// month for "property appraisal" and its variants. The copy below answers
// those searches in plain English and is mirrored into FAQPage JSON-LD.
// Every figure carries an "as at" date; nothing recommends.
// Section 3.7 and 6 of the 10 Oct 2026 review add the market value and red
// flag questions; the valuation cost renders from appraisal-sources.ts.
const APPRAISAL_FAQS: { question: string; answer: string }[] = [
  {
    question: "What is a property appraisal?",
    answer:
      "A property appraisal is a real estate agent's estimate of what your home would sell for in the current market. The agent inspects the property, compares it with recent sales of similar homes nearby, and gives you a price or a price range. It is free, it is not a formal valuation, and it does not commit you to selling or to listing with that agent.",
  },
  {
    question: "Is a property appraisal free?",
    answer:
      `Yes. Agents commonly appraise a home at no cost when you are thinking of selling (${cite(AUSSIE_GUIDE, "Aussie")}): it is how they meet sellers before a listing decision. A formal valuation by a licensed valuer is different: a paid report, typically ${valuationCostCited()}, used for lending, legal or tax purposes.`,
  },
  {
    question: "What is the difference between an appraisal and a valuation?",
    answer:
      "An appraisal is an agent's market opinion of what a buyer would pay today, and it is free. A valuation is a licensed valuer's formal, defensible figure prepared for a bank, a court or the tax office, and it is paid for. Bank valuations are usually conservative because they protect the lender; appraisals reflect what the agent expects to achieve.",
  },
  {
    question: "How accurate is a property appraisal?",
    answer:
      "An appraisal is only as good as the comparable sales behind it. Ask the agent to show you the three or four recent sales they based the figure on and how your home differs from each. Two or three appraisals from agents who actually sell in your suburb, compared side by side, give a far better picture than one.",
  },
  {
    question: "How long does a property appraisal take?",
    answer:
      "The inspection usually takes 20 to 40 minutes. Most agents give you a figure on the spot or within a day or two, often as a short written report with the comparable sales listed.",
  },
  {
    question: "Do I have to sell if I get an appraisal?",
    answer:
      "No. An appraisal is information, not a commitment. Many owners get one to check where they stand, to plan a move a year out, or to compare with an online estimate. You are under no obligation to list, and not obliged to list with the agent who appraised your home.",
  },
  {
    question: "How do I find the market value of a property?",
    answer:
      "Start with sold prices for similar homes nearby, then the suburb's published median (the range block on this page shows it with its source and period), then two or three agent appraisals backed by comparable sales. Where the three point the same way, you have a market value range. Where a lender or a court has to rely on the figure, a licensed valuer's report is the one that counts.",
  },
  {
    question: "What is a red flag on an appraisal?",
    answer: `A figure with no comparable sales behind it, or one far above every other agent's. The rules expect evidence: in Victoria the agent's estimated selling price must be reasonable and based on research into comparable properties, and the Property Price Statement buyers see must give a price or a range of up to 10%, the three most comparable sales and the suburb median (${cite(CAV_PROPERTY_PRICES, "Consumer Affairs Victoria")}). In NSW the agency agreement must state the estimate, and a range cannot have its top more than 10% above its bottom (${cite(NSW_AGENCY_AGREEMENTS, "NSW Government, Agency agreements")}).`,
  },
];

const STATES: { name: string; note: string }[] = [
  { name: "New South Wales", note: "Sydney, Newcastle, Wollongong, Central Coast and regional NSW" },
  { name: "Victoria", note: "Melbourne, Geelong, Ballarat, Bendigo and regional Victoria" },
  { name: "Queensland", note: "Brisbane, Gold Coast, Sunshine Coast, Toowoomba, Townsville, Cairns" },
  { name: "Western Australia", note: "Perth, Mandurah, Bunbury and the South West" },
  { name: "South Australia", note: "Adelaide and the Adelaide Hills, Fleurieu and Barossa" },
  { name: "Tasmania, ACT and NT", note: "Hobart, Launceston, Canberra and Darwin" },
];

export default function AppraisalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Free Appraisal", url: "/appraisal" }]} />
      <FAQPageJsonLd faqs={APPRAISAL_FAQS} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        {/* The Queenslander artwork anchors the appraisal ask: this is
            about your home. Washed back so the form stays the hero. */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/art/queenslander.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right-bottom opacity-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-warm from-30% via-surface-warm/85 via-60% to-surface-warm/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-warm from-12% via-surface-warm/55 via-45% to-surface-warm/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Free Appraisal" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                  Free, no obligation
                </span>
                <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                  Property appraisal
                </span>
              </div>
              <h1 className="font-display text-ink leading-[1.02] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 font-medium">
                Free property appraisal{" "}
                <span className="italic font-light text-primary">from a local agent</span>
              </h1>
              <p className="font-display font-light text-lg sm:text-xl text-ink leading-[1.3] max-w-xl mb-8">
                Ask one local agent for a figure on your home, backed by
                comparable sales. No call centre, no commitment to list with them.
              </p>

              <div className="flex flex-col gap-3 font-sans text-sm text-ink-muted">
                {TRUST_POINTS.map((p) => (
                  <span key={p} className="inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cta shrink-0" aria-hidden="true" />
                    {p}
                  </span>
                ))}
              </div>

              {/* Commercial intent review 3.4 (30 Sep 2026): the SERPs for
                  "property valuation" and "how much is my house worth" put
                  instant estimates first and the agent appraisal second.
                  Before the form, the suburb's published median for the
                  dwelling type and a band either side of it, from the state
                  sales feed. Never a figure the published-medians rule
                  withholds, never a valuation of the visitor's home. */}
              <div className="mt-8">
                <SuburbValueRange after="link" appraisalHref="#appraisal-form" headingLevel="h2" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div id="appraisal-form" className="scroll-mt-24 rounded-2xl border border-line bg-surface-raised shadow-card p-6 sm:p-8">
                <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-2">
                  Tell us about the property
                </p>
                <h2 className="font-display text-ink leading-tight tracking-tight text-xl sm:text-2xl mb-5">
                  Two minutes, then we take it from there.
                </h2>
                <Suspense fallback={<div className="h-96" aria-busy="true" />}>
                  <AppraisalForm />
                </Suspense>
                <p className="mt-4 font-sans text-xs text-ink-subtle leading-relaxed">{COVERAGE_CAVEAT}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust note */}
      {/* What an appraisal is, and what happens next. Indexable copy that
          the form-only page lacked; see APPRAISAL_FAQS for the questions. */}
      <section className="bg-surface-raised border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <p className="font-display italic text-primary text-base mb-3 leading-none">In plain English</p>
                <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
                  What a property appraisal actually is.
                </h2>
                <div className="space-y-4 font-sans text-base sm:text-lg text-ink-muted leading-[1.7]">
                  <p>
                    A property appraisal is a local real estate agent&rsquo;s honest estimate of what your home would sell for today. The agent walks through the property, looks at what similar homes nearby have sold for in the last few months, and gives you a figure or a range. It is free, it takes under an hour, and it does not commit you to selling, or to selling with that agent.
                  </p>
                  <p>
                    It is not the same thing as a valuation. A valuation is a paid, formal report from a licensed valuer, prepared for a bank, a court or the tax office, and it tends to be conservative because it protects the lender. An online estimate is a third thing again: an automated guess from a model that has never seen your house, which can be close on a standard home in a busy suburb and badly wrong on anything unusual. When you are deciding whether to sell, the appraisal is the number that matters, because it comes from the people who watch buyers in your street every week. The three are compared, with what a valuation costs and when a lender insists on one, in{" "}
                    <Link href="/property-valuation" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">appraisal vs valuation vs online estimate</Link>.
                  </p>
                  <p>
                    One appraisal is a data point. Two or three, from agents who genuinely sell in your suburb, are a picture. Ask each to show you the comparable sales behind their figure and to explain how your home differs from each one. An agent who cannot do that is guessing, and an agent whose number is far above the others may be buying your listing rather than pricing your home.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-4">
                  What to have ready.
                </h2>
                <ul className="space-y-2.5 font-sans text-base text-ink-muted leading-relaxed">
                  {[
                    "Your rates notice or title details, so the land size and lot are correct.",
                    "A rough list of improvements with dates: kitchen, bathroom, roof, solar, extension.",
                    "Anything the agent cannot see: a council approval, a body corporate levy, an easement, a known defect.",
                    "Your timeframe, even if it is \"not for a year\". It changes the advice, not the figure.",
                    "The comparable sales you already know about. Good agents will add to your list, not argue with it.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-cta" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-4">
                  What happens after you ask.
                </h2>
                <ol className="space-y-3 font-sans text-base text-ink-muted leading-relaxed list-decimal pl-5">
                  <li>We look for an agent who sells in your suburb. Where we do not yet have one, we tell you rather than pass your details on.</li>
                  <li>The agent contacts you, by phone or email as you prefer, to arrange a time to see the property.</li>
                  <li>They inspect and give you a figure or a range, most often as a short written appraisal with the comparable sales listed.</li>
                  <li>You decide what to do with it. Sell now, sell later, get a second appraisal, or file it away. There is no obligation at any step.</li>
                </ol>
              </div>
            </div>

            <aside className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-line bg-surface-warm p-6">
                <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-3">Where we can help</p>
                <h2 className="font-display text-xl text-ink leading-tight mb-4">Appraisals across Australia.</h2>
                <dl className="space-y-3">
                  {STATES.map((st) => (
                    <div key={st.name}>
                      <dt className="font-sans text-sm font-medium text-ink">{st.name}</dt>
                      <dd className="font-sans text-sm text-ink-muted">{st.note}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 font-sans text-xs text-ink-subtle leading-relaxed">
                  {COVERAGE_CAVEAT}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-warm p-6">
                <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-3">Before you ask</p>
                <ul className="space-y-2 font-sans text-sm text-ink-muted">
                  <li><Link href="/guides/how-much-is-my-house-worth-australia" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">How much is my house worth?</Link></li>
                  <li><Link href="/property-valuation" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">Appraisal vs valuation vs online estimate</Link></li>
                  <li><Link href="/guides/how-to-prepare-for-a-property-appraisal" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">How to prepare for an appraisal</Link></li>
                  <li><Link href="/guides/questions-to-ask-a-real-estate-agent" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">Questions to ask the agent</Link></li>
                  <li><Link href="/real-estate-commission-calculator" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">What selling would cost</Link></li>
                  <li><Link href="/guides/bridging-loans-guide" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">Buying before you sell: how bridging loans work</Link></li>
                  <li><Link href="/bridging-loan-calculator" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">Bridging loan calculator</Link></li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Visible FAQ backing the FAQPage schema */}
          <div className="mt-14">
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
              Property appraisal questions.
            </h2>
            <dl className="divide-y divide-line border-y border-line">
              {APPRAISAL_FAQS.map((faq) => (
                <div key={faq.question} className="py-5">
                  <dt className="font-display text-lg text-ink leading-snug mb-2">{faq.question}</dt>
                  <dd className="font-sans text-base text-ink-muted leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">
            How matching works
          </p>
          <p className="font-sans text-base text-ink-muted leading-relaxed">
            Every appraisal request is read by our team. Where we have an agent
            who sells in your area, we introduce one, not a panel and not a call
            centre; where we do not yet have one, we tell you rather than pass
            your details on. That agent pays us a fee for the introduction,
            whether or not you list with them. You pay nothing, and your details
            go to no one else.
          </p>
          <p className="mt-5 font-sans text-sm text-ink-muted">
            Not ready for an appraisal yet? Start with the{" "}
            <a href="/selling-guide" className="text-ink underline decoration-line-strong underline-offset-2 hover:text-primary transition-colors">
              free guide to selling your property
            </a>
            , personalised to your suburb.
          </p>
        </div>
      </section>
    </>
  );
}
