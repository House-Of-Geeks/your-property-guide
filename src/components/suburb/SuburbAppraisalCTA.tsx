"use client";

import { Suspense } from "react";
import { Home } from "lucide-react";
import { IntroductionForm } from "@/components/journeys/IntroductionForm";

interface Props {
  suburbName: string;
  suburbSlug: string;
  /** Attribution string recorded with the request. Defaults to the suburb-page source. */
  source?: string;
  /** Kept for callers; the form records its own analytics (src/lib/analytics.ts). */
  formName?: string;
}

/**
 * The appraisal ask on suburb pages, calculators and the home value guide.
 * Since 14 Oct 2026 it is the introduction form itself (src/components/
 * journeys/IntroductionForm), pre-set to a selling agent and this suburb: it
 * says who the seller would meet and what it costs them, shows coverage
 * before anything is sent, asks how they'd like to be contacted, and takes
 * an explicit permission tick. The old three-field form had no permission
 * box and promised a team call that the pipeline didn't make.
 */
export function SuburbAppraisalCTA({ suburbName, suburbSlug, source }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-line">
      <div className="bg-ink px-6 sm:px-8 py-6 sm:py-7 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 text-white grid place-items-center">
            <Home className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <p className="text-[13px] text-white/78 font-medium">Free appraisal in {suburbName}</p>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight tracking-tight mb-2">
          What&rsquo;s your home worth in {suburbName}?
        </h3>
        <p className="text-sm text-white/75 leading-relaxed max-w-md">
          Ask us to introduce one participating agent who sells in your area for
          an appraisal backed by recent comparable sales. Only with your
          permission, and no commitment to list.
        </p>
      </div>
      <div className="bg-surface-raised p-2 sm:p-3">
        <Suspense fallback={<div className="h-80" aria-busy="true" />}>
          <IntroductionForm
            defaultService="selling-agent"
            defaultSuburb={suburbSlug}
            source={source ?? `suburb-page-${suburbSlug}-appraisal`}
            compact
          />
        </Suspense>
      </div>
    </div>
  );
}
