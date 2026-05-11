import Image from "next/image";
import Link from "next/link";
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
 * Honest social proof — shows the real specialists a visitor could be
 * matched with, pulled live from the DB. We don't fabricate testimonials;
 * we just put faces and names on what is otherwise an abstract promise.
 *
 * Empty-safe: if there are no agents in the DB the section silently
 * renders nothing rather than an "0 specialists" embarrassment.
 */
export async function SpecialistShowcase({
  variant = "full",
  limit,
  heading = "Real specialists. Real Australians.",
  subhead = "These are the people you could be matched with — agents, brokers, conveyancers. Not a faceless directory.",
}: SpecialistShowcaseProps) {
  const finalLimit = limit ?? (variant === "compact" ? 3 : 6);
  const agents = await getShowcaseAgents(finalLimit);
  if (agents.length === 0) return null;

  if (variant === "compact") {
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
                title={`${a.fullName}${a.agencyName ? ` — ${a.agencyName}` : ""}`}
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
            {agents.map((a) => a.firstName).join(", ")} and others —{" "}
            <span className="text-ink">we&rsquo;ll match the one who fits.</span>
          </p>
        </div>
      </div>
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
