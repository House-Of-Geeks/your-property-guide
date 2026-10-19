import type { Metadata } from "next";
import { Suspense } from "react";
import { PhotoHero, HeroTitle, HeroLead, Band, SectionHeading, RuleGrid, RuleItem } from "@/components/premium";
import { PlanBuilder } from "@/components/journeys/PlanBuilder";
import { SITE_URL } from "@/lib/constants";
import { PLAN_NAME, PLAN_TERMS } from "@/lib/plans/name";
import { Check, ListChecks, Calculator, HelpCircle } from "lucide-react";

// /plan: the next-step plan (Oct 2026). A few questions, then a plan built
// from our own guides and calculators. No sign-up; email is offered after.

export const metadata: Metadata = {
  title: "Your next-step plan for buying or selling property",
  description:
    "Answer a few quick questions about buying, selling or both, and get your next three steps, the right calculators and guides for your state, a checklist and the questions to settle. Free, no sign-up.",
  alternates: { canonical: `${SITE_URL}/plan` },
};

export default function PlanPage() {
  return (
    <>
      <PhotoHero
        breadcrumbs={[{ label: "Your next-step plan" }]}
        aside={
          <Suspense fallback={null}>
            <PlanBuilder />
          </Suspense>
        }
      >
        <HeroTitle>{`Your free ${PLAN_NAME}`}</HeroTitle>
        <HeroLead>
          {`A few quick questions about where you’re up to, then a plan for it: your next three steps, the calculators and guides for your state and suburb, a checklist, and the questions worth settling before you commit.`}
        </HeroLead>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-base font-semibold text-ink">
          {PLAN_TERMS.map((t) => (
            <li key={t} className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" strokeWidth={3} aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-xl text-base text-ink-muted leading-relaxed">
          {`It’s general information built from your answers, not advice and not a valuation. Nobody contacts you.`}
        </p>
      </PhotoHero>
      <Band spacing="compact">
        <SectionHeading title="What your plan includes" size="md" />
        <RuleGrid columns={3} className="mt-10">
          <RuleItem icon={ListChecks} title="Your next three steps">{`In order, each with the guide or tool that helps.`}</RuleItem>
          <RuleItem icon={Calculator} title="Tools and guides for your state">{`Costs, grants and rules differ by state, so the links do too.`}</RuleItem>
          <RuleItem icon={HelpCircle} title="A checklist and the questions to settle">{`What to prepare, and what to decide before you sign anything.`}</RuleItem>
        </RuleGrid>
      </Band>
    </>
  );
}
