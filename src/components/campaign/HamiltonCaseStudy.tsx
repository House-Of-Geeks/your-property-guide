import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HAMILTON, dollars, expectedIncrease } from "@/lib/case-studies";
import { chapterHref } from "@/lib/guide-books";
import { ByMove } from "./ByMove";
import { BandTitle, Eyebrow } from "./parts";
import { SHELL } from "./shell";

// A real example (19 Oct 2026), replacing the two illustrative homes. Only
// the facts Andy supplied (src/lib/case-studies.ts): the place, the
// property, its starting condition, the work, the spend and the two expected
// sale prices. Since 20 Oct 2026 the three figures lead, straight under a
// short headline, with the one qualification beneath them (expected prices,
// the difference isn't profit or a sale result); then the redesign in two
// sentences beside the labelled illustrations (the buyer doesn't want photos
// of her apartment online, so they're drawn, never photo-realistic); then
// what to take from it. No layout plan or itemised renovation breakdown
// exists, so none is shown. With Buying picked in the hero, one line says why
// the example matters to a buyer and the takeaways are a buyer's (general
// guidance, no new facts about the apartment).

type Lesson = { title: string; body: string; link: { label: string; href: string } };

const LESSONS: readonly Lesson[] = [
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
];

/** The same lesson, from the buyer's side of the table. */
const BUYER_LESSONS: readonly Lesson[] = [
  {
    title: "Look past the presentation",
    body: "Judge the layout, the light and the view, not the carpet and the paint.",
    link: { label: "Inspecting like a professional", href: chapterHref("buying", 5) },
  },
  {
    title: "Price the work before you offer",
    body: "Get quotes for what you’d change, and count them in the price you’re prepared to pay.",
    link: { label: "Renovation costs in 2026", href: "/guides/renovation-cost-australia-2026" },
  },
  {
    title: "Check what finished homes sell for",
    body: "Recent sales of renovated homes nearby show what the work could be worth, and what it couldn’t.",
    link: { label: "Suburb profiles", href: "/suburbs" },
  },
];

function Lessons({ heading, lessons }: { heading: string; lessons: readonly Lesson[] }) {
  return (
    <>
      <h3 className="text-xl text-ink">{heading}</h3>
      <ol className="mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
        {lessons.map((l, i) => (
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
    </>
  );
}

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
            <span id="case-study-title">{`What a ${dollars(c.spend)} redesign did to the expected sale price.`}</span>
          </BandTitle>
        </div>

        {/* The figures lead (20 Oct 2026): they're the strongest thing here. */}
        <dl className="mt-8 grid overflow-hidden rounded-3xl border border-line bg-white sm:mt-10 sm:grid-cols-3">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className={`flex flex-col-reverse justify-end gap-2 p-5 sm:p-8 ${i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""} ${f.tone === "after" ? "bg-eucalyptus tone-dark" : ""}`}
            >
              <dt className="text-[15px] leading-snug text-ink-muted">{f.label}</dt>
              <dd className={`font-display text-[36px] leading-none tracking-[-0.01em] sm:text-[44px] ${f.tone === "after" ? "text-primary" : "text-ink"}`}>{f.value}</dd>
            </div>
          ))}
        </dl>
        {/* The one qualification, said once. */}
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
          {`Both are expected sale prices, before and after the work. The ${dollars(expectedIncrease(c))} difference is an increase in expected sale price, not profit or an achieved sale result, and most renovations won’t move a price this far.`}
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="text-xl text-ink">The redesign</h3>
            <p className="mt-3 text-[17px] leading-relaxed text-ink">{`${c.property} with ${c.before}. ${c.work}`}</p>
            <ByMove
              buying={
                <p className="mt-4 text-[15px] leading-relaxed text-ink">
                  <span className="font-semibold">Why it matters when you’re buying:</span> a dated, boxed-in home is priced on how it looks today. What it could become, and what that would cost, is yours to work out before you offer.
                </p>
              }
              other={null}
            />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">The pictures are illustrations, not photographs of the apartment or the work done.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:col-span-8">
            {c.illustrations.map((im) => (
              <figure key={im.src} className="overflow-hidden rounded-3xl border border-line bg-white">
                <div className="relative aspect-[4/3] bg-surface-warm">
                  <Image src={im.src} alt={im.alt} fill sizes="(min-width: 1280px) 400px, (min-width: 640px) 48vw, 100vw" className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">Illustration</span>
                </div>
                <figcaption className="px-5 py-3 text-[15px] text-ink-muted">{im.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-line-strong pt-10">
          <ByMove
            buying={<Lessons heading="What it means when you’re buying" lessons={BUYER_LESSONS} />}
            other={<Lessons heading="What you can take from it" lessons={LESSONS} />}
          />
        </div>
      </div>
    </section>
  );
}
