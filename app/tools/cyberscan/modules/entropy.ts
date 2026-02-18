import { AnalysisContext, ModuleResult } from "../types/analysis";

// Petite fonction qui calcule l'entropie de Shannon.
// En gros : plus une chaîne est "aléatoire", plus l'entropie est élevée.
// Ça nous aide à repérer les tokens, les clés API, les payloads obfusqués, etc.
function shannonEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;

  // On compte combien de fois chaque caractère apparaît
  const freq: Record<string, number> = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Formule classique de Shannon
  let entropy = 0;
  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

// Vérifie si une chaîne est du HEX pur (0-9 + a-f)
// Utile pour repérer des tokens ou des payloads encodés
function isHex(str: string): boolean {
  return /^[0-9a-f]+$/i.test(str);
}

// Vérifie si une chaîne ressemble à du Base64.
// On enlève d'abord les %xx pour éviter les faux positifs.
function isBase64(str: string): boolean {
  const cleaned = str.replace(/%[0-9A-F]{2}/gi, "");
  if (cleaned.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/=]+$/.test(cleaned);
}

// Vérifie si la chaîne mélange majuscules, minuscules et chiffres.
// C'est souvent un signe de token généré automatiquement.
function hasMixedPattern(str: string): boolean {
  return /[A-Z]/.test(str) && /[a-z]/.test(str) && /\d/.test(str);
}

export function runEntropyModule(ctx: AnalysisContext): ModuleResult {
  const raw = ctx.rawUrl;

  // On découpe l'URL en segments (paramètres, valeurs, chemins…)
  // et on garde seulement les morceaux assez longs pour être suspects.
  const segments = raw.split(/[\?&=\/]/).filter((s) => s.length > 20);

  // On stocke ici les segments qui nous semblent "bizarres"
  const suspicious: {
    segment: string;
    entropy: number;
    type: "hex" | "base64" | "random";
  }[] = [];

  for (const seg of segments) {
    const ent = shannonEntropy(seg);

    // Cas 1 : long HEX → souvent un token ou un hash
    if (isHex(seg) && seg.length > 20) {
      suspicious.push({ segment: seg, entropy: ent, type: "hex" });
      continue;
    }

    // Cas 2 : Base64 → typique des payloads encodés
    if (isBase64(seg) && seg.length > 20) {
      suspicious.push({ segment: seg, entropy: ent, type: "base64" });
      continue;
    }

    // Cas 3 : chaîne "random" (entropie élevée, longueur, mélange)
    if (ent > 3.5 || seg.length > 25 || hasMixedPattern(seg)) {
      suspicious.push({ segment: seg, entropy: ent, type: "random" });
    }
  }

  // Si rien de suspect → module non déclenché
  if (suspicious.length === 0) {
    return {
      id: "entropy",
      triggered: false,
      label: "High-entropy content",
      severity: "Low",
      description: "",
      category: "Obfuscation",
    };
  }

  // Sévérité : HEX est considéré plus dangereux que Base64 ou random
  let severity: "Medium" | "High" = "Medium";

  if (suspicious.some((s) => s.type === "hex")) {
    severity = "High";
  }

  // On construit une description lisible et courte
  const desc = suspicious
    .map((s) => {
      const short = s.segment.slice(0, 30) + "...";
      const typeLabel =
        s.type === "hex"
          ? "HEX token"
          : s.type === "base64"
          ? "Base64 string"
          : "random high-entropy string";

      return `${typeLabel}: "${short}" (entropy ${s.entropy.toFixed(2)})`;
    })
    .join(", ");

  // Résultat final du module
  return {
    id: "entropy",
    triggered: true,
    label: "High-entropy content",
    severity,
    description: `Detected: ${desc}.`,
    category: "Obfuscation",
  };
}
