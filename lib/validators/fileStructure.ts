import type { CheckResult, FileMap } from "../types";

const REQUIRED_FILES: { path: string; label: string }[] = [
  { path: "instruction.md", label: "instruction.md exists at task root" },
  { path: "task.toml", label: "task.toml exists at task root" },
  { path: "environment/Dockerfile", label: "environment/Dockerfile exists" },
  {
    path: "environment/docker-compose.yaml",
    label: "environment/docker-compose.yaml exists",
  },
  { path: "solution/solve.sh", label: "solution/solve.sh exists" },
  { path: "tests/test.sh", label: "tests/test.sh exists" },
  { path: "tests/test_outputs.py", label: "tests/test_outputs.py exists" },
];

export function validateFileStructure(files: FileMap): CheckResult[] {
  const keys = Object.keys(files);
  const results: CheckResult[] = [];

  for (const req of REQUIRED_FILES) {
    const found = keys.some(
      (k) => k === req.path || k.toLowerCase() === req.path.toLowerCase()
    );
    results.push({
      id: `fs-${req.path}`,
      label: req.label,
      status: found ? "pass" : "fail",
      detail: found ? undefined : `File not found: ${req.path}`,
    });
  }

  const skillDirs = new Set<string>();
  for (const k of keys) {
    const m = k.match(/^environment\/skills\/([^/]+)\/SKILL\.md$/i);
    if (m) skillDirs.add(m[1]);
  }

  results.push({
    id: "fs-skills-count",
    label: "At least 2 skill folders with SKILL.md",
    status: skillDirs.size >= 2 ? "pass" : skillDirs.size === 1 ? "warn" : "fail",
    detail:
      skillDirs.size >= 2
        ? `Found ${skillDirs.size} skills: ${[...skillDirs].join(", ")}`
        : skillDirs.size === 1
          ? `Only 1 skill found: ${[...skillDirs][0]}`
          : "No skill folders with SKILL.md found",
  });

  const testContent = files["tests/test_outputs.py"] ?? "";
  const hasTests = /def test_|class Test/.test(testContent);
  results.push({
    id: "fs-test-content",
    label: "test_outputs.py contains actual test cases",
    status: hasTests ? "pass" : "fail",
    detail: hasTests ? undefined : "No test functions or test classes found",
  });

  return results;
}
