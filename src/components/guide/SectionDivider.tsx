import Image from "next/image";

interface SectionDividerProps {
  // Optional small uppercase eyebrow shown beneath the mark, for an editorial
  // "act break" feel between major sections of long-form content.
  label?: string;
  className?: string;
}

// A quiet asterism-style ornament that punctuates major H2 transitions in
// long-form guides and explainers. Hairline rules either side, three small
// diamonds in the middle, optional eyebrow label below.
export function SectionDivider({ label, className }: SectionDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden={!label}
      className={`my-14 flex flex-col items-center gap-3 ${className ?? ""}`}
    >
      <div className="flex items-center gap-4 w-full max-w-md">
        <span className="h-px flex-1 bg-line" />
        <Image
          src="/images/icons/section-mark.svg"
          alt=""
          width={32}
          height={12}
          className="w-8 h-3 shrink-0"
          aria-hidden="true"
        />
        <span className="h-px flex-1 bg-line" />
      </div>
      {label && (
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle">
          {label}
        </p>
      )}
    </div>
  );
}
