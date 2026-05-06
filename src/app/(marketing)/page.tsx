import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { StatsBar } from "@/components/home/StatsBar";
import { SuburbSpotlight } from "@/components/home/SuburbSpotlight";
import { LatestGuides } from "@/components/home/LatestGuides";
import { CapitalCityOutlook } from "@/components/home/CapitalCityOutlook";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { PersonaPicker, TrustStrip } from "@/components/journey";
import { OrganizationJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { HomeSuburbSearch } from "./HomeSuburbSearch";

// Homepage embeds StatsBar / SuburbSpotlight / FeaturedListings which all hit
// the DB. Render on every request — no build-time DB.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Property Research, Made Simple`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} - Property Research, Made Simple`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />

      {/* 1. Editorial hero. Identity first; persona picker lives in its own
          section below so the hero can breathe. */}
      <section className="relative bg-surface-warm overflow-hidden border-b border-line">
        {/* Decorative contour layer (cartographic feel, low opacity) */}
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-20 w-[1200px] max-w-none opacity-[0.18] pointer-events-none select-none"
        />
        {/* Decorative street-grid layer in lower left */}
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
            Australia&rsquo;s plain-English property guide
          </p>

          <h1 className="font-display text-ink leading-[1.05] tracking-tight mb-8 max-w-5xl text-5xl sm:text-6xl lg:text-7xl">
            Free property research,{" "}
            <span className="italic text-primary">written for normal people.</span>
          </h1>

          <p className="font-sans text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl">
            Suburb data, plain-English guides, and free calculators. Pick where you fit and we&rsquo;ll
            point you at the bits that matter, no sign-up, no pushy CTAs, no agenda.
          </p>

          {/* Stat anchor row */}
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            <div className="flex items-start gap-3">
              <img src="/images/icons/median.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">60+</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">data points per suburb</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/schools.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">8</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">states &amp; territories</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/calculator.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">38</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">guides &amp; calculators</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/yield.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">$0</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">free, no sign-up</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Persona picker. The IA spine. */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-8 mb-10 sm:mb-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
                What brings you here?
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-4xl sm:text-5xl">
                Pick your starting point.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base sm:text-lg text-ink-muted leading-relaxed">
                Every page on the site is built around one of four people. Tell us which one is you and
                we&rsquo;ll surface the calculators, guides and data you actually need, not the rest.
              </p>
            </div>
          </div>

          <PersonaPicker />
        </div>
      </section>

      {/* 3. Suburb search band, editorial split layout */}
      <section className="relative bg-surface-warm border-b border-line-warm overflow-hidden">
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
                Or just look one up
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-3">
                Search any Australian suburb.
              </h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Median, growth, schools, walk score, climate. Free, no sign-up, no email gate.
              </p>
            </div>
            <div className="lg:col-span-7">
              <HomeSuburbSearch />
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 — New tools rail (quiz + compare + all tools) */}
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
                Tell us what matters and your budget — we&rsquo;ll surface six suburbs scored against your priorities.
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
                Pick any two Australian suburbs and line them up — median, growth, schools, walkability, risk.
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
                Mortgage, stamp duty, borrowing power, rental yield, CGT, refinancing, and more — in one editorial index.
              </p>
              <span className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
                Browse tools →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Real numbers (existing StatsBar) */}
      <Suspense fallback={null}>
        <StatsBar />
      </Suspense>

      {/* 5. Suburb spotlight (existing) */}
      <Suspense fallback={null}>
        <SuburbSpotlight />
      </Suspense>

      {/* 5.5 — Capital city outlook editorial rail */}
      <Suspense fallback={null}>
        <CapitalCityOutlook />
      </Suspense>

      {/* 5.7 — Newsletter band: editorial mid-page capture */}
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

      {/* 6. Latest guides (existing) */}
      <Suspense fallback={null}>
        <LatestGuides />
      </Suspense>

      {/* 7. Why we're free, editorial closer with decorative contour */}
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
              us only when matched work goes ahead.
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
