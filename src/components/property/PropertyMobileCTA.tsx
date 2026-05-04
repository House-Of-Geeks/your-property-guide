import Link from "next/link";

interface PropertyMobileCTAProps {
  appraisalHref: string;
}

export function PropertyMobileCTA({ appraisalHref }: PropertyMobileCTAProps) {
  return (
    <div className="lg:hidden sticky bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 flex gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <a
        href="#track"
        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
      >
        Track this property
      </a>
      <Link
        href={appraisalHref}
        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
      >
        Free appraisal
      </Link>
    </div>
  );
}
