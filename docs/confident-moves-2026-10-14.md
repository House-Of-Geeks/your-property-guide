# Confident moves (14 Oct 2026)

The site is now organised around one question: **what should I do next, and who can help me do it well?** Education comes first and is free with no sign-up; a personal introduction is a separate, explicit choice.

Promise: *Buy or sell property with confidence.* Copy for every promise lives in `src/lib/service-model.ts`.

## The two paths

| | Learning | Introduction |
|---|---|---|
| What | Guides, calculators, next-step plans (`/plan`), guide PDFs, an optional tips series | One participating selling agent or buyer's agent, with permission |
| Contact details | None to read or plan. Email to receive a copy. Phone optional (only for a call from our team) | Name, email, phone, preferred contact method, best time |
| Consent | Delivery only. The tips series is its own unticked box | A separate permission tick per introduction, worded in `SERVICES[...].permission`. Marketing box separate and unticked |
| Reaches an agent? | Never | Only when the rules allow and the partner channel accepts it |
| Lead row | `kind = "learning"` (`guide-download`, `plan-email`) | `kind = "introduction"` (`introduction-request`; older `appraisal-request`, `match-request`) |
| API | `/api/leads` (guides), `/api/plans` | `/api/introductions` |

## How an introduction is decided (`src/lib/introductions/rules.ts`)

1. No permission tick: not introduced.
2. Already signed with a selling agent, or already engaged a buyer's agent: not introduced (education continues).
3. No suburb, or outside coverage: held for the team.
4. Buyer's agents: every request is reviewed by hand (`PARTNER_COVERAGE`), and the form says so before anything is sent.
5. Sellers more than six months out: held for the team (cold vendors are not passed on, per the agent terms).
6. Otherwise: posted to the Sent 24/7 vendor campaign. `status = "sent"` only when Sent 24/7 accepts it; a decline or failure is `held` with the reason, and the team is emailed `[ACTION]`.

The person sees, and is emailed, what really happened (`outcomeCopy`), who will contact them, by which method and within what window (`RESPONSE_WINDOW`, one business day).

Duplicate protection: each form sends a `requestKey` (unique in the DB); a repeat with the same key, or the same email asking for the same service within 30 minutes, returns the first request's outcome without a second row, delivery or email. A simultaneous double submit that loses the unique-key race gets the same answer.

## What changed for people

- **Homepage** (redone after review, v5): the light "Buy or sell property with confidence" first screen with the two guides as 3D books on a photo, and one switch (I'm selling, I'm buying, Both) that swaps the photo, the front book and the two next steps (free guide, then an agent). Every band below is something to use and follows the switch: run your numbers (cost to sell, stamp duty, borrowing, live), your next three steps (a plan that rewrites as you tap), look inside the guides (books that open to their contents), and find your agent (kind of agent plus suburb, straight into `/get-help`), then who writes the guides and the latest posts. See BRAND.md §13.
- **Hubs, guide pages and articles** (v5): heroes are light with a crisp photo and the move's guide standing on it as a book; hubs open with the live number tools; the guide pages' contents open the book to the chapter you point at; articles show reading progress.
- **Navigation**: Buying, Selling, Guides and tools, Find an agent, About (how we're paid, how we choose agents, for agents). The header button and phone bar offer the free guide for the page's move and a way to an agent; the phone bar hides on form pages and while typing.
- **New pages**: `/plan`, `/plan/result`, `/get-help`, `/buying`, `/buying-and-selling`, `/buyers-agents`, `/tools/agent-proposal-worksheet`, `/feedback/[token]`, `/unsubscribed`.
- **Guide funnels**: 8 and 7 steps became 4 each (where, timing or who, stage, delivery). The PDF can be downloaded straight away; email, phone and the tips series are separate optional choices. The thanks-page call card (which re-sent personal details as an agent call) is gone.
- **Appraisal, find-an-expert, property-valuation, the suburb appraisal box, the bridging calculator, region and suburb-agent pages** all use the introduction form.
- **Priority guides and calculators** end with a specific next step (`src/lib/next-steps.ts`) instead of the same PDF form.
- **Portal routes retired** with 308s (`docs/portal-consolidation-2026-10-14.md`). Suburb profiles no longer show the legacy listing grid.
- **Promises reconciled**: no "best agents", fee negotiation, settlement support, "anywhere in Australia", team-calls-first or broker/specialist matches. The agent page's consent and vetting text now match what consumers see.
- **Accuracy**: first home rules for every state in `src/lib/policy/first-home.ts` (dated versions, sources, reviewed 14 Oct 2026); the stamp duty calculator takes the contract (or TAS settlement) date and property kind; 11 guides corrected and re-dated; the buying guide PDF re-rendered. Climate figures from a station more than 50 km away are no longer shown as the suburb's (see Operations).

## Operations: before and after deploying

1. **Database (before the code deploys)**: run `scripts/sql/2026-10-14-lead-journeys.sql` against production (additive: nullable columns, a new `LeadEvent` table, indexes). Not `prisma db push` (it would drop `School.geom` and `yfg_leads`).
2. **Environment flags** (all default off):
   - `GUIDANCE_SEQUENCE_ENABLED=true` starts the optional tips series (`/api/cron/follow-ups`, daily 22:00 UTC, already in `vercel.json`).
   - `INTRO_CHECKIN_ENABLED=true` sends one "how did it go?" email 10 days after an introduction.
   - `SENT247_BUYER_CAMPAIGN_ID` routes buyer's agent introductions to a Sent 24/7 campaign once one exists; also change `PARTNER_COVERAGE["buyers-agent"]` to `"direct"` for the states it covers.
   - `CRON_SECRET` must be set (the cron uses it, as leads-health does).
3. **Blog posts**: corrected posts reach production only after `npm run publish:blogs`.
4. **Clarity**: guide thanks pages now fire `guide_thanks_view`; `lead_conversion` is introduction thanks pages only. New events: `plan_started`, `plan_completed`, `plan_emailed`, `guide_delivered`, `guide_downloaded_direct`, `sequence_opted_in`, `intro_started`, `intro_submitted` (with the server's status), `tool_used`. Update any dashboards that counted `lead_conversion` on guide pages.
5. **Climate data**: syncs before this release stamped every suburb on a station with one suburb's distance (all ~970 "Brisbane" suburbs read 11.4 km; Buderim is ~89 km away). Pages now recompute the distance and withhold figures beyond 50 km. To fix the data: repair the BoM station-list URL in `scripts/sync/sources/bom-climate.ts` (it 404s, so the sync falls back to 20 capital-city stations) and re-run the climate sync.
6. **Recording outcomes**: `/dashboard/admin/leads` (admins) shows learning and introduction counts and lets the team record partner acceptance, appointments and signed agreements, with who confirmed each. Customers can report the same through their feedback link.

## Decisions for Andy

- **Phones on guides**: the brief made the mobile optional on the learning path, reversing PR #115's required mobile. The team still gets a number when someone adds one for a call.
- **Homepage claims**: the 13 Oct homepage (PR #120/#121) promised a team call first, fee negotiation and support to settlement, which the pipeline and the agent terms didn't deliver. Those are removed. If any becomes a staffed service, add it to `src/lib/service-model.ts`.
- **Partner checks**: `PARTNER_CHECKS` combines the agent page's vetting list with the 13 Oct bar (licence, local results, reviews, a conversation). Confirm each check is actually done for every partner.
- **Buyer's agents**: shown as limited and reviewed by hand. Confirm whether any buyer's agents are signed, and where.
- **Response window**: "normally within one business day" for partner contact. Confirm partners agree to it.
- **Developer leads page** (`/real-estate-leads/property-developer-leads`) still sells a house-and-land listing model that no longer exists.
- **Listing grids** remain on region, school and agency pages (legacy data).

## Experiments once there is a baseline (4 to 6 weeks)

1. Homepage: the number tools vs the live plan as the first band after the hero (tool use and plan opens, then introduction rate per visitor).
2. Guide delivery: direct download link vs email-only on the last step (guide delivered, tips opt-in, and introductions within 30 days).
3. Introduction form: four steps vs a two-step version that asks contact details first (completion and held/sent mix).
4. Next-step cards on the commission guides: worksheet first vs "ask for an introduction" first (introduction rate, and feedback "useful").
5. Tips series content: which email produces the most introduction requests within 7 days, by stage.

Measure each against confirmed outcomes in the admin page (sent, appointment, signed), not clicks.
