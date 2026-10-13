import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/guide";
import { MatchAgentEmbed } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading, StepTimeline } from "@/components/premium";

// The canonical matters here more than on most pages: every suburb and
// rental-market page links to this one with its own query string
// (?intent=…&suburb=…), and without a canonical each of those was a separate
// duplicate to a crawler (Search Console, "Duplicate without user-selected
// canonical", 29 Sep 2026).
//
// Title: the commercial intent review of 10 Oct 2026 (agents-appraisal 3.2)
// retitles the page for "find a real estate agent" (170 Google, 444 AI a
// month, positions 3 to 8 held by unrelated government pages). Worded to the
// promise that exists: one introduction, to an agent, free.
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/find-an-expert` },
  title: "Find a Real Estate Agent: One Free Local Introduction",
  description:
    "Selling? We introduce you to one local agent who sells in your area. Buying, or something else? Tell us your situation and we'll point you to the right next step. Free, no commitment.",
};

// Answer first, then the form (MatchAgent, compact, in the hero card). The
// promise is only what exists: sellers get one local agent (who pays us for
// the introduction); everyone else gets pointed to the right next step. No
// broker, accountant, conveyancer or lawyer matches, and no agent profiles
// (the agent directory is paused).

interface Lane {
  intent: string; // matches MatchAgent Intent ids
  label: string;
  headline: string;
  body: string;
  fits: string[];
  cta: string;
}

const LANES: Lane[] = [
  {
    intent: "selling",
    label: "Selling",
    headline: "When you want an appraisal or a real selling plan",
    body:
      "We introduce you to one local agent who sells in your area. If we don't have one yet, we'll tell you. You get an honest appraisal and a plan for your sale, with no obligation to list.",
    fits: [
      "You want an honest appraisal before you commit",
      "You're weighing private sale vs auction",
      "You're moving and need to plan the timing",
    ],
    cta: "Get help selling",
  },
  {
    intent: "buying",
    label: "Buying",
    headline: "When you're searching, inspecting, or about to bid",
    body:
      "Tell us where and when you're buying and we'll point you to the right next step: the guide chapter, the scheme or the calculator that fits your situation, before you inspect, bid or sign.",
    fits: [
      "You're comparing suburbs and shortlisting",
      "You're going to opens this weekend",
      "You've found the place and need to bid Saturday",
    ],
    cta: "Get help buying",
  },
  {
    intent: "refinancing",
    label: "Refinancing",
    headline: "When you need finance, pre-approval, or a better rate",
    body:
      "Tell us what you're trying to do with your loan and we'll point you to the right next step, starting with the calculators and guides that answer most finance questions.",
    fits: [
      "You want to know what you can borrow",
      "You need pre-approval before you bid",
      "Your rate hasn't been reviewed in over a year",
    ],
    cta: "Get help with finance",
  },
  {
    intent: "something-else",
    label: "Something else",
    headline: "Inheritance, divorce, downsizing, or planning ahead",
    body:
      "Property situations don't always reduce to buy/sell/invest. Tell us yours and we'll point you to the right next step, and if a sale is part of it, to one local agent who sells in your area.",
    fits: [
      "You've inherited a property and don't know where to start",
      "You're separating and need to deal with a shared property",
      "You're downsizing and want to plan the order of moves",
    ],
    cta: "Get help with something else",
  },
];

const HOW_IT_WORKS = [
  {
    title: "You tell us your situation",
    body: "Three quick questions: what you're working through, the suburb if you have one, and timing. Two minutes, no sign-up.",
  },
  {
    title: "We work out the right next step",
    body: "Selling: one local agent who sells in your area, not three competing quotes. If we don't have one yet, we'll tell you. Anything else: we point you to the right next step.",
  },
  {
    title: "We're in touch within one business day",
    body: "By phone or email, your choice. No commitment until you decide to take the next step.",
  },
];

// The page's own statements, as the questions people ask about them.
// Mirrored into FAQPage JSON-LD.
const FAQS = [
  {
    question: "How do I find a real estate agent to sell my house?",
    answer:
      "Tell us what you're selling and where, using the form on this page. Our team reads every enquiry and introduces you to one local agent who sells in your area, rather than a list of competing quotes. If we don't have an agent in your area yet, we tell you. Before you sign with anyone, compare agents on their recent sales in your suburb, the evidence behind their price, the full fee and the method of sale.",
  },
  {
    question: "What does it cost to be introduced to an agent?",
    answer:
      "Nothing for buyers and sellers. The agent pays us a fee for each introduction, whether or not you list with them. The fee comes out of the agent's pocket and doesn't change what you pay them: you agree any commission directly with the agent.",
  },
  {
    question: "Will my details be passed to other agents?",
    answer:
      "No. Your details go only to the one agent we introduce you to. We never sell them to anyone else.",
  },
  {
    question: "I'm buying, refinancing or dealing with something else. Can you help?",
    answer:
      "Tell us your situation and our team points you to the right next step: the guide chapter, the scheme or the calculator that fits. If a sale is part of it, we can introduce you to one local agent who sells in your area.",
  },
];

const AGENT_GUIDES: [string, string][] = [
  ["/guides/how-to-choose-a-selling-agent", "How to choose a real estate agent"],
  ["/guides/questions-to-ask-a-real-estate-agent", "Questions to ask a real estate agent"],
  ["/guides/real-estate-agent-fees-australia", "Real estate agent fees by state"],
  ["/real-estate-commission-calculator", "Commission calculator"],
  ["/appraisal", "Free property appraisal"],
  ["/selling-guide?from=find-an-expert", "The free guide to selling your property"],
  ["/buying-guide?from=find-an-expert", "The free guide to buying property"],
  ["/borrowing-power-calculator", "How much can I borrow?"],
];

const textLink = "font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink";

export default function FindAnExpertPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Find an expert", url: "/find-an-expert" }]} />
      <FAQPageJsonLd faqs={FAQS} />

      {/* Answer first, the form beside it (under it on phones), over a
          photo. The form card resets the hero's dark tone. */}
      <PhotoHero
        photo="kitchen"
        size="lg"
        breadcrumbs={[{ label: "Find an expert" }]}
        aside={
          <div className="tone-light rounded-xl border border-line bg-white p-5 sm:p-8 shadow-[0_12px_40px_-14px_rgb(22_25_29/0.22)] [&_#match]:scroll-mt-24">
            <Suspense fallback={<div className="h-80" aria-busy="true" />}>
              <MatchAgentEmbed compact />
            </Suspense>
          </div>
        }
      >
        <HeroTitle>Find a real estate agent who sells in your area</HeroTitle>
        {/* Phone-sized lede, as before: the form stays on the first screen. */}
        <HeroLead className="max-sm:mt-4 max-sm:text-base">
          Selling? Tell us where, and we introduce you to one local agent
          who sells in your area. If we don&rsquo;t have one yet,
          we&rsquo;ll tell you. The agent pays us for the introduction;
          you pay nothing and there&rsquo;s no obligation to list.
        </HeroLead>
        <p className="mt-4 text-sm sm:text-base text-ink-muted max-w-xl">
          Buying, refinancing or something messier? Use the same form and
          we&rsquo;ll point you to the right next step.
        </p>
        <ul className="hidden lg:block mt-10 space-y-2 text-base text-ink-muted border-t border-line pt-6 max-w-xl">
          <li><span className="font-semibold text-ink">One agent, not five.</span> Never a list.</li>
          <li><span className="font-semibold text-ink">One business day.</span> Our team is in touch by phone or email, your choice.</li>
          <li><span className="font-semibold text-ink">Never passed around.</span> Your details go only to the one agent we introduce you to.</li>
        </ul>
      </PhotoHero>

      {/* Four situations. Each link reopens the form above at that intent. */}
      <Band>
        <SectionHeading title={<>Whichever situation you&rsquo;re in</>} />
        <div className="mt-12 grid md:grid-cols-2 gap-x-16 border-t border-line">
          {LANES.map((lane) => (
            <div key={lane.intent} className="border-b border-line py-8">
              <p className="text-sm font-semibold text-ink-muted mb-2">{lane.label}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-ink leading-snug tracking-[-0.01em] mb-3">
                {lane.headline}
              </h3>
              <p className="text-base text-ink-muted leading-relaxed mb-3">{lane.body}</p>
              <ul className="mb-5 space-y-1 text-sm text-ink-muted list-disc pl-5 marker:text-ink-subtle">
                {lane.fits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={`/find-an-expert?intent=${lane.intent}#match`} className={`inline-flex items-center gap-1.5 text-sm ${textLink}`}>
                {lane.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </Band>

      {/* How it works and how we're paid, side by side, on charcoal. */}
      <Band tone="dark">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading title="How it works" />
            <StepTimeline steps={HOW_IT_WORKS} />
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-line lg:pl-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink leading-snug tracking-[-0.02em] mb-4">
              Buyers and sellers pay nothing. Agents pay us a fee for each introduction
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              We disclose this on every introduction. The fee comes out of the
              agent&rsquo;s pocket and doesn&rsquo;t change what you pay them.
              Your details go only to the one agent we introduce you to. We never
              sell them to anyone else, and we don&rsquo;t take fees from anyone
              we wouldn&rsquo;t use ourselves.
            </p>
            <Link href="/about" className={`mt-6 inline-flex items-center gap-1.5 text-sm ${textLink}`}>
              Who we are and how we&rsquo;re paid <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Band>

      {/* Questions, then the guides that help you choose. */}
      <Band>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading title="Questions people ask us" />
            <div className="mt-10 border-b border-line">
              <FaqAccordion items={FAQS} />
            </div>
          </div>
          <nav aria-label="Guides for choosing an agent" className="lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink leading-snug tracking-[-0.02em] mb-5">
              Choosing an agent yourself
            </h2>
            <ul className="border-t border-line">
              {AGENT_GUIDES.map(([href, label]) => (
                <li key={href} className="border-b border-line">
                  <Link href={href} className="group flex items-center justify-between gap-3 py-3.5 text-ink">
                    <span className="group-hover:underline underline-offset-4">{label}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Band>
    </>
  );
}
