import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Pencil } from "lucide-react";
import { PhotoHero, HeroTitle, HeroLead } from "@/components/premium";
import { PLAN_EMAIL_ANCHOR, PlanEmailForm, PlanSaveActions } from "@/components/journeys/PlanEmailForm";
import { PrintButton } from "@/components/journeys/PrintButton";
import { BUYER_TYPES, BUY_STAGES, MOVE_ORDERS, SELL_STAGES, TIMEFRAMES, answersFromParams, editPlanHref, suburbSlugLabel, type PlanAnswers } from "@/lib/plans/questions";
import { PLAN_NAME } from "@/lib/plans/name";
import { getSuburbName } from "@/lib/services/suburb-service";
import { PLAN_DISCLAIMER, buildPlan, helpHref, type Plan } from "@/lib/plans/engine";
import { availabilityNote } from "@/lib/introductions/rules";
import { COMMISSION_STANCE, HOW_WE_ARE_PAID_HREF, INTRODUCTION_STEPS, ONE_AGENT, SERVICES, type IntroService } from "@/lib/service-model";
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
            <li key={c} className="rounded-[4px] border border-line-strong px-3.5 py-1.5 text-sm font-semibold text-ink">{c}</li>
          ))}
          {suburb && (
            <li>
              {suburb.href ? (
                <Link href={suburb.href} className="inline-flex items-center gap-1.5 rounded-[4px] border border-ink px-3.5 py-1.5 text-sm font-semibold text-ink hover:bg-ink hover:text-ink-inverse">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {suburb.label}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong px-3.5 py-1.5 text-sm font-semibold text-ink">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {suburb.label}
                </span>
              )}
            </li>
          )}
        </ul>
        {/* Keep it (20 Oct 2026): the email form stays beside the steps (after
            them on phones); these take the reader to it, or to print. */}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 print:hidden">
          <PlanSaveActions />
          <Link href={editHref} className="inline-flex items-center gap-1.5 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
            <Pencil className="h-4 w-4" aria-hidden="true" /> Change my answers
          </Link>
        </div>
      </PhotoHero>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-14">
          <section aria-labelledby="next-steps">
            <h2 id="next-steps" className="text-[32px] sm:text-[40px] leading-[1.1] text-ink tracking-[-0.04em]">Your next three steps</h2>
            <ol className="mt-8 space-y-8">
              {plan.nextSteps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4">
                  <span className="font-display text-[30px] leading-none text-primary" aria-hidden="true">
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
              <h2 className="font-display text-[22px] tracking-[-0.025em] text-ink">{suburb.label}</h2>
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
            <h2 className="font-display text-[22px] tracking-[-0.025em] text-ink">Tools</h2>
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
            <h2 className="font-display text-[22px] tracking-[-0.025em] text-ink">Guides</h2>
            <ul className="mt-4 divide-y divide-line">
              {plan.guides.map((g) => (
                <li key={g.href} className="py-3">
                  <Link href={g.href} className="text-base font-semibold text-ink hover:text-primary">{g.label}</Link>
                  <p className="text-sm text-ink-muted">{g.note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div id={PLAN_EMAIL_ANCHOR} className="scroll-mt-24 print:hidden">
            <PlanEmailForm answers={answers} />
            <div className="mt-3"><PrintButton /></div>
          </div>

          <PersonalHelp plan={plan} answers={answers} />
        </aside>
      </div>
    </>
  );
}

/**
 * Personal help for the plan's move (20 Oct 2026). Sellers: compare the
 * agents they meet (the proposal worksheet), and an appraisal introduction
 * with the honest coverage line. Buyers: a buyer's agent where we can, said
 * honestly (the network is still being built; the team reads every request).
 * Both: separate introductions, each with its own yes. The headline, body
 * and main action are the plan's own (src/lib/plans/engine.ts), so the
 * buying / selling / both handoff to /get-help is unchanged; every promise
 * here comes from src/lib/service-model.ts and src/lib/introductions/rules.ts.
 */
function PersonalHelp({ plan, answers }: { plan: Plan; answers: PlanAnswers }) {
  const help = plan.help;
  const offer = help.level === "offer";
  const panel = `rounded-xl p-5 sm:p-6 print:hidden ${offer ? "bg-surface-inverse tone-dark" : "bg-surface-warm"}`;
  const action = help.cta && (
    <Link href={help.cta.href} className={`mt-5 ${offer ? BUTTON_PRIMARY : BUTTON_SECONDARY}`}>
      {help.cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );

  // Signed with an agent: no introduction, nothing to compare.
  if (help.level === "none") {
    return (
      <div className={panel}>
        <h2 className="font-display text-[24px] leading-snug tracking-[-0.03em] text-ink">{help.headline}</h2>
        <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">{help.body}</p>
        {action}
      </div>
    );
  }

  const sells = help.services.includes("selling-agent");
  const buys = help.services.includes("buyers-agent");
  const both = sells && buys;
  // A row links to its own request only where the main action isn't already that request.
  const rowLink = (service: IntroService) => {
    const href = helpHref([service], answers);
    return !both && help.cta?.href !== href ? href : null;
  };
  const appraisalHref = sells ? rowLink("selling-agent") : null;
  const buyersHref = buys ? rowLink("buyers-agent") : null;
  const rowLinkClass = "mt-2 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink";

  return (
    <section aria-labelledby="personal-help-title" className={panel}>
      <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-primary">Personal help, only if you ask</p>
      <h2 id="personal-help-title" className="mt-2 font-display text-[24px] leading-snug tracking-[-0.03em] text-ink">{help.headline}</h2>
      <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">{help.body}</p>

      <ul className="mt-5 border-t border-line">
        {sells && (
          <li className="border-b border-line py-4">
            <h3 className="text-[16px] font-medium leading-snug text-ink">Compare the agents you meet</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">
              Put up to three agents’ proposals side by side, with the cost of each in dollars, before you choose.
            </p>
            <Link href="/tools/agent-proposal-worksheet" className={rowLinkClass}>
              Agent proposal worksheet <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
        )}
        {sells && (
          <li className="border-b border-line py-4">
            <h3 className="text-[16px] font-medium leading-snug text-ink">An appraisal from one participating agent</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">
              {`${SERVICES["selling-agent"].what[0]}. ${availabilityNote("selling-agent", answers.state).text}`}
            </p>
            {appraisalHref && (
              <Link href={appraisalHref} className={rowLinkClass}>
                Ask for an appraisal introduction <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </li>
        )}
        {buys && (
          <li className="border-b border-line py-4">
            <h3 className="text-[16px] font-medium leading-snug text-ink">A buyer’s agent, where we can</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{availabilityNote("buyers-agent", answers.state).text}</p>
            {buyersHref && (
              <Link href={buyersHref} className={rowLinkClass}>
                Ask about a buyer’s agent <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </li>
        )}
      </ul>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-muted">{both ? INTRODUCTION_STEPS[1].body : ONE_AGENT}</p>
      {action}
      <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
        {`${COMMISSION_STANCE.ours} `}
        <Link href={HOW_WE_ARE_PAID_HREF} className="underline underline-offset-4">How we’re paid</Link>
      </p>
    </section>
  );
}
