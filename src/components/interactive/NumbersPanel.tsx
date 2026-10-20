"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STATE_RATES } from "@/lib/data/commission-rates";
import { computeSellingCosts, defaultSellingCostsInput } from "@/lib/selling-costs-calc";
import { calculateStampDuty, STAMP_DUTY_VERIFIED_ON, type AustralianState } from "@/lib/utils/stamp-duty";
import { APRA_SERVICEABILITY_BUFFER, DEFAULT_ASSESSMENT_RATE, REFERENCE_LOAN_RATE, computeBorrowingPower } from "@/lib/utils/borrowing-power";
import { monthlyRepayment } from "@/lib/utils/repayment";
import { track } from "@/lib/analytics";
import { Chips } from "./Segmented";
import { useMove, type Move } from "./move-context";
import { aud, useTween } from "./useTween";

// Run your numbers (v5, 14 Oct 2026): the three questions people ask first,
// answered live as they drag. The same arithmetic as the full calculators
// (selling-costs-calc, stamp-duty, borrowing-power), so a figure here never
// disagrees with the tool it links to. Nothing typed here leaves the page;
// the only analytics is one anonymous "tool_used" on the first change.

export type NumbersTool = "sell" | "duty" | "borrow";

const TOOL_LABEL: Record<NumbersTool, string> = { sell: "Cost to sell", duty: "Stamp duty", borrow: "Borrowing" };
const STATES: { id: AustralianState; label: string }[] = (["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const).map((s) => ({ id: s, label: s }));
const BUYERS = [
  { id: "first", label: "First home" },
  { id: "next", label: "Next home" },
  { id: "invest", label: "Investment" },
] as const;
type Buyer = (typeof BUYERS)[number]["id"];
const KIDS = [
  { id: "0", label: "None" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3+" },
] as const;
type Kids = (typeof KIDS)[number]["id"];

const toolFor = (m: Move): NumbersTool => (m === "buying" ? "duty" : "sell");
const verified = new Date(`${STAMP_DUTY_VERIFIED_ON}T00:00:00Z`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

interface NumbersPanelProps {
  tools?: readonly NumbersTool[];
  /** The first tool, when no MoveProvider decides it. */
  initial?: NumbersTool;
  initialState?: AustralianState;
  /** Where the agent links say they came from (?from=). */
  from: string;
}

export function NumbersPanel({ tools = ["sell", "duty", "borrow"], initial, initialState = "QLD", from }: NumbersPanelProps) {
  const ctx = useMove();
  const [picked, setPicked] = useState<NumbersTool | null>(null);
  const [lastMove, setLastMove] = useState(ctx?.move);
  // A new move in the hero hands the choice back to the move.
  if (ctx && ctx.move !== lastMove) {
    setLastMove(ctx.move);
    setPicked(null);
  }
  const wanted = picked ?? (ctx ? toolFor(ctx.move) : initial ?? tools[0]);
  const tool = tools.includes(wanted) ? wanted : tools[0];

  const [state, setState] = useState<AustralianState>(initialState);
  const used = useRef(false);
  const touch = () => {
    if (used.current) return;
    used.current = true;
    track("tool_used", { tool: `numbers-${tool}`, placement: from });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-30px_rgb(22_25_29/0.35)]">
      {tools.length > 1 && (
        <div role="tablist" aria-label="Choose a calculator" className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-3 sm:px-5">
          {tools.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={t === tool}
              onClick={() => setPicked(t)}
              className={`relative shrink-0 rounded-t-lg px-4 pb-3.5 pt-2.5 text-[15px] font-semibold transition-colors sm:px-5 sm:text-base ${t === tool ? "text-ink" : "text-ink-muted hover:text-ink"}`}
            >
              {TOOL_LABEL[t]}
              <span aria-hidden="true" className={`absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-cta transition-opacity ${t === tool ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
      )}
      <div role={tools.length > 1 ? "tabpanel" : undefined} aria-label={TOOL_LABEL[tool]} onPointerDown={touch} onKeyDown={touch}>
        {tool === "sell" && <SellTool state={state} setState={setState} from={from} />}
        {tool === "duty" && <DutyTool state={state} setState={setState} from={from} />}
        {tool === "borrow" && <BorrowTool from={from} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Layout({ inputs, result }: { inputs: ReactNode; result: ReactNode }) {
  return (
    <div className="grid lg:grid-cols-[1fr_1.05fr]">
      <div className="space-y-7 p-5 sm:p-8">{inputs}</div>
      <div className="tone-dark flex flex-col bg-surface-inverse p-5 sm:p-8">{result}</div>
    </div>
  );
}

function Field({ label, value, children }: { label: string; value?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[15px] font-semibold text-ink">{label}</span>
        {value != null && <span className="text-xl font-bold tracking-[-0.02em] text-ink">{value}</span>}
      </div>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; format: (n: number) => string }) {
  const fill = `${((value - min) / (max - min)) * 100}%`;
  return (
    <input
      type="range"
      className="ypg-range"
      aria-label={label}
      aria-valuetext={format(value)}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ "--fill": fill } as CSSProperties}
    />
  );
}

function Big({ label, value, sub }: { label: string; value: number | null; sub?: ReactNode }) {
  const shown = useTween(value ?? 0);
  return (
    <div>
      <p className="text-[15px] font-semibold text-ink-muted">{label}</p>
      <p className="mt-1 text-[44px] font-bold leading-none tracking-[-0.04em] text-ink sm:text-[60px]" aria-live="polite">
        {value == null ? "Not enough" : aud(Math.round(shown / 100) * 100)}
      </p>
      {sub && <p className="mt-3 text-base text-ink-muted">{sub}</p>}
    </div>
  );
}

function Actions({ primary, secondary }: { primary: { label: string; href: string }; secondary: { label: string; href: string } }) {
  return (
    <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center sm:gap-6">
      <Link href={primary.href} className="press inline-flex h-12 items-center justify-between gap-4 rounded-lg bg-cta px-5 text-base font-semibold text-cta-ink transition-colors hover:bg-cta-hover sm:justify-center">
        {primary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link href={secondary.href} className="inline-flex items-center gap-1.5 text-base font-semibold text-ink underline-offset-4 hover:underline">
        {secondary.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------

const METHODS = [
  { id: "private", label: "Private sale" },
  { id: "auction", label: "Auction" },
] as const;

function Tweened({ value }: { value: number }) {
  const shown = useTween(value);
  return <>{aud(Math.round(shown / 100) * 100)}</>;
}

const SHADES = ["bg-white", "bg-white/70", "bg-white/45", "bg-white/30", "bg-white/20", "bg-white/12"];

function SellTool({ state, setState, from }: { state: AustralianState; setState: (s: AustralianState) => void; from: string }) {
  const [price, setPrice] = useState(850_000);
  const [rate, setRate] = useState(STATE_RATES[state].typical);
  const [loan, setLoan] = useState(350_000);
  const [method, setMethod] = useState<"private" | "auction">("private");
  const pickState = (s: AustralianState) => {
    setState(s);
    setRate(STATE_RATES[s].typical);
  };
  const r = computeSellingCosts({ ...defaultSellingCostsInput(state, price), commissionRate: rate, loanBalance: Math.min(loan, price), auction: method === "auction" });
  const range = STATE_RATES[state];
  const per01 = Math.round(price * 0.001 * 1.1);
  return (
    <Layout
      inputs={
        <>
          <Field label="Where’s the property?">
            <Chips label="State" options={STATES} value={state} onChange={pickState} />
          </Field>
          <Field label="Sale price" value={aud(price)}>
            <Slider label="Sale price" value={price} min={300_000} max={3_000_000} step={10_000} onChange={setPrice} format={aud} />
          </Field>
          <Field label="Agent’s commission" value={`${rate.toFixed(2).replace(/0$/, "")}%`}>
            <Slider label="Agent’s commission" value={rate} min={1} max={4} step={0.05} onChange={setRate} format={(n) => `${n.toFixed(2)}%`} />
            <p className="mt-1.5 text-sm text-ink-muted">{`Typical in ${state}: ${range.low}% to ${range.high}%, plus GST. It’s negotiable.`}</p>
          </Field>
          <Field label="Mortgage to pay out" value={loan === 0 ? "None" : aud(Math.min(loan, price))}>
            <Slider label="Mortgage to pay out" value={loan} min={0} max={2_000_000} step={10_000} onChange={setLoan} format={(n) => (n === 0 ? "None" : aud(n))} />
          </Field>
          <Field label="How will you sell?">
            <Chips label="Method of sale" options={METHODS} value={method} onChange={setMethod} />
          </Field>
        </>
      }
      result={
        <>
          <Big label="Your selling costs" value={r.totalCosts} sub={`About ${r.costPct}% of the price, with GST on the commission`} />
          <div className="mt-7 flex h-3 overflow-hidden rounded-sm" aria-hidden="true">
            {r.lines.map((l, i) => (
              <span key={l.key} className={`${SHADES[i] ?? "bg-white/10"} transition-[flex-grow] duration-500 ease-out motion-reduce:transition-none [&:not(:last-child)]:mr-0.5`} style={{ flexGrow: Math.max(l.amount, 1) }} />
            ))}
          </div>
          <dl className="mt-5 grid gap-2">
            {r.lines.map((l, i) => (
              <div key={l.key} className="flex items-center justify-between gap-4 text-[15px]">
                <dt className="flex items-center gap-2.5 text-ink-muted">
                  <span className={`h-2.5 w-2.5 rounded-[2px] ${SHADES[i] ?? "bg-white/10"}`} aria-hidden="true" />
                  {l.label}
                </dt>
                <dd className="font-semibold text-ink">{aud(l.amount)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="text-[15px] text-ink-muted">You walk away with about</p>
              <p className="mt-1 text-3xl font-bold tracking-[-0.03em] text-ink"><Tweened value={r.netAfterLoan} /></p>
            </div>
            <p className="text-sm text-ink-muted sm:max-w-[15rem] sm:text-right">{`Every 0.1% of commission is ${aud(per01)} on this sale.`}</p>
          </div>
          <Actions
            primary={{ label: "Get a free appraisal", href: `/get-help?service=selling-agent&state=${state}&from=${from}` }}
            secondary={{ label: "Full breakdown", href: "/selling-costs-calculator" }}
          />
        </>
      }
    />
  );
}

function DutyTool({ state, setState, from }: { state: AustralianState; setState: (s: AustralianState) => void; from: string }) {
  const [price, setPrice] = useState(750_000);
  const [buyer, setBuyer] = useState<Buyer>("first");
  const r = calculateStampDuty(price, state, buyer === "first", false, buyer === "invest");
  const rule = buyer === "first" ? r.firstHomeRule : undefined;
  return (
    <Layout
      inputs={
        <>
          <Field label="Where are you buying?">
            <Chips label="State" options={STATES} value={state} onChange={setState} />
          </Field>
          <Field label="Price" value={aud(price)}>
            <Slider label="Price" value={price} min={200_000} max={2_500_000} step={5_000} onChange={setPrice} format={aud} />
          </Field>
          <Field label="What are you buying?">
            <Chips label="Buyer" options={BUYERS} value={buyer} onChange={setBuyer} />
          </Field>
        </>
      }
      result={
        <>
          <Big
            label="Stamp duty"
            value={r.total}
            sub={r.concessionAmount > 0 ? `After ${aud(r.concessionAmount)} of first home relief` : `${r.effectiveRate.toFixed(1)}% of the price`}
          />
          {rule && (
            <p key={rule.summary} className="swap-in mt-6 border-t border-line pt-5 text-base leading-relaxed text-ink">
              {rule.summary}
            </p>
          )}
          {buyer === "invest" && (
            <p className="mt-6 border-t border-line pt-5 text-base leading-relaxed text-ink">
              Investors pay the standard rate. A buyer’s agent can tell you what similar homes really sold for before you offer.
            </p>
          )}
          {buyer === "next" && r.ownerOccupierConcession > 0 && (
            <p className="mt-6 border-t border-line pt-5 text-base leading-relaxed text-ink">
              {`Living in it saves ${aud(r.ownerOccupierConcession)} on the investor rate.`}
            </p>
          )}
          <p className="mt-4 text-sm text-ink-muted">{`Rates checked against each revenue office, ${verified}. Excludes foreign buyer surcharges and transfer fees.`}</p>
          <Actions
            primary={{ label: "Talk to a buyer’s agent", href: `/get-help?service=buyers-agent&state=${state}&from=${from}` }}
            secondary={{ label: "Full calculator", href: "/stamp-duty-calculator" }}
          />
        </>
      }
    />
  );
}

function BorrowTool({ from }: { from: string }) {
  const [income, setIncome] = useState(110_000);
  const [partner, setPartner] = useState(0);
  const [kids, setKids] = useState<Kids>("0");
  const r = computeBorrowingPower(income, partner, 0, Number(kids), 0, DEFAULT_ASSESSMENT_RATE, 30);
  const monthly = r ? monthlyRepayment(r.maxLoan, REFERENCE_LOAN_RATE, 30) : 0;
  return (
    <Layout
      inputs={
        <>
          <Field label="Your income before tax" value={aud(income)}>
            <Slider label="Your income before tax" value={income} min={30_000} max={400_000} step={5_000} onChange={setIncome} format={aud} />
          </Field>
          <Field label="Partner’s income" value={partner === 0 ? "None" : aud(partner)}>
            <Slider label="Partner’s income" value={partner} min={0} max={400_000} step={5_000} onChange={setPartner} format={(n) => (n === 0 ? "None" : aud(n))} />
          </Field>
          <Field label="Children">
            <Chips label="Children" options={KIDS} value={kids} onChange={setKids} />
          </Field>
        </>
      }
      result={
        <>
          <Big
            label="You might borrow about"
            value={r ? r.maxLoan : null}
            sub={`Tested at ${DEFAULT_ASSESSMENT_RATE}%: a ${REFERENCE_LOAN_RATE}% rate plus the ${APRA_SERVICEABILITY_BUFFER}% buffer lenders add`}
          />
          {r ? (
            <dl className="mt-6 grid gap-2 border-t border-line pt-5 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">{`Repayments at ${REFERENCE_LOAN_RATE}% over 30 years`}</dt>
                <dd className="font-semibold text-ink">{`${aud(monthly)} a month`}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">With a 20% deposit, a price of about</dt>
                <dd className="font-semibold text-ink">{aud(r.estimatedPurchasePrice)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-6 border-t border-line pt-5 text-base text-ink">On these figures, living costs use up the income a lender counts.</p>
          )}
          <p className="mt-4 text-sm text-ink-muted">An estimate with typical living costs and no other debts. A lender looks at your whole situation.</p>
          <Actions
            primary={{ label: "Get the free buying guide", href: `/buying-guide?from=${from}` }}
            secondary={{ label: "Full calculator", href: "/borrowing-power-calculator" }}
          />
        </>
      }
    />
  );
}
