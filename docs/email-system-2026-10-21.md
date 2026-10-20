# Email system: SendGrid only, run by the app (21 Oct 2026)

Branch `next-refinement`. Andy chose SendGrid instead of ActiveCampaign, so the site now owns every email: templates, consent, audiences, schedules and sending history live in the app. SendGrid only delivers them. ActiveCampaign is retired from the code, and Sent 24/7 no longer delivers guides; it keeps introductions only.

This file is the handover: how it works, what each flow sends, what is switched on, and what still has to happen outside the code.

## 1. How a send works

1. **Queue first.** Every customer email becomes an `EmailMessage` row before anything is sent (`src/lib/mail/queue.ts`). Each row has a unique `key` (for example `guide:selling:<leadId>`), so a double submit, a retry or two overlapping runs can't make a second email.
2. **Send.** The email someone is waiting for (guide, plan, confirmations) is sent at once (`queueAndSendNow`). Team emails go after the response (`queueAndSendLater`). Anything left over is picked up by `/api/cron/email` every 5 minutes.
3. **Claim.** A row is claimed atomically (`UPDATE … WHERE status = 'queued'`, `FOR UPDATE SKIP LOCKED` for batches), so two runs never take the same row.
4. **Outcome:**

   | Status | Meaning | What happens next |
   |---|---|---|
   | `accepted` | SendGrid took it (`250 Ok: queued as …`) | Waits for the webhook. **Not "delivered".** |
   | `queued` (attempts > 0) | Temporary refusal (4xx) or a connection that failed before the message | Retried after 2, 10, 30, 120, then 360 minutes, up to 5 attempts |
   | `failed` | Permanent refusal (5xx, bad envelope) or out of attempts | Shown on the admin page; "Send again" after checking |
   | `ambiguous` | The connection died while sending, or a run stopped mid-send (15 min) | **Never resent automatically.** A later `processed` event settles it as accepted |
   | `suppressed` | The address is on the suppression list for this kind of email | Never sent |
   | `delivered`, `deferred`, `bounced`, `dropped` | From SendGrid's signed Event Webhook | Bounces and drops record a failure and may suppress the address |

5. **Records.** Each send carries one custom argument, `ypg_mid` (the opaque `EmailMessage` id, never personal data), and categories `ypg` + the flow. Click tracking and open tracking are switched off on every message. The account-wide SendGrid settings are untouched.
6. **Webhook.** `POST /api/webhooks/sendgrid` checks SendGrid's ECDSA signature over the timestamp and raw body. It answers 503 until the key is configured and 403 for a bad signature. Events are stored once each, by `sg_event_id`. The SendGrid account is shared with other brands, so events without `ypg_mid` are acknowledged and ignored.

## 2. Consent and suppression

- **Kinds of email:** transactional (guide, plan, confirmations), marketing (tips series, check-in, newsletter, welcome) and operational (team notifications, tests, sign-in).
- **Suppression scopes** (`EmailSuppression`, by lower-cased address, so every duplicate lead row is covered):
  - `marketing`: unsubscribes. Stops series, check-ins and the newsletter, not a guide you ask for.
  - `all`: hard bounces, invalid addresses, spam complaints. Stops everything except team email.
- Suppression is checked when an email is queued and again just before it's sent.
- **Unsubscribe:**
  - Every marketing email has a footer link to `/unsubscribe?t=…`, a page that asks first, so link scanners can't unsubscribe anyone.
  - The `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers (RFC 8058) point at `POST /api/unsubscribe`.
  - Either way, every lead row for that address stops, case-insensitively.
- Unsubscribes are kept in the app, not pushed to SendGrid's global list, because the account is shared. SendGrid's own suppressions still apply to every send; nothing bypasses them.
- **Consent is specific:**
  - Asking for a guide or a plan is not consent to marketing.
  - The tips series is a separate, unticked box, offered and honoured only while `GUIDANCE_SEQUENCE_ENABLED=true`.
  - The newsletter is its own sign-up.

## 3. Flow matrix

"Live" means the code sends it once this branch is deployed. "Off" means it's built but behind a flag that is not set in production. Nothing marked Off sends.

| Flow | Trigger | To | Consent needed | Kind | Key (one email per…) | Schedule | Stops when | State |
|---|---|---|---|---|---|---|---|---|
| Guide by email (new form) | "Email me a copy" on /selling-guide, /buying-guide (`/api/guides/email`) | Reader | None beyond the request | Transactional | `guide:<guide>:<leadId>`; double submits share a `requestKey` | At once; cron retries | Bounce or complaint on file | **Live** |
| Guide (personalised funnel) | `guide-download` on `/api/leads` | Reader | None beyond the request | Transactional | `guide:<guide>:<leadId>` | At once | As above | **Live**. Never Sent 24/7 now, whatever `LEAD_MAGNET_TO_SENT247` says |
| Plan by email | "Email me this plan" (`/api/plans`) | Person | None beyond the request | Transactional | `plan:<leadId>` | At once | As above | **Live** |
| Introduction confirmation | `/api/introductions` (selling agent, buyer's agent) | Requester | The permission box per service | Transactional | `intro:<groupId>` | At once | As above | **Live**. Sent 24/7 routing of the introduction itself is unchanged |
| Agreement-check confirmation | `agreement-check` on `/api/leads` | Requester | The request | Transactional | `confirm:agreement-check:<leadId>` | At once | As above | **Live** |
| Other confirmations | `general-contact`, `rental-appraisal` (and API-only types) | Submitter | The request | Transactional | `confirm:<type>:<leadId>` | At once | As above | **Live** |
| Team notification | Every lead, introduction and phone added | Andy, cc Jos | n/a | Operational | `team:lead:<id>`, `team:intro:<groupId>`, `team:phone:<id>` | After the response | Never suppressed | **Live**. A permanent failure queues `team:lead-alert:<id>` |
| Lead-health heartbeat | Daily cron 21:00 UTC | Andy | n/a | Operational, direct `sendMail` | n/a | Daily | n/a | **Live**. Direct on purpose (it must work when the database is down); now adds a 24-hour email-status line |
| Dashboard sign-in link | Magic link on /dashboard/login | Dashboard user | n/a | Operational, direct `sendMail` | n/a | On request | n/a | **Live**. Now branded, click tracking off, no copy stored (the link is a credential) |
| Newsletter welcome | New or returning newsletter sign-up | Subscriber | Newsletter sign-up | Marketing | `newsletter-welcome:<leadId>:<occasion>` | After the sign-up | Unsubscribe, bounce, complaint | **Live** for sign-ups after deploy. Existing subscribers get nothing |
| Newsletter issue | An admin publishes a draft (§4) | Consented newsletter sign-ups, one per address, minus suppressions | Newsletter sign-up | Marketing | `newsletter:<issueId>:<email>` | When an admin publishes | As above | **Built, no issue exists.** Nothing sends until Andy publishes one |
| Tips series | Daily cron 22:00 UTC (`/api/cron/follow-ups`) | Rows with a series, one per address | The separate tips box | Marketing | `seq:<leadId>:<series>:<step>` | Series spacing (§5) | Unsubscribe, suppression, last step | **Off** (`GUIDANCE_SEQUENCE_ENABLED` unset) |
| Introduction check-in | Same cron | Introductions sent or accepted 10+ days ago, no feedback | n/a (service follow-up) | Marketing (unsubscribe honoured) | `checkin:<leadId>` | Once | Unsubscribe, suppression | **Off** (`INTRO_CHECKIN_ENABLED` unset) |
| Newsletter test | Admin "Send test" | Internal domains only | n/a | Operational | Per test | On click | n/a | **Live** (admin only) |

Previews of each email (desktop, phone, images off and a forced-dark approximation) were rendered from these templates on 21 Oct. They are browser previews, not tests in real email clients.

## 4. Newsletter workflow (admin)

`/dashboard/admin/newsletter` (admins only):

1. Write a draft: subject, preheader, heading, body (paragraphs, `## ` headings, `- ` lists, `[text](https://…)` links), optional button, optional window photo.
2. Preview the HTML and plain text, and see the audience size (consented newsletter sign-ups, one per address, minus suppressions).
3. Send a test to an internal address (`NEWSLETTER_TEST_DOMAINS`, default theandylife.com, profitgeeks.com.au, yourpropertyguide.com.au, houseofgeeks.com.au). Any edit needs a fresh test.
4. Publish: type `PUBLISH`. Each recipient gets one queued email. Publishing twice changes nothing.
5. Review queued, accepted, delivered and failed counts on the issue page and on `/dashboard/admin/email`.

There is no schedule. The welcome email says "There's no fixed schedule", and nothing promises a frequency.

## 5. Series cutover policy (for when the flag goes on)

- **Completed steps are kept.** A row resumes at its stored step.
- **No catch-up burst:**
  - At most one series email per address per day, and 50 a day in total.
  - After a late step, the next one keeps the series' spacing from when it's sent, not from sign-up.
- **Stale starts expire.** A series whose first email was due over 30 days ago isn't started.
- **One series per address.** Where one address has several, the oldest runs and the others end.
- **Check first.** `/dashboard/admin/email` shows what switching on would do today (due, would expire, suppressed, duplicates) before anyone sets the flag.

## 6. Cutover status and the steps outside the code

**Done in code (this branch):**
- The queue, webhook, suppression, unsubscribe, newsletter admin and welcome.
- Sent 24/7 lead-magnet delivery removed: `LEAD_MAGNET_TO_SENT247` is read nowhere now.
- ActiveCampaign code, templates and scripts removed.
- The privacy policy names SendGrid and Sent 24/7 for what each actually does.

**Order of deploy (important):**
1. Apply `scripts/sql/2026-10-21-email-system.sql` to the production database **before** the code deploys. Without the four new tables, every guide, plan and confirmation email fails.
2. Deploy.
3. Then the external steps below.

**Outside the code, not done and not verified from here:**

| # | Where | Step | Why |
|---|---|---|---|
| 1 | SendGrid → Settings → Mail Settings → Event Webhook | Add a webhook to `https://www.yourpropertyguide.com.au/api/webhooks/sendgrid` with processed, delivered, deferred, bounce, dropped, spam report, unsubscribe and group unsubscribe. Turn on **Signed Event Webhook**. The account is shared: add one rather than replacing another brand's webhook. | Without it nothing is ever marked delivered or bounced, and the admin page says so |
| 2 | Vercel → production env | Add `SENDGRID_WEBHOOK_PUBLIC_KEY` (the verification key SendGrid shows) and redeploy | The webhook answers 503 until it's set |
| 3 | Sent 24/7 | Stop the lead-magnet follow-up emails for guide readers already enrolled (`selling-guide`, `buying-guide`). Then remove `LEAD_MAGNET_TO_SENT247` from Vercel (now inert). | Those follow-ups run on Sent 24/7's side; the code can't stop them |
| 4 | ActiveCampaign | Set automations 5, 6, 7, 10, 11 and 12 to Inactive. Export unsubscribed and bounced contacts and import them (`docs/activecampaign-automations.md`). | Contacts synced before 9 Oct can still get AC automations |
| 5 | Local terminal, production `DATABASE_URL` | `npx tsx scripts/mail/sync-sendgrid-suppressions.ts` (dry run, then `--apply`) | Copies SendGrid's existing bounces, complaints and unsubscribes for YPG addresses into the app's list |
| 6 | DNS (optional) | Add a reporting address to DMARC: `v=DMARC1; p=none; rua=mailto:…` | Today's record (`p=none`, no `rua`) gives no reports |
| 7 | Inbox | After deploy, send a newsletter test to an internal inbox. Check Gmail, Apple Mail and Outlook, images off and dark mode. | Only browser previews have been checked |

**Sending identity (checked 21 Oct from public DNS only):**
- `s1` and `s2._domainkey.yourpropertyguide.com.au` point to SendGrid (account u22964641), so SendGrid can sign as the domain.
- DMARC is `p=none`, with no reporting address.
- The apex SPF lists Outlook only; SendGrid's SPF normally sits on its own return-path subdomain.
- The from address comes from `EMAIL_FROM` (set in Vercel, value not read). Replies go to andy@theandylife.com.
- Not verified: that SendGrid shows the domain as authenticated, and the headers of a real delivered message.

**Open decisions for Andy:**
- Switch the tips series and check-ins on, after the dashboard preview.
- Publish a first newsletter, or remove the sign-up form.
- The rental-appraisal form and its email promise "a property manager who works in your suburb will be in touch within one business day". No code sends the request to a property manager; it reaches the team only.

## 7. Verification (21 Oct)

- **Full suite:** 1,496 tests pass, including 19 against a throwaway Postgres. Those 19 skip unless `TEST_DATABASE_URL` is set, and take turns via an advisory lock. They cover:
  - one email per key, even when two enqueue at once;
  - overlapping runs claiming disjoint rows;
  - two cron runs sending each email exactly once;
  - retries with backoff, then failure;
  - permanent failures, and ambiguous sends that aren't resent;
  - stale-run release;
  - suppression scopes, including a suppression added after queueing;
  - webhook duplicates, status order, bounce and unsubscribe across duplicate rows;
  - series overlap, spacing, expiry and merging;
  - newsletter audience and double publish;
  - the guide-email route (one lead, one email, no Sent 24/7, double submit, the tips gate, honest refusal, retry).
- **Signature checks:** the webhook was checked against generated EC keys (good signature, changed body, wrong key, missing header, stale timestamp).
- **Build:** `tsc` clean and `next build` passes. ESLint: 61 errors and 54 warnings, all in files this branch didn't add; none in the new mail code.
- **End to end:** "Email me a copy" was run in a browser against the local site (log mode, throwaway database). It showed "It's on its way" (never "delivered"). It stored one learning lead with no marketing consent, plus a guide email and a team email, each with only `ypg_mid` as a custom argument and click/open tracking off.
- **Not verified:**
  - a real SendGrid send;
  - a real signed webhook from SendGrid;
  - rendering in real email clients;
  - the external account steps in §6.
