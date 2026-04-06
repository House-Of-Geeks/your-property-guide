"use client";

import { useState } from "react";
import Image from "next/image";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

const ENQUIRY_TYPES = [
  { value: "sell-appraisal", label: "Selling my property & appraisals" },
  { value: "leasing", label: "Leasing my property" },
  { value: "buy", label: "Buying a property" },
  { value: "rent", label: "Renting a property" },
  { value: "general", label: "I have a general enquiry" },
];

interface AgentContactSectionProps {
  agentId: string;
  agencyId: string;
  agentFirstName: string;
  agentFullName: string;
  agentImage: string;
  agentImageAlt?: string;
  agentTitle: string;
}

export function AgentContactSection({
  agentId,
  agencyId,
  agentFirstName,
  agentFullName,
  agentImage,
  agentImageAlt,
  agentTitle,
}: AgentContactSectionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Agent avatar + heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
            <Image
              src={agentImage}
              alt={agentImageAlt ?? `${agentFullName} - ${agentTitle}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Contact {agentFullName}</h2>
          <p className="text-sm text-gray-500 mt-1">What would you like information about?</p>
        </div>

        {/* Enquiry type selector */}
        {!selected ? (
          <div className="space-y-3">
            {ENQUIRY_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelected(t.value)}
                className="w-full text-left px-5 py-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:border-primary hover:text-primary transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1 text-sm text-primary hover:underline mb-6"
            >
              ← Back
            </button>
            <p className="text-sm font-medium text-gray-700 mb-4">
              {ENQUIRY_TYPES.find((t) => t.value === selected)?.label}
            </p>
            <EnquiryForm
              agentId={agentId}
              agencyId={agencyId}
              type={selected}
              defaultMessage={`Hi ${agentFirstName}, I'd like to get in touch about ${ENQUIRY_TYPES.find((t) => t.value === selected)?.label.toLowerCase()}.`}
            />
          </div>
        )}
      </div>
    </section>
  );
}
