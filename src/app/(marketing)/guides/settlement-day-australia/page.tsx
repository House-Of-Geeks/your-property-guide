import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  GuideNewsletterCallout,
  EditorNote,
  PullQuote,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "What happens on settlement day in Australia (2026 walkthrough)",
  description:
    "Settlement day in plain English: who does what, the order things happen, what can delay it, the final inspection, the funds flow and when you actually get the keys. State-by-state notes for NSW, VIC, QLD, WA, SA, TAS, ACT and NT.",
  slug: "settlement-day-australia",
  publishedAt: "2026-05-18",
  updatedAt: "2026-05-18",
  readingTimeMinutes: 12,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
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
  "Settlement is the day legal ownership of the property transfers from the vendor to you, and funds transfer from your lender to the vendor. Almost all settlements in Australia now happen electronically via PEXA.",
  "You don't need to be physically present. Your conveyancer or solicitor represents you. Your lender attends digitally. You collect the keys from the selling agent once settlement is confirmed.",
  "Typical settlement length is 30 to 90 days from exchange of contracts; 30 to 45 days is the most common. The vendor and buyer agree on the date at contract signing.",
  "Final inspection happens in the 5 to 7 days before settlement. You're checking the property is in the same condition as when you bought it, with all included chattels still present.",
  "Things that can delay settlement: lender unable to release funds on time, last-minute title issues, missing rates or strata clearances, vendor moves out late, or PEXA workspace not signed by all parties.",
  "If settlement is delayed by your side, you pay default interest (typically 8 to 12 per cent of the purchase price, prorated daily) until the deal completes. If it's delayed by the vendor, they may owe you the same.",
  "Stamp duty is usually paid through your conveyancer at settlement, included in the funds flow. First home buyers eligible for concessions need the paperwork lodged before settlement.",
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",          label: "Overview: what settlement actually is" },
  { id: "timeline",          label: "Settlement timeline from exchange to keys" },
  { id: "pexa",              label: "PEXA and how electronic settlement works" },
  { id: "who-does-what",     label: "Who does what on settlement day" },
  { id: "final-inspection",  label: "The pre-settlement final inspection" },
  { id: "funds-flow",        label: "The funds flow on settlement day" },
  { id: "delays",            label: "What can delay settlement" },
  { id: "default-interest",  label: "Default interest if you cause a delay" },
  { id: "after-settlement",  label: "After settlement: getting the keys, council notices, insurance" },
  { id: "state-notes",       label: "State-by-state notes" },
];

const FAQS: FaqItem[] = [
  {
    question: "How long does settlement take in Australia?",
    answer:
      "Settlement length is agreed at contract signing and typically ranges from 30 to 90 days. Most settlements are 30 to 45 days. Shorter settlements (14 or 21 days) are sometimes negotiated when both parties want to move quickly; longer ones (60 to 90 days) suit vendors who need time to find their next home. Once you're on settlement day itself, the electronic settlement via PEXA usually completes in 30 to 90 minutes.",
  },
  {
    question: "Do I need to attend settlement?",
    answer:
      "No. Your conveyancer or solicitor represents you in the electronic PEXA workspace and handles every step. Your lender attends digitally. The selling agent holds the keys until settlement is confirmed. Your only physical involvement is collecting the keys after the agent gets the confirmation message, usually within an hour of settlement clearing.",
  },
  {
    question: "What happens at the final inspection before settlement?",
    answer:
      "The final inspection happens in the 5 to 7 days before settlement. You walk through the property with the agent and check: the property is in the same condition as when you signed (allowing for fair wear and tear), all included chattels (dishwasher, blinds, garden shed, anything on the contract) are still present and working, no new damage, the gardens haven't been stripped, and the swimming pool equipment / water tanks / solar systems are operational. If anything is missing or broken, raise it with your conveyancer immediately, before settlement clears.",
  },
  {
    question: "What if settlement is delayed?",
    answer:
      "If you cause the delay (for example, your lender can't release funds on time), you pay the vendor default interest on the unpaid balance, typically at 8 to 12 per cent per annum, prorated daily. On a $700,000 unpaid balance at 10 per cent, that's about $192 per day. The vendor can also issue a notice to complete, demanding settlement within 14 days; if you still can't settle, they can terminate and keep your deposit. If the vendor causes the delay, the same default interest can apply against them.",
  },
  {
    question: "When do I get the keys?",
    answer:
      "Once PEXA confirms settlement has cleared, your conveyancer notifies the selling agent. The agent releases the keys to you, usually within an hour. Some agents will give you the keys when you arrive at their office; others wait for the confirmation email. Bring photo ID. Plan moving in for the day after settlement at the earliest, in case the day-of settlement is delayed.",
  },
  {
    question: "Who pays for water, council rates and strata on settlement day?",
    answer:
      "These are adjusted on settlement day by your conveyancer. The vendor pays for the days they owned the property in the current billing period; you pay for the days from settlement onwards. The adjustment is typically a few hundred dollars in either direction and shows on the settlement statement your conveyancer prepares.",
  },
  {
    question: "Do I need building insurance from the day of settlement?",
    answer:
      "Earlier in most states. Risk transfers to the buyer at different points depending on jurisdiction. In NSW, ACT and the NT, risk transfers at exchange. In VIC, QLD, SA, TAS and WA, risk typically transfers at settlement, but standard practice is to take out building insurance from the date of exchange to be safe. For strata properties, the body corporate carries the building insurance; you only need contents.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "How to buy property in Australia",       href: "/guides/buying-property-australia", description: "The full ten-step buying process from finance to settlement." },
  { title: "Conveyancing guide",                      href: "/guides/conveyancing-guide", description: "What conveyancers do, what they cost, when to use a solicitor instead." },
  { title: "Cooling-off period by state",             href: "/guides/cooling-off-period-by-state-australia", description: "The window after exchange but before settlement where you can still walk away." },
  { title: "Building & pest inspection",              href: "/guides/building-pest-inspection", description: "The pre-exchange inspection that catches structural issues before you're locked in." },
  { title: "Bridging loans guide",                    href: "/guides/bridging-loans-guide", description: "How bridging finance works when settlement on your new home is before sale of your existing one." },
  { title: "Stamp duty calculator",                   href: "/stamp-duty-calculator", description: "Estimate the duty payable at settlement for your state and price." },
];

export default function SettlementDayAustraliaPage() {
  return (
    <>
      <HowToJsonLd
        name="Settlement day process in Australia"
        description="The seven-step electronic settlement process for Australian residential property purchases, from booking the final inspection through to collecting the keys."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Book the pre-settlement final inspection",  text: "Schedule the inspection with the selling agent for 5 to 7 days before settlement.", },
          { name: "Confirm finance is ready to release",       text: "Your conveyancer confirms with your lender that funds are scheduled for release on settlement day.", url: "/guides/home-loan-pre-approval-australia" },
          { name: "Sign into the PEXA workspace",              text: "Your conveyancer and the vendor's conveyancer both sign and prepare the workspace 1 to 2 days before settlement." },
          { name: "Lock the workspace and authorise settlement", text: "On settlement day, all parties (lenders, conveyancers, sometimes the state revenue office) lock and authorise the workspace." },
          { name: "Funds and title transfer simultaneously",   text: "PEXA orchestrates the simultaneous transfer of funds to the vendor and registration of title in your name." },
          { name: "Receive the keys",                          text: "The selling agent receives the settlement confirmation and releases the keys to you, usually within the hour." },
          { name: "Update utilities, insurance and council",   text: "Take meter readings, transfer electricity and gas accounts, confirm building insurance, and notify council of the change of ownership." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="General information, not legal advice">
        <p>
          This guide covers the standard electronic settlement process for
          residential property in Australia. Conveyancing law and contract
          conditions vary by state. Always work with a licensed{" "}
          <Link href="/guides/conveyancing-guide">conveyancer</Link> or
          solicitor in the state where the property is located.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Settlement day is the part of buying a home almost nobody
          prepares for. You spent six months on inspections, finance and
          contract review; the actual transfer of ownership happens in 90
          minutes on a Tuesday afternoon, electronically, without you in
          the room. This guide walks through exactly what is happening
          while you wait for the keys.
        </p>
      </EditorNote>

      <h2 id="overview">Overview: what settlement actually is</h2>
      <p className="lead">
        Settlement is the day the property legally becomes yours. Funds
        transfer from your lender to the vendor, title is registered in your
        name, and the keys are released. Everything else in the buying
        process, from pre-approval through to exchange of contracts, has
        been leading to this one event.
      </p>
      <p>
        Almost every property settlement in Australia now happens
        electronically through a platform called PEXA (Property Exchange
        Australia). Paper settlement still exists for some edge cases, but
        the standard process is digital, and almost everyone in the chain,
        your conveyancer, your lender, the vendor&rsquo;s conveyancer, the
        state revenue office, is logged in to the same online workspace.
      </p>
      <p>
        The good news: as the buyer, your role on settlement day itself is
        minimal. The hard work was done in the lead-up. The actual
        settlement event runs 30 to 90 minutes and you don&rsquo;t need to
        be present for any of it.
      </p>

      <h2 id="timeline">Settlement timeline from exchange to keys</h2>
      <p>
        Settlement length is agreed at the contract of sale and runs from
        the date of exchange (when both parties sign the contract) through
        to settlement day itself. Standard settlement lengths in Australia:
      </p>
      <ul>
        <li><strong>14 to 21 days:</strong> short, sometimes used in fast markets or when both parties are ready</li>
        <li><strong>30 days:</strong> common minimum in most metro markets</li>
        <li><strong>30 to 45 days:</strong> the most common range, gives both sides time to organise</li>
        <li><strong>60 days:</strong> typical when the vendor needs time to find their next home</li>
        <li><strong>90 days:</strong> longer, often used when the vendor is selling to relocate interstate</li>
      </ul>
      <p>
        In the 30 to 45 day window between exchange and settlement, a lot
        happens. Your conveyancer lodges searches (title, rates, strata if
        applicable). Your lender finalises formal loan approval and
        prepares funds for release. You arrange building insurance to
        commence at exchange (most lenders require it). Stamp duty is
        calculated and the paperwork lodged. First home buyer concession
        applications are submitted to the state revenue office. The vendor
        organises their move-out and rates / strata payouts.
      </p>
      <KeyFigure
        value="30 to 90 min"
        label="Typical duration of the electronic settlement event itself"
        context="Once parties have signed into the PEXA workspace and locked it"
      />

      <h2 id="pexa">PEXA and how electronic settlement works</h2>
      <p>
        PEXA is the digital platform that runs almost every Australian
        property settlement. Think of it as a shared workspace where every
        party in the deal logs in, signs documents, and authorises the
        funds and title transfer.
      </p>
      <p>
        The parties in the workspace are typically:
      </p>
      <ul>
        <li>Your conveyancer or solicitor</li>
        <li>The vendor&rsquo;s conveyancer or solicitor</li>
        <li>Your lender (for the new mortgage)</li>
        <li>The vendor&rsquo;s lender (to discharge their existing mortgage)</li>
        <li>The state revenue office (for stamp duty and title registration)</li>
      </ul>
      <p>
        In the 1 to 2 days before settlement, all parties sign their
        portion of the workspace. On settlement day, the workspace is
        locked and the actual settlement event runs: funds transfer
        simultaneously with title registration, stamp duty payment, and
        discharge of the vendor&rsquo;s existing mortgage. PEXA orchestrates
        all of it in a single atomic transaction.
      </p>
      <p>
        If any one party is not ready (a lender hasn&rsquo;t signed, a
        conveyancer hasn&rsquo;t lodged a required document), the workspace
        can&rsquo;t lock and settlement is delayed.
      </p>

      <h2 id="who-does-what">Who does what on settlement day</h2>
      <p>
        Each party in the transaction has a specific role.
      </p>

      <h3>You (the buyer)</h3>
      <p>
        Almost nothing on settlement day itself. Your role was done in the
        lead-up: signing documents, transferring the balance of the deposit
        and your contribution toward stamp duty, and completing the final
        inspection. On settlement day, you wait for the call or text from
        the selling agent to say settlement has cleared and you can pick
        up the keys.
      </p>

      <h3>Your conveyancer or solicitor</h3>
      <p>
        Manages the entire PEXA workspace on your behalf. Signs documents,
        coordinates with your lender, calculates and lodges stamp duty,
        applies for any first-home buyer concessions, adjusts council
        rates and strata fees, and confirms settlement to you and the
        selling agent. See the full{" "}
        <Link href="/guides/conveyancing-guide">conveyancing guide</Link>{" "}
        for everything they handle.
      </p>

      <h3>Your lender</h3>
      <p>
        Prepares your loan funds for release on settlement day. Signs the
        PEXA workspace. Releases the funds at the locked-settlement step.
        Registers the new mortgage on the title.
      </p>

      <h3>The vendor&rsquo;s lender</h3>
      <p>
        Calculates the payout figure for the vendor&rsquo;s existing
        mortgage (if any), discharges the mortgage at settlement, and
        receives the payout funds.
      </p>

      <h3>The selling agent</h3>
      <p>
        Holds the keys (and any garage remotes, alarm codes, mailbox keys)
        until settlement clears, then releases them to you. The selling
        agent is also the contact for the final inspection.
      </p>

      <h2 id="final-inspection">The pre-settlement final inspection</h2>
      <p>
        The final inspection happens in the 5 to 7 days before settlement.
        You walk through the property with the selling agent and check
        that:
      </p>
      <ul>
        <li>The property is in substantially the same condition as when you signed the contract, allowing for fair wear and tear from the vendor still living there.</li>
        <li>All included chattels on the contract (dishwasher, oven, blinds, ducted heating, garden shed, swimming pool equipment, water tanks, solar systems, anything specified) are still present and operational.</li>
        <li>No new damage has appeared since exchange.</li>
        <li>The gardens haven&rsquo;t been stripped of plants or fixtures that were part of the sale.</li>
        <li>Any conditions on the contract that were to be met before settlement (repairs, removal of items, completion of works) have been completed.</li>
      </ul>
      <Callout variant="info" title="Document everything">
        <p>
          Take photos and video at the final inspection. If something is
          missing, damaged or broken that should have been there or
          working, raise it with your conveyancer immediately, before
          settlement clears. Once settlement has cleared, your leverage
          drops dramatically; you can still pursue the vendor for breach
          of contract, but the process is slow and expensive. Catching it
          before settlement lets your conveyancer hold up the funds and
          negotiate a settlement adjustment.
        </p>
      </Callout>

      <PullQuote attribution="Andy McMaster, Editor">
        Catch a missing dishwasher before settlement clears and the
        vendor adjusts the price. Catch it after, and you&rsquo;re in
        court.
      </PullQuote>

      <h2 id="funds-flow">The funds flow on settlement day</h2>
      <p>
        On settlement day, several flows happen simultaneously inside the
        PEXA workspace:
      </p>
      <ol>
        <li><strong>Your lender releases the loan funds</strong> (purchase price minus your deposit, plus any costs you&rsquo;ve asked them to add to the loan).</li>
        <li><strong>You contribute the balance</strong> (your deposit was already paid at exchange; you also fund stamp duty and any conveyancing fees that aren&rsquo;t being capitalised into the loan).</li>
        <li><strong>Stamp duty is paid</strong> to the state revenue office directly from the workspace.</li>
        <li><strong>The vendor&rsquo;s existing mortgage is discharged</strong>: their lender receives the payout figure and the mortgage is removed from title.</li>
        <li><strong>The vendor receives the balance</strong>: purchase price minus their mortgage payout minus any rates / strata adjustments minus the selling agent&rsquo;s commission.</li>
        <li><strong>Council rates and strata fees are adjusted</strong>: the vendor pays for the days they owned the property in the current billing period; you pay from settlement onwards.</li>
        <li><strong>Title transfers into your name</strong> and the new mortgage is registered.</li>
      </ol>
      <p>
        Your conveyancer prepares a settlement statement showing every
        adjustment. Review it carefully; small errors (incorrect rates
        period, missing strata levy, wrong stamp duty calculation) are
        easier to fix before settlement than after.
      </p>

      <GuideNewsletterCallout
        title="Settlement day next month? Get the quarterly read"
        subtitle="One email a quarter covering RBA decisions, capital city outlooks and the regulatory changes that affect every settlement. No spam."
      />

      <h2 id="delays">What can delay settlement</h2>
      <p>
        Settlement delays are unfortunately common. The most frequent
        causes:
      </p>
      <ul>
        <li><strong>Lender funds not ready:</strong> the most common cause. Your lender hasn&rsquo;t finalised formal approval, or the funds aren&rsquo;t in the workspace by the locked-settlement time.</li>
        <li><strong>Title search issues:</strong> a caveat, easement or restriction on title that wasn&rsquo;t resolved in the lead-up.</li>
        <li><strong>Strata or rates clearance certificates missing:</strong> the vendor hasn&rsquo;t obtained these in time.</li>
        <li><strong>Vendor hasn&rsquo;t moved out:</strong> if the vendor is still in the property at settlement, you can&rsquo;t take possession even after settlement clears legally.</li>
        <li><strong>PEXA workspace not signed:</strong> any party hasn&rsquo;t signed their portion of the workspace before locking.</li>
        <li><strong>Stamp duty paperwork incomplete:</strong> first home buyer concessions sometimes require additional documents from the state revenue office.</li>
      </ul>
      <p>
        If a delay looks likely, your conveyancer will notify the
        vendor&rsquo;s conveyancer ahead of settlement day. Most delays
        push settlement out by 1 to 3 business days.
      </p>

      <h2 id="default-interest">Default interest if you cause a delay</h2>
      <p>
        If you cause the delay, the contract typically requires you to pay
        the vendor default interest on the unpaid balance, at a rate
        specified in the contract (usually 8 to 12 per cent per annum,
        prorated daily). On a $700,000 unpaid balance at 10 per cent
        default interest, that&rsquo;s about $192 per day.
      </p>
      <p>
        If the delay continues beyond a few days, the vendor can issue a
        notice to complete, giving you typically 14 days to settle or face
        termination. If you still can&rsquo;t settle, the vendor can
        terminate the contract and keep your deposit. Conversely, if the
        vendor causes the delay, the same default interest provisions can
        apply against them.
      </p>

      <h2 id="after-settlement">After settlement: keys, council notices, insurance</h2>
      <p>
        Settlement has cleared, you have the keys, and the property is
        legally yours. There are a few housekeeping items to take care of
        in the first 1 to 2 weeks:
      </p>
      <ul>
        <li>
          <strong>Building and contents insurance:</strong> confirm
          building insurance is active from settlement date (or earlier,
          if your state transfers risk at exchange). For strata
          properties, contents-only is enough; the body corporate covers
          building.
        </li>
        <li>
          <strong>Utilities:</strong> transfer or open electricity, gas,
          water, and internet accounts in your name. Take photos of meter
          readings at settlement; some retailers ask for them.
        </li>
        <li>
          <strong>Council notice of change of ownership:</strong> most
          conveyancers lodge this for you; confirm with them. Future
          rates notices will come to you directly.
        </li>
        <li>
          <strong>Strata body (if applicable):</strong> notify them of
          the change of ownership and your contact details. You&rsquo;ll
          be invited to the next AGM.
        </li>
        <li>
          <strong>Mail redirection:</strong> Australia Post offers a
          paid redirection service. Worth setting up for 6 to 12 months.
        </li>
        <li>
          <strong>Locks:</strong> at minimum, change the front door lock.
          You don&rsquo;t know who else has keys.
        </li>
      </ul>

      <h2 id="state-notes">State-by-state notes</h2>
      <p>
        Settlement is broadly the same across Australia, but a few
        state-specific quirks matter.
      </p>

      <h3>New South Wales</h3>
      <p>
        Risk transfers to the buyer at exchange, not settlement. You need
        building insurance from the day of exchange. Standard settlement
        is 42 days but can be shorter or longer. Stamp duty is paid at
        settlement and is one of the highest in Australia for non-FHB
        purchases.
      </p>

      <h3>Victoria</h3>
      <p>
        Risk typically transfers at settlement, not exchange, though
        contracts can vary. Section 32 vendor statement must have been
        provided before contract signing. Default settlement length is
        often 60 days unless otherwise agreed.
      </p>

      <h3>Queensland</h3>
      <p>
        QLD uses a standard REIQ contract. The cooling-off period is 5
        business days from exchange (unless waived). Final inspection is
        standard practice in the 5 days before settlement.
      </p>

      <h3>Western Australia</h3>
      <p>
        No statutory cooling-off period for residential property in WA, so
        more due diligence is done before contract signing. Settlement is
        coordinated through Landgate.
      </p>

      <h3>South Australia</h3>
      <p>
        Cooling-off is 2 clear business days from receipt of contract.
        Land tax and emergency services levy are adjusted at settlement
        in addition to council rates.
      </p>

      <h3>Tasmania</h3>
      <p>
        Cooling-off is 3 business days. Settlements are coordinated
        through the Land Titles Office, increasingly via PEXA.
      </p>

      <h3>ACT</h3>
      <p>
        Properties in the ACT are held under a 99-year Crown lease rather
        than freehold title. Lease rent isn&rsquo;t payable but ground
        rent / land rent applies on some land-rent scheme properties.
        Settlement otherwise mirrors the standard process.
      </p>

      <h3>Northern Territory</h3>
      <p>
        No statutory cooling-off period for private treaty sales. Final
        inspection is standard practice. Stamp duty rates are different
        again; check the NT government calculator.
      </p>

      <MatchCTA kind="buyers-agent" />

      <Sources items={SETTLEMENT_SOURCES} />
    </GuideArticleLayout>
    </>
  );
}

const SETTLEMENT_SOURCES: readonly SourceItem[] = [
  { label: "PEXA: How electronic settlement works", href: "https://www.pexa.com.au/", note: "Workspace mechanics, party roles, settlement flow" },
  { label: "Australian Registrars' National Electronic Conveyancing Council (ARNECC)", href: "https://www.arnecc.gov.au/", note: "Model Operating Requirements for electronic conveyancing nationally" },
  { label: "NSW Land Registry Services: e-Conveyancing", href: "https://www.nswlrs.com.au/", note: "NSW-specific settlement and title transfer rules" },
  { label: "Land Use Victoria: Standard property transfer process", href: "https://www.land.vic.gov.au/", note: "VIC settlement timelines and risk-transfer at settlement" },
  { label: "Titles Queensland: Settlement on a property purchase", href: "https://www.titles.qld.gov.au/", note: "REIQ contract conditions and QLD-specific final-inspection convention" },
  { label: "Australian Banking Association: Mortgage discharge and settlement procedures", note: "Lender obligations on funds release timing" },
];
