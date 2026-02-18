import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runMixedContentModule(ctx: AnalysisContext): ModuleResult {
  const raw = ctx.rawUrl.toLowerCase();

  // Si l'URL commence directement en HTTP, il n'y a pas de "mixed content".
  // Le mixed content, c'est quand une page HTTPS charge du contenu HTTP.
  if (raw.startsWith("http://")) {
    return {
      id: "mixed-content",
      triggered: false,
      label: "Mixed content",
      severity: "Low",
      description: "",
      category: "Mixed",
    };
  }

  // Ici on cherche des traces de "http://" dans une URL qui n'est PAS en HTTP.
  // Ça peut être un lien interne, un paramètre, ou un contenu chargé en HTTP.
  const hasMixed =
    raw.includes("http://") ||
    raw.includes("http%3a%2f%2f") || // version encodée de http://
    raw.includes("http%3a//");       // variante bizarre mais possible

  // Si on ne trouve aucune trace de HTTP → rien à signaler
  if (!hasMixed) {
    return {
      id: "mixed-content",
      triggered: false,
      label: "Mixed content",
      severity: "Low",
      description: "",
      category: "Mixed",
    };
  }

  // Si on arrive ici, c'est qu'on a trouvé du contenu HTTP dans une URL qui n'est pas HTTP.
  // On choisit la sévérité : Medium par défaut.
  let severity: "Medium" | "High" = "Medium";

  // Si la page est en HTTPS mais charge du HTTP → c'est un vrai problème de sécurité.
  // Ça peut permettre des attaques de downgrade ou d'injection.
  if (raw.startsWith("https://") && hasMixed) {
    severity = "High";
  }

  // Résultat final du module
  return {
    id: "mixed-content",
    triggered: true,
    label: "Mixed content",
    severity,
    description:
      "The URL mixes secure (HTTPS) and insecure (HTTP) content, which may indicate downgrade or injection risks.",
    category: "Mixed",
  };
}
