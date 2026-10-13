import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { FaqAccordion } from "@/components/guide";
import { AppraisalForm } from "@/components/forms/AppraisalForm";
import { SuburbValueRange } from "@/components/journey/SuburbValueRange";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero, PhotoPanel, SectionHeading } from "@/components/premium";

// The form is the page. Phones: headline, one line, then the form on the
// first screen; the trust points and the instant price range follow it and,
// once a suburb is picked, the range fills the form's suburb and property
// type (?suburb=&type=, see src/lib/appraisal-prefill.ts). Desktop: headline
// and trust points on the left of the photo hero, the form on the right; the
// range opens the band under the hero.

export const metadata: Metadata = {
  title: "Free Property Appraisal from a Local Agent | No Obligation",
  description: "Get a free property appraisal from a vetted agent who sells in your suburb: what an appraisal is, how it differs from a bank valuation or online estimate, what to have ready, and what happens after you ask.",
  alternates: { canonical: `${SITE_URL}/appraisal` },
  openGraph: { url: `${SITE_URL}/appraisal`, title: "Free Property Appraisal from a Local Agent | No Obligation", description: "Request a free property appraisal from a vetted local real estate agent.", type: "website" },
  twitter: { card: "summary_large_image" },
};

const TRUST_POINTS = [
  "Vetted local agent, not a call centre",
  "Honest comparable-sales evidence",
  "Response within one business day",
];

// Valuation plan item 5. The page was a form with no indexable content:
// seven impressions in the site's whole history against ~9,200 searches a
// month for "property appraisal" and its variants. The copy below answers
// those searches in plain English and is mirrored into FAQPage JSON-LD.
// Every figure carries an "as at" date; nothing recommends.
const APPRAISAL_FAQS: { question: string; answer: string }[] = [
  {
    question: "What is a property appraisal?",
    answer:
      "A property appraisal is a real estate agent's estimate of what your home would sell for in the current market. The agent inspects the property, compares it with recent sales of similar homes nearby, and gives you a price or a price range. It is free, it is not a formal valuation, and it does not commit you to selling or to listing with that agent.",
  },
  {
    question: "Is a property appraisal free?",
    answer:
      "Yes. Agents provide appraisals free of charge because it is how they meet sellers before a listing decision. A formal valuation by a licensed valuer is different: that is a paid report, typically $300 to $800 as at September 2026, used for lending, legal or tax purposes.",
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
];

const STATES: { name: string; note: string }[] = [
  { name: "New South Wales", note: "Sydney, Newcastle, Wollongong, Central Coast and regional NSW" },
  { name: "Victoria", note: "Melbourne, Geelong, Ballarat, Bendigo and regional Victoria" },
  { name: "Queensland", note: "Brisbane, Gold Coast, Sunshine Coast, Toowoomba, Townsville, Cairns" },
  { name: "Western Australia", note: "Perth, Mandurah, Bunbury and the South West" },
  { name: "South Australia", note: "Adelaide and the Adelaide Hills, Fleurieu and Barossa" },
  { name: "Tasmania, ACT and NT", note: "Hobart, Launceston, Canberra and Darwin" },
];

// Under the form on phones, under the lede on desktop: set once, placed per
// breakpoint so each layout keeps its order.
function TrustPoints() {
  return (
    <ul className="flex flex-col gap-2 text-sm text-ink-muted">
      {TRUST_POINTS.map((p) => (
        <li key={p} className="inline-flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
          {p}
        </li>
      ))}
    </ul>
  );
}

export default function AppraisalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Free Appraisal", url: "/appraisal" }]} />
      <FAQPageJsonLd faqs={APPRAISAL_FAQS} />

      <PhotoHero
        photo="selling"
        size="lg"
        breadcrumbs={[{ label: "Free Appraisal" }]}
        aside={
          <>
            <div id="appraisal-form" className="tone-light scroll-mt-24 rounded-xl border border-line bg-white p-5 sm:p-8 shadow-[0_12px_40px_-14px_rgb(22_25_29/0.22)]">
              <h2 className="font-display text-ink tracking-[-0.02em] text-xl sm:text-2xl font-bold leading-tight mb-1">
                Two minutes, then we take it from there
              </h2>
              <p className="text-sm text-ink-muted mb-5">Tell us about the property.</p>
              <Suspense fallback={<div className="h-96" aria-busy="true" />}>
                <AppraisalForm />
              </Suspense>
            </div>
            <div className="lg:hidden mt-8">
              <TrustPoints />
            </div>
          </>
        }
      >
        <HeroTitle>Free property appraisal from a local agent</HeroTitle>
        {/* Phone-sized lede, as before: the form stays on the first screen. */}
        <HeroLead className="max-sm:mt-4 max-sm:text-base">
          An honest appraisal from a vetted local agent. No call centre,
          no auto-routing, no commitment to list with them.
        </HeroLead>
        <a
          href="#value-range"
          className="mt-4 inline-block text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          Want a price range first? See what homes sell for in your suburb
        </a>
        <div className="hidden lg:block mt-10">
          <TrustPoints />
        </div>
      </PhotoHero>

      {/* Commercial intent review 3.4 (30 Sep 2026): the SERPs for
          "property valuation" and "how much is my house worth" put
          instant estimates first and the agent appraisal second.
          The suburb's published median for the dwelling type and a
          band either side of it, from the state sales feed. Never a
          figure the published-medians rule withholds, never a
          valuation of the visitor's home. */}
      <Band tone="quiet" spacing="compact" id="value-range" className="scroll-mt-16">
        <div className="max-w-3xl">
          <SuburbValueRange after="link" appraisalHref="#appraisal-form" headingLevel="h2" />
        </div>
      </Band>

      {/* What an appraisal is, and what happens next. Indexable copy that
          the form-only page lacked; see APPRAISAL_FAQS for the questions. */}
      <Band>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 space-y-14">
            <div>
              <SectionHeading title="What a property appraisal actually is" />
              <div className="mt-8 space-y-4 text-base sm:text-lg text-ink-muted leading-[1.65]">
                <p>
                  A property appraisal is a local real estate agent&rsquo;s honest estimate of what your home would sell for today. The agent walks through the property, looks at what similar homes nearby have sold for in the last few months, and gives you a figure or a range. It is free, it takes under an hour, and it does not commit you to selling, or to selling with that agent.
                </p>
                <p>
                  It is not the same thing as a valuation. A valuation is a paid, formal report from a licensed valuer, prepared for a bank, a court or the tax office, and it tends to be conservative because it protects the lender. An online estimate is a third thing again: an automated guess from a model that has never seen your house, which can be close on a standard home in a busy suburb and badly wrong on anything unusual. When you are deciding whether to sell, the appraisal is the number that matters, because it comes from the people who watch buyers in your street every week. The three are compared, with what a valuation costs and when a lender insists on one, in{" "}
                  <Link href="/property-valuation" className="text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">appraisal vs valuation vs online estimate</Link>.
                </p>
                <p>
                  One appraisal is a data point. Two or three, from agents who genuinely sell in your suburb, are a picture. Ask each to show you the comparable sales behind their figure and to explain how your home differs from each one. An agent who cannot do that is guessing, and an agent whose number is far above the others may be buying your listing rather than pricing your home.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-ink tracking-[-0.02em] text-2xl sm:text-3xl leading-tight font-bold mb-4">
                What to have ready
              </h2>
              <ul className="space-y-2.5 text-base text-ink-muted leading-relaxed">
                {[
                  "Your rates notice or title details, so the land size and lot are correct.",
                  "A rough list of improvements with dates: kitchen, bathroom, roof, solar, extension.",
                  "Anything the agent cannot see: a council approval, a body corporate levy, an easement, a known defect.",
                  "Your timeframe, even if it is \"not for a year\". It changes the advice, not the figure.",
                  "The comparable sales you already know about. Good agents will add to your list, not argue with it.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-ink" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-ink tracking-[-0.02em] text-2xl sm:text-3xl leading-tight font-bold mb-4">
                What happens after you ask
              </h2>
              <ol className="space-y-3 text-base text-ink-muted leading-relaxed list-decimal pl-5 marker:text-ink-subtle">
                <li>Our team calls you within one business day and introduces you to one local agent who sells in your area. If we don&rsquo;t have one yet, we&rsquo;ll tell you.</li>
                <li>The agent arranges a time to see the property, by phone or email as you prefer.</li>
                <li>They inspect and give you a figure or a range, most often as a short written appraisal with the comparable sales listed.</li>
                <li>You decide what to do with it. Sell now, sell later, get a second appraisal, or file it away. There is no obligation at any step.</li>
              </ol>
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                Every request is read by our team. The agent we introduce you to pays us a fee for the introduction, whether or not you list with them. You pay nothing, and your details go to no one else.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5 space-y-5">
            <PhotoPanel photo="kitchen" alt="Two people at a kitchen bench going over paperwork" className="aspect-[4/3]" />
            <div className="rounded-xl border border-line p-5 sm:p-6">
              <h2 className="font-display text-lg font-bold text-ink leading-tight mb-4">Appraisals across Australia</h2>
              <dl className="space-y-3">
                {STATES.map((st) => (
                  <div key={st.name}>
                    <dt className="text-sm font-semibold text-ink">{st.name}</dt>
                    <dd className="text-sm text-ink-muted">{st.note}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-ink-subtle leading-relaxed">
                Coverage depends on having a vetted agent in your area. Where we do not yet have one, we tell you rather than pass your details on.
              </p>
            </div>
            <div className="rounded-xl border border-line p-5 sm:p-6">
              <h2 className="font-display text-lg font-bold text-ink leading-tight mb-3">Before you ask</h2>
              <ul className="divide-y divide-line text-sm">
                {[
                  ["/guides/how-much-is-my-house-worth-australia", "How much is my house worth?"],
                  ["/property-valuation", "Appraisal vs valuation vs online estimate"],
                  ["/guides/how-to-prepare-for-a-property-appraisal", "How to prepare for an appraisal"],
                  ["/guides/questions-to-ask-a-real-estate-agent", "Questions to ask the agent"],
                  ["/real-estate-commission-calculator", "What selling would cost"],
                  ["/guides/bridging-loans-guide", "Buying before you sell: how bridging loans work"],
                  ["/bridging-loan-calculator", "Bridging loan calculator"],
                  ["/selling-guide?from=appraisal", "Not ready yet? The free guide to selling your property"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="group flex items-start justify-between gap-3 py-2.5 text-ink hover:underline underline-offset-4">
                      <span>{label}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Band>

      {/* Visible FAQ backing the FAQPage schema. Answers stay in the HTML
          inside <details>. */}
      <Band tone="quiet">
        <div className="max-w-3xl">
          <SectionHeading title="Property appraisal questions" />
          <div className="mt-10 border-b border-line">
            <FaqAccordion items={APPRAISAL_FAQS} />
          </div>
          <a href="#appraisal-form" className={`mt-12 ${BUTTON_PRIMARY} justify-center`}>
            Get my free appraisal
          </a>
        </div>
      </Band>
    </>
  );
}
