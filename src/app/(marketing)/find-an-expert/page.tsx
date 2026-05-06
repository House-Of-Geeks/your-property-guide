import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { TrustStrip } from "@/components/journey";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Find your expert, buyer's agent or mortgage broker | ${SITE_NAME}`,
  description: "Get matched with a vetted buyer's agent or mortgage broker. Free for buyers, agents only earn from us when you choose to work with them.",
};

// Phase 3 interim landing. Full multi-step forms ship in Phase 5 per brief §6.5.
// Until BA/broker partner records exist (project decision 2026-05-05), the
// "Get matched" buttons currently route to the existing /contact page ,
// leads queue to andy@theandylife.com + jos@profitgeeks.com.au for
// manual handoff.

const BUYERS_AGENT_GOOD = [
  "You’re comparing suburbs and shortlisting",
  "You’re going to opens this weekend",
  "You’ve found the place and need to bid Saturday",
];

const BROKER_GOOD = [
  "You want to know what you can borrow",
  "You need pre-approval before you bid",
  "You just settled and your rate hasn’t been reviewed",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "You tell us your situation",
    body: "Where you are, what you’re trying to do, and your timeline. Two minutes, one form.",
  },
  {
    step: "02",
    title: "We pick the right expert",
    body: "One specialist who knows your suburb and your stage. Not three competing quotes.",
  },
  {
    step: "03",
    title: "They reach out within one business day",
    body: "By phone or email, your choice. No commitment until you’re ready.",
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
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                Free expert match
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
                One expert. Vetted for you. <span className="italic text-primary">Free for buyers.</span>
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl mb-8">
                Tell us where you are in your journey. We&rsquo;ll match you with
                one specialist, a buyer&rsquo;s agent for the search, or a mortgage
                broker for the finance, who knows your suburb, your stage and
                your situation.
              </p>
              <TrustStrip
                variant="rich"
                items={[
                  { lead: "One match, not five.", body: "We pick the right specialist; you don't get five competing quotes." },
                  { lead: "One business day.", body: "They reach out by phone or email, your choice." },
                  { lead: "Free for buyers.", body: "Partners pay us only when matched work goes ahead." },
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

      {/* Two columns, BA + broker */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-line bg-surface-raised p-8 flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center mb-5">
                <img src="/images/icons/map.svg" alt="" width={28} height={28} className="w-7 h-7" aria-hidden="true" />
              </div>
              <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">Buyer&rsquo;s agent</p>
              <h2 className="text-2xl sm:text-3xl text-ink leading-tight mb-4">
                When you&rsquo;re searching, inspecting, or about to bid.
              </h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed mb-6">
                A buyer&rsquo;s agent works for you, not the seller. They know the suburb&rsquo;s real
                selling prices, run inspections on your behalf, vet the property, and handle the
                auction or negotiation.
              </p>
              <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Good fit if:</p>
              <ul className="space-y-2 mb-8 flex-1">
                {BUYERS_AGENT_GOOD.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink">
                    <Check className="w-4 h-4 text-cta shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?type=buyers-agent"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors"
              >
                Match me with a buyer&rsquo;s agent <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-line bg-surface-raised p-8 flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center mb-5">
                <img src="/images/icons/broker.svg" alt="" width={28} height={28} className="w-7 h-7" aria-hidden="true" />
              </div>
              <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">Mortgage broker</p>
              <h2 className="text-2xl sm:text-3xl text-ink leading-tight mb-4">
                When you need finance, pre-approval, or a refinance.
              </h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed mb-6">
                A mortgage broker compares 30+ lenders for you, not just one bank.
                They know which lender will say yes to your situation, what documents you need,
                and where the rate cut hides.
              </p>
              <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Good fit if:</p>
              <ul className="space-y-2 mb-8 flex-1">
                {BROKER_GOOD.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink">
                    <Check className="w-4 h-4 text-cta shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?type=mortgage-broker"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors"
              >
                Match me with a mortgage broker <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-line-warm bg-surface-warm p-8 max-w-3xl mx-auto text-center">
            <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">Honest note</p>
            <p className="font-sans text-base text-ink-muted leading-relaxed">
              We&rsquo;re still building out our buyer&rsquo;s-agent and mortgage-broker network.
              Until your suburb has a vetted match, we&rsquo;ll personally read your enquiry and
              connect you with someone we&rsquo;d use ourselves, usually within one business day.
              No bots, no auto-routing.
            </p>
          </div>
        </div>
      </section>

      {/* How matching works */}
      <section className="py-16 bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl text-ink leading-tight mb-12 max-w-2xl">
            How matching works.
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step}>
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-cta mb-3">{s.step}</p>
                <h3 className="text-2xl text-ink leading-tight mb-3">{s.title}</h3>
                <p className="font-sans text-base text-ink-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we're free */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Why we&rsquo;re free</p>
          <h2 className="text-3xl sm:text-4xl text-ink leading-tight mb-6">
            Buyers pay nothing. Agents pay only for matches that turn into engaged work.
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
