"use client";

import { useState } from "react";
import PhoneInput, { type FlagProps } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import AU from "country-flag-icons/react/3x2/AU";
import { Globe } from "lucide-react";
import { cleanAuPhone, pastedAuPhone } from "@/lib/utils/au-mobile";

// The site's phone field (Oct 2026, Why Solar's rebate quiz): the
// Australian flag, any AU format typed or pasted, and the value in E.164
// ("+61491570156"), which /api/leads stores as 0491570156. Forms validate
// it with auMobileError or the mobile schemas in lib/utils/au-mobile.

/** Presets matching the inputs around each form (.ypg-phone-input in globals.css). */
export type PhoneTone = "warm" | "raised" | "field" | "plain";
export type PhoneSize = "lg" | "md" | "sm";

interface AuPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Listing enquiries: an overseas number is allowed too. */
  overseas?: boolean;
  invalid?: boolean;
  tone?: PhoneTone;
  size?: PhoneSize;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
}

// Only the AU flag is bundled. Another country shows a globe, not the
// library's default flag, which is an image from an outside site.
function Flag({ country, countryName }: FlagProps) {
  return country === "AU" ? (
    <AU title={countryName} />
  ) : (
    <Globe aria-hidden="true" className="block w-full h-full text-ink-subtle" />
  );
}

export function AuPhoneInput({
  value,
  onChange,
  onBlur,
  overseas = false,
  invalid = false,
  tone = "warm",
  size = "lg",
  id,
  name,
  placeholder = "Mobile, e.g. 0412 345 678",
  required,
  disabled,
  autoFocus,
  className,
  ...aria
}: AuPhoneInputProps) {
  // The field keeps the digits as typed; a remount redraws them from the
  // value, so "412345678" or a paste shows as "0412 345 678" after a blur.
  const [remountKey, setRemountKey] = useState(0);

  return (
    <PhoneInput
      key={remountKey}
      defaultCountry="AU"
      countries={overseas ? undefined : ["AU"]}
      addInternationalOption={false}
      flagComponent={Flag}
      // A label, not a menu: out of the tab order and hidden from screen readers.
      countrySelectProps={{ tabIndex: -1, "aria-hidden": true }}
      // Redrawn AU numbers read "0412 345 678"; an overseas one keeps its
      // "+44 …", which national format would drop.
      initialValueFormat={value && !value.startsWith("+61") ? undefined : "national"}
      value={value}
      onChange={(v) => onChange(cleanAuPhone(v || ""))}
      onBlur={() => {
        if (value) setRemountKey((k) => k + 1);
        onBlur?.();
      }}
      placeholder={placeholder}
      disabled={disabled}
      numberInputProps={{
        id,
        name,
        required,
        autoComplete: "tel",
        // Not again on the remounts, which would pull focus back.
        autoFocus: autoFocus && remountKey === 0,
        "aria-invalid": invalid || undefined,
        ...aria,
        onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
          // Any AU format straight to E.164; another country goes to the
          // field, and the form's rules decide.
          const pasted = pastedAuPhone(e.clipboardData.getData("text"));
          if (!pasted) return;
          e.preventDefault();
          onChange(pasted);
          setRemountKey((k) => k + 1);
        },
      }}
      className={[
        "ypg-phone-input",
        `ypg-phone-input--${tone}`,
        `ypg-phone-input--${size}`,
        invalid && "ypg-phone-input--error",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

/** The field with a label and error, laid out like ui/Input, for the
 *  react-hook-form forms (wrap it in a Controller). */
export function AuPhoneField({
  label,
  error,
  id,
  ...props
}: Omit<AuPhoneInputProps, "invalid"> & { label: string; error?: string; id: string }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-ink-muted mb-1">
        {label}
      </label>
      <AuPhoneInput id={id} invalid={!!error} tone="field" size="sm" {...props} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
