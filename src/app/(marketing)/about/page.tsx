import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164, SITE_NAME, SITE_URL } from "@/lib/constants";
import { Band, RuleGrid, RuleItem, SectionHeading } from "@/components/premium";
import { FOUNDER } from "@/lib/founder";
import { AGREEMENT_CHECK, LICENCE_REGISTERS, PARTNER_CHECKS, PROMISE } from "@/lib/service-model";

export const metadata: Metadata = {
  // Aligned with the education-led repositioning (2026-05). The about
  // page is the canonical "why we exist" — and the answer is now
  // education, not reference.
  title: `About ${SITE_NAME}: Andy McMaster and the $20 million campaign`,
  description: "Andy McMaster sold $10 million to $20 million homes across Australia, then advised big property companies. Why every home deserves the same campaign, and how we’re paid.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { url: `${SITE_URL}/about`, title: `About ${SITE_NAME}: Andy McMaster and the $20 million campaign`, description: "Why every home deserves a $20 million campaign, who writes the guides, and how we’re paid.", type: "website" },
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
    body: "You pay nothing. Your details go only to the one agent we introduce you to, who pays us a flat fee for the introduction, never a share of their commission. We say so on every introduction, and we never sell your details to anyone else.",
  },
];

// Section anchors are linked from the header, the footer, guide bylines and
// the Organization JSON-LD: #story, #people, #ownership-funding, #checks,
// #methodology, #coverage, #corrections, and each writer's id.
const ON_THIS_PAGE: [string, string][] = [
  ["#story", "Andy’s story"],
  ["#ownership-funding", "How we’re paid"],
  ["#checks", "How we check agents"],
  ["#people", "Who writes the guides"],
  ["#methodology", "Editorial standards"],
  ["#corrections", "Corrections"],
  ["#contact", "Contact"],
];

const h3 = "text-xl sm:text-2xl font-bold text-ink leading-snug tracking-[-0.01em]";
const textLink = "text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink";
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.2em] text-primary";

// Andy's story, in his words (the 15 Oct 2026 brief, used as written). The
// facts in it are the ones in src/lib/founder.ts and nothing else.
const STORY: readonly string[] = [
  "At the top end, nobody leaves the result to the market. Before anyone names a price, the evidence is on the table. The home is styled, shot and launched for the one buyer who’ll pay the most. Every offer is negotiated as though the last $50,000 matters, because it does.",
  "In the past five years, my advice has generated over $4 billion in property sales, and it all comes back to one lesson. The price you get comes down to the campaign. A good market won’t save a weak campaign, and a slack agent can’t hide behind a slow one. The campaign decides it.",
  "And it works the same way at every price point. What gets a harbourfront home its maximum price is exactly what gets it for a two-bedroom unit or a first home in the suburbs. The only difference is who gets shown how.",
  "So I built Your Property Guide to give every Australian the $20 million playbook. You’ll know your number before an agent quotes you, what selling or buying really costs, how to build a campaign on evidence, and how to tell a negotiator from a flatterer.",
  "When you’re ready, we’ll introduce you to one agent who has proven they run campaigns this way in your suburb. Just one, checked by us. We don’t take a cut of their commission, so we only ever introduce someone we’d trust with our own home.",
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "About", url: "/about" }]} />
      <PersonJsonLd
        id={FOUNDER.id}
        name={FOUNDER.name}
        jobTitle="Founder and editor"
        bio={FOUNDER.facts.join(" ")}
        image={FOUNDER.photo}
        sameAs={["https://www.linkedin.com/in/andymcmaster"]}
      />

      {/* The story's opening: the line, the first paragraph and the
          portrait, then the page's own contents. */}
      <section aria-labelledby="about-title" className="bg-cream">
        <div className={`${SHELL} pb-16 pt-4 sm:pb-20 lg:pb-24`}>
          <Breadcrumbs items={[{ label: "About" }]} />
          <div className="mt-6 grid items-center gap-12 lg:mt-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className={eyebrow}>Andy’s story</p>
              <h1 id="about-title" className="mt-5 text-[42px] leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[72px]">
                It’s the campaign that wins. <em className="font-normal italic text-accent-dark">Not the market. Not luck.</em>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                I started my career selling the very top of the Australian market, homes worth $10 million to $20 million, all over the country. After two years I was head-hunted to advise some of the biggest companies in property.
              </p>
              <nav aria-label="On this page" className="mt-9 border-t border-line pt-6">
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {ON_THIS_PAGE.map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className={`font-medium ${textLink}`}>{label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="lg:col-span-5">
              <figure className="relative mx-auto max-w-[440px] lg:mx-0 lg:ml-auto">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-warm shadow-card">
                  {/* TODO(andy): real photo. This is the portrait already on
                      the site; replace it with the new one when it's shot. */}
                  <Image src={FOUNDER.photo} alt={`${FOUNDER.name}, founder of Your Property Guide`} fill preload sizes="(min-width: 1024px) 440px, 90vw" className="object-cover object-top" />
                </div>
                <div className="tone-dark absolute -bottom-6 left-4 right-4 rounded-2xl bg-eucalyptus p-5 shadow-card sm:left-auto sm:right-[-1.5rem] sm:w-64">
                  <p className="font-display text-[40px] leading-none text-primary">{FOUNDER.salesStat.value}</p>
                  <p className="mt-2 text-sm leading-snug text-ink-muted">{FOUNDER.salesStat.label}</p>
                </div>
                <figcaption className="sr-only">{`${FOUNDER.name}, founder`}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* The rest of the story, as Andy wrote it, beside the facts about
          the business. */}
      <section id="story" aria-label="Andy’s story" className="scroll-mt-20 border-t border-line bg-white py-16 sm:py-24">
        <div className={`${SHELL} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-7">
            <div className="max-w-2xl space-y-6 text-lg leading-[1.75] text-ink sm:text-[19px]">
              {STORY.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="mt-12 max-w-2xl font-display text-[34px] leading-[1.12] tracking-[-0.015em] text-ink sm:text-[44px]">
              {PROMISE.closing}
            </p>
            <p className="mt-6">
              <span className="block font-display text-[28px] italic leading-none text-ink">{FOUNDER.name}</span>
              <span className="mt-2 block text-sm text-ink-muted">Founder, Your Property Guide</span>
            </p>
          </div>

          <aside className="lg:col-span-5 lg:pt-1">
            <div className="rounded-3xl border border-line bg-cream p-6 sm:p-7 lg:sticky lg:top-28">
              <h2 className="font-sans text-sm font-semibold tracking-normal text-ink">At a glance</h2>
              <dl className="mt-3 divide-y divide-line text-[15px]">
                <div className="py-3 first:pt-0">
                  <dt className="font-semibold text-ink">What we do</dt>
                  <dd className="mt-0.5 text-ink-muted">Free guides and tools for selling and buying, then, when you ask, one agent for each job you ask us to help with.</dd>
                </div>
                <div className="py-3">
                  <dt className="font-semibold text-ink">How we’re paid</dt>
                  <dd className="mt-0.5 text-ink-muted">Agents pay us a flat fee for each introduction. We take 0% of their commission, and buyers and sellers pay nothing.</dd>
                </div>
                <div className="py-3">
                  <dt className="font-semibold text-ink">Before you sign</dt>
                  <dd className="mt-0.5 text-ink-muted">
                    A free 15-minute check of your agency agreement.{" "}
                    <Link href={AGREEMENT_CHECK.href} className={textLink}>Book it</Link>
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="font-semibold text-ink">Who owns it</dt>
                  <dd className="mt-0.5 text-ink-muted">Profit Geeks Pty Ltd, an Australian-registered private company.</dd>
                </div>
                <div className="py-3 last:pb-0">
                  <dt className="font-semibold text-ink">Contact</dt>
                  <dd className="mt-0.5 text-ink-muted">
                    <a href={`tel:${CONTACT_PHONE_E164}`} className={textLink}>{CONTACT_PHONE_DISPLAY}</a>
                    {" · "}
                    <a href="mailto:andy@theandylife.com" className={textLink}>andy@theandylife.com</a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* How we're paid, and who owns the site. #ownership-funding is the
          JSON-LD ownershipFundingInfo anchor and the "How we're paid" link
          beside every introduction form. */}
      <Band tone="dark" id="ownership-funding" className="scroll-mt-16">
        <div className="max-w-3xl">
          <p className={eyebrow}>How we’re paid</p>
          <SectionHeading title="A flat fee from the agent. Never a cut of their commission." />
          <div className="mt-8 space-y-4 text-base sm:text-lg text-ink-muted leading-[1.7]">
            <p>
              Buyers and sellers pay nothing. When you ask, and tick the
              permission box, we introduce you to one participating agent who
              covers your area for each job you ask us to help with: a selling
              agent, or a buyer&rsquo;s agent where we can. If we can&rsquo;t
              cover your area, we tell you. The agent pays us a flat fee for the
              introduction. It&rsquo;s not a share of their commission, and they
              pay it whether or not you go ahead with them.
            </p>
            <p>
              That fee comes out of their pocket, not yours. It doesn&rsquo;t
              change what you pay: you agree any commission or fee directly
              with them. We disclose this on every introduction. We never sell
              your details, and we never pass your request to a second agent. We don&rsquo;t accept fees from anyone we
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
              Our revenue comes from introduction fees paid by the agents we
              introduce people to. When you ask to be connected with an agent,
              your details go to one agent only, and they pay us a flat fee for
              that introduction.
              It&rsquo;s not a share of their commission, and it
              doesn&rsquo;t depend on a sale or job going ahead. No
              advertising. No paid placements in editorial. No fees from any
              party we wouldn&rsquo;t recommend to our own family. Partner
              relationships are disclosed on every introduction form and in
              every introduction email.
            </p>
          </div>
        </div>
      </Band>

      {/* The four checks every partner agent passes, with the registers to
          check any agent yourself. */}
      <Band tone="quiet" id="checks" className="scroll-mt-16">
        <p className={eyebrow}>How we check agents</p>
        <SectionHeading title="Every agent we introduce passes four checks" intro="Just one agent for each job, checked by us. Here’s what each check means, and how to look any agent up yourself." />
        <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_CHECKS.map((c, i) => (
            <li key={c.title} className="border-t-2 border-ink pt-6">
              <span className="font-display text-[32px] leading-none text-accent-dark" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl text-ink">{c.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-muted">{c.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 border-t border-line pt-6">
          <p className="text-[15px] font-semibold text-ink">Check any agent’s licence on their state’s register</p>
          <ul className="mt-3 grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2 lg:grid-cols-4">
            {LICENCE_REGISTERS.map((r) => (
              <li key={r.state}>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={textLink}>
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* Who writes the guides. Each writer's id is a byline anchor. */}
      <Band id="people" className="scroll-mt-16">
        <div className="max-w-3xl">
          <SectionHeading title="Who writes the guides" />
          <p className="mt-6 mb-4 text-base text-ink-muted leading-relaxed">
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
                  src={FOUNDER.photo}
                  alt={FOUNDER.name}
                  width={72}
                  height={72}
                  className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 rounded-full object-cover border border-line"
                />
                <div>
                  <h3 className={h3} itemProp="name">{FOUNDER.name}</h3>
                  <p className="text-sm text-ink-muted" itemProp="jobTitle">Founder and editor</p>
                </div>
              </div>
              <div className="space-y-4 text-base text-ink-muted leading-relaxed" itemProp="description">
                {FOUNDER.facts.map((f) => (
                  <p key={f.slice(0, 24)}>{f}</p>
                ))}
                <p>
                  Andy edits every guide on the site and signs it off before it
                  publishes. If you spot something that doesn&rsquo;t meet that
                  standard, his inbox is the right place to flag it.
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
      </Band>

      {/* Editorial standards. #methodology is the JSON-LD publishingPrinciples
          and ethicsPolicy anchor; #coverage the diversityPolicy one. */}
      <Band id="methodology" className="scroll-mt-16">
        <div className="max-w-3xl">
          <SectionHeading title="Editorial standards" />
          <RuleGrid columns={2} className="mt-10 mb-14">
            {PRINCIPLES.map((p) => (
              <RuleItem key={p.title} title={p.title}>{p.body}</RuleItem>
            ))}
          </RuleGrid>

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
      </Band>

      {/* Corrections. Anchor for the actionableFeedbackPolicy statement. */}
      <Band tone="quiet" id="corrections" className="scroll-mt-16">
        <div className="max-w-3xl">
          <SectionHeading title="Corrections" />
          <div className="mt-8 prose-ypg">
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
      </Band>

      {/* Contact */}
      <Band id="contact" className="scroll-mt-16">
        <div className="max-w-3xl">
          <SectionHeading title="Contact" />
          <p className="mt-6 text-base sm:text-lg text-ink-muted leading-relaxed mb-8">
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
      </Band>
    </>
  );
}
