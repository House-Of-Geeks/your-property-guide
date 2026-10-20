"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { downloadConsentText } from "@/lib/guide-consent";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";
import { MARKETING_CONSENT } from "@/lib/service-model";
import { useSiteFlags } from "@/components/flags/FlagsProvider";
import { CheckField, Field, Honeypot, INPUT_CLASS, SubmitButton, describedBy, useRequestKey } from "@/components/journeys/fields";
import { TEXT_LINK } from "@/components/premium/buttons";
import { GuideDownloadLink } from "./GuideDownloadLink";

// "Email me a copy" (20 Oct 2026): a first name and an email, nothing else
// asked. Posts to /api/guides/email (the contract in the next-pass brief):
//   200 { ok: true, status: "queued", requestId }  queued for sending, NOT delivered
//   400 { ok: false, errors: { firstName?, email? } }
//   429 / 500 { ok: false, error }
// So the page says it's on its way, never that it arrived, and offers the
// PDF right there. One request key per form, reused on a retry, so a double
// click or a second try can't send two copies. The tips box (a separate,
// unticked marketingConsent) shows only while the series really sends
// (src/lib/flags.ts); otherwise nothing but the guide is sent.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { firstName?: string; email?: string };
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "queued"; email: string } | { kind: "failed"; message: string };

type GuideEmailResponse =
  | { ok: true; status: "queued"; requestId: string }
  | { ok: false; errors?: Errors; error?: string };

/** The page that sent the reader here (?from=<slug>), else this guide's own page. */
function entrySlug(guide: GuideBookId): string {
  try {
    const from = new URLSearchParams(window.location.search).get("from");
    if (from && /^[a-z0-9][a-z0-9-]{0,79}$/i.test(from)) return from;
  } catch {
    // No URL to read: fall through.
  }
  return `${guide}-guide`;
}

export function GuideEmailForm({ guide, placement, autoFocus = false }: { guide: GuideBookId; placement: string; autoFocus?: boolean }) {
  const book = GUIDE_BOOKS[guide];
  const { series } = useSiteFlags();
  const requestKey = useRequestKey();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [tips, setTips] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Set synchronously, so a double click can't send twice before React re-renders.
  const inFlight = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);

  const id = (field: string) => `${guide}-copy-${field}`;

  useEffect(() => {
    if (autoFocus) nameRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (status.kind === "queued") doneRef.current?.focus();
  }, [status.kind]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current || status.kind === "sending" || status.kind === "queued") return;
    const name = firstName.trim();
    const address = email.trim();
    const found: Errors = {};
    if (!name) found.firstName = "Enter your first name.";
    if (!EMAIL_RE.test(address)) found.email = "Enter an email address like name@example.com.";
    setErrors(found);
    if (found.firstName || found.email) {
      (found.firstName ? nameRef : emailRef).current?.focus();
      return;
    }

    inFlight.current = true;
    setStatus({ kind: "sending" });
    track("guide_email_requested", { guide, placement });
    try {
      const res = await fetch("/api/guides/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guide,
          firstName: name,
          email: address,
          // Only when the box was offered; otherwise the field is left out.
          ...(series ? { marketingConsent: tips } : {}),
          requestKey,
          website,
          from: entrySlug(guide),
        }),
      });
      const body = (await res.json().catch(() => null)) as GuideEmailResponse | null;
      if (res.ok && body?.ok && body.status === "queued") {
        setStatus({ kind: "queued", email: address });
        track("guide_email_queued", { guide, placement });
        return;
      }
      if (res.status === 400 && body && !body.ok && body.errors && (body.errors.firstName || body.errors.email)) {
        setErrors(body.errors);
        setStatus({ kind: "idle" });
        (body.errors.firstName ? nameRef : emailRef).current?.focus();
        return;
      }
      setStatus({
        kind: "failed",
        message:
          res.status === 429
            ? "Too many tries in a minute. Please wait a moment and try again."
            : "We couldn’t queue your copy just now. Please try again, or download the PDF below.",
      });
    } catch {
      setStatus({ kind: "failed", message: "We couldn’t reach the server. Check your connection and try again, or download the PDF below." });
    } finally {
      inFlight.current = false;
    }
  };

  if (status.kind === "queued") {
    return (
      <div role="status" className="border-l-2 border-cta pl-4 sm:pl-5">
        <p ref={doneRef} tabIndex={-1} className="font-display text-[22px] leading-snug tracking-[-0.025em] text-ink outline-none">
          It’s on its way.
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
          {`We’ve queued ${book.name} for ${status.email}. It usually arrives within a few minutes. If you can’t see it, check your spam or Promotions folder.`}
        </p>
        <p className="mt-3 text-[15px] text-ink-muted">
          {"Want it now? "}
          <GuideDownloadLink guide={guide} placement={`${placement}-email-queued`} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            Download the PDF
          </GuideDownloadLink>
        </p>
      </div>
    );
  }

  const busy = status.kind === "sending";

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label={`Email me a copy of ${book.name}`}>
      <Honeypot value={website} onChange={setWebsite} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={id("name")} label="First name" error={errors.firstName}>
          <input
            ref={nameRef}
            id={id("name")}
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={describedBy(id("name"), null, errors.firstName)}
            className={INPUT_CLASS}
            required
          />
        </Field>
        <Field id={id("email")} label="Email" error={errors.email}>
          <input
            ref={emailRef}
            id={id("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy(id("email"), null, errors.email)}
            className={INPUT_CLASS}
            required
          />
        </Field>
      </div>
      {series && (
        <CheckField id={id("tips")} checked={tips} onChange={setTips}>
          {MARKETING_CONSENT}
        </CheckField>
      )}
      {status.kind === "failed" && (
        <div role="alert" className="text-[15px] leading-relaxed">
          <p className="font-medium text-danger">{status.message}</p>
          <GuideDownloadLink guide={guide} placement={`${placement}-email-failed`} className={`mt-2 ${TEXT_LINK}`}>
            Download the PDF instead
          </GuideDownloadLink>
        </div>
      )}
      <SubmitButton busy={busy}>{status.kind === "failed" ? "Try again" : "Email me the guide"}</SubmitButton>
      <p className="text-[13px] leading-relaxed text-ink-muted">
        {`${downloadConsentText(guide, series)} `}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy policy</a>.
      </p>
    </form>
  );
}
