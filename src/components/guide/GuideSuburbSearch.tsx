"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";

interface GuideSuburbSearchProps {
  /** Optional override for the heading. Defaults to a generic prompt. */
  title?: string;
  /** Optional sub-line. */
  subtitle?: string;
}

/**
 * Inline suburb-search widget for embedding inside guide bodies. Lets users
 * jump straight from the article to a real suburb profile or the quiz / compare
 * tools. Resets prose styles via not-prose so inputs render correctly.
 */
export function GuideSuburbSearch({
  title = "Look up a suburb to research",
  subtitle = "Pull every figure on this page for any suburb in Australia.",
}: GuideSuburbSearchProps) {
  const router = useRouter();
  const [, setSlug] = useState<string>("");

  return (
    <div className="not-prose my-10 rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2 inline-flex items-center gap-2">
        <Search className="w-3.5 h-3.5" aria-hidden="true" />
        Suburb research
      </p>
      <h3 className="font-display text-2xl text-ink leading-tight mb-2">
        {title}
      </h3>
      <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5 max-w-2xl">
        {subtitle}
      </p>

      <div className="max-w-xl">
        <SuburbAutocomplete
          placeholder="Try Bondi, Newtown, or 4006"
          onSelectLocation={(s) => {
            setSlug(s);
            router.push(`/suburbs/${s}`);
          }}
          size="lg"
        />
      </div>

      <p className="mt-4 font-sans text-sm text-ink-muted">
        Or try our{" "}
        <Link
          href="/find-your-suburb"
          className="font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
        >
          4-question suburb finder quiz
          <ArrowRight className="w-3 h-3 inline ml-1" />
        </Link>{" "}
        if you don&rsquo;t know where to start.
      </p>
    </div>
  );
}
