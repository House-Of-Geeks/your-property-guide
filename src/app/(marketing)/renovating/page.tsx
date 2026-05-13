import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { SITE_NAME } from "@/lib/constants";

const persona = PERSONA_BY_ID["renovating"];

export const metadata: Metadata = {
  title: `Renovating your home in Australia | ${SITE_NAME}`,
  description: "Renovation costs in 2026, how to finance the work, how to find a builder you can trust, and which jobs actually return the money. Plain English, ungated.",
  alternates: { canonical: persona.hubPath },
};

export default function RenovatingPage() {
  return <PersonaHubLayout personaId="renovating" />;
}
