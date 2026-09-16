import type { Suburb } from "@/types";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { fullLgaName } from "@/lib/utils/lga-names";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { describeSalesProvenance } from "@/lib/sales-provenance";
import { capitalCityFor } from "@/lib/utils/metro";

export interface SuburbFaq {
  question: string;
  answer: string;
}

/**
 * Builds the suburb page FAQ from data the suburb already has, including
 * a question only when its answer is actually known. Pure so it can be
 * tested without rendering; SuburbFAQ.tsx renders the result and emits
 * the FAQPage JSON-LD from the same list.
 *
 * Question selection is biased toward what real searchers ask, based on
 * "people also ask" queries for "[suburb] real estate / suburb / postcode"
 * and Search Console queries landing on suburb pages (Sep 2026).
 */
export function buildSuburbFaqs(suburb: Suburb): SuburbFaq[] {
  const faqs: SuburbFaq[] = [];
  const sn = suburb.name;
  const region = fullLgaName(suburb.region);

  // Median house price + growth. Same trust gate as the rest of the
  // page: QLD/WA census-mortgage proxy medians must not be published
  // as fact here — this block feeds FAQPage JSON-LD, so a wrong figure
  // would surface directly in SERP snippets.
  if (hasReliablePrice(suburb)) {
    // Truthy check on purpose: 0 is the service layer's "unknown /
    // implausible, don't print" sentinel for growth — `!= null` was
    // rendering "Annual growth is 0.0%" for those suburbs.
    const growth =
      suburb.stats.annualGrowthHouse
        ? ` Annual growth is ${formatPercentage(suburb.stats.annualGrowthHouse)}.`
        : "";
    const unit =
      suburb.stats.medianUnitPrice
        ? ` The median unit price is ${formatPriceFull(suburb.stats.medianUnitPrice)}.`
        : "";
    const prov = describeSalesProvenance({
      source: suburb.dataFreshness?.salesSource,
      periodEnd: suburb.dataFreshness?.salesPeriodEnd,
      updatedAt: suburb.dataFreshness?.salesAsOf,
      salesCount: suburb.dataFreshness?.salesCount,
      suburbName: sn,
    });
    const lead = prov?.geography === "area"
      ? `The median house price for the ABS statistical area (SA2) that takes in ${sn}, ${suburb.state} ${suburb.postcode} is ${formatPriceFull(suburb.stats.medianHousePrice)} (${prov.period}). ${prov.areaNote}`
      : `The median house price in ${sn}, ${suburb.state} ${suburb.postcode} is ${formatPriceFull(suburb.stats.medianHousePrice)}${prov ? ` (${prov.sentence.replace(/\.$/, "").replace(/^Median of /, "median of ")})` : ""}.`;
    faqs.push({
      question: `What is the median house price in ${sn}?`,
      answer: `${lead}${unit}${growth}`,
    });
    // "How much is my house worth in {suburb}" is how sellers phrase the
    // valuation query (Search Console, Sep 2026: landing at positions 28–75
    // on region and neighbouring-suburb pages). Answer with the median as a
    // starting range and point to the appraisal block on this page.
    faqs.push({
      question: `How much is my house worth in ${sn}?`,
      answer: `A useful starting point is the ${sn} median house price of ${formatPriceFull(suburb.stats.medianHousePrice)}${suburb.stats.medianUnitPrice ? ` (units ${formatPriceFull(suburb.stats.medianUnitPrice)})` : ""}. Your home will sit above or below that depending on land size, condition, position and what comparable homes nearby have sold for recently. For a figure specific to your property, request a free property appraisal from a local agent using the form on this page.`,
    });
  }

  // Postcode, almost always present, useful for voice search
  faqs.push({
    question: `What is the ${sn} postcode?`,
    answer: `${sn} is in the ${suburb.postcode} postcode, in ${suburb.state}${region ? `, in the ${region} region` : ""}.`,
  });

  // "Where is {suburb}?" — targets the huge "{suburb} {city}" navigational
  // cluster (e.g. "sunnybank brisbane") that competitor suburb profiles
  // rank top-10 for. Metro classification comes from postcode ranges, so
  // it's phrased at greater-city granularity, never street-level claims.
  const capital = capitalCityFor(suburb.state, suburb.postcode);
  faqs.push({
    question: `Where is ${sn}?`,
    answer: capital
      ? `${sn} is a suburb of ${capital.name}, in ${suburb.state} ${suburb.postcode}. It is part of the Greater ${capital.name} area${region ? `, in the ${region} region` : ""}.`
      : `${sn} is a regional suburb in ${suburb.state}, postcode ${suburb.postcode}${region ? `, in the ${region} region` : ""}.`,
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
      // Leads with the query phrase so the crawlable answer sentence
      // matches "population of {suburb}" searches verbatim.
      answer: `The population of ${sn} is approximately ${suburb.stats.population.toLocaleString()} (2021 Census).${age}`,
    });
  }

  return faqs;
}
