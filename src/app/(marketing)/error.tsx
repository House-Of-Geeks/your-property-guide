"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { BUTTON_PRIMARY, TEXT_LINK } from "@/components/premium/buttons";

// The marketing pages' error state (20 Oct 2026, "Clear decisions"). It sits
// inside the layout, so the header, footer and phone bar stay; the message
// is calm and offers a retry and a way on. Nothing about the error itself is
// shown to the reader; the digest goes to the console for our logs.

export default function MarketingError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="border-b border-line bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-primary">Something went wrong</p>
        <h1 className="mt-5 max-w-3xl text-[40px] leading-[1.06] tracking-[-0.045em] text-ink sm:text-[56px]">This page didn’t load properly.</h1>
        <p className="mt-6 max-w-2xl text-[18px] leading-[1.7] text-ink-muted">
          It’s our problem, not yours. Try again, or carry on from the guides. If you were sending a form, check your email for a confirmation before you send it again.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="button" onClick={() => unstable_retry()} className={BUTTON_PRIMARY}>
            Try again
          </button>
          <Link href="/guides" className={TEXT_LINK}>
            Browse the guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
