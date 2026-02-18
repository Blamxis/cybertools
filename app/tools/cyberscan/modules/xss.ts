import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runXssModule(ctx: AnalysisContext): ModuleResult {
  const raw = ctx.rawUrl.toLowerCase();

  // Liste des motifs XSS les plus classiques.
  // Ce sont les payloads qu’on retrouve dans 90% des attaques simples :
  // <script>, javascript:, onerror=, alert(), etc.
  const patterns = [
    "<script",
    "javascript:",
    "onerror=",
    "onload=",
    "alert(",
    "prompt(",
    "confirm(",
    "document.cookie",
    "window.location",
    "eval(",
  ];

  // Versions encodées des mêmes attaques.
  // Beaucoup d’attaquants encodent les caractères pour contourner les filtres naïfs.
  const encodedPatterns = [
    "%3cscript", // <script
    "%3cimg",    // <img
    "%3csvg",    // <svg
    "%3ciframe",
    "javascript%3a",
    "%6a%61%76%61%73%63%72%69%70%74", // "javascript:" encodé en hex
  ];

  // On vérifie si l’URL contient l’un de ces motifs.
  // Si oui → forte probabilité de payload XSS.
  const hit =
    patterns.some((p) => raw.includes(p)) ||
    encodedPatterns.some((p) => raw.includes(p));

  // Si rien trouvé → module non déclenché
  if (!hit) {
    return {
      id: "xss",
      triggered: false,
      label: "XSS payload",
      severity: "Low",
      description: "",
      category: "XSS",
    };
  }

  // Sévérité PRO :
  // Si on voit un vrai <script> (ou sa version encodée), c’est un signal fort.
  let severity: "Medium" | "High" = "Medium";

  if (raw.includes("<script") || raw.includes("%3cscript")) {
    severity = "High";
  }

  // Résultat final du module
  return {
    id: "xss",
    triggered: true,
    label: "XSS payload",
    severity,
    description:
      "The URL contains patterns commonly used in Cross-Site Scripting (XSS) attacks.",
    category: "XSS",
  };
}
