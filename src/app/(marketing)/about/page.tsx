import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164, SITE_NAME, SITE_URL } from "@/lib/constants";

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

// The four standards the site holds itself to (shown under Editorial
// standards).
const PRINCIPLES = [
  {
    title: "Education first",
    body: "We answer the question, not push you to a form. The whole site is built around helping you make a confident decision.",
  },
  {
    title: "Sourced and dated",
    body: "Every figure is tagged with where it came from and when it was last refreshed. If anything looks off, tell us, we'll fix it within a week.",
  },
  {
    title: "Free and ungated",
    body: "No paywall, no sign-up, no email gate to read or use anything. Suburb data, calculators and guides are free, full stop.",
  },
  {
    title: "Honest about money",
    body: "You pay nothing. Your details go only to the one agent we introduce you to, who pays us for the introduction. We say so on every introduction, and we never sell your details to anyone else.",
  },
];

// Section anchors are linked from the header, the footer, guide bylines and
// the Organization JSON-LD: #people, #ownership-funding, #methodology,
// #coverage, #corrections, and each writer's id.
const ON_THIS_PAGE: [string, string][] = [
  ["#people", "Who we are"],
  ["#ownership-funding", "How we're paid"],
  ["#methodology", "Editorial standards"],
  ["#corrections", "Corrections"],
  ["#contact", "Contact"],
];

const h2 = "font-display text-ink tracking-[-0.02em] text-[1.75rem] sm:text-4xl leading-tight font-bold";
const h3 = "font-display text-xl sm:text-2xl font-bold text-ink leading-snug tracking-[-0.01em]";
const textLink = "text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink";

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

      {/* Who we are, how we're paid, who to contact: in the first screen. */}
      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-10 sm:pb-16">
          <div className="mb-4 sm:mb-8">
            <Breadcrumbs items={[{ label: "About" }]} />
          </div>
          <div className="grid lg:grid-cols-12 gap-x-12 gap-y-8 items-start">
            <div className="lg:col-span-7">
              <h1 className="font-display text-ink tracking-[-0.035em] text-[2.25rem] leading-[1.04] sm:text-5xl lg:text-6xl font-bold">
                About Your Property Guide
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-xl text-ink leading-normal sm:leading-[1.45] max-w-2xl">
                Property is the biggest financial decision most Australians ever
                make. Most of the people explaining it have something to sell. We
                wrote this site because that&rsquo;s a problem. Free guides to
                selling and buying in every state, the calculators that go with
                them, and, when you ask, one local agent for a free appraisal. Our
                team talks to you first, and the agent pays us for the introduction.
              </p>
              <nav aria-label="On this page" className="mt-6">
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {ON_THIS_PAGE.map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className={`font-medium ${textLink}`}>{label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="lg:col-span-5 rounded-xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-ink mb-3">At a glance</h2>
              <dl className="divide-y divide-line text-sm">
                <div className="py-2.5 first:pt-0">
                  <dt className="font-semibold text-ink">What we do</dt>
                  <dd className="text-ink-muted">Free guides to selling and buying property, and one local agent for a free appraisal when you ask.</dd>
                </div>
                <div className="py-2.5">
                  <dt className="font-semibold text-ink">How we&rsquo;re paid</dt>
                  <dd className="text-ink-muted">Agents pay us a fee for each introduction. Buyers and sellers pay nothing.</dd>
                </div>
                <div className="py-2.5">
                  <dt className="font-semibold text-ink">Who owns it</dt>
                  <dd className="text-ink-muted">Profit Geeks Pty Ltd, an Australian-registered private company.</dd>
                </div>
                <div className="py-2.5">
                  <dt className="font-semibold text-ink">Editor</dt>
                  <dd className="text-ink-muted">Andy McMaster, Brisbane</dd>
                </div>
                <div className="py-2.5 last:pb-0">
                  <dt className="font-semibold text-ink">Contact</dt>
                  <dd className="text-ink-muted">
                    <a href={`tel:${CONTACT_PHONE_E164}`} className={`${textLink}`}>{CONTACT_PHONE_DISPLAY}</a>
                    {" · "}
                    <a href="mailto:andy@theandylife.com" className={textLink}>andy@theandylife.com</a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are: why the site exists, then the people. */}
      <section id="people" className="bg-white scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className={`${h2} mb-6`}>Who we are</h2>
          <div className="space-y-4 text-base sm:text-lg text-ink-muted leading-[1.7]">
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

          <p className="mt-10 mb-4 text-base text-ink-muted leading-relaxed">
            Every guide carries the byline of the person who wrote it and the
            name of the editor who reviewed it.
          </p>

          <div className="border-t border-line">
            <article
              id="andy-mcmaster"
              className="py-8 border-b border-line scroll-mt-24"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div className="flex items-start gap-4 sm:gap-5 mb-4">
                <Image
                  src="/images/agents/andy-mcmaster.jpg"
                  alt="Andy McMaster"
                  width={72}
                  height={72}
                  className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 rounded-full object-cover border border-line"
                />
                <div>
                  <h3 className={h3} itemProp="name">Andy McMaster</h3>
                  <p className="text-sm text-ink-muted" itemProp="jobTitle">Editor &amp; co-founder</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Writes about editorial direction, methodology, scheme &amp; policy commentary
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-base text-ink-muted leading-relaxed" itemProp="description">
                <p>
                  Andy runs editorial at Your Property Guide. His background is in
                  product and brand for Australian finance and property
                  businesses, including building yourfinanceguide.com.au and
                  several adjacent consumer-finance research sites. He
                  commissions every guide on the site, edits the copy, and signs
                  off before anything publishes.
                </p>
                <p>
                  Andy&rsquo;s job is to keep the editorial line honest:
                  education first, no pushy CTAs, every figure sourced and
                  dated. If you spot something on the site that doesn&rsquo;t
                  meet that standard, his inbox is the right place to flag it.
                </p>
              </div>
              <link itemProp="url" href={`${SITE_URL}/about#andy-mcmaster`} />
              <meta itemProp="email" content="andy@theandylife.com" />
            </article>

            <article
              id="bec-ramirez"
              className="py-8 border-b border-line scroll-mt-24"
              itemScope
              itemType="https://schema.org/Person"
            >
              <h3 className={h3} itemProp="name">Bec Ramirez</h3>
              <p className="text-sm text-ink-muted" itemProp="jobTitle">Property &amp; finance writer</p>
              <p className="mt-1 mb-4 text-sm text-ink-muted">
                Senior writer. Writes about property tax, lending, investment strategy, federal &amp; state policy
              </p>
              <div className="space-y-4 text-base text-ink-muted leading-relaxed" itemProp="description">
                <p>
                  Bec is our senior writer on the tax, lending and investment
                  side of property. She came to Your Property Guide from a
                  mortgage broking background, where she spent several years
                  walking first home buyers and seasoned investors through the
                  mechanics of structuring, serviceability and tax-efficient
                  ownership.
                </p>
                <p>
                  On the site she covers negative gearing, capital gains tax,
                  depreciation, SMSF property, foreign buyer rules, and the
                  federal and state policy changes that move the market.
                  She&rsquo;s the writer behind most of our budget coverage and
                  the calculators that underpin it.
                </p>
                <p>
                  Her brief is to translate complex tax and lending detail into
                  plain English without losing the nuance that actually changes
                  the numbers on a deal.
                </p>
              </div>
              <link itemProp="url" href={`${SITE_URL}/about#bec-ramirez`} />
            </article>

            <article
              id="ellie-johnston"
              className="py-8 border-b border-line scroll-mt-24"
              itemScope
              itemType="https://schema.org/Person"
            >
              <h3 className={h3} itemProp="name">Ellie Johnston</h3>
              <p className="text-sm text-ink-muted" itemProp="jobTitle">Market &amp; suburb research</p>
              <p className="mt-1 mb-4 text-sm text-ink-muted">
                Senior writer. Writes about capital-city market updates, suburb profiles, state buying
                guides, regional research
              </p>
              <div className="space-y-4 text-base text-ink-muted leading-relaxed" itemProp="description">
                <p>
                  Ellie leads our market and suburb research. Her background is
                  in property data journalism, pulling apart Valuer-General
                  releases, ABS data, and listing-portal aggregates to find the
                  story behind the median.
                </p>
                <p>
                  She writes the capital-city market updates, state-by-state
                  buying guides, regional research and most of the suburb
                  profiles on the site. Every figure she publishes carries a
                  source and an as-of date, and her drafts get reviewed by the
                  editor before they go live.
                </p>
                <p>
                  Ellie&rsquo;s priority is making sure the data on Your
                  Property Guide is current, comparable, and useful, not just
                  pretty.
                </p>
              </div>
              <link itemProp="url" href={`${SITE_URL}/about#ellie-johnston`} />
            </article>
          </div>
        </div>
      </section>

      {/* How we're paid, and who owns the site. #ownership-funding is the
          JSON-LD ownershipFundingInfo anchor and the header's "How we're
          paid" link. */}
      <section id="ownership-funding" className="bg-surface-warm border-y border-line scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className={`${h2} mb-6`}>How we&rsquo;re paid</h2>
          <div className="space-y-4 text-base sm:text-lg text-ink-muted leading-[1.7]">
            <p>
              Buyers and sellers pay nothing. When you&rsquo;re ready to sell,
              we&rsquo;ll introduce you to one local agent who sells in your area.
              If we don&rsquo;t have one yet, we&rsquo;ll tell you. The agent pays
              us a fee for the introduction. It&rsquo;s not a share of their
              commission, and they pay it whether or not you go ahead with them.
            </p>
            <p>
              That fee comes out of their pocket, not yours. It doesn&rsquo;t
              change what you pay: you agree any commission or fee directly
              with them. We disclose this on every introduction. We never sell
              your details, and we never pass them to a second agent. We don&rsquo;t accept fees from anyone we
              wouldn&rsquo;t use ourselves. And the data,
              guides, calculators and suburb profiles stay free regardless.
            </p>
          </div>

          <h3 className={`${h3} mt-10 mb-3`}>Who owns Your Property Guide</h3>
          <div className="space-y-4 text-base text-ink-muted leading-relaxed">
            <p>
              Your Property Guide is owned and operated by Profit Geeks
              Pty Ltd, an Australian-registered private company. We&rsquo;re
              independently funded. No venture capital, no media-group
              ownership, no real estate franchise or aggregator behind the
              scenes.
            </p>
            <p>
              100% of our revenue comes from introduction fees paid by
              partner agents. When you ask to be connected with an agent,
              your details go to one agent only, and they pay us a fee for
              that introduction.
              It&rsquo;s not a share of their commission, and it
              doesn&rsquo;t depend on a sale or job going ahead. No
              advertising. No paid placements in editorial. No fees from any
              party we wouldn&rsquo;t recommend to our own family. Partner
              relationships are disclosed on every introduction and on every
              Best Deal listing.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial standards. #methodology is the JSON-LD publishingPrinciples
          and ethicsPolicy anchor; #coverage the diversityPolicy one. */}
      <section id="methodology" className="bg-white scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className={`${h2} mb-6`}>Editorial standards</h2>
          <dl className="grid sm:grid-cols-2 gap-x-8 border-t border-line mb-10">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="border-b border-line py-4">
                <dt className="font-semibold text-ink">{p.title}</dt>
                <dd className="mt-1 text-sm text-ink-muted leading-relaxed">{p.body}</dd>
              </div>
            ))}
          </dl>

          <h3 className={`${h3} mb-3`}>How we write, source, and update</h3>
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
              <strong>AI usage.</strong>{" "}We don&rsquo;t publish AI-generated
              copy. AI may be used for research summarisation and outline
              drafting by the editor, but every word that ships through our
              site is written and edited by named humans.
            </p>
            <p>
              <strong>Updates.</strong> Guides are reviewed at least annually,
              and immediately after any material law or scheme change (state
              budget changes, Home Guarantee Scheme changes, RBA rate
              decisions, ATO determinations). Each guide shows the published
              date and the last-reviewed date in the byline.
            </p>
            <p>
              The sources behind every suburb figure, and the rule that withholds
              one, are on the <Link href="/methodology">methodology page</Link>.
            </p>
          </div>

          <div id="coverage" className="mt-10 scroll-mt-24">
            <h3 className={`${h3} mb-3`}>Who we write for, and how we decide what to publish</h3>
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

      {/* Corrections. Anchor for the actionableFeedbackPolicy statement. */}
      <section id="corrections" className="bg-surface-warm border-t border-line scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className={`${h2} mb-6`}>Corrections</h2>
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
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-white border-t border-line scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className={`${h2} mb-4`}>Contact</h2>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed mb-6">
            For broader feedback, topics we should cover, gaps in our
            guides or suggestions for the data, use our contact form or email
            the editor directly.
          </p>
          <dl className="grid sm:grid-cols-3 gap-x-8 border-t border-line">
            <div className="border-b border-line py-4">
              <dt className="text-sm font-semibold text-ink">Phone</dt>
              <dd className="mt-1">
                <a href={`tel:${CONTACT_PHONE_E164}`} className={`${textLink}`}>{CONTACT_PHONE_DISPLAY}</a>
              </dd>
            </div>
            <div className="border-b border-line py-4">
              <dt className="text-sm font-semibold text-ink">Email</dt>
              <dd className="mt-1">
                <a href="mailto:andy@theandylife.com" className={textLink}>andy@theandylife.com</a>
              </dd>
            </div>
            <div className="border-b border-line py-4">
              <dt className="text-sm font-semibold text-ink">Contact form</dt>
              <dd className="mt-1">
                <Link href="/contact" className={textLink}>Send us a message</Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
