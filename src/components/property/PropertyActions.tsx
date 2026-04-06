"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Share2, Star } from "lucide-react";
import { toggleSavedProperty } from "@/lib/actions/dashboard";

interface PropertyActionsProps {
  propertyId: string;
  address: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
}

export function PropertyActions({ propertyId, address, initialSaved, isLoggedIn }: PropertyActionsProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: address, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        // Brief visual feedback handled by browser
      });
    }
  }

  function handleFavourite() {
    if (!isLoggedIn) {
      router.push(`/dashboard/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    startTransition(async () => {
      try {
        const result = await toggleSavedProperty(propertyId);
        setSaved(result.saved);
      } catch {
        // unauthenticated — redirect to login
        router.push(`/dashboard/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        title="Share this property"
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition-colors"
      >
        <Share2 className="w-4 h-4" />
      </button>
      <button
        onClick={handleFavourite}
        disabled={isPending}
        title={saved ? "Remove from saved" : "Save this property"}
        className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
          saved
            ? "border-amber-400 text-amber-500 bg-amber-50"
            : "border-gray-200 text-gray-500 hover:text-amber-500 hover:border-amber-400"
        }`}
      >
        <Star className={`w-4 h-4 ${saved ? "fill-amber-400" : ""}`} />
      </button>
    </div>
  );
}
