import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface Customer {
  id?: string | number;
  name: string;
  email: string;
  phone?: string;
  total_calls?: number;
  last_call?: string;
  status?: string;
}

const { base, byId } = API_ROUTES.customers;

export const customersService = {
  // GET /api/customers
  getAll: () =>
    api.get<Customer[]>(base).then((r) => r.data),

  // GET /api/customers/{id}
  getById: (id: string) =>
    api.get<Customer>(byId(id)).then((r) => r.data),

  // POST /api/customers  { name, email, phone }
  create: (data: Pick<Customer, "name" | "email" | "phone">) =>
    api.post<Customer>(base, data).then((r) => r.data),

  // PUT /api/customers/{id}  { name, email, phone }
  update: (id: string, data: Pick<Customer, "name" | "email" | "phone">) =>
    api.put<Customer>(byId(id), data).then((r) => r.data),

  // DELETE /api/customers/{id}
  delete: (id: string) =>
    api.delete(byId(id)).then((r) => r.data),
};
