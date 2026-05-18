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
  // Layout variant. "grid" is the homepage 2x2 with full illustrations.
  // "compact" is a horizontal row with smaller iconography for use elsewhere.
  variant?: "grid" | "compact";
}

export function PersonaPicker({ className, highlightActive = true, variant = "grid" }: PersonaPickerProps) {
  const router = useRouter();
  const { persona: currentPersona, setPersona, isHydrated } = usePersona();

  function handlePick(id: PersonaId, hubPath: string) {
    setPersona(id);
    router.push(hubPath);
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
