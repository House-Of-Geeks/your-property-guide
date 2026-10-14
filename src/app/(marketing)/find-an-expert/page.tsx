import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/guide";
import { IntroductionForm, type ServiceChoice } from "@/components/journeys/IntroductionForm";
import { HowIntroductionsWork } from "@/components/journeys/ServiceSections";
import { availabilityNote } from "@/lib/introductions/rules";
import { RESPONSE_WINDOW } from "@/lib/service-model";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

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
    "Selling? Ask us to introduce one participating agent who sells in your area. Buying? Ask about a buyer’s agent who acts only for you. Free, only with your permission, and we say up front if we can’t cover your area.",
};

// Answer first, then the introduction form (Oct 2026: the same form as
// /get-help, with its own permission box). The promise is only what exists:
// one participating selling agent, or a buyer's agent where we can (reviewed
// by hand; the network is still being built). No broker, accountant,
// conveyancer or lawyer matches, and no agent profiles (directory paused).

interface Lane {
  service: ServiceChoice | null;
  label: string;
  headline: string;
  body: string;
  fits: string[];
  cta: string;
  href: string;
}

const LANES: Lane[] = [
  {
    service: "selling-agent",
    label: "Selling",
    headline: "When you want an appraisal",
    body:
      "We introduce you to one participating agent who sells in your area, only with your permission. If we can’t cover your suburb, we tell you before you send anything. No obligation to list.",
    fits: [
      "You want an appraisal before you commit",
      "You’ve met agents and want one more proposal to compare",
      "You’re moving and need to plan the timing",
    ],
    cta: "Ask for a selling agent",
    href: "/find-an-expert?service=selling-agent#intro-form",
  },
  {
    service: "buyers-agent",
    label: "Buying",
    headline: "When you want someone on your side",
    body: `A buyer’s agent acts only for you and charges you a fee. ${availabilityNote("buyers-agent", null).text}`,
    fits: [
      "You’re buying somewhere you don’t know, or from interstate",
      "You’re short on time, or uncomfortable negotiating or bidding",
      "You want help judging price before you offer",
    ],
    cta: "Ask about a buyer’s agent",
    href: "/find-an-expert?service=buyers-agent#intro-form",
  },
  {
    service: "both",
    label: "Buying and selling",
    headline: "When you’re doing both at once",
    body:
      "Two separate introductions if you want them, each with its own yes: a selling agent for the sale and, where we can, a buyer’s agent for the purchase.",
    fits: [
      "You’re selling one home to buy the next",
      "You need the two settlements to line up",
      "You’re weighing a bridging loan",
    ],
    cta: "Ask for help with both",
    href: "/find-an-expert?service=both#intro-form",
  },
  {
    service: null,
    label: "Something else",
    headline: "Finance, inheritance, separation or planning ahead",
    body:
      "We don’t introduce brokers, accountants or lawyers. A next-step plan points you to the guides and calculators that fit, and if a sale is part of it, you can ask for a selling agent then.",
    fits: [
      "You want to know what you can borrow",
      "You’ve inherited a property and don’t know where to start",
      "You’re separating and need to deal with a shared property",
    ],
    cta: "Make a next-step plan",
    href: "/plan",
  },
];

// The page's own statements, as the questions people ask about them.
// Mirrored into FAQPage JSON-LD.
const FAQS = [
  {
    question: "How do I find a real estate agent to sell my house?",
    answer:
      "Tell us what you're selling and where, using the form on this page, and tick the permission box. If a participating agent covers your suburb, we pass your request to that one agent, rather than a list of competing quotes. If we can't cover your area, we tell you. Before you sign with anyone, compare agents on their recent sales in your suburb, the evidence behind their price, the full fee and the method of sale.",
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
      "Buying: you can ask about a buyer's agent; we're still building that network, so our team reviews each request and tells you honestly whether we can introduce someone. Finance or something else: we don't introduce brokers, accountants or lawyers, but a next-step plan points you to the guides and calculators that fit.",
  },
];

const AGENT_GUIDES: [string, string][] = [
  ["/guides/how-to-choose-a-selling-agent", "How to choose a real estate agent"],
  ["/guides/questions-to-ask-a-real-estate-agent", "Questions to ask a real estate agent"],
  ["/guides/real-estate-agent-fees-australia", "Real estate agent fees by state"],
  ["/real-estate-commission-calculator", "Commission calculator"],
  ["/tools/agent-proposal-worksheet", "Agent proposal worksheet"],
  ["/selling-guide?from=find-an-expert", "The free guide to selling your property"],
  ["/buying-guide?from=find-an-expert", "The free guide to buying property"],
  ["/borrowing-power-calculator", "How much can I borrow?"],
];

const textLink = "font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink";

const SERVICE_PARAM: Record<string, ServiceChoice> = {
  "selling-agent": "selling-agent",
  "buyers-agent": "buyers-agent",
  both: "both",
  // ?intent= from older links (suburb and rental pages).
  selling: "selling-agent",
  buying: "buyers-agent",
};

export default async function FindAnExpertPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = typeof sp.service === "string" ? sp.service : typeof sp.intent === "string" ? sp.intent : "";
  const service: ServiceChoice | null = SERVICE_PARAM[raw] ?? null;
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
          <div id="intro-form" className="scroll-mt-24">
            <Suspense fallback={<div className="h-80" aria-busy="true" />}>
              <IntroductionForm defaultService={service} source="find-an-expert" compact />
            </Suspense>
          </div>
        }
      >
        <HeroTitle>Find a real estate agent who sells in your area</HeroTitle>
        {/* Phone-sized lede, as before: the form stays on the first screen. */}
        <HeroLead className="max-sm:mt-4 max-sm:text-base">
          Selling? Ask us to introduce one participating agent who sells in
          your area. If we can&rsquo;t cover your suburb, we tell you before
          you send anything. The agent pays us for the introduction; you pay
          nothing and there&rsquo;s no obligation to list.
        </HeroLead>
        <p className="mt-4 text-sm sm:text-base text-ink-muted max-w-xl">
          Buying? You can ask about a buyer&rsquo;s agent too. Something
          else? A next-step plan is the better start.
        </p>
        <ul className="hidden lg:block mt-10 space-y-2 text-base text-ink-muted border-t border-line pt-6 max-w-xl">
          <li><span className="font-semibold text-ink">One agent, not five.</span> Never a list.</li>
          <li><span className="font-semibold text-ink">Your choice of contact.</span> Phone, text or email, normally {RESPONSE_WINDOW}.</li>
          <li><span className="font-semibold text-ink">Never passed around.</span> Your details go only to the one agent we introduce you to.</li>
        </ul>
      </PhotoHero>

      {/* Four situations. Each link reopens the form above at that intent. */}
      <Band>
        <SectionHeading title={<>Whichever situation you&rsquo;re in</>} />
        <div className="mt-12 grid md:grid-cols-2 gap-x-16 border-t border-line">
          {LANES.map((lane) => (
            <div key={lane.label} className="border-b border-line py-8">
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
              <Link href={lane.href} className={`inline-flex items-center gap-1.5 text-sm ${textLink}`}>
                {lane.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </Band>

      {/* How introductions work and how we're paid (the shared service model). */}
      <HowIntroductionsWork tone="dark" />

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
