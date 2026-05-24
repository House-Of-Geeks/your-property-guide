import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Eye, MessageSquare, Handshake } from "lucide-react";
import { getShowcaseAgents } from "@/lib/services/agent-service";

interface SpecialistShowcaseProps {
  /** "full" for /find-an-expert; "compact" for the match drawer (3-up, no eyebrow/heading). */
  variant?: "full" | "compact";
  /** How many agents to surface. Default 6 for full, 3 for compact. */
  limit?: number;
  /** Override the section heading (full variant only). */
  heading?: string;
  /** Override the subhead (full variant only). */
  subhead?: string;
}

/**
 * Honest social proof, shows the real specialists a visitor could be
 * matched with, pulled live from the DB.
 *
 * Two render modes:
 * - "vetting" (default until the showcase has 3+ agents from 2+ different
 *   agencies) — describes our vetting process. Avoids the seed-data look
 *   when only a handful of agents from one agency exist.
 * - "cards" — once the agent set is varied enough to be credible social
 *   proof, switch to a faces-and-names grid.
 *
 * The switch is automatic so as soon as agents from new agencies land in
 * the DB, the cards take over without a code change.
 */
export async function SpecialistShowcase({
  variant = "full",
  limit,
  heading = "Real specialists. Real Australians.",
  subhead = "These are the people you could be matched with, agents, brokers, conveyancers. Not a faceless directory.",
}: SpecialistShowcaseProps) {
  const finalLimit = limit ?? (variant === "compact" ? 3 : 6);
  const agents = await getShowcaseAgents(finalLimit);

  const uniqueAgencies = new Set(
    agents.map((a) => a.agencySlug ?? a.agencyName ?? a.id).filter(Boolean),
  );
  // "Varied enough to convince" threshold. Compact (3-up in drawer) needs
  // just 2 different agencies; full needs 3+. Below that, fall through to
  // the vetting/process panel instead of an uncredible "look, three people
  // with the same surname" grid.
  const hasVariedRoster =
    agents.length >= 3 && uniqueAgencies.size >= (variant === "compact" ? 2 : 3);

  if (variant === "compact") {
    if (!hasVariedRoster) {
      return (
        <div className="mt-6 pt-6 border-t border-line">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle mb-3">
            How we pick your specialist
          </p>
          <ul className="space-y-2 text-sm text-ink-muted leading-snug">
            <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-cta shrink-0 mt-0.5" /> Active in your suburb, not a call centre.</li>
            <li className="flex gap-2"><Eye className="w-4 h-4 text-cta shrink-0 mt-0.5" /> Vetted personally before we match.</li>
            <li className="flex gap-2"><Handshake className="w-4 h-4 text-cta shrink-0 mt-0.5" /> Free for you, they pay only on matched work.</li>
          </ul>
        </div>
      );
    }
    return (
      <div className="mt-6 pt-6 border-t border-line">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle mb-3">
          You might be matched with
        </p>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {agents.map((a) => (
              <div
                key={a.id}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-surface-warm bg-surface-sunken"
                title={`${a.fullName}${a.agencyName ? `, ${a.agencyName}` : ""}`}
              >
                <Image
                  src={a.image}
                  alt={a.fullName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-ink-muted leading-tight">
            {agents.map((a) => a.firstName).join(", ")} and others -{" "}
            <span className="text-ink">we&rsquo;ll match the one who fits.</span>
          </p>
        </div>
      </div>
    );
  }

  // Full variant
  if (!hasVariedRoster) {
    return (
      <section className="py-16 bg-surface-raised border-y border-line">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              How we vet your specialist
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-3">
              We pick one person for your situation. Not a directory of strangers.
            </h2>
            <p className="font-sans text-base text-ink-muted leading-relaxed">
              Every specialist we recommend is checked against the same standard
              we&rsquo;d use ourselves before listing, buying, or borrowing through them.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                Icon: Eye,
                title: "Active in your area",
                body: "Not a call-centre lead-buyer who works any suburb in any state. The specialist we send actually does business where you do.",
              },
              {
                Icon: ShieldCheck,
                title: "Vetted on track record",
                body: "We check recent sales, reviews, and complaint history before adding anyone to the roster. If we wouldn't use them, we won't send them.",
              },
              {
                Icon: MessageSquare,
                title: "One match, not five",
                body: "We pick the right person and introduce them. You don't get five quotes from five strangers competing for your time.",
              },
              {
                Icon: Handshake,
                title: "Free for buyers and sellers",
                body: "Specialists pay us only when matched work goes ahead, and we disclose this on every match. You pay nothing, ever.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-line bg-surface-warm p-5">
                <div className="w-9 h-9 rounded-full bg-cta/10 text-cta grid place-items-center mb-3">
                  <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                </div>
                <p className="font-medium text-ink mb-2 leading-snug">{title}</p>
                <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-surface-raised border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            Who you&rsquo;re matched with
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-3">
            {heading}
          </h2>
          <p className="font-sans text-base text-ink-muted leading-relaxed">
            {subhead}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {agents.map((a) => (
            <Link
              key={a.id}
              href={`/agents/${a.slug}`}
              className="group block"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-sunken border border-line group-hover:border-primary/40 transition-colors">
                <Image
                  src={a.image}
                  alt={a.fullName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <p className="mt-3 font-display text-sm text-ink leading-tight group-hover:text-primary transition-colors">
                {a.fullName}
              </p>
              <p className="font-sans text-xs text-ink-muted leading-snug mt-1">
                {a.title}
                {a.agencyName ? <> · {a.agencyName}</> : null}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
