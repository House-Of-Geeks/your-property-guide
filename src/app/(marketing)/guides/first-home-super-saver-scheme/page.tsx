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
  title: "First Home Super Saver Scheme (FHSS): Save Your Deposit in Super (2026)",
  description:
    "How the First Home Super Saver scheme works: make extra contributions into super, withdraw them plus earnings for a first-home deposit, and pocket the tax saving. Limits, the ATO release process, and the timing trap explained.",
  slug: "first-home-super-saver-scheme",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
  readingTimeMinutes: 8,
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
  "The First Home Super Saver scheme lets you make extra voluntary contributions into your super, then withdraw them later (plus deemed earnings) to put towards your first-home deposit.",
  "It is a savings vehicle, not a grant. There is no free cash. The benefit is tax: concessional contributions are taxed at 15% going in rather than at your full marginal rate.",
  "Only voluntary contributions count. The compulsory super your employer pays cannot be withdrawn under the scheme.",
  "There are annual and total limits on how much you can contribute and later release. Couples are assessed individually, so two eligible buyers can each use the scheme on the same purchase.",
  "You apply to the ATO for a determination, then a release. The cash is paid to you, not to the vendor, and the ATO withholds some tax on the way out.",
  "Timing matters. Request your FHSS determination before you sign a contract, because the rules around when you can apply are strict and getting it wrong can cost you.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",     label: "What the FHSS scheme actually is" },
  { id: "how-it-works",   label: "How the FHSS scheme works" },
  { id: "tax-benefit",    label: "The tax advantage explained" },
  { id: "limits",         label: "Contribution and withdrawal limits" },
  { id: "release",        label: "Getting a determination and release" },
  { id: "timing",         label: "The timing trap to avoid" },
  { id: "couples",        label: "Using the scheme as a couple" },
  { id: "worth-it",       label: "Is the FHSS scheme worth it?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How does the First Home Super Saver scheme work?",
    answer:
      "You make extra voluntary contributions into your super fund, on top of the compulsory contributions your employer already pays. Later, when you are ready to buy your first home, you ask the ATO to release those voluntary contributions plus an amount of deemed earnings. The released money goes to you to put towards your deposit. The point of doing it through super is the tax treatment: salary-sacrificed (concessional) contributions are taxed at 15% rather than your full marginal rate, so for most people the deposit grows faster inside super than in a regular savings account.",
  },
  {
    question: "How much can you withdraw under the FHSS scheme?",
    answer:
      "There is an annual limit on how much of your voluntary contributions can count towards the scheme, and a separate total limit across all years. You can only ever release eligible voluntary contributions plus an amount of associated earnings the ATO calculates for you. Compulsory employer contributions never count. Because the caps change, check the current annual and total release limits on the ATO website before you plan your contributions.",
  },
  {
    question: "Is the FHSS scheme worth it?",
    answer:
      "For many first home buyers on a decent marginal tax rate, yes, because salary sacrificing into super and releasing it later usually beats saving the same money in a regular account after tax. The trade-offs are that the money is locked in super until you request a release, the release process takes time, and the rules are strict. It is less compelling if you are on a low marginal rate, if you might not buy at all, or if you need the money to be instantly accessible. Get personal financial or tax advice before committing.",
  },
  {
    question: "How long does an FHSS release take?",
    answer:
      "Once you request a release, the ATO typically takes a couple of weeks to process it and pay the money to you, though it can be longer at busy times. This is exactly why you request your determination and release well before you need the funds, and ideally before you sign a contract. Do not assume the cash will land in your account overnight.",
  },
  {
    question: "Can couples both use the FHSS scheme?",
    answer:
      "Yes. The scheme is assessed individually, not per property. If two eligible first home buyers are purchasing together, each person can make their own voluntary contributions and apply for their own release, effectively doubling the amount the couple can put towards the deposit. Each partner must meet the eligibility rules in their own right.",
  },
  {
    question: "Can I use the FHSS scheme on an established home?",
    answer:
      "The scheme is about how you save the deposit, not what type of home you buy, so it can apply to most residential homes you intend to live in, including established properties. It is different from the First Home Owner Grant, which in most states only applies to new builds. You generally need to move into the property and live in it for a set period. Confirm the current residence requirements with the ATO.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "How Much Deposit to Buy a House",   href: "/guides/how-much-deposit-to-buy-a-house", description: "How much you really need, what counts, and the schemes that lower the bar." },
  { title: "First Home Buyer Guide (national)",  href: "/guides/first-home-buyer-guide",          description: "Federal schemes, FHOG by state, stamp duty concessions and the buying process." },
  { title: "First Home Guarantee",               href: "/guides/first-home-guarantee",            description: "Buy with a 5% deposit and no LMI, with the government guaranteeing the gap." },
  { title: "Lenders Mortgage Insurance",         href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "Home Loan Pre-Approval",             href: "/guides/home-loan-pre-approval-australia", description: "How pre-approval works and when to line it up." },
  { title: "First Home Buyer Mistakes to Avoid", href: "/guides/first-home-buyer-mistakes-to-avoid", description: "The traps that cost first home buyers grants, schemes and deposits." },
];

export default function FirstHomeSuperSaverSchemePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check the current limits with the ATO first">
        <p>
          The annual and total contribution limits, the release rules and the
          eligibility conditions for the FHSS scheme change from time to time.
          The figures in this guide are described in general terms on purpose.
          Always confirm the current caps and rules with the{" "}
          <a
            href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme"
            target="_blank"
            rel="noopener noreferrer"
          >
            ATO
          </a>{" "}
          or a licensed financial adviser before you contribute or apply for a
          release.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The single most common misread on this scheme is treating it like a
          government handout. It is not. The FHSS scheme does not hand you cash.
          It lets you funnel your own deposit savings through super so the tax
          office takes a smaller cut on the way in. The benefit is real, but it
          is a tax saving on money you were already going to put aside, not a
          grant on top. Get that straight first and the rest of the scheme makes
          sense.
        </p>
      </EditorNote>

      <h2 id="what-it-is">What the FHSS scheme actually is</h2>
      <p className="lead">
        The First Home Super Saver scheme lets you save part of your first-home
        deposit inside your super fund and withdraw it later. You make extra
        voluntary contributions, the money sits in super, and when you are ready
        to buy you ask the ATO to release those contributions plus an amount of
        earnings.
      </p>
      <p>
        The reason to bother is tax. Super is a lightly taxed environment, so for
        most people money put aside this way grows faster than the same money
        saved in an everyday bank account. It is a savings vehicle with a tax
        advantage, not a cash grant, and it sits alongside the other first home
        buyer schemes rather than replacing them.
      </p>

      <KeyFigure
        value="Save in super"
        label="The FHSS scheme is a tax-effective way to save your deposit, not a grant or a cash bonus."
        context="You withdraw your own contributions, plus deemed earnings"
      />

      <h2 id="how-it-works">How the FHSS scheme works</h2>
      <p>
        There are two types of voluntary contribution you can make, and both can
        count towards the scheme:
      </p>
      <ul>
        <li>
          <strong>Concessional (before-tax) contributions.</strong> Usually made
          by salary sacrificing through your employer, or by claiming a tax
          deduction on a personal contribution. These are taxed at 15% inside
          super rather than at your marginal rate, which is where most of the
          benefit comes from.
        </li>
        <li>
          <strong>Non-concessional (after-tax) contributions.</strong> Money you
          put in from your take-home pay, where you have already paid income tax.
          These can also count towards the scheme, within the limits.
        </li>
      </ul>
      <p>
        What does <strong>not</strong> count is the compulsory super your
        employer pays under the super guarantee, or any contributions made by a
        spouse on your behalf in the usual way. Only your own eligible voluntary
        contributions can be released under the scheme.
      </p>
      <p>
        When you withdraw, the ATO does not just hand back the exact dollars you
        put in. It releases your eligible contributions plus an amount of{" "}
        <strong>deemed (associated) earnings</strong> it calculates using a set
        rate, rather than the actual investment return of your fund.
      </p>

      <h2 id="tax-benefit">The tax advantage explained</h2>
      <p>
        The whole case for the scheme rests on one idea: concessional
        contributions are taxed at 15% going into super, which for most working
        people is well below their marginal income tax rate. Save the same money
        in a normal account and you save it out of after-tax income, then pay tax
        on the interest as well.
      </p>
      <p>
        So a buyer on a higher marginal rate can get more of their deposit
        working for them by routing it through super first. When the money comes
        back out under the scheme, the ATO applies its own withholding and
        concessional treatment to the released amount, which is generally still
        better than having earned and saved it the ordinary way.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        The FHSS scheme does not add money to your deposit. It stops the tax
        office taking as big a slice of the deposit you were saving anyway.
      </PullQuote>

      <p>
        It works best for people on a solid marginal tax rate who are
        disciplined savers and confident they are going to buy. It does much less
        for someone on a low rate, or someone who might not end up purchasing at
        all, because the money is then locked in super for no real gain.
      </p>

      <h2 id="limits">Contribution and withdrawal limits</h2>
      <p>
        The scheme is capped in two ways, and both matter when you plan your
        contributions:
      </p>
      <ul>
        <li>
          <strong>An annual limit</strong> on how much of your voluntary
          contributions can count towards the scheme in a single financial year.
        </li>
        <li>
          <strong>A total limit</strong> on the maximum amount of voluntary
          contributions you can ever release across all years combined.
        </li>
      </ul>
      <p>
        On top of those scheme caps, your contributions still count towards the
        normal annual super contribution caps, so salary sacrificing a large
        amount can have other consequences. Because all of these figures are
        adjusted over time, this guide deliberately does not quote a dollar
        amount. Check the current annual and total FHSS limits, and the standard
        contribution caps, on the ATO website before you start.
      </p>

      <Callout variant="info" title="Only voluntary contributions, only up to the cap">
        <p>
          You can only ever release eligible voluntary contributions plus the
          earnings the ATO calculates on them. Compulsory employer contributions
          are off limits, and anything above the scheme caps stays in super until
          retirement like normal. Plan your salary sacrifice with the caps in
          front of you.
        </p>
      </Callout>

      <h2 id="release">Getting a determination and release through the ATO</h2>
      <p>
        You do not deal with your super fund directly to use the scheme. You go
        through the ATO, usually via myGov, and the process has two stages:
      </p>
      <ol>
        <li>
          <strong>Request an FHSS determination.</strong> This tells you the
          maximum amount you are allowed to release based on your eligible
          contributions and the deemed earnings. You can request a determination
          to check your position before you commit to buying.
        </li>
        <li>
          <strong>Request a release.</strong> Once you are ready, you ask the ATO
          to release the determined amount. The ATO instructs your fund to send
          the money, withholds some tax, and pays the balance to you.
        </li>
      </ol>
      <p>
        The released money is paid to <strong>you</strong>, not to the vendor or
        your conveyancer. You then use it as part of your deposit and settlement
        funds in the normal way. After a release you generally have a set window
        in which to sign a contract to buy or build, or to notify the ATO, so
        you do not want to release the money years before you are ready.
      </p>

      <h2 id="timing">The timing trap to avoid</h2>
      <p>
        This is where first home buyers most often come unstuck. The order of
        operations matters:
      </p>
      <ul>
        <li>
          <strong>Request your determination before you sign a contract.</strong>{" "}
          The rules around when you can validly apply are strict, and signing a
          contract at the wrong moment can affect your ability to use the scheme.
        </li>
        <li>
          <strong>Allow time for the release.</strong> Processing and payment
          take time, so the cash will not be in your account the day you ask. Do
          not line up a settlement assuming an instant payout.
        </li>
        <li>
          <strong>Mind the post-release deadlines.</strong> After the money is
          released there is a limited window to sign a contract to buy or build,
          with the option to ask for an extension or to notify the ATO if your
          plans change. Miss it and there can be tax consequences.
        </li>
      </ul>
      <p>
        The simplest rule: get your determination, plan the release into your
        timeline well ahead, and confirm the current sequence with the ATO before
        you exchange. For how this fits the rest of your deposit, see our guide
        on <Link href="/guides/how-much-deposit-to-buy-a-house">how much deposit you need to buy a house</Link>.
      </p>

      <Callout variant="warning" title="Do not sign before you have checked the order">
        <p>
          The FHSS rules tie your eligibility to the timing of your application
          and your contract. Because those rules change and the consequences of
          getting them wrong fall on you, confirm the current sequence with the{" "}
          <a
            href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme"
            target="_blank"
            rel="noopener noreferrer"
          >
            ATO
          </a>{" "}
          or a licensed adviser before you exchange contracts.
        </p>
      </Callout>

      <h2 id="couples">Using the scheme as a couple</h2>
      <p>
        The scheme is worked out per person, not per property. If two eligible
        first home buyers are purchasing together, each can make their own
        voluntary contributions and apply for their own determination and
        release. In effect, a couple can put roughly double through the scheme
        compared with a single buyer, as long as each partner meets the
        eligibility rules in their own right.
      </p>
      <p>
        Each person applies separately through their own myGov and ATO account.
        The amounts are not pooled by the ATO, so plan both sets of contributions
        with the per-person caps in mind.
      </p>

      <h2 id="worth-it">Is the FHSS scheme worth it?</h2>
      <p>
        For a disciplined saver on a reasonable marginal tax rate who is
        confident they will buy, the scheme usually leaves you with a bigger
        deposit than saving the same money in a regular account. The tax saving
        is the whole point, and for many first home buyers it is genuinely worth
        having.
      </p>
      <p>It is less compelling when:</p>
      <ul>
        <li>You are on a low marginal tax rate, so the 15% concessional rate saves you little</li>
        <li>You might not buy at all, leaving the money locked in super</li>
        <li>You need the funds to be instantly accessible for other reasons</li>
        <li>Salary sacrificing would push you over your normal contribution caps</li>
      </ul>
      <p>
        The scheme also pairs with the other first home buyer programs. It is a
        savings strategy, while the{" "}
        <Link href="/guides/first-home-guarantee">First Home Guarantee</Link>{" "}
        helps you buy with a smaller deposit and no LMI, and state grants and
        stamp duty concessions sit on top. Our{" "}
        <Link href="/guides/first-home-buyer-guide">national first home buyer guide</Link>{" "}
        shows how the pieces fit together. Because everyone&rsquo;s tax position
        differs, get personal financial or tax advice before you commit.
      </p>

      <MatchCTA
        kind="mortgage-broker"
        lead="Sorting out your deposit and the schemes you qualify for? A broker can line up your borrowing capacity, pre-approval and the federal scheme paperwork in one process."
        ctaLabel="Get the free buying guide"
        href="/buying-guide"
      />

      <Sources items={FHSS_SOURCES} />
    </GuideArticleLayout>
  );
}

const FHSS_SOURCES: readonly SourceItem[] = [
  {
    label: "ATO: First Home Super Saver scheme",
    href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme",
    note: "Official rules, eligibility, contribution and release limits, and the determination process",
  },
  {
    label: "ATO: Applying for an FHSS determination and release",
    href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme",
    note: "How to request a determination and release through myGov, and the timing rules",
  },
  {
    label: "ASIC MoneySmart: Super for first home buyers",
    href: "https://moneysmart.gov.au/",
    note: "Independent consumer guidance on saving a deposit through super",
  },
];
