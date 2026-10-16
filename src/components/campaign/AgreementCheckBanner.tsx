import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import { AGREEMENT_CHECK } from "@/lib/service-model";
import { SHELL } from "./shell";

// The agreement check banner (v6): before someone signs an agency agreement,
// a free 15-minute call with our team. Book it on /agreement-check, or ring.

export function AgreementCheckBanner() {
  return (
    <section aria-labelledby="agreement-check-title" className="bg-cream py-16 sm:py-20">
      <div className={SHELL}>
        <div className="tone-dark grid gap-10 overflow-hidden rounded-3xl bg-eucalyptus p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14">
          <div className="lg:col-span-7">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-primary">Free agreement check</p>
            <h2 id="agreement-check-title" className="mt-4 text-[32px] leading-[1.08] tracking-[-0.015em] text-ink sm:text-[44px]">
              {AGREEMENT_CHECK.headline}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">{AGREEMENT_CHECK.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {AGREEMENT_CHECK.covers.map((c) => (
                <li key={c} className="rounded-full border border-line-strong px-4 py-2 text-[15px] font-semibold text-ink">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-3">
              <Link href={`${AGREEMENT_CHECK.href}?from=home-banner`} className="press inline-flex h-14 items-center justify-center gap-2 rounded-full bg-cta px-7 text-base font-semibold text-white transition-colors hover:bg-cta-hover">
                Book my agreement check <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href={`tel:${CONTACT_PHONE_E164}`} className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-ink px-7 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-inverse">
                <Phone className="h-4 w-4" aria-hidden="true" /> Call {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{AGREEMENT_CHECK.notAdvice}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
