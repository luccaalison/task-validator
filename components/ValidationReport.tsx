"use client";

import type { ValidatorOutput } from "@/lib/types";
import SectionCard from "./SectionCard";

export default function ValidationReport({ output }: { output: ValidatorOutput }) {
  const pct = output.totalChecks > 0
    ? Math.round((output.passed / output.totalChecks) * 100)
    : 0;

  const barColor =
    output.failed === 0
      ? "bg-emerald-500"
      : pct >= 70
        ? "bg-amber-500"
        : "bg-red-500";

  const textColor =
    output.failed === 0
      ? "text-emerald-600 dark:text-emerald-400"
      : pct >= 70
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Validation Results
          </h2>
          <span className={`text-2xl font-black ${textColor}`}>{pct}%</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {output.passed} passed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {output.failed} failed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {output.warnings} warnings
            </span>
          </div>
        </div>
      </div>

      {output.sections.map((section) => (
        <SectionCard key={section.title} section={section} />
      ))}
    </div>
  );
}
