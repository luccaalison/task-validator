import type { CheckResult, FileMap } from "../types";

export function validateTests(files: FileMap): CheckResult[] {
  const content = files["tests/test_outputs.py"] ?? "";
  const results: CheckResult[] = [];

  if (!content.trim()) {
    results.push({
      id: "tst-empty",
      label: "test_outputs.py is not empty",
      status: "fail",
      detail: "File is empty or missing",
    });
    return results;
  }

  const testFns = content.match(/def test_\w+/g) ?? [];
  results.push({
    id: "tst-count",
    label: "Has a reasonable number of tests (3+)",
    status: testFns.length >= 3 ? "pass" : testFns.length > 0 ? "warn" : "fail",
    detail: `Found ${testFns.length} test function(s)`,
  });

  const caseSensitive =
    /assert.*==\s*["'][A-Z]/.test(content) &&
    !/\.lower\(\)|\.casefold\(\)|\.upper\(\)/i.test(content);
  results.push({
    id: "tst-case-sensitive",
    label: "No potentially case-sensitive string comparisons",
    status: caseSensitive ? "warn" : "pass",
    detail: caseSensitive
      ? "Found string comparisons with uppercase chars but no .lower()/.casefold()"
      : undefined,
  });

  const processAssertions =
    /assert.*\.(called|call_count|assert_called)|api.*called|mock.*call/i.test(
      content
    );
  results.push({
    id: "tst-process",
    label: "No process-based assertions (API call checks)",
    status: processAssertions ? "fail" : "pass",
    detail: processAssertions
      ? "Tests appear to check API calls rather than outputs"
      : undefined,
  });

  const wordPresence =
    /assert.*["'](sorry|apolog|thank|please|hello|dear)["']/i.test(content) ||
    /_contains_any|word.*in.*text|any\(.*word.*for.*word/i.test(content);
  results.push({
    id: "tst-word-presence",
    label: "No word-presence checks in free-text output",
    status: wordPresence ? "warn" : "pass",
    detail: wordPresence
      ? "Tests may check for specific words in free-text (belongs in rubrics)"
      : undefined,
  });

  const formatStrict =
    /assert.*==\s*["']\$[\d,]+["']|assert.*==\s*["']\d{2}\/\d{2}\/\d{4}["']/i.test(
      content
    );
  results.push({
    id: "tst-format-strict",
    label: "No overly strict format assertions",
    status: formatStrict ? "warn" : "pass",
    detail: formatStrict
      ? "Tests may enforce specific number/date formatting"
      : undefined,
  });

  const testBodies = content.split(/def test_\w+/).slice(1);
  const assertLines = testBodies.map((body) => {
    const asserts = body.match(/assert\s+.+/g) ?? [];
    return asserts.map((a) => a.replace(/\s+/g, " ").trim()).sort().join("|");
  });
  const duplicateCount = assertLines.length - new Set(assertLines).size;
  results.push({
    id: "tst-redundancy",
    label: "No highly redundant tests (>2 identical)",
    status: duplicateCount > 2 ? "fail" : duplicateCount > 0 ? "warn" : "pass",
    detail:
      duplicateCount > 0
        ? `${duplicateCount} potentially redundant test(s) detected`
        : undefined,
  });

  const implementationCheck =
    /import.*|from.*import|assert.*isinstance.*DataFrame|assert.*type\(/i.test(
      content
    ) && /assert.*used|assert.*library|assert.*module/i.test(content);
  results.push({
    id: "tst-implementation",
    label: "No testing of implementation details",
    status: implementationCheck ? "warn" : "pass",
    detail: implementationCheck
      ? "Tests may check which library or module was used"
      : undefined,
  });

  return results;
}
