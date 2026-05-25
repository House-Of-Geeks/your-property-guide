import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { LatestGuides } from "@/components/home/LatestGuides";
import { CapitalCityOutlook } from "@/components/home/CapitalCityOutlook";
import { SpotlightGuideCard } from "@/components/home/SpotlightGuideCard";
import { MatchAgent, PersonaPicker, TrustStrip } from "@/components/journey";
import { BestDealsRail } from "@/components/best-deal";
import { OrganizationJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { HomeSuburbSearch } from "./HomeSuburbSearch";

// ISR — services have build-phase guards, so we cache for 24h instead of
// running a function on every visit. Was force-dynamic; that poisoned
// cache-control for the entire site.
export const revalidate = 86400;

// Metadata title aligned with the education-led positioning. Leads
// with "plain-English guides" — the differentiator — then the scope
// (calculators, suburb profiles). Brand appended by root template.
const META_TITLE = "Plain-English Australian property guides, calculators & suburb profiles";
const META_DESCRIPTION = "Sixty plain-English guides on Australian property: schemes, stamp duty, finance, settlement, investing, renovating. Every calculator. Suburb profiles. Free, no sign-up.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />

      {/* 1. Hero. Three jobs named, search front and centre. Built off
            real AU search demand: "property value" / "stamp duty calculator"
            / "how much can I borrow" / "suburb profile" all dwarf the
            "research" framing we used to lead with. The suburb search box
            in-hero is the visual proof of what the site does. */}
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
          {/* Eyebrow: positions the site as education-led, not
              data-led. The brand competes on plain-English explanation
              of the Australian property machinery, not on real-time
              data feeds (which the portals own and we can't afford). */}
          <div className="flex items-center gap-4 mb-10 sm:mb-12">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 01
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Australian property, in plain English
            </span>
          </div>

          {/* 2-column hero on desktop. Left: copy + actions. Right:
              today's spotlight suburb card (real data, rotates daily).
              Show, don't tell: the visitor sees the actual depth of a
              suburb profile before they've typed a single character.
              On mobile, single column with the spotlight after the
              actions so the primary CTA (search) stays at the top. */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-10 lg:mb-12">
            {/* Left column: H1 + sub + actions */}
            <div className="lg:col-span-7">
              {/* H1: three questions every property visitor needs
                  answered. "What to skip" is the contrarian last
                  beat — implies we'll tell you what NOT to do, not
                  just what to do (counter-portal). Italic emphasis
                  lands on "skip" as the loudest word. */}
              <h1 className="font-display text-ink tracking-tight mb-8 text-5xl sm:text-6xl lg:text-[72px] xl:text-[84px] leading-[0.98] font-medium">
                What to ask. What to sign. What to{" "}
                <span className="italic font-light text-primary">skip</span>.
              </h1>

              {/* Sub names the scope (60+ guides, every calculator)
                  and the positioning (written for buyers and sellers,
                  not portals). Education-first, not data-first. */}
              <p className="font-display text-xl sm:text-2xl text-ink leading-[1.3] mb-8 font-light">
                Sixty plain-English guides. Every property calculator.
                Written for buyers and sellers, not portals. Free, no
                sign-up.
              </p>

              {/* Primary action: suburb search box. Label echoes the
                  H1's first verb. */}
              <div className="mb-6">
                <p className="text-[11px] uppercase tracking-[0.25em] text-ink-subtle font-sans font-medium mb-3">
                  Know the suburb
                </p>
                <HomeSuburbSearch />
                <p className="mt-3 text-sm text-ink-subtle">
                  Try{" "}
                  <Link href="/suburbs/bondi-nsw-2026" className="text-ink underline decoration-line-strong underline-offset-2 hover:decoration-primary hover:text-primary transition-colors">
                    Bondi
                  </Link>
                  ,{" "}
                  <Link href="/suburbs/toorak-vic-3142" className="text-ink underline decoration-line-strong underline-offset-2 hover:decoration-primary hover:text-primary transition-colors">
                    Toorak
                  </Link>
                  , or{" "}
                  <Link href="/suburbs/surfers-paradise-qld-4217" className="text-ink underline decoration-line-strong underline-offset-2 hover:decoration-primary hover:text-primary transition-colors">
                    Surfers Paradise
                  </Link>
                  .
                </p>
              </div>

              {/* Secondary action: calculator chips. Label echoes the
                  H1's second verb. */}
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-[0.25em] text-ink-subtle font-sans font-medium mb-3">
                  Run the numbers
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Stamp duty",       href: "/stamp-duty-calculator" },
                    { label: "Borrowing power",  href: "/borrowing-power-calculator" },
                    { label: "Mortgage",         href: "/mortgage-calculator" },
                    { label: "Rental yield",     href: "/rental-yield-calculator" },
                    { label: "First home buyer", href: "/first-home-buyers" },
                  ].map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-primary hover:text-primary hover:bg-surface-warm transition-colors"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust strip — four micro-proof points in editorial
                  caps. Leads with guide count to reinforce the
                  education positioning. */}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-ink-subtle font-sans font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cta" aria-hidden="true" />
                  60+ guides
                </span>
                <span aria-hidden="true">·</span>
                <span>Independent, no portal ties</span>
                <span aria-hidden="true">·</span>
                <span>Plain-English, no jargon</span>
                <span aria-hidden="true">·</span>
                <span>No login, no paywall</span>
              </p>
            </div>

            {/* Right column: today's featured guide. Magazine-style
                "today's read" — tells the visitor at a glance what
                the site is for (plain-English explainers). Rotates
                daily via pickSpotlightGuideSlug. */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 order-last lg:order-none">
              <Suspense fallback={null}>
                <SpotlightGuideCard />
              </Suspense>
            </div>
          </div>

          {/* Stats row. Reordered to lead with guides (the education
              positioning) instead of suburbs. Calculators second,
              suburbs third, free fourth. The order signals what the
              site IS to anyone who only reads the stats. */}
          <div className="border-y border-line grid grid-cols-2 sm:grid-cols-4">
            {[
              { value: "60+",    label: "Plain-English guides" },
              { value: "30+",    label: "Calculators and tools" },
              { value: "9,600+", label: "Suburb profiles" },
              { value: "$0",     label: "Free, no sign-up" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={[
                  "py-6 sm:py-7 px-4 sm:px-6",
                  i === 0 ? "pl-0" : "",
                  i === 1 || i === 3 ? "border-l border-line" : "",
                  i === 2 ? "sm:border-l sm:border-line" : "",
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

      {/* 2. Persona picker. The IA spine. Reworked from a 2,100px feature
            grid into a dense editorial list. Numeral + thumb + label + brief
            + arrow per row, hairline-divided. Reads as a contents page, not
            a SaaS feature grid. */}
      <section id="personas" className="bg-surface-raised border-b border-line scroll-mt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          {/* Compressed masthead. Eyebrow + single-row H2 + brief sub on
              one line at lg+. No more 2-col display layout. */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 02
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Where are you up to?
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-8 mb-8 sm:mb-10">
            <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl lg:text-5xl font-medium">
              Pick your{" "}
              <span className="italic font-light text-primary whitespace-nowrap">starting point</span>.
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed max-w-md">
              Five plain-English guides, each written for one person, with
              the calculators, suburb profiles and explainers that fit the
              decisions they&rsquo;re actually making.
            </p>
          </div>

          <PersonaPicker variant="rail" />
        </div>
      </section>

      {/* 3. Featured guides */}
      <Suspense fallback={null}>
        <LatestGuides />
      </Suspense>

      {/* 4. Tools rail. Trimmed from 3 cards to 2 — "All tools" duplicated
            the calculator chips already in the hero. Reframed from the
            slightly negative "Don't know where to start?" into a positive
            invitation to deepen the research one notch. */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 03
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Go a level deeper
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-8 mb-8 sm:mb-10">
            <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl lg:text-5xl font-medium">
              Build your{" "}
              <span className="italic font-light text-primary whitespace-nowrap">short list</span>.
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed max-w-md">
              Two free tools that go past the headline numbers. Take the
              4-question quiz, or line up any two suburbs side by side.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link
              href="/find-your-suburb"
              className="group flex flex-col rounded-2xl border-2 border-primary/20 bg-surface-warm p-7 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-cta mb-3">Quiz · 2 minutes</p>
              <h3 className="font-display text-2xl sm:text-3xl text-ink group-hover:text-primary transition-colors leading-tight mb-3 tracking-tight">
                Find your suburb in 4 questions
              </h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5 flex-1">
                Tell us what matters and what you can spend. We score six
                Australian suburbs against your priorities.
              </p>
              <span className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
                Find my suburb (2 min) →
              </span>
            </Link>

            <Link
              href="/compare"
              className="group flex flex-col rounded-2xl border-2 border-primary/20 bg-surface-warm p-7 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-cta mb-3">Tool · Side by side</p>
              <h3 className="font-display text-2xl sm:text-3xl text-ink group-hover:text-primary transition-colors leading-tight mb-3 tracking-tight">
                Compare two suburbs head to head
              </h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5 flex-1">
                Pick any two Australian suburbs and line them up: median,
                growth, schools, walkability, climate, crime.
              </p>
              <span className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
                Pick two suburbs →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Capital city outlook — quarterly authoritative read. Moved up
            so editorial authority is stacked together (Guides → Outlook)
            before any commercial surface. */}
      <Suspense fallback={null}>
        <CapitalCityOutlook />
      </Suspense>

      {/* 6. Best Deals rail. Reframed away from listings-portal language
            into specialist-introduction language so it doesn't conflict
            with the hero's "no email gate" positioning. Renders nothing
            if no live deals exist (no empty rail). */}
      <Suspense fallback={null}>
        <BestDealsRail
          eyebrow="When you're ready to act"
          heading="A short list, hand-picked by our editors."
          body="A small, considered set of properties from partner agents we'd happily put a family member in front of. We review every one before it goes live. You never pay us — partner agents do, and only if work goes ahead."
        />
      </Suspense>

      {/* 7. Why we're free — trust charter. Moved ABOVE MatchAgent so
            visitors read the charter (no paywall, no resale, every match
            disclosed) before being asked to share their situation. */}
      <section className="relative bg-surface-sunken border-t border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[1200px] max-w-none opacity-[0.15] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 04
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              What it costs you
            </span>
          </div>

          <div className="text-center mb-10 sm:mb-12">
            <h2 className="font-display text-ink leading-[1.0] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto font-medium">
              Buyers and sellers pay nothing.{" "}
              <span className="italic font-light text-primary">Ever</span>.
            </h2>
            <p className="font-display font-light text-lg sm:text-xl text-ink leading-snug max-w-2xl mx-auto">
              Not the guides. Not the calculators. Not the suburb data. Not
              the introduction to a specialist. Partner agents and brokers
              pay us only when matched work goes ahead.
            </p>
          </div>

          {/* Value stack. Hormozi-style: name every free thing in one
              place so the visitor can see the asymmetry between what they
              get and what they're asked to give up (nothing). */}
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-center text-[11px] uppercase tracking-[0.25em] text-ink-subtle font-sans font-medium mb-5">
              What you get, for $0
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm text-ink">
              {[
                "9,600+ suburb profiles (median, growth, schools, crime)",
                "7 property calculators (stamp duty, mortgage, borrowing power)",
                "60+ plain-English guides for buyers and sellers",
                "Side-by-side compare for any two Australian suburbs",
                "4-question suburb-match quiz",
                "One vetted specialist introduction (when you want it)",
                "Quarterly market read in your inbox",
                "Free property appraisal (sellers)",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5 py-1">
                  <span className="text-cta leading-6 shrink-0" aria-hidden="true">✓</span>
                  <span className="leading-6">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <TrustStrip
            variant="rich"
            className="mb-10"
            items={[
              { lead: "No paywall.",               body: "Every page is free, and it stays that way. No login, no email gate." },
              { lead: "No data resale, ever.",     body: "Your contact details only go to the one specialist you choose. We don't sell, share, or build profiles." },
              { lead: "Walk away anytime.",        body: "If you don't reply to the match, there's no follow-up. No calls, no nagging emails, no second specialist." },
              { lead: "Disclosed on every match.", body: "If a partner pays us when you work with them, you see that disclosure before you decide." },
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

      {/* 8. Match engine — the lead-capture surface. Now follows the trust
            charter so the visitor reads "no paywall / no resale / every
            match disclosed" before they hand over their situation. The
            soft newsletter fallback for non-converters lives in the global
            footer ("The quarterly read"), so no duplicate band here. */}
      <Suspense fallback={null}>
        <MatchAgent />
      </Suspense>
    </>
  );
}
