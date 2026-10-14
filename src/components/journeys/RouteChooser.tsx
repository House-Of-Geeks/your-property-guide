import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HOW_WE_ARE_PAID_HREF } from "@/lib/service-model";

// The three ways in (Oct 2026): buying, selling, or both. Plain links to
// the journey hubs, so they work before any script loads, plus a quiet way
// in for anyone who isn't sure yet.

const ROUTES = [
  { href: "/buying", label: "I’m buying", sub: "Budget, schemes, inspections and offers" },
  { href: "/selling", label: "I’m selling", sub: "Costs, preparation, appraisals and agents" },
  { href: "/buying-and-selling", label: "I’m buying and selling", sub: "Which comes first, and the money in between" },
] as const;

export function RouteChooser({ heading = "Where would you like to start?", className = "" }: { heading?: string; className?: string }) {
  return (
    <nav aria-labelledby="route-chooser-heading" className={`tone-light rounded-xl bg-white p-4 sm:p-6 text-ink shadow-[0_12px_40px_-14px_rgb(22_25_29/0.35)] ${className}`}>
      <h2 id="route-chooser-heading" className="px-1 text-lg sm:text-xl font-bold text-ink">
        {heading}
      </h2>
      <ul className="mt-3 sm:mt-4 space-y-2.5">
        {ROUTES.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="group flex items-center justify-between gap-4 rounded-lg border border-line-strong px-4 py-3.5 sm:py-4 transition-colors hover:border-ink hover:bg-surface-warm"
            >
              <span className="min-w-0">
                <span className="block text-[17px] sm:text-lg font-bold leading-snug text-ink">{r.label}</span>
                <span className="block text-sm text-ink-muted leading-snug">{r.sub}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-ink transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 px-1 text-[15px] text-ink-muted">
        Not sure yet?{" "}
        <Link href="/plan" className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
          Make a two-minute plan
        </Link>
      </p>
      <ul className="mt-4 border-t border-line pt-4 px-1 grid gap-1.5 text-sm text-ink-muted">
        <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" strokeWidth={3} />Free guides and tools, no sign-up</li>
        <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" strokeWidth={3} />Introductions only with your permission</li>
        <li className="flex gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" strokeWidth={3} />
          <span>
            Clear about{" "}
            <Link href={HOW_WE_ARE_PAID_HREF} className="underline underline-offset-4">how we’re paid</Link>
          </span>
        </li>
      </ul>
    </nav>
  );
}
