import { Finding, RiskLevel } from "../utils/type";

export function computeRiskLevel(findings: Finding[]): RiskLevel {
  let score = 0;

  // On parcourt chaque "finding" et on ajoute des points selon sa sévérité.
  // L'idée est simple : plus il y a de findings sérieux, plus le score monte.
  findings.forEach((f) => {
    if (f.severity === "Medium") score += 1;   // un petit point pour du Medium
    if (f.severity === "High") score += 2;     // deux points pour du High
    if (f.severity === "Critical") score += 3; // trois points pour du Critical
  });

  // Ensuite, on convertit le score total en niveau de risque global.
  // C’est une sorte d’échelle : plus le score est élevé, plus le risque monte.
  if (score >= 6) return "Critical"; // beaucoup de findings sérieux
  if (score >= 3) return "High";     // quelques findings importants
  if (score >= 1) return "Medium";   // un ou deux findings moyens
  return "Low";                      // rien de notable → risque faible
}
