import type { CheckResult, FileMap } from "../types";

export function validateTestRunner(files: FileMap): CheckResult[] {
  const content = files["tests/test.sh"] ?? "";
  const results: CheckResult[] = [];

  if (!content.trim()) {
    results.push({
      id: "tr-empty",
      label: "test.sh exists and is not empty",
      status: "fail",
      detail: "File is empty or missing",
    });
    return results;
  }

  results.push({
    id: "tr-shebang",
    label: "Starts with #!/bin/bash",
    status: content.trimStart().startsWith("#!/bin/bash") ? "pass" : "fail",
    detail: content.trimStart().startsWith("#!/bin/bash")
      ? undefined
      : "Missing or incorrect shebang line",
  });

  results.push({
    id: "tr-mkdir",
    label: "Creates /logs/verifier directory (mkdir -p)",
    status: /mkdir\s+-p\s+\/logs\/verifier/.test(content) ? "pass" : "fail",
    detail: /mkdir\s+-p\s+\/logs\/verifier/.test(content)
      ? undefined
      : "Missing: mkdir -p /logs/verifier",
  });

  results.push({
    id: "tr-reward",
    label: "Writes reward.txt",
    status: /reward\.txt/.test(content) ? "pass" : "fail",
    detail: /reward\.txt/.test(content)
      ? undefined
      : "No reference to reward.txt found",
  });

  results.push({
    id: "tr-ctrf",
    label: "Generates ctrf.json",
    status: /ctrf\.json/.test(content) ? "pass" : "fail",
    detail: /ctrf\.json/.test(content)
      ? undefined
      : "No reference to ctrf.json found",
  });

  const lines = content.trim().split("\n");
  const lastLine = lines[lines.length - 1].trim();
  results.push({
    id: "tr-exit",
    label: "Ends with exit 0",
    status: lastLine === "exit 0" ? "pass" : "warn",
    detail: lastLine === "exit 0" ? undefined : `Last line: "${lastLine}"`,
  });

  return results;
}
