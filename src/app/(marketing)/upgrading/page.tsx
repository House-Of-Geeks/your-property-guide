import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { SITE_NAME } from "@/lib/constants";

const persona = PERSONA_BY_ID["upgrading"];

export const metadata: Metadata = {
  title: `Upgrading or downsizing your home | ${SITE_NAME}`,
  description: "Selling and buying at the same time, suburb comparison, and how the numbers work when you're moving from one home to another.",
  alternates: { canonical: persona.hubPath },
};

export default function UpgradingPage() {
  return <PersonaHubLayout personaId="upgrading" />;
}
