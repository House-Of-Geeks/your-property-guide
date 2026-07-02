import Link from "next/link";

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
    <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-2">
        Buying or selling in {placeName}?
      </h2>
      <p className="text-sm text-gray-500 mb-4 max-w-2xl">
        Free guides covering what it really costs, how agents work, and a
        12-week plan to settlement, personalised to your suburb.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={suburbSlug ? `/selling-guide?suburb=${suburbSlug}` : "/selling-guide"}
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-primary/90 transition-colors w-fit"
        >
          Get the free selling guide
        </Link>
        <Link
          href={suburbSlug ? `/buying-guide?suburb=${suburbSlug}` : "/buying-guide"}
          className="inline-flex items-center gap-2 bg-white border border-primary text-primary text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-primary/5 transition-colors w-fit"
        >
          Get the free buying guide
        </Link>
      </div>
    </section>
  );
}
