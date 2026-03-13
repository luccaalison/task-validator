"use client";

import { useState, useCallback } from "react";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function RubricsInput({ value, onChange }: Props) {
  const [jsonError, setJsonError] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      onChange(text);
      if (!text.trim()) {
        setJsonError("");
        return;
      }
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          setJsonError("Must be a JSON array [ ... ]");
        } else if (parsed.length === 0) {
          setJsonError("Array is empty, add at least one criterion");
        } else {
          setJsonError("");
        }
      } catch {
        setJsonError("Invalid JSON syntax");
      }
    },
    [onChange]
  );

  const hasContent = value.trim().length > 0;
  const isValid = hasContent && !jsonError;

  return (
    <div className="relative h-full">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={`[\n  {\n    "id": 1,\n    "description": "The agent provides...",\n    "points": 5,\n    "category": "task completion",\n    "priority": "must have",\n    "is_positive": true\n  }\n]`}
        spellCheck={false}
        className={`
          w-full h-[210px] resize-none rounded-2xl border-2 p-4
          font-mono text-xs leading-relaxed
          bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-200
          placeholder:text-gray-300 dark:placeholder:text-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-400
          transition-colors
          ${
            jsonError
              ? "border-red-400 dark:border-red-500"
              : isValid
                ? "border-emerald-400 dark:border-emerald-500"
                : "border-gray-300 dark:border-gray-600"
          }
        `}
      />

      {jsonError && (
        <p className="absolute bottom-2 left-4 right-4 text-xs text-red-500 dark:text-red-400 bg-white/90 dark:bg-gray-800/90 px-1 rounded">
          {jsonError}
        </p>
      )}

      {isValid && (
        <span className="absolute top-3 right-3 text-emerald-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </div>
  );
}
