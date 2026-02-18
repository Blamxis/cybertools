import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runObfuscationModule(ctx: AnalysisContext): ModuleResult {
  const raw = ctx.rawUrl;
  const params = ctx.params;

  const reasons: string[] = [];
  let triggered = false;

  // 1) Recherche de null bytes (%00)
  // C’est un vieux classique pour casser des parsers ou contourner des filtres.
  const nullBytes = raw.match(/%00/gi) || [];
  if (nullBytes.length > 0) {
    triggered = true;
    reasons.push("null bytes detected");
  }

  // 2) Caractères de contrôle (0x00–0x1F)
  // Souvent utilisés pour obfusquer ou perturber les traitements côté serveur.
  const controlChars = raw.match(/%0[0-9A-F]/gi) || [];
  if (controlChars.length > 0) {
    triggered = true;
    reasons.push("control characters detected");
  }

  // 3) Caractères invisibles (zero-width, BOM, etc.)
  // Typiquement utilisés pour cacher des payloads ou tromper l'œil humain.
  const invisible = raw.match(/[\u200B-\u200F\uFEFF]/g) || [];
  if (invisible.length > 0) {
    triggered = true;
    reasons.push("invisible Unicode characters detected");
  }

  // 4) URL très longue
  // Une URL anormalement longue peut cacher un payload ou une tentative d’injection.
  if (raw.length > 200) {
    triggered = true;
    reasons.push(`very long URL (${raw.length} characters)`);
  }

  // 5) Paramètres très longs
  // Un paramètre énorme peut contenir un token, un payload encodé, ou une attaque.
  for (const [key, value] of Object.entries(params)) {
    if (value.length > 100) {
      triggered = true;
      reasons.push(`parameter "${key}" is very long (${value.length} chars)`);
    }
  }

  // 6) Trop de paramètres
  // Beaucoup de paramètres → souvent utilisé pour noyer un payload dans la masse.
  const paramCount = Object.keys(params).length;
  if (paramCount >= 10) {
    triggered = true;
    reasons.push(`many parameters (${paramCount})`);
  }

  // Si rien n’a déclenché → module non activé
  if (!triggered) {
    return {
      id: "obfuscation",
      triggered: false,
      label: "Obfuscation patterns",
      severity: "Low",
      description: "",
      category: "Obfuscation",
    };
  }

  // === Sévérité PRO ===
  // On augmente la sévérité si on voit des signes d’obfuscation lourde.
  let severity: "Low" | "Medium" | "High" = "Medium";

  // Cas vraiment suspects : URL énorme, beaucoup de paramètres,
  // ou beaucoup de caractères de contrôle / null bytes.
  if (paramCount >= 20 || raw.length > 500 || nullBytes.length >= 3 || controlChars.length >= 5) {
    severity = "High";
  }

  // Résultat final du module
  return {
    id: "obfuscation",
    triggered: true,
    label: "Obfuscation patterns",
    severity,
    description: `The URL contains obfuscation patterns: ${reasons.join(", ")}.`,
    category: "Obfuscation",
  };
}
