import Image from "next/image";
import { FOUNDER } from "@/lib/founder";
import { GUIDE_INTRO } from "@/content/guides";
import type { GuideBookId } from "@/lib/guide-books";

// Andy's note at the front of a guide: the landing page, chapter 1 and the PDF.

export function GuideIntroNote({ guide, className = "" }: { guide: GuideBookId; className?: string }) {
  const intro = GUIDE_INTRO[guide];
  return (
    <section aria-label={`From ${FOUNDER.name}`} className={`rounded-3xl border border-line bg-white p-6 break-inside-avoid sm:p-8 ${className}`}>
      <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">From the founder</div>
      <h2 className="mt-3 text-[28px] leading-tight text-ink sm:text-[34px]">{intro.heading}</h2>
      <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink">
        {intro.paragraphs.map((p) => (
          <div key={p.slice(0, 24)}>{p}</div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Image src={FOUNDER.photo} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover object-top" />
        <div>
          <div className="font-display text-[24px] italic leading-none text-ink">{FOUNDER.name}</div>
          <div className="mt-1.5 text-sm text-ink-muted">Founder, Your Property Guide</div>
        </div>
      </div>
    </section>
  );
}
