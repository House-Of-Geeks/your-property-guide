import type { BlogPost } from "@/types";
import { AUSTRALIAN_STATES } from "@/lib/utils/stamp-duty";
import { HG_DATES, HG_MIN_DEPOSIT_PCT, HG_NO_OWNERSHIP_YEARS, HG_PREAPPROVAL_DAYS, HG_SINGLE_PARENT_SELL_WEEKS, hgCapSentence } from "@/lib/data/home-guarantee";
import { HTB_INCOME_LIMITS, HTB_SHARE, HTB_MIN_DEPOSIT_PCT, HTB_YEAR, SHARED_EQUITY_SCHEMES } from "@/lib/data/help-to-buy";
import { FHSS_ANNUAL_LIMIT, FHSS_TOTAL_LIMIT } from "@/lib/data/fhss";
import { CLOSED_SCHEMES, FIRST_HOME_DUTY, FIRST_HOME_GRANTS, fmt, grantSentence, longDate, type DutyRelief } from "@/lib/data/first-home-grants";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";
import type { AustralianState } from "@/lib/utils/stamp-duty";

// Corrected 11 Oct 2026 (commercial-intent review 10 Oct 2026, buying 0.1 row
// 15): every state grant and duty line now comes from
// src/lib/data/first-home-grants.ts and the stamp duty engine, and the
// federal figures from their data files. A 301 to /first-home-buyers is the
// owner's call and has not been made.
const fhDuty = (d: DutyRelief) =>
  `<li><strong>Stamp duty${d.covers === "none" ? "" : ` (${d.scheme})`}:</strong> ${[d.rule, d.note].filter(Boolean).join(" ").replace(/\.$/, "")} (<a href="${d.source.href}">${d.source.label.split(":")[0]}</a>, read ${longDate(d.checkedOn)}).</li>`;
const fhGrant = (st: AustralianState) => `<li><strong>Grant:</strong> ${grantSentence(st).replace(/\(([^)]*), read ([^)]*)\)\.$/, (_, office, date) => `(<a href="${FIRST_HOME_GRANTS[st].source.href}">${office}</a>, read ${date}).`)}</li>`;
const fhShared = (st: AustralianState) =>
  SHARED_EQUITY_SCHEMES.filter((x) => x.state === st)
    .map((x) => `<li><strong>${x.name}:</strong> ${x.status === "closed" ? x.statusNote : `${x.terms}. ${x.statusNote}`} (<a href="${x.source.href}">${x.source.label.split(":")[0]}</a>)</li>`)
    .join("\n");
const fhState = (st: AustralianState, extra = "") => `<ul>
${fhGrant(st)}
${fhDuty(FIRST_HOME_DUTY[st])}
${fhShared(st)}${extra ? `\n${extra}` : ""}
</ul>`;
const FHBC = CLOSED_SCHEMES.find((c) => c.name === "First Home Buyer Choice")!;
const QLD_STACK = money(FIRST_HOME_GRANTS.QLD.amount! + dutyFor("QLD", 700_000, "owner").total);

export const post: BlogPost = {
  id: "blog-fhb-schemes-state-2026",
  slug: "first-home-buyer-schemes-by-state-australia-2026",
  title: "First Home Buyer Schemes by State: The Complete 2026 Guide",
  excerpt:
    "Every Australian state and territory has its own first home buyer grant and stamp duty rules, and they stack with the federal schemes. The state-by-state breakdown for 2026, each figure sourced and dated.",
  content: `<p><em><strong>Correction, 11 October 2026:</strong> earlier versions of this article (published 6 May 2026, updated 7 October 2026) said NSW's First Home Buyer Choice and Shared Equity Home Buyer Helper were open (they closed on 1 July 2023 and 30 June 2024), gave Victoria a $20,000 regional grant (it ended on 30 June 2021), Queensland's first home concession a $550,000 limit, WA's exemption a $450,000 limit, SA's grant a $650,000 cap, Tasmania a $30,000 grant and a 50% concession, the ACT an income test, and the NT a First Home Owner Discount, and called HomeSeeker SA a shared equity scheme. None of that is current. The state sections below now come from each revenue office's own pages, read on 10 and 11 October 2026, and the savings estimates we could not source are gone.</em></p>

<p>First home buying in Australia in 2026 is heavily government-supported. Federal schemes administered through Housing Australia layer with state grants, stamp duty relief and shared equity programs. In Queensland, for example, an eligible first home buyer of a $700,000 new home gets the ${fmt(FIRST_HOME_GRANTS.QLD.amount!)} grant and pays no transfer duty, worth ${QLD_STACK} between them, before any federal scheme.</p>

<p>The challenge is that the schemes have different eligibility rules, price caps and deadlines. This guide covers the picture state by state, including how to combine schemes. Our <a href="/first-home-buyers">first home buyers hub</a> and <a href="/guides/first-home-owner-grant-australia">First Home Owner Grant guide</a> carry the same figures.</p>

<h2>Federal schemes (available everywhere)</h2>

<h3>First Home Guarantee (the 5% Deposit Scheme)</h3>
<p>${HG_MIN_DEPOSIT_PCT.firstHome}% deposit, no LMI. On ${HG_DATES.expanded} it was renamed the Australian Government 5% Deposit Scheme, and the income test and the limit on places were removed. It's open to first home buyers and to anyone who hasn't owned property in Australia in the last ${HG_NO_OWNERSHIP_YEARS} years. Property price caps by location:</p>
<ul>
${AUSTRALIAN_STATES.map((s) => `<li>${hgCapSentence(s)}</li>`).join("\n")}
</ul>
<p>The Regional First Home Buyer Guarantee closed to new guarantees on ${HG_DATES.expanded}; regional buyers use the 5% Deposit Scheme at their area's cap.</p>

<h3>Family Home Guarantee</h3>
<p>${HG_MIN_DEPOSIT_PCT.singleParent}% deposit, no LMI, for single parents and single legal guardians, with no income test since ${HG_DATES.expanded}. You don't need to be a first home buyer, but any other home you own must be sold within ${HG_SINGLE_PARENT_SELL_WEEKS} weeks of settling. Same property price caps as the 5% Deposit Scheme.</p>

<h3>Help to Buy (Shared Equity Scheme)</h3>
<p>The government contributes up to ${HTB_SHARE.new.max}% of the price of a new home or ${HTB_SHARE.existing.max}% of an existing one, with a ${HTB_MIN_DEPOSIT_PCT}% minimum deposit and no LMI. For ${HTB_YEAR} the income limits are ${fmt(HTB_INCOME_LIMITS.single)} single and ${fmt(HTB_INCOME_LIMITS.joint)} for couples and single parents, with price caps by area. Applications opened on 5 December 2025. See our <a href="/guides/help-to-buy-scheme-australia">Help to Buy guide</a>.</p>

<h3>First Home Super Saver Scheme (FHSSS)</h3>
<p>Count up to ${fmt(FHSS_ANNUAL_LIMIT)} of voluntary super contributions a year (${fmt(FHSS_TOTAL_LIMIT)} in total) and withdraw them, plus deemed earnings, for a deposit. Salary sacrifice is taxed at 15% going in instead of your marginal rate, and the release at your marginal rate less a 30% offset. See our <a href="/guides/first-home-super-saver-scheme">FHSS guide</a> and <a href="/fhss-calculator">FHSS calculator</a>.</p>

<h2>NSW</h2>
${fhState("NSW", `<li><strong>First Home Buyer Choice:</strong> the annual property tax option ${FHBC.status} (<a href="${FHBC.source.href}">Revenue NSW</a>)</li>`)}

<h2>VIC</h2>
${fhState("VIC", "<li><strong>Principal place of residence rate:</strong> a lower duty rate for any owner-occupier on a home up to $550,000 (SRO Victoria)</li>")}

<h2>QLD</h2>
${fhState("QLD", "<li><strong>Queensland Housing Finance Loan:</strong> a government home loan for low-to-moderate income earners (Homes and Housing QLD)</li>")}

<h2>WA</h2>
${fhState("WA", "<li><strong>Keystart Home Loans:</strong> the WA Government lender's low-deposit loans; income limits apply</li>")}

<h2>SA</h2>
${fhState("SA")}

<h2>TAS</h2>
${fhState("TAS")}

<h2>ACT</h2>
${fhState("ACT", "<li><strong>Land Rent Scheme:</strong> lease the land from the ACT Government and finance only the build</li>")}

<h2>NT</h2>
${fhState("NT")}

<h2>How to maximise the stack</h2>
<ol>
<li><strong>Identify your scheme combinations.</strong> Federal FHBG + state FHOG + state stamp duty concession is the typical maximum stack</li>
<li><strong>Time your application properly.</strong> The 5% Deposit Scheme has had unlimited places since ${HG_DATES.expanded}, so the deadline that matters is the ${HG_PREAPPROVAL_DAYS} days a pre-approval gives you to sign a contract</li>
<li><strong>Stay under the price caps.</strong> For a grant or the 5% Deposit Scheme, one dollar over disqualifies the entire benefit; duty relief usually tapers through a concession band instead. Plan well under each cap to leave negotiation room</li>
<li><strong>Consider a mortgage broker who works with FHB schemes.</strong> They know which lenders offer the 5% Deposit Scheme and can structure the application correctly</li>
<li><strong>Get state-specific conveyancing advice.</strong> Each scheme has paperwork that needs to be lodged correctly</li>
<li><strong>For investors: schemes don't apply.</strong> If you're not buying as PPR, most FHB benefits are unavailable</li>
</ol>

<h2>Common mistakes</h2>
<ul>
<li><strong>Not knowing which schemes you're eligible for.</strong> The interaction between federal and state schemes is complex</li>
<li><strong>Going over the price cap.</strong> The most expensive mistake: a dollar over a grant or scheme cap and that benefit disappears</li>
<li><strong>Buying established when only new qualifies for FHOG.</strong> Most state FHOGs are new-only</li>
<li><strong>Missing the FHSSS opportunity.</strong> The tax saving is real and often underused</li>
<li><strong>Not getting pre-approval before bidding.</strong> Auction or competitive offer scenarios require pre-approval secured</li>
</ul>

<p>The support is fragmented across federal, state and territory schemes, and the reward for working through the rules properly is substantial. The cost of getting it wrong is too: exceeding a grant's price cap by even a small amount wipes out the grant. Check each figure with the revenue office for your state before you sign, and get advice.</p>`,
  coverImage: "/images/blog/cover-first-home-buyer-schemes-by-state-australia-2026.jpg",
  author: { name: "Andy McMaster", image: "/images/agents/andy-mcmaster.jpg" },
  category: "Buying Guide",
  tags: ["first home buyer", "schemes", "fhog", "stamp duty", "2026"],
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-11",
  readingTime: 12,
};
