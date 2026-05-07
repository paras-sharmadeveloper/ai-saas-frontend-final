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
  uuid: string;
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

export interface PaginatedCallsResponse {
  data: Call[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  debug_user_id?: number;
  debug_total_logs?: number;
  debug_user_logs?: number;
}

export interface CallsQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  filter?: string;
}

const { base, byId, messages } = API_ROUTES.calls;

export const callsService = {
  getAll: (params?: CallsQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.filter && params.filter !== 'All') searchParams.append('filter', params.filter);
    
    const url = searchParams.toString() ? `${base}?${searchParams.toString()}` : base;
    return api.get<PaginatedCallsResponse>(url).then((r) => r.data);
  },
  getById: (id: string) => api.get<Call>(byId(id)).then((r) => r.data),
  create: (data: Partial<Call>) => api.post<Call>(base, data).then((r) => r.data),
  update: (id: string, data: Partial<Call>) => api.put<Call>(byId(id), data).then((r) => r.data),
  delete: (id: string) => api.delete(byId(id)).then((r) => r.data),
  getMessages: (id: string) => api.get<CallMessage[]>(messages(id)).then((r) => r.data),
  addMessage: (id: string, data: { role: string; message: string }) =>
    api.post<CallMessage>(messages(id), data).then((r) => r.data),
};
