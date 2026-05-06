import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { SITE_NAME } from "@/lib/constants";

const persona = PERSONA_BY_ID["investing"];

export const metadata: Metadata = {
  title: `Property investing in Australia | ${SITE_NAME}`,
  description: "Investor-grade suburb data, yield calculators and tax explainers. Free, ungated, the same numbers a buyer's agent would run.",
  alternates: { canonical: persona.hubPath },
};

export default function InvestingPage() {
  return <PersonaHubLayout personaId="investing" />;
}
