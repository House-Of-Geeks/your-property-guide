import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { ExpertCTA } from "./ExpertCTA";
import { PERSONAS, getPersonaById, type PersonaId } from "@/lib/constants/journey";

interface PersonaHubLayoutProps {
  personaId: PersonaId;
}

// Shared layout for all four persona hubs (/first-home-buyers, /selling,
// /upgrading, /investing). Editorial, education-first. Each hub leads with
// the persona's bespoke illustration over a warm hero, then surfaces three
// real existing pages as starting points, then a universal suburb-data CTA,
// then a soft expert CTA, then chips to the other personas.

export function PersonaHubLayout({ personaId }: PersonaHubLayoutProps) {
  const persona = getPersonaById(personaId);
  if (!persona) return null;

  const otherPersonas = PERSONAS.filter((p) => p.id !== personaId);

  return (
    <>
      {/* Editorial hero. Magazine masthead with numbered persona slug,
          display-scale H1 with italic emphasis on the persona noun, serif
          standfirst. Illustration column dropped: hub pages read as
          authoritative editorial when the headline owns the page. */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.12] pointer-events-none select-none"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
          {/* Magazine masthead: italic persona ordinal + hairline + label */}
          <div className="flex items-center gap-4 mb-12">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. {String(persona.order).padStart(2, "0")}
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Your Property Guide for
            </span>
          </div>

          {/* Display-scale H1. Persona heading owns the page */}
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            {persona.hubHeading}
          </h1>

          {/* Standfirst */}
          <p className="font-display font-light text-xl sm:text-2xl lg:text-3xl text-ink leading-[1.25] max-w-3xl">
            {persona.hubLede}
          </p>
        </div>
      </section>

      {/* Three starting points */}
      <section className="py-20 sm:py-24 bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Magazine-style section masthead */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              Start here
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Three first reads
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 mb-14">
            <div className="lg:col-span-7">
              <h2 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl font-medium">
                Three places worth your{" "}
                <span className="italic font-light text-primary">first ten minutes</span>.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="font-display font-light text-lg sm:text-xl text-ink leading-snug max-w-md">
                Real pages on the site, not lead-capture forms. If they answer
                your question, great. If not, the rest of the hub is below.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {persona.startingPoints.map((sp, i) => (
              <Link
                key={sp.href}
                href={sp.href}
                className="group rounded-2xl border border-line bg-surface-raised hover:border-ink hover:shadow-card-hover p-7 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  {sp.icon ? (
                    <div className="w-10 h-10 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center">
                      <Image
                        src={sp.icon}
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        aria-hidden="true"
                      />
                    </div>
                  ) : <span />}
                  <p className="font-display italic text-cta text-xl">
                    0{i + 1}
                  </p>
                </div>
                <h3 className="font-display text-xl text-ink leading-tight mb-3">
                  {sp.label}
                </h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1 mb-5">
                  {sp.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
                  Open
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suburb data CTA, universal */}
      <section className="relative py-16 sm:py-20 bg-surface-warm border-y border-line-warm overflow-hidden">
        <Image
          src="/images/illustrations/street-grid.svg"
          alt=""
          width={400}
          height={400}
          aria-hidden="true"
          className="absolute -right-12 -bottom-12 w-[400px] opacity-[0.12] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <MapPin className="w-7 h-7 text-cta mb-4" />
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-4">
                Suburb data, free for everyone.
              </h2>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-7 max-w-xl">
                Median, twelve-month growth, days on market, rental yield, schools, walkability,
                climate and crime. The numbers we&rsquo;d want for our own move, ungated.
              </p>
              <Link
                href="/suburbs"
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong text-ink hover:bg-surface-raised hover:border-ink font-medium px-5 py-2.5 transition-colors"
              >
                Browse suburbs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="lg:col-span-5 space-y-4 font-sans text-sm text-ink-muted border-l border-line-strong pl-6">
              <li>
                <p className="text-ink font-medium mb-1">Sources cited</p>
                <p className="leading-relaxed">Every figure tagged with where it came from and when it was last refreshed.</p>
              </li>
              <li>
                <p className="text-ink font-medium mb-1">Comparison-ready</p>
                <p className="leading-relaxed">Side-by-side any two suburbs in Australia.</p>
              </li>
              <li>
                <p className="text-ink font-medium mb-1">No login</p>
                <p className="leading-relaxed">No paywall, no sign-up, no download form.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Soft expert CTA */}
      <ExpertCTA />

      {/* Other personas */}
      <section className="py-12 border-t border-line bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Not what you came for?
          </p>
          <div className="flex flex-wrap gap-3">
            {otherPersonas.map((p) => (
              <Link
                key={p.id}
                href={p.hubPath}
                className="group inline-flex items-center gap-3 rounded-full border border-line-strong px-5 py-3 text-sm font-medium text-ink hover:bg-surface-warm hover:border-ink transition-colors"
              >
                <Image
                  src={p.illustration}
                  alt=""
                  width={48}
                  height={32}
                  className="w-12 h-8 object-contain"
                />
                {p.cardLabel}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
