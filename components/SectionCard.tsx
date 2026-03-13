"use client";

import { useState } from "react";
import type { ValidationSection } from "@/lib/types";
import CheckItem from "./CheckItem";

export default function SectionCard({ section }: { section: ValidationSection }) {
  const [open, setOpen] = useState(true);

  const passed = section.checks.filter((c) => c.status === "pass").length;
  const failed = section.checks.filter((c) => c.status === "fail").length;
  const warned = section.checks.filter((c) => c.status === "warn").length;
  const total = section.checks.length;

  const allPass = failed === 0 && warned === 0;
  const hasFails = failed > 0;

  const badgeBg = hasFails
    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
    : allPass
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {section.title}
          </h3>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBg}`}>
          {passed}/{total} passed
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-1">
          {section.checks.map((check) => (
            <CheckItem key={check.id} check={check} />
          ))}
        </div>
      )}
    </div>
  );
}
