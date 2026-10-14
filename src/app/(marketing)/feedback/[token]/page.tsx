import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoHero, HeroTitle, HeroLead } from "@/components/premium";
import { FeedbackForm } from "@/components/journeys/FeedbackForm";
import { db } from "@/lib/db";
import { SERVICES, type IntroService } from "@/lib/service-model";

// /feedback/<token>: how an introduction went (Oct 2026). Reached from the
// confirmation and check-in emails; never indexed.

export const metadata: Metadata = { title: "How did your introduction go?", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{10,80}$/.test(token)) notFound();
  const lead = await db.lead.findUnique({ where: { token }, select: { kind: true, service: true, firstName: true } });
  if (!lead || lead.kind !== "introduction") notFound();
  const service = (lead.service as IntroService | null) ?? "selling-agent";
  return (
    <PhotoHero aside={<FeedbackForm token={token} service={service} />}>
      <HeroTitle>How did your introduction go?</HeroTitle>
      <HeroLead>
        {`${lead.firstName ? `Hi ${lead.firstName}. ` : ""}You asked us to introduce you to ${SERVICES[service].label.toLowerCase()}. Four quick questions tell us whether it was useful, and which agents keep receiving introductions from us.`}
      </HeroLead>
    </PhotoHero>
  );
}
