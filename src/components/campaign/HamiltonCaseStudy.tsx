import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HAMILTON, dollars, expectedIncrease } from "@/lib/case-studies";
import { chapterHref } from "@/lib/guide-books";
import { BandLead, BandTitle, Eyebrow } from "./parts";
import { SHELL } from "./shell";

// A real example (19 Oct 2026), replacing the two illustrative homes. Only
// the facts Andy supplied (src/lib/case-studies.ts): the place, the
// property, its starting condition, the work, the spend and the two expected
// sale prices. The three figures sit side by side so they're easy to compare,
// and the small print says what they are and aren't. No photographs until
// real ones of the apartment exist.

const LESSONS = [
  {
    title: "Assess the property first",
    body: "Know what it’s worth as it stands, and what’s holding the price back, before you spend a dollar.",
    link: { label: "What your property is really worth", href: chapterHref("selling", 2) },
  },
  {
    title: "Improve the layout and presentation",
    body: "Look at how the space works and how it presents to buyers, not only at what’s broken.",
    link: { label: "Preparing your property for the top buyer", href: chapterHref("selling", 4) },
  },
  {
    title: "Choose where to spend before listing",
    body: "Set a budget, get quotes, and put the money where buyers will see the difference.",
    link: { label: "What to fix before selling", href: "/guides/what-to-fix-before-selling-a-house" },
  },
] as const;

export function HamiltonCaseStudy() {
  const c = HAMILTON;
  const figures = [
    { label: "Expected sale price before the work", value: dollars(c.expectedBefore), tone: "plain" },
    { label: "Renovation spend", value: dollars(c.spend), tone: "spend" },
    { label: "Expected sale price after the work", value: dollars(c.expectedAfter), tone: "after" },
  ] as const;

  return (
    <section aria-labelledby="case-study-title" className="bg-sand py-16 sm:py-24">
      <div className={SHELL}>
        <div className="max-w-3xl">
          <Eyebrow>{`A real example · ${c.place}`}</Eyebrow>
          <BandTitle className="mt-4">
            <span id="case-study-title">Preparation changed where this apartment sat in the market.</span>
          </BandTitle>
          <BandLead className="mt-5">
            {`${c.property}, ${c.before.charAt(0).toLowerCase()}${c.before.slice(1)}. ${c.work} Here’s how its expected sale price moved.`}
          </BandLead>
        </div>

        <dl className="mt-10 grid overflow-hidden rounded-3xl border border-line bg-white sm:grid-cols-3">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className={`flex flex-col-reverse justify-end gap-2 p-6 sm:p-8 ${i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""} ${f.tone === "after" ? "bg-eucalyptus tone-dark" : ""}`}
            >
              <dt className="text-[15px] leading-snug text-ink-muted">{f.label}</dt>
              <dd className={`font-display text-[38px] leading-none tracking-[-0.01em] sm:text-[44px] ${f.tone === "after" ? "text-primary" : "text-ink"}`}>{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-ink">
          {`That’s a ${dollars(expectedIncrease(c))} increase in the expected sale price. It isn’t profit, and both figures are expected sale prices: not an achieved sale, a settled result or an independent valuation.`}
        </p>

        <div className="mt-12 border-t border-line-strong pt-10">
          <h3 className="text-xl text-ink">What you can take from it</h3>
          <ol className="mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
            {LESSONS.map((l, i) => (
              <li key={l.title}>
                <p className="font-display text-[28px] leading-none text-accent-dark" aria-hidden="true">{String(i + 1).padStart(2, "0")}</p>
                <h4 className="mt-3 text-lg font-bold text-ink">{l.title}</h4>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{l.body}</p>
                <Link href={l.link.href} className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                  {l.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-muted">
          One property and one result. Most renovations won’t move a price this far, and some don’t pay back at all, so get price evidence and quotes before you spend.
        </p>
      </div>
    </section>
  );
}
