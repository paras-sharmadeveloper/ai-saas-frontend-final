import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";
import type { AITrainingState } from "@/components/ai-training/types";

export interface AITrainingPayload extends AITrainingState {
  systemPrompt?: string;
}

export interface AITrainingConfig extends AITrainingPayload {
  id?: string | number;
}

const { base, byId } = API_ROUTES.aiTraining;

export const aiTrainingService = {
  // GET /api/agent  — load existing config
  getConfig: () =>
    api.get<AITrainingConfig>(base).then((r) => r.data),

  // POST /api/agent  — create new config
  createConfig: (data: AITrainingPayload) =>
    api.post<AITrainingConfig>(base, data).then((r) => r.data),

  // PUT /api/agent/{id}  — full update
  updateConfig: (id: string, data: AITrainingPayload) =>
    api.put<AITrainingConfig>(byId(id), data).then((r) => r.data),

  // PATCH /api/agent/{id}  — partial update
  patchConfig: (id: string, data: Partial<AITrainingPayload>) =>
    api.patch<AITrainingConfig>(byId(id), data).then((r) => r.data),

  // DELETE /api/agent/{id}
  deleteConfig: (id: string) =>
    api.delete(byId(id)).then((r) => r.data),
};
