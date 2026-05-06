import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Best Brisbane Suburbs for Families in 2026",
  description:
    "The 10 best Brisbane suburbs for families in 2026, ranked by school quality, parks, walkability, commute time and median house price. Honest pros and cons for each.",
  slug: "best-brisbane-suburbs-for-families-2026",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 10,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
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
  "The best family suburbs in Brisbane balance four things: well-rated schools (ICSEA 1050+), short commute to the CBD or major employer hubs, parks and walkability, and a median house price you can actually finance.",
  "Established middle-ring favourites: Wilston, Wavell Heights, Chelmer, Kenmore, Holland Park West.",
  "Outer-ring growth corridors with strong school catchments: Cleveland, Carindale, Bridgeman Downs, Springfield Lakes.",
  "Inner south for walkable family living: Annerley, Tarragindi, Greenslopes — close to top secondary schools and the South East Busway.",
  "Avoid common pitfalls: don't lock yourself out of catchment for the high school you actually want, and check flood overlays before signing anywhere along the Brisbane River or Norman Creek.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-makes",     label: "What makes a suburb family-friendly" },
  { id: "established",    label: "Established middle-ring favourites" },
  { id: "outer-growth",   label: "Outer-ring growth corridors" },
  { id: "inner-south",    label: "Inner south walkable picks" },
  { id: "schools",        label: "School catchment strategy" },
  { id: "flood",          label: "Flood &amp; hazard checks" },
  { id: "budget",         label: "Budget &amp; finance" },
  { id: "next-steps",     label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "What's the cheapest family suburb in Brisbane in 2026?",
    answer:
      "On a per-square-metre and per-school-quality basis, outer suburbs like Springfield Lakes, Bridgeman Downs, and parts of Logan offer the most house for the money while still keeping access to a reasonable state high school. Inner-city family suburbs (Wilston, Chelmer, Kenmore) are 50% to 100% more expensive for similar block sizes.",
  },
  {
    question: "Which Brisbane suburb has the best schools?",
    answer:
      "By ICSEA score, the strongest state primary schools cluster around Indooroopilly, Ironside, Brisbane Central, Sunnybank Hills, and parts of the inner north (Wilston, Newmarket). For state secondary schools, Indooroopilly State High and Brisbane State High Schools dominate, but their catchments are tightly drawn — verify your specific address before assuming entry.",
  },
  {
    question: "How does flood risk vary across Brisbane?",
    answer:
      "Flood exposure is highly localised. The 2011 and 2022 floods affected specific creek systems and Brisbane River frontage — Norman Creek (Coorparoo, Greenslopes), Bulimba Creek, parts of Rocklea, Graceville, and lower Chelmer. Nearby streets above the flood line were unaffected. Always check the Brisbane City Council Flood Awareness Map for the specific property address before bidding.",
  },
  {
    question: "What's the typical commute time?",
    answer:
      "Inner-ring suburbs (Wilston, Annerley, Tarragindi): 15 to 25 minutes by car or bus to the CBD. Middle-ring (Carindale, Wavell Heights, Kenmore): 25 to 40 minutes. Outer-ring (Springfield Lakes, Cleveland, Bridgeman Downs): 35 to 60 minutes depending on traffic and time of day. Train and busway commutes can be faster than driving in peak.",
  },
  {
    question: "Should I buy in a Brisbane growth corridor?",
    answer:
      "If you're under-budgeted for established middle-ring, growth corridors like Springfield, North Lakes, and Ripley offer brand-new family infrastructure at substantially lower prices. The trade-off is commute time and slower capital growth than established markets. They suit families who'll stay 7 to 10+ years rather than 3 to 5.",
  },
  {
    question: "How do I check school catchment boundaries?",
    answer:
      "The Queensland Department of Education runs an online catchment finder. Enter the property address; the tool returns the in-catchment primary and secondary state schools. Always verify before exchanging contracts — boundaries shift periodically and a street that was \"in\" five years ago may now be \"out\".",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Brisbane Property Market 2026", href: "/blog/brisbane-property-market-2026", description: "Macro outlook for the Brisbane market — supply, demand, and the SEQ growth corridor." },
  { title: "Best Suburbs Australia: For Families", href: "/best-suburbs/for-families", description: "Our ranked list of family-friendliest suburbs nationally." },
  { title: "Top 5 Suburbs for Families in Moreton Bay", href: "/blog/top-5-suburbs-families-moreton-bay", description: "If you'd consider just north of Brisbane, the Moreton Bay corridor is one of SEQ's strongest family pockets." },
  { title: "Stamp Duty Calculator", href: "/stamp-duty-calculator", description: "Estimate Queensland stamp duty for your shortlisted properties." },
  { title: "Free Property Appraisal", href: "/appraisal", description: "Already own in Brisbane and considering a family upgrade? Start with a current appraisal." },
];

export default function BestBrisbaneFamilySuburbsGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="What we mean by 'best for families'">
        <p>
          We score on four pillars: well-rated state and private schools, walk
          and bike infrastructure (parks, paths, low traffic streets),
          commute to major employer hubs, and a median price that's still
          financeable for a household earning $180K to $250K.
        </p>
      </Callout>

      <h2 id="what-makes">What makes a Brisbane suburb family-friendly</h2>
      <p className="lead">
        Brisbane's geography is unusual: a sprawling, river-dominated grid
        with strong middle-ring suburbs and a fast-growing outer ring. Pockets
        of the inner south have transformed from light-industrial to
        family-friendly in the last decade. The right suburb for you depends
        on your school priorities, budget, and tolerance for commute.
      </p>

      <h2 id="established">Established middle-ring favourites</h2>

      <h3>Wilston (4051)</h3>
      <p>
        Tree-lined streets, character Queenslanders, walking distance to
        Wilston State School and a short bus or train ride to the CBD. Premium
        pricing — median house around $1.4M to $1.6M — but some of Brisbane's
        most consistent family demand.
      </p>

      <h3>Wavell Heights (4012)</h3>
      <p>
        Just to the north, Wavell Heights offers larger blocks at a 25% to 35%
        discount to Wilston, with the Wavell State High catchment. Solid
        primary schools, easy access to Westfield Chermside and the Northern
        Busway.
      </p>

      <h3>Chelmer (4068)</h3>
      <p>
        Western suburbs prestige pocket on the river. Sherwood State School
        catchment and proximity to private schools. Pay attention to flood
        overlays on the riverside streets — the higher streets above
        Honour Avenue are above the 2011 line.
      </p>

      <h3>Kenmore (4069)</h3>
      <p>
        Family-suburb classic on the western edge of Brisbane. Kenmore South
        State School and Kenmore State High catchment, multiple parks,
        community pool. Median house $1.1M to $1.3M.
      </p>

      <h3>Holland Park West (4121)</h3>
      <p>
        Inner south, close to Greenslopes Hospital and the South East Busway,
        with the Cavendish Road State High catchment. A genuine value pick
        for families wanting inner-ring access at an outer-ring price.
      </p>

      <h2 id="outer-growth">Outer-ring growth corridors</h2>

      <h3>Springfield Lakes (4300)</h3>
      <p>
        Master-planned community with new schools (state and private), Orion
        Springfield town centre, train line into the CBD. Median house $700K
        to $850K — a meaningful step down from middle-ring prices.
      </p>

      <h3>Cleveland (4163)</h3>
      <p>
        Bayside suburb with established infrastructure, Cleveland District
        State High catchment, and bay access. 35 to 45 minute commute to
        CBD. Stronger long-term growth than most Logan corridors.
      </p>

      <h3>Carindale (4152)</h3>
      <p>
        Already established but worth flagging — Westfield Carindale, multiple
        parks, the Carindale State School and Whites Hill State College
        catchment. Median house around $1.2M.
      </p>

      <h3>Bridgeman Downs (4035)</h3>
      <p>
        North-west growth corridor, large blocks, McDowall State School
        catchment. About 25 to 35 minutes to the CBD on a good run. Median
        house $1.1M to $1.3M.
      </p>

      <h2 id="inner-south">Inner south walkable picks</h2>

      <h3>Annerley (4103)</h3>
      <p>
        7km to the CBD, served by the South East Busway and rail. Junction
        Park State School and Yeronga State High catchment. Strong cafe and
        small-business culture, character pre-war housing.
      </p>

      <h3>Tarragindi (4121)</h3>
      <p>
        Quiet ridge-top streets, Wellers Hill State School, well-rated for
        inner-south family living. Median house around $1.3M to $1.5M.
      </p>

      <h3>Greenslopes (4120)</h3>
      <p>
        Hospital district, walkable to Stones Corner shops, Greenslopes State
        School. Watch flood overlays on streets backing onto Norman Creek.
      </p>

      <KeyFigure
        value="$700K to $1.6M"
        label="Median house price range across these family suburbs"
        context="Outer-ring (Springfield, Cleveland) at the bottom; established middle-ring (Wilston, Chelmer) at the top."
      />

      <h2 id="schools">School catchment strategy</h2>
      <p>
        State school catchments in Queensland are strict — your address
        determines your enrolment right. Three rules of thumb:
      </p>
      <ol>
        <li>
          <strong>Verify the address, not the suburb.</strong> Catchment
          boundaries cut through suburbs. Two houses on the same street can
          fall into different catchments.
        </li>
        <li>
          <strong>Plan for the secondary catchment, not just primary.</strong>
          Primary catchments are easy to satisfy across most suburbs. The
          binding constraint is usually the high school catchment 7 to 8 years
          later.
        </li>
        <li>
          <strong>Read the official map.</strong> The Department of Education's
          catchment finder is the source of truth. Real estate ads sometimes
          overstate which schools a property is "near".
        </li>
      </ol>

      <h2 id="flood">Flood &amp; hazard checks</h2>
      <p>
        Brisbane's 2011 and 2022 floods were highly localised. Before you
        bid:
      </p>
      <ul>
        <li>
          Pull the property's flood report from Brisbane City Council's
          Flood Awareness Map.
        </li>
        <li>
          Check insurance availability and premium quote — a property the
          insurer won't cover (or quotes $8,000+/year) is a red flag.
        </li>
        <li>
          Look at the floor height vs the 2011 and 2022 high water marks. A
          house elevated above the line, even on a low-lying street, can be
          a different proposition to the one next door.
        </li>
      </ul>

      <Callout variant="warning" title="Flood overlay isn't the same as flood risk">
        <p>
          A property can be in a flood overlay (declared zone) but elevated
          above any historical flood line. Conversely, a property "outside"
          the overlay can still flood in a freak event. Read the actual flood
          report and look at street-level photos from 2011 and 2022 if
          available.
        </p>
      </Callout>

      <h2 id="budget">Budget &amp; finance</h2>
      <p>
        Use the{" "}
        <a href="/borrowing-power-calculator">Borrowing Power Calculator</a>{" "}
        and{" "}
        <a href="/stamp-duty-calculator">Stamp Duty Calculator</a> to back
        into your real budget. Queensland stamp duty for a $1.2M family home
        is roughly $48,000 at the standard rate; first home buyers get
        substantial concessions up to $700K with partial relief to $800K.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Shortlist three suburbs from above, weighting by school priority and
          commute tolerance.
        </li>
        <li>
          Check school catchment boundaries on the Department of Education
          catchment finder for the exact streets you'd consider.
        </li>
        <li>
          Pull comparable sales for each suburb on{" "}
          <a href="/sold">recently sold</a>.
        </li>
        <li>
          Run flood reports on any address you're seriously considering.
        </li>
        <li>
          Read our{" "}
          <a href="/blog/brisbane-property-market-2026">Brisbane 2026 outlook</a>{" "}
          for the macro context.
        </li>
      </ol>
    </GuideArticleLayout>
  );
}
