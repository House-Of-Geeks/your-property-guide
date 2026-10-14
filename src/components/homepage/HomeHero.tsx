"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOW_WE_ARE_PAID_HREF, PROMISE } from "@/lib/service-model";
import { Book3D } from "@/components/interactive/Book3D";
import { Segmented } from "@/components/interactive/Segmented";
import { useMove, type Move } from "@/components/interactive/move-context";
import { SHELL } from "./shell";

// The homepage's first screen (v5, 14 Oct 2026): the promise, the two
// guides as books on a crisp photo, and one switch. Picking a move swaps the
// photo, brings that move's guide to the front and sets the two next steps
// (learn free, then an agent). The rest of the page follows the same switch.

const MOVES: Record<Move, {
  label: string;
  line: string;
  photo: string;
  position: string;
  learn: { label: string; href: string };
  agent: { label: string; href: string };
}> = {
  selling: {
    label: "I’m selling",
    line: "Know your costs and your price, then meet a proven agent for your suburb.",
    photo: "/images/photos/verandah-couple.jpg",
    position: "object-[60%_50%]",
    learn: { label: "Get the free selling guide", href: "/selling-guide?from=home" },
    agent: { label: "Find a selling agent", href: "/get-help?service=selling-agent&from=home" },
  },
  buying: {
    label: "I’m buying",
    line: "Know your budget and what you qualify for, then get someone on your side.",
    photo: "/images/photos/open-home.jpg",
    position: "object-center",
    learn: { label: "Get the free buying guide", href: "/buying-guide?from=home" },
    agent: { label: "Talk to a buyer’s agent", href: "/get-help?service=buyers-agent&from=home" },
  },
  both: {
    label: "Both",
    line: "Get the order and the money right, then line up help for each side.",
    photo: "/images/photos/home-street.jpg",
    position: "object-[50%_55%]",
    learn: { label: "Make a moving plan", href: "/plan?j=buying-and-selling" },
    agent: { label: "Get help with both", href: "/get-help?service=both&from=home" },
  },
};
const ORDER: Move[] = ["selling", "buying", "both"];
const OPTIONS = ORDER.map((id) => ({ id, label: MOVES[id].label }));

export function HomeHero() {
  const ctx = useMove();
  const move = ctx?.move ?? "selling";
  const m = MOVES[move];
  const front = (guide: "selling" | "buying") =>
    move === "both" || move === guide
      ? "z-20 -translate-y-2 scale-100"
      : "z-10 translate-y-3 scale-[0.9]";

  return (
    <section className="relative overflow-x-clip bg-white">
      <div className={`${SHELL} grid items-center gap-x-14 gap-y-14 pb-16 pt-9 sm:pt-12 lg:grid-cols-12 lg:pb-24 lg:pt-16`}>
        <div className="lg:col-span-6">
          <h1 className="text-[46px] font-bold leading-[0.98] tracking-[-0.045em] text-ink sm:text-[68px] lg:text-[84px]">
            {PROMISE.headline}
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-muted sm:text-xl">{PROMISE.support}</p>

          <Segmented label="What are you planning?" options={OPTIONS} value={move} onChange={(v) => ctx?.setMove(v)} size="lg" className="mt-9 max-w-[30rem]" />
          <p key={move} className="swap-in mt-5 max-w-[30rem] text-[17px] leading-relaxed text-ink" aria-live="polite">{m.line}</p>
          <div className="mt-6 grid gap-3 sm:flex">
            <Link href={m.learn.href} className="press inline-flex h-14 items-center justify-between gap-6 rounded-lg bg-cta px-6 text-[17px] font-semibold text-white transition-colors hover:bg-cta-hover sm:justify-center">
              {m.learn.label} <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link href={m.agent.href} className="press inline-flex h-14 items-center justify-between gap-6 rounded-lg border border-ink px-6 text-[17px] font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-inverse sm:justify-center">
              {m.agent.label} <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            Free to read and use. Agents pay us only when we introduce them.{" "}
            <Link href={HOW_WE_ARE_PAID_HREF} className="font-semibold text-ink underline underline-offset-4">How we’re paid</Link>
          </p>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative ml-[8%] aspect-[4/3] overflow-hidden rounded-2xl bg-surface-warm sm:ml-[14%] lg:aspect-[5/6]">
            {ORDER.map((k) => (
              <Image
                key={k}
                src={MOVES[k].photo}
                alt=""
                fill
                preload={k === "selling"}
                sizes="(min-width: 1024px) 44vw, 92vw"
                className={`object-cover ${MOVES[k].position} transition-opacity duration-700 ease-out motion-reduce:transition-none ${k === move ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
          {/* The two guides, standing on the photo's corner. Each opens its guide. */}
          <div className="absolute -bottom-8 left-0 flex items-end sm:-bottom-10">
            <Link href="/selling-guide?from=home-book" aria-label="The free selling guide" className={`relative block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${front("selling")}`}>
              <Book3D guide="selling" turn={16} className="[--bw:clamp(112px,30vw,170px)] lg:[--bw:clamp(150px,13.5vw,204px)]" />
            </Link>
            <Link href="/buying-guide?from=home-book" aria-label="The free buying guide" className={`relative -ml-3 block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:-ml-4 ${front("buying")}`}>
              <Book3D guide="buying" turn={16} className="[--bw:clamp(112px,30vw,170px)] lg:[--bw:clamp(150px,13.5vw,204px)]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
