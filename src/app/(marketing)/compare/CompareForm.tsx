"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { BUTTON_PRIMARY } from "@/components/premium/buttons";

// Two side-by-side autocompletes that build /suburbs/{a}/vs/{b} on submit.
// Lives on /compare. The submit button is disabled until both suburbs are
// chosen so the user can't navigate to a broken URL.
export function CompareForm() {
  const router = useRouter();
  const [slugA, setSlugA] = useState<string>("");
  const [slugB, setSlugB] = useState<string>("");

  const ready = slugA && slugB && slugA !== slugB;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
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
            onSelectLocation={(slug) => setSlugA(slug)}
            onClear={() => setSlugA("")}
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
            onSelectLocation={(slug) => setSlugB(slug)}
            onClear={() => setSlugB("")}
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
    </form>
  );
}
