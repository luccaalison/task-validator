"use client";

/* eslint-disable @next/next/no-img-element */

export default function Tutorial() {
  return (
    <div className="mb-8 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 overflow-hidden">
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          How to create your Rubrics JSON
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Follow these steps to convert the rubrics you created on the platform
          into a JSON file that this validator can check.
        </p>
      </div>

      {/* Step 1: Understand the structure */}
      <div className="px-6 pb-4">
        <div className="flex items-start gap-3 mb-3">
          <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold">
            1
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Understand the JSON structure
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Each criterion is an object with 6 fields. Here is the anatomy
              of a single criterion:
            </p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <img
            src="/images/anatomy-json.png"
            alt="Anatomy of a criterion - JSON structure and field guide"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Step 2: Map from platform */}
      <div className="px-6 pb-4">
        <div className="flex items-start gap-3 mb-3">
          <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold">
            2
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Map each platform field to JSON
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              This is how the platform interface maps to the JSON fields.
              Use this as your reference when converting:
            </p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <img
            src="/images/anatomy-platform.png"
            alt="Platform interface mapped to JSON fields"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Step 3: Field mapping table */}
      <div className="px-6 pb-4">
        <div className="flex items-start gap-3 mb-3">
          <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold">
            3
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Field-by-field mapping reference
            </h3>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  Platform Field
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  JSON Key
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  (auto)
                </td>
                <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">
                  &quot;id&quot;
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Sequential number: 1, 2, 3...
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Criterion Text
                </td>
                <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">
                  &quot;description&quot;
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Exact criterion text you wrote
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Weight
                </td>
                <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">
                  &quot;points&quot;
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  +5, +3, +1 (positive) or -1, -3, -5 (negative)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Criteria Category
                </td>
                <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">
                  &quot;category&quot;
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  &quot;task completion&quot; | &quot;instruction following&quot;
                  | &quot;factuality and hallucination&quot; |
                  &quot;safety &amp; boundaries&quot;
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Categorical Weight
                </td>
                <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">
                  &quot;priority&quot;
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  &quot;must have&quot; | &quot;should have&quot; |
                  &quot;good to have&quot;
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Is Positive
                </td>
                <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">
                  &quot;is_positive&quot;
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  true (reward) or false (penalty)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 4: Example */}
      <div className="px-6 pb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold">
            4
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Build your JSON array
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Wrap all criteria in a JSON array. Copy the template below, fill
              in your own criteria, and paste it into the text box on the
              right.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto">
          <pre className="text-xs text-emerald-400 leading-relaxed font-mono">
{`[
  {
    "id": 1,
    "description": "The agent's triage assessment flags property 6701 (658 sqft at ~$1.2M) as problematic, for example due to its extremely high price-per-sqft (~$1,846/sqft) or very cramped living space for an active routine.",
    "points": 3,
    "category": "task completion",
    "priority": "must have",
    "is_positive": true
  },
  {
    "id": 2,
    "description": "The agent invents or hallucinates property details (e.g., prices, square footage, addresses) that do not appear in the Zillow API data.",
    "points": -5,
    "category": "factuality and hallucination",
    "priority": "must have",
    "is_positive": false
  }
]`}
          </pre>
        </div>

        <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3">
          <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
            Quick tips
          </p>
          <ul className="text-xs text-amber-700 dark:text-amber-300 mt-1 space-y-1 list-disc list-inside">
            <li>
              Positive criteria (is_positive: true) use positive points
              (+1, +3, +5)
            </li>
            <li>
              Negative criteria (is_positive: false) use negative points
              (-1, -3, -5)
            </li>
            <li>
              Each description must be self-contained. The evaluator only reads
              the description text to decide Present or Not Present.
            </li>
            <li>
              Avoid process-focused criteria like &quot;The agent calls the
              API&quot;. Focus on the output, not the method.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
