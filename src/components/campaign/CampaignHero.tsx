"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { PROMISE } from "@/lib/service-model";
import { pickSuburb, suburbQuery, suburbTerms, type SuburbSearchHit } from "@/lib/address";
import { track } from "@/lib/analytics";
import type { SuggestResponse } from "@/types/suggest";
import { CAMPAIGN_PHOTOS } from "./photos";
import { SHELL } from "./shell";

// The homepage's first screen (v6, 15 Oct 2026): a full-bleed photo under a
// eucalyptus gradient, the core line, Andy's lead, and one field. Type an
// address or a suburb, pick selling, buying or both, and "Build my campaign
// plan" opens the next-step planner with the move, the state and the suburb
// filled in. Only the suburb or postcode is looked up; a street address never
// leaves the browser. The stat bar sits on the photo's foot.

type Move = "selling" | "buying" | "both";

const MOVES: { id: Move; label: string; journey: "selling" | "buying" | "buying-and-selling"; placeholder: string }[] = [
  { id: "selling", label: "I’m selling", journey: "selling", placeholder: "Enter your address or suburb" },
  { id: "buying", label: "I’m buying", journey: "buying", placeholder: "Where are you buying? Suburb or postcode" },
  { id: "both", label: "Both", journey: "buying-and-selling", placeholder: "Enter your address or suburb" },
];

export interface HeroStat {
  value: string;
  label: string;
}

export function CampaignHero({ stats }: { stats: readonly HeroStat[] }) {
  const photo = CAMPAIGN_PHOTOS.hero;
  return (
    <section aria-labelledby="campaign-hero-title" className="tone-dark relative isolate overflow-hidden bg-eucalyptus-deep">
      <Image
        src={photo.src}
        alt=""
        fill
        preload
        sizes="100vw"
        className={`-z-20 object-cover ${photo.position}`}
      />
      {/* Dark on the text side, opening to the photo on the right. On phones
          the text runs full width, so the wash is heavier and runs top to
          bottom. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_46_34/0.78)_0%,rgb(10_46_34/0.84)_55%,rgb(10_46_34/0.94)_100%)] lg:bg-[linear-gradient(90deg,rgb(10_46_34/0.94)_0%,rgb(10_46_34/0.82)_38%,rgb(10_46_34/0.35)_68%,rgb(10_46_34/0.12)_100%)]"
      />
      {/* A fade under the clear header, so its links read on a bright sky. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-44 bg-[linear-gradient(180deg,rgb(10_46_34/0.7)_0%,rgb(10_46_34/0)_100%)]" />

      <div className={`${SHELL} pb-14 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40`}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-[13px]">{PROMISE.eyebrow}</p>
        <h1 id="campaign-hero-title" className="mt-5 max-w-[46rem] text-[44px] leading-[1.02] tracking-[-0.02em] text-ink sm:text-[64px] lg:text-[84px]">
          {PROMISE.lead} <em className="font-normal italic text-primary">{PROMISE.accent}</em>
        </h1>
        <p className="mt-6 max-w-[40rem] text-[17px] leading-relaxed text-ink-muted sm:text-xl">{PROMISE.support}</p>
        <CampaignPlanForm />
      </div>

      <div className="border-t border-line bg-eucalyptus-deep/80 backdrop-blur-sm">
        <dl className={`${SHELL} grid grid-cols-2 lg:grid-cols-4`}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse justify-end gap-1.5 py-6 sm:py-8 ${i % 2 === 1 ? "border-l border-line pl-5 sm:pl-8" : "pr-4"} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <dt className="max-w-[15rem] text-sm leading-snug text-ink-muted">{s.label}</dt>
              <dd className="font-display text-[34px] leading-none tracking-[-0.01em] text-primary sm:text-[42px]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** The address-or-suburb field, the move tabs and the plan button. */
function CampaignPlanForm() {
  const router = useRouter();
  const uid = useId();
  const inputId = `${uid}-place`;
  const listId = `${uid}-suburbs`;
  const [move, setMove] = useState<Move>("selling");
  const [text, setText] = useState("");
  const [hits, setHits] = useState<SuburbSearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [picked, setPicked] = useState<SuburbSearchHit | null>(null);
  const [going, setGoing] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const m = MOVES.find((x) => x.id === move)!;

  // Suggest suburbs for what's typed: only the suburb name or the postcode is
  // sent, never the street.
  useEffect(() => {
    if (picked) return;
    const q = suburbQuery(suburbTerms(text));
    if (!q || q.length < 2) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) return;
        const data: SuggestResponse = await res.json();
        setHits(data.locations);
        setOpen(data.locations.length > 0);
        setActive(-1);
      } catch {
        // A failed lookup just means no suggestions; the plan still opens.
      }
    }, 200);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [text, picked]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const onText = (v: string) => {
    setText(v);
    setPicked(null);
    const q = suburbQuery(suburbTerms(v));
    if (!q || q.length < 2) {
      setHits([]);
      setOpen(false);
    }
  };

  const choose = (h: SuburbSearchHit) => {
    setPicked(h);
    setText(`${h.name}, ${h.state} ${h.postcode}`);
    setOpen(false);
    setActive(-1);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || hits.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(hits[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + MOVES.length) % MOVES.length;
    setMove(MOVES[next].id);
    tabRefs.current[next]?.focus();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (going) return;
    setGoing(true);
    const suburb = picked ?? pickSuburb(suburbTerms(text), hits);
    const qs = new URLSearchParams({ j: m.journey });
    if (suburb) {
      qs.set("s", suburb.state.toLowerCase());
      qs.set("sub", suburb.slug);
    }
    qs.set("from", "home-hero");
    track("plan_started", { placement: "home-hero", journey: m.journey, state: suburb?.state ?? null });
    router.push(`/plan?${qs.toString()}`);
  };

  return (
    <form onSubmit={submit} className="mt-9 max-w-[40rem]" role="search" aria-label="Build my campaign plan">
      <div
        ref={boxRef}
        className="tone-light relative flex flex-col gap-2 rounded-[28px] bg-white p-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.55)] transition-shadow focus-within:shadow-[0_0_0_4px_rgb(233_176_124/0.45)] sm:flex-row sm:items-center sm:rounded-full"
      >
        <label htmlFor={inputId} className="sr-only">
          Your address or suburb
        </label>
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="go"
          value={text}
          onChange={(e) => onText(e.target.value)}
          onFocus={() => hits.length > 0 && !picked && setOpen(true)}
          onKeyDown={onKey}
          placeholder={m.placeholder}
          className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-[17px] text-ink outline-none placeholder:text-ink-subtle sm:h-14"
        />
        <button
          type="submit"
          disabled={going}
          className="press inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-cta px-6 text-base font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-70 sm:h-14 sm:px-7"
        >
          Build my campaign plan <ArrowRight className="h-[18px] w-[18px] sm:hidden" aria-hidden="true" />
        </button>

        <ul
          id={listId}
          role="listbox"
          aria-label="Suburbs"
          hidden={!open}
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-[0_24px_48px_-24px_rgb(20_32_27/0.45)]"
        >
          {hits.map((h, i) => (
            <li
              key={h.slug}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(h);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 px-5 py-2.5 text-[15px] text-ink ${i === active ? "bg-surface-warm" : ""}`}
            >
              <MapPin className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
              <span>
                <span className="font-semibold">{h.name}</span>
                <span className="text-ink-muted">{`, ${h.state} ${h.postcode}`}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div role="radiogroup" aria-label="What are you planning?" className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {MOVES.map((x, i) => {
          const on = x.id === move;
          return (
            <button
              key={x.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setMove(x.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`border-b-2 pb-1 text-[15px] font-semibold transition-colors ${on ? "border-primary text-ink" : "border-transparent text-ink-muted hover:text-ink"}`}
            >
              {x.label}
            </button>
          );
        })}
      </div>
    </form>
  );
}
