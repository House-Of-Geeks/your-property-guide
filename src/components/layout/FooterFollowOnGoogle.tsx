"use client";

import { usePathname } from "next/navigation";
import { FollowOnGoogle } from "@/components/FollowOnGoogle";
import { showFooterFollowOnGoogle } from "@/lib/follow-on-google-routes";

// The footer is a server component shared by every marketing route, so the
// route check lives in this small client child. Renders nothing when off.
export function FooterFollowOnGoogle() {
  if (!showFooterFollowOnGoogle(usePathname())) return null;
  return <FollowOnGoogle variant="pill" className="w-fit" />;
}
