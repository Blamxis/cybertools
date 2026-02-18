import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runMixedPayloadModule(
  ctx: AnalysisContext,
  triggeredModules: ModuleResult[]
): ModuleResult {
  // On récupère juste la liste des IDs des modules déclenchés.
  // Ça permet de vérifier facilement les combinaisons (XSS + SQLi, etc.)
  const ids = triggeredModules.map((m) => m.id);

  const reasons: string[] = [];
  let triggered = false;

  // Sévérité par défaut : Medium (on l'ajustera selon les combos trouvés)
  let severity: "Low" | "Medium" | "High" = "Medium";

  // 1) Combo XSS + SQLi → attaque hybride très dangereuse
  // C’est un cas classique où deux vecteurs se mélangent dans un même payload.
  if (ids.includes("xss") && ids.includes("sqli")) {
    triggered = true;
    severity = "High";
    reasons.push("XSS + SQL injection hybrid payload");
  }

  // 2) XSS + Unicode → XSS obfusqué avec des caractères spéciaux
  if (ids.includes("xss") && ids.includes("unicode")) {
    triggered = true;
    reasons.push("XSS payload obfuscated with Unicode characters");
  }

  // 3) SQLi + Encoding → SQLi cachée derrière du %xx
  if (ids.includes("sqli") && ids.includes("encoding")) {
    triggered = true;
    reasons.push("SQL injection payload hidden using URL encoding");
  }

  // 4) Redirect + Obfuscation → redirection masquée
  if (ids.includes("redirect") && ids.includes("obfuscation")) {
    triggered = true;
    reasons.push("Open redirect obfuscated using encoding or control characters");
  }

  // 5) Suspicious domain + Unicode → phishing avancé (ex : domaine en cyrillique)
  if (ids.includes("suspicious-domain") && ids.includes("unicode")) {
    triggered = true;
    severity = "High";
    reasons.push("Phishing domain using Unicode obfuscation");
  }

  // 6) Entropy + Suspicious params → token suspect dans un paramètre sensible
  if (ids.includes("entropy") && ids.includes("suspicious-params")) {
    triggered = true;
    reasons.push("High-entropy token in suspicious parameter");
  }

  // 7) Mixed content + Redirect → tentative de downgrade (HTTPS → HTTP)
  if (ids.includes("mixed-content") && ids.includes("redirect")) {
    triggered = true;
    reasons.push("Mixed-content redirect may indicate downgrade attack");
  }

  // 8) Path traversal + Encoding → tentative de traversal masquée
  if (ids.includes("path-traversal") && ids.includes("encoding")) {
    triggered = true;
    reasons.push("Path traversal attempt hidden using encoding");
  }

  // Si aucune combinaison dangereuse n'a été trouvée → module non déclenché
  if (!triggered) {
    return {
      id: "mixed-payload",
      triggered: false,
      label: "Mixed payload detection",
      severity: "Low",
      description: "",
      category: "Mixed",
    };
  }

  // Sinon, on renvoie un module déclenché avec toutes les raisons trouvées
  return {
    id: "mixed-payload",
    triggered: true,
    label: "Mixed payload detection",
    severity,
    description: reasons.join("; ") + ".",
    category: "Mixed",
  };
}
