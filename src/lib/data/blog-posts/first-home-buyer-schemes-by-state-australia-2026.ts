import type { BlogPost } from "@/types";
import { AUSTRALIAN_STATES } from "@/lib/utils/stamp-duty";
import { HG_DATES, HG_MIN_DEPOSIT_PCT, HG_NO_OWNERSHIP_YEARS, HG_PREAPPROVAL_DAYS, HG_SINGLE_PARENT_SELL_WEEKS, hgCapSentence } from "@/lib/data/home-guarantee";

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

<h3>Family Home Guarantee</h3>
<p>${HG_MIN_DEPOSIT_PCT.singleParent}% deposit, no LMI, for single parents and single legal guardians, with no income test since ${HG_DATES.expanded}. You don't need to be a first home buyer, but any other home you own must be sold within ${HG_SINGLE_PARENT_SELL_WEEKS} weeks of settling. Same property price caps as the 5% Deposit Scheme.</p>

<h3>Help to Buy (Shared Equity Scheme)</h3>
<p>The government contributes up to 40% of the price of a new home or 30% of an existing one, with a 2% minimum deposit and no LMI. For 2026–27 the income limits are $103,000 single and $165,000 for couples and single parents, with price caps by area. Applications opened on 5 December 2025. See our <a href="/guides/help-to-buy-scheme-australia">Help to Buy guide</a>.</p>

<h3>First Home Super Saver Scheme (FHSSS)</h3>
<p>Count up to $15,000 of voluntary super contributions a year ($50,000 in total) and withdraw them, plus deemed earnings, for a deposit. Salary sacrifice is taxed at 15% going in instead of your marginal rate, and the release at your marginal rate less a 30% offset. See our <a href="/guides/first-home-super-saver-scheme">FHSS guide</a> and <a href="/fhss-calculator">FHSS calculator</a>.</p>

<h2>NSW</h2>
<ul>
<li><strong>FHOG:</strong> $10,000 for new homes bought for up to $600,000, or land and a building contract up to $750,000</li>
<li><strong>Stamp duty:</strong> Full exemption up to $800,000 (new and established), concession to $1,000,000</li>
<li><strong>First Home Buyer Choice:</strong> Optional annual property tax (0.3% of land value) instead of upfront stamp duty, properties up to $1.5M</li>
<li><strong>Shared Equity Home Buyer Helper:</strong> Up to 40% government equity (new) or 30% (established) for eligible buyers (key workers, single parents, older singles)</li>
</ul>
<p>Maximum savings stacking: ~$45,000 to $50,000 on a new $750K home for eligible buyers.</p>

<h2>VIC</h2>
<ul>
<li><strong>FHOG:</strong> $10,000 metro Melbourne, $20,000 regional Victoria, on new homes up to $750,000</li>
<li><strong>Stamp duty:</strong> Full exemption to $600,000, concession to $750,000 (new and established)</li>
<li><strong>Victorian Homebuyer Fund:</strong> closed to new applications on 10 September 2025. Victoria's shared equity option is now the federal <a href="/guides/help-to-buy-scheme-victoria">Help to Buy scheme</a></li>
<li><strong>PPR concession:</strong> Available to non-FHB owner-occupiers on properties up to $550,000</li>
</ul>
<p>Maximum savings stacking: ~$35,000 to $40,000 on a $600K first home.</p>

<h2>QLD</h2>
<ul>
<li><strong>FHOG:</strong> $30,000 for new homes up to $750,000 (one of Australia's most generous)</li>
<li><strong>First Home Concession:</strong> Reduced transfer duty for properties up to $550,000 (new and established)</li>
<li><strong>First Home Vacant Land Concession:</strong> Reduced duty on land up to $400,000 with concession to $500,000</li>
<li><strong>Queensland Housing Finance Loan:</strong> Government home loan for low-to-moderate income earners</li>
</ul>
<p>Maximum savings stacking: ~$45,000 to $55,000 on a $750K new home.</p>

<h2>WA</h2>
<ul>
<li><strong>FHOG:</strong> $10,000 for new homes up to $750,000</li>
<li><strong>Stamp duty:</strong> Full exemption to $450,000, concession to $600,000 (new and established)</li>
<li><strong>Keystart Home Loans:</strong> WA Government low-deposit home loans (as low as 2%) without LMI, income limits apply (unique to WA)</li>
<li><strong>SharedStart (Keystart):</strong> State shared equity through Keystart</li>
</ul>
<p>Maximum savings stacking: ~$30,000 to $40,000 on a $450K new home, with Keystart adding meaningful low-deposit access not available elsewhere.</p>

<h2>SA</h2>
<ul>
<li><strong>FHOG:</strong> $15,000 for new homes up to $650,000</li>
<li><strong>Stamp duty:</strong> No FHB-specific exemption on established homes (a notable gap vs. NSW/VIC)</li>
<li><strong>HomeSeeker SA:</strong> State shared equity scheme, eligibility varies by round</li>
<li><strong>Off-the-Plan Stamp Duty Concession:</strong> Reduces duty on off-the-plan apartment purchases (not FHB-exclusive)</li>
</ul>
<p>Maximum savings stacking: ~$25,000 on a $650K new home. SA's lack of an established-home stamp duty concession is a real gap.</p>

<h2>TAS</h2>
<ul>
<li><strong>FHOG:</strong> $30,000 for new homes (one of Australia's most generous)</li>
<li><strong>Stamp duty:</strong> 50% concession on established homes up to $600,000</li>
<li>Note: New home OR established home concession, not both on the same property</li>
</ul>
<p>Maximum savings stacking: ~$35,000 on a new home, ~$10,000 to $12,000 on an established home of $500K to $600K.</p>

<h2>ACT</h2>
<ul>
<li><strong>No FHOG.</strong> Replaced with the Home Buyer Concession Scheme</li>
<li><strong>Home Buyer Concession Scheme (HBCS):</strong> Full stamp duty waiver for eligible FHBs (new and established). Income and property value thresholds apply</li>
<li><strong>ACT Shared Equity Scheme:</strong> Government takes equity in property; income and asset limits apply</li>
<li><strong>Land Rent Scheme:</strong> Unique to ACT, lease the land, finance only the build</li>
</ul>
<p>Maximum savings stacking: ~$25,000 to $30,000 on a $700K home (HBCS waiver alone). The ACT scheme is one of the most generous when measured by total dollar value, given Canberra's high prices.</p>

<h2>NT</h2>
<ul>
<li><strong>FHOG:</strong> $10,000 for new or substantially renovated homes (more flexible than other states)</li>
<li><strong>First Home Owner Discount:</strong> Up to $23,928.60 stamp duty relief on new and established homes</li>
<li>Combined: ~$34,000 maximum on a new home, ~$24,000 on an established home</li>
</ul>
<p>NT's combined package is one of Australia's most generous by total dollar value.</p>

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
  updatedAt: "2026-10-07",
  readingTime: 12,
};
