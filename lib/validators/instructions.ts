import type { CheckResult, FileMap } from "../types";

const FILE_PATH_PATTERN = /\/app\/|\/data\/|\/logs\/|\/output\//i;
const API_MENTION_PATTERN =
  /\b(use the \w+ api|use the \w+ endpoint|curl\s|http:\/\/\w+-api|CALENDAR_API_URL|ZILLOW_API_URL|HEALTH_API_URL|WHOOP_API_URL|RENEWALS_API_URL)\b/i;
const SKILL_MENTION_PATTERN =
  /\buse the .{1,30} skill\b|SKILL\.md|\bskill-name\b/i;
const PRESCRIPTIVE_PATTERN =
  /\bstep\s*[1-9]\b|\bfirst,?\s+(you\s+)?should\b|\bround to \d+ decimal\b|\boutput a (JSON|CSV|PDF)\b|\bformat (as|the output|it as)\b/i;
const FORMAT_SPEC_PATTERN =
  /\bdecimal places\b|\bJSON format\b|\bCSV format\b|\bmarkdown format\b/i;

export function validateInstructions(files: FileMap): CheckResult[] {
  const content = files["instruction.md"] ?? "";
  const results: CheckResult[] = [];

  if (!content.trim()) {
    results.push({
      id: "inst-empty",
      label: "instruction.md is not empty",
      status: "fail",
      detail: "File is empty or missing",
    });
    return results;
  }

  results.push({
    id: "inst-empty",
    label: "instruction.md is not empty",
    status: "pass",
  });

  results.push({
    id: "inst-file-paths",
    label: "No file paths mentioned in prompt",
    status: FILE_PATH_PATTERN.test(content) ? "fail" : "pass",
    detail: FILE_PATH_PATTERN.test(content)
      ? "Found file path references (e.g. /app/, /data/)"
      : undefined,
  });

  results.push({
    id: "inst-api-mention",
    label: "No API names or URLs mentioned",
    status: API_MENTION_PATTERN.test(content) ? "fail" : "pass",
    detail: API_MENTION_PATTERN.test(content)
      ? "Found API name or URL reference"
      : undefined,
  });

  results.push({
    id: "inst-skill-mention",
    label: "No skill names mentioned",
    status: SKILL_MENTION_PATTERN.test(content) ? "fail" : "pass",
    detail: SKILL_MENTION_PATTERN.test(content)
      ? "Found skill name reference"
      : undefined,
  });

  results.push({
    id: "inst-prescriptive",
    label: "No prescriptive step-by-step instructions",
    status: PRESCRIPTIVE_PATTERN.test(content) ? "warn" : "pass",
    detail: PRESCRIPTIVE_PATTERN.test(content)
      ? "Possible prescriptive language detected"
      : undefined,
  });

  results.push({
    id: "inst-format-spec",
    label: "No output format specifications",
    status: FORMAT_SPEC_PATTERN.test(content) ? "warn" : "pass",
    detail: FORMAT_SPEC_PATTERN.test(content)
      ? "Possible format specification detected"
      : undefined,
  });

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  results.push({
    id: "inst-length",
    label: "Prompt length is reasonable (10-500 words)",
    status: wordCount >= 10 && wordCount <= 500 ? "pass" : "warn",
    detail: `Word count: ${wordCount}`,
  });

  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const longSentences = sentences.filter(
    (s) => s.trim().split(/\s+/).length > 60
  );
  results.push({
    id: "inst-readability",
    label: "Prompt is readable (no extremely long sentences)",
    status: longSentences.length === 0 ? "pass" : "warn",
    detail:
      longSentences.length > 0
        ? `${longSentences.length} sentence(s) over 60 words`
        : undefined,
  });

  return results;
}
