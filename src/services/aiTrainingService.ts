import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface FAQ {
  question: string;
  answer: string;
}

export interface AITrainingConfig {
  id?: string;
  aiName: string;
  greetingMessage: string;
  closingMessage: string;
  companyDescription: string;
  companyUrl: string;
  servicesOffered: string;
  targetAudience: string;
  tone: "friendly" | "professional";
  goal: "lead" | "support" | "sales";
  responseStyle: "concise" | "detailed";
  qualifyingQuestions: string[];
  faqs: FAQ[];
  customInstructions: string;
}

const { base, byId } = API_ROUTES.aiTraining;

export const aiTrainingService = {
  // READ
  getConfig: () =>
    api.get<AITrainingConfig>(base).then((r) => r.data),

  // CREATE
  createConfig: (data: Omit<AITrainingConfig, "id">) =>
    api.post<AITrainingConfig>(base, data).then((r) => r.data),

  // UPDATE (full)
  updateConfig: (id: string, data: AITrainingConfig) =>
    api.put<AITrainingConfig>(byId(id), data).then((r) => r.data),

  // UPDATE (partial)
  patchConfig: (id: string, data: Partial<AITrainingConfig>) =>
    api.patch<AITrainingConfig>(byId(id), data).then((r) => r.data),

  // DELETE
  deleteConfig: (id: string) =>
    api.delete(byId(id)).then((r) => r.data),
};
