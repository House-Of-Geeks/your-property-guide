import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const persona = PERSONA_BY_ID["selling"];
const content = PERSONA_HUB_CONTENT["selling"];

export const metadata: Metadata = {
  // Intent-phrased title to capture "selling my house" + "selling a
  // house" + "how to sell a house" queries (low absolute volume but
  // $25-28 CPC = very high lead value).
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: persona.hubPath },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    type: "website",
  },
};

export default function SellingPage() {
  return <PersonaHubLayout personaId="selling" />;
}
