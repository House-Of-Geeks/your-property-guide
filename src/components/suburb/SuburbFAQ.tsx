import { FAQPageJsonLd } from "@/components/seo";
import type { Suburb } from "@/types";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { fullLgaName } from "@/lib/utils/lga-names";

interface SuburbFAQProps {
  suburb: Suburb;
}

/**
 * Long-tail SEO block for suburb pages. Generates Q&As from data the
 * suburb already has, only including questions for which the answer is
 * actually known. Emits FAQPage JSON-LD so Google can surface answers
 * directly in SERP (and answer voice queries).
 *
 * Question selection is biased toward what real searchers ask, based on
 * "people also ask" queries for "[suburb] real estate / suburb / postcode"
 * pattern across AU.
 */
export function SuburbFAQ({ suburb }: SuburbFAQProps) {
  const faqs: { question: string; answer: string }[] = [];
  const sn = suburb.name;
  const region = fullLgaName(suburb.region);

  // Median house price + growth
  if (suburb.stats.medianHousePrice) {
    const growth =
      suburb.stats.annualGrowthHouse != null
        ? ` Annual growth is ${formatPercentage(suburb.stats.annualGrowthHouse)}.`
        : "";
    const unit =
      suburb.stats.medianUnitPrice
        ? ` The median unit price is ${formatPriceFull(suburb.stats.medianUnitPrice)}.`
        : "";
    faqs.push({
      question: `What is the median house price in ${sn}?`,
      answer: `The median house price in ${sn}, ${suburb.state} ${suburb.postcode} is ${formatPriceFull(suburb.stats.medianHousePrice)}.${unit}${growth}`,
    });
  }

  // Postcode, almost always present, useful for voice search
  faqs.push({
    question: `What is the ${sn} postcode?`,
    answer: `${sn} is in the ${suburb.postcode} postcode, in ${suburb.state}${region ? `, in the ${region} region` : ""}.`,
  });

  // Median rent
  if (suburb.stats.medianRentHouse || suburb.stats.medianRentUnit) {
    const parts: string[] = [];
    if (suburb.stats.medianRentHouse) parts.push(`The median weekly rent for houses is $${suburb.stats.medianRentHouse}`);
    if (suburb.stats.medianRentUnit)  parts.push(`for units it's $${suburb.stats.medianRentUnit}`);
    faqs.push({
      question: `What is the average rent in ${sn}?`,
      answer: `${parts.join(", ")}.`,
    });
  }

  // Schools
  if (suburb.schools.length > 0) {
    const top = suburb.schools.slice(0, 3).map((s) => s.name).join(", ");
    faqs.push({
      question: `What schools are in ${sn}?`,
      answer: `There are ${suburb.schools.length} schools serving ${sn} on this page, including ${top}.`,
    });
  }

  // Walkability, only describe if scores exist
  const ws = suburb.stats.walkScore;
  if (ws != null) {
    const ts = suburb.stats.transitScore;
    const bs = suburb.stats.bikeScore;
    const descriptor =
      ws >= 70 ? "very walkable" :
      ws >= 50 ? "somewhat walkable" :
      ws >= 25 ? "car-dependent for most errands" :
                 "highly car-dependent";
    const extras: string[] = [];
    if (ts != null) extras.push(`transit score ${ts}`);
    if (bs != null) extras.push(`bike score ${bs}`);
    const extra = extras.length ? ` ${extras.join(", ")}.` : "";
    faqs.push({
      question: `How walkable is ${sn}?`,
      answer: `${sn} has a Walk Score of ${ws} out of 100, ${descriptor}.${extra}`,
    });
  }

  // Nearby suburbs
  if (suburb.nearbySuburbs.length > 0) {
    const names = suburb.nearbySuburbs.slice(0, 5).map((slug) => {
      const parts = slug.split("-").slice(0, -2);
      return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
    });
    faqs.push({
      question: `What suburbs are near ${sn}?`,
      answer: `${sn} is close to ${names.join(", ")}.`,
    });
  }

  // Population + median age
  if (suburb.stats.population && suburb.stats.population > 0) {
    const age = suburb.stats.medianAge ? ` The median age is ${suburb.stats.medianAge}.` : "";
    faqs.push({
      question: `What is the population of ${sn}?`,
      answer: `${sn} has approximately ${suburb.stats.population.toLocaleString()} residents.${age}`,
    });
  }

  if (faqs.length === 0) return null;

  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <section id="faq" className="scroll-mt-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Frequently asked
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight">
              About <span className="italic text-primary">{sn}</span>.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <dl className="divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <dt className="font-display text-lg text-ink leading-snug mb-2">{faq.question}</dt>
                  <dd className="font-sans text-base text-ink-muted leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
