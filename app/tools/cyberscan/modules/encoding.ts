import { AnalysisContext, ModuleResult } from "../types/analysis";

export function runEncodingModule(ctx: AnalysisContext): ModuleResult {
  const raw = ctx.rawUrl;

  // On cherche toutes les séquences encodées du style "%2F", "%20", etc.
  // Ça nous permet de voir si l'URL est très encodée ou pas.
  const encodedMatches = raw.match(/%[0-9A-Fa-f]{2}/g) || [];
  const encodedCount = encodedMatches.length;

  // Si on a beaucoup de séquences encodées, c'est souvent un signe d'obfuscation.
  const highEncoding = encodedCount >= 6;

  // Ici on vérifie si la version décodée de l'URL est différente.
  // Si oui, ça veut dire que l'URL contient des caractères encodés importants.
  let decodedDiffers = false;
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded !== raw) decodedDiffers = true;
  } catch {
    // Si decodeURIComponent plante, c'est qu'il y a un encodage bizarre.
    decodedDiffers = true;
  }

  // Si rien de suspect → on ne déclenche pas le module.
  if (!highEncoding && !decodedDiffers) {
    return {
      id: "encoding",
      triggered: false,
      label: "High encoding ratio",
      severity: "Low",
      description: "",
      category: "Encoding",
    };
  }

  // On prépare une petite liste de raisons pour expliquer pourquoi on a déclenché.
  const reasons: string[] = [];

  if (highEncoding)
    reasons.push(`many encoded characters (${encodedCount} sequences)`);

  if (decodedDiffers)
    reasons.push("decoded URL differs from raw URL");

  // Ici on choisit la sévérité en fonction de ce qu'on a trouvé.
  // C'est un système simple mais efficace.
  let severity: "Low" | "Medium" | "High" = "Low";

  // Si l'URL décodée change → c'est déjà un peu suspect.
  if (decodedDiffers) severity = "Medium";

  // Si en plus il y a beaucoup d'encodage → là on passe en High.
  if (highEncoding && decodedDiffers) severity = "High";

  // On renvoie le résultat final du module.
  return {
    id: "encoding",
    triggered: true,
    label: "High encoding ratio",
    severity,
    description: `The URL contains ${reasons.join(", ")}.`,
    category: "Encoding",
  };
}
