import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";

export const metadata: Metadata = {
  title: "Appraisal request received",
  description: "Your free property appraisal request is in. A local agent will be in touch within one business day.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ suburb?: string }>;
}

export default async function AppraisalThanksPage({ searchParams }: PageProps) {
  const { suburb } = await searchParams;
  const suburbLabel = suburb ? suburb.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : null;

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="appraisal" />
      </Suspense>

      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-cta text-white grid place-items-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
            Request received
          </p>
          <h1 className="font-display text-ink leading-[1.02] tracking-tight text-4xl sm:text-5xl mb-6 font-medium">
            Your appraisal is on the way.
          </h1>
          <p className="font-sans text-lg sm:text-xl text-ink-muted leading-relaxed max-w-xl mx-auto">
            We&rsquo;ve received your request{suburbLabel ? ` for ${suburbLabel}` : ""}.
            Look for a confirmation in your inbox in the next few minutes, and a call
            or email from a local agent within one business day.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-4">
            What happens next
          </p>
          <ol className="space-y-5 mb-12">
            <li className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-surface-warm text-ink font-medium grid place-items-center text-sm">1</span>
              <div>
                <p className="font-medium text-ink">A local agent reads your details.</p>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                  Someone who actively sells in your area, with current comparable sales evidence.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-surface-warm text-ink font-medium grid place-items-center text-sm">2</span>
              <div>
                <p className="font-medium text-ink">They reach out within one business day.</p>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                  By phone or email, your choice. They&rsquo;ll talk you through what your home is realistically worth and the comparable sales backing the number.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-surface-warm text-ink font-medium grid place-items-center text-sm">3</span>
              <div>
                <p className="font-medium text-ink">You decide what to do next.</p>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                  No pressure to list with them. The appraisal is yours to keep, whether you sell now, later, or not at all.
                </p>
              </div>
            </li>
          </ol>

          <div className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8 text-center">
            <p className="font-sans text-base text-ink mb-4">
              While you wait, browse what&rsquo;s on the market in your area.
            </p>
            <Link
              href={suburb ? `/suburbs/${suburb}` : "/suburbs"}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-raised text-ink hover:border-ink font-medium px-5 py-2.5 transition-colors text-sm"
            >
              {suburbLabel ? `See ${suburbLabel} listings` : "Explore suburbs"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
