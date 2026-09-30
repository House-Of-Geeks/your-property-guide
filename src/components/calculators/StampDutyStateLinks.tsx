import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ABBR,
  AUSTRALIAN_STATES,
  FIRST_HOME_SUMMARY,
  money,
  stampDutySlug,
  dutyFor,
  type AustralianState,
} from "@/lib/data/stamp-duty-state";

/**
 * Links to the eight calculator-first state guides (item 20). Used as the
 * "Calculate by state" block on /stamp-duty-calculator and as the "other
 * states" block on each state guide. Each card carries the engine's figure for
 * an owner-occupier at $750,000, so the link text is itself a comparison.
 */
export function StampDutyStateLinks({ states = AUSTRALIAN_STATES }: { states?: readonly AustralianState[] }) {
  return (
    <ul className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0">
      {states.map((s) => (
        <li key={s}>
          <Link
            href={`/guides/${stampDutySlug(s)}`}
            className="group flex items-start justify-between gap-3 rounded-xl border border-line bg-surface-raised p-4 hover:border-primary/40 hover:shadow-md transition-all h-full"
          >
            <span className="min-w-0">
              <span className="block font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                {ABBR[s]} stamp duty calculator
              </span>
              <span className="block font-sans text-sm text-ink-muted mt-1">
                {money(dutyFor(s, 750_000, "owner").total)} on a $750,000 home; {FIRST_HOME_SUMMARY[s]}.
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors mt-1 shrink-0" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
