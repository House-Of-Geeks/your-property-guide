import Link from "next/link";
import { ExternalLink, ShieldCheck, TrendingUp, MessagesSquare, BadgeCheck } from "lucide-react";
import { Band, RuleGrid, RuleItem, SectionHeading, StepTimeline } from "@/components/premium";
import { BUTTON_PRIMARY as BUTTON_PRIMARY_CLASS } from "@/components/premium/buttons";
import { availabilityNote } from "@/lib/introductions/rules";
import {
  FEE_DISCLOSURE,
  FEE_DISTINCTION,
  HOW_WE_ARE_PAID_HREF,
  INTRODUCTION_STEPS,
  LICENCE_REGISTERS,
  PARTNER_CHECKS,
  REASSURANCES,
  SERVICES,
  WHAT_WE_DONT_DO,
  type IntroService,
} from "@/lib/service-model";

// The service model, rendered (Oct 2026). Every page that explains
// introductions uses these, so the homepage, /get-help, the hubs and the
// agent pages can't drift apart. Copy lives in src/lib/service-model.ts.

const CHECK_ICONS = [BadgeCheck, TrendingUp, MessagesSquare, ShieldCheck];

/** The five steps of an introduction, with permission and payment said plainly. */
export function HowIntroductionsWork({ tone = "dark", id = "how-introductions-work", cta }: { tone?: "dark" | "light" | "quiet"; id?: string; cta?: React.ReactNode }) {
  return (
    <Band tone={tone} id={id}>
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading title="How an introduction works" />
          <p className="mt-6 text-lg text-ink-muted leading-relaxed">
            Personal help is there when you want it, and only then. Reading a guide, using a calculator or making a plan never puts you in touch with an agent.
          </p>
          <div className="mt-8 rounded-xl border border-line p-5">
            <p className="text-base font-semibold text-ink">How we’re paid</p>
            <p className="mt-2 text-base text-ink-muted leading-relaxed">{FEE_DISCLOSURE}</p>
            <p className="mt-3 text-base text-ink-muted leading-relaxed">{FEE_DISTINCTION}</p>
            <Link href={HOW_WE_ARE_PAID_HREF} className="mt-3 inline-block text-base font-semibold text-ink underline underline-offset-4">
              The full detail
            </Link>
          </div>
          {cta && <div className="mt-8">{cta}</div>}
        </div>
        <div className="lg:col-span-7">
          <StepTimeline steps={INTRODUCTION_STEPS} className="mt-2" />
        </div>
      </div>
    </Band>
  );
}

/** What an agent must show before they receive introductions, and how to check them yourself. */
export function HowWeChooseAgents({ tone = "light", id = "how-we-choose" }: { tone?: "dark" | "light" | "quiet"; id?: string }) {
  return (
    <Band tone={tone} id={id}>
      <SectionHeading
        title="How we choose the agents we introduce"
        intro="Agents can’t buy their way in. Before an agent receives introductions from us, we check four things, and the people we introduce tell us how it went."
      />
      <RuleGrid>
        {PARTNER_CHECKS.map((c, i) => (
          <RuleItem key={c.title} icon={CHECK_ICONS[i]} title={c.title}>
            {c.body}
          </RuleItem>
        ))}
      </RuleGrid>
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-xl text-ink">Check any agent’s licence yourself</h3>
          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {LICENCE_REGISTERS.map((r) => (
              <li key={r.state}>
                <a href={r.href} className="inline-flex items-center gap-1.5 text-[15px] text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink" rel="noopener" target="_blank">
                  <span className="font-semibold">{r.state}</span> licence register
                  <ExternalLink className="h-3.5 w-3.5 text-ink-subtle" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl text-ink">What we don’t do</h3>
          <ul className="mt-4 space-y-2.5">
            {WHAT_WE_DONT_DO.map((t) => (
              <li key={t} className="text-[15px] text-ink-muted leading-relaxed border-l-2 border-line-strong pl-4">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Band>
  );
}

/** The three reassurances as a quiet row (hero foot, form side). */
export function ReassuranceList({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid gap-4 sm:grid-cols-3 ${className}`}>
      {REASSURANCES.map((r) => (
        <li key={r.title} className="border-t border-line pt-3">
          <p className="text-[15px] font-semibold text-ink">{r.title}</p>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">
            {r.title.startsWith("Clear") ? (
              <>
                {r.body}{" "}
                <Link href={HOW_WE_ARE_PAID_HREF} className="underline underline-offset-4">How we’re paid</Link>
              </>
            ) : (
              r.body
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * A compact "personal help" band for hubs and guides: who we'd introduce,
 * what they charge, honest availability, and the permission it needs.
 */
export function HelpBand({ service, from, tone = "quiet" }: { service: IntroService; from: string; tone?: "light" | "quiet" | "dark" }) {
  const s = SERVICES[service];
  const note = availabilityNote(service, null);
  const href = `/get-help?service=${service}&from=${encodeURIComponent(from)}`;
  return (
    <Band tone={tone} spacing="compact" id="personal-help">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-3xl sm:text-4xl text-ink tracking-[-0.025em]">
            {service === "selling-agent" ? "When you want an appraisal" : "If you want someone on your side"}
          </h2>
          <p className="mt-4 text-lg text-ink-muted leading-relaxed">{s.who}</p>
          <Link href={href} className={`mt-6 ${BUTTON_PRIMARY_CLASS}`}>
            {service === "selling-agent" ? "Ask for an appraisal introduction" : "Ask about a buyer’s agent"}
          </Link>
        </div>
        <div className="lg:col-span-7 space-y-4 text-base leading-relaxed">
          <p className="text-ink-muted"><strong className="text-ink">What they charge:</strong> {s.fees}</p>
          <p className="text-ink-muted"><strong className="text-ink">Where we can help:</strong> {note.text}</p>
          <p className="text-ink-muted">
            <strong className="text-ink">How we’re paid:</strong> {FEE_DISCLOSURE}{" "}
            <Link href={HOW_WE_ARE_PAID_HREF} className="underline underline-offset-4">The full detail</Link>
          </p>
          <p className="text-ink-muted">
            Reading this page, using a calculator or downloading a guide never passes your details to anyone. An introduction needs its own yes.
          </p>
        </div>
      </div>
    </Band>
  );
}
