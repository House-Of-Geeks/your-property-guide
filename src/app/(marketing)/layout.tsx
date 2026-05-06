import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Mobile-only sticky bottom nav. Spacer below the footer on mobile so
          the last footer rows aren't covered by the sticky bar. */}
      <MobileBottomNav />
      <div className="h-14 sm:hidden" aria-hidden="true" />
    </>
  );
}
