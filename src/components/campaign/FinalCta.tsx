import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROMISE } from "@/lib/service-model";
import { SHELL } from "./shell";

// The closing line (v6). On cream, so it never stacks on the dark footer.

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="border-t border-line bg-cream py-20 sm:py-28">
      <div className={`${SHELL} text-center`}>
        <h2 id="final-cta-title" className="mx-auto max-w-4xl text-[38px] leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[72px]">
          {PROMISE.closing}
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/plan?from=home-final" className="press inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cta px-8 text-base font-semibold text-white transition-colors hover:bg-cta-hover sm:w-auto">
            Build my campaign plan <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/about" className="inline-flex h-14 w-full items-center justify-center rounded-full border border-ink px-8 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-inverse sm:w-auto">
            Read Andy’s story
          </Link>
        </div>
      </div>
    </section>
  );
}
