import type { CheckResult, FileMap } from "../types";

export function validateDockerCompose(files: FileMap): CheckResult[] {
  const content =
    files["environment/docker-compose.yaml"] ??
    files["environment/docker-compose.yml"] ??
    "";
  const results: CheckResult[] = [];

  if (!content.trim()) {
    results.push({
      id: "dc-empty",
      label: "docker-compose.yaml is not empty",
      status: "fail",
      detail: "File is empty or missing",
    });
    return results;
  }

  const hasHostVerifier = content.includes("HOST_VERIFIER_LOGS_PATH");
  const hasEnvVerifier = content.includes("ENV_VERIFIER_LOGS_PATH");
  results.push({
    id: "dc-bind-mount",
    label: "Uses bind-mount variables for logs (HOST_VERIFIER_LOGS_PATH)",
    status: hasHostVerifier && hasEnvVerifier ? "pass" : "fail",
    detail:
      !hasHostVerifier || !hasEnvVerifier
        ? "Missing HOST_VERIFIER_LOGS_PATH or ENV_VERIFIER_LOGS_PATH bind-mount variables"
        : undefined,
  });

  const namedVolumePattern = /^\s*volumes:\s*\n\s+\w+:/m;
  const topLevelVolumes = /^volumes:\s*$/m.test(content);
  const mainServiceLogs = /logs:\/logs/.test(content);
  results.push({
    id: "dc-no-named-volumes",
    label: "No named volumes for logs on main service",
    status:
      mainServiceLogs || (topLevelVolumes && namedVolumePattern.test(content))
        ? "fail"
        : "pass",
    detail: mainServiceLogs
      ? 'Found named volume "logs:/logs" on main service'
      : topLevelVolumes
        ? "Found top-level named volumes section"
        : undefined,
  });

  const serviceMatches = content.match(/^\s{2}\w[\w-]*:\s*$/gm) ?? [];
  const serviceNames = serviceMatches.map((s) => s.trim().replace(":", ""));
  const nonMainServices = serviceNames.filter(
    (n) => n !== "main" && n !== "litellm-proxy"
  );
  results.push({
    id: "dc-api-services",
    label: "At least 2 mock API services defined",
    status:
      nonMainServices.length >= 2
        ? "pass"
        : nonMainServices.length === 1
          ? "warn"
          : "fail",
    detail: `Found ${nonMainServices.length} API service(s): ${nonMainServices.join(", ") || "none"}`,
  });

  const hasMainEnv = /main:[\s\S]*?environment:/m.test(content);
  results.push({
    id: "dc-main-env",
    label: "Main service has environment variables",
    status: hasMainEnv ? "pass" : "warn",
    detail: hasMainEnv ? undefined : "No environment block found under main service",
  });

  const hasMainService = serviceNames.includes("main");
  results.push({
    id: "dc-main-exists",
    label: 'Main service "main" is defined',
    status: hasMainService ? "pass" : "fail",
    detail: hasMainService ? undefined : 'No service named "main" found',
  });

  return results;
}
