export type Step = "welcome" | "company" | "services" | "tone" | "questions" | "review";

export type ServiceItem = {
  name: string;
  description: string;
};

export type CallGoal = "lead_generation" | "customer_support" | "appointment_booking" | "sales";

export type AITrainingState = {
  companyName: string;
  website: string;
  description: string;
  scannedContent: string;
  services: ServiceItem[];
  tone: string;
  language: string;
  agentName: string;
  selectedVoiceId: string;
  questions: string[];
  escalationTriggers: string[];
  callGoal: CallGoal;
};
