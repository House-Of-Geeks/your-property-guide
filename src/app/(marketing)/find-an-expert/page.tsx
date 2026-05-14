import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { MatchAgentEmbed, SpecialistShowcase, TrustStrip } from "@/components/journey";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Find your expert, agent, broker, or specialist | ${SITE_NAME}`,
  description:
    "Get connected with one vetted specialist for your property situation, agent, broker, accountant, conveyancer, whoever fits. Free for buyers and sellers, no commitment.",
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
      "A listing agent who actually knows your suburb, recent sales, what buyers are paying, the right campaign for your property. Not the agent who knocks on the door with a flyer; the one who's selling in your street.",
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
      "A mortgage broker compares 30+ lenders for you, not just one bank. They know which lender will say yes to your situation, what documents you need, and where the rate cut hides.",
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
      "Property situations don't always reduce to buy/sell/invest. We work with property accountants, conveyancers, family lawyers and estate planners, and we'll point you at the right one for your situation, not the closest one to a sale.",
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
    title: "We pick the right specialist",
    body:
      "One match, vetted for your suburb and your situation. Not three competing quotes, not a bidding war for your enquiry.",
  },
  {
    step: "03",
    title: "They reach out within one business day",
    body:
      "By phone or email, your choice. No commitment until you decide to take the next step.",
  },
];

export default function FindAnExpertPage() {
  return (
    <>
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
                Tell us your situation.{" "}
                <span className="italic font-light text-primary">We&rsquo;ll find</span>{" "}
                the right person.
              </h1>
              <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-2xl mb-10">
                Property situations are messier than buyer-or-seller. We match
                you with one vetted specialist for your situation, whether
                that&rsquo;s an agent, broker, accountant or conveyancer. Free
                for buyers and sellers, no commitment, no comparison spam.
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
                  { lead: "One match, not five.", body: "We pick the right specialist; you don't get five competing quotes." },
                  { lead: "One business day.", body: "They reach out by phone or email, your choice." },
                  { lead: "Free for buyers and sellers.", body: "Specialists pay us only when matched work goes ahead." },
                  { lead: "No data resale.", body: "We don't sell or trade your details." },
                ]}
              />
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/expert-match.svg"
                  alt=""
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
              Whichever bucket you&rsquo;re in, we&rsquo;ll find the right specialist for it.
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
            <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">Honest note</p>
            <p className="font-sans text-base text-ink-muted leading-relaxed">
              We&rsquo;re still building out our specialist network across all four lanes.
              Until your suburb has a vetted match, we&rsquo;ll personally read your enquiry and
              connect you with someone we&rsquo;d use ourselves, usually within one business day.
              No bots, no auto-routing.
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

      {/* Real specialists, honest social proof. Visitors who scroll past
          the form without engaging see actual people they could be matched
          with, not a faceless promise. Empty-safe: silently renders nothing
          if no agents are in the DB. */}
      <SpecialistShowcase />

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
            Buyers and sellers pay nothing. Specialists pay only for matches that turn into engaged work.
          </h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
            We disclose this on every match. We don&rsquo;t sell your data. We don&rsquo;t accept
            referral fees from anyone we wouldn&rsquo;t use ourselves.
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
