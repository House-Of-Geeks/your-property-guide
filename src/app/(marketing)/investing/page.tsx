import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const persona = PERSONA_BY_ID["investing"];
const content = PERSONA_HUB_CONTENT["investing"];

export const metadata: Metadata = {
  // Targets "property investing" (5,400/mo, $8.72 CPC), "investment
  // property" (5,400/mo), and "property investment australia" (1,900/mo,
  // $6 CPC). High lead value due to CPC.
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: persona.hubPath },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    type: "website",
  },
};

export default function InvestingPage() {
  return <PersonaHubLayout personaId="investing" />;
}
