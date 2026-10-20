import Image from "next/image";
import { FOUNDER } from "@/lib/founder";
import { GUIDE_INTRO } from "@/content/guides";
import type { GuideBookId } from "@/lib/guide-books";

// Andy's note at the front of a guide: the landing page, chapter 1 and the
// PDF. A letter under a fine rule, not a card (v7, 20 Oct 2026).

export function GuideIntroNote({ guide, className = "" }: { guide: GuideBookId; className?: string }) {
  const intro = GUIDE_INTRO[guide];
  return (
    <section aria-label={`From ${FOUNDER.name}`} className={`border-t border-ink pt-6 break-inside-avoid sm:pt-7 ${className}`}>
      <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-primary">From the founder</div>
      <h2 className="mt-3 text-[30px] leading-[1.1] tracking-[-0.035em] text-ink sm:text-[34px]">{intro.heading}</h2>
      <div className="mt-5 space-y-4 text-[17px] leading-[1.7] text-ink-muted">
        {intro.paragraphs.map((p) => (
          <div key={p.slice(0, 24)}>{p}</div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Image src={FOUNDER.photo} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover object-top" />
        <div>
          <div className="font-display text-[22px] leading-none tracking-[-0.02em] text-ink">{FOUNDER.name}</div>
          <div className="mt-1.5 text-[13px] text-ink-muted">Founder, Your Property Guide</div>
        </div>
      </div>
    </section>
  );
}
