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
    <div className="not-prose my-10 rounded-xl border border-line p-5 sm:p-7">
      <p className="text-sm font-semibold text-ink-muted mb-1">
        The quarterly read
      </p>
      <h3 className="text-xl sm:text-2xl font-bold text-ink leading-tight tracking-[-0.01em] mb-2">
        {title}
      </h3>
      <p className="text-[15px] text-ink-muted leading-relaxed mb-5 max-w-2xl">
        {subtitle}
      </p>
      <NewsletterForm variant="inline" />
    </div>
  );
}
