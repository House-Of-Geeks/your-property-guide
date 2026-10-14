"use client";

import { useState } from "react";
import { ChoiceGroup, Field, INPUT_CLASS, SubmitButton } from "./fields";

// How an introduction went, from the person who was introduced (the link in
// their confirmation and check-in emails). The answers are stored against
// the request; a booked appraisal or consultation moves its status forward.

type YesNo = "yes" | "no";

export function FeedbackForm({ token, service }: { token: string; service: "selling-agent" | "buyers-agent" }) {
  const [contacted, setContacted] = useState<"yes" | "no" | "not-yet" | null>(null);
  const [useful, setUseful] = useState<"yes" | "somewhat" | "no" | "too-early" | null>(null);
  const [booked, setBooked] = useState<YesNo | null>(null);
  const [signed, setSigned] = useState<"yes" | "no" | "undecided" | null>(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const what = service === "selling-agent" ? "an appraisal" : "a consultation";
  const agreement = service === "selling-agent" ? "an agency agreement" : "an engagement with them";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contacted || !useful || !booked) {
      setError("Please answer the first three questions.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, contacted, useful, booked, signed: signed ?? undefined, comment: comment.trim() || undefined }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "We couldn’t save that. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("We couldn’t reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-line bg-white p-6" role="status">
        <p className="text-lg font-bold text-ink">Thank you</p>
        <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">
          {contacted === "no" ? "We’ll follow it up with the agent and let you know." : "Your answers help us decide which agents keep receiving introductions."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="tone-light space-y-7 rounded-xl border border-line bg-white p-5 sm:p-8 text-ink">
      <ChoiceGroup legend="Did they contact you?" options={[{ id: "yes", label: "Yes" }, { id: "not-yet", label: "Not yet" }, { id: "no", label: "No" }]} columns={3} value={contacted} onChange={setContacted} />
      <ChoiceGroup
        legend="Was the introduction useful?"
        options={[{ id: "yes", label: "Yes" }, { id: "somewhat", label: "Somewhat" }, { id: "no", label: "No" }, { id: "too-early", label: "Too early to say" }]}
        columns={2}
        value={useful}
        onChange={setUseful}
      />
      <ChoiceGroup legend={`Did you book ${what}?`} options={[{ id: "yes", label: "Yes" }, { id: "no", label: "No" }]} columns={2} value={booked} onChange={setBooked} />
      <ChoiceGroup legend={`Have you signed ${agreement}?`} hint="Optional." options={[{ id: "yes", label: "Yes" }, { id: "no", label: "No" }, { id: "undecided", label: "Not decided" }]} columns={3} value={signed} onChange={setSigned} />
      <Field id="fb-comment" label="Anything else we should know?" optional hint="It goes to our team only.">
        <textarea id="fb-comment" rows={3} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} aria-describedby="fb-comment-hint" className={INPUT_CLASS} />
      </Field>
      {error && <p className="text-sm font-medium text-danger" role="alert">{error}</p>}
      <SubmitButton busy={busy}>Send feedback</SubmitButton>
    </form>
  );
}
