import Link from "next/link";
import type { Suburb } from "@/types/suburb";
import type { RentalMarketModel } from "@/lib/rental-market";
import type { LandlordModel } from "@/lib/rental-landlord";
import { Faq } from "@/components/guide/Faq";
import { RentalMarketLandlordSections } from "./RentalMarketLandlordSections";
import { formatPriceFull } from "@/lib/utils/format";
import { monthYear } from "@/lib/rental-labels";

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="font-sans text-[13px] text-ink-muted mb-1.5">{label}</p>
      <p className="font-display text-2xl font-normal text-ink leading-none">{value}</p>
      {sub && <p className="font-sans text-xs text-ink-muted mt-2">{sub}</p>}
    </div>
  );
}

const changeText = (n: number | null) => (n === null ? undefined : `${n > 0 ? "+" : ""}${n}% over 12 months`);

const h2 = "font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em]";

/**
 * The rebuilt rental-market sub-page (fix item 13). Every section renders
 * only when the model says its data exists; the model also built the title
 * and the FAQ from the same figures, so nothing on the page promises what
 * another section cannot show. The header above it carries the answer
 * sentence and the page's one action (the selling guide for owners).
 */
export function RentalMarketSections({ suburb, slug, model: m, landlord }: { suburb: Suburb; slug: string; model: RentalMarketModel; landlord: LandlordModel }) {
  const c = m.current;
  if (!c) return null;
  const has = (s: RentalMarketModel["sections"][number]) => m.sections.includes(s);
  // One FAQPage per page: the rent FAQs and the landlord FAQs share it.
  const faqs = [...m.faqs, ...landlord.faqs];
  // The header's answer sentence already gives the house and unit medians
  // with their source; the cards earn their place only with more than that
  // (bedrooms or a 12-month change).
  const moreThanTheAnswer = Boolean(c.bed3 || c.bed2 || c.bed1 || m.change?.house != null || m.change?.unit != null);
  return (
    <>
      {moreThanTheAnswer && (
      <section id="current-rent" className="scroll-mt-20">
        <h2 className={`${h2} mb-5`}>Median weekly rent in {suburb.name}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {c.house && <MetricCard label="Houses (median)" value={`${money(c.house)}/wk`} sub={changeText(m.change?.house ?? null)} />}
          {c.unit && <MetricCard label="Units (median)" value={`${money(c.unit)}/wk`} sub={changeText(m.change?.unit ?? null)} />}
          {c.bed3 && <MetricCard label="3 bedroom" value={`${money(c.bed3)}/wk`} />}
          {c.bed2 && <MetricCard label="2 bedroom" value={`${money(c.bed2)}/wk`} />}
          {c.bed1 && <MetricCard label="1 bedroom" value={`${money(c.bed1)}/wk`} />}
        </div>
        {m.provenance && (
          <p className="font-sans text-xs text-ink-subtle mt-3">
            Source: {m.provenance}. Medians of new rentals recorded in the period.
          </p>
        )}
      </section>
      )}

      {has("yield") && (
        <section id="yield" className="scroll-mt-20 rounded-xl border border-line p-5 sm:p-8">
          <h2 className={`${h2} mb-5`}>Rental yield against the purchase price</h2>
          {m.yieldHouse && c.house && (
            <dl className="grid grid-cols-3 gap-4 sm:gap-6">
              <div>
                <dt className="font-sans text-[13px] text-ink-muted mb-1.5">Median house price</dt>
                <dd className="font-display text-xl sm:text-3xl font-normal text-ink leading-none">{formatPriceFull(suburb.stats.medianHousePrice)}</dd>
              </div>
              <div>
                <dt className="font-sans text-[13px] text-ink-muted mb-1.5">Median house rent</dt>
                <dd className="font-display text-xl sm:text-3xl font-normal text-ink leading-none">{money(c.house)}/wk</dd>
              </div>
              <div>
                <dt className="font-sans text-[13px] text-ink-muted mb-1.5">Gross yield, houses</dt>
                <dd className="font-display text-xl sm:text-3xl font-normal text-ink leading-none">{m.yieldHouse}%</dd>
              </div>
            </dl>
          )}
          {m.yieldUnit && c.unit && (
            <p className="font-sans text-sm text-ink-muted mt-5">
              Units: {money(c.unit)}/wk against a {formatPriceFull(suburb.stats.medianUnitPrice)} median, a gross yield of about {m.yieldUnit}%.
            </p>
          )}
          <p className="font-sans text-xs text-ink-subtle mt-5 leading-relaxed">
            {"Gross yield = weekly rent × 52 ÷ median price. Before rates, insurance, management fees, maintenance and vacancy. The "}
            <Link href="/rental-yield-calculator" className="underline hover:text-primary">rental yield calculator</Link>
            {" gives a net estimate. Price: "}
            <Link href={`/suburbs/${slug}#market`} className="underline hover:text-primary">{`${suburb.name} median house price`}</Link>
            {"."}
          </p>
        </section>
      )}

      {has("history") && (
        <section id="history" className="scroll-mt-20">
          <h2 className={`${h2} mb-5`}>How rents have moved</h2>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-warm border-b border-line">
                  <th scope="col" className="py-3 px-4 text-left font-semibold text-ink">Period</th>
                  <th scope="col" className="py-3 px-4 text-right font-semibold text-ink">Houses</th>
                  <th scope="col" className="py-3 px-4 text-right font-semibold text-ink">Units</th>
                  {m.columns.bed3 && <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden sm:table-cell">3 bed</th>}
                  {m.columns.bed2 && <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden sm:table-cell">2 bed</th>}
                  {m.columns.bed1 && <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden sm:table-cell">1 bed</th>}
                  {m.columns.bonds && <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden md:table-cell">New bonds</th>}
                </tr>
              </thead>
              <tbody>
                {m.history.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-medium text-ink whitespace-nowrap">{monthYear(row.periodDate)}</td>
                    <td className="py-3 px-4 text-right text-ink">{row.medianRentHouse ? `${money(row.medianRentHouse)}/wk` : "–"}</td>
                    <td className="py-3 px-4 text-right text-ink">{row.medianRentUnit ? `${money(row.medianRentUnit)}/wk` : "–"}</td>
                    {m.columns.bed3 && <td className="py-3 px-4 text-right text-ink hidden sm:table-cell">{row.medianRent3Bed ? `${money(row.medianRent3Bed)}/wk` : "–"}</td>}
                    {m.columns.bed2 && <td className="py-3 px-4 text-right text-ink hidden sm:table-cell">{row.medianRent2Bed ? `${money(row.medianRent2Bed)}/wk` : "–"}</td>}
                    {m.columns.bed1 && <td className="py-3 px-4 text-right text-ink hidden sm:table-cell">{row.medianRent1Bed ? `${money(row.medianRent1Bed)}/wk` : "–"}</td>}
                    {m.columns.bonds && <td className="py-3 px-4 text-right text-ink hidden md:table-cell">{row.bondLodgements ? row.bondLodgements.toLocaleString("en-AU") : "–"}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Landlord intent ("rental appraisal {suburb}", "property managers
          {suburb}") lands here: the fee table (commercial intent review
          30 Sep 2026, section 3.1). The owner's action (the selling guide)
          and the sale-appraisal link sit in the page header. */}
      <RentalMarketLandlordSections suburb={suburb} landlord={landlord} />

      {faqs.length > 0 && <Faq items={faqs} title={`Renting and investing in ${suburb.name}`} />}
    </>
  );
}
