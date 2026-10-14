import Link from "next/link";
import { ScrollTable } from "./ScrollTable";
import { AUSTRALIAN_STATES, type AustralianState } from "@/lib/utils/stamp-duty";
import {
  FIRST_HOME_GRANTS,
  FIRST_HOME_REVIEWED_ON,
  currentDutyRelief,
  formatPolicyDate,
  grantAmountLabel,
  grantFor,
  summariseRelief,
} from "@/lib/policy/first-home";

const GUIDE: Record<AustralianState, string> = {
  NSW: "/guides/first-home-buyer-nsw",
  VIC: "/guides/first-home-buyer-vic",
  QLD: "/guides/first-home-buyer-qld",
  WA: "/guides/first-home-buyer-wa",
  SA: "/guides/first-home-buyer-sa",
  TAS: "/guides/first-home-buyer-tas",
  ACT: "/guides/first-home-buyer-act",
  NT: "/guides/first-home-buyer-nt",
};

/**
 * The first home owner grant in every state and territory, printed from
 * src/lib/policy/first-home.ts so the national guides change with the data.
 */
export function FirstHomeGrantTable({ guideLinks = false }: { guideLinks?: boolean }) {
  return (
    <>
    <ScrollTable label="First home owner grant by state">
      <table>
        <thead>
          <tr>
            <th>State or territory</th>
            <th>Grant</th>
            <th>What it covers</th>
            {guideLinks && <th>State guide</th>}
          </tr>
        </thead>
        <tbody>
          {AUSTRALIAN_STATES.map((s) => {
            const g = grantFor(s, FIRST_HOME_REVIEWED_ON, "new").version;
            const name = g && g.amount > 0 ? (g.name ?? FIRST_HOME_GRANTS[s].name) : null;
            return (
              <tr key={s}>
                <td><strong>{s}</strong></td>
                <td>{grantAmountLabel(s)}</td>
                <td>
                  {name && !/^First Home Owner/.test(name) ? `${name}: ` : ""}
                  {g?.summary ?? "No grant"}
                </td>
                {guideLinks && (
                  <td><Link href={GUIDE[s]}>{s} guide</Link></td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollTable>
    <p className="text-sm">Grants for a new home, checked against each revenue office on {formatPolicyDate(FIRST_HOME_REVIEWED_ON)}.</p>
    </>
  );
}

/**
 * First home buyer duty relief in every state and territory, by what you buy,
 * printed from src/lib/policy/first-home.ts.
 */
export function FirstHomeDutyTable() {
  return (
    <>
    <ScrollTable label="First home buyer stamp duty relief by state">
      <table>
        <thead>
          <tr>
            <th>State or territory</th>
            <th>Established home</th>
            <th>New home</th>
            <th>Vacant land to build</th>
          </tr>
        </thead>
        <tbody>
          {AUSTRALIAN_STATES.map((s) => (
            <tr key={s}>
              <td><strong>{s}</strong></td>
              <td>{summariseRelief(currentDutyRelief(s, "established"))}</td>
              <td>{summariseRelief(currentDutyRelief(s, "new"))}</td>
              <td>{summariseRelief(currentDutyRelief(s, "vacant-land"))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
    <p className="text-sm">
      For a contract signed now (in Tasmania, a settlement now). Checked against each revenue office on{" "}
      {formatPolicyDate(FIRST_HOME_REVIEWED_ON)}.
    </p>
    </>
  );
}
