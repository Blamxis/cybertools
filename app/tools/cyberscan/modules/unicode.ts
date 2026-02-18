import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runUnicodeModule(ctx: AnalysisContext): ModuleResult {
  const raw = ctx.rawUrl;

  // On récupère tous les caractères non-ASCII (> 127).
  // Ça permet de repérer les caractères exotiques, les alphabets étrangers,
  // ou des tentatives d’obfuscation.
  const unicodeChars = [...raw].filter((c) => c.charCodeAt(0) > 127);

  // Détection du BOM (Byte Order Mark)
  // C’est un caractère invisible qui peut perturber certains parsers.
  const hasBOM = raw.includes("\uFEFF");

  // Détection des caractères "zero-width"
  // Ils sont invisibles à l’œil nu et souvent utilisés pour cacher des payloads.
  const zeroWidth = raw.match(/[\u200B-\u200F\uFEFF]/g) || [];

  // Si rien de tout ça → module non déclenché
  if (unicodeChars.length === 0 && zeroWidth.length === 0 && !hasBOM) {
    return {
      id: "unicode",
      triggered: false,
      label: "Unicode characters detected",
      severity: "Low",
      description: "",
      category: "Unicode",
    };
  }

  // On prépare une petite liste de détails pour expliquer ce qu’on a trouvé.
  const details: string[] = [];

  if (unicodeChars.length > 0) {
    details.push(`non-ASCII characters: ${unicodeChars.join(" ")}`);
  }

  if (zeroWidth.length > 0) {
    details.push(`zero-width characters: ${zeroWidth.join(" ")}`);
  }

  if (hasBOM) {
    details.push("BOM detected");
  }

  // Résultat final du module
  return {
    id: "unicode",
    triggered: true,
    label: "Unicode characters detected",
    severity: "Medium", // présence d’Unicode → suspicion modérée
    description: `The URL contains ${details.join(", ")}.`,
    category: "Unicode",
  };
}
