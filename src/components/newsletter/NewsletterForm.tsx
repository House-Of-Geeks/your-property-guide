"use client";

import { useRef, useState, useTransition } from "react";
import { NEWSLETTER_CONSENT } from "@/lib/newsletter";
import { ArrowRight, Check } from "lucide-react";
import { subscribeToNewsletter } from "./actions";

interface NewsletterFormProps {
  /** Footer | inline | hero, controls the layout and dark/light treatment */
  variant?: "footer" | "inline";
}

/**
 * Newsletter capture: single email field + button. Uses a server action so
 * the page stays static; success/error state is rendered client-side.
 */
export function NewsletterForm({ variant = "footer" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Honeypot: uncontrolled so a bot that sets .value via the DOM is still
  // read at submit time. Real users never reach it (hidden, tabIndex -1).
  const websiteRef = useRef<HTMLInputElement>(null);

  const isFooter = variant === "footer";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || isPending) return;
    setErrorMessage(null);

    startTransition(async () => {
      const result = await subscribeToNewsletter({ email, website: websiteRef.current?.value ?? "" });
      if (result.ok) {
        setStatus("ok");
        setEmail("");
      } else {
        setStatus("err");
        setErrorMessage(result.error ?? "Something went wrong. Try again?");
      }
    });
  }

  // Once subscribed, replace the form with a confirmation card so the user
  // doesn't accidentally re-submit.
  if (status === "ok") {
    return (
      <div className="flex items-center gap-2 text-success font-sans text-sm">
        <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
        Thanks, you&rsquo;re subscribed.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      {/* Honeypot: visually hidden, off-screen, aria-hidden. Matches the lead forms. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor={`nl-website-${variant}`}>Website</label>
        <input id={`nl-website-${variant}`} ref={websiteRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className={`flex flex-col sm:flex-row gap-2 ${isFooter ? "" : "max-w-md"}`}>
        <label htmlFor={`nl-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-${variant}`}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={
            "flex-1 min-w-0 min-h-11 rounded-[4px] border border-line-strong bg-surface-raised px-3 py-2.5 text-[15px] font-sans text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          }
        />
        <button
          type="submit"
          disabled={isPending || !email}
          className={
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] bg-cta text-cta-ink px-4 py-2.5 text-[15px] font-sans font-medium hover:bg-cta-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          }
        >
          {isPending ? "Subscribing…" : "Subscribe"}
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-xs font-sans text-ink-subtle">
        {NEWSLETTER_CONSENT}
      </p>
      {status === "err" && errorMessage && (
        <p className="text-xs font-sans text-danger">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
