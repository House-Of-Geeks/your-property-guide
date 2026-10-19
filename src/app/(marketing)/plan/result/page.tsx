import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, BookOpen, MapPin, Pencil } from "lucide-react";
import { PhotoHero, HeroTitle, HeroLead } from "@/components/premium";
import { PlanEmailForm } from "@/components/journeys/PlanEmailForm";
import { PrintButton } from "@/components/journeys/PrintButton";
import { BUYER_TYPES, BUY_STAGES, MOVE_ORDERS, SELL_STAGES, TIMEFRAMES, answersFromParams, editPlanHref, suburbSlugLabel, type PlanAnswers } from "@/lib/plans/questions";
import { PLAN_NAME } from "@/lib/plans/name";
import { getSuburbName } from "@/lib/services/suburb-service";
import { PLAN_DISCLAIMER, buildPlan } from "@/lib/plans/engine";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/components/premium/buttons";
import { redirect } from "next/navigation";

// /plan/result?j=…: the plan itself, built on the server from the answers in
// the URL (no personal data), so it can be bookmarked, shared and printed.
// Not indexed: every combination of answers is its own URL.
//
// 19 Oct 2026: the move, the state and the suburb carried from the homepage
// show at the top, the suburb links to its profile, and "Change my answers"
// reopens every answer (editPlanHref) instead of starting again.

const STATE_NAMES: Record<string, string> = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland", WA: "Western Australia", SA: "South Australia", TAS: "Tasmania", ACT: "the ACT", NT: "the Northern Territory",
};
const MOVE_NAMES: Record<PlanAnswers["journey"], string> = { selling: "Selling", buying: "Buying", "buying-and-selling": "Selling and buying" };

/** The answers worth showing back, in words: the move, the state, then the stage and timing. */
function contextOf(a: PlanAnswers): string[] {
  const find = (opts: readonly { id: string; label: string }[], id: string | null | undefined) => opts.find((o) => o.id === id)?.label;
  return [
    MOVE_NAMES[a.journey],
    a.journey === "buying" ? find(BUYER_TYPES, a.buyerType) : undefined,
    a.state ? STATE_NAMES[a.state] : undefined,
    a.journey === "selling" ? find(SELL_STAGES, a.sellStage) : a.journey === "buying" ? find(BUY_STAGES, a.buyStage) : find(MOVE_ORDERS, a.order),
    find(TIMEFRAMES, a.timeframe),
  ].filter((x): x is string => !!x);
}

export const metadata: Metadata = {
  title: "Your next-step plan",
  robots: { index: false, follow: true },
};

export default async function PlanResultPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const answers = answersFromParams((k) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined));
  if (!answers) redirect("/plan");
  const plan = buildPlan(answers);
  const editHref = editPlanHref(answers);
  // The suburb from the homepage or the planner, named from the database when it's there.
  const suburbRow = answers.suburb ? await getSuburbName(answers.suburb) : null;
  const suburb = answers.suburb
    ? { label: suburbRow ? `${suburbRow.name}, ${suburbRow.state} ${suburbRow.postcode}` : suburbSlugLabel(answers.suburb), href: suburbRow ? `/suburbs/${suburbRow.slug}` : null }
    : null;

  return (
    <>
      <PhotoHero breadcrumbs={[{ label: "Your plan", href: "/plan" }, { label: "Result" }]}>
        <p className="text-base font-semibold text-ink-muted">{`Your ${PLAN_NAME}${suburb ? ` for ${suburb.label}` : answers.state ? ` for ${STATE_NAMES[answers.state]}` : ""}`}</p>
        <HeroTitle>{plan.title.replace(/^Your next-step plan:\s*/, "").replace(/^./, (c) => c.toUpperCase())}</HeroTitle>
        <HeroLead>{plan.intro}</HeroLead>
        <ul className="mt-7 flex flex-wrap gap-2" aria-label="Built from your answers">
          {contextOf(answers).map((c) => (
            <li key={c} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm font-semibold text-ink">{c}</li>
          ))}
          {suburb && (
            <li>
              {suburb.href ? (
                <Link href={suburb.href} className="inline-flex items-center gap-1.5 rounded-full border border-ink px-3.5 py-1.5 text-sm font-semibold text-ink hover:bg-ink hover:text-ink-inverse">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {suburb.label}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm font-semibold text-ink">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {suburb.label}
                </span>
              )}
            </li>
          )}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          <Link href={editHref} className="inline-flex items-center gap-1.5 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
            <Pencil className="h-4 w-4" aria-hidden="true" /> Change my answers
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
          {suburb?.href ? (
            <div className="rounded-xl border border-line bg-surface-warm p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><MapPin className="h-5 w-5 text-primary" aria-hidden="true" /> {suburb.label}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                {answers.journey === "buying" ? "Recent prices, rents, schools and local data, to judge each price guide against." : "Recent prices and local data, to test any agent’s price against."}
              </p>
              <Link href={suburb.href} className="mt-4 inline-flex items-center gap-1.5 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
                See the suburb profile <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            !suburb && (
              <p className="rounded-xl border border-dashed border-line-strong p-5 text-[15px] leading-relaxed text-ink-muted print:hidden">
                {`Add your suburb and the plan links its profile: recent prices and local data. `}
                <Link href={editPlanHref(answers, "state")} className="font-semibold text-ink underline underline-offset-4">Add a suburb</Link>
              </p>
            )
          )}
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
