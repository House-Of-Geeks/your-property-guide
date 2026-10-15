// Pages made to be printed (15 Oct 2026): no header, footer or phone bar.
// scripts/guides/render-pdfs.mjs prints them to the guide PDFs and covers.
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <main className="bg-white">{children}</main>;
}
