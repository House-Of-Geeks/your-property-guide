import type { DocketRow } from "@/lib/data/real-estate-leads";
import s from "./real-estate-leads.module.css";

// Shared pieces of "The Docket" layout, used by the /real-estate-leads hub
// and every /real-estate-leads/[type] page. Scroll reveals use YPG's
// data-reveal system (MotionObserver + globals.css), not a wrapper component.

export const CTA_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white font-medium px-7 py-3.5 text-base transition-colors";

export function Chapter({ num, title, kicker }: { num: string; title: string; kicker?: string }) {
  return (
    <div className={s.chapter}>
      <div className={s.chapterNum}>{num}</div>
      <h2 className={s.chapterTitle}>{title}</h2>
      {kicker && <div className={s.chapterKicker}>{kicker}</div>}
      <div className={s.chapterRule} />
    </div>
  );
}

export function Docket({
  title,
  rows,
  consents,
  recipient = "agent",
  caption = "Illustrative record. Names and figures are a composite. The fields are exactly what you receive.",
}: {
  title: string;
  rows: DocketRow[];
  consents: string[];
  /** Who the single copy goes to, for the stamp: "agent", "developer or builder". */
  recipient?: string;
  caption?: string;
}) {
  return (
    <div className={s.docketWrap} aria-label={`Illustrative ${title.toLowerCase()}`}>
      <div className={s.docketStack}>
        <div className={s.docketShadowCard} aria-hidden="true" />
        <div className={s.docket}>
          <div className={s.stamp} aria-hidden="true">
            Exclusive
            <small>one lead · one {recipient.endsWith("agent") ? "agent" : "recipient"}</small>
          </div>
          <div className={s.docketHead}>
            <div className={s.docketBrand}>
              Your Property Guide
              <small>{title}</small>
            </div>
          </div>
          <div className={s.docketBody}>
            {rows.map((row) => (
              <div key={row.key} className={s.docketRow}>
                <span className={s.docketKey}>{row.key}</span>
                {row.path ? (
                  <span className={s.docketPath}>{row.value}</span>
                ) : (
                  <span className={s.docketVal}>
                    {row.value}
                    {row.note && <small> {row.note}</small>}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className={s.docketFoot}>
            {consents.map((c) => (
              <span key={c} className={s.consent}>
                <i>✓</i> {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className={s.docketCaption}>{caption}</p>
    </div>
  );
}

/** The four commercial clauses. Same terms on every lead type. */
export const CLAUSES = [
  {
    n: "1.1",
    title: "Pay per lead",
    text: "You pay for delivered, in-scope leads. No platform fee, no retainer, no set-up charge, and no share of your commission. Priced by lead type, area and the weekly volume you want; quoted in writing before anything starts.",
  },
  {
    n: "1.2",
    title: "No minimum, no lock-in",
    text: "Month to month from the first lead. Raise your cap, lower it, or pause the moment your diary is full. We would rather keep you because the leads list than because a contract says so.",
  },
  {
    n: "1.3",
    title: "7-day replacement",
    text: "Wrong or disconnected number, outside the suburbs you nominated, or someone who tells you they have already signed with another agent: flag it within seven days and it is replaced.",
  },
  {
    n: "1.4",
    title: "100% exclusive",
    text: "One lead, one agent, matched to your suburbs. Never shared with a second agent, never resold, never recycled as aged data.",
  },
];

export function Clauses() {
  return (
    <div className={s.terms} data-reveal-group>
      {CLAUSES.map((c) => (
        <div key={c.n} className={s.clause}>
          <div className={s.clauseNum}>{c.n}</div>
          <div>
            <h3 className={s.clauseTitle}>{c.title}</h3>
            <p className={s.clauseText}>{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FinePrint() {
  return (
    <p className={s.fine}>
      Your Property Guide is a property education publisher, not a real estate
      agency. We do not give real estate advice or act for buyers or sellers.
      Enquiries are passed to agents only with the consumer&rsquo;s consent and
      handled under our <a href="/privacy">Privacy Policy</a>.
    </p>
  );
}

export function WhatHappensNext() {
  return (
    <div className={s.next}>
      <h3 className={s.nextTitle}>What happens next</h3>
      <div className={s.nextRow}><span className={s.nextWhen}>Today</span><span>Your licence or registration is checked on your state&rsquo;s public register.</span></div>
      <div className={s.nextRow}><span className={s.nextWhen}>1 bus. day</span><span>Andy calls or emails with live lead volume for your suburbs and a per-lead price in writing.</span></div>
      <div className={s.nextRow}><span className={s.nextWhen}>You decide</span><span>Set your cap and tell us where to send leads. Nothing is committed until you say yes.</span></div>
      <div className={s.nextRow}><span className={s.nextWhen}>Then</span><span>Leads are sent as they come in for your suburbs. Flag anything wrong inside seven days and it is replaced.</span></div>
    </div>
  );
}
