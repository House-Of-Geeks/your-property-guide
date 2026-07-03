import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide Tasmania: Grants, Stamp Duty & Schemes (2026)",
  description:
    "Tasmania first home buyer guide: $30,000 FHOG on new homes, 50% stamp duty concession on established homes up to $600K, federal schemes, and Tasmania's affordability advantage.",
  slug: "first-home-buyer-tas",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
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
  "Tasmania's $30,000 FHOG is one of the most generous in Australia, on new homes only.",
  "Established homes get a 50% stamp duty concession up to $600,000, saving roughly $9,000 on a $500,000 home.",
  "You can have FHOG on a new home OR the stamp duty concession on an established home, not both on the same property.",
  "First Home Guarantee uses a uniform $600,000 cap across Tasmania (no metro/regional split).",
  "Tasmania remains one of Australia's most affordable states; Hobart medians sit well below Sydney/Melbourne, and the north-west coast is among the cheapest in the country.",
  "Tasmania's Regional First Home Buyer Guarantee covers most of the state outside Hobart, including Launceston, Burnie, Devonport.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog",          label: "First Home Owner Grant Tasmania" },
  { id: "stamp-duty",    label: "Stamp duty concession" },
  { id: "federal-schemes", label: "Federal government schemes" },
  { id: "affordability", label: "Tasmania's affordability advantage" },
  { id: "key-areas",     label: "Hobart, Launceston, and Burnie" },
  { id: "eligibility",   label: "Eligibility requirements" },
  { id: "steps",         label: "Step-by-step buying in Tasmania" },
  { id: "resources",     label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is Tasmania really one of Australia's most generous FHOGs?",
    answer:
      "Yes. The $30,000 FHOG is one of the largest grants in Australia (Queensland's dropped to $15,000 from 1 July 2026). Combined with Tasmania's lower median prices, the grant covers a much larger share of a typical deposit than the same dollar amount in Sydney or Melbourne.",
  },
  {
    question: "Can I get the FHOG and the stamp duty concession on the same home?",
    answer:
      "No. The FHOG is for new homes only; the 50% stamp duty concession is for established homes only. Pick one strategy: build/buy new and take the $30K, or buy established and take the duty saving. Run the numbers on both at your target price to see which is better in your situation.",
  },
  {
    question: "What's the price cap for the Tasmanian First Home Guarantee?",
    answer:
      "$600,000 across all of Tasmania. Unlike larger states with separate metro/regional caps, Tasmania uses a uniform cap reflecting the state's more consistent property values.",
  },
  {
    question: "Do most Tasmanian buyers qualify for the Regional First Home Buyer Guarantee?",
    answer:
      "Yes, in practice. Most of Tasmania outside greater Hobart is classified as regional, so buyers in Launceston, Burnie, Devonport and surrounding areas typically qualify if they've lived in the area for 12+ months.",
  },
  {
    question: "What's the cooling-off period in Tasmania?",
    answer:
      "Tasmania doesn't have a statutory cooling-off period for residential sales. Once contracts are signed and conditions waived/fulfilled you're committed, similar to WA. Pre-contract due diligence (especially building inspection on older Tassie homes) is essential.",
  },
  {
    question: "Are Tasmanian rental yields really stronger than the mainland?",
    answer:
      "Historically yes, particularly outside Hobart. That investor competition can occasionally squeeze first home buyers, but for owner-occupiers prepared to look at outer suburbs and regional centres, Tasmania remains accessible compared to mainland capitals.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty TAS",         href: "/guides/stamp-duty-tas",          description: "Tasmanian duty, the 50% first home concession and worked examples." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your Tasmanian duty (with or without the concession)." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "Why pre-contract inspections matter, especially on older Tasmanian homes." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Renter's Rights in Tasmania",       href: "/guides/renters-rights-tas",      description: "Tenant entitlements while you save for that first deposit." },
];

const STEPS = [
  { step: "1", title: "Understand your finances", desc: "Calculate borrow + save. Factor in stamp duty (or 50% concession for established), legal fees, pest and building inspection, and moving costs." },
  { step: "2", title: "Decide: new or established", desc: "New: $30,000 FHOG, full stamp duty. Established: no FHOG but 50% duty concession. Run the numbers at your target price." },
  { step: "3", title: "Check federal scheme eligibility", desc: "First Home Guarantee (5% deposit, no LMI) via a participating lender. Regional FHBG often applies outside Hobart." },
  { step: "4", title: "Get pre-approval", desc: "A clear budget and a stronger offer. Important in tight stock markets." },
  { step: "5", title: "Search and inspect", desc: "Building and pest inspection before contract is essential, especially on older Tassie homes." },
  { step: "6", title: "Engage a conveyancer", desc: "A Tasmanian conveyancer or solicitor reviews the contract, runs searches, and manages settlement." },
  { step: "7", title: "Apply for the FHOG", desc: "Through your lender or directly with the State Revenue Office. Typically paid at settlement." },
];

export default function FirstHomeBuyerTasPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify with the SRO Tasmania">
        <p>
          Grant amounts, eligibility and thresholds can change. Verify current
          details with the{" "}
          <a href="https://www.sro.tas.gov.au" target="_blank" rel="noopener noreferrer">
            State Revenue Office Tasmania
          </a>{" "}
          before signing a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Tasmania pays $30K on a new home or a 50% duty concession on
          an established one, and most buyers I&rsquo;ve seen here pick
          wrong on the maths. The grant is bigger up front, but on a
          sub-$500K established home the duty concession plus the lower
          purchase price often nets out better. The other Tasmanian
          quirk: the First Home Guarantee uses a single $600K cap with
          no metro/regional split, which actually works in your favour
          across most of the state.
        </p>
      </EditorNote>

      <h2 id="fhog">First Home Owner Grant, Tasmania</h2>
      <p className="lead">
        Tasmania offers one of the most generous First Home Owner Grants in
        Australia. As of 2026, eligible first home buyers can receive $30,000 when
        purchasing or building a new home, increased from $20,000 to attract
        buyers and stimulate housing construction.
      </p>

      <KeyFigure
        value="$30,000"
        label="The Tasmanian First Home Owner Grant on new homes."
        context="Established homes don't qualify (but get the 50% duty concession)"
      />

      <p>
        The grant applies to new homes only, newly built homes that haven't
        previously been occupied or sold as a residence, or homes being
        constructed for the first time on vacant land. Established homes don't
        qualify for the FHOG, but may get the stamp duty concession instead.
      </p>
      <p>
        Given Tasmania's lower median prices, $30,000 represents a large share of
        a typical deposit, making this one of the most powerful FHB incentives in
        the country.
      </p>

      <h2 id="stamp-duty">Stamp duty concession for first home buyers</h2>
      <p>
        Tasmania provides a <strong>50% stamp duty concession</strong> for
        eligible first home buyers purchasing established homes up to a $600,000
        threshold (verify current threshold at sro.tas.gov.au).
      </p>
      <p>
        Stamp duty on a $500,000 Tasmanian property is roughly $18,247. With the
        50% concession, an eligible first home buyer pays around $9,123, a saving
        of roughly $9,000.
      </p>

      <Callout variant="info" title="Pick one path: new or established">
        <p>
          The FHOG applies to new homes; the 50% stamp duty concession applies to
          established homes. You can't use both on the same property. Decide which
          path suits your target price and area.
        </p>
      </Callout>

      <table>
        <thead>
          <tr><th>Scenario</th><th>Benefit</th><th>Property type</th></tr>
        </thead>
        <tbody>
          <tr><td>Buying new / building</td><td>$30,000 FHOG + normal stamp duty</td><td>New homes only</td></tr>
          <tr><td>Buying established</td><td>50% stamp duty concession (up to $600,000)</td><td>Established homes only</td></tr>
        </tbody>
      </table>

      <h2 id="federal-schemes">Federal government schemes</h2>

      <h3>First Home Guarantee</h3>
      <p>
        5% deposit, no LMI. Tasmania price cap is{" "}
        <strong>$600,000 across all areas</strong> (metro and regional), reflecting
        the state's more uniform property values. Income caps: $125,000 single /
        $200,000 couple (combined taxable income from the previous financial year).
      </p>

      <h3>Regional First Home Buyer Guarantee</h3>
      <p>
        Same 5% deposit / no LMI benefit, specifically for buyers in regional
        areas who've lived in that region for 12+ months. Most of Tasmania outside
        Hobart is regional, so this applies to buyers in Launceston, Burnie,
        Devonport, and surrounds.
      </p>

      <h3>First Home Super Saver Scheme (FHSSS)</h3>
      <p>
        Voluntary super contributions of up to $15,000/year (capped at $50,000
        total), withdrawable as a home deposit. The tax saving is the difference
        between the 15% super rate and your marginal income tax rate.
      </p>

      <h2 id="affordability">Tasmania, one of Australia's most affordable states</h2>
      <p>
        Despite COVID-era growth, Tasmania remains considerably more affordable
        than most mainland capitals. For first home buyers priced out of Sydney or
        Melbourne, Tasmania offers genuine value, particularly in regional centres.
      </p>
      <ul>
        <li>Hobart medians are significantly lower than Sydney, Melbourne, and Brisbane</li>
        <li>Launceston, Burnie, and Devonport offer further affordability</li>
        <li>The $30,000 FHOG covers a higher proportion of a typical deposit relative to purchase price</li>
        <li>Growing remote work culture has made Tasmania viable for mainland workers</li>
      </ul>
      <p>
        Note: Tasmanian rental yields have historically been strong, attracting
        investor competition that can affect entry pricing in some segments.
      </p>

      <h2 id="key-areas">Key property markets, Hobart, Launceston, and Burnie</h2>

      <h3>Hobart</h3>
      <p>
        Tasmania's capital. Inner suburbs (Battery Point, Sandy Bay, North Hobart)
        sit at premium prices; outer suburbs and satellite towns like Glenorchy,
        Clarence and Kingborough offer more accessible entry points for first home
        buyers.
      </p>

      <h3>Launceston</h3>
      <p>
        Tasmania's second-largest city and the main commercial centre of the
        north. Lower medians than Hobart, with strong community infrastructure,
        good schools, and improving connectivity.
      </p>

      <h3>Burnie and the north-west coast</h3>
      <p>
        Burnie, Devonport, and surrounds are among the most affordable property
        markets in Australia. First home buyers can access quality homes well
        within the $600,000 First Home Guarantee cap, often comfortably below it.
      </p>

      <h2 id="eligibility">Eligibility requirements</h2>
      <p>To qualify for the Tasmanian FHOG:</p>
      <ul>
        <li>Be an Australian citizen or permanent resident</li>
        <li>Be 18 years or older</li>
        <li>Have never previously owned residential property in Australia used as a place of residence</li>
        <li>Occupy the new home as your principal place of residence for at least 6 months, starting within 12 months of settlement</li>
        <li>The property must be a new home (not previously occupied or sold as a residence)</li>
      </ul>
      <p>
        For the stamp duty concession on established homes, standard FHB criteria
        apply. Confirm exact requirements at sro.tas.gov.au.
      </p>

      <h2 id="steps">Step-by-step, buying your first home in Tasmania</h2>
      <ol>
        {STEPS.map((s) => (
          <li key={s.step}>
            <strong>{s.title}.</strong> {s.desc}
          </li>
        ))}
      </ol>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>State Revenue Office Tasmania (SRO)</strong>, FHOG and stamp duty:{" "}
          <a href="https://www.sro.tas.gov.au" target="_blank" rel="noopener noreferrer">sro.tas.gov.au</a>
        </li>
        <li>
          <strong>Consumer, Building and Occupational Services (CBOS)</strong>, property and tenancy:{" "}
          <a href="https://www.cbos.tas.gov.au" target="_blank" rel="noopener noreferrer">cbos.tas.gov.au</a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">housingaustralia.gov.au</a>
        </li>
        <li>
          <strong>ATO, First Home Super Saver Scheme:</strong>{" "}
          <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme" target="_blank" rel="noopener noreferrer">ato.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
