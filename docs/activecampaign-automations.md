# ActiveCampaign — YPG Seller Automations

**Status:** the sync is live in code, and every automation email now exists as a **designed, ready-to-paste HTML template** in `emails/activecampaign/` (regenerate with `npx tsx scripts/ac-emails/build.ts`). What remains is clicking the four automations together in the AC UI, because AC's public API can't create automation workflows.

## Ready-made templates (paste, don't build)

In AC, when an automation step says "Send an email": create the email → choose the **Custom HTML** editor → paste the file contents → set the subject line from the table below. Each template already contains the preheader, personalisation tags (`%FIRSTNAME%`, `%YPG_SUBURB_NAME%` for copy, `%YPG_SUBURB%` for URLs), artwork hosted on the live domain, and the required `%SENDER-INFO%` / `%UNSUBSCRIBELINK%` footer.

| File | Automation step | Subject |
|---|---|---|
| `hot-1-appraisal.html` | HOT push, 1h after tag | What's your place actually worth? |
| `hot-2-60-day-window.html` | HOT push, day 3 | The 60-day trap (and how to never see it) |
| `warm-1-costs.html` | WARM, day 2 | Where the 3 to 5% goes |
| `warm-2-negotiation.html` | WARM, day 5 | Most sellers never ask. You will. |
| `warm-3-preparation.html` | WARM, day 9 | The $3,000 weekend |
| `warm-4-method.html` | WARM, day 14 | Auction or private treaty for %YPG_SUBURB_NAME%? |
| `warm-5-appraisal-traps.html` | WARM, day 21 | How to read an agent's appraisal |
| `warm-6-ready.html` | WARM, day 30 | Ready to put a number on it? |
| `monthly-market-read.html` | Monthly campaign template (edit the two marked blocks each month) | Your market this month |
| `reengage-still-thinking.html` | Re-engagement, 90 days cold | Still thinking of selling? |

Note: `%YPG_SUBURB_NAME%` (pretty, e.g. "Burpengary QLD 4505") is filled by the sync for every lead from 2026-06-10 onward; contacts synced before then have only the slug field until they next come through the funnel.

## What the sync writes (already working)

- **List:** `YPG Property Sellers` (id 6). Contacts are subscribed ONLY when they ticked the marketing-consent checkbox.
- **Custom fields:** YPG Suburb, Property Type, Bedrooms, Selling Timeframe, Agent Status, Motivation, Price Expectation, Lead Score, Lead Source.
- **Tags:** `ypg-seller`, `ypg-score-{hot|warm|cold|do-not-contact}`, `ypg-timeframe-{...}`, `ypg-agent-{...}`, `ypg-consented` / `ypg-no-consent`.

Code: `src/lib/activecampaign.ts` (sync), `scripts/setup-activecampaign.ts` (idempotent list/field setup), hook in `src/app/api/leads/route.ts`.

## Before sending anything: sender authentication

DNS for yourpropertyguide.com.au is on **Cloudflare**. In AC: Settings → Advanced settings → Domains → add `yourpropertyguide.com.au`. AC shows 3 CNAME records (DKIM + tracking). Add them in Cloudflare with proxy OFF (grey cloud). Without this, the nurture emails land in spam and the whole exercise is wasted.

Suggested from-identity: **Andy from Your Property Guide `<andy@yourpropertyguide.com.au>`**.

## Compliance rails (apply to every automation)

- Entry condition on every automation: **tag `ypg-consented` exists** AND contact is on the YPG Property Sellers list. Non-consented contacts exist in AC as CRM records only; they must never receive marketing.
- `ypg-score-do-not-contact` (already listed with an agent): add as an explicit exclusion segment on every send. They get the transactional guide email from the site and nothing else.
- Every email footer: business name (Your Property Guide, a Profit Geeks site), postal contact, unsubscribe link (AC inserts `%UNSUBSCRIBELINK%` automatically in the footer block).

Personalisation tags below use AC's syntax. Verify exact perstag names in the editor (AC derives them from field titles, e.g. `%YPG_SUBURB%`, `%YPG_SELLING_TIMEFRAME%`).

**Design assets for AC templates:** the guide cover art lives at `https://www.yourpropertyguide.com.au/images/guide/selling-guide-cover-email.jpg` (~70KB, email-weight). Brand palette for buttons/links: terracotta `#bd592f`, dark `#953407`, ink `#17100b`, cream `#f6ede2`. Match the transactional emails: warm paper background, Georgia serif headings, one terracotta button per email.

---

## Automation 1 — HOT: appraisal push

**Trigger:** tag `ypg-score-hot` added. **Conditions:** has `ypg-consented`, not `ypg-agent-already-listed`.

| Step | Timing | Action |
|---|---|---|
| 1 | Wait 1 hour | (the site's transactional guide email lands first) |
| 2 | Send Email H1 | |
| 3 | Wait 2 days | exit if goal "replied or clicked appraisal link" met |
| 4 | Send Email H2 | |
| 5 | Wait 3 days | |
| 6 | Notify andy@theandylife.com: "HOT lead finished sequence without booking, call them" | |

**Email H1 — subject: `Your %YPG_SUBURB% appraisal, whenever you're ready`**

> Hi %FIRSTNAME%,
>
> You mentioned you're planning to sell within the next few months, so one practical next step while the guide is fresh: a free appraisal from a top local agent.
>
> It's a 30-minute walkthrough. You get a realistic price range based on recent sales near you, not a website estimate. No listing agreement, no obligation, and your details don't go anywhere until you say so.
>
> [Book my free appraisal] (links to /appraisal?suburb=%YPG_SUBURB%)
>
> If you'd rather keep reading first, chapter 2 of your guide covers how to sanity-check any appraisal an agent gives you.
>
> Andy
> Your Property Guide

**Email H2 — subject: `The 60-day window most sellers miss`**

> Hi %FIRSTNAME%,
>
> A pattern from the data: properties priced right in the first two weeks sell faster and closer to asking. Listings that sit past 60 days end up discounting. The difference is almost always preparation done before the campaign, not during it.
>
> If you're selling inside three months, the clock on that prep has already started. The free appraisal is the quickest way to find out what's worth doing and what isn't.
>
> [Book my free appraisal]
>
> Andy

---

## Automation 2 — WARM: seller nurture (the core sequence)

**Trigger:** tag `ypg-score-warm` added. **Conditions:** `ypg-consented`, not already in Automation 1. **Goal step:** if tag `ypg-score-hot` is later added (they re-enter the funnel hotter), exit and enter Automation 1.

Cadence keyed to the guide chapters. Subjects kept curiosity-plain, no clickbait.

| Day | Email | Subject | Body summary (full copy below) |
|---|---|---|---|
| 2 | W1 | What selling actually costs in your state | Chapter 3 recap + commission calculator link |
| 5 | W2 | Agent commission is negotiable. Most never ask. | Fee negotiation tactics + fees guide link |
| 9 | W3 | The $3,000 weekend, and the renovation that never pays | Chapter 4: high-ROI prep |
| 14 | W4 | Auction or private treaty for %YPG_SUBURB%? | Chapter 6 decision logic + suburb page link |
| 21 | W5 | How to read an agent's appraisal | Chapter 2: conditioning, underquoting, sanity checks |
| 30 | W6 | Ready to compare agents? | Direct appraisal CTA |
| 60+ | — | Move to Automation 3 (monthly) | |

**W1 (Day 2) — subject: `What selling actually costs in your state`**

> Hi %FIRSTNAME%,
>
> Most sellers budget for the agent's commission and forget the rest. The all-in number is usually 3 to 5 percent of your sale price once marketing, conveyancing and prep are counted.
>
> Chapter 3 of your guide breaks it down state by state. If you want your own numbers, the commission calculator does it in 30 seconds with typical rates for your state pre-filled:
>
> [Run my selling costs] (links to /real-estate-commission-calculator)
>
> Andy

**W2 (Day 5) — subject: `Agent commission is negotiable. Most sellers never ask.`**

> Hi %FIRSTNAME%,
>
> There's no legislated commission rate in any Australian state. The rate you pay comes down to your suburb and how well you negotiate.
>
> Two things that work: compare at least three agents on their last 10 sales (not their rate card), and ask each one to justify their fee against those results. An agent who sells $20,000 above the median is cheap at 2.5 percent. A weak negotiator is expensive at 1.8.
>
> The 10 interview questions are in chapter 5 of your guide.
>
> Andy

**W3 (Day 9) — subject: `The $3,000 weekend, and the renovation that never pays`**

> Hi %FIRSTNAME%,
>
> Cleaning, decluttering, gardens and a coat of paint routinely return several times their cost at sale. Kitchens and bathrooms almost never do. Buyers pay for a home they can move into, not for your taste in benchtops.
>
> Chapter 4 has the full list of what pays and what doesn't, including when professional styling is worth it (short version: usually, for homes over $600k).
>
> Andy

**W4 (Day 14) — subject: `Auction or private treaty for %YPG_SUBURB%?`**

> Hi %FIRSTNAME%,
>
> The honest answer depends on your market's clearance rate over the last 90 days, not last year's headlines. Hot market and broad-appeal property: auction creates urgency. Quieter market or unique home: private treaty protects you from a public pass-in.
>
> Chapter 6 has the decision logic. Your suburb's current numbers are here:
>
> [See the %YPG_SUBURB% market] (links to /suburbs/%YPG_SUBURB%)
>
> Andy

**W5 (Day 21) — subject: `How to read an agent's appraisal`**

> Hi %FIRSTNAME%,
>
> An appraisal is an opinion, not a valuation. Some agents quote high to win your listing, then "condition" you down once you've signed. The defence is simple: ask every agent for the three comparable sales behind their number, and get at least three appraisals so the outlier exposes itself.
>
> Chapter 2 covers the traps in detail. When you're ready to put real numbers on it, we can arrange a free appraisal from an agent we'd actually recommend.
>
> Andy

**W6 (Day 30) — subject: `Ready to compare agents?`**

> Hi %FIRSTNAME%,
>
> You've had the guide for a month, which is about when most sellers start talking to agents. If that's you, we can line up a free appraisal from up to three top local agents. You compare them side by side and nothing proceeds without your say-so.
>
> [Get my free appraisal] (links to /appraisal?suburb=%YPG_SUBURB%)
>
> Not there yet? No problem, we'll keep sending the monthly market read and you can pull the trigger whenever.
>
> Andy

---

## Automation 3 — COLD and long-range: monthly market read

**Trigger:** tag `ypg-score-cold` added, OR a contact finishes Automation 2 without converting. **Condition:** `ypg-consented`.

One email a month, sent as a campaign to the segment rather than a fixed automation (the content needs to be fresh). Template: suburb-aware market snapshot using the YPG Suburb field, one guide excerpt, one soft appraisal line in the footer. Re-score: if anyone clicks an appraisal link, add tag `ypg-score-hot` (AC link action), which pulls them into Automation 1.

## Automation 4 — re-engagement (quarterly)

**Trigger:** no opens or clicks in 90 days. Three emails over two weeks: "Still thinking of selling?" / best-of guide content / "Want us to stop emailing?" with a one-click preference. No engagement after that: unsubscribe them automatically. Keeps the list clean and deliverability high.

---

## Open items

1. **DKIM records in Cloudflare** (blocking actual sends): Andy or a Cloudflare API token.
2. Build the four automations above in the AC UI (no public API for this).
3. Decide the monthly market-read production rhythm (the /market-reports content can seed it).
4. When agent partnerships go live, add a webhook automation: HOT lead tagged → notify the covering agent (AC can POST to a webhook; the future agent-routing endpoint can consume it).
