"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { BUTTON_PRIMARY } from "@/components/premium/buttons";

interface CompareFormProps {
  /** Direction-independent keys ("a|b", slugs sorted) of the published pairs. */
  allowedPairKeys: string[];
}

// Two side-by-side autocompletes that build /suburbs/{a}/vs/{b} on submit.
// Lives on /compare. The submit button is disabled until both suburbs are
// chosen so the user can't navigate to a broken URL. Side-by-side pages are
// published for a bounded set of pairs (lib/compare-pairs.ts); any other pair
// shows the two suburb profiles instead of a link that would 404.
export function CompareForm({ allowedPairKeys }: CompareFormProps) {
  const router = useRouter();
  const [slugA, setSlugA] = useState<string>("");
  const [slugB, setSlugB] = useState<string>("");
  const [unpublished, setUnpublished] = useState<{ a: string; b: string } | null>(null);

  const ready = slugA && slugB && slugA !== slugB;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    if (!allowedPairKeys.includes([slugA, slugB].sort().join("|"))) {
      setUnpublished({ a: slugA, b: slugB });
      return;
    }
    setUnpublished(null);
    router.push(`/suburbs/${slugA}/vs/${slugB}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-3 items-stretch">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            First suburb
          </label>
          <SuburbAutocomplete
            placeholder="Try Bondi or 4006"
            onSelectLocation={(slug) => { setSlugA(slug); setUnpublished(null); }}
            onClear={() => { setSlugA(""); setUnpublished(null); }}
            size="lg"
          />
        </div>

        <div className="hidden md:flex items-end justify-center pb-3">
          <span className="text-ink-subtle text-2xl font-bold">vs</span>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Second suburb
          </label>
          <SuburbAutocomplete
            placeholder="Try Newtown or 3000"
            onSelectLocation={(slug) => { setSlugB(slug); setUnpublished(null); }}
            onClear={() => { setSlugB(""); setUnpublished(null); }}
            size="lg"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!ready}
        className={`${BUTTON_PRIMARY} justify-center disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        Compare side by side
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>

      {slugA && slugB && slugA === slugB && (
        <p className="text-sm text-danger">
          Choose two different suburbs to compare.
        </p>
      )}

      {unpublished && (
        <p className="text-sm text-ink-muted" role="status">
          We publish side-by-side pages for popular pairs only. Open each suburb
          profile instead:{" "}
          <Link href={`/suburbs/${unpublished.a}`} className="font-semibold text-ink underline underline-offset-4">
            first suburb
          </Link>{" "}
          and{" "}
          <Link href={`/suburbs/${unpublished.b}`} className="font-semibold text-ink underline underline-offset-4">
            second suburb
          </Link>
          .
        </p>
      )}
    </form>
  );
}
