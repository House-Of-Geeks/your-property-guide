"use client";

import { useId, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

// Form parts for the plan and introduction forms (Oct 2026). Accessible by
// construction: every field has a visible label, hints and errors are tied
// to it with aria-describedby, choices are native radios (arrow keys work)
// styled as cards, and consent boxes are real checkboxes with their full
// wording as the label.

export const INPUT_CLASS =
  "w-full rounded-lg border border-line-strong bg-white px-4 py-3 text-base text-ink placeholder:text-ink-subtle caret-cta outline-none transition-[border-color,box-shadow] focus:border-cta focus:ring-[3px] focus:ring-cta/20 aria-[invalid=true]:border-danger";

/** A stable key per form instance, sent with the submission so a double submit finds the first row. */
export function useRequestKey(): string {
  const [key] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `k${Date.now()}${Math.random().toString(36).slice(2)}`,
  );
  return key;
}

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-ink-muted leading-relaxed">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria-describedby for a Field's control. */
export const describedBy = (id: string, hint?: unknown, error?: unknown) =>
  [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

export interface ChoiceOption<T extends string> {
  id: T;
  label: string;
  sub?: string;
}

/**
 * A question answered by picking one card. Native radios, so Tab reaches the
 * group and the arrow keys move between options; `onPick` fires on change,
 * so a keyboard user moving through options sees the selection move.
 */
export function ChoiceGroup<T extends string>({
  legend,
  hint,
  options,
  value,
  onChange,
  columns = 1,
  error,
  name,
  size = "md",
  optional,
}: {
  legend: ReactNode;
  hint?: ReactNode;
  options: ReadonlyArray<ChoiceOption<T>>;
  value: T | null | undefined;
  onChange: (v: T) => void;
  columns?: 1 | 2 | 3 | 4;
  error?: string | null;
  name?: string;
  size?: "md" | "lg";
  /** Says "(optional)" after the question. */
  optional?: boolean;
}) {
  const auto = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const group = name ?? `choice-${auto}`;
  // Two-up from the smallest phone: these are short choices (types, timing,
  // budgets), and stacking them made the forms twice as long on a phone.
  const cols = columns === 4 ? "grid-cols-2 sm:grid-cols-4" : columns === 3 ? "grid-cols-3" : columns === 2 ? "grid-cols-2" : "";
  return (
    <fieldset aria-describedby={error ? `${group}-error` : hint ? `${group}-hint` : undefined}>
      <legend className={`${size === "lg" ? "text-xl sm:text-2xl" : "text-[17px] sm:text-lg"} font-bold text-ink leading-snug tracking-[-0.015em]`}>
        {legend}
        {optional && <span className="ml-1.5 text-[15px] font-normal tracking-normal text-ink-muted">(optional)</span>}
      </legend>
      {hint && (
        <p id={`${group}-hint`} className="mt-1 text-sm text-ink-muted leading-relaxed">
          {hint}
        </p>
      )}
      <div className={`mt-3 grid gap-2.5 ${cols}`}>
        {options.map((o) => {
          const checked = value === o.id;
          return (
            <label
              key={o.id}
              className={`relative flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                checked ? "border-ink bg-ink text-white" : "border-line-strong bg-white text-ink hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name={group}
                value={o.id}
                checked={checked}
                onChange={() => onChange(o.id)}
                aria-labelledby={`${group}-${o.id}-label`}
                aria-describedby={o.sub ? `${group}-${o.id}-sub` : undefined}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${checked ? "border-white bg-white text-ink" : "border-line-strong"}`}
              >
                {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              <span className="min-w-0">
                <span id={`${group}-${o.id}-label`} className="block text-[15px] font-semibold leading-snug">{o.label}</span>
                {o.sub && <span id={`${group}-${o.id}-sub`} className={`block text-sm leading-snug ${checked ? "text-white/80" : "text-ink-muted"}`}>{o.sub}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${group}-error`} className="mt-2 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** A consent or opt-in box: the full statement is the label. */
export function CheckField({
  id,
  checked,
  onChange,
  children,
  hint,
  error,
  strong = false,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  /** The permission box: a heavier frame so it can't be mistaken for small print. */
  strong?: boolean;
}) {
  return (
    <div className={strong ? `rounded-lg border p-4 ${error ? "border-danger" : "border-ink"}` : ""}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={describedBy(id, hint, error)}
          aria-invalid={error ? true : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-line-strong accent-[var(--cta)]"
        />
        <label htmlFor={id} className={`cursor-pointer text-[15px] leading-relaxed ${strong ? "font-semibold text-ink" : "text-ink"}`}>
          {children}
        </label>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 pl-8 text-sm text-ink-muted leading-relaxed">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 pl-8 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** The submit button with loading and done states (disabled while busy, so one click is one request). */
export function SubmitButton({ busy, done, children, doneLabel = "Sent" }: { busy: boolean; done?: boolean; children: ReactNode; doneLabel?: string }) {
  return (
    <button
      type="submit"
      disabled={busy || done}
      aria-disabled={busy || done}
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[4px] bg-cta hover:bg-cta-hover text-cta-ink px-7 py-3.5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70"
    >
      {done ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" /> {doneLabel}
        </>
      ) : busy ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
          Sending…
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Honeypot: off-screen, out of the tab order, hidden from assistive tech. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
