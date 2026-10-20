import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FOUNDER } from "@/lib/founder";
import { KICKER, SHELL } from "./shell";

// "The person behind the guides" (20 Oct 2026, the approved design). Andy's
// own portrait and his experience as supporting background: it says why the
// guides are worth reading without becoming the promise. Facts come only
// from src/lib/founder.ts.

export function FounderNote() {
  return (
    <section id="people" aria-labelledby="people-title" className={`${SHELL} py-11 sm:py-16`}>
      <div className="grid items-center gap-7 md:grid-cols-[0.82fr_1.18fr] md:gap-9 lg:gap-14">
        <figure>
          <div className="relative aspect-[1.18] max-h-[320px] overflow-hidden bg-surface-warm md:aspect-[1.1] md:max-h-none">
            <Image
              src={FOUNDER.photo}
              alt={`${FOUNDER.name}, founder of Your Property Guide.`}
              fill
              sizes="(min-width: 1024px) 480px, (min-width: 768px) 40vw, 100vw"
              className="object-cover object-[50%_32%]"
            />
          </div>
          <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-[12px] text-ink-muted">
            <span>{FOUNDER.name}</span>
            <span>Founder, Your Property Guide</span>
          </figcaption>
        </figure>
        <div>
          <p className={`${KICKER} mb-4`}>The person behind the guides</p>
          <h2 id="people-title" className="max-w-[400px] text-[36px] leading-[1.08] tracking-[-0.04em] text-ink md:text-[37px] lg:text-[42px]">
            Experience you can put to use.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink-muted sm:mt-[18px]">{FOUNDER.summary}</p>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink-muted">{FOUNDER.aim}</p>
          <details className="mt-6 border-t border-line">
            <summary className="min-h-[42px] cursor-pointer py-2.5 text-[14px] font-medium text-ink marker:text-primary">
              More about Andy’s background
            </summary>
            <p className="mt-1.5 text-[14px] leading-[1.65] text-ink-muted">
              {`${FOUNDER.facts[0]} ${FOUNDER.facts[1]} The guides draw on that experience while keeping the focus on the decisions facing the reader.`}
            </p>
          </details>
          <Link
            href="/about"
            className="mt-5 inline-flex items-center gap-3 border-b border-line-strong py-1.5 text-[14px] font-medium text-ink hover:border-primary hover:text-primary"
          >
            About the guides and how we work <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
