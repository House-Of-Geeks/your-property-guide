import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  EditorNote,
  PullQuote,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Home Staging Costs in Australia (2026): What Property Styling Really Costs",
  description:
    "What home staging costs in Australia in 2026: full styling prices by city, partial and virtual staging, the six-week hire terms to watch, what the ROI claims are really worth, DIY staging on a budget, and when to skip staging entirely.",
  slug: "home-staging-cost-australia",
  publishedAt: "2026-07-03",
  updatedAt: "2026-07-03",
  readingTimeMinutes: 10,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "selling",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: FRONTMATTER.title,
    description: FRONTMATTER.description,
    type: "article",
    publishedTime: FRONTMATTER.publishedAt,
    modifiedTime: FRONTMATTER.updatedAt,
    images: guideOgImages({
      slug: FRONTMATTER.slug,
      title: FRONTMATTER.title,
      description: FRONTMATTER.description,
      persona: FRONTMATTER.persona,
    }),
  },
};

const TLDR = [
  "Full staging of an empty home typically costs $2,000 to $8,000 in the capital cities, covering furniture hire, styling, delivery, install and pack-down. Large or prestige homes in Sydney run $9,000 to $15,000 or more.",
  "The quote usually covers a 4 to 6 week hire. If the home hasn't sold when the hire ends, extensions run roughly $300 to $600 a week, so a slow campaign quietly adds thousands.",
  "Partial staging, where the stylist works around your existing furniture, typically costs 30 to 50 per cent less than a full vacant style. Virtual staging costs about $30 to $120 per photo.",
  "The ROI claims (5 to 10 per cent higher sale price) come from agent networks and styling companies, not independent research. Treat them as directional: staging helps most on vacant, dated or awkwardly furnished homes.",
  "Staging is often not worth it in a runaway seller's market, on land-value sales, or when the home is already well presented. Spend on a deep clean and declutter first, they're a fraction of the cost.",
  "Your agent can arrange staging through their trade partners, sometimes with payment deferred to settlement. Get the quote itemised and compare it with one independent stylist before signing.",
];

const TOC: GuideTOCEntry[] = [
  { id: "at-a-glance",      label: "Staging costs at a glance" },
  { id: "what-you-pay-for", label: "What you're actually paying for" },
  { id: "cost-by-city",     label: "Cost by city" },
  { id: "partial-staging",  label: "Partial and occupied-home staging" },
  { id: "virtual-staging",  label: "Virtual staging" },
  { id: "hire-terms",       label: "Hire terms and extension fees" },
  { id: "roi",              label: "Does staging pay for itself?" },
  { id: "diy",              label: "DIY staging on a budget" },
  { id: "not-worth-it",     label: "When staging is not worth it" },
  { id: "agents",           label: "How agents arrange staging" },
  { id: "next-steps",       label: "Where to start" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much does home staging cost in Australia?",
    answer:
      "Full staging of a vacant home typically costs $2,000 to $8,000 in the capital cities, depending on the city, the number of rooms and the quality of the furniture. As a guide from published 2026 styling company pricing: a one or two bedroom apartment runs roughly $2,000 to $5,000, a three bedroom house $3,300 to $6,500, and a four bedroom family home $3,600 to $8,500, with Sydney at the top of each range and prestige homes reaching $15,000 or more. The price usually covers design, furniture and accessory hire for 4 to 6 weeks, delivery, installation and pack-down.",
  },
  {
    question: "Is home staging worth the money?",
    answer:
      "Often, but not always. Industry figures, including LJ Hooker's estimate that staging can add 5 to 10 per cent to the final sale price, come from agents and styling companies rather than independent research, so treat them as directional. Staging tends to earn its keep on vacant homes (empty rooms photograph badly and look smaller), dated or cluttered homes, and mid-to-upper price brackets where buyers are emotional rather than purely numbers-driven. It adds the least when the home is already well presented, when buyers are chasing the land rather than the house, or when the market is so hot that everything sells regardless.",
  },
  {
    question: "How long does the furniture hire last, and what if my home doesn't sell in time?",
    answer:
      "Most packages include a 4 to 6 week hire, which is designed to match a standard sales campaign. If the property hasn't sold or the campaign runs long, you pay weekly extension fees, typically around $300 to $600 a week depending on the package size. That is the detail most sellers miss: a campaign that drags two months past the hire period can add $2,500 or more to a $5,000 quote. Before signing, ask exactly when the hire clock starts, what an extension week costs, and whether the stylist will pro-rata or remove part of the furniture if you only need certain rooms held.",
  },
  {
    question: "What does partial staging cost?",
    answer:
      "Partial staging, where a stylist supplements your own furniture with hired pieces, art and accessories in the rooms that matter most, typically costs 30 to 50 per cent less than a full vacant style. Published minimums start around $1,500 to $1,800 in Melbourne and Brisbane. It suits owner-occupied homes where the bones are fine but the presentation is tired, and it usually concentrates on the hero rooms: living, dining, main bedroom and the entry.",
  },
  {
    question: "How much does virtual staging cost, and is it a good substitute?",
    answer:
      "Virtual staging, digitally furnishing photos of empty rooms, costs roughly $30 to $120 per image, with Australian provider BoxBrownie charging AU$30 per photo on a 48-hour turnaround. It is a fraction of the cost of physical staging and works well for getting empty properties to photograph competitively online. The limitation is the inspection: buyers who click through to a beautifully furnished listing walk into an empty house, and the gap can work against you. Most agents recommend disclosing virtually staged images in the listing. It suits vacant investment units and budget campaigns better than family homes.",
  },
  {
    question: "Who organises the staging, me or the agent?",
    answer:
      "Either. Most selling agents have one or two styling companies they work with regularly and will arrange quotes as part of the campaign plan, sometimes at better rates than you'd get walking in off the street. Some stylists and agencies also offer deferred payment so the invoice comes out of your settlement proceeds rather than your pocket up front. You are never obliged to use the agent's stylist though: get their quote itemised, compare it with one independent styling company, and check whether any referral arrangement between agent and stylist has been disclosed, which agents are generally required to do.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "The Cost of Selling a House",         href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost in one place: commission, marketing, styling, legals and CGT." },
  { title: "How to Sell a House in Australia",    href: "/guides/how-to-sell-a-house-australia",       description: "Every step from pre-listing prep through to settlement day." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",       description: "The interview process, the appraisal-price trap, and what to negotiate." },
  { title: "Best Time to Sell a House",           href: "/guides/best-time-to-sell-a-house-australia", description: "Seasonality, market timing and how they affect your campaign." },
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",          description: "Size the biggest selling cost for your price and state." },
  { title: "Free Selling Guide (PDF)",            href: "/selling-guide",                              description: "The full process from listing to settlement, personalised to your suburb." },
  { title: "Free Property Appraisal",             href: "/appraisal",                                  description: "An honest appraisal from a vetted local agent, no commitment." },
];

export default function HomeStagingCostAustraliaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Prices below are indicative, get your own quotes">
        <p>
          Staging prices vary with the city, the size of the home, the furniture
          tier and the hire length, and every figure on this page is drawn from
          published styling company pricing that can change at any time. Get two
          or three written quotes for your own property before budgeting, and
          check exactly what the hire period and extension fees are.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Staging is the selling cost people get talked into last and question
          least. The photos look great, so it feels like money well spent, and
          often it is. But the two questions almost nobody asks are the ones
          that decide whether it pays: what happens to the bill if the home
          doesn&rsquo;t sell inside the hire period, and would a $500 clean and
          declutter have got 80 per cent of the result? Ask both before you
          sign anything.
        </p>
      </EditorNote>

      <h2 id="at-a-glance">Staging costs at a glance</h2>
      <p className="lead">
        Home staging, also called property styling, means hiring furniture, art
        and accessories, professionally arranged, so your home photographs and
        inspects at its best. For most Australian homes, full staging of a
        vacant property costs somewhere between $2,000 and $8,000, with large
        Sydney homes running well past $10,000.
      </p>
      <p>The three levels, from most to least expensive:</p>
      <ul>
        <li><strong>Full staging</strong>, every key room furnished from scratch. Typical for vacant homes. Roughly $2,000 to $8,000, more for big or prestige properties.</li>
        <li><strong>Partial staging</strong>, the stylist works around your existing furniture and dresses the hero rooms. Typically 30 to 50 per cent cheaper than full staging.</li>
        <li><strong>Virtual staging</strong>, empty rooms furnished digitally in the listing photos only. Around $30 to $120 per image.</li>
      </ul>

      <KeyFigure
        value="$2,000–$8,000"
        label="Typical cost to fully stage a vacant capital-city home in 2026, including furniture hire, install and pack-down for 4 to 6 weeks."
        context="Published styling company pricing; large Sydney homes exceed $10,000"
      />

      <p>
        Where your quote lands inside that range depends mostly on four things:
        how many rooms need furniture, which city you&rsquo;re in, the quality
        tier of the pieces (a prestige campaign hires designer furniture, a
        unit campaign doesn&rsquo;t), and how long the hire runs.
      </p>

      <h2 id="what-you-pay-for">What you&rsquo;re actually paying for</h2>
      <p>
        A staging quote is mostly a logistics and rental bill, not a design
        fee. A standard full-staging package includes:
      </p>
      <ul>
        <li>A design consultation and furniture plan for the property</li>
        <li>Hire of furniture, rugs, art, lamps, linen and accessories for the hire period</li>
        <li>Delivery, professional installation and final styling before photography</li>
        <li>Insurance on the hired pieces while they&rsquo;re in your home</li>
        <li>Pack-down and removal at the end of the campaign</li>
      </ul>
      <p>
        Because the bill scales with rooms and truck space, the biggest single
        driver of price is simply the size of the home. A one-bedroom
        apartment might need a dozen pieces; a two-storey four-bedroom house
        with multiple living areas needs several truckloads, and quotes scale
        accordingly. Access matters too: stairs, lifts and tight sites add
        labour, and homes far from the stylist&rsquo;s warehouse attract travel
        charges.
      </p>

      <h2 id="cost-by-city">Cost by city</h2>
      <p>
        These ranges are drawn from published 2026 price guides from styling
        companies in each city (linked in the sources at the end of this
        page). Every company prices differently, so treat these as the shape
        of the market rather than a quote:
      </p>

      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>1–2 bed apartment</th>
            <th>3 bed house</th>
            <th>4 bed house</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Sydney</td><td>$2,500–$5,000</td><td>$4,500–$6,500</td><td>$5,500–$8,500</td></tr>
          <tr><td>Melbourne</td><td>$2,000–$3,400</td><td>$3,800–$4,600</td><td>$5,000–$5,800+</td></tr>
          <tr><td>Brisbane</td><td>$3,000–$3,500</td><td>$3,300–$4,000</td><td>$3,600–$6,000+</td></tr>
          <tr><td>Perth</td><td>$1,500–$3,500</td><td>$3,000–$5,000</td><td>$3,000–$8,000</td></tr>
        </tbody>
      </table>

      <p>
        Sydney is the most expensive market, and it stretches further at the
        top: published Sydney pricing puts a four-bedroom home with two living
        areas at $7,000 to $10,000 and prestige properties at $9,000 to
        $15,000 or more, with the North Shore pricing higher again than
        Western Sydney for the same floor plan. Adelaide, Hobart and regional
        centres generally quote below the east-coast capitals, but published
        pricing there is thinner, so get local quotes rather than assuming a
        discount.
      </p>
      <p>
        Whatever the city, the same rule applies as with{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">every other selling cost</Link>:
        get it in writing, itemised, from more than one provider.
      </p>

      <h2 id="partial-staging">Partial and occupied-home staging</h2>
      <p>
        If you&rsquo;re living in the home while it sells, you usually
        don&rsquo;t need the full package. Partial staging keeps your workable
        furniture and layers hired art, rugs, cushions, lamps and statement
        pieces over the top, concentrated on the rooms buyers judge hardest:
        the living area, dining, main bedroom and entry.
      </p>
      <p>
        Published pricing puts partial or occupied-home styling at{" "}
        <strong>30 to 50 per cent less</strong> than a full vacant style, with
        minimum jobs starting around $1,500 to $1,800. The stylist will be
        blunt about which of your pieces can stay and which need to go into
        storage, and that honesty is a large part of what you&rsquo;re paying
        for. Budget for a short-term storage unit if your home is furniture-heavy.
      </p>

      <h2 id="virtual-staging">Virtual staging</h2>
      <p>
        Virtual staging digitally furnishes photos of empty rooms for the
        online listing. It costs a fraction of physical staging: Australian
        provider BoxBrownie charges <strong>AU$30 per image</strong> on a
        48-hour turnaround, and across the market $30 to $120 per photo is
        the going range. Staging six hero shots might cost $200 to $700 in
        total, against thousands for the real thing.
      </p>
      <p>The catch is the gap between the listing and the inspection:</p>
      <ul>
        <li>Buyers who loved the furnished photos walk into an empty, echoing house. The contrast can undercut the emotional first impression you paid for.</li>
        <li>Images should be disclosed as virtually staged in the listing. Misleading presentation risks complaints under Australian Consumer Law, and the major portals and agents generally require disclosure.</li>
        <li>It does nothing for the on-site experience, which is where offers actually happen.</li>
      </ul>
      <p>
        Virtual staging suits vacant investment units, budget campaigns and
        homes marketed primarily to investors. For an owner-occupier family
        home in a competitive suburb, physical staging (full or partial)
        usually earns its premium.
      </p>

      <h2 id="hire-terms">Hire terms and extension fees</h2>
      <p>
        Almost every staging quote is built around a fixed hire period,
        usually <strong>4 to 6 weeks</strong>, matched to a standard sales
        campaign. Some companies quote four weeks with paid extensions, some
        include six or eight weeks up front. This is the clause to read
        twice, because it decides what a slow campaign costs you.
      </p>

      <KeyFigure
        value="$300–$600/week"
        label="Typical extension fee once the included hire period runs out, based on published Sydney styling company pricing."
        context="A campaign that runs eight weeks over adds $2,400–$4,800"
      />

      <p>Before you sign a staging agreement, ask:</p>
      <ul>
        <li><strong>When does the clock start?</strong> Install day, or the first open home? A week of photography and pre-launch eats into a four-week hire.</li>
        <li><strong>What exactly does an extension week cost</strong>, and is it the whole package or can rooms be released early?</li>
        <li><strong>What happens after exchange?</strong> You usually don&rsquo;t need the furniture once contracts are signed, so confirm pack-down can happen promptly.</li>
        <li><strong>Is there a discount for longer campaigns</strong> booked up front, common for auction campaigns with long lead-ins?</li>
      </ul>
      <p>
        If your agent is proposing a strategy with a longer runway, price the
        staging for the realistic campaign length, not the optimistic one.
        Our guide to{" "}
        <Link href="/guides/best-time-to-sell-a-house-australia">timing your sale</Link>{" "}
        covers how long campaigns actually run in different markets.
      </p>

      <h2 id="roi">Does staging pay for itself?</h2>
      <p>
        The industry says emphatically yes. LJ Hooker&rsquo;s selling guides
        estimate that staging can add <strong>5 to 10 per cent</strong> to the
        final sale price, and agents commonly quote a rule of thumb of five to
        ten times the styling cost back in the result. On a $800,000 home,
        even the bottom of that range ($40,000) dwarfs a $5,000 staging bill.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        Every widely-quoted staging ROI number in Australia comes from someone
        who gets paid when you stage. That doesn&rsquo;t make the numbers
        wrong, but it does mean you should ask where staging genuinely moves
        the dial on your home, not homes in general.
      </PullQuote>

      <p>
        There is no independent, peer-reviewed Australian study behind those
        figures, they are estimates from agent networks and styling companies.
        The honest version of the evidence looks like this:
      </p>
      <ul>
        <li><strong>Staging reliably helps where presentation is the problem:</strong> vacant homes (empty rooms photograph badly and read smaller), dated or cluttered interiors, and awkward layouts where furniture shows buyers how a space works.</li>
        <li><strong>It amplifies competition rather than creating it.</strong> Great presentation gets more people through the door and helps emotional buyers stretch. It cannot fix a wrong price or a poor agent.</li>
        <li><strong>The uplift is not uniform.</strong> A tired, empty three-bedder in a family suburb might genuinely see a five-figure difference. An immaculate owner-occupied home might see close to none.</li>
      </ul>
      <p>
        A useful sanity check: staging at $4,000 to $6,000 on a median-priced
        capital-city home is roughly half a per cent of the sale price. It
        only needs to nudge the result by that much to break even, which is
        why most agents recommend it for vacant homes without hesitation. Just
        make the decision with your own numbers, alongside{" "}
        <Link href="/real-estate-commission-calculator">what you&rsquo;ll pay in commission</Link>{" "}
        and the rest of the campaign budget.
      </p>

      <MatchCTA kind="builder" lead="Weighing up what to spend before you list? Chapter 4 of the free selling guide covers which presentation spend pays for itself and which never does." />

      <h2 id="diy">DIY staging on a budget</h2>
      <p>
        If a full package isn&rsquo;t justified, most of staging&rsquo;s value
        comes from things you can do for hundreds, not thousands:
      </p>
      <ul>
        <li><strong>Declutter ruthlessly.</strong> Half-empty cupboards and clear benchtops make every room read bigger. Cost: a skip bin, a storage unit, or a weekend.</li>
        <li><strong>Deep clean everything</strong>, including windows, grout and carpets. A professional bond-style clean is a few hundred dollars and is the single highest-leverage spend in presentation.</li>
        <li><strong>Depersonalise.</strong> Family photos, fridge art and bold collections come down so buyers can project themselves in.</li>
        <li><strong>Fix the small stuff:</strong> dripping taps, scuffed walls, blown light globes, squeaky doors. Buyers read small neglect as a proxy for big neglect.</li>
        <li><strong>Refresh the soft layer:</strong> new white bed linen, a few large cushions, fresh towels, a couple of indoor plants. A few hundred dollars at retail, and you keep them.</li>
        <li><strong>Sort the street view.</strong> Mow, mulch, sweep, and put a pot plant at the front door. First-photo and drive-by impressions are disproportionately powerful.</li>
      </ul>
      <p>
        Do all of that and you&rsquo;ve captured much of what a stylist would
        change, for under $1,000. Then, if key rooms still look empty or
        tired, price a partial stage for just those rooms rather than the
        whole house.
      </p>

      <h2 id="not-worth-it">When staging is not worth it</h2>
      <p>Staging is a tool, not a ritual. Think hard before paying when:</p>
      <ul>
        <li><strong>The buyer is buying the land.</strong> Knock-down-rebuild stock, development sites and serious renovators&rsquo; delights sell on position and potential. Furniture changes nothing.</li>
        <li><strong>The market is running hot.</strong> When comparable homes are selling in a week with multiple offers, staging spends money to win a competition you were already winning.</li>
        <li><strong>The home is already well presented.</strong> If your furniture is current and the home photographs well, a stylist&rsquo;s consult ($200 to $500 at most firms) plus tweaks beats a full package.</li>
        <li><strong>The styling spend is out of proportion.</strong> $6,000 on a $400,000 unit is 1.5 per cent of the price, triple the proportional spend of the same package on a $1.2M house, and investor buyers in that bracket are less swayed by styling.</li>
        <li><strong>Cash is genuinely tight and settlement-deferred payment isn&rsquo;t available.</strong> Never fund staging on a credit card in the hope of a premium.</li>
      </ul>
      <p>
        One more consideration for investors: if the property you&rsquo;re
        selling is an investment rather than your home, selling costs
        including marketing can generally be factored into the capital gains
        tax calculation. Confirm how presentation costs are treated in your
        case with the ATO or a registered tax agent.
      </p>

      <h2 id="agents">How agents arrange staging</h2>
      <p>
        In practice, most staging is organised through the selling agent.
        Established agents have one or two styling companies they use
        constantly, which has real advantages: trade familiarity, priority
        booking around your photography date, and sometimes better pricing
        than retail. Many stylists and agencies also offer deferred payment,
        with the styling invoice paid from settlement proceeds, one Melbourne
        firm, for example, advertises interest-free deferral of up to $15,000
        until settlement.
      </p>
      <p>Keep three checks in place:</p>
      <ol>
        <li><strong>Get the staging quote itemised and separate</strong> from the rest of the marketing budget, so you can see exactly what the hire period and extension terms are.</li>
        <li><strong>Ask whether the agent receives a referral benefit</strong> from the stylist. Agents are generally required to disclose rebates and referral arrangements, and a straight answer here is a good character test.</li>
        <li><strong>Compare with one independent quote.</strong> Ten minutes with a second styling company tells you whether the agent&rsquo;s partner is competitive.</li>
      </ol>
      <p>
        The staging conversation is also one of the most revealing parts of
        the agent interviews: a good agent will tell you which rooms need
        work and which spend is wasted on your specific home, with reasons.
        An agent who reflexively adds a full styling package to every
        campaign is selling a process, not a strategy. Our guide to{" "}
        <Link href="/guides/how-to-choose-a-selling-agent">choosing a selling agent</Link>{" "}
        covers the other questions that separate the two.
      </p>

      <Callout variant="info" title="Not sure if your home needs staging?">
        <p>
          A{" "}
          <Link href="/appraisal">free property appraisal</Link>{" "}
          from a vetted local agent will tell you what your home is worth as
          it stands, and whether presentation spend would genuinely move the
          number in your suburb. No commitment to list.
        </p>
      </Callout>

      <h2 id="next-steps">Where to start</h2>
      <p>
        Staging is one line in the selling budget, and rarely the biggest.
        Sequence the decisions like this:
      </p>
      <ol>
        <li>
          <strong>Size the whole cost of selling first.</strong> The{" "}
          <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link>{" "}
          puts staging alongside commission, marketing and legals so nothing
          surprises you at settlement.
        </li>
        <li>
          <strong>Get an honest read on your home&rsquo;s presentation.</strong>{" "}
          A <Link href="/appraisal">free appraisal</Link> from a local agent,
          walking the rooms with you, beats guessing from this page.
        </li>
        <li>
          <strong>Do the sub-$1,000 work regardless.</strong> Clean,
          declutter, repair, refresh. It pays whether or not you stage.
        </li>
        <li>
          <strong>Then quote the staging that fits:</strong> full for vacant,
          partial for lived-in, virtual for budget or investor stock, and
          always with the hire terms in writing.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={STAGING_COST_SOURCES} />
    </GuideArticleLayout>
  );
}

const STAGING_COST_SOURCES: readonly SourceItem[] = [
  { label: "LJ Hooker: How to stage your home to sell", href: "https://www.ljhooker.com.au/blog/how-to-stage-your-home-to-sell", note: "Industry cost ranges, six-week campaign norm and the estimated 5–10% price uplift claim" },
  { label: "Styling Lab: How much does property styling cost in Sydney in 2026?", href: "https://www.stylinglab.com.au/blog/how-much-does-property-styling-cost-sydney-2026", note: "Sydney pricing by property size, $300–$600/week extension fees, occupied-styling discount" },
  { label: "Property Styling Melbourne: Price guide 2026", href: "https://www.propertystylingmelbourne.com.au/how-much-does-home-staging-cost/", note: "Melbourne package pricing, $1,800 partial-styling minimum, pay-at-settlement option" },
  { label: "Sell In Style: How much does home staging cost in Brisbane?", href: "https://sellinstyle.com.au/home-styling-and-staging-advise/how-much-does-home-staging-cost-in-brisbane-a-2025-guide-for-sellers/", note: "Brisbane package pricing and 4–6 week hire terms" },
  { label: "Perth Staged to Sell: Property styling Perth, what does it cost?", href: "https://perthstagedtosell.com.au/property-styling-perth-what-does-it-cost/", note: "Perth price ranges by home size" },
  { label: "BoxBrownie: Virtual staging", href: "https://www.boxbrownie.com/au/virtual-staging", note: "AU$30 per image virtual staging, 48-hour turnaround" },
  { label: "Australian Taxation Office: Capital gains tax", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax", note: "How selling costs factor into CGT on an investment property" },
];
