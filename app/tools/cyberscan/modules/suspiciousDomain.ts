import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runSuspiciousDomainModule(
  ctx: AnalysisContext
): ModuleResult {
  const host = ctx.host.toLowerCase();

  // Liste de TLD (extensions de domaine) considérés comme plus risqués.
  // Ils sont souvent utilisés dans des campagnes de phishing ou des sites jetables.
  const riskyTlds = [
    ".ru",
    ".cn",
    ".tk",
    ".top",
    ".xyz",
    ".gq",
    ".ml",
    ".cf",
    ".work",
    ".click",
    ".link",
    ".info",
  ];

  // Mots-clés typiques du phishing.
  // Quand un domaine contient "login", "secure", "verify", etc.,
  // c’est souvent pour imiter un site officiel.
  const phishingKeywords = [
    "login",
    "secure",
    "verify",
    "update",
    "account",
    "billing",
    "support",
    "security",
    "auth",
    "wallet",
  ];

  let triggered = false;
  const reasons: string[] = [];

  // 1) Vérification du TLD
  // Si le domaine se termine par un TLD risqué → suspicion.
  for (const tld of riskyTlds) {
    if (host.endsWith(tld)) {
      triggered = true;
      reasons.push(`risky TLD "${tld}"`);
      break;
    }
  }

  // 2) Trop de sous-domaines
  // Un domaine très profond (ex : a.b.c.d.e.com) est souvent utilisé pour tromper l’utilisateur.
  const labels = host.split(".");
  if (labels.length >= 5) {
    triggered = true;
    reasons.push(`many subdomains (${labels.length} labels)`);
  }

  // 3) Mots-clés de phishing dans le domaine
  for (const kw of phishingKeywords) {
    if (host.includes(kw)) {
      triggered = true;
      reasons.push(`phishing-related keyword "${kw}" in hostname`);
    }
  }

  // Si rien de suspect → module non déclenché
  if (!triggered) {
    return {
      id: "suspicious-domain",
      triggered: false,
      label: "Suspicious domain",
      severity: "Low",
      description: "",
      category: "Domain",
    };
  }

  // Sévérité PRO : on augmente si on cumule TLD risqué + mot-clé de phishing
  let severity: "Medium" | "High" = "Medium";

  const hasRiskyTld = riskyTlds.some((tld) => host.endsWith(tld));
  const hasPhishingKeyword = phishingKeywords.some((kw) =>
    host.includes(kw)
  );

  if (hasRiskyTld && hasPhishingKeyword) {
    severity = "High";
  }

  // Résultat final du module
  return {
    id: "suspicious-domain",
    triggered: true,
    label: "Suspicious domain",
    severity,
    description: `The domain looks suspicious: ${reasons.join(", ")}.`,
    category: "Domain",
  };
}
