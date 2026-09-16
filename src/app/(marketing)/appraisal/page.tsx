import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { AppraisalForm } from "@/components/forms/AppraisalForm";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

// Form lives in the hero's right column (above the fold on desktop, second
// position on mobile after the headline) so visitors arrive on a page that
// renders the conversion action immediately. Previous layout buried the
// form below a 7xl headline + illustration which capped completion rates.

export const metadata: Metadata = {
  title: "Free Property Appraisal from a Local Agent | No Obligation",
  description: "Get a free property appraisal from a vetted agent who sells in your suburb: what an appraisal is, how it differs from a bank valuation or online estimate, what to have ready, and what happens after you ask. Reply within one business day.",
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
      "The inspection usually takes 20 to 40 minutes. Most agents give you a figure on the spot or within a day or two, often as a short written report with the comparable sales listed. Through Your Property Guide you hear from a matched agent within one business day of asking.",
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
                What is your home{" "}
                <span className="italic font-light text-primary">actually worth</span>?
              </h1>
              <p className="font-display font-light text-lg sm:text-xl text-ink leading-[1.3] max-w-xl mb-8">
                An honest appraisal from a vetted local agent. No call centre,
                no auto-routing, no commitment to list with them.
              </p>

              <div className="flex flex-col gap-3 font-sans text-sm text-ink-muted">
                {TRUST_POINTS.map((p) => (
                  <span key={p} className="inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cta shrink-0" aria-hidden="true" />
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-line bg-surface-raised shadow-card p-6 sm:p-8">
                <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-2">
                  Tell us about the property
                </p>
                <h2 className="font-display text-ink leading-tight tracking-tight text-xl sm:text-2xl mb-5">
                  Two minutes, then we take it from there.
                </h2>
                <Suspense fallback={<div className="h-96" aria-busy="true" />}>
                  <AppraisalForm />
                </Suspense>
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
                    It is not the same thing as a valuation. A valuation is a paid, formal report from a licensed valuer, prepared for a bank, a court or the tax office, and it tends to be conservative because it protects the lender. An online estimate is a third thing again: an automated guess from a model that has never seen your house, which can be close on a standard home in a busy suburb and badly wrong on anything unusual. When you are deciding whether to sell, the appraisal is the number that matters, because it comes from the people who watch buyers in your street every week.
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
                  <li>Our team reads your request and matches it to one agent who actually sells in your suburb. No call centre, no auto-routing, and your details are not sold to a panel.</li>
                  <li>The agent contacts you within one business day, by phone or email as you prefer, to arrange a time to see the property.</li>
                  <li>They inspect, usually in 20 to 40 minutes, and give you a figure or a range, most often as a short written appraisal with the comparable sales listed.</li>
                  <li>You decide what to do with it. Sell now, sell later, get a second appraisal, or file it away. There is no obligation at any step.</li>
                </ol>
                <p className="mt-4 font-sans text-sm text-ink-subtle leading-relaxed">
                  Timeframes above are typical as at September 2026 and depend on the agent&rsquo;s diary. Read how we{" "}
                  <Link href="/methodology" className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">
                    choose and vet agents
                  </Link>
                  .
                </p>
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
                  Coverage depends on having a vetted agent in your area. Where we do not yet have one, we tell you rather than pass your details on.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-warm p-6">
                <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-3">Before you ask</p>
                <ul className="space-y-2 font-sans text-sm text-ink-muted">
                  <li><Link href="/guides/how-much-is-my-house-worth-australia" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">How much is my house worth?</Link></li>
                  <li><Link href="/guides/how-to-prepare-for-a-property-appraisal" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">How to prepare for an appraisal</Link></li>
                  <li><Link href="/guides/questions-to-ask-a-real-estate-agent" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">Questions to ask the agent</Link></li>
                  <li><Link href="/real-estate-commission-calculator" className="text-ink hover:text-primary underline underline-offset-4 decoration-line-strong">What selling would cost</Link></li>
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
            Every appraisal request is read and matched personally by our team.
            We pick one local agent who actually sells in your area, no call
            centre, no auto-routing, no comparison spam. You&rsquo;ll hear from
            them within one business day.
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
