// Pages made to be printed (15 Oct 2026): no header, footer or phone bar.
// scripts/guides/render-pdfs.mjs prints them to the guide PDFs and covers.
// Plain white paper (20 Oct 2026): bg-white is the site's warm paper colour
// since v7, which printed as a cream panel inside white page margins.
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <main className="bg-[#ffffff]">{children}</main>;
}
