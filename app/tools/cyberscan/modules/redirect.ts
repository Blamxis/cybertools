import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runRedirectModule(ctx: AnalysisContext): ModuleResult {
  const params = ctx.params;

  // Liste des noms de paramètres qui sont souvent utilisés
  // pour faire des redirections (légitimes ou malveillantes).
  // Exemple : redirect=, next=, url=, goto=...
  const redirectKeys = ["redirect", "next", "url", "goto", "return", "continue"];

  // On parcourt chaque paramètre suspect
  for (const key of redirectKeys) {
    if (params[key]) {
      const value = params[key].toLowerCase();

      // Ici on vérifie si la valeur du paramètre pointe vers un site externe.
      // C’est exactement ce qu’on cherche dans une attaque d’open redirect.
      const looksExternal =
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("//"); // version "protocol-relative"

      // Si la valeur pointe vers un domaine externe → open redirect potentiel
      if (looksExternal) {
        return {
          id: "redirect",
          triggered: true,
          label: "Potential open redirect",
          severity: "High", // c’est un vrai risque de phishing
          description: `Parameter "${key}" points to an external URL.`,
          category: "Redirect",
        };
      }
    }
  }

  // Si aucun paramètre suspect ne pointe vers un domaine externe → rien à signaler
  return {
    id: "redirect",
    triggered: false,
    label: "Potential open redirect",
    severity: "Low",
    description: "",
    category: "Redirect",
  };
}
