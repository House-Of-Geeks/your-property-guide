"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { HOW_WE_ARE_PAID_HREF, PARTNER_CHECKS, RESPONSE_WINDOW } from "@/lib/service-model";
import { Segmented } from "./Segmented";
import { useMove } from "./move-context";

// The way to an agent (v5, 14 Oct 2026): pick the kind of agent, name the
// suburb, and land on /get-help with both filled in. Nothing is sent from
// here; the permission and contact details are asked on that page.

type Service = "selling-agent" | "buyers-agent";
const SERVICES = [
  { id: "selling-agent", label: "Selling agent" },
  { id: "buyers-agent", label: "Buyer’s agent" },
] as const;

export function AgentFinder({ from = "home-finder" }: { from?: string }) {
  const router = useRouter();
  const ctx = useMove();
  const fromMove = (): Service => (ctx?.move === "buying" ? "buyers-agent" : "selling-agent");
  const [service, setService] = useState<Service>(fromMove);
  const [lastMove, setLastMove] = useState(ctx?.move);
  if (ctx && ctx.move !== lastMove) {
    setLastMove(ctx.move);
    setService(fromMove());
  }
  const [suburb, setSuburb] = useState<string | null>(null);

  const href = `/get-help?service=${service}${suburb ? `&suburb=${encodeURIComponent(suburb)}` : ""}&from=${from}`;
  return (
    <div className="tone-light rounded-2xl bg-white p-6 text-ink shadow-[0_30px_70px_-30px_rgb(0_0_0/0.6)] sm:p-8">
      <p className="text-2xl font-bold tracking-[-0.02em] text-ink">Find my agent</p>
      <Segmented label="Kind of agent" options={SERVICES} value={service} onChange={setService} className="mt-5" />
      <label htmlFor="finder-suburb" className="mt-6 block text-[15px] font-semibold text-ink">
        {service === "selling-agent" ? "Where’s the property?" : "Where are you buying?"}
      </label>
      <div className="mt-2">
        <SuburbAutocomplete
          id="finder-suburb"
          placeholder="Suburb or postcode"
          onSelectLocation={(slug) => setSuburb(slug)}
          onClear={() => setSuburb(null)}
        />
      </div>
      <button
        type="button"
        onClick={() => router.push(href)}
        className="press mt-5 inline-flex h-14 w-full items-center justify-between gap-4 rounded-lg bg-cta px-6 text-[17px] font-semibold text-white transition-colors hover:bg-cta-hover"
      >
        Continue <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        {`Free for you: the agent pays us a flat fee for the introduction, never a share of their commission. They contact you the way you choose, normally ${RESPONSE_WINDOW}. `}
        <Link href={HOW_WE_ARE_PAID_HREF} className="font-semibold text-ink underline underline-offset-4">How we’re paid</Link>
      </p>
    </div>
  );
}

/** The four checks, each opening to say how we check it. */
export function AgentChecks() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="border-t border-line">
      {PARTNER_CHECKS.map((c, i) => {
        const on = open === i;
        return (
          <li key={c.title} className="border-b border-line">
            <button
              type="button"
              aria-expanded={on}
              aria-controls={`check-${i}`}
              onClick={() => setOpen(on ? -1 : i)}
              className="flex w-full items-center gap-5 py-5 text-left"
            >
              <span className="w-6 text-lg font-bold text-ink-muted">{i + 1}</span>
              <span className="flex-1 text-xl font-bold tracking-[-0.015em] text-ink sm:text-2xl">{c.title}</span>
              {on ? <Minus className="h-5 w-5 text-ink" aria-hidden="true" /> : <Plus className="h-5 w-5 text-ink" aria-hidden="true" />}
            </button>
            <div
              id={`check-${i}`}
              aria-hidden={!on}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <p className="overflow-hidden pl-11 pr-8 text-base leading-relaxed text-ink-muted">
                <span className="block pb-5">{c.body}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
