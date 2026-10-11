import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { MatchAgentEmbed, TrustStrip } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { CAV_PROPERTY_PRICES, NSW_AGENCY_AGREEMENTS, QLD_COMMISSION, cite } from "@/lib/data/appraisal-sources";
import { CHOOSING_POINTS, COMMISSION_RULE_SOURCES } from "@/lib/suburb-agents";

// The canonical matters here more than on most pages: every suburb and
// rental-market page links to this one with its own query string
// (?intent=…&suburb=…), and without a canonical each of those was a separate
// duplicate to a crawler (Search Console, "Duplicate without user-selected
// canonical", 29 Sep 2026).
// Section 3.2 of the 10 Oct 2026 review: "find a real estate agent" (170 a
// month on Google, 444 AI searches) has government pages unrelated to agents
// at positions 3 to 8, and this page carried neither the phrase nor FAQ
// schema. Title inside 60 characters before the brand suffix.
const TITLE = "Find a Real Estate Agent or Property Expert: Free Intro";
const DESCRIPTION =
  "Find a real estate agent, buyer's agent or broker for your area: how to choose one, what agents charge by state, and one free introduction where we have one.";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/find-an-expert` },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { url: `${SITE_URL}/find-an-expert`, title: TITLE, description: DESCRIPTION, type: "website" },
};

const COMMISSION_STATES = Object.keys(STATE_RATES) as StateCode[];

const REB_TOP_100_2026 = {
  label: "Real Estate Business: Who are the Top 100 Agents of 2026 in Australia?",
  href: "https://www.realestatebusiness.com.au/rankings/31934-who-are-the-top-100-agents-of-2026-in-australia",
  published: "5 June 2026",
  read: "11 October 2026",
};

const CAV_SELLING = {
  label: "Consumer Affairs Victoria: Selling property with or without an agent",
  href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/selling-property/selling-property-with-or-without-an-agent",
  updated: "5 May 2021",
  read: "11 October 2026",
};

// People Also Ask on the "find", "compare" and "how to choose" SERPs, and the
// AI-search questions in section 6 of the review. Answers name their source
// and date; nothing ranks agents or promises a match.
const FIND_AGENT_FAQS: { question: string; answer: string }[] = [
  {
    question: "What is the best way to find a real estate agent?",
    answer:
      "Shortlist three agents with recent sales in your own suburb, not just the region, and ask each the same questions: the comparable sales behind their price, their commission and marketing costs in writing including GST, the method of sale they recommend and how they will report to you. Choose on the evidence, not the highest price. Every suburb page on this site links to a page on its agents with the state's fee range and these questions.",
  },
  {
    question: "How do I find the best estate agent in my area?",
    answer: `Ask two or three agents who sell in your suburb for their estimated selling price and the comparable sales behind it, then compare evidence, fee and marketing. In NSW the agency agreement must state that estimate, and a range cannot have a top more than 10% above its bottom (${cite(NSW_AGENCY_AGREEMENTS, "NSW Government, Agency agreements")}). In Victoria the estimate must be reasonable and based on comparable sales (${cite(CAV_PROPERTY_PRICES, "Consumer Affairs Victoria")}).`,
  },
  {
    question: "Who is the most successful real estate agent in Australia?",
    answer: `No official body ranks agents. The best-known list is Real Estate Business's Top 100 Agents: the 2026 edition (published ${REB_TOP_100_2026.published}) ranks agents on their 2025 results, mainly the value of settled residential sales, the number sold and the average price. Its 100 agents sold 12,154 properties worth $28.4 billion in 2025, and PPD Real Estate's Alexander Phillips ranked first for the 11th year. A national ranking says little about your sale: ask agents for their recent sales in your own suburb.`,
  },
  {
    question: "Which estate agent has the lowest fees?",
    answer: `No agency is cheapest everywhere: commission is agreed with each agent and can be negotiated. Our typical ranges run from ${Math.min(...COMMISSION_STATES.map((s) => STATE_RATES[s].low))}% to ${Math.max(...COMMISSION_STATES.map((s) => STATE_RATES[s].high))}% of the sale price depending on the state (table above). Compare quotes all-in, including GST and the marketing budget, and on what each agent will do for the fee.`,
  },
  {
    question: "Do all estate agents work on no sale, no fee?",
    answer: `No. When commission is earned depends on the agreement you sign. In NSW the agreement must carry a warning if commission is payable even when a sale is not completed (${cite(NSW_AGENCY_AGREEMENTS, "NSW Government, Agency agreements")}); in Queensland the appointment must say whether commission may still apply if the sale does not go through (${cite(QLD_COMMISSION, "Queensland Government")}). Marketing costs are set out separately in the agreement, so read both clauses before you sign.`,
  },
  {
    question: "How can I avoid paying estate agent fees?",
    answer: `You can sell without an agent: Consumer Affairs Victoria notes that most sales go through an agent but you can choose to sell your property without one (Selling property with or without an agent, updated ${CAV_SELLING.updated}). You then run the marketing, inspections and negotiation yourself and still pay for the contract and conveyancing. With an agent, the commission and other outgoings are negotiable, and in Victoria the agent must tell you so.`,
  },
  {
    question: "Does it cost anything to ask Your Property Guide for an introduction?",
    answer:
      "No. The introduction is free for buyers and sellers and carries no obligation. Your details go to one agent or specialist only, who pays us a fee for the introduction. Where we do not yet have one who covers your area, we tell you rather than pass your details on.",
  },
];

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/find-an-expert#service`,
  name: "Real estate agent introduction",
  serviceType: "Real estate agent introduction",
  description:
    "A free introduction to one real estate agent, buyer's agent, mortgage broker or other property specialist who covers the enquirer's area, where Your Property Guide has one. The specialist pays a fee for the introduction.",
  url: `${SITE_URL}/find-an-expert`,
  provider: { "@type": "Organization", "@id": `${SITE_URL}#organization`, name: SITE_NAME, url: SITE_URL },
  areaServed: { "@type": "Country", name: "Australia" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD", description: "Free for buyers and sellers." },
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
      "Look for a listing agent who knows your suburb: recent sales, what buyers are paying, the right campaign for your property. Not the agent who knocks on the door with a flyer; one who is selling in your street.",
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
      "A mortgage broker compares loans from a panel of lenders, not just one bank, and can tell you which lenders' policies fit your situation, what documents you need, and what an approval would depend on.",
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
      "Property situations don't always reduce to buy/sell/invest. Tell us what is going on: where we have a specialist who handles it, such as a property accountant, conveyancer, family lawyer or estate planner, we introduce one; where we don't, we tell you.",
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
    title: "We look for one specialist",
    body:
      "Where we have one who covers your area and your situation, we introduce them. Not three competing quotes, not a bidding war for your enquiry. Where we don't, we tell you.",
  },
  {
    step: "03",
    title: "They get in touch, or we tell you we can't help yet",
    body:
      "By phone or email, your choice. No commitment until you decide to take the next step.",
  },
];

export default function FindAnExpertPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Find an expert", url: "/find-an-expert" }]} />
      <JsonLd data={SERVICE_JSON_LD} />
      <FAQPageJsonLd faqs={FIND_AGENT_FAQS} />

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
                Find a real estate agent, buyer&rsquo;s agent or broker.{" "}
                <span className="italic font-light text-primary">One introduction, free.</span>
              </h1>
              <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-2xl mb-10">
                Tell us what you are selling or buying and where. Where we have a
                licensed agent or specialist who works in your area, we introduce
                one; the specialist pays us a fee for the introduction and you pay
                nothing. No commitment, no comparison spam.
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
                  { lead: "One introduction, not five.", body: "Where we have a specialist for your area, you hear from one, not five competing quotes." },
                  { lead: "We tell you either way.", body: "Where we have no one for your area yet, we say so rather than pass your details on." },
                  { lead: "Free for buyers and sellers.", body: "The specialist pays us a fee for each introduction." },
                  { lead: "Never passed around.", body: "Your details go only to the specialist you're matched with. We never sell them to anyone else." },
                ]}
              />
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/expert-match.svg"
                  alt=""
                  aria-hidden="true"
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
              Whichever bucket you&rsquo;re in, here is who can help.
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
            <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">How matching works</p>
            <p className="font-sans text-base text-ink-muted leading-relaxed">
              Every enquiry is read by our team. Where we have a specialist for
              your situation in your area, we introduce one, no call centre, no
              comparison spam; where we don&rsquo;t, we tell you rather than pass
              your details on.
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

      {/* Finding an agent yourself (section 3.2 of the 10 Oct 2026 review):
          the steps, the criteria, the fees by state and the questions. */}
      <section className="py-16 sm:py-20 border-t border-line">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
              How to find a real estate agent to sell your house
            </h2>
            <ol className="space-y-3 font-sans text-base text-ink-muted leading-relaxed list-decimal pl-5">
              <li>List the agents with recent sales in your suburb: sold listings on the portals and the boards in your street show who is selling there now. Your <Link href="/suburbs" className="text-ink underline decoration-line-strong underline-offset-2 hover:text-primary">suburb&rsquo;s page</Link> links to a page on its agents, with the state&rsquo;s fee range.</li>
              <li>Ask three of them for an appraisal, each with the comparable sales behind the figure. It is free and commits you to nothing.</li>
              <li>Get each agent&rsquo;s commission, marketing budget and method of sale in writing, with GST shown.</li>
              <li>Compare the evidence, not the highest number, and read the agency agreement before you sign: how long it runs, when commission is earned and what you pay if it does not sell.</li>
            </ol>
          </div>

          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
              How to find a good agent in your area
            </h2>
            <p className="font-sans text-base text-ink-muted leading-relaxed mb-5">
              Five things separate a good agent for your sale from a good pitch. Ask every agent on your list the same questions, in the same order.
            </p>
            <ol className="grid md:grid-cols-2 gap-4">
              {CHOOSING_POINTS.map((p, i) => (
                <li key={p.point} className="rounded-2xl border border-line bg-surface-raised p-5 flex gap-4">
                  <span className="font-display text-2xl text-primary leading-none tabular-nums">{i + 1}</span>
                  <div>
                    <p className="font-sans font-medium text-ink">{p.point}</p>
                    <p className="font-sans text-sm text-ink-muted mt-1 leading-relaxed">{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 font-sans text-sm">
              <Link href="/guides/questions-to-ask-a-real-estate-agent" className="text-ink underline decoration-line-strong underline-offset-2 hover:text-primary">Questions to ask a real estate agent</Link>
              <span className="text-ink-subtle"> · </span>
              <Link href="/guides/how-to-choose-a-selling-agent" className="text-ink underline decoration-line-strong underline-offset-2 hover:text-primary">How to choose a real estate agent</Link>
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-5">
              What agents charge, by state
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[480px] font-sans text-sm text-left border-collapse">
                <thead className="bg-surface-warm">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium text-ink">State</th>
                    <th scope="col" className="px-4 py-3 font-medium text-ink">Typical commission</th>
                    <th scope="col" className="px-4 py-3 font-medium text-ink">Common rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {COMMISSION_STATES.map((st) => (
                    <tr key={st}>
                      <th scope="row" className="px-4 py-3 font-medium text-ink">
                        <Link href={`/guides/real-estate-commission-${st.toLowerCase()}`} className="underline decoration-line-strong underline-offset-2 hover:text-primary">{st}</Link>
                      </th>
                      <td className="px-4 py-3 text-ink-muted tabular-nums">{STATE_RATES[st].low}% to {STATE_RATES[st].high}%</td>
                      <td className="px-4 py-3 text-ink-muted tabular-nums">{STATE_RATES[st].typical}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 font-sans text-xs text-ink-subtle leading-relaxed">
              Before GST and marketing. Your Property Guide&rsquo;s typical ranges as at September 2026; each state&rsquo;s commission guide (linked) explains its range. Commission is agreed with the agent:{" "}
              {(Object.entries(COMMISSION_RULE_SOURCES) as [StateCode, NonNullable<(typeof COMMISSION_RULE_SOURCES)[StateCode]>][]).map(([st, src], i, all) => (
                <span key={st}>
                  <a href={src.href} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">{STATE_NAMES[st]}</a> ({src.asAt}): {src.says}{i < all.length - 1 ? "; " : "."}
                </span>
              ))}
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              Finding an agent: common questions
            </h2>
            <dl className="divide-y divide-line border-y border-line">
              {FIND_AGENT_FAQS.map((f) => (
                <div key={f.question} className="py-5">
                  <dt className="font-display text-lg text-ink leading-snug mb-2">{f.question}</dt>
                  <dd className="font-sans text-base text-ink-muted leading-relaxed">{f.answer}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-10 font-display text-lg text-ink mb-3">Sources</h3>
            <ul className="space-y-1.5 font-sans text-xs text-ink-subtle">
              {[
                { label: NSW_AGENCY_AGREEMENTS.label, href: NSW_AGENCY_AGREEMENTS.href, note: `updated ${NSW_AGENCY_AGREEMENTS.updated}, read ${NSW_AGENCY_AGREEMENTS.read}` },
                { label: CAV_PROPERTY_PRICES.label, href: CAV_PROPERTY_PRICES.href, note: `updated ${CAV_PROPERTY_PRICES.updated}, read ${CAV_PROPERTY_PRICES.read}` },
                { label: CAV_SELLING.label, href: CAV_SELLING.href, note: `updated ${CAV_SELLING.updated}, read ${CAV_SELLING.read}` },
                { label: QLD_COMMISSION.label, href: QLD_COMMISSION.href, note: `updated ${QLD_COMMISSION.updated}, read ${QLD_COMMISSION.read}` },
                { label: REB_TOP_100_2026.label, href: REB_TOP_100_2026.href, note: `published ${REB_TOP_100_2026.published}, read ${REB_TOP_100_2026.read}` },
              ].map((src) => (
                <li key={src.href}>
                  <a href={src.href} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">{src.label}</a>, {src.note}.
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why we're free */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Why we&rsquo;re free</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-6">
            Buyers and sellers pay nothing. Specialists pay us a fee for each introduction.
          </h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
            We disclose this on every match. The fee comes out of the
            specialist&rsquo;s pocket and doesn&rsquo;t change what you pay them.
            Your details go only to the one specialist you&rsquo;re matched with.
            We never sell them to anyone else, and we don&rsquo;t take fees from
            anyone we wouldn&rsquo;t use ourselves.
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
