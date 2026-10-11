import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
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
  title: "Find your expert, agent, broker, or specialist",
  description:
    "Ask for one introduction to an agent, broker or other property specialist for your situation, where we have one in your area. Free for buyers and sellers, no commitment.",
};

// Editorial hub explaining how the match flow works. The actual lead engine
// lives at /#match (homepage MatchAgent). All CTAs on this page deep-link
// to it with the right intent pre-filled.

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
      "A buyer's agent works for you, not the seller. They know the suburb's real selling prices, run inspections on your behalf, vet the property, and handle the auction or negotiation.",
    fits: [
      "You're comparing suburbs and shortlisting",
      "You're going to opens this weekend",
      "You've found the place and need to bid Saturday",
    ],
    cta: "Get connected, buying",
  },
  {
    intent: "selling",
    eyebrow: "Selling",
    headline: "When you want an appraisal or a real selling plan.",
    body:
      "Look for a listing agent who knows your suburb: recent sales, what buyers are paying, the right campaign for your property. Not the agent who knocks on the door with a flyer; one who is selling in your street.",
    fits: [
      "You want an honest appraisal before you commit",
      "You're weighing private sale vs auction",
      "You're moving and need to plan the timing",
    ],
    cta: "Get connected, selling",
  },
  {
    intent: "refinancing",
    eyebrow: "Refinancing",
    headline: "When you need finance, pre-approval, or a better rate.",
    body:
      "A mortgage broker compares loans from a panel of lenders, not just one bank, and can tell you which lenders' policies fit your situation, what documents you need, and what an approval would depend on.",
    fits: [
      "You want to know what you can borrow",
      "You need pre-approval before you bid",
      "Your rate hasn't been reviewed in over a year",
    ],
    cta: "Get connected, refinancing",
  },
  {
    intent: "something-else",
    eyebrow: "Something else",
    headline: "Inheritance, divorce, downsizing, or planning ahead.",
    body:
      "Property situations don't always reduce to buy/sell/invest. Tell us what is going on: where we have a specialist who handles it, such as a property accountant, conveyancer, family lawyer or estate planner, we introduce one; where we don't, we tell you.",
    fits: [
      "You've inherited a property and don't know where to start",
      "You're separating and need to deal with a shared property",
      "You're downsizing and want to plan the order of moves",
    ],
    cta: "Get connected, something else",
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
    title: "We look for one specialist",
    body:
      "Where we have one who covers your area and your situation, we introduce them. Not three competing quotes, not a bidding war for your enquiry. Where we don't, we tell you.",
  },
  {
    step: "03",
    title: "They get in touch, or we tell you we can't help yet",
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
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-10">
                <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                  How matching works
                </span>
                <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                  The match
                </span>
              </div>
              <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-8 font-medium">
                Find a real estate agent, buyer&rsquo;s agent or broker.{" "}
                <span className="italic font-light text-primary">One introduction, free.</span>
              </h1>
              <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-2xl mb-10">
                Tell us what you are selling or buying and where. Where we have a
                licensed agent or specialist who works in your area, we introduce
                one; the specialist pays us a fee for the introduction and you pay
                nothing. No commitment, no comparison spam.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="#match"
                  className="inline-flex items-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors"
                >
                  Get connected <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong text-ink hover:border-ink font-medium px-6 py-3 transition-colors"
                >
                  Read our charter
                </Link>
              </div>
              <TrustStrip
                variant="rich"
                items={[
                  { lead: "One introduction, not five.", body: "Where we have a specialist for your area, you hear from one, not five competing quotes." },
                  { lead: "We tell you either way.", body: "Where we have no one for your area yet, we say so rather than pass your details on." },
                  { lead: "Free for buyers and sellers.", body: "The specialist pays us a fee for each introduction." },
                  { lead: "Never passed around.", body: "Your details go only to the specialist you're matched with. We never sell them to anyone else." },
                ]}
              />
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/expert-match.svg"
                  alt=""
                  aria-hidden="true"
                  width={320}
                  height={220}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lanes, four situations */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Four situations, one engine
            </p>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
              Whichever bucket you&rsquo;re in, here is who can help.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {LANES.map((lane) => (
              <div
                key={lane.intent}
                className="rounded-2xl border border-line bg-surface-raised p-8 flex flex-col"
              >
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">
                  {lane.eyebrow}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-4">
                  {lane.headline}
                </h3>
                <p className="font-sans text-base text-ink-muted leading-relaxed mb-6">{lane.body}</p>
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">
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
            <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">How matching works</p>
            <p className="font-sans text-base text-ink-muted leading-relaxed">
              Every enquiry is read by our team. Where we have a specialist for
              your situation in your area, we introduce one, no call centre, no
              comparison spam; where we don&rsquo;t, we tell you rather than pass
              your details on.
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
            How matching works.
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step}>
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-cta mb-3">{s.step}</p>
                <h3 className="font-display text-2xl text-ink leading-tight mb-3">{s.title}</h3>
                <p className="font-sans text-base text-ink-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="#match"
              className="inline-flex items-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors"
            >
              Get connected <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why we're free */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Why we&rsquo;re free</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-6">
            Buyers and sellers pay nothing. Specialists pay us a fee for each introduction.
          </h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
            We disclose this on every match. The fee comes out of the
            specialist&rsquo;s pocket and doesn&rsquo;t change what you pay them.
            Your details go only to the one specialist you&rsquo;re matched with.
            We never sell them to anyone else, and we don&rsquo;t take fees from
            anyone we wouldn&rsquo;t use ourselves.
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
