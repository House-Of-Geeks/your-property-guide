"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { usePersona } from "@/hooks/usePersona";
import { PERSONAS, type PersonaId } from "@/lib/constants/journey";

interface PersonaPickerProps {
  className?: string;
  // When true, reads localStorage to highlight the persona the user previously
  // chose. Default true; set false on hub pages where we already know context.
  highlightActive?: boolean;
  // Layout variant.
  //   "grid"    — 2-up cards with full illustrations (used on persona hubs)
  //   "compact" — small grid with thumbnails (used in narrow contexts)
  //   "rail"    — editorial list: numeral · thumb · label · blurb · arrow.
  //               Used on the homepage; dense, scannable, brand-on.
  variant?: "grid" | "compact" | "rail";
}

export function PersonaPicker({ className, highlightActive = true, variant = "grid" }: PersonaPickerProps) {
  const router = useRouter();
  const { persona: currentPersona, setPersona, isHydrated } = usePersona();

  function handlePick(id: PersonaId, hubPath: string) {
    setPersona(id);
    router.push(hubPath);
  }

  if (variant === "rail") {
    return (
      <div className={className}>
        <ul className="border-t border-line">
          {PERSONAS.map((p, i) => {
            const isActive = highlightActive && isHydrated && currentPersona === p.id;
            return (
              <li key={p.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => handlePick(p.id, p.hubPath)}
                  aria-label={`${p.cardLabel}. ${p.cardBlurb}`}
                  className={`
                    group w-full flex items-center gap-4 sm:gap-6 py-4 sm:py-5 px-2 -mx-2 text-left transition-colors cursor-pointer
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                    ${isActive ? "bg-surface-warm" : "hover:bg-surface-warm"}
                  `}
                >
                  <span className="font-display italic text-primary text-base sm:text-lg tabular-nums leading-none w-8 sm:w-10 shrink-0">
                    0{i + 1}
                  </span>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-surface-raised border border-line-warm shrink-0 overflow-hidden flex items-center justify-center">
                    <Image
                      src={p.illustration}
                      alt=""
                      width={64}
                      height={64}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-ink leading-tight tracking-tight">
                      {p.cardLabel}
                    </h3>
                    <p className="font-sans text-sm text-ink-muted leading-snug mt-1 line-clamp-1 sm:line-clamp-2 lg:line-clamp-1">
                      {p.cardBlurb}
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink-subtle group-hover:text-primary transition-colors shrink-0">
                    {isActive ? "Continue" : "Open"}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <ArrowRight className="sm:hidden w-5 h-5 text-ink-subtle group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={className}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PERSONAS.filter((p) => p.featuredOnHomepage).map((p) => {
            const isActive = highlightActive && isHydrated && currentPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePick(p.id, p.hubPath)}
                className={`
                  group text-left rounded-xl border p-4 transition-all cursor-pointer
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                  ${isActive
                    ? "border-ink bg-surface-warm shadow-card"
                    : "border-line bg-surface-raised hover:border-ink hover:shadow-card"}
                `}
              >
                <Image
                  src={p.illustration}
                  alt={`Illustration for ${p.cardLabel}`}
                  width={320}
                  height={220}
                  className="w-full h-auto mb-2"
                />
                <p className="text-sm font-medium text-ink">{p.cardLabel}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        {PERSONAS.map((p, i) => {
          const isActive = highlightActive && isHydrated && currentPersona === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePick(p.id, p.hubPath)}
              aria-label={`${p.cardLabel}. ${p.cardBlurb}`}
              className={`
                group text-left rounded-2xl border overflow-hidden transition-all cursor-pointer
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                ${isActive
                  ? "border-ink bg-surface-warm shadow-card-hover"
                  : "border-line bg-surface-warm hover:border-ink hover:shadow-card-hover"}
              `}
            >
              {/* Illustration band with editorial numeral overlay. The
                  numeral sits in the top-left, the illustration is right-
                  aligned and trimmed, giving each card a magazine-cover
                  layout instead of a centered SaaS card. */}
              <div className="aspect-[16/9] bg-surface-raised border-b border-line-warm relative overflow-hidden">
                <span className="absolute top-4 left-5 font-display italic text-primary text-xl leading-none tabular-nums z-10">
                  No. {String(i + 1).padStart(2, "0")}
                </span>
                <Image
                  src={p.illustration}
                  alt={`Illustration for ${p.cardLabel}`}
                  width={320}
                  height={220}
                  className="w-full h-full object-contain p-4 pl-16 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              {/* Copy. Display heading for editorial weight; arrow CTA uses
                  the underlined cross-reference pattern from the hero. */}
              <div className="p-6 sm:p-7">
                <h3 className="text-2xl sm:text-3xl font-display text-ink leading-[1.1] mb-3 tracking-tight">
                  {p.cardLabel}
                </h3>
                <p className="font-sans text-base text-ink-muted leading-relaxed mb-5">
                  {p.cardBlurb}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors">
                  {isActive ? "Continue reading" : "Open the guide"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
