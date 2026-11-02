import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuideCover } from "@/components/brand/GuideCover";
import { guideFunnelHref } from "@/lib/guide-funnel";

interface Props {
  suburbName: string;
  suburbSlug: string;
  /** Recorded with the lead as ?from= (Lead.attribution.entry). */
  from?: string;
}

/**
 * The selling-guide offer at the end of a suburb profile: the page's one
 * guide block, after the reader has the prices, the schools and the
 * answers. Deep-links /selling-guide with the suburb pre-answered, so the
 * funnel starts on its second question, and names the sending page. The
 * buying guide is a plain link under it (buyers are the smaller, lower-value
 * group on this template, and two equal cards split the click).
 * Server component, zero JS.
 */
export function SuburbSellingGuideCTA({ suburbName, suburbSlug, from = "suburb-profile" }: Props) {
  return (
    <div className="rounded-xl border border-line bg-surface-warm overflow-hidden">
      <div className="flex items-center gap-6 sm:gap-10 p-6 sm:p-10">
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink leading-tight tracking-[-0.02em]">
            {`Selling in ${suburbName}? Get the free selling guide`}
          </h2>
          <p className="mt-3 font-sans text-[15px] sm:text-base text-ink-muted leading-relaxed max-w-xl">
            What selling costs, how agents price homes, what to ask them and a
            12-week plan to settlement, personalised to {suburbName}. A free
            PDF, in about a minute.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-4">
            <Link
              href={guideFunnelHref("selling", { suburb: suburbSlug, from })}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-cta-ink px-5 py-3 font-semibold transition-colors"
            >
              Get the free selling guide
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href={guideFunnelHref("buying", { suburb: suburbSlug, from })}
              className="text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              Buying instead? Get the buying guide
            </Link>
          </div>
        </div>
        <div className="hidden sm:block w-28 lg:w-36 shrink-0 text-[13px] lg:text-[15px]" aria-hidden="true">
          <GuideCover guide="selling" />
        </div>
      </div>
    </div>
  );
}
