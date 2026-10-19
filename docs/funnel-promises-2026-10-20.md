# Funnel promises and pipeline gaps, 20 Oct 2026

A read-only audit of every way a visitor's details enter the site found places where the site promised more than production does. This change makes the promises match, with no new features.

## What changed
- **Series and check-in promises follow the real switches.** `src/lib/flags.ts` reads `GUIDANCE_SEQUENCE_ENABLED` and `INTRO_CHECKIN_ENABLED`. `FlagsProvider`, in the marketing layout, hands both to the forms. While the series is off:
  - the plan email form and both guide funnels don't offer the series box;
  - their wording drops "unless you tick the box";
  - `/api/plans` and `/api/leads` ignore a tick from an older cached page.

  The guide thanks page now shows what the server actually started, not just the tick. The introduction confirmation no longer says "In a week or two we'll ask". The `/get-help` steps now say the confirmation email has a link to tell us how it went, which is true whether or not check-ins are on. Turning either variable on and redeploying brings the box and its wording back.
- **The agent gets the visitor's note.** The Sent 24/7 introduction payload now carries `notes`. For buyer's agents it also carries `buyer_type` and `budget`, using the labels the form shows (`src/lib/introductions/labels.ts`). Buyer's-agent requests are still always held for the team.
- **The plan email stores its consent wording,** in `Lead.consentText` (`src/lib/plans/consent.ts`), like the guides and the agreement check.
- **The duplicate guard no longer drops new requests.** A repeat within 30 minutes now counts as a duplicate only for services asked again with the same permission answer. A newly added service, or a newly ticked box, is handled. Services already handled are answered with their earlier outcome and aren't sent twice. Same-`requestKey` double submits are unchanged.
- **The newsletter is honest.**
  - The form's line is now "Occasional market updates from our team. No spam. Unsubscribe anytime." (`src/lib/newsletter.ts`). It no longer says "quarterly", because nothing sends on a schedule.
  - Each signup now stores that wording, `marketingConsent`, `kind: "learning"`, a token for unsubscribe links, and a `submitted` event.
  - `/api/unsubscribe` now stops marketing on every row with that email address, not just one.
- **Guide funnels check the first name** before sending, so a blank name gets a field error instead of "Something went wrong".
- **Stale comments fixed:**
  - the guide mobile is optional (since 14 Oct);
  - the cron route is `/api/cron/follow-ups`;
  - the schema's reference to the missing `status.ts` now points to `rules.ts`.

## Verified
- **Tests:**
  - new: plans and leads series gating, partial duplicate, newly ticked permission, note in the Sent 24/7 payload, newsletter consent, all-rows unsubscribe;
  - `vitest run`: 1,466 passing;
  - `eslint` clean on the changed files;
  - `next build` passes, including TypeScript.
- **Local end to end.** I ran production-like settings with the series and check-ins off, email written to a log, a mock Sent 24/7 and a throwaway database:
  - **Plan email:** no box; the plain wording is stored; one email.
  - **Selling guide:** no box and the plain wording; a blank first name gets a field error; a real submit stores the plain wording and reports `sequence: false` to the thanks page.
  - **Selling introduction with a note:** the mock received `notes`; the team got `[SENT]`; the visitor's email has no check-in promise and keeps the feedback link.

## Decisions for Andy
1. **Switch the tips series and check-ins on, or leave them off.** Off is honest now. On needs the variable plus a redeploy. People who ticked the box before today have rows already marked for the series. The cron will start them the day it's switched on, at one email per person per day, at most 50 people a day.
2. **Sent 24/7 guide follow-ups.** `LEAD_MAGNET_TO_SENT247` is set in production (its value is hidden). If it's "true", Sent 24/7 sends the guide plus whatever follow-ups its campaign has. The site doesn't promise "nothing else" while the series is off, but check the Sent 24/7 campaign if you want guide readers to get one email only.
3. **The newsletter.** Nothing sends it. Either start sending occasional updates (rows now carry consent and an unsubscribe token), or remove the form.
