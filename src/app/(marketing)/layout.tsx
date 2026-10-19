import { Header } from "@/components/layout/Header";
import { MotionObserver } from "@/components/motion/MotionObserver";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { OrganizationJsonLd } from "@/components/seo";
import { FlagsProvider } from "@/components/flags/FlagsProvider";
import { siteFlags } from "@/lib/flags";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Organization + WebSite nodes on every marketing page. Inner-page
          JSON-LD (AgentJsonLd.worksFor, ArticleJsonLd.publisher) references
          `${SITE_URL}#organization` by @id, and Google only resolves @id
          within the same page — so the node must ship site-wide, not just
          on / and /about. */}
      <OrganizationJsonLd />
      <MotionObserver />
      <Header />
      {/* The server's switches (series, check-ins), so forms only promise what really sends. */}
      <FlagsProvider flags={siteFlags()}>
        <main className="flex-1">{children}</main>
      </FlagsProvider>
      <Footer />
      {/* Mobile-only sticky bottom nav. Spacer below the footer on mobile so
          the last footer rows aren't covered by the sticky bar. */}
      <MobileBottomNav />
      <div className="h-[calc(4rem+env(safe-area-inset-bottom,0px))] sm:hidden" aria-hidden="true" />
    </>
  );
}
