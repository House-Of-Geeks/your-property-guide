"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { matchSuburb, parsePlaceAddress, type ParsedAddress, type SuburbSearchHit } from "@/lib/address";

/**
 * Australian street-address autocomplete for the appraisal forms, on Google
 * Places API (New) called straight from the browser with the site's public
 * Maps key (HTTP-referrer restricted). One session token per typing session
 * so Google bills autocomplete + details as a single session.
 *
 * On selection the parsed address (street line, suburb, state, postcode) and,
 * where we hold the suburb, its slug are handed to the form. If the key is
 * missing or a request fails the field degrades to a plain text input; the
 * form never depends on Google to submit.
 */
const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export interface AddressSelection {
  parsed: ParsedAddress;
  /** Our suburb row, when the address's suburb is one we hold. */
  suburb: SuburbSearchHit | null;
}

interface Props {
  id: string;
  label?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
  onSelect: (selection: AddressSelection) => void;
  error?: string | null;
  required?: boolean;
  inputClassName?: string;
  labelClassName?: string;
}

interface Suggestion {
  placeId: string;
  text: string;
}

const newToken = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

export function AddressAutocomplete({
  id, label, placeholder = "Start typing the street address", value, onChange, onSelect, error, required,
  inputClassName = "w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none transition-[border-color,box-shadow] duration-200 focus:border-cta focus:ring-[3px] focus:ring-cta/15",
  labelClassName = "block text-xs font-medium text-ink-muted mb-1",
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [busy, setBusy] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const session = useRef<string>(newToken());
  const selectedRef = useRef<string>("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = value.trim();
    if (!KEY || q.length < 4 || q === selectedRef.current) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY },
          body: JSON.stringify({
            input: q,
            includedRegionCodes: ["au"],
            includedPrimaryTypes: ["street_address", "subpremise", "premise"],
            sessionToken: session.current,
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { suggestions?: { placePrediction?: { placeId: string; text?: { text: string } } }[] };
        const next = (data.suggestions ?? [])
          .map((s) => s.placePrediction)
          .filter((p): p is { placeId: string; text?: { text: string } } => Boolean(p?.placeId))
          .map((p) => ({ placeId: p.placeId, text: p.text?.text ?? "" }))
          .filter((p) => p.text);
        setSuggestions(next);
        setOpen(next.length > 0);
        setActiveIdx(-1);
      } catch {
        // Places unavailable: stay a plain text field.
        setSuggestions([]);
        setOpen(false);
      }
    }, 220);
  }, [value]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const pick = useCallback(
    async (s: Suggestion) => {
      setOpen(false);
      setBusy(true);
      try {
        const res = await fetch(
          `https://places.googleapis.com/v1/places/${encodeURIComponent(s.placeId)}?sessionToken=${encodeURIComponent(session.current)}`,
          { headers: { "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": "addressComponents,formattedAddress" } },
        );
        if (!res.ok) throw new Error(String(res.status));
        const place = (await res.json()) as { addressComponents?: { longText?: string; shortText?: string; types: string[] }[]; formattedAddress?: string };
        const parsed = parsePlaceAddress(place.addressComponents ?? [], place.formattedAddress ?? s.text);
        // Session ends on a details call; start a fresh one for any re-edit.
        session.current = newToken();
        if (!parsed) {
          selectedRef.current = s.text;
          onChange(s.text);
          return;
        }
        selectedRef.current = parsed.full;
        onChange(parsed.full);
        // Resolve the suburb against our own data by postcode, then name.
        let suburb: SuburbSearchHit | null = null;
        try {
          const r = await fetch(`/api/suburbs/search?q=${encodeURIComponent(parsed.postcode)}`);
          if (r.ok) suburb = matchSuburb(parsed, (await r.json()) as SuburbSearchHit[]);
        } catch {
          suburb = null;
        }
        onSelect({ parsed, suburb });
      } catch {
        selectedRef.current = s.text;
        onChange(s.text);
      } finally {
        setBusy(false);
      }
    },
    [onChange, onSelect],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); void pick(suggestions[activeIdx]); }
    else if (e.key === "Escape") setOpen(false);
  };

  const listId = `${id}-options`;
  return (
    <div ref={wrapRef} className="relative">
      {label && <label htmlFor={id} className={labelClassName}>{label}</label>}
      <input
        id={id}
        type="text"
        required={required}
        autoComplete="off"
        value={value}
        onChange={(e) => { selectedRef.current = ""; onChange(e.target.value); }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={error ? true : undefined}
        aria-busy={busy || undefined}
        className={`${inputClassName} ${error ? "border-danger focus:border-danger" : ""}`}
      />
      {open && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-1 w-full max-h-72 overflow-auto rounded-xl border border-line bg-surface-raised shadow-lg py-1">
          {suggestions.map((s, i) => (
            <li
              key={s.placeId}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => { e.preventDefault(); void pick(s); }}
              onMouseEnter={() => setActiveIdx(i)}
              className={`flex items-start gap-2 px-3 py-2 text-sm cursor-pointer ${i === activeIdx ? "bg-surface-warm text-ink" : "text-ink-muted hover:bg-surface-warm"}`}
            >
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cta" aria-hidden="true" />
              <span>{s.text}</span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
