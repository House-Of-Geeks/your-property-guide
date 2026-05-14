import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { LatestGuides } from "@/components/home/LatestGuides";
import { CapitalCityOutlook } from "@/components/home/CapitalCityOutlook";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { MatchAgent, PersonaPicker, TrustStrip } from "@/components/journey";
import { BestDealsRail } from "@/components/best-deal";
import { OrganizationJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { HomeSuburbSearch } from "./HomeSuburbSearch";

// ISR — services have build-phase guards, so we cache for 24h instead of
// running a function on every visit. Was force-dynamic; that poisoned
// cache-control for the entire site.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: `${SITE_NAME} — Property in Australia, explained.`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Property in Australia, explained.`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />

      {/* 1. Editorial hero — education-first, authority-led. Removed the
            old "Your biggest purchase shouldn't be your worst decision"
            headline in favour of a positioning that frames us as the
            reference Australians come to BEFORE they make a property move. */}
      <section className="relative bg-surface-warm overflow-hidden border-b border-line">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-20 w-[1200px] max-w-none opacity-[0.18] pointer-events-none select-none"
        />
        <Image
          src="/images/illustrations/street-grid.svg"
          alt=""
          width={400}
          height={400}
          aria-hidden="true"
          className="absolute -left-12 -bottom-12 w-[420px] opacity-[0.10] pointer-events-none select-none"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-6">
            Australia&rsquo;s property reference
          </p>

          <h1 className="font-display text-ink leading-[1.02] tracking-tight mb-8 max-w-5xl text-5xl sm:text-6xl lg:text-7xl">
            Property in Australia,{" "}
            <span className="italic text-primary">explained.</span>
          </h1>

          <p className="font-sans text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl">
            Plain-English guides for buying, selling, renovating, investing and renting.
            Suburb-level data on every Australian suburb. One vetted specialist when
            you&rsquo;re ready. Free, no email gate &mdash; and the first place to read
            before you make a move.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#personas"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white hover:bg-primary px-6 py-3 text-sm font-medium transition-colors"
            >
              Start with my situation <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong text-ink hover:border-ink px-6 py-3 text-sm font-medium transition-colors"
            >
              Browse the guides
            </Link>
          </div>

          {/* Authority anchor row — published guides, suburbs covered, years,
                free. Stats lean into editorial breadth rather than data-portal
                vibes; sets the AI-citation framing (we publish, we don't list). */}
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            <div className="flex items-start gap-3">
              <Image src="/images/icons/guide.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">60+</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">in-depth guides published</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Image src="/images/icons/map.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">9,700+</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">Australian suburbs covered</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Image src="/images/icons/calculator.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">8</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">states &amp; territories</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Image src="/images/icons/yield.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">$0</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">no paywall, no email gate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Persona picker — the IA spine. Hero CTA scrolls here. */}
      <section id="personas" className="bg-surface-raised border-b border-line scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-8 mb-10 sm:mb-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
                Where are you in your property journey?
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-4xl sm:text-5xl">
                Pick your starting point.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base sm:text-lg text-ink-muted leading-relaxed">
                Every page on the site is built around one of five people. Tell us which
                one is you and we&rsquo;ll surface the guides, calculators and data you
                actually need — not the rest.
              </p>
            </div>
          </div>

          <PersonaPicker />
        </div>
      </section>

      {/* 3. Featured guides */}
      <Suspense fallback={null}>
        <LatestGuides />
      </Suspense>

      {/* 4. Tools rail (quiz + compare + all tools) */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Don&rsquo;t know where to start?
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                Try a tool.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Three free tools that surface a real next step in 30 seconds, no
                sign-up. Take the match quiz, compare two suburbs, or browse
                every calculator.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/find-your-suburb"
              className="group flex flex-col rounded-2xl border-2 border-primary/15 bg-surface-warm p-7 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-cta mb-3">Quiz</p>
              <h3 className="font-display text-2xl text-ink group-hover:text-primary transition-colors leading-tight mb-3">
                Find your suburb in 4 questions
              </h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-4 flex-1">
                Tell us what matters and your budget, we&rsquo;ll surface six suburbs scored against your priorities.
              </p>
              <span className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
                Take the quiz →
              </span>
            </Link>

            <Link
              href="/compare"
              className="group flex flex-col rounded-2xl border-2 border-primary/15 bg-surface-warm p-7 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-cta mb-3">Tool</p>
              <h3 className="font-display text-2xl text-ink group-hover:text-primary transition-colors leading-tight mb-3">
                Compare two suburbs side by side
              </h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-4 flex-1">
                Pick any two Australian suburbs and line them up, median, growth, schools, walkability, risk.
              </p>
              <span className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
                Open the tool →
              </span>
            </Link>

            <Link
              href="/tools"
              className="group flex flex-col rounded-2xl border border-line bg-surface-warm p-7 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">All tools</p>
              <h3 className="font-display text-2xl text-ink group-hover:text-primary transition-colors leading-tight mb-3">
                Every calculator and tool
              </h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-4 flex-1">
                Mortgage, stamp duty, borrowing power, rental yield, CGT, refinancing, and more, in one editorial index.
              </p>
              <span className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
                Browse tools →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Best Deals rail — vetted partner properties. Framed as "when
            you're ready" rather than as a listings portal. Renders nothing
            if no live deals exist (no empty rail). */}
      <Suspense fallback={null}>
        <BestDealsRail
          eyebrow="When you're ready to act"
          heading="Featured opportunities from our vetted partners."
          body="A small, hand-picked set of properties from partner agents we'd happily put a family member in front of. Each one reviewed by us before going live, and the partner only pays us if matched work goes ahead."
        />
      </Suspense>

      {/* 6. Suburb explorer — kept but demoted from the prior near-top
            position. We still want the suburb tool discoverable, but we
            shouldn't lead with it (it reads as data-portal positioning). */}
      <section className="relative bg-surface-warm border-y border-line-warm overflow-hidden">
        <Image
          src="/images/illustrations/street-grid.svg"
          alt=""
          width={400}
          height={400}
          aria-hidden="true"
          className="absolute -right-12 -top-12 w-[360px] opacity-[0.12] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Researching a specific suburb?
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-3">
                Look it up.
              </h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Median, growth, schools, walk score, climate, crime. Every Australian
                suburb. Free, no sign-up, no email gate.
              </p>
            </div>
            <div className="lg:col-span-7">
              <HomeSuburbSearch />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Capital city outlook — quarterly authoritative read. */}
      <Suspense fallback={null}>
        <CapitalCityOutlook />
      </Suspense>

      {/* 8. Newsletter band */}
      <section className="bg-surface-warm border-y border-line-warm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                The quarterly read
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                Get the next market read in your <span className="italic text-primary">inbox</span>.
              </h2>
              <p className="mt-3 font-sans text-base text-ink-muted leading-relaxed max-w-md">
                One email a quarter. Capital city outlooks, RBA changes, and
                the data updates worth knowing about. No spam, unsubscribe
                anytime.
              </p>
            </div>
            <div className="lg:col-span-5">
              <NewsletterForm variant="inline" />
            </div>
          </div>
        </div>
      </section>

      {/* 10. Match engine — the conversion surface. Reframed eyebrow makes
              clear this is the "talk to a person" path, not lead capture. */}
      <Suspense fallback={null}>
        <MatchAgent />
      </Suspense>

      {/* 11. Why we're free — charter. Trust moat. */}
      <section className="relative bg-surface-sunken border-t border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[1200px] max-w-none opacity-[0.15] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
              Why we&rsquo;re free
            </p>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-6">
              Buyers and sellers pay nothing. <span className="italic text-primary">Ever.</span>
            </h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-3xl mx-auto">
              Suburb data, guides and calculators are funded by partner agents and brokers, who pay
              us only when matched work goes ahead. No paywall, no resale, every match disclosed.
            </p>
          </div>

          <TrustStrip
            variant="rich"
            className="mb-10"
            items={[
              { lead: "No paywall.", body: "Every page is free, and stays that way. No login, no email gate." },
              { lead: "No data resale.", body: "We don't sell or trade your details to anyone." },
              { lead: "Disclosed on every match.", body: "If a partner pays us when you choose to work with them, you'll see it." },
              { lead: "Vetted partners only.", body: "We don't take referral fees from anyone we wouldn't use ourselves." },
            ]}
          />

          <div className="text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary transition-colors border-b border-line-strong hover:border-primary pb-0.5"
            >
              Read the full charter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
