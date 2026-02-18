export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type Finding = {
  label: string;
  severity: RiskLevel;
  description: string;
};
