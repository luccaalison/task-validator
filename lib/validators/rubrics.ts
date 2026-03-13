import type { CheckResult } from "../types";

interface RubricCriterion {
  id: number;
  description: string;
  points: number;
  category: string;
  priority?: string;
  is_positive: boolean;
}

const VALID_POINTS = [5, 3, 1, -1, -3, -5];
const VALID_CATEGORIES = [
  "task completion",
  "instruction following",
  "factuality and hallucination",
  "safety & boundaries",
];

const SELF_CONTAINED_FLAGS =
  /\bthe correct\b|\bthe right\b|\bthe proper\b|\bas mentioned\b|\bfrom the prompt\b|\bin the instructions\b|\baccording to the data\b/i;

const PROCESS_FOCUSED_FLAGS =
  /\bthe agent (calls|queries|uses|accesses|fetches|invokes|connects to|sends a request)\b/i;

const SUBJECTIVE_FLAGS =
  /\b(appropriate|appropriately|properly|best practices|reasonable|reasonably|sufficient|sufficiently|adequate|adequately|well-structured|good quality)\b/i;

const NEGATIVE_FRAMING =
  /\b(does not|doesn't|fails to|is not|isn't|never|no longer|unable to)\b/i;

const EXAMPLE_QUALIFIERS =
  /\b(e\.g\.|for example|such as|for instance|like)\b/i;

export function validateRubrics(content: string): CheckResult[] {
  const results: CheckResult[] = [];

  if (!content.trim()) {
    results.push({
      id: "rub-missing",
      label: "Rubrics JSON provided",
      status: "fail",
      detail: "No rubrics content provided",
    });
    return results;
  }

  let criteria: RubricCriterion[];
  try {
    criteria = JSON.parse(content);
    if (!Array.isArray(criteria)) throw new Error("Not an array");
  } catch {
    results.push({
      id: "rub-parse",
      label: "rubrics.json is valid JSON array",
      status: "fail",
      detail: "Failed to parse as JSON array",
    });
    return results;
  }

  results.push({
    id: "rub-parse",
    label: "rubrics.json is valid JSON array",
    status: "pass",
    detail: `${criteria.length} criteria found`,
  });

  const missingFields = criteria.filter(
    (c) =>
      c.id == null ||
      !c.description ||
      c.points == null ||
      !c.category ||
      c.is_positive == null
  );
  results.push({
    id: "rub-fields",
    label: "All criteria have required fields (id, description, points, category, is_positive)",
    status: missingFields.length === 0 ? "pass" : "fail",
    detail:
      missingFields.length > 0
        ? `Criteria missing fields: ids ${missingFields.map((c) => c.id ?? "?").join(", ")}`
        : undefined,
  });

  const badPoints = criteria.filter((c) => !VALID_POINTS.includes(c.points));
  results.push({
    id: "rub-points",
    label: "All weights are valid (+5, +3, +1, -1, -3, -5)",
    status: badPoints.length === 0 ? "pass" : "fail",
    detail:
      badPoints.length > 0
        ? `Invalid weights: ${badPoints.map((c) => `id ${c.id}: ${c.points}`).join(", ")}`
        : undefined,
  });

  const badCategories = criteria.filter(
    (c) => !VALID_CATEGORIES.includes(c.category?.toLowerCase())
  );
  results.push({
    id: "rub-categories",
    label: "All categories are valid",
    status: badCategories.length === 0 ? "pass" : "fail",
    detail:
      badCategories.length > 0
        ? `Invalid categories: ${badCategories.map((c) => `id ${c.id}: "${c.category}"`).join(", ")}`
        : undefined,
  });

  const usedCategories = new Set(
    criteria.map((c) => c.category?.toLowerCase())
  );
  const missingCats = VALID_CATEGORIES.filter((c) => !usedCategories.has(c));
  results.push({
    id: "rub-cat-coverage",
    label: "Criteria cover multiple categories",
    status: missingCats.length <= 1 ? "pass" : "warn",
    detail:
      missingCats.length > 0
        ? `Categories not used: ${missingCats.join(", ")}`
        : "All 4 categories represented",
  });

  let majorIssues = 0;
  let moderateIssues = 0;
  let minorIssues = 0;
  const issueDetails: string[] = [];

  for (const c of criteria) {
    const desc = c.description ?? "";

    if (SELF_CONTAINED_FLAGS.test(desc)) {
      majorIssues++;
      issueDetails.push(
        `id ${c.id}: Not Self-Contained ("${desc.slice(0, 60)}...")`
      );
      continue;
    }

    if (PROCESS_FOCUSED_FLAGS.test(desc)) {
      majorIssues++;
      issueDetails.push(
        `id ${c.id}: Process-Focused ("${desc.slice(0, 60)}...")`
      );
      continue;
    }

    if (c.is_positive && c.points > 0 && NEGATIVE_FRAMING.test(desc)) {
      majorIssues++;
      issueDetails.push(
        `id ${c.id}: Framing issue - positive weight with negative phrasing`
      );
      continue;
    }

    if (
      !c.is_positive &&
      c.points < 0 &&
      NEGATIVE_FRAMING.test(desc) &&
      !/\b(invents|fabricat|hallucinat|creates.*not|schedules.*outside)\b/i.test(
        desc
      )
    ) {
      moderateIssues++;
      issueDetails.push(
        `id ${c.id}: Possible Double Negative - negative weight penalizing absence`
      );
      continue;
    }

    if (SUBJECTIVE_FLAGS.test(desc)) {
      moderateIssues++;
      issueDetails.push(
        `id ${c.id}: Subjective language ("${desc.match(SUBJECTIVE_FLAGS)?.[0]}")`
      );
      continue;
    }

    if (
      (c.points === 5 || c.points === 3) &&
      /\$[\d,]+|\b\d{4}-\d{2}-\d{2}\b|\b\d+\s*(sqft|%|percent)\b/.test(desc) &&
      !EXAMPLE_QUALIFIERS.test(desc)
    ) {
      moderateIssues++;
      issueDetails.push(
        `id ${c.id}: Possible Overfitting - specific values without "e.g." or "for example"`
      );
      continue;
    }
  }

  const total = criteria.length;
  const majorPct = total > 0 ? (majorIssues / total) * 100 : 0;
  const modPlusPct =
    total > 0 ? ((majorIssues + moderateIssues) / total) * 100 : 0;
  const allPct =
    total > 0
      ? ((majorIssues + moderateIssues + minorIssues) / total) * 100
      : 0;

  results.push({
    id: "rub-self-contained",
    label: "No self-containedness issues detected (heuristic)",
    status:
      issueDetails.filter((d) => d.includes("Self-Contained")).length > 0
        ? "fail"
        : "pass",
    detail:
      issueDetails
        .filter((d) => d.includes("Self-Contained"))
        .join("; ") || undefined,
  });

  results.push({
    id: "rub-process",
    label: "No process-focused criteria detected (heuristic)",
    status:
      issueDetails.filter((d) => d.includes("Process-Focused")).length > 0
        ? "fail"
        : "pass",
    detail:
      issueDetails
        .filter((d) => d.includes("Process-Focused"))
        .join("; ") || undefined,
  });

  results.push({
    id: "rub-framing",
    label: "No framing issues detected (heuristic)",
    status:
      issueDetails.filter((d) => d.includes("Framing")).length > 0
        ? "fail"
        : "pass",
    detail:
      issueDetails
        .filter((d) => d.includes("Framing"))
        .join("; ") || undefined,
  });

  results.push({
    id: "rub-subjective",
    label: "No subjective language detected (heuristic)",
    status:
      issueDetails.filter((d) => d.includes("Subjective")).length > 0
        ? "warn"
        : "pass",
    detail:
      issueDetails
        .filter((d) => d.includes("Subjective"))
        .join("; ") || undefined,
  });

  results.push({
    id: "rub-overfitting",
    label: "No overfitting detected (heuristic)",
    status:
      issueDetails.filter((d) => d.includes("Overfitting")).length > 0
        ? "warn"
        : "pass",
    detail:
      issueDetails
        .filter((d) => d.includes("Overfitting"))
        .join("; ") || undefined,
  });

  results.push({
    id: "rub-double-neg",
    label: "No double-negative criteria detected (heuristic)",
    status:
      issueDetails.filter((d) => d.includes("Double Negative")).length > 0
        ? "warn"
        : "pass",
    detail:
      issueDetails
        .filter((d) => d.includes("Double Negative"))
        .join("; ") || undefined,
  });

  results.push({
    id: "rub-threshold-major",
    label: `Major issues: ${majorPct.toFixed(1)}% (threshold: >5%)`,
    status: majorPct > 5 ? "fail" : "pass",
    detail: `${majorIssues} of ${total} criteria flagged as major`,
  });

  results.push({
    id: "rub-threshold-mod",
    label: `Moderate+Major: ${modPlusPct.toFixed(1)}% (threshold: >15%)`,
    status: modPlusPct > 15 ? "fail" : "pass",
    detail: `${majorIssues + moderateIssues} of ${total} criteria flagged`,
  });

  results.push({
    id: "rub-threshold-all",
    label: `All issues: ${allPct.toFixed(1)}% (threshold: >25%)`,
    status: allPct > 25 ? "fail" : "pass",
    detail: `${majorIssues + moderateIssues + minorIssues} of ${total} criteria flagged`,
  });

  const weightDist = { 5: 0, 3: 0, 1: 0, "-1": 0, "-3": 0, "-5": 0 };
  for (const c of criteria) {
    const key = String(c.points) as keyof typeof weightDist;
    if (key in weightDist) weightDist[key]++;
  }
  results.push({
    id: "rub-weight-dist",
    label: "Weight distribution summary",
    status: "pass",
    detail: `+5: ${weightDist[5]}, +3: ${weightDist[3]}, +1: ${weightDist[1]}, -1: ${weightDist["-1"]}, -3: ${weightDist["-3"]}, -5: ${weightDist["-5"]}`,
  });

  return results;
}
