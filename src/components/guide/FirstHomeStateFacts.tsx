import Link from "next/link";
import { KeyFigure } from "@/components/guide/KeyFigure";
import { ScrollTable } from "@/components/guide/ScrollTable";
import { AUSTRALIAN_STATES, type AustralianState } from "@/lib/utils/stamp-duty";
import { firstHomeTable, stampDutySlug } from "@/lib/data/stamp-duty-state";
import {
  FIRST_HOME_DUTY,
  FIRST_HOME_GRANTS,
  STATE_NAMES,
  dutyReliefCell,
  fmt,
  grantAmountText,
  grantCapCell,
  grantCapText,
  longDate,
} from "@/lib/data/first-home-grants";

/** "Revenue NSW, read 10 October 2026" as a link. */
function SourceLine({ label, href, checkedOn }: { label: string; href: string; checkedOn: string }) {
  return (
    <>
      Source:{" "}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
      , read {longDate(checkedOn)}.
    </>
  );
}

/**
 * The state's first home owner grant from src/lib/data/first-home-grants.ts:
 * the amount, the caps, the contract-date window and the source, so every
 * guide prints the revenue office's figure and a change lands in one file.
 */
export function FirstHomeGrantFacts({ state }: { state: AustralianState }) {
  const g = FIRST_HOME_GRANTS[state];
  if (g.amount === null) {
    return (
      <>
        <KeyFigure value="$0" label="The ACT has paid no first home owner grant since 1 July 2019." context="Replaced by the Home Buyer Concession Scheme" />
        <p>
          {g.window}. <SourceLine {...g.source} checkedOn={g.checkedOn} />
        </p>
      </>
    );
  }
  return (
    <>
      <KeyFigure
        value={fmt(g.amount)}
        label={`The ${g.name} in ${STATE_NAMES[state]}${g.upTo ? " (up to this amount)" : ""}, for a new home only, ${g.caps.length === 0 ? "with no price cap" : `with a price cap of ${grantCapText(state)}`}.`}
        context={g.endsOn ? `Contracts to ${g.endsOn}` : "Established homes do not qualify"}
      />
      <ul>
        <li>
          <strong>Amount:</strong> {grantAmountText(state)}
          {g.upTo ? ", or the price paid if that is less" : ""}.
        </li>
        <li>
          <strong>Price cap:</strong>{" "}
          {g.caps.length === 0 ? "none" : grantCapText(state)}.
        </li>
        <li>
          <strong>Contract dates:</strong> {g.window}.
        </li>
        {g.previously && (
          <li>
            <strong>Before that:</strong> {g.previously}.
          </li>
        )}
        <li>
          <strong>Established homes:</strong> not eligible for the grant.
        </li>
      </ul>
      <p>
        <SourceLine {...g.source} checkedOn={g.checkedOn} />
      </p>
    </>
  );
}

/**
 * First home buyer duty relief for the state: the rule from the data file,
 * and what an eligible buyer pays at price points across the thresholds,
 * worked by the stamp duty engine (the same table as the state stamp duty
 * guide).
 */
export function FirstHomeDutyFacts({ state }: { state: AustralianState }) {
  const d = FIRST_HOME_DUTY[state];
  const table = firstHomeTable(state);
  return (
    <>
      <p>
        <strong>{d.scheme}:</strong> {d.rule}
      </p>
      {d.land && (
        <p>
          Vacant land for a first home: no duty up to {fmt(d.land.exemptTo)}
          {d.land.concessionTo !== null ? <>, a concession to {fmt(d.land.concessionTo)}</> : null}.
        </p>
      )}
      {d.note && <p>{d.note}</p>}
      {table && (
        <ScrollTable label={table.caption}>
          <table>
            <caption>{table.caption}</caption>
            <thead>
              <tr>{table.head.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>
      )}
      <p>
        <SourceLine {...d.source} checkedOn={d.checkedOn} />{" "}
        {table ? "Duty figures are worked by our stamp duty calculator on the revenue office's rates. " : ""}
        Our <Link href={`/guides/${stampDutySlug(state)}`}>{state} stamp duty guide</Link> has the full rates and worked examples.
      </p>
    </>
  );
}

/**
 * Grants and first home duty relief in every state and territory, one row
 * each, from the data file. For the FHOG guide and the national guide.
 */
export function FirstHomeByStateTable({ linkGuides = true }: { linkGuides?: boolean }) {
  return (
    <ScrollTable label="First home grants and duty relief by state and territory">
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Grant (new homes)</th>
            <th>Grant price cap</th>
            <th>First home duty relief</th>
            <th>Contract dates</th>
            <th>Source, checked</th>
          </tr>
        </thead>
        <tbody>
          {AUSTRALIAN_STATES.map((s) => {
            const g = FIRST_HOME_GRANTS[s];
            const d = FIRST_HOME_DUTY[s];
            return (
              <tr key={s}>
                <td>
                  {linkGuides ? <Link href={`/guides/first-home-buyer-${s.toLowerCase()}`}>{s}</Link> : s}
                </td>
                <td>{g.amount === null ? "None since 1 July 2019" : `${grantAmountText(s)} (${g.name})`}</td>
                <td>{grantCapCell(s)}</td>
                <td>{dutyReliefCell(s)}</td>
                <td>{g.window}</td>
                <td>
                  <a href={g.source.href} target="_blank" rel="noopener noreferrer">{g.source.label.split(":")[0]}</a>, {longDate(g.checkedOn)};{" "}
                  <a href={d.source.href} target="_blank" rel="noopener noreferrer">duty</a>, {longDate(d.checkedOn)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollTable>
  );
}
