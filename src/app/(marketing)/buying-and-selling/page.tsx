import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CalendarClock, KeyRound, Wallet } from "lucide-react";
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
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { availabilityNote } from "@/lib/introductions/rules";
import { buildPlan, type PlanLink } from "@/lib/plans/engine";
import { FEE_DISCLOSURE, HOW_WE_ARE_PAID_HREF, SERVICES, type IntroService } from "@/lib/service-model";

// /buying-and-selling (Oct 2026): the hub for people selling one home and
// buying the next. The steps, the coordinated checklist, the tools and guides
// and the help offer all come from the plan engine's "buying and selling"
// plan (src/lib/plans/engine.ts), so this page and /plan can't disagree.
// Personal help is two separate introductions, each with its own yes.

const PATH = "/buying-and-selling";
const TITLE = "Selling and buying at once: order, money and moving dates";
const DESCRIPTION =
  "Sell first, buy first or both at once? The trade-offs, the money in between, a coordinated moving checklist, and personal help for either side.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: { url: `${SITE_URL}${PATH}`, title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const PLAN_HREF = "/plan?j=buying-and-selling";
const HELP_HREF = "/get-help?service=both&from=buying-and-selling";

const LINK = "font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink";

// What each step waits on: the dependencies behind the checklist.
const DEPENDENCIES = [
  {
    title: "Your purchase budget depends on your sale",
    body: "Your expected sale price, less selling costs and your loan payout, is the equity you carry into the next home.",
  },
  {
    title: "Your loan depends on the order",
    body: "A lender looks at whether you’ve sold. Tell them your plan, and get pre-approval that takes the sale into account.",
  },
  {
    title: "Your moving day depends on both contracts",
    body: "Each contract sets its own settlement date. Agree them with both conveyancers before you sign either, or leave a buffer of a few days.",
  },
];

const EXTRA_GUIDES: PlanLink[] = [
  { label: "Settlement day", href: "/guides/settlement-day-australia", note: "What happens, and what to check" },
  { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet", note: "Compare selling agents’ proposals in dollars at the same price" },
  { label: "What a buyer’s agent does", href: "/buyers-agents", note: "What they do, what they charge, and when they’re worth it" },
];

function LinkList({ title, icon: Icon, links }: { title: string; icon: typeof Calculator; links: PlanLink[] }) {
  return (
    <div className="border-t-2 border-ink pt-6">
      <h3 className="flex items-center gap-2 text-xl text-ink">
        <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" /> {title}
      </h3>
      <ul className="mt-4 divide-y divide-line">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group flex items-start justify-between gap-3 py-3.5">
              <span className="min-w-0">
                <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{l.label}</span>
                <span className="block mt-0.5 text-sm text-ink-muted leading-snug">{l.note}</span>
              </span>
              <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BuyingAndSellingPage() {
  const plan = buildPlan({ journey: "buying-and-selling", state: null, timeframe: null, order: "undecided" });
  const toolHrefs = new Set(plan.tools.map((t) => t.href));
  const guides = [...plan.guides.filter((g) => !toolHrefs.has(g.href)), ...EXTRA_GUIDES];
  const services: IntroService[] = ["selling-agent", "buyers-agent"];

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Buying and selling", url: PATH }]} />
      <CollectionPageJsonLd
        name="Selling one home and buying the next"
        description={DESCRIPTION}
        url={PATH}
        items={[...plan.tools, ...guides].map((l) => ({ name: l.label, url: l.href, description: l.note }))}
      />

      <PhotoHero photo="verandah" breadcrumbs={[{ label: "Buying and selling" }]}>
        <HeroTitle>Selling one home and buying the next</HeroTitle>
        <HeroLead>
          {`${plan.intro} This page sets out the choices, the order things happen in, and the costs in between.`}
        </HeroLead>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
          <Link href={PLAN_HREF} className={`${BUTTON_PRIMARY} justify-center`}>
            Make your moving plan
          </Link>
          <Link href={HELP_HREF} className={`${BUTTON_SECONDARY} justify-center`}>
            Ask for personal help
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-sm text-ink-muted leading-relaxed">
          {`The plan is free, with no sign-up, and nobody contacts you. Personal help is separate and only with your permission.`}
        </p>
      </PhotoHero>

      <Band id="which-first">
        <SectionHeading
          title="Sell first, buy first, or both at once"
          intro={plan.nextSteps[0].body}
        />
        <RuleGrid columns={3}>
          <RuleItem icon={Wallet} title="Sell first">
            <p>{`You know exactly what you have to spend, and you never carry two loans.`}</p>
            <p className="mt-3">{`The trade-off: you may need a long settlement, a rent-back or a short-term rental, and you could move twice.`}</p>
            <Link href="/guides/bridging-loan-alternatives" className={`mt-4 inline-block ${LINK}`}>Long settlements and rent-backs</Link>
          </RuleItem>
          <RuleItem icon={KeyRound} title="Buy first">
            <p>{`You can take your time to find the right place, and move once.`}</p>
            <p className="mt-3">{`The trade-off: if your sale takes longer, or sells for less than you planned, you carry both loans or a bridging loan in the meantime.`}</p>
            <Link href="/bridging-loan-calculator" className={`mt-4 inline-block ${LINK}`}>Bridging loan calculator</Link>
          </RuleItem>
          <RuleItem icon={CalendarClock} title="Both at once">
            <p>{`One move and no overlap, if both settlements line up.`}</p>
            <p className="mt-3">{`The trade-off: it needs tight coordination, and a delay on one side affects the other. An offer subject to your sale only works if the vendor accepts it.`}</p>
            <Link href="/guides/settlement-day-australia" className={`mt-4 inline-block ${LINK}`}>What happens on settlement day</Link>
          </RuleItem>
        </RuleGrid>
        <p className="mt-12 text-base">
          <Link href="/guides/sell-first-or-buy-first" className={LINK}>Sell first or buy first? The full guide, with worked examples</Link>
        </p>
      </Band>

      <Band tone="quiet" id="first-steps">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading title="Your first three steps" />
            <StepTimeline
              steps={plan.nextSteps.map((s) => ({
                title: s.title,
                body: (
                  <>
                    {s.body}
                    {s.link && (
                      <Link href={s.link.href} className={`mt-3 flex w-fit items-center gap-1.5 ${LINK}`}>
                        {s.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </>
                ),
              }))}
            />
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
              <h3 className="text-xl text-ink">What depends on what</h3>
              <ul className="mt-5 space-y-5">
                {DEPENDENCIES.map((d) => (
                  <li key={d.title} className="border-t border-line pt-4">
                    <p className="text-base font-semibold text-ink">{d.title}</p>
                    <p className="mt-1 text-[15px] text-ink-muted leading-relaxed">{d.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Band>

      <Band id="moving-checklist">
        <SectionHeading
          title={plan.checklist.title}
          intro="The first and last groups apply to everyone. The two in the middle depend on which comes first, so you need only one of them."
        />
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {plan.checklist.groups.map((g) => (
            <li key={g.heading} className="border-t-2 border-ink pt-5">
              <h3 className="text-xl text-ink">{g.heading}</h3>
              <ul className="mt-4 space-y-3">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-3 text-base text-ink leading-relaxed">
                    <span className="mt-1.5 inline-block h-4 w-4 shrink-0 rounded border border-line-strong" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h3 className="text-xl text-ink">Questions to settle early</h3>
            <ul className="mt-4 space-y-3">
              {plan.questions.map((q) => (
                <li key={q} className="border-l-2 border-line-strong pl-4 text-base text-ink leading-relaxed">{q}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="text-base text-ink-muted leading-relaxed">
              {`Your moving plan adds the guides and costs for your state, and a version you can print or email to yourself.`}
            </p>
            <Link href={PLAN_HREF} className={`mt-3 inline-flex items-center gap-1.5 ${LINK}`}>
              Make your moving plan <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Band>

      <Band tone="quiet" id="money">
        <SectionHeading
          title="The money in between"
          intro="Two numbers decide how comfortable the move is: what you’ll have after the sale, and what any overlap between the two homes would cost."
        />
        <div className="mt-10 grid gap-6 max-w-3xl text-lg text-ink-muted leading-relaxed">
          <p className="text-ink">
            {`Start with what you’d walk away with from the sale: the price, less commission, marketing, conveyancing and your loan payout. Then add stamp duty to the purchase price, which the buyer pays in every state.`}
          </p>
          <p>
            {`If you buy before you sell, a bridging loan can cover the overlap, with interest building up until your sale settles. The bridging loan calculator shows the peak debt and what it costs against selling first.`}
          </p>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <LinkList title="Tools" icon={Calculator} links={plan.tools} />
          <LinkList title="Guides" icon={BookOpen} links={guides} />
        </div>
      </Band>

      <Band tone="dark" id="personal-help">
        <SectionHeading title={plan.help.headline} intro={plan.help.body} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <div key={s} className="rounded-xl border border-line p-6 sm:p-8">
              <h3 className="text-2xl text-ink">For the {s === "selling-agent" ? "sale" : "purchase"}: {SERVICES[s].label.toLowerCase()}</h3>
              <p className="mt-3 text-base text-ink-muted leading-relaxed">{SERVICES[s].who}</p>
              <p className="mt-4 border-t border-line pt-4 text-base text-ink leading-relaxed">{availabilityNote(s, null).text}</p>
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-sm font-semibold text-ink">Your permission</p>
                <p className="mt-1 text-sm text-ink-muted leading-relaxed">
                  {`Its own box on the form. Ticking it lets us pass your name, contact details and answers to one participating ${SERVICES[s].short}, so they can contact you about ${s === "selling-agent" ? "selling" : "buying"}.`}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <div className="max-w-3xl space-y-4 text-base text-ink-muted leading-relaxed">
            <p>
              {`Each introduction is its own yes. Ticking one box never covers the other, and making a plan or downloading a guide never shares your details with anyone.`}
            </p>
            <p>
              {FEE_DISCLOSURE}{" "}
              <Link href={HOW_WE_ARE_PAID_HREF} className="text-ink underline underline-offset-4">How we’re paid</Link>
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={HELP_HREF} className={`${BUTTON_PRIMARY} justify-center`}>
              Ask for personal help <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href={PLAN_HREF} className={`${BUTTON_SECONDARY} justify-center`}>
              Make your moving plan
            </Link>
          </div>
        </div>
      </Band>
    </>
  );
}
