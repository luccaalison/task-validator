import type { CheckResult, FileMap } from "../types";

export function validateSkills(files: FileMap): CheckResult[] {
  const keys = Object.keys(files);
  const results: CheckResult[] = [];

  const skillFolders = new Map<string, boolean>();
  for (const k of keys) {
    const m = k.match(/^environment\/skills\/([^/]+)\//);
    if (m) {
      const name = m[1];
      if (!skillFolders.has(name)) skillFolders.set(name, false);
      if (k.endsWith("/SKILL.md") || k.match(/\/SKILL\.md$/i)) {
        skillFolders.set(name, true);
      }
    }
  }

  const withSkillMd = [...skillFolders.entries()].filter(([, has]) => has);
  const withoutSkillMd = [...skillFolders.entries()].filter(([, has]) => !has);

  results.push({
    id: "sk-count",
    label: "At least 2 skills required for the task",
    status: withSkillMd.length >= 2 ? "pass" : "warn",
    detail: `${withSkillMd.length} skill(s) with SKILL.md: ${withSkillMd.map(([n]) => n).join(", ") || "none"}`,
  });

  if (withoutSkillMd.length > 0) {
    results.push({
      id: "sk-missing-skillmd",
      label: "Every skill folder has a SKILL.md",
      status: "fail",
      detail: `Missing SKILL.md in: ${withoutSkillMd.map(([n]) => n).join(", ")}`,
    });
  } else {
    results.push({
      id: "sk-missing-skillmd",
      label: "Every skill folder has a SKILL.md",
      status: skillFolders.size > 0 ? "pass" : "warn",
      detail: skillFolders.size === 0 ? "No skill folders found" : undefined,
    });
  }

  for (const [name, hasSkill] of skillFolders) {
    if (!hasSkill) continue;
    const skillPath = `environment/skills/${name}/SKILL.md`;
    const content = files[skillPath] ?? "";
    const hasAnswerKey =
      /the correct answer is|the answer is|expected output:/i.test(content);
    if (hasAnswerKey) {
      results.push({
        id: `sk-answerkey-${name}`,
        label: `Skill "${name}" does not contain answer keys`,
        status: "warn",
        detail:
          "SKILL.md may contain task-specific answer keys instead of general guidance",
      });
    }
  }

  return results;
}
