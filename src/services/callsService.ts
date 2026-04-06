import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface CallMessage {
  id?: string | number;
  call_id?: number;
  speaker: "ai" | "user";   // real field from API
  author?: string;
  text?: string;
  message?: string;         // fallback field name
  created_at?: string;
}

export interface Call {
  id?: string | number;
  user_id?: number;
  agent_id?: number;
  customer_id?: number;
  type?: string;            // "outbound" / "inbound"
  call_type?: string;       // "support" / "lead" etc
  intent?: string;
  status?: string;
  duration?: number | string;
  from?: string;
  to?: string;
  recording_url?: string | null;
  twilio_sid?: string | null;
  summary?: string;
  metadata?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  // Relations
  customer?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    total_calls?: number;
  };
  agent?: {
    id: number;
    name: string;
    goal?: string;
    tone?: string;
    status?: string;
  };
  messages?: CallMessage[];
}

const { base, byId, messages } = API_ROUTES.calls;

export const callsService = {
  getAll: () =>
    api.get<Call[]>(base).then((r) => r.data),

  getById: (id: string) =>
    api.get<Call>(byId(id)).then((r) => r.data),

  create: (data: Partial<Call>) =>
    api.post<Call>(base, data).then((r) => r.data),

  update: (id: string, data: Partial<Call>) =>
    api.put<Call>(byId(id), data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(byId(id)).then((r) => r.data),

  getMessages: (id: string) =>
    api.get<CallMessage[]>(messages(id)).then((r) => r.data),

  addMessage: (id: string, data: Pick<CallMessage, "speaker" | "text">) =>
    api.post<CallMessage>(messages(id), data).then((r) => r.data),
};
