import type { Metadata } from "next";
import { PersonaHubLayout } from "@/components/journey";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const persona = PERSONA_BY_ID["upgrading"];
const content = PERSONA_HUB_CONTENT["upgrading"];

export const metadata: Metadata = {
  // Lower-volume queries ("downsizing home", "upgrading home", "buying
  // and selling at same time") but high lead value because the visitor
  // is doing two transactions.
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: persona.hubPath },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    type: "website",
  },
};

export default function UpgradingPage() {
  return <PersonaHubLayout personaId="upgrading" />;
}
