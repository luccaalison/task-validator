import type { FileMap, ValidatorOutput, ValidationSection } from "../types";
import { validateFileStructure } from "./fileStructure";
import { validateInstructions } from "./instructions";
import { validateDockerCompose } from "./dockerCompose";
import { validateSkills } from "./skills";
import { validateTests } from "./tests";
import { validateTestRunner } from "./testRunner";
import { validateRubrics } from "./rubrics";

export function runAllValidators(
  files: FileMap,
  rubricsJson: string
): ValidatorOutput {
  const sections: ValidationSection[] = [
    { title: "File Structure", checks: validateFileStructure(files) },
    { title: "Prompt / Instructions", checks: validateInstructions(files) },
    {
      title: "Environment & Docker",
      checks: [...validateDockerCompose(files), ...validateSkills(files)],
    },
    { title: "Tests (test_outputs.py)", checks: validateTests(files) },
    { title: "Rubrics", checks: validateRubrics(rubricsJson) },
    { title: "Test Runner (test.sh)", checks: validateTestRunner(files) },
  ];

  let totalChecks = 0;
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const section of sections) {
    for (const check of section.checks) {
      totalChecks++;
      if (check.status === "pass") passed++;
      else if (check.status === "fail") failed++;
      else warnings++;
    }
  }

  return { sections, totalChecks, passed, failed, warnings };
}
