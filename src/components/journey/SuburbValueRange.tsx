"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, MapPin } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { SuburbAppraisalCTA } from "@/components/suburb/SuburbAppraisalCTA";
import { formatPriceFull } from "@/lib/utils/format";
import { homeValueSource, type HomeValueSummary } from "@/lib/home-value";
import { medianCaption, publishedRange, rangeCaption, rangeLabel, sourceLine, withheldNote, type Dwelling } from "@/lib/value-range";

interface Props {
  /**
   * What follows the figures once a suburb is chosen: the suburb appraisal
   * form (the guide), or a link to the page's own form (/appraisal,
   * /property-valuation, where AppraisalForm is already on the page).
   */
  after: "form" | "link";
  /** For after="link": where the button goes. */
  appraisalHref?: string;
  /** For after="form": Clarity form name and the lead source for the suburb. */
  formName?: string;
  leadSource?: (slug: string) => string;
  headingLevel?: "h2" | "h3";
  eyebrow?: string;
}

const DWELLINGS: { id: Dwelling; label: string }[] = [
  { id: "house", label: "House" },
  { id: "unit", label: "Unit" },
];

/**
 * "What homes like yours sell for in {Suburb}": suburb first, then a
 * dwelling type, then the suburb's published median for that type with its
 * source and period and a band of 15% either side (src/lib/value-range.ts).
 * A suburb whose median the published-medians rule withholds gets the reason
 * and the appraisal offer, never a figure. The band is the suburb's, not a
 * valuation of the visitor's home, and the copy says so under every range.
 */
export function SuburbValueRange({
  after,
  appraisalHref = "#appraisal-form",
  formName = "home-value-guide",
  leadSource = homeValueSource,
  headingLevel = "h2",
  eyebrow = "Instant range from published sales medians",
}: Props) {
  const Heading = headingLevel;
  const [summary, setSummary] = useState<HomeValueSummary | null>(null);
  const [dwelling, setDwelling] = useState<Dwelling>("house");
  const [label, setLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (slug: string, picked: string) => {
    setLabel(picked);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/suburbs/summary?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error("lookup failed");
      const next = (await res.json()) as HomeValueSummary;
      setSummary(next);
      // Open on the type the suburb publishes, house first.
      setDwelling(next.medianHousePrice !== null || next.medianUnitPrice === null ? "house" : "unit");
    } catch {
      setError("We couldn't load that suburb. Try again or pick a nearby one.");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSummary(null);
    setLabel(null);
    setError(null);
    setDwelling("house");
  };

  if (!summary) {
    return (
      <div className="not-prose rounded-2xl border border-cta/30 bg-surface-warm p-6 sm:p-8 shadow-card">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-3">{eyebrow}</p>
        <Heading className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
          What homes like yours sell for
        </Heading>
        <p className="font-sans text-sm text-ink-muted mb-5 max-w-lg leading-relaxed">
          Pick your suburb and we show the published median for houses or units there, with its source and
          period, and a range either side of it. It is the suburb&rsquo;s figure, not a valuation of your home.
        </p>
        <div className="rounded-xl border border-line-strong bg-surface-raised">
          <SuburbAutocomplete
            placeholder="Suburb or postcode, e.g. Bondi or 2026"
            onSelectLocation={pick}
            onClear={reset}
          />
        </div>
        {loading && (
          <p className="mt-3 inline-flex items-center gap-2 font-sans text-sm text-ink-muted">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading {label}&hellip;
          </p>
        )}
        {error && <p className="mt-3 font-sans text-sm text-danger">{error}</p>}
      </div>
    );
  }

  const range = publishedRange(summary, dwelling);
  const source = sourceLine(summary, dwelling);

  return (
    <div className="not-prose space-y-4">
      <div className="rounded-2xl border border-line bg-surface-warm p-6 sm:p-8 shadow-card">
        <div className="flex items-start justify-between gap-4 mb-3">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cta font-medium">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {summary.name}, {summary.state} {summary.postcode}
          </p>
          <button
            type="button"
            onClick={reset}
            className="font-sans text-xs text-ink-muted hover:text-ink underline underline-offset-4 cursor-pointer"
          >
            Change suburb
          </button>
        </div>
        <Heading className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-4">
          What homes like yours sell for in {summary.name}
        </Heading>

        <div role="group" aria-label="Dwelling type" className="inline-flex rounded-full border border-line bg-surface-raised p-0.5 mb-5">
          {DWELLINGS.map((d) => {
            const active = dwelling === d.id;
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={active}
                onClick={() => setDwelling(d.id)}
                className={`rounded-full px-4 py-1.5 font-sans text-xs font-medium transition-colors cursor-pointer ${
                  active ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {range ? (
          <>
            <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle mb-1">
              {medianCaption(summary, dwelling)}
            </p>
            <p className="font-display text-4xl sm:text-5xl text-ink leading-none tracking-tight">
              {formatPriceFull(range.median)}
            </p>
            <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle mt-5 mb-1">
              {rangeCaption()}
            </p>
            <p className="font-display text-2xl sm:text-3xl text-ink leading-none tracking-tight">
              {formatPriceFull(range.low)} to {formatPriceFull(range.high)}
            </p>
            <p className="font-sans text-sm text-ink-muted mt-4 leading-relaxed max-w-xl">
              {rangeLabel(summary, dwelling)}
            </p>
            {source && (
              <p className="font-sans text-xs text-ink-subtle mt-2 leading-relaxed max-w-xl">
                Source: {source}
              </p>
            )}
          </>
        ) : (
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-xl">
            {withheldNote(summary, dwelling)} Where we have an agent in the area, a local agent can still
            give you a figure from the comparable sales they know.
          </p>
        )}

        {after === "link" && (
          <Link
            href={appraisalHref}
            className="group mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-ink font-semibold px-5 py-3 font-sans text-sm transition-colors"
          >
            Get a free appraisal of your {dwelling}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        )}
      </div>

      {after === "form" && (
        <SuburbAppraisalCTA
          suburbName={summary.name}
          suburbSlug={summary.slug}
          source={leadSource(summary.slug)}
          formName={formName}
        />
      )}
    </div>
  );
}
