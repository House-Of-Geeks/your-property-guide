"use client";

import { DEFAULT_MOVE, useMove } from "@/components/interactive/move-context";
import { HAMILTON, dollars } from "@/lib/case-studies";
import { CASE_CONTEXT } from "@/lib/home-start";
import { KICKER, SHELL } from "./shell";

// "In practice": the Hamilton example (20 Oct 2026, the approved design).
// Andy's facts only (src/lib/case-studies.ts): an older two-bedroom
// apartment with a boxed-in, outdated layout, a $38,000 cost-conscious
// redesign, and two EXPECTED sale prices. One qualification, beside the
// figures: they're expectations, not an achieved sale, and the difference
// isn't profit or a promise. No photographs: the buyer doesn't want hers
// online, and the brand photographs elsewhere on the page are never this
// apartment.

export function CaseNote() {
  const ctx = useMove();
  const move = ctx?.move ?? DEFAULT_MOVE;
  const c = CASE_CONTEXT[move];
  return (
    <section aria-labelledby="case-title" className={`${SHELL} border-b border-line py-11 sm:py-16`}>
      <div className="grid gap-[22px] md:grid-cols-[1fr_0.85fr] md:gap-x-[30px] md:gap-y-6 lg:grid-cols-[0.38fr_1fr_0.82fr] lg:gap-7">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 md:col-span-2 lg:col-span-1 lg:block lg:pt-[7px]">
          <p className={`${KICKER} lg:mb-3`}>In practice</p>
          <p className="text-[12px] text-ink-muted">{HAMILTON.place}</p>
        </div>
        <div>
          <h2 id="case-title" className="text-[34px] leading-[1.08] tracking-[-0.04em] text-ink sm:text-[39px]">
            {c.heading}
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink-muted sm:mt-[18px]">
            An older two-bedroom apartment. An outdated, boxy layout. A cost-conscious redesign that changed how the space worked and presented.
          </p>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink-muted">{c.context}</p>
        </div>
        <aside aria-label="The Hamilton example" className="self-start bg-terracotta-tint px-6 py-6 sm:px-[25px] sm:py-[23px]">
          <p className="text-[12px] uppercase tracking-[0.08em] text-primary">The decision</p>
          <h3 className="mt-3 font-display text-[29px] font-normal leading-[1.2] tracking-[-0.035em] text-ink sm:text-[28px]">
            Make better use
            <br />
            of what’s there.
          </h3>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-muted">
            {`A ${dollars(HAMILTON.spend)} renovation, with the layout and presentation considered together.`}
          </p>
          <details className="group mt-2.5">
            <summary className="min-h-[42px] cursor-pointer py-2.5 text-[14px] font-medium text-ink marker:text-primary">
              Explore the Hamilton example
            </summary>
            <dl className="mb-4 mt-2">
              {[
                ["Expected price before", dollars(HAMILTON.expectedBefore)],
                ["Renovation spend", dollars(HAMILTON.spend)],
                ["Expected price after", dollars(HAMILTON.expectedAfter)],
              ].map(([dt, dd]) => (
                <div key={dt} className="flex items-baseline justify-between gap-3.5 border-t border-line py-2.5">
                  <dt className="text-[13px] text-ink-muted">{dt}</dt>
                  <dd className="whitespace-nowrap font-display text-[22px] text-ink">{dd}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[12px] leading-[1.65] text-ink-muted">
              Both prices are expectations, not an achieved sale result. The difference is not profit or a promise of what another renovation would return.
            </p>
          </details>
        </aside>
      </div>
    </section>
  );
}
