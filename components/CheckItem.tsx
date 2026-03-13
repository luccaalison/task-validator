"use client";

import type { CheckResult } from "@/lib/types";

const STATUS_STYLES = {
  pass: {
    dot: "bg-emerald-500",
    bg: "",
    text: "text-gray-700 dark:text-gray-300",
  },
  fail: {
    dot: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-800 dark:text-red-200",
  },
  warn: {
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-800 dark:text-amber-200",
  },
};

export default function CheckItem({ check }: { check: CheckResult }) {
  const style = STATUS_STYLES[check.status];

  return (
    <div className={`flex items-start gap-3 px-4 py-2.5 rounded-lg ${style.bg}`}>
      <span
        className={`mt-1 h-3 w-3 rounded-full shrink-0 ${style.dot}`}
        aria-label={check.status}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${style.text}`}>{check.label}</p>
        {check.detail && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
            {check.detail}
          </p>
        )}
      </div>
    </div>
  );
}
