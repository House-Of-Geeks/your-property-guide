import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqAccordion } from "@/components/guide/FaqAccordion";
import { AgentEnquiryForm } from "@/components/forms/AgentEnquiryForm";
import { StatNumber } from "@/components/motion/StatNumber";
import { SITE_URL } from "@/lib/constants/seo";
import { guideOgImages } from "@/lib/og/helpers";
import { leadTypePages, type DocketRow } from "@/lib/data/real-estate-leads";
import { CTA_CLASS, Chapter, Clauses, Docket, FinePrint, WhatHappensNext } from "./_parts";
import s from "./real-estate-leads.module.css";

// Agent-facing lead-supply page, "The Docket". Target queries: real estate
// leads, real estate agent leads, real estate lead generation (Australia),
// buy real estate leads, how much do real estate leads cost. Layout and
// chapter flow ported from yourfinanceguide.com.au/finance-leads; the old
// /for-agents URL 301s here (next.config.ts).
//
// Every claim is either a structural fact about how the consumer forms work
// (questions asked before contact details, server-side scoring, already-
// listed vendors never shared, consent at the point of collection) or a
// stated commercial policy (exclusive, pay per lead, 7-day replacement, no
// lock-in; agreed 25 Sep 2026). No conversion-rate claims, and no traffic-
// source claims: leads don't record the landing page yet.

const META_TITLE = "Real Estate Leads for Agents | Exclusive Australian Seller Leads";
const META_DESCRIPTION =
  "Buy exclusive real estate leads from Your Property Guide: opt-in vendor, appraisal and buyer enquiries from Australian homeowners, matched to your suburbs. Pay per lead, no commission share, no lock-in.";

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/real-estate-leads` },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: `${SITE_URL}/real-estate-leads`,
    type: "website",
    images: guideOgImages({
      slug: "real-estate-leads",
      title: "Real estate leads from homeowners who asked for an agent.",
      description: "Exclusive vendor, appraisal and buyer leads. Pay per lead, no commission share, no lock-in.",
    }),
  },
};

/* ── Content ─────────────────────────────────────────────────────────── */

const tickerItems = [
  "Opt-in enquiries only",
  "100% exclusive, one lead one agent",
  "Matched to your suburbs",
  "Qualified before contact details",
  "Already-listed vendors never sold",
  "7-day replacement, no argument",
  "No lock-in, no minimum, no platform fee",
  "No share of your commission",
];

const heroDocket: DocketRow[] = [
  { key: "Received", value: "Tue 8 Sep 2026", note: "· 8:12pm AEST" },
  { key: "Lead type", value: "Vendor lead", note: "· scored hot" },
  { key: "Suburb", value: "North Lakes", note: "· QLD 4509" },
  { key: "Property", value: "House", note: "· 4 bedrooms" },
  { key: "Timeframe", value: "Selling in 0 to 3 months" },
  { key: "Agent status", value: "Haven't started", note: "· no agency agreement signed" },
  { key: "Motivation", value: "Upsizing", note: "· optional, given" },
  { key: "Price in mind", value: "$800k to $900k", note: "· optional, given" },
  { key: "Mobile", value: "04xx xxx xxx" },
  { key: "Came through", value: "Selling guide: seven questions, then the guide" },
];

const ledger: Array<{ feature: string; us: string; them: string }> = [
  {
    feature: "Where it starts",
    us: "A homeowner who found us through search or our own ads, read our suburb data, a commission guide or a selling-costs calculator, then chose to answer the selling questions. Research first, enquiry second.",
    them: "Ads that go straight to a \"what's my home worth\" form, optimised for the cheapest possible form fill.",
  },
  {
    feature: "Qualification",
    us: "Timeframe, agent status, property and price asked before any contact details, then scored hot, warm or cold on our side. Nobody scores themselves.",
    them: "A name, a number and an address. You find out on the call whether they are selling this year or ever.",
  },
  {
    feature: "Already listed",
    us: "Filtered out. A vendor who has signed an agency agreement never becomes a lead.",
    them: "Sold to you anyway, and it is on you to find out.",
  },
  {
    feature: "Consent",
    us: "A plain-English statement at the point they give their details: a local agent will contact you about selling. The form they used is recorded with the lead.",
    them: "A pre-ticked box, or terms buried under the button.",
  },
  {
    feature: "Exclusivity",
    us: "One lead goes to one agent. Never shared, never resold, never recycled as aged data six weeks later.",
    them: "Shared with three to five agents. Then sold again as \"aged\".",
  },
  {
    feature: "Service area",
    us: "Matched to the suburbs and postcodes you told us you sell in.",
    them: "Out-of-area leads sent anyway, and charged for.",
  },
  {
    feature: "What it costs you",
    us: "A per-lead price, agreed in writing before the first lead. Nothing on settlement.",
    them: "Referral platforms take 20 to 30 per cent of your commission, or a flat fee, when the property sells.",
  },
  {
    feature: "Who receives them",
    us: "Your licence or registration is checked on your state's public register before the first lead is sent. We say no.",
    them: "Anyone with a credit card.",
  },
  {
    feature: "When it goes wrong",
    us: "Wrong number, out of area, or already signed with another agent: flag it within 7 days and it is replaced.",
    them: "Varies. Frequently nothing.",
  },
];

const wontPromise = [
  {
    head: "A conversion rate.",
    text: "You will read \"one in three leads lists\" on other pages. We do not know your appraisal skills, your call speed or your follow-up cadence, and neither do they. We will tell you what our partners report, by lead type, once you are one.",
  },
  {
    head: "A volume you can bank on.",
    text: "Enquiry flow follows what Australians are searching for, the selling season and the suburbs you pick. We quote a realistic weekly number for your suburbs before you spend a dollar, and we revise it out loud.",
  },
  {
    head: "A phone-verified tier we do not run.",
    text: "We do not ring every vendor before you do. What you get instead is a consent trail, qualification answers given before contact details, and a homeowner who was told a local agent would call.",
  },
  {
    head: "A listing.",
    text: "We sell an introduction to someone who asked for an agent. The listing is won on the call and at the appraisal, and that part is yours. If a record is a wrong number, out of your area, or already signed elsewhere, it was not a lead, and it is replaced.",
  },
];

const vetting = [
  "You hold a current real estate licence or registration, and it checks out on your state's public register.",
  "You sell in the suburbs you ask for. Recent sales there, not just an office nearby. We would rather send you fewer leads you can list than pad a number.",
  "You can make first contact fast. Speed to lead is the single biggest thing you control, and every homeowner has been told a local agent will be in touch.",
  "You will tell us what lists. Partners who share outcomes get first call on volume, and it tells us which pages produce vendors who sign.",
];

const states = [
  { code: "NSW", name: "New South Wales", note: "Sydney metro, Central Coast, Newcastle, Wollongong, and the regions." },
  { code: "VIC", name: "Victoria", note: "Melbourne metro, Geelong, Ballarat, Bendigo, and the regions." },
  { code: "QLD", name: "Queensland", note: "Brisbane, Moreton Bay, Gold Coast, Sunshine Coast, Townsville, Cairns." },
  { code: "WA", name: "Western Australia", note: "Perth metro, Mandurah, Bunbury, and the regions." },
  { code: "SA", name: "South Australia", note: "Adelaide metro and regional South Australia." },
  { code: "TAS", name: "Tasmania", note: "Hobart, Launceston, and the north-west." },
  { code: "ACT", name: "Australian Capital Territory", note: "Canberra and Queanbeyan." },
  { code: "NT", name: "Northern Territory", note: "Darwin, Palmerston, Alice Springs." },
];

// "Is buying leads legal?" General information, not legal advice.
const laws: string[][] = [
  ["Privacy Act 1988 (Australian Privacy Principles)", "How personal information is collected, used and passed on", "The homeowner should be told at the point of collection who their details go to and why. Passing details to another business for its marketing needs consent, and a business that passes on personal information for a benefit cannot rely on the small business exemption unless the people concerned consented."],
  ["Spam Act 2003", "Commercial emails and SMS", "Messages need consent, must identify you as the sender, and must include a working unsubscribe."],
  ["Do Not Call Register Act 2006", "Telemarketing calls", "Calling a number on the register for marketing needs the person's consent. A homeowner who asked for a local agent to call them about their property has consented to calls about that enquiry."],
];

const supplierQuestions: Array<{ q: string; a: string }> = [
  { q: "Where exactly do the leads come from?", a: "Our own property education site, found through search and our own advertising. Every lead comes through our forms and our qualification questions. No bought lists, no call centres." },
  { q: "Is each lead exclusive, and is my territory?", a: "Each lead goes to one agent. We match by suburb and tell you who else we work with in your area before you start." },
  { q: "What did the person agree to, and where is the record?", a: "A plain statement at the point they gave their details that a local agent will contact them. The form they used is recorded with the lead." },
  { q: "What was asked before the contact form?", a: "On vendor leads: suburb, property, timeframe and agent status, then motivation and price if they choose." },
  { q: "What counts as an invalid lead?", a: "A wrong or disconnected number, outside your suburbs, or already signed with another agent. Not \"chose someone else\" after a fair shot." },
  { q: "How long do I have to flag one?", a: "Seven days from delivery." },
  { q: "Is there a lock-in or minimum?", a: "No. Month to month, with a cap you set and can pause." },
  { q: "How fast will I get each lead?", a: "As it comes in for your suburbs, by email." },
  { q: "What volume should I expect, honestly?", a: "We quote it for your suburbs before you commit, and revise it out loud if it changes." },
  { q: "Do you check who you sell to?", a: "Yes. Your licence or registration on your state's public register, before the first lead." },
];

// Worked numbers for the break-even table in the terms chapter. Commission figures are
// illustrative inputs, not market averages; referral-fee models are the
// platforms' published structures as described on our own commission guide.
const SALE = 850_000;
const RATE = 0.022;
const COMMISSION = SALE * RATE; // $18,700
const breakEven = [100, 150, 250].map((price) => ({
  price,
  share20: Math.floor((COMMISSION * 0.2) / price),
  share30: Math.floor((COMMISSION * 0.3) / price),
}));
const aud = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

const faqs = [
  {
    question: "What is a real estate lead on Your Property Guide?",
    answer:
      "A homeowner or buyer who has used our suburb data, guides or calculators, then completed a separate form asking for a local agent: our seven-question selling guide, an appraisal request, or a specialist match. Every lead includes contact details, the suburb, the property and the answers they gave, plus the consent they agreed to. If you searched for real estate leads, real estate agent leads or where to buy seller leads in Australia, this is that: a supply of enquiries from our own audience, not a marketing service.",
  },
  {
    question: "Are the leads exclusive?",
    answer:
      "Yes, 100%. Each lead is delivered to one agent only. We do not sell the same homeowner to several agents, we do not resell aged leads later, and we do not run them through a call centre. If someone submits twice, you get the update, not a competitor.",
  },
  {
    question: "How much do real estate leads cost in Australia?",
    answer:
      "It depends on how you pay. Pay-per-lead suppliers charge a fixed price for each lead: Get Listings publishes \"from $69 per lead, GST included\", and PrimeLeads agrees a fixed price up front without publishing it. Portal seller leads from realestate.com.au come with a residential subscription rather than a per-lead price. Referral platforms charge nothing up front but take a share of your commission when the property sells, commonly 20 to 30 per cent, or a flat fee. Telemarketing services and marketing agencies charge for the calling or by the month, plus ad spend, whether or not anything lists. Ours is pay per lead, priced by lead type, suburb and weekly volume, with no platform fee, no minimum and no share of your commission; register and we quote in writing within one business day. Supplier figures are as published on their websites in September 2026.",
  },
  {
    question: "Is it worth paying for real estate leads?",
    answer:
      "It depends on three numbers you already know: your average commission, what you pay per lead, and how many leads it takes you to win a listing. Divide the per-lead price by your lead-to-listing rate to get your cost per listing, then compare it with what a referral platform would take (20 to 30 per cent of the commission, or a flat fee). Paid leads are worth it when that cost per listing is lower than the alternative and you have the time to call them fast. They are not worth it if leads sit in an inbox for two days.",
  },
  {
    question: "Is buying real estate leads legal?",
    answer:
      "Yes, when the person agreed to be contacted and the supplier passed on their details with that consent. The Privacy Act governs how the details are collected and disclosed, the Spam Act covers the emails and SMS you send, and the Do Not Call Register rules cover marketing calls. A homeowner who asked for a local agent to call them has consented to calls about that enquiry. Ask any supplier what the person was told when they gave their details. General information, not legal advice.",
  },
  {
    question: "What is a good cost per lead for real estate agents?",
    answer:
      "Work it out from the listing, not the lead. Divide the per-lead price by the share of leads you turn into listings to get your cost per listing, then compare it with your commission and with what a referral platform would take. At $150 a lead and one listing in ten leads, a listing costs you $1,500. Whether that is good depends on your commission, your suburb and how fast you call.",
  },
  {
    question: "What conversion rate will I get from your leads?",
    answer:
      "We don't quote one, for the same reason we won't promise one: it depends on your suburbs, how fast you call and how well you appraise, and no supplier knows those for you. What moves it most is speed (call inside the hour) and fit (leads in suburbs you actually sell in). Track your own lead-to-listing rate from your first twenty leads, and once you're a partner we'll share what agents on the same lead type report.",
  },
  {
    question: "How are the leads qualified?",
    answer:
      "By what the homeowner told us before they gave their contact details, and by what we filter out. The selling guide asks suburb, property type and bedrooms, selling timeframe, and whether they have spoken to or signed with an agent, with motivation and price expectation optional. We score each lead hot, warm or cold on our side. Vendors who are already listed never become leads. We do not currently phone-verify every lead.",
  },
  {
    question: "What is the difference between vendor, appraisal and buyer leads?",
    answer:
      "Vendor leads come from the selling guide and carry the full qualification picture: timeframe, agent status, motivation and price. Appraisal leads come from someone asking for a local agent to value their property, with the street address and a mobile on every one. Buyer leads come from people who asked to be matched with a specialist to help them buy or invest, which suits buyers agents. Each has its own page with a sample record.",
  },
  {
    question: "Is there a minimum spend or lock-in contract?",
    answer:
      "No. Partnerships run month to month. You set a weekly or monthly cap, raise or lower it, and pause any time. We would rather keep you because the leads list than because a contract says so.",
  },
  {
    question: "What is the replacement guarantee?",
    answer:
      "If a lead is a wrong or disconnected number, is outside the suburbs you nominated, or tells you they have already signed with another agent, flag it within 7 days and we replace it. Contactable, in your area, and not already signed: that is the standard.",
  },
  {
    question: "How fast should I contact a lead? What is the five-minute rule?",
    answer:
      "The five-minute rule is the sales shorthand for calling a new lead within five minutes, because response rates fall away fast after that. For vendor and appraisal leads, inside the hour is the realistic target and the same business day is the limit. Homeowners are told a local agent will contact them, so they are expecting the call, and the agent who rings first and sounds like they know the suburb usually gets the appraisal.",
  },
  {
    question: "Who can register?",
    answer:
      "Licensed or registered real estate agents and agencies in Australia who sell in the areas they ask for, buyers agents for buyer leads, and developers and builders for project enquiries. We check the licence or registration on your state's public register before the first lead is sent. Multi-office agencies are welcome; tell us how you want leads routed.",
  },
  {
    question: "Where do most agents get their leads?",
    answer:
      "Mostly from their own database, past clients and referrals, then the portals, letterbox and door-knocking in their farm area, and open homes. Paid leads sit on top of that as a top-up for a patch or a quiet month, not a replacement for prospecting. The agents who get the most from them treat them like a warm referral: fast call, local knowledge, a real appraisal.",
  },
  {
    question: "Do you also do lead generation or marketing for real estate agents?",
    answer:
      "No. We are a property education publisher, not an agency. We generate enquiries from our own audience and supply them to a small number of vetted agents. We do not run ads under your brand, build your website or sell marketing retainers.",
  },
];

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function RealEstateLeadsPage() {
  return (
    <div className={s.page}>
      <BreadcrumbJsonLd items={[{ name: "Real Estate Leads", url: "/real-estate-leads" }]} />
      <FAQPageJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${SITE_URL}/real-estate-leads#service`,
          name: "Real estate leads for agents",
          serviceType: "Lead supply for licensed Australian real estate agents",
          description:
            "Exclusive, opt-in real estate leads (vendor, appraisal and buyer enquiries, plus project enquiries for developers and builders) supplied to licensed Australian agents, matched by suburb, priced per lead with no commission share and no lock-in.",
          url: `${SITE_URL}/real-estate-leads`,
          provider: { "@type": "Organization", name: "Your Property Guide", url: SITE_URL },
          areaServed: { "@type": "Country", name: "Australia" },
          audience: { "@type": "BusinessAudience", audienceType: "Real estate agents, buyers agents, property developers and builders" },
          offers: {
            "@type": "Offer",
            priceCurrency: "AUD",
            description: "Pay per lead. No platform fee, no minimum spend, no lock-in contract, no share of commission. Priced by lead type, area and volume.",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/real-estate-leads#register`,
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Lead types",
            itemListElement: leadTypePages.map((p) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: p.name, url: `${SITE_URL}/real-estate-leads/${p.slug}` },
            })),
          },
        }}
      />

      <div className="bg-surface border-b border-line">
        <div className={s.container}>
          <Breadcrumbs items={[{ label: "Real Estate Leads" }]} />
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={s.container}>
          <div className={s.heroGrid}>
            <div>
              <div className={`${s.eyebrow} rise`}>A prospectus for Australian agents · Vol. I</div>
              <h1 className={`${s.heroTitle} rise rise-d1`}>
                Real estate leads from homeowners who <em>asked for an agent.</em>
              </h1>
              <p className={`${s.lede} ${s.heroLede} rise rise-d2`}>
                Every lead on this page began as someone reading. A suburb
                profile, a commission guide, a selling-costs calculator, and
                then a separate decision: yes, I want a local agent to call me.
                One lead, one agent, matched to your suburbs. Pay per lead. No
                lock-in, and no share of your commission.
              </p>
              <div className={`${s.heroCtas} rise rise-d3`}>
                <a href="#register" className={CTA_CLASS}>
                  Register for leads
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </a>
                <a href="#docket" className={s.ghostLink}>
                  Read one lead, start to finish <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className={`${s.heroFoot} rise rise-d4`}>
                <span>Opt-in only</span>
                <span>100% exclusive</span>
                <span>7-day replacement</span>
                <span>Licensed agents only</span>
              </div>
            </div>
            <Docket title="Vendor lead · No. 0908-2012" rows={heroDocket} consents={["Agent contact consent", "Mobile supplied", "Suburb matched"]} />
          </div>

          <div className={s.rail}>
            <div className={s.railItem}>
              <div className={s.railValue}><StatNumber value="9,600+" /></div>
              <div className={s.railLabel}>Suburb profiles</div>
            </div>
            <div className={s.railItem}>
              <div className={s.railValue}><StatNumber value={String(leadTypePages.length)} /></div>
              <div className={s.railLabel}>Lead types</div>
            </div>
            <div className={s.railItem}>
              <div className={s.railValue}>1 : 1</div>
              <div className={s.railLabel}>One lead, one agent</div>
            </div>
            <div className={s.railItem}>
              <div className={s.railValue}><StatNumber value="7" /> days</div>
              <div className={s.railLabel}>Replacement window</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────── */}
      <div className={s.ticker} aria-hidden="true">
        <div className={s.tickerTrack}>
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className={s.tickerItem}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── I. The story of one lead ─────────────────────────────────── */}
      <section className={s.section} id="docket">
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="I." title="8:12 on a Tuesday, in North Lakes." kicker="How a lead is made here" />
          </div>
          <div className={s.storyGrid}>
            <div className={s.storyBody} data-reveal>
              <p className={s.dropcap}>
                Call her Leanne. Fifty-one, a four-bedroom house in North Lakes,
                the youngest has moved out and the plan is to sell and move
                closer to the coast. She is not looking for an agent. She is
                looking for the answer to a question she has been putting off
                since Easter: what does it actually cost to sell? She types it
                into Google at 8:02pm.
              </p>
              <p>
                She lands on our Queensland commission guide, the one that works
                the dollars on a real sale and says out loud that commission is
                negotiable. She reads all of it. Then she does what a lot of our
                readers do next: she opens the commission calculator and puts in
                her own figures. Eight hundred and fifty thousand, two point two
                per cent. Just under nineteen thousand dollars, and a number she
                can now negotiate.
              </p>
              <p className={s.pull}>
                By 8:10pm she is not a form fill. She is a homeowner who knows
                what selling will cost her, and has decided she wants a local
                agent to talk it through.
              </p>
              <p>
                That is when she starts the selling guide. Seven questions, one
                tap each: her suburb, the house, the timeframe (next three
                months), whether she has talked to an agent yet (no), why she is
                selling, and what she thinks it is worth. Contact details come
                last, with a plain sentence at the point she gives them: a local
                agent will contact her about selling. She adds her mobile.
              </p>
              <p>
                <strong>By the time you are at your desk, the lead is in your inbox.</strong>{" "}
                Scored hot, because she is selling inside three months and has
                not signed with anyone. One copy. Yours. And when you ring at
                8:30am, she is expecting you.
              </p>
            </div>

            <aside className={s.margin}>
              <div className={s.note} data-reveal>
                <div className={s.noteKey}>What she read</div>
                <div className={s.noteVal}>
                  <code>/guides/real-estate-commission-qld</code>
                  <br />
                  Commission rates, what is negotiable, and the dollars on a real
                  sale. That is the house style.
                </div>
              </div>
              <div className={s.note} data-reveal>
                <div className={s.noteKey}>What she calculated</div>
                <div className={s.noteVal}>
                  <code>/real-estate-commission-calculator</code>
                  <br />
                  Her own sale price and rate. Homeowners who run a calculator
                  arrive knowing what the agent costs.
                </div>
              </div>
              <div className={s.note} data-reveal>
                <div className={s.noteKey}>The clock</div>
                <div className={s.timeline}>
                  <div className={s.timeRow}><span className={s.time}>8:02pm</span><span>Searches the question, lands on the guide</span></div>
                  <div className={s.timeRow}><span className={s.time}>8:07pm</span><span>Runs the commission calculator on her figures</span></div>
                  <div className={s.timeRow}><span className={s.time}>8:10pm</span><span>Answers the selling questions: suburb, house, timeframe</span></div>
                  <div className={s.timeRow}><span className={s.time}>8:12pm</span><span>Gives her mobile, agrees a local agent may call</span></div>
                  <div className={s.timeRow}><span className={s.time}>8:30am</span><span>You call. She was told you would.</span></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── II. The honest difference ────────────────────────────────── */}
      <section className={`${s.section} ${s.sectionPaper}`}>
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="II." title="Why most real estate leads do not convert." kicker="And where this supply is different" />
          </div>
          <p className={s.lede} style={{ maxWidth: "62ch", marginBottom: 40 }} data-reveal>
            A shared, ad-generated form fill with no qualification and no
            consent trail is a cold call with a name on it. Nine rows, no spin.
          </p>
          <div className={s.ledger} data-reveal>
            <div className={s.ledgerHead}>
              <div>Feature</div>
              <div>Your Property Guide</div>
              <div>Most lead providers</div>
            </div>
            {ledger.map((row) => (
              <div key={row.feature} className={s.ledgerRow}>
                <div className={s.ledgerFeature}>{row.feature}</div>
                <div className={s.ledgerUs}>
                  <span className={s.glyphYes} aria-hidden="true">✓</span>
                  <span>{row.us}</span>
                </div>
                <div className={s.ledgerThem}>
                  <span className={s.glyphNo} aria-hidden="true">×</span>
                  <span>{row.them}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── III. What comes with every lead ──────────────────────────── */}
      <section className={s.section} id="lead-contents">
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="III." title="What arrives, and what the homeowner sees." kicker="Enough to prepare the call, not just make it" />
          </div>
          <div className={s.contentsGrid}>
            <div data-reveal>
              <div className={s.prose} style={{ maxWidth: "54ch" }}>
                <p>
                  Every lead arrives by email as a single, scannable record:
                  contact details at the top, then the property and the answers
                  they gave, then the score. What you get depends on the form
                  they used, and each lead-type page shows the exact fields.
                </p>
              </div>
              <ul className={s.checkList}>
                {[
                  "Full name, email and mobile",
                  "Suburb and postcode, matched to your area",
                  "Property type and bedrooms",
                  "Selling timeframe, and whether they have spoken to or signed with an agent",
                  "Motivation and price expectation, where they gave them",
                  "A hot, warm or cold score, worked out on our side",
                  "Street address on every appraisal request",
                  "Which form they used, and the suburb page for suburb-page appraisals",
                  "Timestamp, and the form they used, so you know exactly what they were told",
                ].map((item) => (
                  <li key={item}><i>✓</i>{item}</li>
                ))}
              </ul>
            </div>
            <div className={s.prose} style={{ maxWidth: "54ch" }} data-reveal>
              <p>
                <strong>And on the homeowner&rsquo;s side:</strong> the questions
                come before the contact form, so by the time they give their
                details they have already told us they are selling, when, and
                that no agent has them signed. At the point they give their
                details they see a plain sentence saying a local agent will
                contact them about selling, and a separate, unticked box for our
                own emails.
              </p>
              <p>
                Straight after, they get the selling guide by email: a real,
                chaptered guide to selling in Australia. It covers choosing an
                agent, commission and what is negotiable, so the homeowner you
                ring has read the same page you would want them to read.
              </p>
              <p>
                <strong>Already listed?</strong> They get the guide and nothing
                else. Their details are never passed to an agent, so you never
                pay to chase a property that is already on the market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── IV. Lead types ───────────────────────────────────────────── */}
      <section className={`${s.section} ${s.sectionPaper}`} id="lead-types">
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="IV." title="Vendor leads, appraisal leads, buyer leads and project enquiries." kicker="Pick only what you work. We will not send you the rest." />
          </div>
          <div className={s.indexGrid} data-reveal-group>
            {leadTypePages.map((t) => (
              <article key={t.slug} className={s.indexCard}>
                <div className={s.indexNum}>{t.n}</div>
                <h3 className={s.indexTitle}>{t.name}</h3>
                <div className={s.volume}>
                  <span className={s.volumeLabel}>{t.volume}</span>
                </div>
                <p className={s.indexText}>{t.cardText}</p>
                <div className={s.indexMeta}>For {t.audience.toLowerCase()} · on the record</div>
                <ul className={s.indexTags}>
                  {t.cardTags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className={s.indexFoot}>
                  <Link href={`/real-estate-leads/${t.slug}`}>About {t.shortName} →</Link>
                  <a href="#register" className={s.indexRegister}>Register</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark chapter: what we will not promise ───────────────────── */}
      <section className={s.dark}>
        <div className={s.darkMark} aria-hidden="true">y</div>
        <div className={s.container}>
          <div className={s.darkGrid}>
            <div data-reveal>
              <div className={`${s.eyebrow} ${s.eyebrowOnDark}`}>V. The part other pages leave out</div>
              <h2 className={s.darkTitle}>
                Four things we will <em>not</em> promise you.
              </h2>
              <p className={s.darkIntro}>
                Readers trust this site because it names the trade-offs. Agents
                should get the same treatment. So before the terms, the limits.
              </p>
            </div>
            <ul className={s.darkList} data-reveal-group>
              {wontPromise.map((w, i) => (
                <li key={w.head}>
                  <span className={s.darkNo}>{i + 1}.</span>
                  <div>
                    <h3 className={s.darkHead}>{w.head}</h3>
                    <p className={s.darkText}>{w.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── VI. Terms ───────────────────────────────────────────────── */}
      <section className={s.section} id="pricing">
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="VI." title="Pay per lead. Nothing else." kicker="The terms, in four clauses" />
          </div>
          <p className={s.lede} style={{ maxWidth: "60ch", marginBottom: 40 }} data-reveal>
            No monthly platform fee, no retainer, no minimum spend, no lock-in,
            and nothing on settlement. The per-lead price depends on lead type,
            your suburbs and the weekly volume you want. Register and we quote
            your mix in writing within one business day.
          </p>
          <Clauses />
          <div className={s.prose} style={{ maxWidth: "68ch", marginTop: 48 }} id="cost-per-listing" data-reveal>
            <h3 className={s.subhead}>Against a commission share</h3>
            <p>
              Referral platforms charge nothing up front and take 20 to 30 per
              cent of your commission when the property sells. On an{" "}
              {aud(SALE)} sale at {(RATE * 100).toFixed(1)} per cent, that is{" "}
              {aud(COMMISSION * 0.2)} to {aud(COMMISSION * 0.3)} per listing.
              Paying per lead costs less for as long as you list at least one
              lead in this many:
            </p>
          </div>
          <div className={s.dataTableWrap} data-reveal>
            <table className={s.dataTable}>
              <caption className="sr-only">Break-even number of leads per listing against a commission share</caption>
              <thead>
                <tr>
                  <th scope="col">Price per lead</th>
                  <th scope="col">Break-even vs 20% share ({aud(COMMISSION * 0.2)})</th>
                  <th scope="col">Break-even vs 30% share ({aud(COMMISSION * 0.3)})</th>
                </tr>
              </thead>
              <tbody>
                {breakEven.map((r) => (
                  <tr key={r.price}>
                    <th scope="row">{aud(r.price)}</th>
                    <td>1 in {r.share20} leads</td>
                    <td>1 in {r.share30} leads</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={s.fine} style={{ marginTop: 12 }}>
              Illustrative. The per-lead prices are round numbers for the maths,
              not our price list, and {(RATE * 100).toFixed(1)} per cent on{" "}
              {aud(SALE)} is an example, not a market average. Use your own
              commission and lead-to-listing rate; our{" "}
              <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
              works out the commission for any price and rate.
            </p>
          </div>
        </div>
      </section>

      {/* ── VII. Is buying leads legal? ─────────────────────────────── */}
      <section className={`${s.section} ${s.sectionPaper}`} id="compliance">
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="VII." title="Is buying real estate leads legal?" kicker="Yes, with consent. The three laws that matter, in plain English" />
          </div>
          <div className={s.prose} style={{ maxWidth: "68ch" }} data-reveal>
            <p>
              Buying leads is legal in Australia when the person agreed to be
              contacted, and the supplier passed their details on with that
              consent. It is the consent that does the work, which is why the
              first question to ask any supplier is what the person was told
              when they gave their details.
            </p>
          </div>
          <div className={s.dataTableWrap} data-reveal>
            <table className={s.dataTable}>
              <caption className="sr-only">Australian laws that apply to buying and working real estate leads</caption>
              <thead>
                <tr>
                  <th scope="col">Law</th>
                  <th scope="col">What it covers</th>
                  <th scope="col">What it means for bought leads</th>
                </tr>
              </thead>
              <tbody>
                {laws.map((r) => (
                  <tr key={r[0]}>
                    <th scope="row">{r[0]}</th>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={s.prose} style={{ maxWidth: "68ch", marginTop: 28 }} data-reveal>
            <p>
              On our side: every form that produces a lead tells the person, at
              the point they give their details, that a local agent or
              specialist will contact them. Our own marketing emails need a
              separate, unticked box. Readers who were told their details stay
              with us (the buying guide and the off-market register) are never
              sold as leads.
            </p>
            <p>
              On your side: call and email about the enquiry they made, say who
              you are and how you got their details, and put anyone who asks
              you to stop on your do-not-contact list. Adding a lead to a
              general marketing list is a separate consent question.
            </p>
            <p className={s.fine}>
              General information, not legal advice. The Office of the
              Australian Information Commissioner (privacy) and the Australian
              Communications and Media Authority (spam and Do Not Call) publish
              the detail.
            </p>
          </div>
        </div>
      </section>

      {/* ── VIII. Ten questions ────────────────────────────────────────── */}
      <section className={s.section} id="supplier-checklist">
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="VIII." title="Ten questions to ask any lead supplier." kicker="With our answers, so you can compare" />
          </div>
          <ol className={s.qaList} data-reveal-group>
            {supplierQuestions.map((item, i) => (
              <li key={item.q}>
                <span className={s.vetNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={s.qaQ}>{item.q}</h3>
                  <p className={s.qaA}><span className={s.qaOurs}>Ours:</span> {item.a}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── IX. Who we work with ───────────────────────────────────── */}
      <section className={`${s.section} ${s.sectionPaper}`}>
        <div className={s.container}>
          <div className={s.vetGrid}>
            <div data-reveal>
              <Chapter num="IX." title="A small number of agents, matched properly." kicker="We choose who we work with" />
              <div className={s.prose} style={{ maxWidth: "50ch" }}>
                <p>
                  We are not trying to sign up every agency in the country.
                  Readers trust the site because it tells them the truth about
                  selling, commission included, and the agent on the other end
                  of the enquiry has to hold that trust up. So we vet, we say
                  no, and the agents we say yes to get a supply worth protecting.
                </p>
              </div>
              <div className={s.person}>
                <div className={s.avatar} aria-hidden="true">A</div>
                <div>
                  <div className={s.personName}>Andy</div>
                  <div className={`${s.mono} ${s.personRole}`}>Agent partnerships, Your Property Guide</div>
                  <p className={s.personText}>
                    You are not filling out a form into the void. Andy reads
                    every registration, checks the licence, and calls to talk
                    through availability, pricing and how you want leads
                    delivered.
                  </p>
                </div>
              </div>
            </div>
            <ul className={s.vetList} data-reveal-group>
              {vetting.map((v, i) => (
                <li key={i}>
                  <span className={s.vetNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── X. Register ─────────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="X." title="Start receiving real estate leads." kicker="One business day to a written quote" />
          </div>
          <div className={s.registerGrid}>
            <div>
              <AgentEnquiryForm />
            </div>
            <aside className={s.aside}>
              <WhatHappensNext />
              <div className={s.next}>
                <h3 className={s.nextTitle}>In every partnership</h3>
                <ul className={s.checkList} style={{ marginTop: 0 }}>
                  {["100% exclusive delivery", "Matched to your suburbs", "Pay per lead, no minimum", "7-day replacement guarantee", "No share of your commission"].map((t) => (
                    <li key={t} className={s.checkListCompact}><i>✓</i>{t}</li>
                  ))}
                </ul>
              </div>
              <FinePrint />
            </aside>
          </div>
        </div>
      </section>

      {/* ── XI. Coverage ──────────────────────────────────────────────── */}
      <section className={`${s.section} ${s.sectionPaper}`}>
        <div className={s.container}>
          <div data-reveal>
            <Chapter num="XI." title="Real estate leads by state." kicker="Metro and regional, every state and territory" />
          </div>
          <div className={s.gazetteer} data-reveal-group>
            {states.map((st) => (
              <div key={st.code} className={s.gaz}>
                <div className={s.gazCode}>{st.code}</div>
                <div className={s.gazName}>{st.name}</div>
                <div className={s.gazNote}>{st.note}</div>
              </div>
            ))}
          </div>
          <p className={s.fine} style={{ textAlign: "center", marginTop: 28, maxWidth: "60ch", marginLeft: "auto", marginRight: "auto" }} data-reveal>
            Volume follows population, so Sydney, Melbourne, Brisbane and Perth
            produce the most; regional partners tend to see less competition.
            Nominate an area as narrow as a single postcode. Selling a property
            yourself? Homeowners can{" "}
            <Link href="/appraisal">ask for a free appraisal</Link> or{" "}
            <Link href="/selling-guide">get the selling guide</Link>.
          </p>
        </div>
      </section>

      {/* ── FAQ. Mirrors the FAQPageJsonLd above. ─────────────────────── */}
      <section className={s.section}>
        <div className={s.container} style={{ maxWidth: 860 }}>
          <div data-reveal>
            <Chapter num="XII." title="Real estate leads: questions agents ask." kicker="Straight answers on exclusivity, qualification, pricing and who can register" />
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* ── Closing ──────────────────────────────────────────────────── */}
      <section className={s.close}>
        <div className={s.container} style={{ position: "relative" }}>
          <div className={`${s.eyebrow} ${s.eyebrowOnDark}`} style={{ justifyContent: "center", marginBottom: 26 }}>
            Exclusive · Pay per lead · No lock-in
          </div>
          <h2 className={s.closeTitle}>
            Homeowners who did the reading, delivered to <em>one</em> agent.
          </h2>
          <p className={s.closeText}>
            Register your suburbs and lead types. Within one business day you
            will have availability and a written per-lead price for your mix,
            and you commit to nothing until you say so.
          </p>
          <div className={s.closeCtas}>
            <a href="#register" className={CTA_CLASS}>
              Register for real estate leads
            </a>
            <Link href="/about" className={s.closeLink}>
              How the reader side works <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
