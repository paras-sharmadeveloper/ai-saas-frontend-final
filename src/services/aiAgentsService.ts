import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface FAQ {
  q: string;
  a: string;
}

// Raw shape the Laravel API returns
interface RawFAQ {
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

interface RawAgent {
  id?: string | number;
  name?: string;
  goal?: string;
  tone?: string;
  status?: string;
  calls?: number;
  questions?: string[] | string;
  faqs?: RawFAQ[] | string;
}

// Normalize API response → our AIAgent shape
const normalize = (raw: RawAgent): AIAgent => ({
  id: String(raw.id ?? ""),
  name: raw.name ?? "",
  goal: raw.goal ?? "Lead Qualification",
  tone: raw.tone ?? "Friendly",
  status: raw.status ?? "Active",
  calls: raw.calls ?? 0,
  questions: Array.isArray(raw.questions)
    ? raw.questions
    : typeof raw.questions === "string"
    ? JSON.parse(raw.questions || "[]")
    : [],
  faqs: (() => {
    const raw_faqs = Array.isArray(raw.faqs)
      ? raw.faqs
      : typeof raw.faqs === "string"
      ? JSON.parse(raw.faqs || "[]")
      : [];
    return raw_faqs.map((f: RawFAQ) => ({
      q: f.q ?? f.question ?? "",
      a: f.a ?? f.answer ?? "",
    }));
  })(),
});

export interface AIAgent {
  id?: string;
  name: string;
  goal: string;
  tone: string;
  status: string;
  calls?: number;
  questions?: string[];
  faqs?: FAQ[];
}

const { base, byId } = API_ROUTES.agent;

export const aiAgentsService = {
  // GET /api/agent
  getAll: () =>
    api.get<RawAgent[]>(base).then((r) => r.data.map(normalize)),

  // GET /api/agent/{id}
  getById: (id: string) =>
    api.get<RawAgent>(byId(id)).then((r) => normalize(r.data)),

  // POST /api/agent
  create: (data: Omit<AIAgent, "id">) =>
    api.post<RawAgent>(base, data).then((r) => normalize(r.data)),

  // PUT /api/agent/{id}
  update: (id: string, data: Omit<AIAgent, "id">) =>
    api.put<RawAgent>(byId(id), data).then((r) => normalize(r.data)),

  // DELETE /api/agent/{id}
  delete: (id: string) =>
    api.delete(byId(id)).then((r) => r.data),
};
