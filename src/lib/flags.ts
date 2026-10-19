// Switches that decide what the site may promise (20 Oct 2026). Read on the
// server only; the marketing layout hands the values to the forms through
// FlagsProvider, so a form offers the tips series only when the series
// really sends, and the API ignores a tick from a page built before a change.
//
// On Vercel a changed variable takes effect on the next deployment, for the
// pages and the API alike.

/** The optional tips series (/api/cron/follow-ups sends it only when this is exactly "true"). */
export function guidanceSeriesEnabled(): boolean {
  return process.env.GUIDANCE_SEQUENCE_ENABLED === "true";
}

/** The check-in email to people introduced 10+ days ago (sent or accepted only). */
export function introCheckInsEnabled(): boolean {
  return process.env.INTRO_CHECKIN_ENABLED === "true";
}

export interface SiteFlags {
  series: boolean;
  checkIns: boolean;
}

export function siteFlags(): SiteFlags {
  return { series: guidanceSeriesEnabled(), checkIns: introCheckInsEnabled() };
}
