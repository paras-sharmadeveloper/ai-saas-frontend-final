import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface PhoneNumber {
  id?: string;
  number: string;
  label?: string;
  assignedAgentId?: string;
  status: "active" | "inactive";
  createdAt?: string;
}

const { base, byId } = API_ROUTES.phoneNumbers;

export const phoneNumbersService = {
  getAll: () =>
    api.get<PhoneNumber[]>(base).then((r) => r.data),

  getById: (id: string) =>
    api.get<PhoneNumber>(byId(id)).then((r) => r.data),

  create: (data: Omit<PhoneNumber, "id" | "createdAt">) =>
    api.post<PhoneNumber>(base, data).then((r) => r.data),

  update: (id: string, data: PhoneNumber) =>
    api.put<PhoneNumber>(byId(id), data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(byId(id)).then((r) => r.data),
};
