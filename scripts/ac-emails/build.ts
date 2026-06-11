// Generates the ActiveCampaign automation emails as ready-to-paste
// custom-HTML templates, designed to match the transactional emails
// (warm paper, ink heroes, giant stat moments, terracotta CTAs).
//
// Run: npx tsx scripts/ac-emails/build.ts
// Output: emails/activecampaign/*.html
//
// AC specifics baked in:
// - %FIRSTNAME%, %YPG_SUBURB_NAME% (pretty, for copy), %YPG_SUBURB%
//   (slug, for URLs) personalisation tags
// - %SENDER-INFO% and %UNSUBSCRIBELINK% in the footer (required for
//   AC custom HTML; Spam Act sender ID + unsubscribe)
// - All images hosted on the live domain, absolute URLs
import { mkdirSync, writeFileSync } from "node:fs";
import { EMAIL_COLORS as C } from "../../src/lib/email-theme";

const SITE = "https://www.yourpropertyguide.com.au";
const ART = {
  cover:        `${SITE}/images/guide/selling-guide-cover-email.jpg`,
  night:        `${SITE}/images/hero/suburb-night-v2.jpg`,
  queenslander: `${SITE}/images/art/queenslander.jpg`,
  aerial:       `${SITE}/images/art/suburb-aerial.jpg`,
};

const FONT_SANS = `-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;
const FONT_SERIF = `Georgia, 'Times New Roman', serif`;

// ----- building blocks ------------------------------------------------------

function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;"><tr>
    <td style="background:${C.terracotta};border-radius:8px;">
      <a href="${url}" style="display:inline-block;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 30px;font-family:${FONT_SANS};">${label}</a>
    </td></tr></table>`;
}

/**
 * Full-width artwork hero: image bleeds to the card edges with the serif
 * headline beneath. tone="ink" for night/cover art (dark field), tone
 * ="cream" for golden-hour art whose own sky is cream, so the artwork
 * and the headline panel read as one continuous field instead of a
 * picture in a dark frame.
 */
function artHero(img: string, headline: string, sub?: string, tone: "ink" | "cream" = "ink"): string {
  const bg = tone === "ink" ? C.ink : C.cream;
  const fg = tone === "ink" ? "#ffffff" : C.ink;
  const fgSub = tone === "ink" ? "rgba(254,251,247,0.75)" : C.inkMuted;
  const border = tone === "ink" ? "" : `border-bottom:1px solid ${C.line};`;
  return `
  <tr><td style="background:${bg};">
    <img src="${img}" width="600" alt="" style="display:block;width:100%;height:auto;" />
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td align="center" style="padding:26px 40px 30px;background:${bg};${border}">
        <h1 style="margin:0;color:${fg};font-size:27px;line-height:1.22;font-weight:500;font-family:${FONT_SERIF};letter-spacing:-0.2px;">${headline}</h1>
        ${sub ? `<p style="margin:12px 0 0;color:${fgSub};font-size:14.5px;line-height:1.6;font-family:${FONT_SANS};">${sub}</p>` : ""}
      </td></tr></table>
  </td></tr>`;
}

/** Giant editorial stat on cream: the one number this email exists for. */
function statHero(stat: string, label: string, headline: string): string {
  return `
  <tr><td align="center" style="background:${C.cream};padding:44px 40px 40px;border-bottom:1px solid ${C.line};">
    <p style="margin:0;color:${C.terracotta};font-size:64px;line-height:1;font-family:${FONT_SERIF};font-style:italic;letter-spacing:-1px;">${stat}</p>
    <p style="margin:14px 0 0;color:${C.inkMuted};font-size:13px;line-height:1.6;font-family:${FONT_SANS};text-transform:uppercase;letter-spacing:.14em;font-weight:600;">${label}</p>
    <h1 style="margin:22px 0 0;color:${C.ink};font-size:25px;line-height:1.25;font-weight:500;font-family:${FONT_SERIF};">${headline}</h1>
  </td></tr>`;
}

function bodyBlock(paragraphs: string[], cta?: { label: string; url: string }, ps?: string): string {
  const paras = paragraphs
    .map((p) => `<p style="margin:0 0 16px;color:${C.ink};font-size:15px;line-height:1.7;font-family:${FONT_SANS};">${p}</p>`)
    .join("");
  return `
  <tr><td style="padding:30px 40px 8px;">
    ${paras}
  </td></tr>
  ${cta ? `<tr><td align="center" style="padding:10px 40px 8px;">${button(cta.label, cta.url)}</td></tr>` : ""}
  ${ps ? `<tr><td style="padding:18px 40px 8px;"><p style="margin:0;color:${C.inkMuted};font-size:13.5px;line-height:1.65;font-family:${FONT_SANS};"><strong style="color:${C.ink};">P.S.</strong> ${ps}</p></td></tr>` : ""}
  <tr><td style="padding:18px 40px 30px;">
    <p style="margin:0;color:${C.inkMuted};font-size:14px;line-height:1.5;font-family:${FONT_SANS};">Talk soon,<br/><span style="font-family:${FONT_SERIF};font-style:italic;font-size:15px;color:${C.ink};">The team at Your Property Guide</span></p>
  </td></tr>`;
}

interface AcEmail {
  file: string;
  /** For the reference table in the blueprint doc */
  automation: string;
  subject: string;
  preheader: string;
  hero: string;
  body: string;
}

function shell(e: AcEmail): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${e.subject}</title>
</head>
<body style="margin:0;padding:0;background:${C.sunken};">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${e.preheader}${"&#8199;&#847; ".repeat(30)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sunken};">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.paper};border:1px solid ${C.line};border-radius:12px;overflow:hidden;font-family:${FONT_SANS};color:${C.ink};">
        <tr>
          <td style="background:${C.ink};padding:18px 40px;">
            <p style="margin:0;color:${C.apricot};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.22em;font-family:${FONT_SANS};">Your Property Guide</p>
          </td>
        </tr>
        ${e.hero}
        ${e.body}
        <tr>
          <td style="padding:18px 40px;background:${C.cream};border-top:1px solid ${C.line};">
            <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:${C.inkSubtle};font-family:${FONT_SANS};">You're receiving this because you downloaded the free selling guide from <a href="${SITE}" style="color:${C.terracottaDark};">yourpropertyguide.com.au</a> and asked for selling tips and market updates.</p>
            <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:${C.inkSubtle};font-family:${FONT_SANS};">%SENDER-INFO%</p>
            <p style="margin:0;font-size:12px;line-height:1.6;color:${C.inkSubtle};font-family:${FONT_SANS};"><a href="%UNSUBSCRIBELINK%" style="color:${C.terracottaDark};">Unsubscribe</a> any time, one click, actioned immediately.</p>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-size:11px;color:${C.inkSubtle};font-family:${FONT_SANS};">Australian property, in plain English.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

// ----- the emails -----------------------------------------------------------

const APPRAISAL = `${SITE}/appraisal`;
const CALC = `${SITE}/real-estate-commission-calculator`;
const FEES = `${SITE}/guides/real-estate-agent-fees-australia`;
const SUBURB_URL = `${SITE}/suburbs/%YPG_SUBURB%`;

const EMAILS: AcEmail[] = [
  {
    file: "hot-1-appraisal.html",
    automation: "HOT push · 1 hour after tag",
    subject: "What's your place actually worth?",
    preheader: "A 30-minute walkthrough beats every online estimate. Free, no listing agreement, no obligation.",
    hero: artHero(
      ART.queenslander,
      `Medians describe the suburb.<br/>An appraisal describes <em style="font-style:italic;color:${C.terracottaDark};">your place</em>.`,
      undefined,
      "cream",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "You said you're planning to sell soon, so here's the single most useful 30 minutes you can book this week: a free appraisal from a top local agent in %YPG_SUBURB_NAME%.",
        "You get a defensible price range built from real comparable sales near you, not a website estimate. You see what to fix before listing and what to leave alone. And you walk into every agent conversation afterwards already knowing your numbers, which changes who holds the pen.",
        "No listing agreement, no obligation, and nothing is shared without your say-so.",
      ],
      { label: "Book my free appraisal", url: APPRAISAL },
      "In a hurry? Reply with your street address and the word <strong>appraisal</strong> and we'll fast-track it today.",
    ),
  },
  {
    file: "hot-2-60-day-window.html",
    automation: "HOT push · day 3",
    subject: "The 60-day trap (and how to never see it)",
    preheader: "Listings that sit past 60 days end up discounting. The fix happens before you list, not after.",
    hero: statHero("60 days", "The line between a sale and a discount", "Stale listings tell buyers exactly one thing: make a lower offer."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "A pattern that shows up in every market: properties priced right in the first two weeks sell faster and closer to asking. Listings that drift past 60 days get the same question from every buyer, \"what's wrong with it?\", and the answers all cost you money.",
        "The difference is almost never the property. It's the preparation done before the campaign: an honest price range, the right presentation spend, and an agent who can defend the number under pressure.",
        "If you're selling inside three months, the clock on that prep has already started. A free appraisal is the quickest way to find out where you actually stand.",
      ],
      { label: "Put a number on it", url: APPRAISAL },
    ),
  },
  {
    file: "warm-1-costs.html",
    automation: "WARM nurture · day 2",
    subject: "Where the 3 to 5% goes",
    preheader: "Commission, marketing, conveyancing, prep. Run your own numbers in 30 seconds.",
    hero: statHero("3 to 5%", "What selling really costs, all-in", "Most sellers budget for commission and forget the rest."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "On a typical sale the all-in cost runs 3 to 5 percent of your price once you count agent commission, marketing, conveyancing and preparation. Chapter 3 of your guide breaks it down state by state.",
        "If you want your own numbers instead of ranges, the commission calculator takes 30 seconds and comes pre-filled with typical rates for your state:",
      ],
      { label: "Run my selling costs", url: CALC },
    ),
  },
  {
    file: "warm-2-negotiation.html",
    automation: "WARM nurture · day 5",
    subject: "Most sellers never ask. You will.",
    preheader: "Commission is negotiable in every state. Here's the version of the conversation that works.",
    hero: statHero("$1,700+", "What 0.2 to 0.4% off commission is worth on a typical sale", "There is no legislated commission rate in Australia. None."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "The rate you pay an agent comes down to your suburb and how well you negotiate, and most sellers never negotiate at all.",
        "Two moves that work: compare at least three agents on their last ten sales, not their rate card. Then ask each one to justify their fee against those results. An agent who consistently sells $20,000 above the median is cheap at 2.5 percent. A weak negotiator is expensive at 1.8.",
        "The 10 interview questions that expose the difference are in chapter 5 of your guide. The state-by-state rates are here:",
      ],
      { label: "See agent fees by state", url: FEES },
    ),
  },
  {
    file: "warm-3-preparation.html",
    automation: "WARM nurture · day 9",
    subject: "The $3,000 weekend",
    preheader: "Cleaning, gardens, paint: several times their cost at sale. Kitchens and bathrooms: almost never.",
    hero: artHero(
      ART.cover,
      "The cheap fixes outperform the renovation. Every time.",
      "Chapter 4: what pays for itself, and what never does.",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Cleaning, decluttering, gardens and a coat of paint routinely return several times their cost at sale. Kitchens and bathrooms almost never do. Buyers pay for a home they can move into, not for your taste in benchtops.",
        "Chapter 4 of your guide has the full list, including when professional styling is worth it (short version: usually, for homes over $600k).",
        "Ten minutes with it this week could be the best-paid ten minutes of your sale.",
      ],
      { label: "Open my guide", url: `${SITE}/downloads/your-property-guide-selling-a-home-australia.pdf` },
    ),
  },
  {
    file: "warm-4-method.html",
    automation: "WARM nurture · day 14",
    subject: "Auction or private treaty for %YPG_SUBURB_NAME%?",
    preheader: "The honest answer is in your suburb's last 90 days, not last year's headlines.",
    hero: artHero(
      ART.night,
      "Your suburb already knows the answer.",
      "Clearance rates and days on market decide this, not opinions.",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Hot market and broad-appeal property: auction creates urgency and can lift the result. Quieter market or a unique home: private treaty protects you from a public pass-in that buyers never forget.",
        "Chapter 6 of your guide has the decision logic. The current numbers for %YPG_SUBURB_NAME% are on your suburb page:",
      ],
      { label: "See the %YPG_SUBURB_NAME% market", url: SUBURB_URL },
    ),
  },
  {
    file: "warm-5-appraisal-traps.html",
    automation: "WARM nurture · day 21",
    subject: "How to read an agent's appraisal",
    preheader: "Some agents quote high to win the listing, then walk you down. Here's the defence.",
    hero: statHero("3", "Appraisals before you believe any of them", "An appraisal is an opinion. Three opinions expose the outlier."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "The trap is called conditioning: quote high to win your listing, then walk you down once you've signed. The defence is simple and free.",
        "Ask every agent for the three comparable sales behind their number. Get at least three appraisals so the flattering outlier exposes itself. And never sign an agency agreement on appraisal day.",
        "When you're ready to put real numbers on your place, we'll line up a free appraisal from an agent we'd actually recommend:",
      ],
      { label: "Book my free appraisal", url: APPRAISAL },
    ),
  },
  {
    file: "warm-6-ready.html",
    automation: "WARM nurture · day 30",
    subject: "Ready to put a number on it?",
    preheader: "A month with the guide means you'll ask better questions than most sellers ever do.",
    hero: artHero(
      ART.queenslander,
      "You've done the reading. Time for your numbers.",
      undefined,
      "cream",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "You've had the guide for a month, which is about when most sellers start talking to agents. The difference is you'll walk in knowing what selling costs, what's negotiable, and which questions expose an average agent inside five minutes.",
        "If that's you, we'll line up a free appraisal with a top local agent in %YPG_SUBURB_NAME%. You compare, you decide, and nothing proceeds without your say-so.",
        "Not there yet? No problem. The monthly market read keeps coming, and you can pull the trigger whenever.",
      ],
      { label: "Get my free appraisal", url: APPRAISAL },
    ),
  },
  {
    file: "monthly-market-read.html",
    automation: "COLD / long-range · monthly campaign template",
    subject: "Your market this month",
    preheader: "What moved in your patch, in plain English. Two minutes.",
    hero: artHero(
      ART.night,
      "The two-minute market read.",
      "EDIT EACH MONTH: one line on what actually changed.",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "[EDIT: 2-3 sentences on the month: rates decision, clearance trend, listing volumes. Plain English, one idea per sentence, no jargon.]",
        "[EDIT: one suburb-relevant observation, e.g. days on market shifting, spring stock arriving.]",
        "Your suburb's live numbers are always here:",
      ],
      { label: "See the %YPG_SUBURB_NAME% market", url: SUBURB_URL },
      "Thinking about selling this year? A free appraisal puts a real number on your place: <a href=\"" + APPRAISAL + "\" style=\"color:#953407;\">book one here</a>.",
    ),
  },
  {
    file: "reengage-still-thinking.html",
    automation: "Re-engagement · 90 days no engagement",
    subject: "Still thinking of selling?",
    preheader: "One click tells us whether to keep these coming.",
    hero: artHero(
      ART.queenslander,
      "Plans change. Inboxes shouldn't suffer for it.",
      undefined,
      "cream",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "A while back you grabbed our selling guide. If a sale is still somewhere on the horizon, the guide, the calculators and the monthly read will be here when you need them.",
        "If life went a different way, no hard feelings, the unsubscribe link below works instantly and we won't take it personally.",
        "And if you're actually closer than you were? That's the best email we get all week:",
      ],
      { label: "Book a free appraisal", url: APPRAISAL },
    ),
  },
];

// ----- emit -----------------------------------------------------------------

const OUT = "emails/activecampaign";
mkdirSync(OUT, { recursive: true });
for (const e of EMAILS) {
  writeFileSync(`${OUT}/${e.file}`, shell(e));
  console.log(`${e.file}  ·  ${e.automation}  ·  "${e.subject}"`);
}
console.log(`\n${EMAILS.length} templates written to ${OUT}/`);
