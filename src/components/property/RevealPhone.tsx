"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

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

  const handleReveal = () => {
    setRevealed(true);
    // Pure tracking — Clarity instead of writing a Lead row. The previous
    // implementation POSTed to /api/leads with type "phone-reveal" which
    // wasn't in the schema enum and empty firstName/email failed validation,
    // so every reveal silently 400'd. We never actually captured this.
    clarityEvent("phone_reveal");
    if (agentId) clarityTag("phone_reveal_agent", agentId);
    if (propertyId) clarityTag("phone_reveal_property", propertyId);
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
