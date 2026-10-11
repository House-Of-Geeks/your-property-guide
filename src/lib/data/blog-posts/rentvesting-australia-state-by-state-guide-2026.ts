import type { BlogPost } from "@/types";

// Rewritten 11 October 2026 (commercial-intent review, 10 Oct 2026, renting
// 0.5): the tax position now follows the Treasury Laws Amendment (Tax Reform
// No. 1) Act 2026 as src/lib/data/tax-reform-2027.ts states it, and the
// unsourced suburb medians and yields are gone. Suburb figures live on the
// suburb pages, which withhold a median that fails the publish gate.
export const post: BlogPost = {
  id: "blog-rentvesting-australia-2026",
  slug: "rentvesting-australia-state-by-state-guide-2026",
  title: "Rentvesting in Australia 2026: The State-by-State Strategy Guide",
  excerpt:
    "Rentvesting means renting where you live and investing where the numbers work. How it works, who it suits, what the 1 July 2027 tax changes mean, and where rentvesters in each state look.",
  content: `<p><em><strong>Correction, 11 October 2026:</strong> earlier versions of this article said investment losses "can offset other income via negative gearing" and did not mention the law Parliament passed on 25 June 2026, and they printed suburb price and yield ranges with no source or date. From 1 July 2027, losses on an established home bought after 7:30pm AEST on 12 May 2026 no longer reduce tax on other income, and gains that accrue from that date lose the 50% CGT discount. We have rewritten the tax sections from the ATO and the Act and removed the unsourced figures. The sources are listed at the end.</em></p>

<p>Rentvesting is a strategy where you rent in the suburb you want to live in (often inner-city, near work, near family) while investing in property elsewhere where the numbers work better, typically more affordable suburbs. It suits buyers priced out of their preferred owner-occupier suburb, but it is a bigger decision in 2026 than it was a year ago: the tax treatment of the investment now depends on whether it is new or established. Our <a href="/guides/rentvesting-australia">rentvesting guide</a> has the full worked example.</p>

<h2>How rentvesting works</h2>
<p>Instead of buying the home you live in, you rent that home and use your borrowing capacity to buy an investment property somewhere more affordable. The rent the investment earns covers part of the holding costs, and you build equity through capital growth. You also keep flexibility: a job, family or lifestyle change doesn't mean selling and re-buying the home you live in.</p>

<h2>The financial case, and what changed in 2026</h2>
<ul>
<li><strong>Renting where you live can cost less than owning there.</strong> In expensive inner suburbs the rent on a home is often well below the repayments on the loan it would take to buy it. Compare the two for the suburb you want, using its published rent and median.</li>
<li><strong>Investment costs are deductible, but negative gearing is narrower from 1 July 2027.</strong> Interest, depreciation and running costs remain deductible against the rent. What changes is what happens to a loss. From 1 July 2027, a loss on an established home bought after 7:30pm AEST on 12 May 2026 only offsets income from residential property and carries forward; it no longer reduces tax on your salary. A home held at that time, and a new build, keep negative gearing (ATO, updated 29 June 2026).</li>
<li><strong>The CGT discount changes on the same date.</strong> Gains that accrue from 1 July 2027 are indexed for inflation instead of halved, with a 30% minimum tax for individuals. The gain up to that date keeps the 50% discount, and an investor in a new build can choose the discount or indexation when they sell.</li>
<li><strong>You can buy where yields are higher.</strong> A cheaper property with a higher rental yield carries more of its own costs, which matters more now that an established home's loss stops reducing tax on your wages.</li>
<li><strong>You keep flexibility.</strong> Career, relationship and lifestyle changes don't require selling your home.</li>
</ul>

<h2>The trade-offs</h2>
<ul>
<li><strong>You're paying rent on the home you live in.</strong> Many people prefer the security of owning.</li>
<li><strong>First home buyer benefits usually don't apply.</strong> The 5% Deposit Scheme requires you to live in the home you buy with it, and most state grants and concessions are for a home you will live in.</li>
<li><strong>No main residence CGT exemption.</strong> An investment property is subject to CGT on sale, under the rules above.</li>
<li><strong>Rent volatility.</strong> Tenancy law differs by state.</li>
<li><strong>A loss is a cash cost.</strong> If the investment runs at a loss you need other income to cover it, and from 1 July 2027 an established home bought now gets no tax refund on that loss against your wages.</li>
</ul>

<h2>Who rentvesting suits</h2>
<ul>
<li>Singles or couples who want to live in expensive suburbs but are priced out of buying there</li>
<li>People with mobile careers who don't want the friction of selling and re-buying with each move</li>
<li>Investors building a portfolio who want to keep flexibility</li>
<li>Buyers comfortable with the tax and accounting complexity, or willing to pay for advice</li>
</ul>

<h2>Where rentvesters look, state by state</h2>
<p>These are areas rentvesters commonly consider, not recommendations, and we print no price or yield here. Each suburb's page on this site publishes its median and rent with the source and period, and withholds a figure when there are too few sales to trust it. Our <a href="/best-suburbs/best-rental-yield">best rental yield rankings</a> rank suburbs only on published medians and bond rents.</p>

<h3>New South Wales</h3>
<p>Live in the inner west, eastern suburbs or lower north shore; look at the Liverpool and Campbelltown corridor in outer south-west Sydney, and Newcastle and the Hunter. See the <a href="/best-suburbs/best-rental-yield/nsw">NSW rental yield ranking</a>.</p>

<h3>Victoria</h3>
<p>Live in inner Melbourne; look at the Werribee, Tarneit and Cranbourne growth corridors, and Geelong, Ballarat and Bendigo.</p>

<h3>Queensland</h3>
<p>Live in inner Brisbane or on the coast; look at the Logan, Ipswich and Caboolture corridors, Toowoomba and Townsville.</p>

<h3>Western Australia</h3>
<p>Live in inner Perth or the western suburbs; look at Mandurah, Armadale and Rockingham, and regional Bunbury, Geraldton and Kalgoorlie.</p>

<h3>South Australia</h3>
<p>Live in inner-eastern Adelaide or by the beach; look at the Salisbury, Davoren Park and Christies Beach corridors, and Mount Gambier.</p>

<h3>Tasmania</h3>
<p>Live in inner Hobart; look at Launceston, Devonport and Burnie.</p>

<h3>Australian Capital Territory</h3>
<p>Live in inner Canberra; look at Gungahlin and Tuggeranong, or across the border in Queanbeyan.</p>

<h3>Northern Territory</h3>
<p>Live in inner Darwin; look at Palmerston and Alice Springs. Smaller markets can move sharply in both directions.</p>

<h2>Practical first steps</h2>
<ol>
<li>Run the numbers on rent-and-invest against buying, with current rates and the suburb's published figures. Our <a href="/negative-gearing-calculator">negative gearing calculator</a> shows the after-tax cost before and from 1 July 2027.</li>
<li>Decide new or established knowingly: the tax treatment now differs, and so can the growth case.</li>
<li>Engage a mortgage broker who has worked with rentvesters. Investment loan structuring matters.</li>
<li>Engage an accountant before you buy, not after.</li>
<li>Don't over-extend. An investment property still needs a cash-flow margin to weather rate moves.</li>
</ol>

<p>For the right buyer in the right circumstances, rentvesting is a genuine third path between renting and buying your own home. In 2026 it needs the tax arithmetic done on the specific property before you sign.</p>

<h2>Sources</h2>
<ul>
<li>Australian Taxation Office, <a href="https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/tax-reform-boosting-home-ownership-reforming-negative-gearing-and-capital-gains-tax" rel="nofollow noopener">Tax reform – Boosting home ownership – Reforming negative gearing and capital gains tax</a>, last updated 29 June 2026 (read 11 October 2026).</li>
<li>Parliament of Australia, <a href="https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7493" rel="nofollow noopener">Treasury Laws Amendment (Tax Reform No. 1) Bill 2026</a>: passed both Houses 25 June 2026, Royal Assent 26 June 2026.</li>
<li>Australian Government, <a href="https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf" rel="nofollow noopener">Budget 2026-27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform</a>, 12 May 2026 (new builds and the choice of discount or indexation).</li>
<li>Housing Australia, <a href="https://firsthomebuyers.gov.au/australian-government-5-percent-deposit-scheme/5-percent-tools-and-resources/faqs" rel="nofollow noopener">5% Deposit Scheme FAQs</a> (the owner-occupier requirement).</li>
</ul>`,
  coverImage: "/images/blog/cover-rentvesting-australia-state-by-state-guide-2026.jpg",
  author: { name: "Andy McMaster", image: "/images/agents/andy-mcmaster.jpg" },
  category: "Investment",
  tags: ["rentvesting", "investment", "strategy", "2026", "australia"],
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-11",
  readingTime: 9,
};
