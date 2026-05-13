import { Sparkles } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

interface GuideNewsletterCalloutProps {
  /** Heading override, defaults to a stage-agnostic prompt */
  title?: string;
  /** Optional sub-line */
  subtitle?: string;
}

/**
 * Inline newsletter capture for embedding inside guide bodies. Editorial
 * framing on a warm-cream card with the inline newsletter form.
 *
 * Resets prose styles via not-prose so the form inputs don't pick up
 * article typography.
 */
export function GuideNewsletterCallout({
  title = "Get the next quarterly read in your inbox",
  subtitle = "Capital city outlooks, RBA changes, and the data updates worth knowing about. One email a quarter, no more.",
}: GuideNewsletterCalloutProps) {
  return (
    <div className="not-prose my-10 rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2 inline-flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        The quarterly read
      </p>
      <h3 className="font-display text-2xl text-ink leading-tight mb-2">
        {title}
      </h3>
      <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5 max-w-2xl">
        {subtitle}
      </p>
      <NewsletterForm variant="inline" />
    </div>
  );
}
