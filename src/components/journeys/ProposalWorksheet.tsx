"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Info, Plus, RotateCcw, Trash2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import {
  MAX_AGENTS,
  MIN_AGENTS,
  NEGOTIATORS,
  SALE_METHODS,
  STATE_CODES,
  STORAGE_KEY,
  aud,
  compareProposals,
  defaultExpectedPrice,
  emptyProposal,
  emptyWorksheet,
  restoreWorksheet,
  toFigures,
  validateExpectedPrice,
  validateProposal,
  type ProposalDraft,
  type ProposalResult,
  type WorksheetDraft,
} from "@/lib/proposal-worksheet";
import { Field, INPUT_CLASS, describedBy } from "./fields";
import { PrintButton } from "./PrintButton";

// The agent proposal worksheet (Oct 2026): two or three selling agents'
// proposals side by side, each costed in dollars at the same expected price.
// The maths and the flags live in src/lib/proposal-worksheet.ts (tested).
// Everything typed stays in this browser (localStorage); the only thing sent
// anywhere is one anonymous "tool_used" event on the first edit, with no figures.

const SMALL_BUTTON =
  "inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2.5 text-[15px] font-semibold text-ink hover:border-ink";

const RESULT_COLS: Record<number, string> = {
  1: "",
  2: "lg:grid-cols-2 print:grid-cols-2",
  3: "lg:grid-cols-3 print:grid-cols-3",
};
const INPUT_COLS: Record<number, string> = {
  1: "",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

const agentLabel = (i: number, name: string) => name.trim() || `Agent ${i + 1}`;

function TextField({
  id,
  label,
  hint,
  error,
  optional,
  value,
  onChange,
  inputMode = "decimal",
  autoComplete = "off",
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "decimal" | "numeric" | "text";
  autoComplete?: string;
}) {
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={INPUT_CLASS}
      />
    </Field>
  );
}

function SelectField<T extends string>({
  id,
  label,
  hint,
  value,
  onChange,
  options,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<{ id: T; label: string }>;
}) {
  return (
    <Field id={id} label={label} hint={hint}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} aria-describedby={describedBy(id, hint)} className={INPUT_CLASS}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

const YES_NO_OPTIONS = [
  { id: "" as const, label: "Not sure" },
  { id: "yes" as const, label: "Yes" },
  { id: "no" as const, label: "No" },
];

// The saved worksheet, read as an external store: the server snapshot (no
// storage) matches the server-rendered HTML, then the client snapshot reads
// localStorage on hydration. Nothing subscribes: the worksheet itself is the
// only writer, and it holds the live copy in state.
const SERVER_SNAPSHOT = "\u0000server";
const subscribeNever = () => () => {};
function readSaved(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private window, site data off): the worksheet still works, it just won't survive a reload.
    return null;
  }
}

export function ProposalWorksheet() {
  const saved = useSyncExternalStore(subscribeNever, readSaved, () => SERVER_SNAPSHOT);
  const ready = saved !== SERVER_SNAPSHOT;
  // Remounts once, from the server's empty worksheet to the restored one, before anyone can type.
  return <Worksheet key={ready ? "client" : "server"} initial={ready ? restoreWorksheet(saved) : null} ready={ready} />;
}

function Worksheet({ initial, ready }: { initial: WorksheetDraft | null; ready: boolean }) {
  const [draft, setDraft] = useState<WorksheetDraft>(() => initial ?? emptyWorksheet());
  const [restored, setRestored] = useState(initial !== null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [status, setStatus] = useState("");
  const tracked = useRef(false);
  const clearRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  // Where focus goes once a removed or cleared control has re-rendered.
  const focusNext = useRef<"add" | "clear" | null>(null);

  // Save on every change, once the saved copy has been read (never over it with the server's blank).
  useEffect(() => {
    if (!ready) return;
    try {
      if (JSON.stringify(draft) === JSON.stringify(emptyWorksheet())) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage blocked: nothing to do.
    }
  }, [draft, ready]);

  useEffect(() => {
    if (confirmClear) confirmRef.current?.focus();
  }, [confirmClear]);

  useEffect(() => {
    if (!focusNext.current) return;
    (focusNext.current === "add" ? addRef : clearRef).current?.focus();
    focusNext.current = null;
  });

  const touched = () => {
    if (tracked.current) return;
    tracked.current = true;
    track("tool_used", { tool: "agent-proposal-worksheet" });
  };

  const update = (patch: Partial<WorksheetDraft>) => {
    touched();
    setStatus("");
    setDraft((d) => ({ ...d, ...patch }));
  };

  const setAgent = (i: number, patch: Partial<ProposalDraft>) => {
    touched();
    setStatus("");
    setDraft((d) => ({ ...d, agents: d.agents.map((a, j) => (j === i ? { ...a, ...patch } : a)) }));
  };

  const addAgent = () => {
    touched();
    setDraft((d) => (d.agents.length >= MAX_AGENTS ? d : { ...d, agents: [...d.agents, emptyProposal()] }));
  };

  const removeAgent = (i: number) => {
    setDraft((d) => (d.agents.length <= MIN_AGENTS ? d : { ...d, agents: d.agents.filter((_, j) => j !== i) }));
    setStatus(`Agent ${i + 1} removed.`);
    // The add button comes back in place of the removed card's controls.
    focusNext.current = "add";
  };

  const clearAll = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing saved, or storage blocked.
    }
    setDraft(emptyWorksheet());
    setRestored(false);
    setConfirmClear(false);
    setStatus("Worksheet cleared.");
    focusNext.current = "clear";
  };

  const figures = useMemo(() => draft.agents.map(toFigures), [draft.agents]);
  const middle = useMemo(() => defaultExpectedPrice(figures), [figures]);
  const result = useMemo(() => compareProposals(draft), [draft]);
  const errors = useMemo(() => draft.agents.map(validateProposal), [draft.agents]);
  const priceError = draft.expectedPriceSet ? validateExpectedPrice(draft.expectedPrice) : null;
  const state = draft.state || null;
  const n = draft.agents.length;

  const priceValue = draft.expectedPriceSet ? draft.expectedPrice : middle !== null ? middle.toLocaleString("en-AU") : "";
  const priceHint =
    draft.expectedPriceSet && !result.priceFromEstimates
      ? "Your own figure. Every proposal is costed at this price."
      : middle !== null
        ? `Starts at ${aud(middle)}, the middle of the agents’ estimates. Change it to the price you think is realistic.`
        : "The price you think is realistic. Or add each agent’s estimate below and the worksheet starts from the middle of them.";

  // One sentence for screen readers, announced after typing pauses.
  const summary = useMemo(() => {
    if (result.price === null) return "Add a price estimate or your expected price to compare costs.";
    const costed = result.results.filter((r) => r.cost);
    if (costed.length === 0) return `At ${aud(result.price)}: add each agent’s commission to compare costs.`;
    return `At ${aud(result.price)}: ${costed
      .map((r) => `${agentLabel(r.index, draft.agents[r.index].name)} costs ${aud(r.cost!.totalCost)} and leaves you ${aud(r.cost!.keep)}`)
      .join("; ")}.`;
  }, [result, draft.agents]);
  const [liveText, setLiveText] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setLiveText(summary), 700);
    return () => clearTimeout(t);
  }, [summary]);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Inputs (hidden when printing)                                     */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="pw-inputs-title" className="print:hidden">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="pw-inputs-title" className="text-3xl sm:text-4xl leading-[1.1] tracking-[-0.025em] text-ink">
              Your sale
            </h2>
            <p className="mt-4 text-base text-ink-muted leading-relaxed">
              {`Everything you type stays in this browser. Nothing is sent to us, and agent names are only for your own reference. Use the figures in each agent’s written proposal or agency agreement.`}
            </p>
            {restored && (
              <p className="mt-4 rounded-lg border border-line bg-surface-warm px-4 py-3 text-[15px] text-ink" role="status">
                {`We’ve brought back the figures you entered last time in this browser.`}
              </p>
            )}
          </div>
          <div className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2 sm:max-w-sm">
              <TextField
                id="pw-price"
                label="Your expected sale price ($)"
                hint={priceHint}
                error={priceError}
                value={priceValue}
                onChange={(v) => update({ expectedPrice: v, expectedPriceSet: true })}
              />
              {draft.expectedPriceSet && middle !== null && (
                <button
                  type="button"
                  onClick={() => update({ expectedPrice: "", expectedPriceSet: false })}
                  className="mt-2 text-[15px] font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                >
                  Use the middle of the estimates ({aud(middle)})
                </button>
              )}
            </div>
            <div className="sm:col-span-2 sm:max-w-sm">
              <SelectField<StateCode | "">
                id="pw-state"
                label="Your state or territory"
                hint={
                  state
                    ? `Typical commission in ${STATE_NAMES[state]}: ${STATE_RATES[state].low}% to ${STATE_RATES[state].high}% plus GST. Every rate is negotiable.`
                    : "Shows the typical commission range, so the worksheet can point out a rate outside it."
                }
                value={draft.state}
                onChange={(v) => update({ state: v })}
                options={[{ id: "", label: "Choose your state" }, ...STATE_CODES.map((s) => ({ id: s, label: s }))]}
              />
            </div>
            <p className="sm:col-span-2 text-[15px]">
              <a href="#pw-results" className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
                Skip to the comparison
              </a>
            </p>
          </div>
        </div>

        <ul className={`mt-12 grid gap-6 ${INPUT_COLS[n]}`}>
          {draft.agents.map((a, i) => {
            const e = errors[i];
            const id = (k: string) => `pw-${i}-${k}`;
            return (
              <li key={i} className="rounded-xl border border-line bg-white p-5 sm:p-6">
                <fieldset className="min-w-0">
                  {/* The legend stays the fieldset's first child, so it names the group. */}
                  <legend className="text-xl font-bold text-ink">Agent {i + 1}</legend>
                  <div className="mt-5 grid gap-5">
                    <TextField
                      id={id("name")}
                      label="Agent or agency name"
                      optional
                      hint="Only kept in this browser."
                      inputMode="text"
                      value={a.name}
                      onChange={(v) => setAgent(i, { name: v.slice(0, 80) })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <TextField id={id("low")} label="Price estimate, low ($)" error={e.estimateLow} value={a.estimateLow} onChange={(v) => setAgent(i, { estimateLow: v })} />
                      <TextField id={id("high")} label="Price estimate, high ($)" error={e.estimateHigh} value={a.estimateHigh} onChange={(v) => setAgent(i, { estimateHigh: v })} />
                    </div>
                    <SelectField
                      id={id("basis")}
                      label="How is the commission quoted?"
                      value={a.commissionBasis}
                      onChange={(v) => setAgent(i, { commissionBasis: v })}
                      options={[
                        { id: "percent", label: "A percentage of the sale price" },
                        { id: "fixed", label: "A fixed fee in dollars" },
                      ]}
                    />
                    <div className="grid grid-cols-2 items-end gap-3">
                      <TextField
                        id={id("commission")}
                        label={a.commissionBasis === "percent" ? "Commission rate (%)" : "Commission fee ($)"}
                        error={e.commission}
                        value={a.commission}
                        onChange={(v) => setAgent(i, { commission: v })}
                      />
                      <SelectField
                        id={id("commission-gst")}
                        label="GST on the commission"
                        value={a.commissionGst}
                        onChange={(v) => setAgent(i, { commissionGst: v })}
                        options={[
                          { id: "plus", label: "Plus GST" },
                          { id: "included", label: "Includes GST" },
                        ]}
                      />
                    </div>
                    <TextField
                      id={id("marketing")}
                      label="Marketing cost ($)"
                      hint="The total marketing quote: listings, photos, signboard and any styling they include."
                      error={e.marketing}
                      value={a.marketing}
                      onChange={(v) => setAgent(i, { marketing: v })}
                    />
                    <div className="grid grid-cols-2 items-end gap-3">
                      <SelectField id={id("unsold")} label="Payable if it doesn’t sell?" value={a.marketingIfUnsold} onChange={(v) => setAgent(i, { marketingIfUnsold: v })} options={YES_NO_OPTIONS} />
                      <SelectField id={id("capped")} label="Fixed or capped?" value={a.marketingCapped} onChange={(v) => setAgent(i, { marketingCapped: v })} options={YES_NO_OPTIONS} />
                    </div>
                    <TextField
                      id={id("auctioneer")}
                      label="Auctioneer’s fee ($)"
                      optional
                      hint="Leave blank if there’s no auction, or it’s included."
                      error={e.auctioneer}
                      value={a.auctioneer}
                      onChange={(v) => setAgent(i, { auctioneer: v })}
                    />
                    <SelectField
                      id={id("fees-gst")}
                      label="GST on marketing and the auctioneer"
                      value={a.otherFeesGst}
                      onChange={(v) => setAgent(i, { otherFeesGst: v })}
                      options={[
                        { id: "included", label: "Includes GST" },
                        { id: "plus", label: "Plus GST" },
                      ]}
                    />
                    <SelectField
                      id={id("method")}
                      label="Method of sale"
                      value={a.method}
                      onChange={(v) => setAgent(i, { method: v })}
                      options={[{ id: "", label: "Choose one" }, ...SALE_METHODS]}
                    />
                    <div className="grid grid-cols-2 items-end gap-3">
                      <TextField id={id("term")} label="Agreement term (days)" inputMode="numeric" error={e.termDays} value={a.termDays} onChange={(v) => setAgent(i, { termDays: v })} />
                      <TextField id={id("notice")} label="Notice to end it (days)" inputMode="numeric" error={e.noticeDays} value={a.noticeDays} onChange={(v) => setAgent(i, { noticeDays: v })} />
                    </div>
                    <SelectField
                      id={id("comparables")}
                      label="Did they show recent comparable sales?"
                      value={a.comparables}
                      onChange={(v) => setAgent(i, { comparables: v })}
                      options={YES_NO_OPTIONS}
                    />
                    <SelectField
                      id={id("negotiator")}
                      label="Who will negotiate with buyers?"
                      value={a.negotiator}
                      onChange={(v) => setAgent(i, { negotiator: v })}
                      options={[{ id: "", label: "Choose one" }, ...NEGOTIATORS]}
                    />
                  </div>
                  {n > MIN_AGENTS && (
                    <button type="button" onClick={() => removeAgent(i)} className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink-muted underline underline-offset-4 hover:text-ink">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove agent {i + 1}
                    </button>
                  )}
                </fieldset>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {n < MAX_AGENTS && (
            <button ref={addRef} type="button" onClick={addAgent} className={SMALL_BUTTON}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Add a third agent
            </button>
          )}
          {confirmClear ? (
            <div role="group" aria-labelledby="pw-clear-q" className="flex flex-wrap items-center gap-3 rounded-lg border border-line-strong px-4 py-2.5">
              <span id="pw-clear-q" className="text-[15px] text-ink">
                Clear every figure from this worksheet?
              </span>
              <button ref={confirmRef} type="button" onClick={clearAll} className="text-[15px] font-semibold text-ink underline underline-offset-4">
                Yes, clear it
              </button>
              <button
                type="button"
                onClick={() => {
                  focusNext.current = "clear";
                  setConfirmClear(false);
                }}
                className="text-[15px] font-semibold text-ink-muted underline underline-offset-4"
              >
                Keep it
              </button>
            </div>
          ) : (
            <button ref={clearRef} type="button" onClick={() => setConfirmClear(true)} className={SMALL_BUTTON}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear the worksheet
            </button>
          )}
          <p className="sr-only" role="status">
            {status}
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The comparison (this is what prints)                              */}
      {/* ---------------------------------------------------------------- */}
      <section id="pw-results" aria-labelledby="pw-results-title" className="mt-16 scroll-mt-24 print:mt-0">
        <p className="hidden print:block text-sm text-ink-muted">Agent proposal worksheet, Your Property Guide</p>
        <h2 id="pw-results-title" className="text-3xl sm:text-4xl leading-[1.1] tracking-[-0.025em] text-ink print:text-2xl">
          How the proposals compare
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-ink-muted leading-relaxed print:text-base">
          {result.price === null
            ? "Add your expected sale price, or each agent’s price estimate, and their commission. Each proposal is then costed at the same price."
            : `Each proposal costed at ${aud(result.price)}${result.priceFromEstimates ? ", the middle of the agents’ estimates" : ", your expected price"}${state ? `, in ${STATE_NAMES[state]}` : ""}. Totals include GST.`}
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {liveText}
        </p>

        <ul className={`mt-8 grid gap-6 ${RESULT_COLS[n]}`}>
          {result.results.map((r) => (
            <ResultCard key={r.index} r={r} draft={draft.agents[r.index]} price={result.price} />
          ))}
        </ul>

        <div className="mt-8 grid gap-3 max-w-3xl text-[15px] text-ink-muted leading-relaxed">
          <p>
            {`Cost is one part of the decision. The evidence behind each price estimate, the method of sale and who negotiates for you matter too. What you’d keep is before your loan payout, conveyancing and your state’s sale documents.`}
          </p>
          <p>
            {`General information from the figures you entered, not financial or real estate advice. Check every figure against the agency agreement before you sign.`}
          </p>
        </div>

        <div className="mt-6 print:hidden">
          <PrintButton label="Print or save the comparison" />
        </div>
      </section>
    </div>
  );
}

function Row({ label, children, sub }: { label: ReactNode; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-ink-muted">
        {label}
        {sub && <span className="block text-sm">{sub}</span>}
      </dt>
      <dd className="text-right font-semibold text-ink">{children}</dd>
    </div>
  );
}

const yesNo = (v: string, yes: string, no: string, unsure = "Not answered") => (v === "yes" ? yes : v === "no" ? no : unsure);

function ResultCard({ r, draft: a, price }: { r: ProposalResult; draft: ProposalDraft; price: number | null }) {
  const f = toFigures(a);
  const c = r.cost;
  const estimate =
    f.estimateLow && f.estimateHigh
      ? `${aud(f.estimateLow)} to ${aud(f.estimateHigh)}`
      : f.estimateLow || f.estimateHigh
        ? aud((f.estimateLow || f.estimateHigh) as number)
        : "Not entered";
  const commission =
    f.commission === null
      ? "Not entered"
      : `${f.commissionBasis === "percent" ? `${f.commission}%` : aud(f.commission)} ${f.commissionGst === "plus" ? "plus GST" : "including GST"}`;
  const marketing =
    f.marketing === null
      ? "Not entered"
      : `${aud(f.marketing)}${a.otherFeesGst === "plus" ? " plus GST" : ""}${a.marketingIfUnsold === "yes" ? ", payable if unsold" : a.marketingIfUnsold === "no" ? ", only if it sells" : ""}${a.marketingCapped === "yes" ? ", fixed or capped" : a.marketingCapped === "no" ? ", not capped" : ""}`;
  const term =
    f.termDays === null && f.noticeDays === null
      ? "Not entered"
      : [f.termDays !== null ? `${f.termDays} days` : null, f.noticeDays !== null ? `${f.noticeDays} days’ notice to end` : null].filter(Boolean).join(", ");

  return (
    <li className="rounded-xl border border-line bg-white p-5 sm:p-6 break-inside-avoid print:p-4">
      <h3 className="text-xl text-ink">{agentLabel(r.index, a.name)}</h3>
      {c && price !== null ? (
        <>
          <p className="mt-3 text-4xl font-bold text-ink tracking-[-0.03em] print:text-2xl">{aud(c.totalCost)}</p>
          <p className="mt-1 text-sm text-ink-muted">
            Total cost at {aud(price)}, GST included ({c.totalCostPct}% of the price)
          </p>
          <dl className="mt-5 divide-y divide-line border-y border-line text-[15px]">
            <Row label="Commission" sub={`Including ${aud(c.commissionGst)} GST`}>
              {aud(c.commissionInclGst)}
            </Row>
            <Row label="Marketing">{aud(c.marketingInclGst)}</Row>
            <Row label="Auctioneer">{aud(c.auctioneerInclGst)}</Row>
            <Row label="What you’d keep" sub="Before your loan payout and conveyancing">
              {aud(c.keep)}
            </Row>
            {r.aboveLowest !== null && (r.isLowest || r.aboveLowest > 0) && (
              <Row label="Against the lowest cost">{r.isLowest ? "Lowest of these" : `${aud(r.aboveLowest)} more`}</Row>
            )}
          </dl>
        </>
      ) : (
        <p className="mt-3 text-base text-ink-muted">
          {price === null ? "Add a price estimate or your expected price to see the cost." : "Add their commission to see the cost."}
        </p>
      )}

      <h4 className="mt-6 text-base font-semibold text-ink">What they proposed</h4>
      <dl className="mt-1 divide-y divide-line text-[15px]">
        <Row label="Price estimate">{estimate}</Row>
        <Row label="Commission">{commission}</Row>
        <Row label="Marketing">{marketing}</Row>
        <Row label="Auctioneer">{f.auctioneer === null ? "Not entered" : `${aud(f.auctioneer)}${a.otherFeesGst === "plus" ? " plus GST" : ""}`}</Row>
        <Row label="Method of sale">{SALE_METHODS.find((m) => m.id === a.method)?.label ?? "Not entered"}</Row>
        <Row label="Agreement term">{term}</Row>
        <Row label="Comparable sales shown">{yesNo(a.comparables, "Yes", "No")}</Row>
        <Row label="Who negotiates">{NEGOTIATORS.find((x) => x.id === a.negotiator)?.label ?? "Not entered"}</Row>
      </dl>

      {r.flags.length > 0 && (
        <div className="mt-6 border-t-2 border-ink pt-4">
          <h4 className="text-base font-semibold text-ink">Worth asking about</h4>
          <ul className="mt-3 space-y-3">
            {r.flags.map((fl) => (
              <li key={fl.key} className="flex gap-2.5 text-[15px] text-ink leading-relaxed">
                <Info className="mt-1 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                <span>{fl.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
