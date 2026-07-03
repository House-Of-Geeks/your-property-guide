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
  title: "What to Fix Before Selling a House (2026): What Pays, What Doesn't",
  description:
    "The repairs that return money when selling a house in Australia and the renovations that never do: the buyer-turnoff list, what building inspectors flag, cosmetic wins under $5,000, the over-capitalisation trap, and when to sell as-is.",
  slug: "what-to-fix-before-selling-a-house",
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
  "Fix what scares buyers, freshen what they see, and skip almost everything else. Visible defects get mentally priced at several times their repair cost; big renovations rarely return what they cost.",
  "The must-fix list is short: roof leaks, mould and damp, large cracks, rotten timber, dripping taps and anything a building inspector will write up as 'major defect'.",
  "Cosmetic wins under $5,000 do the heavy lifting: fresh neutral paint, modern light fittings, a hard weekend of landscaping, re-caulked bathrooms and a deep clean.",
  "Full kitchen and bathroom renovations before a sale usually return cents on the dollar. A cosmetic refresh (paint, handles, benchtop, tapware) captures most of the lift for a fraction of the cost.",
  "Every suburb has a price ceiling. Renovation dollars spent past it return nothing, so find out what your home is worth before you spend anything.",
  "Some homes should sell as-is: major structural work, renovator-grade properties where the land is the value, or repairs that cost more than they add.",
];

const TOC: GuideTOCEntry[] = [
  { id: "the-rule",           label: "The one rule that decides everything" },
  { id: "buyer-turnoffs",     label: "The buyer-turnoff list (fix these first)" },
  { id: "legal-minimum",      label: "What you legally have to fix or disclose" },
  { id: "inspectors",         label: "What building inspectors flag" },
  { id: "cosmetic-wins",      label: "Cosmetic wins under $5,000" },
  { id: "skip-list",          label: "Renovations that don't pay back" },
  { id: "overcapitalisation", label: "The over-capitalisation trap" },
  { id: "room-by-room",       label: "Room-by-room priority order" },
  { id: "sell-as-is",         label: "When to sell as-is instead" },
  { id: "next-steps",         label: "Where to start" },
];

const FAQS: FaqItem[] = [
  {
    question: "Should I renovate my kitchen or bathroom before selling?",
    answer:
      "Usually no. A full kitchen renovation in Australia commonly runs $20,000 to $50,000 or more depending on size and finishes, and a full bathroom typically $15,000 to $30,000, and sellers rarely get that money back at sale, because buyers pay for their own taste, not yours. The exception is a kitchen or bathroom so dated or damaged it drags the whole home down. Even then, a cosmetic refresh (repainted cabinets, new handles, new tapware, a replacement benchtop) captures most of the buyer appeal for a few thousand dollars instead of tens of thousands.",
  },
  {
    question: "Is it worth painting a house before selling?",
    answer:
      "Almost always yes. Paint is the most reliable pre-sale spend there is: it makes a home read as clean, cared-for and move-in ready, which is exactly what most buyers pay a premium for. Repainting the interior of a typical three-bedroom home costs roughly $2,500 to $8,000 depending on size, condition, ceiling height and where you live, and single rooms cost a few hundred dollars each. Stick to light neutral colours, and prioritise the entry, hallway, living areas and any room with bold or dated colours.",
  },
  {
    question: "What do building inspectors flag most often?",
    answer:
      "The recurring items in pre-purchase reports are roof defects (cracked or slipped tiles, rusted flashings, leaks), moisture and rising damp, structural or large cosmetic cracking, termite damage or active termites, poor site drainage, non-compliant DIY electrical or plumbing work, and deteriorating subfloor timbers. Anything written up as a 'major defect' gives the buyer a renegotiation lever or a reason to walk. Getting your own building and pest inspection before listing, typically $400 to $900 depending on the property and state, means nothing in the report surprises you mid-campaign.",
  },
  {
    question: "Do I have to fix or disclose problems when I sell?",
    answer:
      "It depends on the state, and disclosure rules are stricter than most sellers realise. In NSW, agents must disclose prescribed material facts, including flooding or bushfire affecting the property in the last five years, loose-fill asbestos and significant health or safety risks, and contracts must attach documents like pool compliance certificates. In Victoria, the section 32 vendor statement must be accurate and complete or the buyer may be able to withdraw or take legal action. In Queensland, homes being sold must have interconnected photoelectric smoke alarms installed before transfer. Fixing a cheap defect is usually simpler than disclosing it; hiding a known defect is never an option.",
  },
  {
    question: "Is it better to sell a house as-is or fix it up?",
    answer:
      "Sell as-is when the repairs cost more than they add: major structural work, restumping, full rewiring, or a property whose value is mostly in the land and which the likely buyer will renovate or knock down anyway. Fix it up when the problems are cheap relative to the fear they create, a $400 roof tile repair that removes a 'roof leak' line from the building report is the best money you will ever spend. The honest way to decide is to get a local agent's appraisal of the price as-is versus repaired, then compare the gap to the quote.",
  },
  {
    question: "How much should I spend getting my house ready for sale?",
    answer:
      "For most homes, the answer is a few thousand dollars, not tens of thousands: fix the short list of defects that scare buyers or will appear in a building report, then spend up to roughly $5,000 on paint, lighting, landscaping and a professional clean. Before committing to anything bigger, get an appraisal so you know your suburb's realistic price band. If your home is already near the top of that band, extra renovation spend mostly comes straight off your profit.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free Selling Guide (PDF)",           href: "/selling-guide",                               description: "Which fixes pay for themselves and which never do, plus nine more chapters, personalised to your suburb." },
  { title: "Free Property Appraisal",            href: "/appraisal",                                   description: "Know your price ceiling before you spend a dollar on repairs. No commitment." },
  { title: "Renovation Costs in Australia",      href: "/guides/renovation-cost-australia-2026",       description: "What every renovation actually costs, room by room and state by state." },
  { title: "Building & Pest Inspections",        href: "/guides/building-pest-inspection",             description: "What inspectors check, what reports cost, and how defects affect a sale." },
  { title: "The Cost of Selling a House",        href: "/guides/cost-of-selling-a-house-australia",    description: "Commission, marketing, conveyancing and presentation, every fee explained." },
  { title: "How Much Is My House Worth?",        href: "/guides/how-much-is-my-house-worth-australia", description: "The three ways to value a home and how to land on a figure you can trust." },
  { title: "How to Sell a House in Australia",   href: "/guides/how-to-sell-a-house-australia",        description: "Every step from pre-listing prep through to settlement day." },
];

export default function WhatToFixBeforeSellingAHousePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Costs and rules vary, check yours before spending">
        <p>
          Trade prices, renovation costs and disclosure rules vary by state,
          suburb and the condition of your home. Treat every figure here as
          indicative, get written quotes from local trades, and confirm your
          state&rsquo;s disclosure requirements with your conveyancer before
          you list.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The question I get more than almost any other is &ldquo;should I
          renovate the kitchen before we sell?&rdquo; and the answer is almost
          always no. Sellers consistently spend money in the wrong order:
          big-ticket renovations that buyers repaint over anyway, while a
          $60 dripping tap and a mouldy bathroom ceiling quietly cost them
          five figures at the negotiating table. Fix what scares buyers,
          freshen what they see, and leave the rest to the next owner.
        </p>
      </EditorNote>

      <h2 id="the-rule">The one rule that decides everything</h2>
      <p className="lead">
        Pre-sale spending splits into three buckets. Defects that scare buyers,
        which you fix. Cosmetic presentation, which you do cheaply and well.
        And renovations, which you almost always skip, because buyers pay you
        back cents on the dollar for your taste in benchtops.
      </p>
      <p>
        The logic is simple: a buyer walking through your home is pricing risk
        as much as they&rsquo;re pricing floor space. A water stain on the
        ceiling isn&rsquo;t a $300 plumbing fix in their head, it&rsquo;s
        &ldquo;what else is wrong with this place?&rdquo;, a discounted offer,
        or a building report renegotiation later. Visible defects get mentally
        priced at several times their actual repair cost. Presentation works
        the same way in reverse: a freshly painted, well-lit, tidy home reads
        as cared-for, and buyers pay a premium for the feeling that nothing
        needs doing.
      </p>
      <p>
        Everything below is that rule applied room by room, with the legal
        minimums and the traps.
      </p>

      <h2 id="buyer-turnoffs">The buyer-turnoff list (fix these first)</h2>
      <p>
        These are the defects that reliably kill offers or hand the buyer a
        renegotiation lever. Most are cheap relative to the fear they create:
      </p>
      <ul>
        <li><strong>Roof leaks and broken tiles.</strong> A ceiling water stain is the single biggest &ldquo;what else is wrong?&rdquo; trigger. Repair the roof, then paint the stain with a stain-blocking sealer, painting over it without fixing the leak is concealment, not presentation.</li>
        <li><strong>Mould and damp.</strong> Mould on bathroom ceilings, in wardrobes or on south-facing walls reads as a health risk, and in some states an unaddressed problem can feed into disclosure obligations. Treat the cause (ventilation, leaks, drainage), not just the surface.</li>
        <li><strong>Cracked render and large wall cracks.</strong> Hairline cracks are normal; cracks you can fit a coin into make buyers think &ldquo;structural&rdquo; and inspectors write them up. Get a builder&rsquo;s opinion before patching so you know what you&rsquo;re dealing with.</li>
        <li><strong>Rotten timber.</strong> Fascias, window sills, deck boards and stair treads. Rot is cheap to replace in sections and disproportionately alarming left alone.</li>
        <li><strong>Dripping taps, running toilets, low water pressure.</strong> Ten-minute plumber jobs that, left undone, suggest years of deferred maintenance.</li>
        <li><strong>Doors and windows that stick or don&rsquo;t lock.</strong> Buyers open everything at inspections. A window that won&rsquo;t open reads as either rot or movement.</li>
        <li><strong>Obvious electrical faults.</strong> Dead power points, hanging wires, buzzing switches. Anything DIY-looking will be flagged as non-compliant in a building report, use a licensed electrician.</li>
        <li><strong>Signs of termites.</strong> Mud tubes, hollow-sounding timber, damaged skirting. Get a pest inspection and treatment before a buyer&rsquo;s inspector finds it first.</li>
      </ul>
      <p>
        None of this is glamorous, and almost all of it costs hundreds rather
        than thousands. It&rsquo;s the highest-return money on this page.
      </p>

      <h2 id="legal-minimum">What you legally have to fix or disclose</h2>
      <p>
        Beyond what&rsquo;s smart, there&rsquo;s what&rsquo;s required, and it
        differs by state. Three examples worth knowing before you list:
      </p>
      <ul>
        <li>
          <strong>Queensland: smoke alarms.</strong> For sale contracts signed
          from 1 January 2022, the home must be fitted with interconnected
          photoelectric smoke alarms (compliant with AS&nbsp;3786:2014) before
          transfer, and the seller declares compliance on the transfer form.
          If your alarms are the old standalone type, budget for the upgrade
          as a non-negotiable pre-sale cost.
        </li>
        <li>
          <strong>NSW: pool certificates and material facts.</strong> Selling
          a home with a pool or spa generally means attaching a valid
          certificate of compliance, a relevant occupation certificate, or a
          certificate of non-compliance to the contract, without one the buyer
          can rescind within 14 days of exchange. Separately, agents must
          disclose prescribed material facts, including flooding or bushfire
          affecting the property within the last five years, loose-fill
          asbestos, and significant health or safety risks.
        </li>
        <li>
          <strong>Victoria: the section 32.</strong> The vendor statement you
          must give buyers before they sign has to be accurate and complete.
          If it contains incorrect or insufficient information, the buyer may
          be able to withdraw from the sale or take legal action.
        </li>
      </ul>
      <p>
        The practical takeaway: where a defect is cheap to fix, fixing it is
        usually simpler than disclosing it, and concealing a known problem is
        never an option in any state. Your conveyancer will confirm exactly
        what your contract needs, our{" "}
        <Link href="/guides/conveyancing-guide">conveyancing guide</Link>{" "}
        covers what they do on the sell side.
      </p>

      <h2 id="inspectors">What building inspectors flag</h2>
      <p>
        Most buyers will commission a building and pest inspection, and in
        some states a report is attached or expected up front. The recurring
        items in reports are remarkably consistent:
      </p>
      <ul>
        <li>Roof defects: cracked or slipped tiles, rusted flashings and valleys, blocked or sagging gutters</li>
        <li>Moisture: rising damp, leaking showers, poor subfloor ventilation</li>
        <li>Cracking: movement cracks in walls, render and brickwork</li>
        <li>Termite damage or active termites</li>
        <li>Site drainage: water pooling against the slab or footings</li>
        <li>Non-compliant work: DIY electrical, plumbing or unapproved structures</li>
        <li>Deteriorating subfloor framing and stumps</li>
      </ul>
      <p>
        Anything labelled a <strong>major defect</strong> becomes a
        renegotiation lever or an excuse to walk away, usually at the worst
        possible moment, after you&rsquo;ve mentally banked the offer.
      </p>

      <KeyFigure
        value="$400–$900"
        label="Typical cost of a combined building and pest inspection, depending on state and property size."
        context="Getting your own before listing removes mid-campaign surprises"
      />

      <p>
        That&rsquo;s why a <strong>pre-sale inspection on your own home</strong>{" "}
        is one of the cheapest pieces of insurance in the whole campaign. You
        find out exactly what a buyer&rsquo;s inspector will find, fix the
        cheap items, and price the rest into your expectations instead of
        having them extracted from you in a renegotiation. Our{" "}
        <Link href="/guides/building-pest-inspection">building and pest inspection guide</Link>{" "}
        covers what&rsquo;s checked and what reports cost in each state.
      </p>

      <MatchCTA kind="builder" />

      <h2 id="cosmetic-wins">Cosmetic wins under $5,000</h2>
      <p>
        Once the scary stuff is fixed, presentation is where each dollar works
        hardest. The whole list below fits inside $5,000 for most homes:
      </p>
      <ul>
        <li>
          <strong>Paint.</strong> The most reliable pre-sale spend there is.
          Repainting a typical three-bedroom interior costs roughly $2,500 to
          $8,000 depending on size, condition and region, and single rooms run
          a few hundred dollars each, so if the budget is tight, do the entry,
          hallway, living areas and any room with bold or dated colours. Light
          neutrals, always.
        </li>
        <li>
          <strong>Lighting.</strong> Swap dated fittings for simple modern
          ones and put warm-white LED globes throughout. A few hundred dollars
          changes how every room photographs, and listing photos are your
          first open home.
        </li>
        <li>
          <strong>Street appeal.</strong> Mow, edge, mulch, prune, pressure-wash
          the driveway and paths, repaint or oil the front door, new house
          numbers and doormat. A hard weekend plus a few hundred dollars in
          materials, and it sets the buyer&rsquo;s expectation before they
          reach the front step.
        </li>
        <li>
          <strong>Bathroom and kitchen mini-refresh.</strong> Re-caulk the
          shower and bath, replace mouldy grout, new tapware, new cabinet
          handles, a clean or replaced shower screen. Hundreds, not thousands,
          and it takes &ldquo;tired&rdquo; off the table.
        </li>
        <li>
          <strong>Deep clean and declutter.</strong> The cheapest item here
          and arguably the most powerful. Windows, carpets, oven, grout.
          Remove half the furniture and most personal items so rooms read
          bigger.
        </li>
      </ul>

      <PullQuote attribution="Andy McMaster, Editor">
        Paint is the only renovation that reliably pays for itself at sale.
        Almost everything bigger, you&rsquo;re renovating for the next owner
        with your own money.
      </PullQuote>

      <h2 id="skip-list">Renovations that don&rsquo;t pay back</h2>
      <p>
        The renovations sellers most want to do are the ones least likely to
        return their cost at sale:
      </p>
      <ul>
        <li>
          <strong>Full kitchen renovations.</strong> Commonly $20,000 to
          $50,000 or more depending on size and finishes. Buyers pay for their
          own taste, not yours, and many will replace a brand-new kitchen
          anyway. A cosmetic refresh (repainted cabinets, new handles and
          tapware, a replacement benchtop) captures most of the lift for a
          fraction of the cost.
        </li>
        <li>
          <strong>Full bathroom renovations.</strong> Typically $15,000 to
          $30,000 once waterproofing and tiling are done properly. Same
          logic: re-grout, re-caulk and update fittings instead.
        </li>
        <li>
          <strong>Extensions and structural rework.</strong> Long timelines,
          budget blowouts, and a sale price that reflects the suburb ceiling
          rather than your build cost.
        </li>
        <li>
          <strong>Swimming pools.</strong> Expensive to build, polarising to
          buyers (many families see maintenance and fencing obligations, not
          lifestyle), and they add compliance paperwork to your contract in
          most states.
        </li>
        <li>
          <strong>High-end landscaping.</strong> Structured gardens,
          retaining walls and outdoor kitchens cost tens of thousands; tidy
          and green is what buyers actually respond to.
        </li>
      </ul>
      <p>
        The pattern: anything where the money disappears into someone
        else&rsquo;s taste or into the ground rarely comes back. Our{" "}
        <Link href="/guides/renovation-cost-australia-2026">renovation cost guide</Link>{" "}
        has the full room-by-room numbers if you want to sanity-check a quote.
      </p>

      <h2 id="overcapitalisation">The over-capitalisation trap</h2>
      <p>
        Over-capitalisation is spending more on a property than the market
        will give you back, and pre-sale renovations are where it happens
        most. Every suburb has a realistic price band for each property type.
        Buyers paying top-of-band prices are buying the suburb, the land and
        the location; once your home presents well enough to compete at the
        top of that band, every extra renovation dollar mostly comes straight
        off your profit.
      </p>
      <p>
        The test is straightforward: look at what fully renovated homes like
        yours have actually sold for in your suburb in the last six months.
        That number, not your build cost, is your ceiling. If comparable
        renovated homes sell for $950,000 and yours would fetch $880,000
        as-is, spending $120,000 on a renovation to close a $70,000 gap is a
        guaranteed loss.
      </p>

      <Callout variant="info" title="Know your ceiling before you spend a dollar">
        <p>
          The cheapest way to avoid over-capitalising is to find out what your
          home is worth now, and what it would be worth with the work done. A{" "}
          <Link href="/appraisal">free property appraisal</Link> from a vetted
          local agent gives you both numbers with comparable sales evidence,
          before you commit to any spend. No obligation to list.
        </p>
      </Callout>

      <h2 id="room-by-room">Room-by-room priority order</h2>
      <p>
        Budget always runs out before the to-do list does, so spend in the
        order buyers experience the home:
      </p>
      <ol>
        <li><strong>Facade and front garden.</strong> The listing photo and the first 60 seconds of every inspection. Paint, tidy, pressure-wash.</li>
        <li><strong>Entry and hallway.</strong> Fresh paint, good lighting, nothing stored in it.</li>
        <li><strong>Living areas.</strong> Paint, declutter, maximise light. This is where buyers linger and imagine living.</li>
        <li><strong>Kitchen.</strong> Refresh, don&rsquo;t replace: handles, tapware, benchtop if genuinely damaged, everything sparkling.</li>
        <li><strong>Main bathroom.</strong> Grout, caulk, fittings, ventilation. Mould here undoes everything else.</li>
        <li><strong>Main bedroom.</strong> Paint and decluttered wardrobes (buyers open them).</li>
        <li><strong>Outdoor living.</strong> Oil the deck, wash the furniture, make the space usable.</li>
        <li><strong>Secondary bedrooms, laundry, garage.</strong> Clean, functional and empty is enough. Money here is rarely repaid.</li>
      </ol>

      <h2 id="sell-as-is">When to sell as-is instead</h2>
      <p>
        Sometimes the right amount of pre-sale work is almost none. Selling
        as-is makes sense when:
      </p>
      <ul>
        <li><strong>The repairs cost more than they add.</strong> Restumping, rewiring, major structural work. If a $90,000 fix adds $60,000 of value, price the home accordingly and let the buyer take the project on.</li>
        <li><strong>The value is in the land.</strong> If the likely buyer is a renovator, builder or developer, presentation spend is wasted, they&rsquo;re buying position and potential, not your new carpet.</li>
        <li><strong>Time matters more than margin.</strong> Deceased estates, divorce, interstate moves. A clean, honest as-is sale with realistic pricing often nets more than a rushed half-renovation.</li>
        <li><strong>You&rsquo;re already at the ceiling.</strong> If comparable sales say your home is near the top of its band as-is, spend a weekend cleaning and nothing more.</li>
      </ul>
      <p>
        Selling as-is doesn&rsquo;t mean hiding anything, disclosure rules
        still apply, and an experienced local agent will price and market a
        project home to the right buyer pool. If you&rsquo;re weighing it up,
        an <Link href="/appraisal">appraisal of the as-is price</Link> versus
        the repaired price is the comparison that settles it, and our{" "}
        <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
        covers how to find an agent who&rsquo;s sold homes like yours.
      </p>

      <h2 id="next-steps">Where to start</h2>
      <p>Here&rsquo;s the order that protects the most money:</p>
      <ol>
        <li>
          <strong>Get the ceiling first.</strong> A{" "}
          <Link href="/appraisal">free appraisal</Link> tells you what your
          home is worth now and what the suburb&rsquo;s realistic top looks
          like, so every repair decision has a number behind it.
        </li>
        <li>
          <strong>Find out what a buyer&rsquo;s inspector will find.</strong>{" "}
          A pre-sale{" "}
          <Link href="/guides/building-pest-inspection">building and pest inspection</Link>{" "}
          costs a few hundred dollars and removes the mid-campaign surprise.
        </li>
        <li>
          <strong>Fix the turnoff list, then stop.</strong> Roof, damp, cracks,
          rot, taps, locks. Then the under-$5,000 cosmetic pass: paint, light,
          landscape, clean.
        </li>
        <li>
          <strong>Line up the right people.</strong> A vetted local agent and
          trades you can trust, our{" "}
          <Link href="/find-an-expert">find an expert</Link> service covers
          both, and the{" "}
          <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link>{" "}
          maps every other fee between here and settlement.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={PRE_SALE_FIX_SOURCES} />
    </GuideArticleLayout>
  );
}

const PRE_SALE_FIX_SOURCES: readonly SourceItem[] = [
  { label: "NSW Fair Trading: Misrepresentation and material facts", href: "https://www.nsw.gov.au/housing-and-construction/property-professionals/working-as-an-agent/misrepresentation", note: "Prescribed material facts including flooding, bushfire, loose-fill asbestos and health or safety risks" },
  { label: "NSW Fair Trading: Sales contract requirements", href: "https://www.nsw.gov.au/housing-and-construction/property-professionals/working-as-an-agent/sales-contracts", note: "Pool compliance certificates and prescribed contract documents; 14-day rescission right" },
  { label: "Queensland Fire Department: Smoke alarms", href: "https://www.fire.qld.gov.au/prepare/fire/smoke-alarms", note: "Interconnected photoelectric smoke alarm requirements for homes being sold, AS 3786:2014" },
  { label: "Consumer Affairs Victoria: Conveyancing and contracts for sellers", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/selling-property/conveyancing-and-contracts-for-sellers", note: "Section 32 vendor statement accuracy requirements" },
  { label: "HIA: Kitchens and Bathrooms Report", href: "https://hia.com.au/our-industry/economics/data-forecasts/resource/kitchens-and-bathrooms-report", note: "Renovation activity across Australia's $11+ billion kitchen and bathroom sector" },
];
