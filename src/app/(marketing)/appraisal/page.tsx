import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { AppraisalForm } from "@/components/forms/AppraisalForm";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

// Form lives in the hero's right column (above the fold on desktop, second
// position on mobile after the headline) so visitors arrive on a page that
// renders the conversion action immediately. Previous layout buried the
// form below a 7xl headline + illustration which capped completion rates.

export const metadata: Metadata = {
  title: "Free Property Appraisal",
  description: "Request a free property appraisal from a vetted local real estate agent. No obligation, response within one business day.",
  alternates: { canonical: `${SITE_URL}/appraisal` },
  openGraph: { url: `${SITE_URL}/appraisal`, title: "Free Property Appraisal", description: "Request a free property appraisal from a vetted local real estate agent.", type: "website" },
  twitter: { card: "summary_large_image" },
};

const TRUST_POINTS = [
  "Vetted local agent, not a call centre",
  "Honest comparable-sales evidence",
  "Response within one business day",
];

export default function AppraisalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Free Appraisal", url: "/appraisal" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Free Appraisal" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                  Free, no obligation
                </span>
                <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                  Property appraisal
                </span>
              </div>
              <h1 className="font-display text-ink leading-[1.02] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 font-medium">
                What is your home{" "}
                <span className="italic font-light text-primary">actually worth</span>?
              </h1>
              <p className="font-display font-light text-lg sm:text-xl text-ink leading-[1.3] max-w-xl mb-8">
                An honest appraisal from a vetted local agent. No call centre,
                no auto-routing, no commitment to list with them.
              </p>

              <div className="flex flex-col gap-3 font-sans text-sm text-ink-muted">
                {TRUST_POINTS.map((p) => (
                  <span key={p} className="inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cta shrink-0" aria-hidden="true" />
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-line bg-surface-raised shadow-card p-6 sm:p-8">
                <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-2">
                  Tell us about the property
                </p>
                <h2 className="font-display text-ink leading-tight tracking-tight text-xl sm:text-2xl mb-5">
                  Two minutes, then we take it from there.
                </h2>
                <Suspense fallback={<div className="h-96" aria-busy="true" />}>
                  <AppraisalForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust note */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">
            How matching works
          </p>
          <p className="font-sans text-base text-ink-muted leading-relaxed">
            Every appraisal request is read and matched personally by our team.
            We pick one local agent who actually sells in your area, no call
            centre, no auto-routing, no comparison spam. You&rsquo;ll hear from
            them within one business day.
          </p>
          <p className="mt-5 font-sans text-sm text-ink-muted">
            Not ready for an appraisal yet? Start with the{" "}
            <a href="/selling-guide" className="text-ink underline decoration-line-strong underline-offset-2 hover:text-primary transition-colors">
              free guide to selling your property
            </a>
            , personalised to your suburb.
          </p>
        </div>
      </section>
    </>
  );
}
