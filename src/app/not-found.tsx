import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

// The 404 page (v7, "Clear decisions", 20 Oct 2026). It renders outside the
// marketing layout, so it carries the logo itself; the way back is a short
// list under fine rules.

const LINKS = [
  { label: "Find my next step", href: "/plan", blurb: "A few questions, then your next three steps. Free, no sign-up." },
  { label: "Browse all guides", href: "/guides", blurb: "Practical guides to buying and selling in every state." },
  { label: "Tools and calculators", href: "/tools", blurb: "Stamp duty, borrowing power, repayments and selling costs." },
  { label: "Look up a suburb", href: "/suburbs", blurb: "Prices, schools and local data, with sources." },
  { label: "Buying a home", href: "/buying-guide", blurb: "The free guide, from your first budget to the keys." },
  { label: "Selling a home", href: "/selling-guide", blurb: "The free guide to preparing, choosing an agent and selling." },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <Link href="/" aria-label="Your Property Guide, home" className="inline-block">
          <Logo size="md" />
        </Link>
        <div className="mt-16 max-w-3xl sm:mt-24">
          <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-primary">404 · Page not found</p>
          <h1 className="mt-5 text-[46px] leading-[1.04] tracking-[-0.045em] text-ink sm:text-[64px]">This page isn’t here.</h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-[1.7] text-ink-muted">
            It may have moved, been renamed or never existed. These should get you back on track.
          </p>
        </div>
        <ul className="mt-12 grid max-w-5xl border-t border-line sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
          {LINKS.map((l) => (
            <li key={l.href} className="border-b border-line">
              <Link href={l.href} className="group flex items-start justify-between gap-4 py-5">
                <span>
                  <span className="block font-display text-[22px] leading-snug tracking-[-0.025em] text-ink group-hover:text-primary">{l.label}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-ink-muted">{l.blurb}</span>
                </span>
                <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-ink-subtle group-hover:text-primary" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
