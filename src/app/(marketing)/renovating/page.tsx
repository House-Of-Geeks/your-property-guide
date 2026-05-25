import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const persona = PERSONA_BY_ID["renovating"];
const content = PERSONA_HUB_CONTENT["renovating"];

export const metadata: Metadata = {
  // Targets "home renovation cost" (590/mo) and "renovating a house"
  // (480/mo). Moderate volume, consistent commercial intent.
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: persona.hubPath },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    type: "website",
  },
};

export default function RenovatingPage() {
  return <PersonaHubLayout personaId="renovating" />;
}
