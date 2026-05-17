export type RiskLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Clause {
  title: string;
  originalText: string;
  riskLevel: RiskLevel;
  riskCategories: string[];
  plainLanguageExplanation: string;
  whyItsRisky: string;
  recommendation: string;
}

export interface AnalysisResults {
  contractType: string;
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  summary: string;
  redFlags: string[];
  negotiationRecommendations: string[];
  clauses: Clause[];
  riskDistribution: {
    privacy: number;
    financial: number;
    employment: number;
    ip: number;
    compliance: number;
    ambiguity: number;
  };
}
