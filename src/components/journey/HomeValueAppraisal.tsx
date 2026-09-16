"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { SuburbAppraisalCTA } from "@/components/suburb/SuburbAppraisalCTA";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { homeValueSource, type HomeValueSummary } from "@/lib/home-value";

/**
 * The action block at the top of the "How much is my house worth" guide.
 * Suburb first; once chosen, the suburb's own median (never an estimate of
 * the visitor's home) with its source line, then the same three-field
 * appraisal form the suburb pages use, attributed to this guide.
 */
export function HomeValueAppraisal() {
  const [summary, setSummary] = useState<HomeValueSummary | null>(null);
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
      setSummary((await res.json()) as HomeValueSummary);
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
  };

  if (!summary) {
    return (
      <div className="not-prose rounded-2xl border border-cta/30 bg-surface-warm p-6 sm:p-8 shadow-card">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-3">
          Free property appraisal · Start with your suburb
        </p>
        <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
          Where&rsquo;s the house?
        </h2>
        <p className="text-sm text-ink-muted mb-5 max-w-lg">
          We&rsquo;ll show you what houses in that suburb are selling for, then a local agent who sells there gives you a figure for yours. Free, no commitment to list.
        </p>
        <SuburbAutocomplete
          placeholder="Suburb or postcode, e.g. Hawthorn or 3122"
          onSelectLocation={pick}
          onClear={reset}
        />
        {loading && (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-muted">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading {label}&hellip;
          </p>
        )}
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="not-prose space-y-4">
      <div className="rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cta font-medium">
            <MapPin className="w-3.5 h-3.5" /> {summary.name}, {summary.state} {summary.postcode}
          </p>
          <button type="button" onClick={reset} className="text-xs text-ink-muted hover:text-ink underline underline-offset-4">
            Change suburb
          </button>
        </div>
        {summary.reliable && summary.medianHousePrice ? (
          <>
            <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1">Median house price in {summary.name}</p>
            <p className="font-display text-4xl sm:text-5xl text-ink leading-none tracking-tight">
              {formatPriceFull(summary.medianHousePrice)}
            </p>
            <p className="font-sans text-sm text-ink-muted mt-3 leading-relaxed">
              {summary.annualGrowthHouse !== null && (
                <>
                  <span className={`font-medium ${summary.annualGrowthHouse >= 0 ? "text-success" : "text-danger"}`}>
                    {formatPercentage(summary.annualGrowthHouse)}
                  </span>{" "}
                  over the past year.{" "}
                </>
              )}
              {summary.medianUnitPrice !== null && <>Median unit price {formatPriceFull(summary.medianUnitPrice)}. </>}
              {summary.provenance}
            </p>
            <p className="font-sans text-sm text-ink mt-3 leading-relaxed max-w-xl">
              That&rsquo;s the suburb, not your house. Yours will sit above or below it depending on land size, condition, position and what comparable homes nearby sold for recently. An agent who sells in {summary.name} can put a real figure on it.
            </p>
          </>
        ) : (
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-xl">
            We don&rsquo;t publish a median for {summary.name} yet: too few recorded sales to be reliable. An agent who sells in {summary.name} will still give you a figure from the comparable sales they know.
          </p>
        )}
      </div>
      <SuburbAppraisalCTA
        suburbName={summary.name}
        suburbSlug={summary.slug}
        source={homeValueSource(summary.slug)}
        formName="home-value-guide"
      />
    </div>
  );
}
