import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Band, BUTTON_PRIMARY, BUTTON_SECONDARY, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { HelpBand } from "@/components/journeys/ServiceSections";
import { Faq } from "@/components/guide";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { SERVICES } from "@/lib/service-model";
import { NumbersPanel } from "@/components/interactive/NumbersPanel";

// /buying: where buyers start (Oct 2026). Replaces the old /buy listings page
// (legacy demo listings, redirected here). What to do at each stage, the
// tools for it, the difference between a selling agent and a buyer's agent,
// and personal help with honest availability.

export const metadata: Metadata = {
  title: "Buying property in Australia: where to start",
  description:
    "What to do at each stage of buying a home in Australia: budget and schemes, finance, inspections, offers and settlement, with free calculators, a next-step plan and an honest guide to buyer’s agents.",
  alternates: { canonical: `${SITE_URL}/buying` },
};

const START = [
  { label: "First home buyers", href: "/first-home-buyers", note: "Grants, duty concessions and federal schemes by state" },
  { label: "Buying your next home", href: "/upgrading", note: "Upgrading, and the timing of a sale and a purchase" },
  { label: "Investing", href: "/investing", note: "Yield, growth, tax and holding costs" },
  { label: "Downsizing", href: "/guides/downsizers-guide", note: "Costs, super contributions and timing" },
  { label: "Buyer’s agents", href: "/buyers-agents", note: "What they do, what they charge, and whether you need one" },
];

const STAGES = [
  {
    title: "Budget and schemes",
    body: "Know what a lender might lend, what you can comfortably repay, and the costs on top of the deposit.",
    links: [
      { label: "Borrowing power calculator", href: "/borrowing-power-calculator" },
      { label: "Stamp duty calculator", href: "/stamp-duty-calculator" },
      { label: "How much deposit do you need?", href: "/guides/how-much-deposit-to-buy-a-house" },
      { label: "First home buyer guide", href: "/guides/first-home-buyer-guide" },
    ],
  },
  {
    title: "Finance",
    body: "Pre-approval sets your real price range. Know what it covers, what it doesn’t, and when it expires.",
    links: [
      { label: "Home loan pre-approval", href: "/guides/home-loan-pre-approval-australia" },
      { label: "Choosing a mortgage broker", href: "/guides/how-to-choose-a-mortgage-broker" },
      { label: "LMI calculator", href: "/lmi-calculator" },
      { label: "Mortgage repayment calculator", href: "/mortgage-calculator" },
    ],
  },
  {
    title: "Searching and inspecting",
    body: "Use the same checklist every time, and judge prices against what similar homes actually sold for.",
    links: [
      { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house" },
      { label: "Building and pest inspections", href: "/guides/building-pest-inspection" },
      { label: "Suburb profiles", href: "/suburbs" },
    ],
  },
  {
    title: "Offer, contract and settlement",
    body: "Set your limit first, know your state’s contract rules, and prepare differently for an auction.",
    links: [
      { label: "Negotiating the price", href: "/guides/how-to-negotiate-property-price-australia" },
      { label: "Buying at auction", href: "/guides/property-auction-guide" },
      { label: "Cooling-off periods by state", href: "/guides/cooling-off-period-by-state-australia" },
      { label: "Settlement day", href: "/guides/settlement-day-australia" },
    ],
  },
];

const FAQS = [
  {
    question: "What’s the difference between a selling agent and a buyer’s agent?",
    answer:
      "A selling agent acts for the vendor and is paid by the vendor to get the best price for them. A buyer’s agent acts only for you, the buyer, and you pay their fee. At an open home, the agent you meet works for the seller.",
  },
  {
    question: "Do I need a buyer’s agent?",
    answer:
      "Most people buy without one. A buyer’s agent can help if you’re buying somewhere you don’t know, from interstate, at a higher price, or if you’re short on time or uncomfortable negotiating or bidding. Weigh their fee against those benefits, and get it in writing.",
  },
  {
    question: "If I download the buying guide or make a plan, will an agent contact me?",
    answer:
      "No. Guides, calculators and plans never pass your details to anyone. An introduction only happens if you ask for one on our help form and tick the permission box.",
  },
  {
    question: "Does using Your Property Guide cost anything?",
    answer:
      "No. The guides, tools and plans are free. If you ask us to introduce you to a buyer’s agent and we can, the agent pays us a flat fee for the introduction, never a share of their fee. You agree the agent’s own fee directly with them.",
  },
];

export default function BuyingHubPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Buying", url: "/buying" }]} />
      <PhotoHero photo="buying" breadcrumbs={[{ label: "Buying" }]} size="lg" book="buying" bookHref="/buying-guide?from=buying">
        <HeroTitle>Buying property: where to start</HeroTitle>
        <HeroLead>{`Your budget, the help you qualify for, and every step from pre-approval to the keys.`}</HeroLead>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/plan?j=buying" className={`${BUTTON_PRIMARY} justify-center`}>Make a buying plan</Link>
          <Link href="/buying-guide?from=buying" className={`${BUTTON_SECONDARY} justify-center`}>Free buying guide (PDF)</Link>
        </div>
        <p className="mt-4 text-sm text-ink-muted">Free to read and use, no sign-up.</p>
      </PhotoHero>

      <Band spacing="compact">
        <h2 className="text-2xl sm:text-3xl text-ink">Start here</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {START.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="group flex h-full flex-col rounded-2xl bg-surface-warm p-6 transition-colors hover:bg-surface-warm-sunken">
                <span className="text-xl font-bold text-ink">{s.label}</span>
                <span className="mt-2 text-base text-ink-muted leading-relaxed">{s.note}</span>
                <span className="mt-auto pt-5 inline-flex items-center gap-1.5 font-semibold text-ink">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="quiet" spacing="compact">
        <SectionHeading size="md" title="Run your numbers" intro="Drag the sliders and the answer updates as you go. Nothing you enter leaves this page." />
        <div className="mt-8 sm:mt-10">
          <NumbersPanel tools={["duty", "borrow"]} from="hub-buying" />
        </div>
      </Band>

      <Band spacing="compact">
        <SectionHeading title="Buying, stage by stage" intro="The tools and guides that matter at each point, in order." />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((st, i) => (
            <section key={st.title} className="border-t-2 border-ink pt-5" aria-labelledby={`stage-${i}`}>
              <p className="text-sm font-semibold text-ink-muted">Stage {i + 1}</p>
              <h3 id={`stage-${i}`} className="mt-1 text-xl text-ink">{st.title}</h3>
              <p className="mt-2 text-base text-ink-muted leading-relaxed">{st.body}</p>
              <ul className="mt-4 space-y-2">
                {st.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-base text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Band>

      <Band tone="quiet" spacing="compact">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl sm:text-4xl text-ink tracking-[-0.025em]">Who works for whom</h2>
            <p className="mt-4 text-lg text-ink-muted leading-relaxed">
              {`The agent at the open home works for the seller. That’s not a criticism: it’s their job, and it’s why you should judge every price guide against real sales.`}
            </p>
          </div>
          <div className="space-y-5 text-base leading-relaxed">
            <div className="rounded-xl border border-line bg-white p-5">
              <p className="font-semibold text-ink">Selling agent</p>
              <p className="mt-1 text-ink-muted">{SERVICES["selling-agent"].who}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-5">
              <p className="font-semibold text-ink">Buyer’s agent</p>
              <p className="mt-1 text-ink-muted">{SERVICES["buyers-agent"].who}</p>
              <Link href="/buyers-agents" className="mt-3 inline-flex items-center gap-1.5 font-semibold text-ink hover:text-primary">
                What buyer’s agents do and cost <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Band>

      <HelpBand service="buyers-agent" from="hub-buying" tone="light" />

      <Band tone="quiet" spacing="compact">
        <div className="max-w-3xl [&>section]:my-0">
          <Faq items={FAQS} />
        </div>
      </Band>
    </>
  );
}
