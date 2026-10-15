import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { AgentChecks, AgentFinder } from "@/components/interactive/AgentFinder";
import { COMMISSION_STANCE, HOW_WE_ARE_PAID_HREF, LICENCE_REGISTERS, ONE_AGENT } from "@/lib/service-model";
import { BandLead, BandTitle, Eyebrow } from "./parts";
import { PartnerAgentCard } from "./PartnerAgentCard";
import { SHELL } from "./shell";

// One agent who runs the campaign (v6): how many agents (one for each job),
// what we take from their commission (nothing), the four checks with the
// licence registers, the way in, and, once a partner is listed with real
// data, their card.

export function OneAgentMatch() {
  return (
    <section id="agent" aria-labelledby="one-agent-title" className="scroll-mt-20 bg-sand py-20 sm:py-28">
      <div className={SHELL}>
        <div className="max-w-3xl">
          <Eyebrow>When you’re ready</Eyebrow>
          <BandTitle className="mt-5">
            <span id="one-agent-title">One agent who runs the campaign. Not five calls by dinner.</span>
          </BandTitle>
          <BandLead className="mt-6">
            We’ll introduce you to one agent who has proven they run campaigns this way in your suburb. Just one, checked by us. {ONE_AGENT}
          </BandLead>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {/* The commission comparison. */}
            <div className="grid overflow-hidden rounded-3xl border border-line bg-white sm:grid-cols-2">
              <div className="p-6 sm:p-7">
                <p className="text-sm font-semibold text-ink-muted">Many agent-finder sites</p>
                <p className="mt-3 font-display text-[26px] leading-tight text-ink">{COMMISSION_STANCE.theirsLabel}</p>
              </div>
              <div className="border-t border-line bg-eucalyptus p-6 tone-dark sm:border-l sm:border-t-0 sm:p-7">
                <p className="text-sm font-semibold text-ink-muted">Your Property Guide</p>
                <p className="mt-3 font-display text-[26px] leading-tight text-ink">
                  <span className="text-primary">{COMMISSION_STANCE.oursFigure}</span> {COMMISSION_STANCE.oursLabel}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">A flat fee per introduction, paid by the agent, whether or not you go ahead. It doesn’t change what you pay them.</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              {`We disclose it on every introduction, and the agent pays it either way. `}
              <Link href={HOW_WE_ARE_PAID_HREF} className="font-semibold text-ink underline underline-offset-4">
                How we’re paid
              </Link>
            </p>

            <h3 className="mt-12 text-xl text-ink">Every agent we introduce passes four checks</h3>
            <div className="mt-5">
              <AgentChecks />
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold text-ink">Check any agent’s licence yourself</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                {LICENCE_REGISTERS.map((r) => (
                  <li key={r.state}>
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink" aria-label={`${r.label} (opens in a new tab)`}>
                      {r.state}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <AgentFinder from="home-match" />
            <PartnerAgentCard />
            <ul className="space-y-2.5 text-[15px] text-ink">
              {["Free for you, with no obligation to use them", "Nothing is sent until you tick the permission box", "Buying and selling are separate introductions, each with its own yes"].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-eucalyptus" strokeWidth={2.5} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
