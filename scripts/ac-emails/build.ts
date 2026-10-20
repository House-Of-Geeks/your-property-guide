// Generates the ActiveCampaign automation emails as ready-to-paste
// custom-HTML templates, designed to match the transactional emails
// ("Clear decisions", 20 Oct 2026: cream page, warm white card, sand
// panels, fine rules, serif headings, one forest-green button).
//
// Run: npx tsx scripts/ac-emails/build.ts
// Output: emails/activecampaign/*.html (every file there comes from here;
// don't hand-edit them)
//
// AC specifics baked in:
// - %FIRSTNAME%, %YPG_SUBURB_NAME% (pretty, for copy), %YPG_SUBURB%
//   (slug, for URLs) personalisation tags
// - %SENDER-INFO% and %UNSUBSCRIBELINK% in the footer (required for
//   AC custom HTML; Spam Act sender ID + unsubscribe)
// - All images hosted on the live domain, absolute URLs
import { mkdirSync, writeFileSync } from "node:fs";
import { EMAIL_COLORS as C, EMAIL_FONTS, EMAIL_SIGNOFF_LINE, emailBrandLockup } from "../../src/lib/email-theme";
import { GUIDE_BOOKS, type GuideBookId } from "../../src/lib/guide-books";

const SITE = "https://www.yourpropertyguide.com.au";
const ART = {
  night:        `${SITE}/images/hero/suburb-night-v2.jpg`,
  queenslander: `${SITE}/images/art/queenslander.jpg`,
  aerial:       `${SITE}/images/art/suburb-aerial.jpg`,
};

const FONT_SANS = EMAIL_FONTS.sans;
const FONT_SERIF = EMAIL_FONTS.serif;

/** "chapter 3, “The real cost of selling”": chapters by their titles in GUIDE_BOOKS. */
function ch(id: GuideBookId, n: number, word: "chapter" | "Chapter" = "chapter"): string {
  return `${word} ${n}, “${GUIDE_BOOKS[id].chapters[n - 1].title}”`;
}
/** "chapter 3 of your guide, “The real cost of selling”". */
function chg(id: GuideBookId, n: number, word: "chapter" | "Chapter" = "chapter"): string {
  return `${word} ${n} of your guide, “${GUIDE_BOOKS[id].chapters[n - 1].title}”`;
}
const title = (id: GuideBookId, n: number) => GUIDE_BOOKS[id].chapters[n - 1].title;

// ----- building blocks ------------------------------------------------------

/** The one button: forest green, cream text, 4px corners. */
function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;"><tr>
    <td style="background:${C.forest};border-radius:4px;">
      <a href="${url}" style="display:inline-block;color:${C.cream};text-decoration:none;font-size:15px;font-weight:600;padding:14px 30px;border-radius:4px;font-family:${FONT_SANS};">${label}</a>
    </td></tr></table>`;
}

function label(text: string, margin = "0 0 12px"): string {
  return `<p style="margin:${margin};color:${C.copper};font-size:12px;line-height:1.5;font-family:${FONT_SANS};text-transform:uppercase;letter-spacing:.1em;font-weight:600;">${text}</p>`;
}

function headline(text: string, size = 26, margin = "0"): string {
  return `<h1 style="margin:${margin};color:${C.ink};font-size:${size}px;line-height:1.24;font-weight:400;font-family:${FONT_SERIF};letter-spacing:-0.2px;">${text}</h1>`;
}

/** Full-width artwork, then the serif headline on the card beneath it. */
function artHero(img: string, head: string, sub?: string): string {
  return `
  <tr><td style="background:${C.paper};border-bottom:1px solid ${C.line};">
    <img src="${img}" width="600" alt="" style="display:block;width:100%;height:auto;border:0;" />
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td align="center" style="padding:26px 40px 30px;">
        ${headline(head, 27)}
        ${sub ? `<p style="margin:12px 0 0;color:${C.inkMuted};font-size:14.5px;line-height:1.6;font-family:${FONT_SANS};">${sub}</p>` : ""}
      </td></tr></table>
  </td></tr>`;
}

/** The guide's cover on a sand panel, framed by a fine rule. */
function coverHero(id: GuideBookId, head: string, sub?: string): string {
  const book = GUIDE_BOOKS[id];
  return `
  <tr><td align="center" style="background:${C.sand};padding:32px 40px 30px;border-bottom:1px solid ${C.line};">
    <img src="${SITE}${book.coverEmail}" width="200" alt="${book.title}" style="display:block;width:200px;max-width:60%;height:auto;border:1px solid ${C.line};margin:0 auto 22px;" />
    ${label(book.name)}
    ${headline(head, 26)}
    ${sub ? `<p style="margin:12px 0 0;color:${C.inkMuted};font-size:14.5px;line-height:1.6;font-family:${FONT_SANS};">${sub}</p>` : ""}
  </td></tr>`;
}

/** One figure on a sand panel: the number this email is about. */
function statHero(stat: string, statLabel: string, head: string): string {
  return `
  <tr><td align="center" style="background:${C.sand};padding:40px 40px 36px;border-bottom:1px solid ${C.line};">
    <p style="margin:0;color:${C.ink};font-size:56px;line-height:1;font-weight:400;font-family:${FONT_SERIF};letter-spacing:-1px;">${stat}</p>
    ${label(statLabel, "14px 0 0")}
    ${headline(head, 24, "20px 0 0")}
  </td></tr>`;
}

/** A label and a headline on a sand panel, for emails without artwork. */
function textHero(head: string, eyebrow?: string): string {
  return `
  <tr><td align="center" style="background:${C.sand};padding:40px 40px 34px;border-bottom:1px solid ${C.line};">
    ${eyebrow ? label(eyebrow, "0 0 12px") : ""}
    ${headline(head, 27)}
  </td></tr>`;
}

function paragraph(p: string, margin = "0 0 16px"): string {
  return `<p style="margin:${margin};color:${C.ink};font-size:15px;line-height:1.7;font-family:${FONT_SANS};">${p}</p>`;
}

function signOff(line: string): string {
  return `
  <tr><td style="padding:18px 40px 30px;">
    <p style="margin:0;color:${C.inkMuted};font-size:14px;line-height:1.5;font-family:${FONT_SANS};">${line}<br/><span style="font-family:${FONT_SERIF};font-size:16px;color:${C.ink};">The team at Your Property Guide</span></p>
  </td></tr>`;
}

function bodyBlock(paragraphs: string[], cta?: { label: string; url: string }, ps?: string, closing = "Talk soon,"): string {
  return `
  <tr><td style="padding:30px 40px 8px;">
    ${paragraphs.map((p) => paragraph(p)).join("")}
  </td></tr>
  ${cta ? `<tr><td align="center" style="padding:10px 40px 8px;">${button(cta.label, cta.url)}</td></tr>` : ""}
  ${ps ? `<tr><td style="padding:18px 40px 8px;"><p style="margin:0;color:${C.inkMuted};font-size:14px;line-height:1.65;font-family:${FONT_SANS};"><strong style="color:${C.ink};">P.S.</strong> ${ps}</p></td></tr>` : ""}
  ${signOff(closing)}`;
}

/** An intro line, then numbered sections (title + note), then one button. */
function listBlock(intro: string, items: Array<[string, string]>, cta: { label: string; url: string }): string {
  const rows = items
    .map(
      ([head, note], i) => `
    <p style="margin:0 0 4px;color:${C.ink};font-size:17px;line-height:1.4;font-weight:400;font-family:${FONT_SERIF};">${i + 1}. ${head}</p>
    <p style="margin:0 0 ${i === items.length - 1 ? 8 : 20}px;color:${C.inkMuted};font-size:14px;line-height:1.65;font-family:${FONT_SANS};">${note}</p>`,
    )
    .join("");
  return `
  <tr><td style="padding:30px 40px 4px;">
    ${paragraph(intro, "0 0 22px")}
    ${rows}
  </td></tr>
  <tr><td align="center" style="padding:18px 40px 8px;">${button(cta.label, cta.url)}</td></tr>
  ${signOff("Talk soon,")}`;
}

interface AcEmail {
  file: string;
  /** For the reference table in the blueprint doc */
  automation: string;
  subject: string;
  preheader: string;
  hero: string;
  body: string;
  /** Varies the compliance footer; defaults to seller. */
  audience?: "seller" | "buyer";
}

function shell(e: AcEmail): string {
  const buyer = e.audience === "buyer";
  const guide = GUIDE_BOOKS[buyer ? "buying" : "selling"].name;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${e.subject}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${e.preheader}${"&#8199;&#847; ".repeat(30)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.paper};border:1px solid ${C.line};border-radius:4px;overflow:hidden;font-family:${FONT_SANS};color:${C.ink};">
        <tr>
          <td style="background:${C.paper};padding:20px 40px;border-bottom:1px solid ${C.line};">
            ${emailBrandLockup()}
          </td>
        </tr>
        ${e.hero}
        ${e.body}
        <tr>
          <td style="padding:18px 40px;background:${C.sand};border-top:1px solid ${C.line};">
            <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:${C.inkMuted};font-family:${FONT_SANS};">You’re receiving this because you downloaded ${guide}, our free ${buyer ? "buying" : "selling"} guide, from <a href="${SITE}" style="color:${C.copper};">yourpropertyguide.com.au</a> and asked for ${buyer ? "buying" : "selling"} tips and market updates.</p>
            <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:${C.inkMuted};font-family:${FONT_SANS};">%SENDER-INFO%</p>
            <p style="margin:0;font-size:12px;line-height:1.6;color:${C.inkMuted};font-family:${FONT_SANS};"><a href="%UNSUBSCRIBELINK%" style="color:${C.copper};">Unsubscribe</a> any time, one click, actioned immediately.</p>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-size:13px;color:${C.inkMuted};font-family:${FONT_SERIF};">${EMAIL_SIGNOFF_LINE}</p>
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
const SELLING_PDF = `${SITE}/downloads/your-property-guide-selling-a-home-australia.pdf`;
const BUYING_PDF = `${SITE}/downloads/your-property-guide-buying-property-australia.pdf`;
const GUIDES = `${SITE}/guides`;
const LINK = `style="color:${C.copper};"`;

const EMAILS: AcEmail[] = [
  {
    file: "hot-1-appraisal.html",
    automation: "HOT push · 1 hour after tag",
    subject: "What’s your place actually worth?",
    preheader: "A 30-minute walkthrough tells you more than an online estimate. Free, with no listing agreement and no obligation.",
    hero: artHero(
      ART.queenslander,
      `Medians describe the suburb.<br/>An appraisal describes <em style="font-style:italic;">your place</em>.`,
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "You said you’re planning to sell soon, so here’s a useful 30 minutes to book this week: a free appraisal from one participating local agent who covers %YPG_SUBURB_NAME%, where we have one.",
        "You get a price range built from comparable sales near you, not a website estimate. You see what’s worth fixing before you list and what to leave alone. And you go into every conversation with an agent afterwards already knowing your numbers.",
        "No listing agreement, no obligation, and nothing is shared without your say-so.",
      ],
      { label: "Ask for a free appraisal", url: APPRAISAL },
      "Prefer email? Reply with your street address and we’ll get back to you within one business day.",
    ),
  },
  {
    file: "hot-2-60-day-window.html",
    automation: "HOT push · day 3",
    subject: "Why the first weeks of a listing matter",
    preheader: "Buyers pay most attention to a new listing. The preparation you do before you list is what counts.",
    hero: statHero("60 days", "When buyers start asking why a listing hasn’t sold", "A long time on the market tends to invite lower offers."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Properties priced realistically from the start tend to sell faster and closer to the asking price. Listings that stay on the market past about 60 days often get the same question from buyers, “what’s wrong with it?”, and that usually means lower offers.",
        "Market conditions play a part. So does the preparation done before the sale campaign starts: a price range backed by comparable sales, sensible spending on presentation, and an agent who can explain the price to buyers.",
        "If you’re selling within three months, now is the time to prepare. A free appraisal is a quick way to see where your property sits.",
      ],
      { label: "Put a number on it", url: APPRAISAL },
    ),
  },
  {
    file: "warm-1-costs.html",
    automation: "WARM nurture · day 2",
    subject: "Where the 3 to 5% goes",
    preheader: "Commission, marketing, conveyancing, prep. Run your own numbers in 30 seconds.",
    hero: statHero("3 to 5%", "What selling really costs, all-in", "Commission is the biggest cost, but not the only one."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        `On a typical sale the all-in cost runs 3 to 5 percent of your price once you count agent commission, marketing, conveyancing and preparation. ${chg("selling", 3, "Chapter")}, breaks it down state by state.`,
        "If you want your own numbers instead of ranges, the commission calculator takes 30 seconds and comes pre-filled with typical rates for your state:",
      ],
      { label: "Run my selling costs", url: CALC },
    ),
  },
  {
    file: "warm-2-negotiation.html",
    automation: "WARM nurture · day 5",
    subject: "Commission is negotiable. Here’s how to ask.",
    preheader: "There’s no legislated commission rate in Australia. Compare agents on evidence, then talk about the fee.",
    hero: statHero("$1,700+", "What 0.2 to 0.4% off commission is worth on a typical sale", "There’s no legislated commission rate in Australia."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "The rate you pay an agent depends on your area, the agent and the conversation you have about it. Many sellers never ask.",
        "Two things help. Compare at least three agents on their recent sales, not only their rate card. Then ask each one to explain their fee against those results. A lower rate isn’t always a lower cost: what matters is the price achieved and what you keep after fees.",
        `The questions to ask each agent are in ${chg("selling", 5)}. The state-by-state rates are here:`,
      ],
      { label: "See agent fees by state", url: FEES },
    ),
  },
  {
    file: "warm-3-preparation.html",
    automation: "WARM nurture · day 9",
    subject: "What’s worth fixing before you sell",
    preheader: "Cleaning, the garden and paint often return more than they cost. Kitchen and bathroom renovations rarely do.",
    hero: coverHero(
      "selling",
      "Small fixes usually return more than big renovations.",
      `${ch("selling", 4, "Chapter")}, covers the work worth doing, and what may be better left alone.`,
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Cleaning, decluttering, tidying the garden and a coat of paint often return more than they cost at sale. Kitchen and bathroom renovations rarely do. Most buyers want a home they can move straight into.",
        `${chg("selling", 4, "Chapter")}, has the full list, including when professional styling is worth considering (usually for homes over $600k).`,
        "It’s a ten-minute read.",
      ],
      { label: "Open my guide", url: SELLING_PDF },
    ),
  },
  {
    file: "warm-4-method.html",
    automation: "WARM nurture · day 14",
    subject: "Auction or private treaty for %YPG_SUBURB_NAME%?",
    preheader: "The honest answer is in your suburb’s last 90 days, not last year’s headlines.",
    hero: artHero(
      ART.night,
      "Your suburb’s recent sales are the place to start.",
      "Clearance rates and days on market tell you more than opinions do.",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "In a strong market, a property with broad appeal can suit auction, which gives buyers a deadline. In a quieter market, or for an unusual home, private treaty avoids a public pass-in.",
        `${chg("selling", 6, "Chapter")}, walks through the decision. The current numbers for %YPG_SUBURB_NAME% are on your suburb page:`,
      ],
      { label: "See the %YPG_SUBURB_NAME% market", url: SUBURB_URL },
    ),
  },
  {
    file: "warm-5-appraisal-traps.html",
    automation: "WARM nurture · day 21",
    subject: "How to read an agent’s appraisal",
    preheader: "An appraisal is an opinion. Here’s how to check the evidence behind it.",
    hero: statHero("3", "Appraisals to compare before you decide", "An appraisal is an opinion. Comparing three shows you the outlier."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Some agents quote a high figure to secure a listing, then suggest a lower price once the agreement is signed. It’s sometimes called conditioning, and it’s easy to check for.",
        "Ask every agent for the comparable sales behind their figure. Get at least three appraisals, so an outlier stands out. And take the agency agreement home to read before you sign.",
        "When you’re ready, we can introduce you to one participating local agent for a free appraisal:",
      ],
      { label: "Ask for a free appraisal", url: APPRAISAL },
    ),
  },
  {
    file: "warm-6-ready.html",
    automation: "WARM nurture · day 30",
    subject: "Ready to put a number on it?",
    preheader: "You’ve had the guide for a month. Here’s a sensible next step.",
    hero: artHero(ART.queenslander, "You’ve done the reading. Time for your numbers."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "You’ve had the guide for a month, which is about when many sellers start talking to agents. You’ll go in knowing what selling costs, what’s negotiable and which questions to ask.",
        "If that’s you, we can introduce you to one participating local agent who covers %YPG_SUBURB_NAME% for a free appraisal, where we have one. You decide, and nothing goes ahead without your say-so.",
        "Not there yet? That’s fine. The guide and the tools are there whenever you need them.",
      ],
      { label: "Ask for a free appraisal", url: APPRAISAL },
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
        "Your suburb’s live numbers are always here:",
      ],
      { label: "See the %YPG_SUBURB_NAME% market", url: SUBURB_URL },
      `Thinking about selling this year? A free appraisal puts a real number on your place: <a href="${APPRAISAL}" ${LINK}>ask for one here</a>.`,
    ),
  },
  {
    file: "reengage-still-thinking.html",
    automation: "Re-engagement · 90 days no engagement",
    subject: "Still thinking of selling?",
    preheader: "One click tells us whether to keep these coming.",
    hero: artHero(ART.queenslander, "Plans change. Inboxes shouldn’t suffer for it."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "A while back you downloaded our selling guide. If a sale is still somewhere on the horizon, the guide and the calculators will be here when you need them.",
        "If life went a different way, no hard feelings. The unsubscribe link below works straight away.",
        "And if you’re closer to selling than you were, a free appraisal is a sensible next step:",
      ],
      { label: "Ask for a free appraisal", url: APPRAISAL },
    ),
  },
  {
    file: "reengage-2-best-of.html",
    automation: "Re-engagement · second email",
    subject: "The three sections sellers reopen most",
    preheader: "Costs, appraisals, and auction or private treaty. The most useful parts, in one place.",
    hero: textHero("If you reopen the guide for three things, make it these.", "Worth rereading"),
    body: listBlock(
      "Hi %FIRSTNAME%, it’s been a little while. If selling is still on the cards, these are the three sections sellers find most useful.",
      [
        [title("selling", 3), "The all-in figure is usually 3 to 5 percent once marketing, conveyancing and preparation are counted. The commission calculator works out your own figure in 30 seconds."],
        [title("selling", 2), "An appraisal is an opinion, not a valuation. Get three, ask for the comparable sales behind each, and an outlier stands out."],
        [title("selling", 6), "The right method depends on your property and on your suburb’s clearance rate over the last 90 days. The chapter walks through the decision."],
      ],
      { label: "Reopen the guide", url: GUIDES },
    ),
  },
  {
    file: "reengage-3-stop.html",
    automation: "Re-engagement · third email",
    subject: "Want us to stop emailing?",
    preheader: "No guilt either way. One click sorts it.",
    hero: textHero("Should we keep these coming?"),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "We’d rather send fewer emails to the right people than more to everyone, so here’s a fair question: are these still useful to you?",
        "If a sale is still on your radar, even loosely, these emails are worth keeping. One tap of the button tells us you’re still interested.",
        "If they’ve run their course, no hard feelings at all. The unsubscribe link at the bottom is one click and takes effect straight away.",
      ],
      { label: "Yes, keep these coming", url: GUIDES },
      undefined,
      "Either way, thanks for having us in your inbox.",
    ),
  },
  // ----- buyer suite ---------------------------------------------------------
  {
    file: "buyer-hot-1-strong-seat.html",
    automation: "BUYER HOT push · 1 hour after tag",
    subject: "Finance sorted? Here’s what to read next",
    preheader: "Pre-approved and buying soon. Two chapters cover how homes are sold and how to make an offer.",
    audience: "buyer",
    hero: artHero(ART.queenslander, "Finance sorted. Timeline set.<br/>Here’s what comes next."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Pre-approved and buying within three months, you’re ready to act when the right place comes up. Before you do, it helps to understand how homes are marketed and sold.",
        `Two chapters are worth reading now. ${ch("buying", 6, "Chapter")}, explains price guides, open homes, auctions and off-market sales, and how to respond to each. ${ch("buying", 7, "Chapter")}, covers what to put in writing, which conditions protect you, and when to walk away.`,
        "The selling agent acts for the seller, so keep your budget and your deadline to yourself. Read those two chapters before your next inspection.",
      ],
      { label: "Open my buying guide", url: BUYING_PDF },
      "Found a place already? Reply with the listing link and we’ll tell you what we’d check first.",
    ),
  },
  {
    file: "buyer-hot-2-preapproval-clock.html",
    automation: "BUYER HOT push · day 3",
    subject: "Your pre-approval has a use-by date",
    preheader: "Most expire in about 90 days. A 12-week plan helps you use that time well.",
    audience: "buyer",
    hero: statHero("90 days", "The life of a typical pre-approval", "A plan makes that time easier to use."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Most pre-approvals expire after about 90 days, and re-applying means fresh paperwork and a fresh credit check. That’s not a reason to rush a purchase. It is a reason to have a plan.",
        `${chg("buying", 10, "Chapter")}, is a printable plan: when to settle on a shortlist, when to order building and pest, when the conveyancer reviews the contract, and what happens between offer and keys.`,
        "Print it and keep it on the fridge, so you always know what comes next.",
      ],
      { label: "Get the 12-week timeline", url: BUYING_PDF },
    ),
  },
  {
    file: "buyer-warm-1-real-budget.html",
    automation: "BUYER WARM nurture · day 2",
    subject: "What you can really spend (it isn’t the bank’s number)",
    preheader: "Lenders test your loan at 3% above the real rate. Run your true number in 30 seconds.",
    audience: "buyer",
    hero: statHero("+3%", "The buffer lenders add to your rate before saying yes", "Your real budget is what passes the stress test, not the calculator headline."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "When a lender assesses you, they don’t test the loan at today’s rate. They add a buffer, around 3 percent, and check you’d still cope. That’s the gap between the number a portal calculator shows you and the number a bank will actually approve.",
        `${chg("buying", 2, "Chapter")}, walks through the whole equation: the buffer, the deposit tiers, lenders mortgage insurance, and the upfront costs that are easy to miss.`,
        "For your own number, the borrowing power calculator applies the buffer properly:",
      ],
      { label: "Run my real budget", url: `${SITE}/borrowing-power-calculator` },
    ),
  },
  {
    file: "buyer-warm-2-schemes.html",
    automation: "BUYER WARM nurture · day 5",
    subject: "First home schemes and concessions: the 2026 settings",
    preheader: "5% deposit with no LMI, shared equity, super savings, state grants. Check which apply to you.",
    audience: "buyer",
    hero: statHero("5%", "The deposit that skips LMI under the 2026 federal scheme", "Check what you’re eligible for before you set your budget."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Since October 2025 the federal 5% Deposit Scheme has no income test and no place caps, just city price caps ($1.5m in Sydney, $1m in Brisbane, $950k in Melbourne). Used well, it avoids lenders mortgage insurance entirely, which is worth $15,000 to $30,000 on a typical purchase.",
        "Add the state schemes, such as first home owner grants and stamp duty concessions, and the First Home Super Saver scheme, and the total can run to tens of thousands. Upgrading or investing? Chapter 3 flags which concessions still apply to you, because a few do.",
        `The full 2026 table, state by state, is in ${chg("buying", 3)}:`,
      ],
      { label: "See what I qualify for", url: BUYING_PDF },
    ),
  },
  {
    file: "buyer-warm-3-underquoting.html",
    automation: "BUYER WARM nurture · day 9",
    subject: "The price guide is not the price",
    preheader: "Auction guides routinely finish 5 to 10% over. Here’s how to read the real number.",
    audience: "buyer",
    hero: statHero("5–10%", "How far auction results routinely run past the guide", "A price guide is a starting point. Comparable sales are the evidence."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "A price guide is part of the marketing, and underquoting rules still leave room for a guide to sit below the likely price. The check is simple: pull the three most comparable sales from the last 90 days and form your own view of the price before you get attached.",
        `${chg("buying", 6, "Chapter")}, shows the method step by step, plus how auction day works: the opening bid, what a vendor bid means, and what happens after a pass-in.`,
        "Your suburb’s recent sales and days on market are free on the site, any suburb, any time.",
      ],
      { label: "How to read a price guide", url: BUYING_PDF },
    ),
  },
  {
    file: "buyer-warm-4-suburb-homework.html",
    automation: "BUYER WARM nurture · day 14",
    subject: "Shortlisting suburbs? Start with the data.",
    preheader: "Median, growth, schools, walkability, hazards. Line up any two suburbs side by side, free.",
    audience: "buyer",
    hero: artHero(
      ART.night,
      "Choose the suburb first.<br/>Then the house.",
      "Growth, schools, hazard maps and the numbers behind them.",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "A costly mistake in property isn’t paying 2 percent too much for the right house. It’s buying in the wrong suburb. You can renovate a house; you can’t move the street.",
        `${chg("buying", 4, "Chapter")}, lists the data that helps you compare areas: school catchments, days on market, owner-occupier ratios and hazard overlays. All of it is free on the site for 9,600+ suburbs.`,
        "Two tools help: the 4-question suburb quiz scores six matches for you, and the compare tool lines any two suburbs up side by side.",
      ],
      { label: "Compare my shortlist", url: `${SITE}/compare` },
      `Already set on %YPG_SUBURB_NAME%? The live numbers are here: <a href="${SITE}/suburbs/%YPG_SUBURB%" ${LINK}>your suburb page</a>.`,
    ),
  },
  {
    file: "buyer-warm-5-inspection.html",
    automation: "BUYER WARM nurture · day 21",
    subject: "Why a building and pest inspection is worth it",
    preheader: "A few hundred dollars before you buy can uncover repairs that cost far more.",
    audience: "buyer",
    hero: statHero("$600", "What a building and pest inspection costs, roughly", "A small cost next to the problems it can find."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "Structural movement, termites, water getting in, old wiring: the expensive problems are often the ones a 30-minute walkthrough won’t show you. A building and pest report costs a few hundred dollars and can surface five-figure repairs before they become yours.",
        `${chg("buying", 5, "Chapter")}, covers the method: what to check yourself in 30 minutes, when to order the formal report, which strata records to read for units, and which findings are worth negotiating on and which are reasons to walk away.`,
        "Read it before your next Saturday of opens.",
      ],
      { label: "Read the inspection chapter", url: BUYING_PDF },
    ),
  },
  {
    file: "buyer-warm-6-ready.html",
    automation: "BUYER WARM nurture · day 30",
    subject: "Ready for the next step?",
    preheader: "You’ve had the guide for a month. Finance is usually the next step.",
    audience: "buyer",
    hero: coverHero("buying", "You’ve done the reading. Time to line up your numbers."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "You’ve had the guide for a month. By now you know what you can really spend, which schemes apply to you, and how homes are marketed and sold.",
        "The next step is finance. If you haven’t started, a mortgage broker is usually paid by the lender, not you, and compares many lenders at once. Our guide covers what a broker does and what to ask before you sign up with one.",
        "Not there yet? That’s fine. The guide and the tools are there whenever you need them.",
      ],
      { label: "How to choose a broker", url: `${SITE}/guides/how-to-choose-a-mortgage-broker` },
    ),
  },
  {
    file: "buyer-monthly-market-read.html",
    automation: "BUYER COLD / long-range · monthly campaign template",
    subject: "Your market this month",
    preheader: "What moved in your patch, in plain English. Two minutes.",
    audience: "buyer",
    hero: artHero(
      ART.night,
      "The two-minute market read.",
      "EDIT EACH MONTH: one line on what actually changed.",
    ),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "[EDIT: 2-3 sentences on the month: rates decision, clearance trend, listing volumes. Plain English, one idea per sentence, no jargon.]",
        "[EDIT: one buyer-relevant observation, e.g. stock levels shifting, days on market lengthening = more room to negotiate.]",
        "Your suburb’s live numbers are always here:",
      ],
      { label: "See the %YPG_SUBURB_NAME% market", url: SUBURB_URL },
      `Getting close? The borrowing power calculator applies the lender buffer properly: <a href="${SITE}/borrowing-power-calculator" ${LINK}>run your number</a>.`,
    ),
  },
  {
    file: "buyer-reengage-still-looking.html",
    automation: "BUYER re-engagement · 90 days no engagement",
    subject: "Still looking?",
    preheader: "One click tells us whether to keep these coming.",
    audience: "buyer",
    hero: artHero(ART.queenslander, "Plans change. Inboxes shouldn’t suffer for it."),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "A while back you downloaded our buying guide. If the right place is still out there somewhere, the guide, the calculators and the suburb data will be here when you need them.",
        "If life went a different way, no hard feelings. The unsubscribe link below works straight away.",
        "And if you’re closer than you were, start with your real budget:",
      ],
      { label: "Run my borrowing power", url: `${SITE}/borrowing-power-calculator` },
    ),
  },
  {
    file: "buyer-reengage-2-best-of.html",
    automation: "BUYER re-engagement · second email",
    subject: "The three sections buyers reopen most",
    preheader: "Your real budget, the 2026 schemes, and reading a price guide. The most useful parts, together.",
    audience: "buyer",
    hero: textHero("If you reopen the guide for three things, make it these.", "Worth rereading"),
    body: listBlock(
      "Hi %FIRSTNAME%, it’s been a little while. If a move is still on the cards, these are the three sections buyers find most useful.",
      [
        [title("buying", 2), "Lenders test your loan at around 3 percent above the real rate, so the bank’s pre-approval isn’t necessarily a comfortable number. The borrowing power calculator shows the figure you can live with."],
        [title("buying", 3), "5 percent deposits with no LMI, shared equity, super savings and state grants. Many buyers don’t realise they qualify."],
        [title("buying", 6), "Auction guides routinely finish 5 to 10 percent over. The chapter shows how to check a price against comparable sales before you get attached to a listing."],
      ],
      { label: "Reopen the guide", url: GUIDES },
    ),
  },
  {
    file: "buyer-reengage-3-stop.html",
    automation: "BUYER re-engagement · third email",
    subject: "Want us to stop emailing?",
    preheader: "No guilt either way. One click sorts it.",
    audience: "buyer",
    hero: textHero("Should we keep these coming?"),
    body: bodyBlock(
      [
        "Hi %FIRSTNAME%,",
        "We’d rather send fewer emails to the right people than more to everyone, so here’s a fair question: are these still useful to you?",
        "If a move is still on your radar, even loosely, these emails and the buying tips are worth keeping. One tap of the button tells us you’re still interested.",
        "If the search is on hold or done, no hard feelings at all. The unsubscribe link at the bottom is one click and takes effect straight away.",
      ],
      { label: "Yes, keep these coming", url: GUIDES },
      undefined,
      "Either way, thanks for having us in your inbox.",
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
