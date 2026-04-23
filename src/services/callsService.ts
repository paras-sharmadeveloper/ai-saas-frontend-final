import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface CallMessage {
  id?: string | number;
  call_id?: number;
  role?: "agent" | "user";
  speaker?: "ai" | "user";
  author?: string;
  message?: string;
  text?: string;
  time?: number;
  created_at?: string;
}

export interface Call {
  id?: string | number;
  uuid:string;
  conversation_id?: string;
  user_id?: number;
  agent_id?: number;
  customer_id?: number;
  customer_name?: string | null;
  phone?: string;
  date?: string;
  type?: string;
  call_type?: string;
  intent?: string;
  status?: string;
  duration?: number | string;
  summary?: string;
  language?: string;
  cost?: string;
  from?: string;
  to?: string;
  recording_url?: string | null;
  recording_path?: string | null;
  twilio_sid?: string | null;
  metadata?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  transcript?: CallMessage[];
  customer?: { id: number; name: string; email: string; phone: string; total_calls?: number };
  agent?: { id: number; name: string; goal?: string; tone?: string; status?: string };
  messages?: CallMessage[];
}

const { base, byId, messages } = API_ROUTES.calls;

export const callsService = {
  getAll: () => api.get<Call[]>(base).then((r) => r.data),
  getById: (id: string) => api.get<Call>(byId(id)).then((r) => r.data),
  create: (data: Partial<Call>) => api.post<Call>(base, data).then((r) => r.data),
  update: (id: string, data: Partial<Call>) => api.put<Call>(byId(id), data).then((r) => r.data),
  delete: (id: string) => api.delete(byId(id)).then((r) => r.data),
  getMessages: (id: string) => api.get<CallMessage[]>(messages(id)).then((r) => r.data),
  addMessage: (id: string, data: { role: string; message: string }) =>
    api.post<CallMessage>(messages(id), data).then((r) => r.data),
};
