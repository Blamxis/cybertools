import { AnalysisContext, ModuleResult } from "../types/analysis";

// Petite table qui liste les caractères Unicode qui ressemblent à des caractères normaux.
// Ce sont des "homoglyphes" : visuellement identiques, mais en réalité différents.
// Ils sont souvent utilisés dans des attaques de phishing ou pour tromper l'œil.
const homoglyphMap: Record<string, string> = {
  "а": "a", // Cyrillic a
  "е": "e", // Cyrillic e
  "о": "o", // Cyrillic o
  "р": "p", // Cyrillic r
  "с": "c", // Cyrillic s
  "х": "x", // Cyrillic x
  "і": "i", // Ukrainian i
  "ј": "j", // Cyrillic j
  "ⅼ": "l", // Roman numeral fifty
  "ӏ": "l", // Cyrillic palochka
  "ꞏ": ".", // dot-like
  "．": ".", // full-width dot
  "｡": ".", // half-width dot
};

// Petite fonction qui dit simplement : "ce caractère est-il un homoglyph ?"
function isHomoglyph(char: string): boolean {
  return homoglyphMap[char] !== undefined;
}

export function runHomoglyphModule(ctx: AnalysisContext): ModuleResult {
  const raw = ctx.rawUrl;

  // Hostname final après normalisation (celui que l'objet URL a compris)
  const finalHost = ctx.url.hostname;

  // Hostname brut, tel que l'utilisateur l'a écrit, avant toute normalisation.
  // On enlève juste le protocole et on coupe avant les / ? #
  const rawHost = raw
    .replace(/^https?:\/\//i, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0];

  const detected: string[] = [];

  // On analyse le hostname brut caractère par caractère.
  // Si un caractère est > 127 (donc non ASCII) et qu'il est dans notre table → homoglyph détecté.
  for (const c of [...rawHost]) {
    if (c.charCodeAt(0) > 127 && isHomoglyph(c)) {
      detected.push(c);
    }
  }

  // On refait la même analyse sur le hostname final, au cas où la normalisation
  // aurait conservé certains caractères Unicode.
  for (const c of [...finalHost]) {
    if (c.charCodeAt(0) > 127 && isHomoglyph(c)) {
      detected.push(c);
    }
  }

  // Si aucun homoglyph trouvé → module non déclenché.
  if (detected.length === 0) {
    return {
      id: "homoglyph",
      triggered: false,
      label: "Homoglyph detection",
      severity: "Low",
      description: "",
      category: "Unicode",
    };
  }

  // Si on arrive ici, c'est qu'on a trouvé au moins un homoglyph.
  // On choisit la sévérité : un seul → Medium, plusieurs → High.
  let severity: "Medium" | "High" = "Medium";

  if (detected.length >= 2) {
    severity = "High";
  }

  // On enlève les doublons pour un affichage propre.
  const unique = [...new Set(detected)];

  // Résultat final du module.
  return {
    id: "homoglyph",
    triggered: true,
    label: "Homoglyph detection",
    severity,
    description: `The hostname contains visually deceptive Unicode characters: ${unique.join(
      ", "
    )}.`,
    category: "Unicode",
  };
}
