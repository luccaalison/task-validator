export type CheckStatus = "pass" | "fail" | "warn";

export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  detail?: string;
}

export interface ValidationSection {
  title: string;
  checks: CheckResult[];
}

export interface ValidatorOutput {
  sections: ValidationSection[];
  totalChecks: number;
  passed: number;
  failed: number;
  warnings: number;
}

export type FileMap = Record<string, string>;
