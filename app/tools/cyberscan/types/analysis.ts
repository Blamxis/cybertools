export type Severity = "Low" | "Medium" | "High" | "Critical";
// Niveau de gravité d’un finding.
// C’est ce que chaque module renvoie pour indiquer l’importance du problème.

export type Category =
  | "Injection"
  | "Unicode"
  | "Redirect"
  | "Obfuscation"
  | "Encoding"
  | "XSS"
  | "Mixed"
  | "Debug"
  | "Domain"
  | "Traversal";
// Catégorie générale du finding.
// Ça permet de regrouper les résultats par type d’attaque ou de comportement.

export interface ModuleResult {
  id: string;               // Identifiant unique du module (ex: "xss", "sqli")
  triggered: boolean;       // Est-ce que le module a détecté quelque chose ?
  label: string;            // Nom lisible du finding
  severity: Severity;       // Gravité du finding
  description: string;      // Explication détaillée
  category: Category;       // Catégorie du module
}
// Structure standard que chaque module doit renvoyer.
// Ça garantit que tous les modules parlent le même “langage”.

export interface AnalysisContext {
  rawUrl: string;                 // URL telle que fournie par l’utilisateur
  normalizedUrl: string;          // URL normalisée (lowercase, tri des params…)
  url: URL;                       // Objet URL déjà parsé
  host: string;                   // Hostname extrait
  path: string;                   // Chemin de l’URL
  params: Record<string, string>; // Paramètres sous forme clé/valeur
}
// Contexte partagé entre tous les modules.
// C’est ce qui leur permet d’analyser la même URL sans recalculer 50 fois.

export interface AnalysisResult {
  valid: boolean;                 // L’URL est-elle valide ?
  risk: Severity;                 // Niveau de risque global (calculé après coup)
  findings: {
    label: string;
    severity: Severity;
    description: string;
  }[];                            // Liste des findings déclenchés
  categories: Record<string, number>; // Compteur par catégorie (Injection: 2, XSS: 1…)
  report: string;                 // Rapport final lisible
  normalized: string;             // URL normalisée affichée dans le rapport
  modulesTriggered: string[];     // Liste des modules qui ont détecté quelque chose
}
// Structure finale renvoyée par ton analyseur.
// C’est ce que ton UI ou ton API va consommer pour afficher les résultats.
