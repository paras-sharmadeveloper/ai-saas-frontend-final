export type Step = "welcome" | "company" | "services" | "tone" | "questions" | "review";

export interface ServiceItem {
  name: string;
}

export interface AITrainingState {
  companyName: string;
  website: string;
  description: string;
  scannedContent: string;
  services: string[];
  tone: string;
  language: string;
  agentName: string;
  selectedVoiceId: string;
  questions: string[];
  escalationTriggers: string[];
  callGoal: string;
}
