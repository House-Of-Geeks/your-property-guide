import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, BookOpen } from "lucide-react";
import { PhotoHero, HeroTitle, HeroLead } from "@/components/premium";
import { PlanEmailForm } from "@/components/journeys/PlanEmailForm";
import { PrintButton } from "@/components/journeys/PrintButton";
import { answersFromParams } from "@/lib/plans/questions";
import { PLAN_DISCLAIMER, buildPlan } from "@/lib/plans/engine";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/components/premium/buttons";
import { redirect } from "next/navigation";

// /plan/result?j=…: the plan itself, built on the server from the answers in
// the URL (no personal data), so it can be bookmarked, shared and printed.
// Not indexed: every combination of answers is its own URL.

export const metadata: Metadata = {
  title: "Your next-step plan",
  robots: { index: false, follow: true },
};

export default async function PlanResultPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const answers = answersFromParams((k) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined));
  if (!answers) redirect("/plan");
  const plan = buildPlan(answers);
  const editHref = `/plan?${new URLSearchParams({ j: answers.journey }).toString()}`;

  return (
    <>
      <PhotoHero breadcrumbs={[{ label: "Your plan", href: "/plan" }, { label: "Result" }]}>
        <p className="text-base font-semibold text-ink-muted">Your next-step plan</p>
        <HeroTitle>{plan.title}</HeroTitle>
        <HeroLead>{plan.intro}</HeroLead>
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Link href={editHref} className="text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
            Change my answers
          </Link>
        </div>
      </PhotoHero>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-14">
          <section aria-labelledby="next-steps">
            <h2 id="next-steps" className="text-3xl sm:text-4xl text-ink tracking-[-0.025em]">Your next three steps</h2>
            <ol className="mt-8 space-y-8">
              {plan.nextSteps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-base font-bold text-white" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl text-ink">{s.title}</h3>
                    <p className="mt-2 text-base text-ink-muted leading-relaxed">{s.body}</p>
                    {s.link && (
                      <Link href={s.link.href} className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
                        {s.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="checklist">
            <h2 id="checklist" className="text-2xl sm:text-3xl text-ink tracking-[-0.02em]">{plan.checklist.title}</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {plan.checklist.groups.map((g) => (
                <div key={g.heading} className="border-t-2 border-ink pt-4">
                  <h3 className="text-lg text-ink">{g.heading}</h3>
                  <ul className="mt-3 space-y-2">
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[15px] text-ink leading-relaxed">
                        <span className="mt-1 inline-block h-4 w-4 shrink-0 rounded border border-line-strong" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="questions">
            <h2 id="questions" className="text-2xl sm:text-3xl text-ink tracking-[-0.02em]">Questions to settle</h2>
            <ul className="mt-6 space-y-3">
              {plan.questions.map((q) => (
                <li key={q} className="border-l-2 border-line-strong pl-4 text-base text-ink leading-relaxed">{q}</li>
              ))}
            </ul>
          </section>

          <p className="text-sm text-ink-muted leading-relaxed border-t border-line pt-6">{PLAN_DISCLAIMER}</p>
        </div>

        <aside className="lg:col-span-5 space-y-8">
          <div className="rounded-xl border border-line p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><Calculator className="h-5 w-5 text-primary" aria-hidden="true" /> Tools</h2>
            <ul className="mt-4 divide-y divide-line">
              {plan.tools.map((t) => (
                <li key={t.href} className="py-3">
                  <Link href={t.href} className="text-base font-semibold text-ink hover:text-primary">{t.label}</Link>
                  <p className="text-sm text-ink-muted">{t.note}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><BookOpen className="h-5 w-5 text-primary" aria-hidden="true" /> Guides</h2>
            <ul className="mt-4 divide-y divide-line">
              {plan.guides.map((g) => (
                <li key={g.href} className="py-3">
                  <Link href={g.href} className="text-base font-semibold text-ink hover:text-primary">{g.label}</Link>
                  <p className="text-sm text-ink-muted">{g.note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="print:hidden">
            <PlanEmailForm answers={answers} />
            <div className="mt-3"><PrintButton /></div>
          </div>

          <div className={`rounded-xl p-5 sm:p-6 print:hidden ${plan.help.level === "offer" ? "bg-surface-inverse tone-dark" : "bg-surface-warm"}`}>
            <h2 className="text-xl font-bold text-ink">{plan.help.headline}</h2>
            <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">{plan.help.body}</p>
            {plan.help.cta && (
              <Link href={plan.help.cta.href} className={`mt-5 ${plan.help.level === "offer" ? BUTTON_PRIMARY : BUTTON_SECONDARY}`}>
                {plan.help.cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
