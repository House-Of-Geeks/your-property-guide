import Link from "next/link";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/components/premium";

// Buyer / seller funnel entry band for geography pages (states, regions),
// mirroring the postcode-page guide pair. When the page has a natural lead
// suburb, `suburbSlug` deep-links both guides so visitors land in the lead
// engine with the suburb step pre-filled; without one (a whole state is too
// broad) the guides open with that step unanswered.
interface GuidePairCTAProps {
  placeName: string;
  suburbSlug?: string;
}

export function GuidePairCTA({ placeName, suburbSlug }: GuidePairCTAProps) {
  return (
    <section className="tone-light rounded-xl border border-line bg-surface-raised p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl leading-tight tracking-[-0.02em] text-ink mb-3">
        Buying or selling in {placeName}?
      </h2>
      <p className="text-base text-ink-muted leading-relaxed mb-6 max-w-2xl">
        Free guides covering what it really costs, how agents work, and a
        12-week plan to settlement, personalised to your suburb.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={suburbSlug ? `/selling-guide?suburb=${suburbSlug}` : "/selling-guide"}
          className={`w-fit ${BUTTON_PRIMARY}`}
        >
          Get the free selling guide
        </Link>
        <Link
          href={suburbSlug ? `/buying-guide?suburb=${suburbSlug}` : "/buying-guide"}
          className={`w-fit ${BUTTON_SECONDARY}`}
        >
          Get the free buying guide
        </Link>
      </div>
    </section>
  );
}
