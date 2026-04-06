"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Share2, Star, Mail, Copy, MoreHorizontal, X, Check } from "lucide-react";
import { toggleSavedProperty } from "@/lib/actions/dashboard";

interface PropertyActionsProps {
  propertyId: string;
  address: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
}

function ShareModal({ address, onClose }: { address: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareEmail() {
    const subject = encodeURIComponent(`Property listing: ${address}`);
    const body = encodeURIComponent(`Check out this property:\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  }

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "width=600,height=400"
    );
    onClose();
  }

  function moreOptions() {
    if (navigator.share) {
      navigator.share({ title: address, url: window.location.href }).catch(() => {});
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-primary mb-5">Share Listing</h2>

        <div className="divide-y divide-gray-100">
          <button
            onClick={shareEmail}
            className="flex items-center gap-4 w-full py-4 text-sm font-medium text-gray-800 hover:text-primary transition-colors"
          >
            <Mail className="w-5 h-5 text-gray-500" />
            Email
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-4 w-full py-4 text-sm font-medium text-gray-800 hover:text-primary transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
            {copied ? "Link copied!" : "Copy Link"}
          </button>
          <button
            onClick={shareFacebook}
            className="flex items-center gap-4 w-full py-4 text-sm font-medium text-gray-800 hover:text-primary transition-colors"
          >
            {/* Facebook "f" icon — inline SVG, not in lucide */}
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            Share on Facebook
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={moreOptions}
              className="flex items-center gap-4 w-full py-4 text-sm font-medium text-gray-800 hover:text-primary transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
              More options
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function PropertyActions({ propertyId, address, initialSaved, isLoggedIn }: PropertyActionsProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [shareOpen, setShareOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
        router.push(`/dashboard/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShareOpen(true)}
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

      {shareOpen && (
        <ShareModal address={address} onClose={() => setShareOpen(false)} />
      )}
    </>
  );
}
