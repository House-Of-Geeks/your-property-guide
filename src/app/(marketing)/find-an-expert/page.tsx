import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MatchAgentEmbed, TrustStrip } from "@/components/journey";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

// The canonical matters here more than on most pages: every suburb and
// rental-market page links to this one with its own query string
// (?intent=…&suburb=…), and without a canonical each of those was a separate
// duplicate to a crawler (Search Console, "Duplicate without user-selected
// canonical", 29 Sep 2026).
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/find-an-expert` },
  title: "Find an expert: help selling or buying your home",
  description:
    "Selling? We introduce you to one local agent who sells in your area. Buying, or something else? Tell us your situation and we'll point you to the right next step. Free, no commitment.",
};

// Editorial hub explaining how the match flow works. The actual lead engine
// lives at /#match (homepage MatchAgent). All CTAs on this page deep-link
// to it with the right intent pre-filled.
//
// The promise is only what exists: sellers get one local agent (who pays us
// for the introduction); everyone else gets pointed to the right next step.
// No broker, accountant, conveyancer or lawyer matches, and no agent profile
// emails (the agent directory is paused).

interface Lane {
  intent: string; // matches MatchAgent Intent ids
  eyebrow: string;
  headline: string;
  body: string;
  fits: string[];
  cta: string;
}

const LANES: Lane[] = [
  {
    intent: "buying",
    eyebrow: "Buying",
    headline: "When you're searching, inspecting, or about to bid.",
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
    intent: "selling",
    eyebrow: "Selling",
    headline: "When you want an appraisal or a real selling plan.",
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
    intent: "refinancing",
    eyebrow: "Refinancing",
    headline: "When you need finance, pre-approval, or a better rate.",
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
    eyebrow: "Something else",
    headline: "Inheritance, divorce, downsizing, or planning ahead.",
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
    step: "01",
    title: "You tell us your situation",
    body:
      "Three quick questions: what you're working through, the suburb if you have one, and timing. Two minutes, no sign-up.",
  },
  {
    step: "02",
    title: "We work out the right next step",
    body:
      "Selling: one local agent who sells in your area, not three competing quotes. If we don't have one yet, we'll tell you. Anything else: we point you to the right next step.",
  },
  {
    step: "03",
    title: "We're in touch within one business day",
    body:
      "By phone or email, your choice. No commitment until you decide to take the next step.",
  },
];

export default function FindAnExpertPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Find an expert", url: "/find-an-expert" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-sm font-semibold text-ink-muted leading-none">
                  How matching works
                </span>
                <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
                <span className="text-[13px] text-ink-subtle font-sans font-medium">
                  The match
                </span>
              </div>
              <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-8 font-bold">
                Tell us your situation.{" "}
                <span>We&rsquo;ll find</span>{" "}
                the right next step
              </h1>
              <p className="font-display font-normal text-xl sm:text-2xl text-ink leading-[1.25] max-w-2xl mb-10">
                Selling? We introduce you to one local agent who sells in your
                area. Buying, or something messier? We&rsquo;ll point you to the
                right next step. Free for buyers and sellers, no commitment, no
                comparison spam.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="#match"
                  className="inline-flex items-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors"
                >
                  Get connected <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-md border border-line-strong text-ink hover:border-ink font-medium px-6 py-3 transition-colors"
                >
                  Read our charter
                </Link>
              </div>
              <TrustStrip
                variant="rich"
                items={[
                  { lead: "One agent, not five.", body: "Selling? We introduce one local agent, never a list." },
                  { lead: "One business day.", body: "Our team is in touch by phone or email, your choice." },
                  { lead: "Free for buyers and sellers.", body: "The agent pays us a fee for each introduction." },
                  { lead: "Never passed around.", body: "Your details go only to the one agent we introduce you to. We never sell them to anyone else." },
                ]}
              />
            </div>

          </div>
        </div>
      </section>

      {/* Lanes, four situations */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-[13px] font-sans text-ink-subtle mb-3">
              Four situations, one engine
            </p>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
              Whichever bucket you&rsquo;re in, we&rsquo;ll point you to the right next step
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {LANES.map((lane) => (
              <div
                key={lane.intent}
                className="rounded-2xl border border-line bg-surface-raised p-8 flex flex-col"
              >
                <p className="text-[13px] font-sans text-ink-subtle mb-2">
                  {lane.eyebrow}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-4">
                  {lane.headline}
                </h3>
                <p className="font-sans text-base text-ink-muted leading-relaxed mb-6">{lane.body}</p>
                <p className="text-[13px] font-sans text-ink-subtle mb-3">
                  Good fit if:
                </p>
                <ul className="space-y-2 mb-8 flex-1">
                  {lane.fits.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink">
                      <Check className="w-4 h-4 text-cta shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/find-an-expert?intent=${lane.intent}#match`}
                  scroll={true}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors"
                >
                  {lane.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-line-warm bg-surface-warm p-8 max-w-3xl mx-auto text-center">
            <p className="text-[13px] font-sans text-ink-subtle mb-2">How matching works</p>
            <p className="font-sans text-base text-ink-muted leading-relaxed">
              Every enquiry is read personally by our team, no call centre, no
              auto-routing, no comparison spam. Sellers get one local agent who
              sells in their area; if we don&rsquo;t have one yet, we&rsquo;ll
              tell you. You&rsquo;ll hear from us within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded match engine, same component as the homepage. Lane
          buttons above push ?intent=... which re-keys this embed so the
          form opens at the right step. Placed here (immediately after the
          lanes) so a lane click on mobile lands the user right on the
          form rather than scrolling past two more sections of copy. */}
      <Suspense fallback={null}>
        <MatchAgentEmbed />
      </Suspense>

      {/* How matching works, sits below the form as supporting copy for
          anyone who scrolled past the form without engaging. The CTA here
          still anchors to #match (scrolls up to the form). */}
      <section className="py-16 bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-12 max-w-2xl">
            How matching works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step}>
                <p className="text-[13px] font-sans text-cta mb-3">{s.step}</p>
                <h3 className="font-display text-2xl text-ink leading-tight mb-3">{s.title}</h3>
                <p className="font-sans text-base text-ink-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="#match"
              className="inline-flex items-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors"
            >
              Get connected <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why we're free */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[13px] font-sans text-ink-subtle mb-3">Why we&rsquo;re free</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-6">
            Buyers and sellers pay nothing. Agents pay us a fee for each introduction
          </h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
            We disclose this on every introduction. The fee comes out of the
            agent&rsquo;s pocket and doesn&rsquo;t change what you pay them.
            Your details go only to the one agent we introduce you to. We never
            sell them to anyone else, and we don&rsquo;t take fees from anyone
            we wouldn&rsquo;t use ourselves.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-cta hover:text-cta-hover font-medium"
          >
            Read our charter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
