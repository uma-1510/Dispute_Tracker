export type DisputeType =
  | "duplicate"
  | "pricing"
  | "not_received"
  | "short_pay"
  | "other";

export type Priority = "High" | "Medium" | "Low";

export type Recommendation = "Approve" | "Request Docs" | "Escalate";

export interface AnalysisResult {
  disputeType: DisputeType;
  priority: Priority;
  summary: string;
  recommendation: Recommendation;
  recommendationReason: string;
  nextSteps: string[];
  responseEmail: string;
  estimatedResolutionDays: number;
}
