"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowRight, Check, ChevronDown, MapPin } from "lucide-react";
import { PROMISE } from "@/lib/service-model";
import { FOUNDER } from "@/lib/founder";
import { pickSuburb, suburbQuery, suburbTerms, type SuburbSearchHit } from "@/lib/address";
import { track } from "@/lib/analytics";
import { PLAN_CTA, PLAN_NAME, PLAN_TERMS } from "@/lib/plans/name";
import { planStartHref } from "@/lib/plans/start";
import type { PlanPreview } from "@/lib/plans/preview";
import type { SuggestResponse } from "@/types/suggest";
import { Segmented } from "@/components/interactive/Segmented";
import { DEFAULT_MOVE, journeyForMove, useMove, type Move } from "@/components/interactive/move-context";
import { HOME_MOVES, MOVE_ORDER } from "./moves";
import { CAMPAIGN_PHOTOS } from "./photos";
import { SHELL } from "./shell";

// The homepage's first screen (19 Oct 2026, after the v6 campaign hero). The
// campaign line stays, and straight under it the page says what you get:
// free guidance, a next-step plan built from a few answers, and an
// introduction to one agent only if you ask. The plan card puts the choice
// first (selling, buying or both), then the place, then the button, with
// what it costs and asks beside it and a preview of the plan underneath, cut
// from a real plan for that move. The choice also re-points the rest of the
// page (MoveProvider): the calculator, the tools and the header's button.
// Only the suburb or postcode is looked up; a street address never leaves
// the browser.
//
// 20 Oct 2026: the suburb resolved here is shared (MoveProvider place), so
// the phone bar and the header start the plan with it too, through the same
// planStartHref. On phones the opening is tighter so the button shows on
// the first screen (390 × 844, keyboard closed): the move's message moves
// under the button, the helper text is one line, and the sample plan shows
// its three steps with the tools and checklist behind "Show more".

const MOVE_OPTIONS = MOVE_ORDER.map((id) => ({ id, label: HOME_MOVES[id].label }));

export function CampaignHero({ previews }: { previews: Record<Move, PlanPreview> }) {
  const photo = CAMPAIGN_PHOTOS.hero;
  return (
    <section aria-labelledby="campaign-hero-title" className="tone-dark relative isolate overflow-hidden bg-eucalyptus-deep">
      <Image src={photo.src} alt="" fill preload sizes="100vw" className={`-z-20 object-cover ${photo.position}`} />
      {/* Dark on the text side, opening to the photo behind the plan card.
          On phones the text runs full width, so the wash is even. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_46_34/0.8)_0%,rgb(10_46_34/0.86)_55%,rgb(10_46_34/0.94)_100%)] lg:bg-[linear-gradient(90deg,rgb(10_46_34/0.95)_0%,rgb(10_46_34/0.84)_45%,rgb(10_46_34/0.45)_75%,rgb(10_46_34/0.3)_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-44 bg-[linear-gradient(180deg,rgb(10_46_34/0.7)_0%,rgb(10_46_34/0)_100%)]" />

      <div className={`${SHELL} grid gap-x-12 gap-y-6 pb-10 pt-[76px] sm:gap-y-10 sm:pb-20 sm:pt-32 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:pb-20 lg:pt-32 xl:gap-x-16`}>
        <div className="lg:col-span-7 lg:pt-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-primary sm:text-[13px] sm:tracking-[0.22em]">{PROMISE.eyebrow}</p>
          <h1 id="campaign-hero-title" className="mt-3 max-w-[42rem] text-[32px] leading-[1.04] sm:mt-4 tracking-[-0.02em] text-ink sm:text-[56px] lg:text-[68px]">
            {PROMISE.lead} <em className="font-normal italic text-primary">{PROMISE.accent}</em>
          </h1>
          <p className="mt-3 max-w-[36rem] text-base leading-normal text-ink sm:mt-6 sm:text-xl sm:leading-relaxed">{PROMISE.offer}</p>
          {/* On phones the plan card's preview shows the same, so the card comes up sooner. */}
          <ul className="mt-6 hidden max-w-[36rem] gap-2.5 text-base text-ink-muted sm:grid">
            {PROMISE.receive.map((r) => (
              <li key={r} className="flex gap-2.5">
                <Check className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
          <PlanCard previews={previews} />
        </div>

        {/* Andy, in one line: the founder band further down tells the story. */}
        <div className="flex max-w-[36rem] items-center gap-4 border-t border-line pt-6 lg:col-span-7 lg:self-start">
          <Image src={FOUNDER.photo} alt="" width={52} height={52} className="h-[52px] w-[52px] shrink-0 rounded-full object-cover object-top ring-2 ring-line-strong" />
          <p className="text-[15px] leading-snug text-ink-muted">
            <span className="font-semibold text-ink">{`${FOUNDER.name}, founder.`}</span>{" "}
            {PROMISE.founderLine}{" "}
            <Link href="/about" className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Andy’s story
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/** The plan card: the move, the place, the button and its terms, then the preview. */
function PlanCard({ previews }: { previews: Record<Move, PlanPreview> }) {
  const router = useRouter();
  const ctx = useMove();
  const [localMove, setLocalMove] = useState<Move>(DEFAULT_MOVE);
  const move = ctx?.move ?? localMove;
  const setMove = (m: Move) => {
    if (m === move) return;
    (ctx?.setMove ?? setLocalMove)(m);
    track("journey_selected", { journey: journeyForMove(m), placement: "home-hero" });
  };
  const m = HOME_MOVES[move];
  const preview = previews[move];

  const uid = useId();
  const inputId = `${uid}-place`;
  const listId = `${uid}-suburbs`;
  const termsId = `${uid}-terms`;
  const [text, setText] = useState("");
  const [hits, setHits] = useState<SuburbSearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [picked, setPicked] = useState<SuburbSearchHit | null>(null);
  const [going, setGoing] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

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

  // The suburb this field resolves to: the one picked, or the one the typed
  // words match. Shared with the phone bar and the header, so their plan
  // buttons carry it exactly as this button does.
  const resolved = picked ?? pickSuburb(suburbTerms(text), hits);
  const setPlace = ctx?.setPlace;
  const resolvedSlug = resolved?.slug ?? null;
  const resolvedState = resolved?.state ?? null;
  useEffect(() => {
    setPlace?.(resolvedSlug && resolvedState ? { slug: resolvedSlug, state: resolvedState } : null);
  }, [setPlace, resolvedSlug, resolvedState]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (going) return;
    setGoing(true);
    const journey = journeyForMove(move);
    track("plan_started", { placement: "home-hero", journey, state: resolved?.state ?? null });
    router.push(planStartHref({ journey, place: resolved, from: "home-hero" }));
  };

  return (
    <div className="tone-light overflow-hidden rounded-3xl bg-white text-ink shadow-[0_40px_80px_-40px_rgb(0_0_0/0.7)]">
      <form onSubmit={submit} className="flex flex-col p-4 sm:p-7" aria-label={`Build your ${PLAN_NAME}`}>
        <p className="font-display text-[22px] leading-tight tracking-[-0.01em] text-ink sm:text-[28px]">{`Your free ${PLAN_NAME}`}</p>

        <p className="mt-3 text-[15px] font-semibold text-ink sm:mt-5" aria-hidden="true">
          What are you planning?
        </p>
        <Segmented label="What are you planning?" options={MOVE_OPTIONS} value={move} onChange={setMove} className="mt-2" />
        {/* Under the button on phones, so the choice, the place and the
            button sit together on the first screen. */}
        <p className="order-last mt-3 text-[15px] leading-relaxed text-ink-muted sm:order-none sm:min-h-[3rem]" aria-live="polite">
          {m.message}
        </p>

        <label htmlFor={inputId} className="mt-3 block text-[15px] font-semibold text-ink sm:mt-4">
          {m.fieldLabel} <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <div ref={boxRef} className="relative mt-2">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
          <input
            id={inputId}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            aria-describedby={`${uid}-place-hint`}
            autoComplete="off"
            enterKeyHint="go"
            value={text}
            onChange={(e) => onText(e.target.value)}
            onFocus={() => hits.length > 0 && !picked && setOpen(true)}
            onKeyDown={onKey}
            placeholder={m.placeholder}
            className="h-12 w-full rounded-xl border border-line-strong sm:h-[52px] bg-white pl-11 pr-4 text-[16px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-subtle focus:border-cta focus:ring-[3px] focus:ring-cta/20"
          />
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
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[15px] text-ink ${i === active ? "bg-surface-warm" : ""}`}
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
        <p id={`${uid}-place-hint`} className="mt-1.5 text-[13px] leading-snug text-ink-muted">
          Only the suburb or postcode is looked up.
        </p>

        <button
          type="submit"
          disabled={going}
          aria-describedby={termsId}
          className="press mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-cta px-6 text-[17px] sm:mt-5 sm:h-14 font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-70"
        >
          {going ? "Opening your questions…" : PLAN_CTA} <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <ul id={termsId} className="mt-2.5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px] font-medium text-ink-muted sm:mt-3 sm:gap-x-4 sm:text-[14px]" aria-label="About the plan">
          {PLAN_TERMS.map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </form>

      <PreviewPanel preview={preview} note={m.sampleNote} place={resolved ? `${resolved.name}, ${resolved.state}` : null} />
    </div>
  );
}

/** What the plan holds: the next three steps, the tools and the checklist, from a real plan for the move. */
function PreviewPanel({ preview, note, place }: { preview: PlanPreview; note: string; place: string | null }) {
  // Phones see the three steps; the tools and the checklist open on demand.
  // From sm up everything shows, as before.
  const [more, setMore] = useState(false);
  const moreId = useId();
  return (
    <section aria-label="Preview of your plan" className="border-t border-line bg-surface-warm px-4 pb-4 pt-4 sm:px-7 sm:pb-6 sm:pt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="shrink-0 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.16em] text-primary">What you’ll get</h2>
        <p className="truncate text-[13px] text-ink-muted">{place ? `For ${place}` : `Sample: ${preview.focus}`}</p>
      </div>

      <h3 className="mt-4 text-[14px] font-semibold text-ink">Your next three steps</h3>
      <ol className="mt-2 space-y-1.5">
        {preview.steps.map((s, i) => (
          <li key={s.title} className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
            <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-eucalyptus text-[11px] font-bold text-white" aria-hidden="true">
              {i + 1}
            </span>
            {s.title}
          </li>
        ))}
      </ol>

      <button
        type="button"
        aria-expanded={more}
        aria-controls={moreId}
        onClick={() => setMore((v) => !v)}
        className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-ink underline decoration-line-strong underline-offset-4 sm:hidden"
      >
        {more ? "Show less" : "Show the tools and checklist"}
        <ChevronDown className={`h-4 w-4 transition-transform motion-reduce:transition-none ${more ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div id={moreId} className={`${more ? "grid" : "hidden"} mt-2 gap-4 sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-5`}>
        <div>
          <h3 className="text-[14px] font-semibold text-ink">Tools for your numbers</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {preview.tools.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="inline-flex rounded-full border border-line-strong bg-white px-3 py-1 text-[13px] font-semibold text-ink hover:border-ink">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-ink">{preview.checklist.title}</h3>
          <ul className="mt-2 space-y-1.5">
            {preview.checklist.items.map((it) => (
              <li key={it} className="flex gap-2 text-[13px] leading-snug text-ink-muted">
                <span className="mt-0.5 inline-block h-3.5 w-3.5 shrink-0 rounded-[3px] border border-line-strong bg-white" aria-hidden="true" />
                {it}
              </li>
            ))}
            {preview.checklist.more > 0 && <li className="pl-[1.375rem] text-[13px] text-ink-muted">{`+ ${preview.checklist.more} more`}</li>}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-[12px] leading-snug text-ink-muted sm:mt-4">{note}</p>
    </section>
  );
}
