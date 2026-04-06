"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

interface RevealPhoneProps {
  phone: string;
  agentId?: string;
  propertyId?: string;
  className?: string;
}

export function RevealPhone({ phone, agentId, propertyId, className }: RevealPhoneProps) {
  const [revealed, setRevealed] = useState(false);

  // Show first 6 digits, obscure the rest: "0412 34·····"
  const preview = phone.replace(/\s/g, "").slice(0, 6).replace(/(\d{4})(\d{2})/, "$1 $2") + "···";

  const handleReveal = async () => {
    setRevealed(true);
    // Fire-and-forget tracking event
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "phone-reveal",
          agentId,
          propertyId,
          source: "website",
          firstName: "", lastName: "", email: "", phone: "",
        }),
      });
    } catch { /* non-critical */ }
  };

  if (revealed) {
    return (
      <a
        href={`tel:${phone}`}
        className={className ?? "flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"}
      >
        <Phone className="w-4 h-4" />
        {phone}
      </a>
    );
  }

  return (
    <button
      onClick={handleReveal}
      className={className ?? "flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"}
    >
      <Phone className="w-4 h-4" />
      {preview}
    </button>
  );
}
