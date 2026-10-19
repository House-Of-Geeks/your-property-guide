import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Home, Plus, UserCheck } from "lucide-react";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  Band,
  HeroLead,
  HeroTitle,
  PhotoHero,
  RuleGrid,
  RuleItem,
  SectionHeading,
  StepTimeline,
} from "@/components/premium";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { availabilityNote } from "@/lib/introductions/rules";
import { FEE_DISCLOSURE, HOW_WE_ARE_PAID_HREF, INTRODUCTION_STEPS, LICENCE_REGISTERS, SERVICES } from "@/lib/service-model";

// /buyers-agents (Oct 2026): what a buyer's agent is, what one costs, when
// one helps, and how our introductions work for buyers, said honestly: the
// buyer's agent network is still being built, so every request is reviewed
// by hand and nothing is promised (src/lib/introductions/rules.ts). The
// service copy comes from src/lib/service-model.ts.

const PATH = "/buyers-agents";
const TITLE = "Buyer’s agents: what they do and what they cost";
const DESCRIPTION =
  "What a buyer’s agent does, how they differ from a selling agent, what they charge, when one helps, and what to ask before you sign.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { ...DEFAULT_OG, url: `${SITE_URL}${PATH}`, title: TITLE, description: DESCRIPTION, type: "article" },
  twitter: { card: "summary_large_image" },
};

const BA = SERVICES["buyers-agent"];
const AVAILABILITY = availabilityNote("buyers-agent", null).text;
const HELP_HREF = "/get-help?service=buyers-agent&from=buyers-agents";
const PLAN_HREF = "/plan?j=buying";

const NO_SHARING =
  "Downloading a buying guide or making a plan never authorises us to share your details with anyone. Only the permission box on the introduction form does.";
const SEPARATE_YES =
  "If you’re also selling, an introduction to a selling agent is a separate request with its own permission. Saying yes to one never covers the other.";

// Extra detail under each of SERVICES["buyers-agent"].what, in the same order.
const WHAT_DETAIL = [
  "What you want, where, the most you’ll pay, and exactly what the engagement covers, agreed in writing.",
  "They inspect, shortlist and check each property against your brief, so you spend your time on the ones that fit.",
  "They use recent sales to set what to offer, negotiate or bid within your limit, and work with your conveyancer and inspectors until contracts are exchanged.",
];

const NOT_NEEDED = [
  "You know the suburbs well and can follow recent sales yourself",
  "You have time to inspect, and you’re comfortable negotiating or bidding with a firm limit",
  "The fee would stretch a budget that’s already tight once stamp duty and other costs are in",
];

const QUESTIONS: ReadonlyArray<{ q: string; why: string }> = [
  { q: "Are you licensed in this state, and what’s your licence number?", why: "Check it on the state register below before you sign anything." },
  { q: "How are you paid: a fixed fee, a percentage, or both?", why: "Ask for the total in dollars at your budget, and when each part is due." },
  { q: "Do you receive any rebate, commission or referral fee from vendors, developers, selling agents or anyone else?", why: "Ask for the answer in writing. Anything they’re paid by the other side of a deal is something you need to know about." },
  { q: "Could you have a conflict of interest?", why: "For example, another client looking in the same streets, or a link to an agency that sells there. Ask how they’d handle it." },
  { q: "Is the engagement exclusive, for how long, and how do I end it?", why: "Read the term and the exit clause in the engagement agreement." },
  { q: "What exactly is included?", why: "Search, unadvertised properties, inspections, due diligence, negotiation, auction bidding: get the list in writing." },
  { q: "Is there an upfront engagement fee, and is it refundable?", why: "Ask what happens to it if they don’t find a property, or if you end the engagement." },
  { q: "Who will do the work?", why: "The person you meet, or someone else in their team." },
];

const FAQS = [
  {
    question: "What’s the difference between a buyer’s agent and a selling agent?",
    answer:
      "A selling agent acts for the vendor and is paid by the vendor, usually as commission on the sale. A buyer’s agent acts only for the buyer and is paid by the buyer, to find, assess and negotiate for them.",
  },
  { question: "How much does a buyer’s agent cost?", answer: BA.fees },
  {
    question: "Do I need a buyer’s agent?",
    answer:
      "Most people buy without one. A buyer’s agent can be useful if you’re buying in an area you don’t know or from interstate, you’re short on time, or you’re uncomfortable negotiating or bidding. If you know the area and have time to research sales and inspect, you may not need one.",
  },
  {
    question: "What should I check before signing with a buyer’s agent?",
    answer:
      "Their licence on your state’s register, how they’re paid and the total fee in dollars, whether they receive any rebate, commission or referral fee from vendors, developers or anyone else, any conflict of interest, whether the engagement is exclusive and for how long, exactly what’s included, and whether any upfront engagement fee is refundable.",
  },
  {
    question: "Can Your Property Guide introduce me to a buyer’s agent?",
    answer: `${AVAILABILITY} We only pass on your details if you ask for an introduction and tick the permission box.`,
  },
  {
    question: "Does downloading a buying guide put me in touch with a buyer’s agent?",
    answer: `No. ${NO_SHARING} ${SEPARATE_YES}`,
  },
];

const RELATED: ReadonlyArray<{ href: string; title: string; note: string }> = [
  { href: "/guides/buyers-agent-cost-australia", title: "Buyer’s agent fees", note: "Fixed fees, percentages and what’s included" },
  { href: "/buying-guide?from=buyers-agents", title: "The free buying guide", note: "The whole purchase in order, as a PDF" },
  { href: "/guides/how-to-negotiate-property-price-australia", title: "Negotiating the price", note: "Offers, counter-offers and walking away" },
  { href: "/guides/property-auction-guide", title: "Buying at auction", note: "How to prepare and how to bid" },
  { href: "/guides/due-diligence-checklist-buying-a-house", title: "Due diligence checklist", note: "What to check before you commit" },
  { href: "/stamp-duty-calculator", title: "Stamp duty calculator", note: "Duty on your purchase, with first home concessions" },
  { href: "/borrowing-power-calculator", title: "Borrowing power calculator", note: "A rough idea of what a lender might lend" },
  { href: "/buying-and-selling", title: "Selling and buying at once", note: "The order, the money in between and the dates" },
];

const LINK = "font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink";

export default function BuyersAgentsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Buyer’s agents", url: PATH }]} />
      <FAQPageJsonLd faqs={FAQS} />

      <PhotoHero photo="buying" breadcrumbs={[{ label: "Buyer’s agents" }]}>
        <HeroTitle>Buyer’s agents: what they do, what they cost, and whether you need one</HeroTitle>
        <HeroLead>{BA.who}</HeroLead>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
          <Link href={HELP_HREF} className={`${BUTTON_PRIMARY} justify-center`}>
            Ask about a buyer’s agent
          </Link>
          <Link href={PLAN_HREF} className={`${BUTTON_SECONDARY} justify-center`}>
            Build my next-step plan
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-sm text-ink-muted leading-relaxed">
          {`Free to ask. Our buyer’s agent network is still being built, so we’ll tell you honestly whether we can introduce someone in your area.`}
        </p>
      </PhotoHero>

      <Band id="who-they-work-for">
        <SectionHeading
          title="Who each agent works for"
          intro="It matters most when you negotiate. You don’t need a buyer’s agent to deal with a selling agent, but it helps to know whose side each one is on."
        />
        <RuleGrid columns={2}>
          <RuleItem icon={UserCheck} title="A buyer’s agent acts for you">
            {`A buyer’s agent acts only for the buyer and is paid by the buyer. Their job is to find, assess and negotiate for you, within the limit you set.`}
          </RuleItem>
          <RuleItem icon={Home} title="A selling agent acts for the vendor">
            {`A selling agent acts for the vendor and is paid by the vendor, usually as commission on the sale. Their job is the best price and terms for the seller, however helpful they are to you at an open home.`}
          </RuleItem>
        </RuleGrid>
      </Band>

      <Band tone="quiet" id="what-they-do">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading title="What a buyer’s agent does" />
            <p className="mt-6 text-lg text-ink-muted leading-relaxed">
              {`A full engagement runs from your brief to exchange of contracts. Some buyer’s agents offer only part of it, such as negotiation or auction bidding on a property you’ve found yourself.`}
            </p>
          </div>
          <div className="lg:col-span-7">
            <StepTimeline className="mt-2" steps={BA.what.map((title, i) => ({ title, body: WHAT_DETAIL[i] }))} />
          </div>
        </div>
      </Band>

      <Band id="do-you-need-one">
        <SectionHeading title="When one can help, and when you probably don’t need one" intro="Most people buy without a buyer’s agent. It comes down to how well you know the area, your time, and how you feel about negotiating." />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="border-t-2 border-ink pt-6">
            <h3 className="text-xl text-ink">Can be useful when</h3>
            <ul className="mt-4 space-y-3">
              {BA.whenUseful.map((t) => (
                <li key={t} className="border-l-2 border-line-strong pl-4 text-base text-ink leading-relaxed">{t}</li>
              ))}
            </ul>
          </div>
          <div className="border-t-2 border-ink pt-6">
            <h3 className="text-xl text-ink">Usually not needed when</h3>
            <ul className="mt-4 space-y-3">
              {NOT_NEEDED.map((t) => (
                <li key={t} className="border-l-2 border-line-strong pl-4 text-base text-ink leading-relaxed">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Band tone="quiet" id="fees">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading title="What a buyer’s agent costs" />
          </div>
          <div className="lg:col-span-7 space-y-5 text-lg text-ink-muted leading-relaxed">
            <p className="text-ink">{BA.fees}</p>
            <p>
              {`You pay a buyer’s agent yourself; the vendor doesn’t. Weigh the fee against your whole budget, after stamp duty, conveyancing, inspections and loan costs.`}
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-base">
              <li>
                <Link href="/guides/buyers-agent-cost-australia" className={LINK}>Buyer’s agent fees in detail</Link>
              </li>
              <li>
                <Link href="/stamp-duty-calculator" className={LINK}>Stamp duty calculator</Link>
              </li>
            </ul>
          </div>
        </div>
      </Band>

      <Band id="questions">
        <SectionHeading title="Questions to ask before you engage one" intro="Ask every buyer’s agent you’re considering the same questions, and get the answers in the engagement agreement before you sign." />
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ol className="lg:col-span-7 divide-y divide-line border-y border-line">
            {QUESTIONS.map((x, i) => (
              <li key={x.q} className="grid grid-cols-[2rem_1fr] gap-x-3 py-5">
                <span className="text-base font-bold text-ink" aria-hidden="true">{i + 1}.</span>
                <div>
                  <p className="text-base font-semibold text-ink leading-snug">{x.q}</p>
                  <p className="mt-1 text-[15px] text-ink-muted leading-relaxed">{x.why}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-5">
            <h3 className="text-xl text-ink">Check a licence yourself</h3>
            <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">{`Each state keeps a public register of licensed agents.`}</p>
            <ul className="mt-4 space-y-2">
              {LICENCE_REGISTERS.map((r) => (
                <li key={r.state}>
                  <a href={r.href} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[15px] text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
                    {r.label}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Band tone="dark" id="introductions">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading title="Asking us about a buyer’s agent" />
            <p className="mt-6 text-lg text-ink-muted leading-relaxed">{AVAILABILITY}</p>
            <div className="mt-8 space-y-5">
              <div className="border-t border-line pt-4">
                <p className="text-base font-semibold text-ink">Guides and plans never share your details</p>
                <p className="mt-1 text-base text-ink-muted leading-relaxed">{NO_SHARING}</p>
              </div>
              <div className="border-t border-line pt-4">
                <p className="text-base font-semibold text-ink">Buying and selling are two separate yeses</p>
                <p className="mt-1 text-base text-ink-muted leading-relaxed">{SEPARATE_YES}</p>
              </div>
              <div className="border-t border-line pt-4">
                <p className="text-base font-semibold text-ink">How we’re paid</p>
                <p className="mt-1 text-base text-ink-muted leading-relaxed">
                  {FEE_DISCLOSURE}{" "}
                  <Link href={HOW_WE_ARE_PAID_HREF} className="text-ink underline underline-offset-4">The full detail</Link>
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <StepTimeline
              className="mt-2"
              steps={[
                { title: INTRODUCTION_STEPS[0].title, body: INTRODUCTION_STEPS[0].body },
                { title: INTRODUCTION_STEPS[1].title, body: INTRODUCTION_STEPS[1].body },
                { title: "Our team reviews it by hand", body: "We check whether a participating buyer’s agent covers your area, and email you either way. Until then nobody else has your details." },
                { title: "If we can introduce someone, they contact you", body: "One buyer’s agent, never a list. You decide whether to meet them and whether to engage them. There’s no obligation." },
              ]}
            />
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href={HELP_HREF} className={`${BUTTON_PRIMARY} justify-center`}>
                Ask about a buyer’s agent <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href={PLAN_HREF} className={`${BUTTON_SECONDARY} justify-center`}>
                Build my next-step plan
              </Link>
            </div>
          </div>
        </div>
      </Band>

      <Band tone="quiet" id="faq">
        <SectionHeading title="Common questions" />
        <div className="mt-10 max-w-3xl border-b border-line">
          {FAQS.map((f) => (
            <details key={f.question} className="group border-t border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px] font-semibold text-ink leading-snug">{f.question}</h3>
                <Plus className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="pb-5 -mt-1 max-w-[65ch] text-base text-ink-muted leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </Band>

      <Band spacing="compact" id="related">
        <SectionHeading size="md" title="Guides and tools for buyers" />
        <ul className="mt-10 grid grid-cols-1 gap-x-8 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {RELATED.map((r) => (
            <li key={r.href} className="border-b border-line">
              <Link href={r.href} className="group flex items-start justify-between gap-3 py-4">
                <span className="min-w-0">
                  <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{r.title}</span>
                  <span className="block mt-0.5 text-sm text-ink-muted leading-snug">{r.note}</span>
                </span>
                <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
