import type { ReactNode } from "react";

// Small shared pieces of the campaign bands (v6, 15 Oct 2026; BRAND.md §14).

/** The small copper label above a section heading. Copper on light, light copper inside .tone-dark. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[13px] font-semibold uppercase tracking-[0.2em] text-primary ${className}`}>{children}</p>;
}

/** A band's H2 in the serif. */
export function BandTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-[34px] leading-[1.08] tracking-[-0.015em] text-ink sm:text-5xl lg:text-[56px] ${className}`}>{children}</h2>;
}

/** The standfirst under a band's H2. */
export function BandLead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-lg leading-relaxed text-ink-muted ${className}`}>{children}</p>;
}
