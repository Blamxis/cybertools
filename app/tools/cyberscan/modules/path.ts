import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runPathTraversalModule(ctx: AnalysisContext): ModuleResult {
  const raw = ctx.rawUrl.toLowerCase();
  const path = ctx.path.toLowerCase();

  // Petite liste de motifs typiques utilisés dans les attaques de path traversal.
  // On couvre les versions normales, encodées, Windows, Linux, etc.
  const patterns = [
    "../",
    "..\\",
    "%2e%2e%2f",
    "%2e%2e/",
    "%2e%2e%5c",
    "..%2f",
    "..%5c",
    "/etc/passwd",              // cible classique sous Linux
    "c:\\windows\\system32",    // cible classique sous Windows
    "file://",                  // accès direct à un fichier
  ];

  // On vérifie si l’un de ces motifs apparaît dans l’URL brute ou dans le chemin.
  const hit = patterns.some((p) => raw.includes(p) || path.includes(p));

  // Si rien de suspect → module non déclenché
  if (!hit) {
    return {
      id: "path-traversal",
      triggered: false,
      label: "Path traversal attempt",
      severity: "Low",
      description: "",
      category: "Traversal",
    };
  }

  // Sévérité PRO : certains motifs sont beaucoup plus dangereux que d’autres.
  let severity: "Medium" | "High" = "Medium";

  // Si on voit des chemins système sensibles → c’est clairement High.
  if (
    raw.includes("/etc/passwd") ||
    raw.includes("system32") ||
    raw.includes("file://")
  ) {
    severity = "High";
  }

  // Résultat final du module
  return {
    id: "path-traversal",
    triggered: true,
    label: "Path traversal attempt",
    severity,
    description:
      "The URL contains patterns commonly used in directory traversal attacks.",
    category: "Traversal",
  };
}
