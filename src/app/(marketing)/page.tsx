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
  title: `${SITE_NAME}: Property in Australia, explained.`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME}: Property in Australia, explained.`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />

      {/* 1. Editorial hero. Pushed to editorial scale + magazine-style
            department slug, hairline-divided stats, single primary CTA
            with the secondary action as an underlined link. */}
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
          {/* Editorial slug: italic number + hairline + department label.
              Reads as the masthead of a magazine column, not a SaaS hero. */}
          <div className="flex items-center gap-4 mb-12 sm:mb-16">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 01
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Australia&rsquo;s property reference
            </span>
          </div>

          {/* Display H1 at editorial scale. Italic emphasis on "Australia"
              pushes the brand pattern harder than the previous "explained"
              treatment, and lifts the country word as a citation hook. */}
          <h1 className="font-display text-ink tracking-tight mb-12 max-w-[18ch] text-6xl sm:text-7xl lg:text-[112px] xl:text-[128px] leading-[0.95] font-medium">
            Property in{" "}
            <span className="italic font-light text-primary">Australia</span>,
            explained.
          </h1>

          {/* Standfirst. Serif body at display weight reads like a magazine
              lede, not a SaaS subheadline. Narrower measure for editorial
              colour. */}
          <p className="font-display text-2xl sm:text-3xl text-ink leading-[1.25] max-w-3xl mb-12 font-light">
            Australia&rsquo;s biggest financial decision deserves better
            than a portal. Sixty plain-English guides, every suburb in the
            country, every calculator that matters. Free, ungated, written
            for people, not portals.
          </p>

          {/* Three calibrated paths from the hero:
                Primary (pill, dark): for the largest cohort, the
                  educational-first visitor who's still narrowing situation.
                Secondary (underlined link): for the reader who wants the
                  raw guides.
                Tertiary (small text): for the high-intent visitor who
                  already knows what they need. Without this, ready-to-talk
                  visitors had no fast path off the homepage. */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-3">
            <Link
              href="#personas"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white hover:bg-primary px-7 py-3.5 text-sm font-medium transition-colors"
            >
              Find what fits my situation <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-ink hover:text-primary font-medium text-sm border-b border-line-strong hover:border-primary pb-1 transition-colors"
            >
              Or read the 60+ guides
            </Link>
          </div>
          <p className="text-sm text-ink-subtle mb-16">
            Already know what you need?{" "}
            <Link
              href="/find-an-expert"
              className="text-ink hover:text-primary border-b border-line-strong hover:border-primary pb-0.5 font-medium transition-colors"
            >
              Talk to a vetted specialist
            </Link>
            .
          </p>

          {/* Editorial stat row. Hairline-divided columns, no icons, big
              serif numbers and small uppercase labels. Reads as a magazine
              masthead summary, not a feature grid. */}
          <div className="border-y border-line grid grid-cols-2 sm:grid-cols-4">
            {[
              { value: "60+",     label: "Published guides" },
              { value: "9,600+",  label: "Suburbs covered" },
              { value: "8",       label: "States & territories" },
              { value: "$0",      label: "No paywall, ever" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={[
                  "py-6 sm:py-7 px-4 sm:px-6",
                  i === 0 ? "pl-0" : "",
                  // Vertical hairline between cells. Mobile (2-col): cells 1 + 3. Desktop (4-col): cells 1, 2, 3.
                  i === 1 || i === 3 ? "border-l border-line" : "",
                  i === 2 ? "sm:border-l sm:border-line" : "",
                  // Horizontal hairline between mobile rows. Cells 2 + 3 only.
                  i >= 2 ? "border-t sm:border-t-0 border-line" : "",
                ].filter(Boolean).join(" ")}
              >
                <p className="font-display text-4xl sm:text-5xl text-ink leading-none mb-2.5 tracking-tight">
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-ink-subtle font-sans font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Persona picker. The IA spine. Hero CTA scrolls here. Editorial
            header with hairline rule + dated department slug. */}
      <section id="personas" className="bg-surface-raised border-b border-line scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          {/* Magazine-style section masthead */}
          <div className="flex items-center gap-4 mb-12">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 02
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Where are you up to?
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 mb-14 sm:mb-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl font-medium">
                Pick your{" "}
                <span className="italic font-light text-primary">starting point</span>.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="font-display text-xl sm:text-2xl text-ink leading-snug font-light max-w-md">
                Every page on this site is built around one of five people. Tell
                us which one is you and we&rsquo;ll show you only the guides,
                calculators and data that fit your situation.
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Magazine-style section masthead */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 03
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Try a tool
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 mb-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl font-medium">
                Don&rsquo;t know where to{" "}
                <span className="italic font-light text-primary">start</span>?
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="font-display text-lg sm:text-xl text-ink leading-snug font-light max-w-md">
                Three free tools, no sign-up. Take the match quiz, compare two
                suburbs side by side, or open the calculator you need.
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
                Tell us what matters and your budget. We&rsquo;ll score six suburbs against your priorities.
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
                Mortgage, stamp duty, borrowing power, rental yield, CGT, refinancing. Every calculator we publish, in one index.
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
          body="A small, considered set of properties from partner agents we'd happily put a family member in front of. We review every one before it goes live. The partner pays us only if work goes ahead."
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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Magazine-style section masthead */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 04
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Researching a specific suburb?
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-8 items-end">
            <div className="lg:col-span-5">
              <h2 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-4 font-medium">
                Look it{" "}
                <span className="italic font-light text-primary">up</span>.
              </h2>
              <p className="font-display text-lg sm:text-xl text-ink leading-snug font-light max-w-md">
                Median, growth, schools, walk score, climate, crime. Every
                Australian suburb. Free, no sign-up, no email gate.
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
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
          {/* Magazine-style section masthead, centred to match the charter
              treatment */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 05
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Why we&rsquo;re free
            </span>
          </div>

          <div className="text-center mb-14">
            <h2 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-8 max-w-4xl mx-auto font-medium">
              Buyers and sellers pay nothing.{" "}
              <span className="italic font-light text-primary">Ever</span>.
            </h2>
            <p className="font-display font-light text-xl sm:text-2xl text-ink leading-snug max-w-3xl mx-auto">
              Every guide, calculator and suburb profile on this site is free.
              Partner agents and brokers pay us only when matched work goes
              ahead. No paywall, no email gate, no data resale, and every
              match is disclosed up front.
            </p>
          </div>

          <TrustStrip
            variant="rich"
            className="mb-10"
            items={[
              { lead: "No paywall.",             body: "Every page is free, and it stays that way. No login, no email gate." },
              { lead: "No data resale.",         body: "Your contact details never go anywhere except to the one specialist you choose." },
              { lead: "Disclosed on every match.", body: "If a partner pays us when you work with them, you see that disclosure before you decide." },
              { lead: "Vetted partners only.",   body: "We don't take referral fees from anyone we wouldn't put our own family in front of." },
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
