import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { SITE_NAME } from "@/lib/constants";

const persona = PERSONA_BY_ID["first-home"];

export const metadata: Metadata = {
  title: `First home buyer guide | ${SITE_NAME}`,
  description: "Schemes, stamp duty, deposits, LMI and pre-approval, written for Australian first home buyers. Free, ungated, plain English.",
  alternates: { canonical: persona.hubPath },
};

export default function FirstHomeBuyersPage() {
  return <PersonaHubLayout personaId="first-home" />;
}
