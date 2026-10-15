import type { BlogPost } from "@/types";
import { AUSTRALIAN_STATES, calculateStampDuty, type AustralianState } from "@/lib/utils/stamp-duty";
import { currentDutyRelief, currentGrant, money, summariseRelief } from "@/lib/policy/first-home";

// State figures from src/lib/policy/first-home.ts and the stamp duty engine.
const grant = (s: AustralianState) => currentGrant(s);
const relief = (s: AustralianState, k: "established" | "new" | "vacant-land" = "established") => summariseRelief(currentDutyRelief(s, k));
const ownerDuty = (s: AustralianState, price: number) => money(calculateStampDuty(price, s, false, false, false).total);
import {
  HG_DATES,
  HG_EXPANSION_FIRST_YEAR_AS_AT,
  HG_EXPANSION_FIRST_YEAR_BUYERS,
  HG_MIN_DEPOSIT_PCT,
  HG_NO_OWNERSHIP_YEARS,
  HG_PREAPPROVAL_DAYS,
  HG_SINGLE_PARENT_SELL_WEEKS,
  HOMES_FOR_FHB_PROGRAM,
  hgCapSentence,
} from "@/lib/data/home-guarantee";

export const post: BlogPost = {
  id: "blog-fhb-schemes-state-2026",
  slug: "first-home-buyer-schemes-by-state-australia-2026",
  title: "First Home Buyer Schemes by State: The Complete 2026 Guide",
  excerpt:
    "Every Australian state and territory has its own first home buyer schemes, and stacking them with the federal options can save eligible buyers $30,000 to $60,000+. Here's the complete state-by-state breakdown for 2026.",
  content: `<p>First home buying in Australia in 2026 is more government-supported than ever. Federal schemes administered through Housing Australia (formerly NHFIC) layer with state grants, stamp duty concessions, and shared-equity programs to create a complex but powerful support system. Eligible buyers stacking the right combination can save $30,000 to $60,000 or more compared to a standard purchase.</p>

<p>The challenge is that the schemes have different eligibility rules, price caps, and deadlines. This guide covers the complete picture state by state, including how to combine schemes for maximum benefit.</p>

<h2>Federal schemes (available everywhere)</h2>

<h3>First Home Guarantee (the 5% Deposit Scheme)</h3>
<p>${HG_MIN_DEPOSIT_PCT.firstHome}% deposit, no LMI. On ${HG_DATES.expanded} it was renamed the Australian Government 5% Deposit Scheme, and the income test and the limit on places were removed. It's open to first home buyers and to anyone who hasn't owned property in Australia in the last ${HG_NO_OWNERSHIP_YEARS} years. Property price caps by location:</p>
<ul>
${AUSTRALIAN_STATES.map((s) => `<li>${hgCapSentence(s)}</li>`).join("\n")}
</ul>
<p>The Regional First Home Buyer Guarantee closed to new guarantees on ${HG_DATES.expanded}; regional buyers use the 5% Deposit Scheme at their area's cap.</p>
<p>As at ${HG_EXPANSION_FIRST_YEAR_AS_AT}, Housing Australia data cited by the federal government showed <strong>${HG_EXPANSION_FIRST_YEAR_BUYERS.toLocaleString("en-AU")} first home buyers</strong> had used the expanded scheme in its first year, with more than 280,000 supported since 2022. One in two first home buyers nationally now use a government scheme to purchase, according to the same release.</p>

<h3>100,000 Homes for First Home Buyers</h3>
<p>Separate from the deposit guarantee, the Commonwealth is partnering with states and territories to reserve up to <strong>${HOMES_FOR_FHB_PROGRAM.totalReserved.toLocaleString("en-AU")} new homes for first home buyers</strong>. Deals announced to date include South Australia (${HOMES_FOR_FHB_PROGRAM.sa.homesForFhb.toLocaleString("en-AU")} reserved homes within about ${HOMES_FOR_FHB_PROGRAM.sa.totalHomes.toLocaleString("en-AU")} new dwellings, ${HOMES_FOR_FHB_PROGRAM.sa.announced}), the ACT (more than ${HOMES_FOR_FHB_PROGRAM.act.homesForFhb.toLocaleString("en-AU")} reserved within about ${HOMES_FOR_FHB_PROGRAM.act.totalHomes.toLocaleString("en-AU")} homes, ${HOMES_FOR_FHB_PROGRAM.act.announced}) and Tasmania (up to ${HOMES_FOR_FHB_PROGRAM.tas.homesForFhb.toLocaleString("en-AU")} reserved within about ${HOMES_FOR_FHB_PROGRAM.tas.totalHomes.toLocaleString("en-AU")} homes, ${HOMES_FOR_FHB_PROGRAM.tas.announced}). First completions from these pipelines are expected from 2027–28.</p>

<h3>Family Home Guarantee</h3>
<p>${HG_MIN_DEPOSIT_PCT.singleParent}% deposit, no LMI, for single parents and single legal guardians, with no income test since ${HG_DATES.expanded}. You don't need to be a first home buyer, but any other home you own must be sold within ${HG_SINGLE_PARENT_SELL_WEEKS} weeks of settling. Same property price caps as the 5% Deposit Scheme.</p>

<h3>Help to Buy (Shared Equity Scheme)</h3>
<p>The government contributes up to 40% of the price of a new home or 30% of an existing one, with a 2% minimum deposit and no LMI. For 2026–27 the income limits are $103,000 single and $165,000 for couples and single parents, with price caps by area. Applications opened on 5 December 2025. See our <a href="/guides/help-to-buy-scheme-australia">Help to Buy guide</a>.</p>

<h3>First Home Super Saver Scheme (FHSSS)</h3>
<p>Count up to $15,000 of voluntary super contributions a year ($50,000 in total) and withdraw them, plus deemed earnings, for a deposit. Salary sacrifice is taxed at 15% going in instead of your marginal rate, and the release at your marginal rate less a 30% offset. See our <a href="/guides/first-home-super-saver-scheme">FHSS guide</a> and <a href="/fhss-calculator">FHSS calculator</a>.</p>

<h2>NSW</h2>
<ul>
<li><strong>FHOG:</strong> ${grant("NSW").summary}</li>
<li><strong>Stamp duty:</strong> ${relief("NSW")} on a new or established home (contracts from 1 July 2023); vacant land: ${relief("NSW", "vacant-land").replace(/^No/, "no")}</li>
<li><strong>Closed schemes:</strong> First Home Buyer Choice closed to new buyers in 2023 and the Shared Equity Home Buyer Helper on 30 June 2024; <a href="/guides/help-to-buy-scheme-nsw">Help to Buy</a> is now the shared equity option</li>
</ul>
<p>Stacking on a $750K house-and-land package: the $10,000 grant plus ${ownerDuty("NSW", 750_000)} of stamp duty you don't pay, before the LMI the 5% Deposit Scheme removes.</p>

<h2>VIC</h2>
<ul>
<li><strong>FHOG:</strong> ${grant("VIC").summary}. The $20,000 regional grant ended on 30 June 2021</li>
<li><strong>Stamp duty:</strong> ${relief("VIC")} (new and established homes, and vacant land)</li>
<li><strong>Victorian Homebuyer Fund:</strong> closed to new applications on 10 September 2025. Victoria's shared equity option is now the federal <a href="/guides/help-to-buy-scheme-victoria">Help to Buy scheme</a></li>
<li><strong>PPR concession:</strong> Available to non-FHB owner-occupiers on properties up to $550,000</li>
</ul>
<p>Stacking on a new $600K home: the $10,000 grant plus ${ownerDuty("VIC", 600_000)} of stamp duty you don't pay.</p>

<h2>QLD</h2>
<ul>
<li><strong>FHOG:</strong> ${grant("QLD").summary}, kept by the 2026-27 Queensland Budget</li>
<li><strong>First home concession:</strong> on an established home, ${relief("QLD").replace(/^No/, "no")} (contracts from 9 June 2024)</li>
<li><strong>New homes and vacant land:</strong> no transfer duty at any price for contracts from 1 May 2025</li>
<li><strong>Queensland Housing Finance Loan:</strong> Government home loan for low-to-moderate income earners</li>
</ul>
<p>Stacking on a new home just under $750K: the $30,000 grant plus ${ownerDuty("QLD", 749_000)} of transfer duty you don't pay, nearly $50,000.</p>

<h2>WA</h2>
<ul>
<li><strong>FHOG:</strong> ${grant("WA").summary}</li>
<li><strong>Stamp duty:</strong> ${relief("WA")} (new and established homes, agreements from 7 May 2026); vacant land: ${relief("WA", "vacant-land").replace(/^No/, "no")}</li>
<li><strong>Keystart Home Loans:</strong> WA Government low-deposit home loans (as low as 2%) without LMI, income limits apply (unique to WA)</li>
<li><strong>SharedStart (Keystart):</strong> State shared equity through Keystart</li>
</ul>
<p>Stacking on a new $600K home: the $10,000 grant plus ${ownerDuty("WA", 600_000)} of transfer duty you don't pay, with Keystart adding low-deposit access not available elsewhere.</p>

<h2>SA</h2>
<ul>
<li><strong>FHOG:</strong> ${grant("SA").summary}</li>
<li><strong>Stamp duty:</strong> none on a new home, an off-the-plan apartment or vacant land to build, with no price cap (contracts from 6 June 2024). No first home relief on an established home</li>
<li><strong>HomeStart Shared Equity Option:</strong> HomeStart can lend 5% to 25% of the price, for net household income up to $120,000 and homes up to $750,000</li>
</ul>
<p>Stacking on a new $650K home: a grant of up to $15,000 plus ${ownerDuty("SA", 650_000)} of stamp duty you don't pay. On an established home there's no first home help from the state.</p>

<h2>TAS</h2>
<ul>
<li><strong>FHOG:</strong> ${grant("TAS").summary}. It was $30,000 in 2025-26</li>
<li><strong>Stamp duty:</strong> the exemption for first home buyers of established homes ended for settlements after 30 June 2026. There's no first home duty relief on new homes or land</li>
</ul>
<p>Stacking: the grant is the whole Tasmanian package now, ${money(grant("TAS").amount)} on a new home. A first home buyer pays full duty, ${ownerDuty("TAS", 500_000)} on a $500K home.</p>

<h2>ACT</h2>
<ul>
<li><strong>No FHOG.</strong> It ceased on 1 July 2019</li>
<li><strong>Home Buyer Concession Scheme (HBCS):</strong> ${relief("ACT").replace(/^No/, "no")}, on new and established homes and vacant land, for transactions from 1 July 2026</li>
<li><strong>ACT Shared Equity Scheme:</strong> for public housing tenants buying their Housing ACT home</li>
<li><strong>Land Rent Scheme:</strong> Unique to ACT, lease the land, finance only the build</li>
</ul>
<p>Stacking on a $700K home: ${ownerDuty("ACT", 700_000)} of duty you don't pay (owner-occupier rate), and more as the price rises, since there's no cap.</p>

<h2>NT</h2>
<ul>
<li><strong>HomeGrown Territory Grant:</strong> ${grant("NT").summary}</li>
<li><strong>Stamp duty:</strong> no first home buyer concession. The $10,000 grant for established homes covered contracts from 1 October 2024 to 30 September 2025 only</li>
</ul>
<p>The NT's ${money(grant("NT").amount)} grant on a new home is the largest first home grant in Australia; a first home buyer pays full duty, ${ownerDuty("NT", 500_000)} on a $500K home.</p>

<h2>How to maximise the stack</h2>
<ol>
<li><strong>Identify your scheme combinations.</strong> Federal FHBG + state FHOG + state stamp duty concession is the typical maximum stack</li>
<li><strong>Time your application properly.</strong> The 5% Deposit Scheme has had unlimited places since ${HG_DATES.expanded}, so the deadline that matters is the ${HG_PREAPPROVAL_DAYS} days a pre-approval gives you to sign a contract</li>
<li><strong>Stay under the price caps.</strong> Even one dollar over disqualifies the entire benefit. Plan well under cap to leave negotiation room</li>
<li><strong>Consider a mortgage broker who works with FHB schemes.</strong> They know which lenders offer the 5% Deposit Scheme and can structure the application correctly</li>
<li><strong>Get state-specific conveyancing advice.</strong> Each scheme has paperwork that needs to be lodged correctly</li>
<li><strong>For investors: schemes don't apply.</strong> If you're not buying as PPR, most FHB benefits are unavailable</li>
</ol>

<h2>Common mistakes</h2>
<ul>
<li><strong>Not knowing which schemes you're eligible for.</strong> The interaction between federal and state schemes is complex</li>
<li><strong>Going over the price cap.</strong> The most expensive mistake, a dollar over and the entire benefit disappears</li>
<li><strong>Buying established when only new qualifies for FHOG.</strong> Most state FHOGs are new-only</li>
<li><strong>Missing the FHSSS opportunity.</strong> The tax saving is real and often underused</li>
<li><strong>Not getting pre-approval before bidding.</strong> Auction or competitive offer scenarios require pre-approval secured</li>
</ul>

<p>First home buying in Australia in 2026 is more government-supported than at any point in the country's history, but the support is fragmented across federal, state and territory schemes. The reward for working through the rules properly is substantial, for buyers eligible for the maximum stack, $40,000 to $60,000 in benefits is achievable. The cost of getting it wrong is equally substantial, exceeding a price cap by even a small amount can wipe out the entire benefit. Take the time, get advice, and make the system work for you.</p>`,
  coverImage: "/images/blog/cover-first-home-buyer-schemes-by-state-australia-2026.jpg",
  author: { name: "Andy McMaster", image: "/images/agents/andy-mcmaster.jpg" },
  category: "Buying Guide",
  tags: ["first home buyer", "schemes", "fhog", "stamp duty", "2026"],
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-08",
  readingTime: 12,
};
