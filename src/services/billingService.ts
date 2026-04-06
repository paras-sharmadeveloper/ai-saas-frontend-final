import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
}

export interface Invoice {
  id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
  downloadUrl?: string;
}

const { base, plans, invoices, byId } = API_ROUTES.billing;

export const billingService = {
  getBilling: () =>
    api.get(base).then((r) => r.data),

  getPlans: () =>
    api.get<BillingPlan[]>(plans).then((r) => r.data),

  getInvoices: () =>
    api.get<Invoice[]>(invoices).then((r) => r.data),

  updateBilling: (id: string, data: Partial<BillingPlan>) =>
    api.patch(byId(id), data).then((r) => r.data),
};
