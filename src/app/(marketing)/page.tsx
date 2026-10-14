import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CalendarClock, Route, Users } from "lucide-react";

import { BUTTON_PRIMARY, BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { RouteChooser } from "@/components/journeys/RouteChooser";
import { PlanBuilder } from "@/components/journeys/PlanBuilder";
import { HowIntroductionsWork, HowWeChooseAgents } from "@/components/journeys/ServiceSections";
import { ALL_GUIDES } from "@/lib/guides/registry";
import { PROMISE } from "@/lib/service-model";
import { SITE_URL } from "@/lib/constants";

// Homepage (14 Oct 2026, "confident moves"). Organised around one question:
// what should I do next, and who can help me do it well? In order:
//   1. the promise and the three ways in (buying, selling, both);
//   2. the questions people arrive with: costs, timing, process, help;
//   3. tools and guides for each move;
//   4. a next-step plan, right here;
//   5. how introductions work, and the permission they need;
//   6. why the guides and the agents can be trusted (process, not claims);
//   7. a clear way to ask for personal help.
// Every promise comes from src/lib/service-model.ts.
export const revalidate = 86400;

const META_TITLE = "Buying or selling property? Know what to do next";
const META_DESCRIPTION =
  "Free Australian guides, calculators and next-step plans for buying, selling or both. When you want personal help, we introduce you to a suitable local agent, only with your permission.";

export const metadata: Metadata = {
  title: { absolute: `${META_TITLE} | Your Property Guide` },
  description: META_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const QUESTIONS = [
  {
    icon: Calculator,
    title: "Costs",
    links: [
      { label: "What will selling cost me?", href: "/selling-costs-calculator" },
      { label: "How much stamp duty will I pay?", href: "/stamp-duty-calculator" },
      { label: "How much could I borrow?", href: "/borrowing-power-calculator" },
    ],
  },
  {
    icon: CalendarClock,
    title: "Timing",
    links: [
      { label: "When is a good time to sell?", href: "/guides/best-time-to-sell-a-house-australia" },
      { label: "Should I sell first or buy first?", href: "/guides/sell-first-or-buy-first" },
      { label: "How long does buying take?", href: "/guides/how-long-does-it-take-to-buy-a-house-australia" },
    ],
  },
  {
    icon: Route,
    title: "Process",
    links: [
      { label: "How does selling work, step by step?", href: "/guides/how-to-sell-a-house-australia" },
      { label: "How does buying work?", href: "/guides/buying-property-australia" },
      { label: "What happens at settlement?", href: "/guides/settlement-day-australia" },
    ],
  },
  {
    icon: Users,
    title: "Choosing help",
    links: [
      { label: "How do I choose a selling agent?", href: "/guides/how-to-choose-a-selling-agent" },
      { label: "Do I need a buyer’s agent?", href: "/buyers-agents" },
      { label: "What do agents charge?", href: "/guides/real-estate-agent-fees-australia" },
    ],
  },
] as const;

const BY_MOVE = [
  {
    title: "Buying",
    href: "/buying",
    tools: [
      { label: "Borrowing power calculator", href: "/borrowing-power-calculator" },
      { label: "Stamp duty calculator", href: "/stamp-duty-calculator" },
    ],
    guides: [
      { label: "First home buyer guide", href: "/guides/first-home-buyer-guide" },
      { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house" },
      { label: "Buyer’s agents: what they do and cost", href: "/buyers-agents" },
    ],
  },
  {
    title: "Selling",
    href: "/selling",
    tools: [
      { label: "Selling costs calculator", href: "/selling-costs-calculator" },
      { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet" },
    ],
    guides: [
      { label: "Preparing for an appraisal", href: "/guides/how-to-prepare-for-a-property-appraisal" },
      { label: "Questions to ask an agent", href: "/guides/questions-to-ask-a-real-estate-agent" },
      { label: "Agent fees and commission", href: "/guides/real-estate-agent-fees-australia" },
    ],
  },
  {
    title: "Buying and selling",
    href: "/buying-and-selling",
    tools: [
      { label: "Bridging loan calculator", href: "/bridging-loan-calculator" },
      { label: "Selling costs calculator", href: "/selling-costs-calculator" },
    ],
    guides: [
      { label: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first" },
      { label: "Alternatives to a bridging loan", href: "/guides/bridging-loan-alternatives" },
      { label: "Settlement day", href: "/guides/settlement-day-australia" },
    ],
  },
] as const;

const linkClass = "text-base text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink";

export default function HomePage() {
  const guideCount = ALL_GUIDES.length;
  return (
    <>
      {/* 1. The promise and the three ways in. Compact, so the choices are on
          the first screen of a phone. */}
      <PhotoHero photo="street" size="md" aside={<RouteChooser />}>
        <HeroTitle size="lg">{PROMISE.headline}</HeroTitle>
        <HeroLead className="max-w-xl">{PROMISE.support}</HeroLead>
        <div className="mt-8 hidden lg:flex items-center gap-4 border-t border-line pt-6 max-w-xl">
          <Image
            src="/images/agents/andy-mcmaster.jpg"
            alt="Andy McMaster"
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover object-top shrink-0 ring-2 ring-line"
          />
          <p className="text-[15px] text-ink-muted leading-snug">
            <span className="font-semibold text-ink">Andy McMaster, founder and editor.</span>{" "}
            {`We write for the person making the move, check the rules against official sources, and only introduce an agent when you ask.`}
          </p>
        </div>
      </PhotoHero>

      {/* 2. The questions people arrive with. */}
      <Band spacing="compact">
        <SectionHeading
          title="Start with the question on your mind"
          intro="Plain answers and calculators, free to read and use. No sign-up."
        />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {QUESTIONS.map(({ icon: Icon, title, links }) => (
            <section key={title} className="border-t-2 border-ink pt-5" aria-labelledby={`q-${title}`}>
              <h3 id={`q-${title}`} className="flex items-center gap-2 text-xl text-ink">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" /> {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Band>

      {/* 3. Tools and guides for each move. */}
      <Band tone="quiet" spacing="compact">
        <SectionHeading title="Tools and guides for your move" intro={`${guideCount} guides and articles, each dated, all free to read. Pick your move.`} />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {BY_MOVE.map((m) => (
            <section key={m.title} className="rounded-xl border border-line bg-white p-6" aria-labelledby={`m-${m.href}`}>
              <h3 id={`m-${m.href}`} className="text-2xl text-ink">{m.title}</h3>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink-muted"><Calculator className="h-4 w-4" aria-hidden="true" /> Tools</p>
              <ul className="mt-2 space-y-2">
                {m.tools.map((t) => (
                  <li key={t.href}><Link href={t.href} className={linkClass}>{t.label}</Link></li>
                ))}
              </ul>
              <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-ink-muted"><BookOpen className="h-4 w-4" aria-hidden="true" /> Guides</p>
              <ul className="mt-2 space-y-2">
                {m.guides.map((g) => (
                  <li key={g.href}><Link href={g.href} className={linkClass}>{g.label}</Link></li>
                ))}
              </ul>
              <Link href={m.href} className="mt-6 inline-flex items-center gap-1.5 text-base font-semibold text-ink hover:text-primary">
                Everything for {m.title.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>
          ))}
        </div>
      </Band>

      {/* 4. A next-step plan, without leaving the page. */}
      <Band id="plan" spacing="compact">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <SectionHeading title="Get your next-step plan" size="md" />
            <p className="mt-5 text-lg text-ink-muted leading-relaxed">
              {`A few questions about your move, then your next three steps, the calculators and guides for your state, a checklist and the questions worth settling first.`}
            </p>
            <ul className="mt-6 space-y-2 text-base text-ink-muted">
              <li className="border-l-2 border-line-strong pl-4">{`No name, email or phone needed to see it.`}</li>
              <li className="border-l-2 border-line-strong pl-4">{`Email yourself a copy afterwards if you like.`}</li>
              <li className="border-l-2 border-line-strong pl-4">{`General information, not advice or a valuation.`}</li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <Suspense fallback={null}>
              <PlanBuilder placement="home" />
            </Suspense>
          </div>
        </div>
      </Band>

      {/* 5. How introductions work, and the permission they need. */}
      <HowIntroductionsWork
        tone="dark"
        cta={
          <Link href="/get-help" className={BUTTON_PRIMARY}>
            Ask for personal help <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      {/* 6. Why you can trust what you read, and who we introduce. */}
      <Band spacing="compact" id="trust">
        <SectionHeading title="Why you can rely on what you read here" intro="We’d rather show our working than ask you to take our word for it." />
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="border-t-2 border-ink pt-5">
            <h3 className="text-xl text-ink">Checked against official sources</h3>
            <p className="mt-2 text-base text-ink-muted leading-relaxed">
              {`Grants, stamp duty and scheme rules come from the state revenue offices, the ATO and Housing Australia, with the date we checked them. When a rule changes, we update the guide and say so.`}
            </p>
            <Link href="/about#methodology" className={`mt-3 inline-block ${linkClass}`}>Our editorial standards</Link>
          </div>
          <div className="border-t-2 border-ink pt-5">
            <h3 className="text-xl text-ink">Written for the person moving</h3>
            <p className="mt-2 text-base text-ink-muted leading-relaxed">
              {`Guides are written for buyers and sellers, not for agents, and signed off by a named editor. If we get something wrong, we correct it in public.`}
            </p>
            <Link href="/about#corrections" className={`mt-3 inline-block ${linkClass}`}>Corrections</Link>
          </div>
          <div className="border-t-2 border-ink pt-5">
            <h3 className="text-xl text-ink">Data with its sources</h3>
            <p className="mt-2 text-base text-ink-muted leading-relaxed">
              {`Suburb figures name where they come from and when. Where we don’t have a reliable figure, we leave it out rather than guess.`}
            </p>
            <Link href="/methodology" className={`mt-3 inline-block ${linkClass}`}>How our data works</Link>
          </div>
        </div>
      </Band>
      <HowWeChooseAgents tone="quiet" />

      {/* 7. A clear way to ask for personal help. */}
      <Band tone="dark" spacing="compact">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl text-ink tracking-[-0.025em]">Want someone to help in person?</h2>
            <p className="mt-4 text-lg text-ink-muted leading-relaxed max-w-2xl">
              {`Ask for an introduction to one participating selling agent for an appraisal, or a buyer’s agent who acts for you. We tell you before you send anything if we can’t cover your area.`}
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <Link href="/get-help?service=selling-agent&from=home" className={BUTTON_PRIMARY}>
              I’d like a selling agent
            </Link>
            <Link href="/get-help?service=buyers-agent&from=home" className={BUTTON_SECONDARY}>
              I’d like a buyer’s agent
            </Link>
          </div>
        </div>
      </Band>
    </>
  );
}
