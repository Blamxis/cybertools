import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runSuspiciousParamsModule(ctx: AnalysisContext): ModuleResult {
  const params = ctx.params;

  // Petite liste de paramètres "sensibles" ou suspects.
  // Ce sont des noms qu’on retrouve souvent dans des attaques,
  // ou dans des fonctionnalités critiques (cmd, exec, token, auth…)
  const suspiciousKeys = [
    "cmd",
    "exec",
    "execute",
    "run",
    "shell",
    "query",
    "search",
    "redirect",
    "next",
    "continue",
    "file",
    "path",
    "dir",
    "download",
    "upload",
    "debug",
    "admin",
    "token",
    "key",
    "auth",
  ];

  const triggeredParams: string[] = [];

  // On parcourt tous les paramètres de l’URL
  // et on regarde si leur nom fait partie de la liste suspecte.
  for (const key of Object.keys(params)) {
    if (suspiciousKeys.includes(key.toLowerCase())) {
      triggeredParams.push(key);
    }
  }

  // Si aucun paramètre suspect → module non déclenché
  if (triggeredParams.length === 0) {
    return {
      id: "suspicious-params",
      triggered: false,
      label: "Suspicious parameters",
      severity: "Low",
      description: "",
      category: "Mixed",
    };
  }

  // Sévérité PRO : certains paramètres sont plus dangereux que d’autres.
  // Par exemple : cmd, exec, token, auth → souvent liés à des attaques.
  let severity: "Medium" | "High" = "Medium";

  if (
    triggeredParams.includes("cmd") ||
    triggeredParams.includes("exec") ||
    triggeredParams.includes("token") ||
    triggeredParams.includes("auth")
  ) {
    severity = "High";
  }

  // Résultat final du module
  return {
    id: "suspicious-params",
    triggered: true,
    label: "Suspicious parameters",
    severity,
    description: `The URL contains suspicious parameters: ${triggeredParams.join(
      ", "
    )}.`,
    category: "Mixed",
  };
}
