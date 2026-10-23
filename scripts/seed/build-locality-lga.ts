/**
 * Builds scripts/seed/data/locality-lga.json: suburb/locality -> LGA, from the
 * ABS ASGS Edition 3 allocation files (public, no licence key needed):
 *
 *   SAL_2021_AUST.xlsx  Mesh Block -> Suburbs and Localities 2021
 *   LGA_2025_AUST.xlsx  Mesh Block -> Local Government Areas 2025
 *   POA_2021_AUST.xlsx  Mesh Block -> Postal Areas 2021 (only used to tell
 *                       apart same-named localities in different councils)
 *
 * https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs/edition-3-july-2021-june-2026/access-and-downloads/allocation-files
 *
 * Both files share Mesh Block codes, so each locality's area is split by
 * council exactly. A locality split across councils goes to the council with
 * the largest share of its area (ties broken alphabetically); every split is
 * recorded in the output so the importer can log it.
 *
 * Run: npx tsx scripts/seed/build-locality-lga.ts <SAL_2021_AUST.xlsx> <LGA_2025_AUST.xlsx> <POA_2021_AUST.xlsx>
 */
import * as fs from "node:fs";
import * as path from "node:path";
import * as XLSX from "xlsx";
import { appLgaName, normaliseLocality, type LocalityLgaData } from "./lib/locality-lga";

const STATE_ABBR: Record<string, string> = {
  "New South Wales": "NSW",
  Victoria: "VIC",
  Queensland: "QLD",
  "South Australia": "SA",
  "Western Australia": "WA",
  Tasmania: "TAS",
  "Northern Territory": "NT",
  "Australian Capital Territory": "ACT",
  "Other Territories": "OT",
};

function readRows(file: string): Record<string, unknown>[] {
  const wb = XLSX.read(fs.readFileSync(file), { type: "buffer", dense: true });
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
}

function main() {
  const [salFile, lgaFile, poaFile] = process.argv.slice(2);
  if (!salFile || !lgaFile || !poaFile) {
    console.error("Usage: tsx scripts/seed/build-locality-lga.ts <SAL_2021_AUST.xlsx> <LGA_2025_AUST.xlsx> <POA_2021_AUST.xlsx>");
    process.exit(1);
  }

  const mbToLga = new Map<string, string>();
  for (const r of readRows(lgaFile)) {
    mbToLga.set(String(r.MB_CODE_2021), String(r.LGA_NAME_2025));
  }

  const mbToPoa = new Map<string, string>();
  for (const r of readRows(poaFile)) mbToPoa.set(String(r.MB_CODE_2021), String(r.POA_CODE_2021));
  const salPostcodes = new Map<string, Set<string>>(); // "STATE|SAL name" -> postcodes overlapped

  // state -> normalised locality -> sal name -> lga -> km2
  const area = new Map<string, Map<string, Map<string, Map<string, number>>>>();
  for (const r of readRows(salFile)) {
    const st = STATE_ABBR[String(r.STATE_NAME_2021)];
    const rawLga = mbToLga.get(String(r.MB_CODE_2021));
    const km2 = Number(r.AREA_ALBERS_SQKM) || 0;
    if (!st || !rawLga) continue;
    const lga = appLgaName(rawLga);
    if (!lga) continue;
    const salName = String(r.SAL_NAME_2021);
    const poa = mbToPoa.get(String(r.MB_CODE_2021));
    if (poa) {
      const k = `${st}|${salName}`;
      (salPostcodes.get(k) ?? salPostcodes.set(k, new Set()).get(k)!).add(poa);
    }
    const norm = normaliseLocality(salName);
    if (!norm) continue;
    const byNorm = area.get(st) ?? new Map();
    const bySal = byNorm.get(norm) ?? new Map();
    const byLga = bySal.get(salName) ?? new Map();
    byLga.set(lga, (byLga.get(lga) ?? 0) + km2);
    bySal.set(salName, byLga);
    byNorm.set(norm, bySal);
    area.set(st, byNorm);
  }

  const data: LocalityLgaData = {
    source:
      "ABS ASGS Edition 3 allocation files SAL_2021_AUST + LGA_2025_AUST joined on Mesh Block; largest area share per locality",
    localities: {},
    splits: {},
    ambiguous: {},
  };

  for (const [st, byNorm] of [...area].sort(([a], [b]) => a.localeCompare(b))) {
    data.localities[st] = {};
    for (const [norm, bySal] of [...byNorm].sort(([a], [b]) => a.localeCompare(b))) {
      const winners = new Set<string>();
      const perSal: Array<[string, string[]]> = [];
      let splitFor: Array<[string, number]> | undefined;
      for (const [salName, byLga] of bySal) {
        const ranked = [...byLga].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        winners.add(ranked[0][0]);
        perSal.push([ranked[0][0], [...(salPostcodes.get(`${st}|${salName}`) ?? [])].sort()]);
        if (ranked.length > 1 && bySal.size === 1) {
          splitFor = ranked.map(([l, k]) => [l, Math.round(k * 100) / 100]);
        }
      }
      if (winners.size > 1) {
        (data.ambiguous[st] ??= {})[norm] = perSal;
        continue;
      }
      data.localities[st][norm] = [...winners][0];
      if (splitFor) (data.splits[st] ??= {})[norm] = splitFor;
    }
  }

  const out = path.join(__dirname, "data", "locality-lga.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(data) + "\n");
  const n = Object.values(data.localities).reduce((a, m) => a + Object.keys(m).length, 0);
  const s = Object.values(data.splits).reduce((a, m) => a + Object.keys(m).length, 0);
  console.log(`Wrote ${out}: ${n} localities, ${s} split across councils, ${Object.values(data.ambiguous).reduce((a, m) => a + Object.keys(m).length, 0)} same-name pairs resolved by postcode`);
}

main();
