import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { LatestGuides } from "@/components/home/LatestGuides";
import { CapitalCityOutlook } from "@/components/home/CapitalCityOutlook";
import { SellingGuideCard } from "@/components/home/SellingGuideCard";
import { PersonaPicker, SellingGuideFunnel, TrustStrip } from "@/components/journey";
import { BestDealsRail } from "@/components/best-deal";
import { OrganizationJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
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
      <section className="band-glow relative bg-surface-inverse text-white overflow-hidden border-b border-white/10">
        {/* The cover of the issue: the commissioned night suburb, lights
            on, rises along the hero's lower edge. Ink sky in the art is
            the section's own colour so the scene and the page are one
            field, exactly like the guide cover and the OG card. */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/hero/suburb-night.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-inverse from-22% via-surface-inverse/85 via-58% to-surface-inverse/5" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
          {/* Eyebrow: positions the site as education-led, not
              data-led. The brand competes on plain-English explanation
              of the Australian property machinery, not on real-time
              data feeds (which the portals own and we can't afford). */}
          <div className="rise flex items-center gap-4 mb-10 sm:mb-12">
            <span className="font-display italic text-cta text-base sm:text-lg leading-none">
              No. 01
            </span>
            <span className="w-12 h-px bg-white/25" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-white/60 font-sans font-medium">
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
              <h1 className="rise rise-d1 font-display text-white tracking-tight mb-8 text-5xl sm:text-6xl lg:text-[72px] xl:text-[84px] leading-[0.98] font-medium">
                What to ask. What to sign. What to{" "}
                <span className="u-draw relative inline-block italic font-light text-accent-lighter">
                  skip
                  {/* Hand-drawn underline, draws in after the entrance */}
                  <svg
                    className="absolute left-[-2%] right-0 bottom-[-0.12em] w-[104%] h-[0.22em]"
                    viewBox="0 0 120 12"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5C24 4.5 50 3.5 73 5c18 1.2 32 3 44 4.5"
                      stroke="var(--cta)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      pathLength="1"
                    />
                  </svg>
                </span>
                .
              </h1>

              {/* Sub names the scope (60+ guides, every calculator)
                  and the positioning (written for buyers and sellers,
                  not portals). Education-first, not data-first. */}
              <p className="rise rise-d2 font-display text-xl sm:text-2xl text-white/85 leading-[1.3] mb-8 font-light">
                Sixty plain-English guides. Every property calculator.
                Written for buyers and sellers, not portals. Free, no
                sign-up.
              </p>

              {/* Primary action: suburb search box. Label echoes the
                  H1's first verb. */}
              <div className="rise rise-d3 mb-6">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 font-sans font-medium mb-3">
                  Know the suburb
                </p>
                <HomeSuburbSearch />
                <p className="mt-3 text-sm text-white/55">
                  Try{" "}
                  <Link href="/suburbs/bondi-nsw-2026" className="text-white/90 underline decoration-white/30 underline-offset-2 hover:decoration-cta hover:text-accent-lighter transition-colors">
                    Bondi
                  </Link>
                  ,{" "}
                  <Link href="/suburbs/toorak-vic-3142" className="text-white/90 underline decoration-white/30 underline-offset-2 hover:decoration-cta hover:text-accent-lighter transition-colors">
                    Toorak
                  </Link>
                  , or{" "}
                  <Link href="/suburbs/surfers-paradise-qld-4217" className="text-white/90 underline decoration-white/30 underline-offset-2 hover:decoration-cta hover:text-accent-lighter transition-colors">
                    Surfers Paradise
                  </Link>
                  .
                </p>
              </div>

              {/* Secondary action: calculator chips. Label echoes the
                  H1's second verb. */}
              <div className="rise rise-d4 mb-5">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 font-sans font-medium mb-3">
                  Run the numbers
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Selling costs",    href: "/real-estate-commission-calculator" },
                    { label: "Stamp duty",       href: "/stamp-duty-calculator" },
                    { label: "Borrowing power",  href: "/borrowing-power-calculator" },
                    { label: "Mortgage",         href: "/mortgage-calculator" },
                    { label: "First home buyer", href: "/first-home-buyers" },
                  ].map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-cta hover:text-accent-lighter hover:bg-white/10 transition-colors"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust strip — four micro-proof points in editorial
                  caps. Leads with guide count to reinforce the
                  education positioning. */}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-white/55 font-sans font-medium">
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

            {/* Right column: the selling-guide lead magnet. The hero's
                right column is the most valuable surface on the site, so
                it sells the one asset that captures and qualifies
                vendors. Education spotlight lives on in LatestGuides
                below. */}
            <div className="rise rise-d2 lg:col-span-5 lg:sticky lg:top-24 order-last lg:order-none">
              <SellingGuideCard />
            </div>
          </div>

          {/* Stats row. Reordered to lead with guides (the education
              positioning) instead of suburbs. Calculators second,
              suburbs third, free fourth. The order signals what the
              site IS to anyone who only reads the stats. */}
          <div className="border-y border-white/15 grid grid-cols-2 sm:grid-cols-4 bg-surface-inverse/55 backdrop-blur-[3px] rounded-sm">
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
                  i === 1 || i === 3 ? "border-l border-white/15" : "",
                  i === 2 ? "sm:border-l sm:border-white/15" : "",
                  i >= 2 ? "border-t sm:border-t-0 border-white/15" : "",
                ].filter(Boolean).join(" ")}
              >
                <p className="font-display text-4xl sm:text-5xl text-white leading-none mb-2.5 tracking-tight">
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/50 font-sans font-medium">
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-14 sm:pt-24 sm:pb-16">
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-14 sm:pt-24 sm:pb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 04
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
              className="card-lift group flex flex-col rounded-2xl border-2 border-primary/20 bg-surface-warm p-7 hover:border-primary/50"
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
              className="card-lift group relative overflow-hidden flex flex-col rounded-2xl border-2 border-primary/20 bg-surface-warm p-7 hover:border-primary/50"
            >
              {/* Aerial cadastral artwork: comparing suburbs is comparing
                  territory. Faded right edge, content stays legible. */}
              <div className="absolute inset-y-0 right-0 w-[55%] pointer-events-none select-none" aria-hidden="true">
                <Image
                  src="/images/art/suburb-aerial.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 640px) 30vw, 60vw"
                  className="object-cover object-center opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-warm via-surface-warm/70 to-surface-warm/20" />
              </div>
              <p className="relative text-xs font-sans uppercase tracking-[0.25em] text-cta mb-3">Tool · Side by side</p>
              <h3 className="relative font-display text-2xl sm:text-3xl text-ink group-hover:text-primary transition-colors leading-tight mb-3 tracking-tight">
                Compare two suburbs head to head
              </h3>
              <p className="relative font-sans text-sm text-ink-muted leading-relaxed mb-5 flex-1">
                Pick any two Australian suburbs and line them up: median,
                growth, schools, walkability, climate, crime.
              </p>
              <span className="relative font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
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
        {/* The golden-hour suburb rests faintly along the charter's base:
            the promise ("you pay nothing") sits over the homes it's about. */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/hero/suburb-dusk.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom opacity-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-sunken from-5% via-surface-sunken/70 via-45% to-surface-sunken/25" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-14 sm:pt-24 sm:pb-16">
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. 06
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
                "The complete selling guide, a real PDF, suburb-personalised",
                "9,600+ suburb profiles (median, growth, schools, crime)",
                "8 property calculators (commission, stamp duty, mortgage)",
                "60+ plain-English guides for buyers and sellers",
                "Side-by-side compare for any two Australian suburbs",
                "4-question suburb-match quiz",
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
              { lead: "No paywall.",               body: "Every guide, calculator and suburb profile is free, and it stays that way. No login to read." },
              { lead: "No data resale, ever.",     body: "Your details go only to the specialists you ask us to connect you with, capped at three. Never sold, never blasted to a list." },
              { lead: "Walk away anytime.",        body: "Every introduction is no-obligation, and unsubscribing takes one click. No nagging calls." },
              { lead: "Disclosed on every match.", body: "Partner agents pay us when an introduction leads to work. You never pay, and we say so up front, every time." },
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

      {/* 8. Guide funnel — the lead-capture surface. Follows the trust
            charter so the visitor reads "no paywall / no resale" before
            being asked anything. Embeds the same qualification funnel as
            /selling-guide so homepage visitors convert without a page
            hop. The soft newsletter fallback for non-converters lives in
            the global footer ("The quarterly read"). */}
      <section id="guide" className="band-glow bg-surface-inverse text-white scroll-mt-24">
        {/* Night variant of the commissioned suburb artwork: lamplit
            rooflines along the bottom of the band. The art's ink sky is
            the band's own colour, so it reads as one continuous scene. */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/hero/suburb-night.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-inverse from-30% via-surface-inverse/85 via-68% to-surface-inverse/15" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left, pitch */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4 mb-10">
                <span className="font-display italic text-cta text-base sm:text-lg leading-none">
                  No. 07
                </span>
                <span className="w-12 h-px bg-white/20" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-white/60 font-sans font-medium">
                  Free PDF · 2026 edition
                </span>
              </div>
              <h2 className="font-display text-white leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-8 font-medium">
                The complete guide to{" "}
                <span className="italic font-light text-cta">selling</span>{" "}
                your property.
              </h2>
              <p className="font-display font-light text-xl sm:text-2xl text-white/80 leading-snug max-w-md mb-12">
                Selling costs 3 to 5 percent of your price. The right
                moves claw thousands of it back. Ten chapters that show
                you how, personalised to your suburb, free.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6 max-w-md">
                {[
                  ["01", "Answer 7 quick questions (60 seconds)"],
                  ["02", "We personalise the guide to your suburb"],
                  ["03", "Download instantly, plus a copy by email"],
                  ["04", "Selling soon? A free local appraisal if you want one."],
                ].map(([n, t]) => (
                  <div key={n} className="border-t border-white/15 pt-4">
                    <p className="font-display italic text-cta text-base mb-1.5 tabular-nums">{n}</p>
                    <p className="text-sm text-white/85 leading-snug">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right, the funnel itself */}
            <div className="lg:col-span-7 lg:col-start-6">
              <Suspense fallback={null}>
                <SellingGuideFunnel source="homepage-guide" />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
