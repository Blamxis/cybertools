import { ModuleResult, Severity } from "../types/analysis";

export function computeRiskAndCategories(mods: ModuleResult[]) {
  // On prépare un petit objet pour compter combien de modules
  // appartiennent à chaque catégorie (XSS, Injection, Mixed, etc.)
  const categories: Record<string, number> = {};

  // Pour chaque module déclenché, on ajoute +1 à sa catégorie
  // (si la catégorie n'existe pas encore, on la crée à 0 avant d'ajouter)
  for (const m of mods) {
    categories[m.category] = (categories[m.category] || 0) + 1;
  }

  // On récupère juste la liste des sévérités (High, Medium, etc.)
  const severities = mods.map((m) => m.severity);

  // Par défaut, on considère que le risque est faible
  let risk: Severity = "Low";

  // Si un module critique existe → on passe direct en Critical
  if (severities.includes("Critical")) risk = "Critical";
  // Sinon, si un module High existe → risque High
  else if (severities.includes("High")) risk = "High";
  // Sinon, si un module Medium existe → risque Medium
  else if (severities.includes("Medium")) risk = "Medium";

  // On renvoie le risque global + le comptage des catégories
  return { risk, categories };
}
