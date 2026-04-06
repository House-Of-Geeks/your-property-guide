"use client";

import { useState } from "react";

export function PropertyDescriptionExpand({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = description.split("\n");
  const isLong = lines.length > 8 || description.length > 600;
  const preview = isLong && !expanded ? lines.slice(0, 8).join("\n") : description;

  return (
    <div>
      <div className="text-gray-600 leading-relaxed whitespace-pre-line">
        {preview}
        {isLong && !expanded && <span className="text-gray-400">…</span>}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-primary text-sm font-medium hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
