import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const persona = PERSONA_BY_ID["first-home"];
const content = PERSONA_HUB_CONTENT["first-home"];

export const metadata: Metadata = {
  // metaTitle is intent-phrased ("First Home Buyer Australia 2026:
  // Grants, Schemes, Deposit & Stamp Duty") to capture the 18,100/mo
  // "first home buyer grant" + 12,100/mo "first home buyer" queries.
  // Brand is appended by the root title template.
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: persona.hubPath },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    type: "website",
  },
};

export default function FirstHomeBuyersPage() {
  return <PersonaHubLayout personaId="first-home" />;
}
