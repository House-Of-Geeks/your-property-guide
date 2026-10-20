import Link from "next/link";
import { ArrowRight } from "lucide-react";

// A calculator's or guide's next step (Oct 2026): what the result means for
// you, then one learning action and, where it fits, a quiet route to personal
// help. Pure markup, so client calculators and server pages can both use it.

export interface NextStepAction {
  label: string;
  href: string;
}

export function NextStepCard({
  title,
  body,
  primary,
  secondary = [],
  note,
  help,
  id,
  className = "",
}: {
  title: string;
  body: string;
  primary: NextStepAction;
  secondary?: NextStepAction[];
  note?: string;
  /** A quiet, optional route to personal help, under the actions. */
  help?: { text: string; label: string; href: string };
  id?: string;
  className?: string;
}) {
  return (
    <div id={id} className={`scroll-mt-24 rounded-xl border border-line bg-surface-warm p-6 sm:p-7 ${className}`}>
      <p className="text-sm font-semibold text-ink-muted mb-2">Next step</p>
      <h3 className="text-xl sm:text-2xl text-ink leading-tight tracking-tight">{title}</h3>
      <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">{body}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href={primary.href} className="inline-flex items-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-cta-ink px-5 py-3 text-[15px] font-semibold transition-colors">
          {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        {secondary.map((a) => (
          <Link key={a.href} href={a.href} className="text-[15px] font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
            {a.label}
          </Link>
        ))}
      </div>
      {help && (
        <p className="mt-5 border-t border-line pt-4 text-[15px] text-ink-muted leading-relaxed">
          {help.text}{" "}
          <Link href={help.href} className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
            {help.label}
          </Link>
          . Only with your permission.
        </p>
      )}
      {note && <p className="mt-4 text-sm text-ink-muted leading-relaxed">{note}</p>}
    </div>
  );
}
