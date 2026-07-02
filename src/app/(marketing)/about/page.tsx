import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo";
import { TrustStrip } from "@/components/journey";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  // Aligned with the education-led repositioning (2026-05). The about
  // page is the canonical "why we exist" — and the answer is now
  // education, not reference.
  title: `About ${SITE_NAME}: plain-English Australian property education`,
  description: "Why this site exists, who writes it, how we stay independent, and how we make money. Property in plain English so Australians can make better decisions, not pushed to a form.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { url: `${SITE_URL}/about`, title: `About ${SITE_NAME}`, description: "Why this site exists, who writes it, how we stay independent, and how we make money.", type: "website" },
  twitter: { card: "summary_large_image" },
};

const PRINCIPLES = [
  {
    icon: "/images/icons/guide.svg",
    title: "Education first",
    body: "We answer the question, not push you to a form. The whole site is built around helping you make a confident decision.",
  },
  {
    icon: "/images/icons/median.svg",
    title: "Sourced and dated",
    body: "Every figure is tagged with where it came from and when it was last refreshed. If anything looks off, tell us, we'll fix it within a week.",
  },
  {
    icon: "/images/icons/yield.svg",
    title: "Free and ungated",
    body: "No paywall, no sign-up, no email gate to read or use anything. Suburb data, calculators and guides are free, full stop.",
  },
  {
    icon: "/images/icons/broker.svg",
    title: "Honest about money",
    body: "Partner agents and brokers pay us only when matched work goes ahead. Disclosed on every match. We don't sell or trade your details.",
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "About", url: "/about" }]} />
      <PersonJsonLd
        id="andy-mcmaster"
        name="Andy McMaster"
        jobTitle="Editor"
        bio="Editor of Your Property Guide. Writes the editorial methodology, scheme and policy commentary, and oversees the suburb data review. Based in Brisbane, Australia."
        image="/images/agents/andy-mcmaster.jpg"
        sameAs={["https://www.linkedin.com/in/andymcmaster"]}
      />

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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-24">
          <div className="mb-10">
            <Breadcrumbs items={[{ label: "About" }]} />
          </div>

          {/* Magazine masthead */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              About
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Plain-English Australian property
            </span>
          </div>

          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[20ch] font-medium">
            Once you know what&rsquo;s actually happening, you make{" "}
            <span className="italic font-light text-primary">better choices</span>.
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl lg:text-3xl text-ink leading-[1.25] max-w-3xl">
            Property is the biggest financial decision most Australians ever
            make. Most of the people explaining it have something to sell. We
            wrote this site because that&rsquo;s a problem. Sixty plain-English
            guides, every property calculator, suburb profiles for every
            suburb in Australia, and one vetted specialist when you&rsquo;re
            ready. Education first. No sign-up, no agenda.
          </p>
        </div>
      </section>

      {/* Why we exist */}
      <section className="bg-surface-raised">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Why we exist
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-6">
            Australian property research is mostly written for the seller, not the buyer.
          </h2>
          <div className="prose-ypg">
            <p>
              Most of what passes for property research in Australia is funded by
              the people selling you the property. The biggest portals are
              optimised for listings; the best data sits behind a paywall; the
              guides are gated by lead-capture forms.
            </p>
            <p>
              We&rsquo;re not against agents (we work with them, transparently).
              We&rsquo;re against information being weaponised so you don&rsquo;t
              know what you&rsquo;re looking at when you bid, sign, or settle.
            </p>
            <p>
              Your Property Guide is the tool we wish existed when our friends
              and family were buying their first home, or selling their last one,
              or trying to work out whether to upgrade. Free, current, sourced,
              and written so it actually answers the question.
            </p>
          </div>
        </div>
      </section>

      {/* Our four principles */}
      <section className="bg-surface-warm border-y border-line-warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Our charter
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                Four principles. <span className="italic text-primary">Non-negotiable.</span>
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                If we ever stop honouring any of these, hold us to them. Email
                andy@theandylife.com and tell us where we&rsquo;ve drifted.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-line bg-surface-raised p-7 flex flex-col"
              >
                <div className="w-12 h-12 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center mb-5">
                  <Image src={p.icon} alt="" width={28} height={28} className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl text-ink leading-tight mb-3">{p.title}</h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we make money */}
      <section className="bg-surface-raised">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            How we make money
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-6">
            Buyers and sellers pay nothing. <span className="italic text-primary">Ever.</span>
          </h2>
          <div className="prose-ypg">
            <p>
              When you&rsquo;re ready to talk to a specialist, whether that&rsquo;s
              an agent, broker, property accountant or conveyancer, we&rsquo;ll
              match you with someone we&rsquo;d use ourselves. They pay us a
              referral fee only when matched work goes ahead.
            </p>
            <p>
              We disclose this on every match. We don&rsquo;t sell your data.
              We don&rsquo;t accept fees from anyone we wouldn&rsquo;t use
              ourselves. And the data, guides, calculators and suburb profiles
              stay free regardless.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/find-an-expert"
              className="inline-flex items-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors"
            >
              Get connected <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink border-b border-line-strong hover:border-ink pb-0.5 text-sm font-medium"
            >
              Or read our methodology
            </Link>
          </div>

          {/* Ownership & funding — explicit anchor for the JSON-LD
              ownershipFundingInfo policy URL. Plain-English ownership
              statement for E-E-A-T trust signals. */}
          <div id="ownership-funding" className="mt-12 pt-10 border-t border-line scroll-mt-24">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Ownership &amp; funding
            </p>
            <h3 className="font-display text-2xl text-ink leading-tight mb-4">
              Who owns Your Property Guide, and where the money comes from.
            </h3>
            <div className="prose-ypg">
              <p>
                Your Property Guide is owned and operated by Profit Geeks
                Pty Ltd, an Australian-registered private company. We&rsquo;re
                independently funded. No venture capital, no media-group
                ownership, no real estate franchise or aggregator behind the
                scenes.
              </p>
              <p>
                100% of our revenue comes from referral fees paid by partner
                agents, brokers, conveyancers and accountants <em>only</em>{" "}
                when matched work goes ahead. No advertising. No paid placements
                in editorial. No fees from any party we wouldn&rsquo;t
                recommend to our own family. Partner relationships are
                disclosed on every introduction and on every Best Deal
                listing.
              </p>
            </div>
          </div>

          {/* Coverage & inclusivity — anchor for diversityPolicy and
              missionCoveragePrioritiesPolicy. Plain statement of who we
              cover and how we decide what to publish. */}
          <div id="coverage" className="mt-10 pt-10 border-t border-line scroll-mt-24">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Coverage &amp; inclusivity
            </p>
            <h3 className="font-display text-2xl text-ink leading-tight mb-4">
              Who we write for, and how we decide what to publish.
            </h3>
            <div className="prose-ypg">
              <p>
                We write for every Australian engaging with residential
                property. First home buyers, upgraders, downsizers,
                sellers, investors, renovators and renters. Every guide is
                tested for plain-English accessibility (no jargon left
                unexplained), and we&rsquo;re explicit when advice differs by
                state, by age, by income, or by family situation.
              </p>
              <p>
                Our editorial priorities are set by reader search demand
                (what Australians are actually looking up) and topic
                under-coverage in existing Australian property media
                (questions buyers ask their broker and don&rsquo;t find
                published anywhere). Our editor reviews coverage gaps
                quarterly and commissions new guides against them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The people behind it */}
      <section id="people" className="bg-surface-warm border-y border-line-warm scroll-mt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                The people
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                Real names, <span className="italic text-primary">real bylines</span>.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Every guide carries the byline of the person who wrote it and the
                name of the editor who reviewed it. No anonymous content, no AI
                slop dropped in unchecked.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Andy */}
            <article
              id="andy-mcmaster"
              className="rounded-2xl border border-line bg-surface-raised p-7 sm:p-9 grid sm:grid-cols-12 gap-6 scroll-mt-24"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div className="sm:col-span-4">
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                  Editor &amp; co-founder
                </p>
                <h3 className="font-display text-2xl text-ink leading-tight" itemProp="name">
                  Andy McMaster
                </h3>
                <p className="text-sm font-sans text-ink-muted mt-1" itemProp="jobTitle">
                  Editor &amp; co-founder
                </p>
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mt-4">
                  Writes about
                </p>
                <p className="font-sans text-sm text-ink leading-relaxed mt-1">
                  Editorial direction, methodology, scheme &amp; policy commentary
                </p>
              </div>
              <div className="sm:col-span-8" itemProp="description">
                <p className="font-sans text-base text-ink-muted leading-relaxed">
                  Andy runs editorial at Your Property Guide. His background is in
                  product and brand for Australian finance and property
                  businesses, including building yourfinanceguide.com.au and
                  several adjacent consumer-finance research sites. He
                  commissions every guide on the site, edits the copy, and signs
                  off before anything publishes.
                </p>
                <p className="font-sans text-base text-ink-muted leading-relaxed mt-4">
                  Andy&rsquo;s job is to keep the editorial line honest:
                  education first, no pushy CTAs, every figure sourced and
                  dated. If you spot something on the site that doesn&rsquo;t
                  meet that standard, his inbox is the right place to flag it.
                </p>
                <link itemProp="url" href={`${SITE_URL}/about#andy-mcmaster`} />
                <meta itemProp="email" content="andy@theandylife.com" />
              </div>
            </article>

            {/* Bec */}
            <article
              id="bec-ramirez"
              className="rounded-2xl border border-line bg-surface-raised p-7 sm:p-9 grid sm:grid-cols-12 gap-6 scroll-mt-24"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div className="sm:col-span-4">
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                  Senior writer
                </p>
                <h3 className="font-display text-2xl text-ink leading-tight" itemProp="name">
                  Bec Ramirez
                </h3>
                <p className="text-sm font-sans text-ink-muted mt-1" itemProp="jobTitle">
                  Property &amp; finance writer
                </p>
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mt-4">
                  Writes about
                </p>
                <p className="font-sans text-sm text-ink leading-relaxed mt-1">
                  Property tax, lending, investment strategy, federal &amp;
                  state policy
                </p>
              </div>
              <div className="sm:col-span-8" itemProp="description">
                <p className="font-sans text-base text-ink-muted leading-relaxed">
                  Bec is our senior writer on the tax, lending and investment
                  side of property. She came to Your Property Guide from a
                  mortgage broking background, where she spent several years
                  walking first home buyers and seasoned investors through the
                  mechanics of structuring, serviceability and tax-efficient
                  ownership.
                </p>
                <p className="font-sans text-base text-ink-muted leading-relaxed mt-4">
                  On the site she covers negative gearing, capital gains tax,
                  depreciation, SMSF property, foreign buyer rules, and the
                  federal and state policy changes that move the market.
                  She&rsquo;s the writer behind most of our budget coverage and
                  the calculators that underpin it.
                </p>
                <p className="font-sans text-base text-ink-muted leading-relaxed mt-4">
                  Her brief is to translate complex tax and lending detail into
                  plain English without losing the nuance that actually changes
                  the numbers on a deal.
                </p>
                <link itemProp="url" href={`${SITE_URL}/about#bec-ramirez`} />
              </div>
            </article>

            {/* Ellie */}
            <article
              id="ellie-johnston"
              className="rounded-2xl border border-line bg-surface-raised p-7 sm:p-9 grid sm:grid-cols-12 gap-6 scroll-mt-24"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div className="sm:col-span-4">
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                  Senior writer
                </p>
                <h3 className="font-display text-2xl text-ink leading-tight" itemProp="name">
                  Ellie Johnston
                </h3>
                <p className="text-sm font-sans text-ink-muted mt-1" itemProp="jobTitle">
                  Market &amp; suburb research
                </p>
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mt-4">
                  Writes about
                </p>
                <p className="font-sans text-sm text-ink leading-relaxed mt-1">
                  Capital-city market updates, suburb profiles, state buying
                  guides, regional research
                </p>
              </div>
              <div className="sm:col-span-8" itemProp="description">
                <p className="font-sans text-base text-ink-muted leading-relaxed">
                  Ellie leads our market and suburb research. Her background is
                  in property data journalism, pulling apart Valuer-General
                  releases, ABS data, and listing-portal aggregates to find the
                  story behind the median.
                </p>
                <p className="font-sans text-base text-ink-muted leading-relaxed mt-4">
                  She writes the capital-city market updates, state-by-state
                  buying guides, regional research and most of the suburb
                  profiles on the site. Every figure she publishes carries a
                  source and an as-of date, and her drafts get reviewed by the
                  editor before they go live.
                </p>
                <p className="font-sans text-base text-ink-muted leading-relaxed mt-4">
                  Ellie&rsquo;s priority is making sure the data on Your
                  Property Guide is current, comparable, and useful, not just
                  pretty.
                </p>
                <link itemProp="url" href={`${SITE_URL}/about#ellie-johnston`} />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Editorial methodology — anchor referenced by JSON-LD
          publishingPrinciples + ethicsPolicy URLs. */}
      <section id="methodology" className="bg-surface-raised scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Editorial methodology
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-6">
            How we write, source, and update.
          </h2>
          <div className="prose-ypg">
            <p>
              Every guide goes through the same three steps: a named writer
              drafts against a published outline, a domain reviewer (broker,
              agent, accountant or conveyancer depending on topic)
              sanity-checks the technical claims, and the editor signs off on
              plain-English clarity. Drafts are not published until all three
              steps are complete and signed off.
            </p>
            <p>
              <strong>Sources.</strong> Suburb data is sourced from state
              Valuer-General offices, ABS Census, Geoscience Australia,
              OpenStreetMap, the Bureau of Meteorology, ACARA, state police
              open data, and state planning portals. Every figure on a suburb
              page carries a tooltip showing the source and the as-of date.
              Guides cite primary sources (ATO rulings, state legislation,
              APRA/ASIC regulatory guidance, MFAA / HIA / Master Builders
              industry data) and never opinion blogs.
            </p>
            <p>
              <strong>AI usage.</strong> We don&rsquo;t publish AI-generated
              copy. AI may be used for research summarisation and outline
              drafting by the editor, but every word that ships through our
              site is written and edited by named humans.
            </p>
            <p>
              <strong>Updates.</strong> Guides are reviewed at least annually,
              and immediately after any material law or scheme change (state
              budget changes, Home Guarantee Scheme rounds, RBA rate
              decisions, ATO determinations). Each guide shows the published
              date and the last-reviewed date in the byline.
            </p>
          </div>
        </div>
      </section>

      {/* Corrections policy — explicit anchor for actionableFeedbackPolicy
          JSON-LD URL. Sits alongside methodology so a corrections claim has
          its own findable section. */}
      <section id="corrections" className="bg-surface-warm border-t border-line-warm scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Corrections &amp; feedback
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-6">
            If something&rsquo;s wrong, we want to know.
          </h2>
          <div className="prose-ypg">
            <p>
              If you spot a factual error, a stale figure, or a number that
              doesn&rsquo;t match its source, email{" "}
              <a href="mailto:andy@theandylife.com">andy@theandylife.com</a>.
              The editor reads every correction request and we commit to:
            </p>
            <ul>
              <li><strong>Within 48 hours:</strong> acknowledgement of the report and an honest first read of whether we agree.</li>
              <li><strong>Within 7 days:</strong> a correction live on the page if we agree, or a written explanation if we don&rsquo;t.</li>
              <li><strong>On the page:</strong> material corrections are noted in the guide footer with the date and a short description of what changed.</li>
              <li><strong>No retaliation:</strong> if you flag a correction we don&rsquo;t end up making, we&rsquo;ll still update the public last-reviewed date so other readers know the page has been re-checked.</li>
            </ul>
            <p>
              For broader feedback, topics we should cover, gaps in our
              guides or suggestions for the data,{" "}
              <Link href="/contact">use our contact form</Link>{" "}
              or email the editor directly.
            </p>
          </div>
        </div>
      </section>

      {/* Trust strip closer */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
              The shorthand version
            </p>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
              What you can <span className="italic text-primary">count on</span>.
            </h2>
          </div>
          <TrustStrip
            variant="rich"
            items={[
              { lead: "No paywall.", body: "Every page is free, and stays that way. No login, no email gate." },
              { lead: "No data resale.", body: "We don't sell or trade your details to anyone." },
              { lead: "Disclosed matches.", body: "If a partner pays us, you'll see it on every introduction." },
              { lead: "Vetted only.", body: "We don't take referrals from anyone we wouldn't use ourselves." },
            ]}
          />
        </div>
      </section>
    </>
  );
}
