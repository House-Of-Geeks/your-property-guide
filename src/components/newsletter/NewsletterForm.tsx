"use client";

import { useRef, useState, useTransition } from "react";
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
      <div className={`flex items-center gap-2 ${isFooter ? "text-white/80" : "text-emerald-700"} font-sans text-sm`}>
        <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
        Thanks, you&rsquo;re subscribed. We&rsquo;ll send the next quarterly update.
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
            isFooter
              ? "flex-1 min-w-0 rounded-lg bg-white/10 border border-white/15 px-3 py-2.5 text-sm font-sans text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
              : "flex-1 min-w-0 rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm font-sans text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          }
        />
        <button
          type="submit"
          disabled={isPending || !email}
          className={
            isFooter
              ? "inline-flex items-center justify-center gap-1.5 rounded-lg bg-white text-ink px-4 py-2.5 text-sm font-sans font-medium hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              : "inline-flex items-center justify-center gap-1.5 rounded-lg bg-cta text-white px-4 py-2.5 text-sm font-sans font-medium hover:bg-cta-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          }
        >
          {isPending ? "Subscribing…" : "Subscribe"}
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
      <p className={`text-xs font-sans ${isFooter ? "text-white/70" : "text-ink-subtle"}`}>
        Quarterly market updates only. No spam. Unsubscribe anytime.
      </p>
      {status === "err" && errorMessage && (
        <p className={`text-xs font-sans ${isFooter ? "text-red-300" : "text-red-700"}`}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
