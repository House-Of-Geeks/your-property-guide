// The negative gearing and CGT changes in the 2026–27 Budget, as passed by
// Parliament on 25 June 2026 and in force from 1 July 2027. One place for the
// sources, so /guides/negative-gearing-australia and /cgt-calculator cite the
// same documents with the same dates (all read 1 October 2026). The article
// /guides/cgt-changes-2026-budget carries the same list in its own HTML.
import type { SourceItem } from "@/components/guide";
import { BUDGET_SOURCE } from "@/lib/negative-gearing-calc";

/** The date the changes start, for negative gearing and for CGT. */
export const REFORM_START = "1 July 2027";
/** The negative gearing cut-off. It does not apply to the CGT change. */
export const NEGATIVE_GEARING_CUTOFF = "7:30pm AEST on 12 May 2026";

export const ATO_REFORM_SOURCE = {
  label: "ATO: Tax reform – Boosting home ownership – Reforming negative gearing and capital gains tax",
  href: BUDGET_SOURCE.url,
  note: "Last updated 29 June 2026, read 1 October 2026. The measures are law and apply from 1 July 2027; properties held at 7:30pm AEST on 12 May 2026 are exempt from the negative gearing change; the CGT change applies only to gains that accrue after 1 July 2027.",
} as const satisfies SourceItem;

export const ACT_SOURCE = {
  label: "Parliament of Australia: Treasury Laws Amendment (Tax Reform No. 1) Bill 2026",
  href: "https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/Bills_Search_Results/Result?bId=r7493",
  note: "Passed both Houses 25 June 2026, Royal Assent 26 June 2026 (Act No. 49 of 2026). Text as passed: sections 26-155 (negative gearing), 112-155 to 112-185 (the split at 1 July 2027), 115-102 (new residential dwellings) and Division 119 (30% minimum tax).",
} as const satisfies SourceItem;

export const EM_SOURCE = {
  label: "Explanatory memorandum to the Tax Reform No. 1 bills",
  href: "https://parlinfo.aph.gov.au/parlInfo/download/legislation/ems/r7493_ems_a90ad43e-17d7-4cd3-859b-84ac4e6f3dea/upload_pdf/JC018386.pdf;fileType=application%2Fpdf",
  note: "28 May 2026, with the supplementary explanatory memorandum for the Government's Senate amendments (June 2026). Who is outside the CGT change (paragraph 1.25); tables 1.1 and 1.2.",
} as const satisfies SourceItem;

export const BUDGET_EXPLAINER_SOURCE = {
  label: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
  href: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
  note: "12 May 2026. Transitional arrangements, the new build examples (table 2) and the worked cameos.",
} as const satisfies SourceItem;

export const TAX_REFORM_SOURCES: readonly SourceItem[] = [
  ATO_REFORM_SOURCE,
  ACT_SOURCE,
  EM_SOURCE,
  BUDGET_EXPLAINER_SOURCE,
];
