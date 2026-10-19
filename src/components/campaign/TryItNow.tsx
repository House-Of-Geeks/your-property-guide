"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { NumbersPanel } from "@/components/interactive/NumbersPanel";
import { DEFAULT_MOVE, useMove } from "@/components/interactive/move-context";
import { TOOLS } from "@/lib/tools";
import { HOME_MOVES, type DecisionTool } from "./moves";
import { BandLead, BandTitle, Eyebrow } from "./parts";
import { SHELL } from "./shell";

// Straight under the hero (19 Oct 2026): something useful before anything
// else. The live calculator for the move picked in the hero, and the three
// free tools that settle the next decision, each saying what it helps you
// decide. Sellers get the selling-costs calculator, the agent proposal
// worksheet and the agreement check; buyers their budget, schemes and
// checks; people doing both the order and the gap between the two.

export function TryItNow() {
  const move = useMove()?.move ?? DEFAULT_MOVE;
  const m = HOME_MOVES[move];
  return (
    <section id="try-it" aria-labelledby="try-it-title" className="scroll-mt-20 bg-cream py-16 sm:py-24">
      <div className={SHELL}>
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>Try it now, free</Eyebrow>
            <BandTitle className="mt-4">
              <span id="try-it-title">{m.toolsTitle}</span>
            </BandTitle>
          </div>
          <BandLead className="lg:col-span-5">{m.toolsLead}</BandLead>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <NumbersPanel tools={m.tools} from="home-try" />
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-lg text-ink">Then settle the next decision</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {m.decide.map((d) => (
                <li key={d.href}>
                  <DecisionCard tool={d} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link href="/tools" className="mt-8 inline-flex items-center gap-1.5 text-base font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          See all {TOOLS.length} free tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function DecisionCard({ tool }: { tool: DecisionTool }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-shadow has-[a:hover]:shadow-card-hover">
      <Link href={tool.href} className="group flex items-start justify-between gap-3 font-semibold text-ink">
        <span className="flex items-center gap-2">
          {tool.kind === "call" && <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
          {tool.title}
        </span>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
      <p className="mt-2 text-[15px] leading-snug text-ink">
        <span className="font-semibold">Helps you decide:</span> {tool.decides}
      </p>
      <p className="mt-1.5 text-sm leading-snug text-ink-muted">{tool.body}</p>
      {tool.note && <p className="mt-2 border-t border-line pt-2 text-[13px] leading-snug text-ink-muted">{tool.note}</p>}
    </div>
  );
}
