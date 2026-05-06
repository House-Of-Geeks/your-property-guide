import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { SITE_NAME } from "@/lib/constants";

const persona = PERSONA_BY_ID["selling"];

export const metadata: Metadata = {
  title: `Selling your home in Australia | ${SITE_NAME}`,
  description: "What goes into a real appraisal, how agent fees work, and what to ask before you sign a listing agreement. Plain English, no nonsense.",
  alternates: { canonical: persona.hubPath },
};

export default function SellingPage() {
  return <PersonaHubLayout personaId="selling" />;
}
