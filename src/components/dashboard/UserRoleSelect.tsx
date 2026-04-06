"use client";

import { useState, useTransition } from "react";
import { setUserRole } from "@/lib/actions/dashboard";

const ROLES = [
  { value: "agent",        label: "Agent" },
  { value: "agency_admin", label: "Agency Admin" },
  { value: "admin",        label: "Admin" },
];

const BADGE: Record<string, string> = {
  admin:        "bg-purple-100 text-purple-700",
  agency_admin: "bg-blue-100 text-blue-700",
  agent:        "bg-gray-100 text-gray-600",
};

export function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [role, setRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setRole(next);
    setSaved(false);
    startTransition(async () => {
      await setUserRole(userId, next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={handleChange}
        disabled={isPending}
        className="text-xs rounded-lg border border-gray-300 px-2 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:opacity-50"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      {saved && <span className="text-xs text-green-600 font-medium">Saved</span>}
    </div>
  );
}
