import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runSqlInjectionModule(ctx: AnalysisContext): ModuleResult {
  const full = ctx.rawUrl.toLowerCase();

  // Liste de motifs SQL classiques en clair.
  // Ce sont les payloads les plus connus : OR 1=1, UNION SELECT, DROP TABLE...
  const rawPatterns = [
    " or 1=1",
    " or 1=1--",
    " or '1'='1",
    "\" or \"1\"=\"1",
    " union select ",
    " union all select ",
    " drop table ",
    " information_schema ",
  ];

  // Versions encodées des mêmes attaques (URL-encoded).
  // Beaucoup d'attaquants les utilisent pour contourner les filtres naïfs.
  const encodedPatterns = [
    "%20or%201%3d1",
    "%20or%201=1",
    "%27%20or%20%271%27%3d%271",
    "%22%20or%20%221%22%3d%221",
    "union%20select",
    "union%20all%20select",
    "drop%20table",
    "information_schema",
  ];

  // Motifs "lâches" : versions raccourcies ou partiellement encodées.
  // Ça permet d’attraper les variantes un peu bricolées.
  const loosePatterns = [
    "or%201=1",
    "or%201%3d1",
    "or 1=1",
    "or1=1",
  ];

  // Versions semi-encodées (mi-texte, mi-URL-encoded)
  const semiEncoded = [
    "%27%20or%20%271%27=",
    "%22%20or%20%221%22=",
  ];

  // On vérifie si l’URL contient l’un de ces motifs.
  // Si oui → très forte probabilité de payload SQLi.
  const hit =
    rawPatterns.some((p) => full.includes(p)) ||
    encodedPatterns.some((p) => full.includes(p)) ||
    semiEncoded.some((p) => full.includes(p)) ||
    loosePatterns.some((p) => full.includes(p));

  // Si rien trouvé → module non déclenché
  if (!hit) {
    return {
      id: "sqli",
      triggered: false,
      label: "SQL injection-like payload",
      severity: "Low",
      description: "",
      category: "Injection",
    };
  }

  // Si on arrive ici, c’est qu’on a repéré un motif SQLi.
  // On considère ça comme un signal fort → High direct.
  return {
    id: "sqli",
    triggered: true,
    label: "SQL injection-like payload",
    severity: "High",
    description:
      "The URL contains patterns commonly used in SQL injection attacks.",
    category: "Injection",
  };
}
